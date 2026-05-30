/**
 * Vercel Serverless Function – proxy pro SÚKL data o výpadcích léků
 *
 * Stáhne ZIP archiv z opendata.sukl.cz, rozbalí mr_hlaseni.csv,
 * vyfiltruje aktivní přerušení dodávek a vrátí JSON.
 *
 * Voláno frontendem jako: GET /api/sukl-vypadky
 *
 * Kódování SÚKL: Windows-1250
 * Oddělovač CSV: středník (;)
 * Klíčové sloupce:
 *   TYP_OZNAMENI          – "preruseni" / "zahajeni" / "ukonceni" / "obnoveni"
 *   POSLEDNI_PLATNE_HLASENI – "ANO" / ""
 *   NAZEV                 – název přípravku
 *   TERMIN_OBNOVENI       – datum DD.MM.YYYY nebo prázdné
 *   DUVOD_PRERUSENI_UKONCENI – důvod
 */

import https from 'https'
import { unzipSync } from 'fflate'

const SUKL_ZIP_URL = 'https://opendata.sukl.cz/soubory/MR/mr.zip'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hodina

// Jednoduchá in-memory cache (platí po dobu lifecycle instance)
let cache = null
let cacheTime = 0

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} při stahování SÚKL ZIP`))
        return
      }
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function win1250ToUtf8(buffer) {
  // Mapovací tabulka Win-1250 → Unicode pro znaky 0x80–0xFF
  const map = [
    0x20AC,0xFFFD,0x201A,0xFFFD,0x201E,0x2026,0x2020,0x2021,
    0xFFFD,0x2030,0x0160,0x2039,0x015A,0x0164,0x017D,0x0179,
    0xFFFD,0x2018,0x2019,0x201C,0x201D,0x2022,0x2013,0x2014,
    0xFFFD,0x2122,0x0161,0x203A,0x015B,0x0165,0x017E,0x017A,
    0x00A0,0x02C7,0x02D8,0x0141,0x00A4,0x0104,0x00A6,0x00A7,
    0x00A8,0x00A9,0x015E,0x00AB,0x00AC,0x00AD,0x00AE,0x017B,
    0x00B0,0x00B1,0x02DB,0x0142,0x00B4,0x00B5,0x00B6,0x00B7,
    0x00B8,0x0105,0x015F,0x00BB,0x013D,0x02DD,0x013E,0x017C,
    0x0154,0x00C1,0x00C2,0x0102,0x00C4,0x0139,0x0106,0x00C7,
    0x010C,0x00C9,0x0118,0x00CB,0x011A,0x00CD,0x00CE,0x010E,
    0x0110,0x0143,0x0147,0x00D3,0x00D4,0x0150,0x00D6,0x00D7,
    0x0158,0x016E,0x00DA,0x0170,0x00DC,0x00DD,0x0162,0x00DF,
    0x0155,0x00E1,0x00E2,0x0103,0x00E4,0x013A,0x0107,0x00E7,
    0x010D,0x00E9,0x0119,0x00EB,0x011B,0x00ED,0x00EE,0x010F,
    0x0111,0x0144,0x0148,0x00F3,0x00F4,0x0151,0x00F6,0x00F7,
    0x0159,0x016F,0x00FA,0x0171,0x00FC,0x00FD,0x0163,0x02D9
  ]
  let result = ''
  for (let i = 0; i < buffer.length; i++) {
    const b = buffer[i]
    if (b < 0x80) {
      result += String.fromCharCode(b)
    } else {
      result += String.fromCharCode(map[b - 0x80] || 0xFFFD)
    }
  }
  return result
}

function parseCsv(text) {
  const radky = text.split('\n')
  if (radky.length < 2) return []

  // Záhlaví – odstraň BOM a uvozovky
  const hlavicka = radky[0]
    .replace(/^﻿/, '')
    .split(';')
    .map(h => h.replace(/"/g, '').trim())

  const idx = {
    posledni:   hlavicka.indexOf('POSLEDNI_PLATNE_HLASENI'),
    nazev:      hlavicka.indexOf('NAZEV'),
    atc:        hlavicka.indexOf('ATC'),
    typ:        hlavicka.indexOf('TYP_OZNAMENI'),
    obnoveni:   hlavicka.indexOf('TERMIN_OBNOVENI'),
    duvod:      hlavicka.indexOf('DUVOD_PRERUSENI_UKONCENI'),
    kodSukl:    hlavicka.indexOf('KOD_SUKL'),
  }

  const dnes = new Date()
  dnes.setHours(0, 0, 0, 0)

  const vypadky = []

  for (let i = 1; i < radky.length; i++) {
    const radek = radky[i].trim()
    if (!radek) continue

    const sloupce = radek.split(';').map(s => s.replace(/"/g, '').trim())

    const typ = sloupce[idx.typ] || ''
    if (typ !== 'preruseni') continue

    // Jen poslední platné hlášení
    const posledni = sloupce[idx.posledni] || ''
    if (posledni !== 'ANO') continue

    // Zjistit zda je výpadek stále aktivní
    const obnoveniText = idx.obnoveni !== -1 ? sloupce[idx.obnoveni] : ''
    let jeAktivni = false
    let datumFormatovane = 'Termín neurčen'

    if (!obnoveniText) {
      jeAktivni = true
    } else {
      const casti = obnoveniText.split('.')
      if (casti.length === 3) {
        const d = new Date(
          parseInt(casti[2]),
          parseInt(casti[1]) - 1,
          parseInt(casti[0])
        )
        if (d >= dnes) {
          jeAktivni = true
          datumFormatovane = obnoveniText
        }
      }
    }

    if (!jeAktivni) continue

    vypadky.push({
      kodSukl:  sloupce[idx.kodSukl] || '',
      nazev:    sloupce[idx.nazev] || '',
      atc:      sloupce[idx.atc] || '',
      obnoveni: datumFormatovane,
      duvod:    idx.duvod !== -1 ? sloupce[idx.duvod] : ''
    })
  }

  return vypadky
}

export default async function handler(req, res) {
  // CORS hlavičky – povolíme frontendovou doménu
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    // In-memory cache
    if (cache && Date.now() - cacheTime < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT')
      return res.status(200).json(cache)
    }

    // Stáhni ZIP
    const zipBuffer = await fetchBuffer(SUKL_ZIP_URL)

    // Rozbal ZIP pomocí fflate
    const unzipped = unzipSync(new Uint8Array(zipBuffer))
    const csvBuffer = unzipped['mr_hlaseni.csv']

    if (!csvBuffer) {
      throw new Error('mr_hlaseni.csv nenalezen v ZIP archivu')
    }

    // Dekóduj Windows-1250 → UTF-8
    const csvText = win1250ToUtf8(Buffer.from(csvBuffer))

    // Parsuj a vyfiltruj aktivní výpadky
    const vypadky = parseCsv(csvText)

    // Ulož do cache
    cache = { vypadky, aktualizovano: new Date().toISOString() }
    cacheTime = Date.now()

    res.setHeader('X-Cache', 'MISS')
    res.setHeader('X-Vypadky-Count', vypadky.length)
    return res.status(200).json(cache)

  } catch (err) {
    console.error('SÚKL API chyba:', err.message)
    return res.status(502).json({
      chyba: 'Nepodařilo se načíst data ze SÚKL',
      detail: err.message
    })
  }
}
