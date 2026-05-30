import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import https from 'https'
import { unzipSync } from 'fflate'

// ── Pomocné funkce pro zpracování SÚKL dat ──────────────────────────────────

function win1250ToUtf8(buffer) {
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
    result += b < 0x80
      ? String.fromCharCode(b)
      : String.fromCharCode(map[b - 0x80] || 0xFFFD)
  }
  return result
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function parseCsv(text) {
  const radky = text.split('\n')
  if (radky.length < 2) return []
  const hdr = radky[0].replace(/^﻿/, '').split(';').map(h => h.replace(/"/g, '').trim())
  const idx = {
    posledni: hdr.indexOf('POSLEDNI_PLATNE_HLASENI'),
    nazev:    hdr.indexOf('NAZEV'),
    atc:      hdr.indexOf('ATC'),
    typ:      hdr.indexOf('TYP_OZNAMENI'),
    obnoveni: hdr.indexOf('TERMIN_OBNOVENI'),
    duvod:    hdr.indexOf('DUVOD_PRERUSENI_UKONCENI'),
    kod:      hdr.indexOf('KOD_SUKL'),
  }
  const dnes = new Date(); dnes.setHours(0, 0, 0, 0)
  const vypadky = []
  for (let i = 1; i < radky.length; i++) {
    const r = radky[i].trim(); if (!r) continue
    const s = r.split(';').map(c => c.replace(/"/g, '').trim())
    if (s[idx.typ] !== 'preruseni') continue
    if (s[idx.posledni] !== 'ANO') continue
    const ob = s[idx.obnoveni] || ''
    let aktivni = false; let datum = 'Termín neurčen'
    if (!ob) {
      aktivni = true
    } else {
      const p = ob.split('.')
      if (p.length === 3) {
        const d = new Date(+p[2], +p[1] - 1, +p[0])
        if (d >= dnes) { aktivni = true; datum = ob }
      }
    }
    if (!aktivni) continue
    vypadky.push({
      kodSukl: s[idx.kod] || '',
      nazev:   s[idx.nazev] || '',
      atc:     s[idx.atc] || '',
      obnoveni: datum,
      duvod:   s[idx.duvod] || ''
    })
  }
  return vypadky
}

// In-memory cache pro dev server
let devCache = null
let devCacheTime = 0
const CACHE_TTL = 60 * 60 * 1000

// ── Plugin: dev API middleware pro /api/sukl-vypadky ────────────────────────
function suklApiPlugin() {
  return {
    name: 'sukl-api',
    // configureServer je plugin hook – musí být uvnitř plugin objektu
    configureServer(server) {
      server.middlewares.use('/api/sukl-vypadky', async (req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')
        try {
          if (devCache && Date.now() - devCacheTime < CACHE_TTL) {
            res.end(JSON.stringify(devCache))
            return
          }
          console.log('[SÚKL] Stahuji data ze SÚKL (mr.zip)...')
          const zipBuf = await fetchBuffer('https://opendata.sukl.cz/soubory/MR/mr.zip')
          const unzipped = unzipSync(new Uint8Array(zipBuf))
          const csvBuf = unzipped['mr_hlaseni.csv']
          if (!csvBuf) throw new Error('mr_hlaseni.csv nenalezen v ZIP')
          const csvText = win1250ToUtf8(Buffer.from(csvBuf))
          const vypadky = parseCsv(csvText)
          devCache = { vypadky, aktualizovano: new Date().toISOString() }
          devCacheTime = Date.now()
          console.log(`[SÚKL] OK – ${vypadky.length} aktivních výpadků`)
          res.end(JSON.stringify(devCache))
        } catch (err) {
          console.error('[SÚKL] Chyba:', err.message)
          res.statusCode = 502
          res.end(JSON.stringify({ chyba: err.message }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), suklApiPlugin()],
})
