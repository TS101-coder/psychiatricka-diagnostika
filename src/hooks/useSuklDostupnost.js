/**
 * Hook pro živé ověření výpadků léků ze SÚKL OpenData
 * Zdroj: https://opendata.sukl.cz/soubory/SOD_PRERUSENI_DODAVEK.csv
 *
 * Cache: SessionStorage (data platí po dobu jedné relace prohlížeče)
 */
import { useState, useEffect, useRef } from 'react'

const SUKL_CSV_URL = 'https://opendata.sukl.cz/soubory/SOD_PRERUSENI_DODAVEK.csv'
const CACHE_KEY = 'sukl_vypadky_cache'
const CACHE_PLATNOST_MS = 60 * 60 * 1000 // 1 hodina

// Normalizace textu – bez diakritiky, malá písmena
function normalizuj(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

// Parsování SÚKL CSV → mapa { normalizovaný_název_látky: { maVypadek, obnoveni, duvod } }
function parsujCsv(csvText) {
  const radky = csvText.split('\n')
  if (radky.length < 2) return new Map()

  // SÚKL používá středník jako oddělovač, první řádek je záhlaví
  const hlavicka = radky[0].split(';').map(h => h.replace(/['"]/g, '').trim())

  // Flexibilní hledání sloupců (názvy se mohou mírně lišit)
  const idxLatka   = hlavicka.findIndex(h => /nazev.latky|latka|nazev.ucl/i.test(h))
  const idxObnoveni = hlavicka.findIndex(h => /obnoveni|obnov/i.test(h))
  const idxDuvod   = hlavicka.findIndex(h => /duvod|pricina/i.test(h))

  if (idxLatka === -1) return new Map()

  const vypadky = new Map()
  const dnes = new Date()

  for (let i = 1; i < radky.length; i++) {
    const radek = radky[i]
    if (!radek.trim()) continue

    const sloupce = radek.split(';').map(s => s.replace(/['"]/g, '').trim())
    const latka = sloupce[idxLatka] || ''
    if (!latka) continue

    const klic = normalizuj(latka)
    const obnoveniText = idxObnoveni !== -1 ? (sloupce[idxObnoveni] || '') : ''
    const duvodText = idxDuvod !== -1 ? (sloupce[idxDuvod] || '') : ''

    // Zjistit, zda je výpadek stále aktivní
    let jeAktivni = false
    let datumFormatovane = 'Neurčeno'

    if (!obnoveniText) {
      jeAktivni = true
      datumFormatovane = 'Termín neurčen'
    } else {
      // SÚKL formát: DD.MM.YYYY
      const casti = obnoveniText.split('.')
      if (casti.length === 3) {
        const datum = new Date(
          parseInt(casti[2]),
          parseInt(casti[1]) - 1,
          parseInt(casti[0])
        )
        if (datum > dnes) {
          jeAktivni = true
          datumFormatovane = obnoveniText
        }
      }
    }

    if (jeAktivni && !vypadky.has(klic)) {
      vypadky.set(klic, {
        maVypadek: true,
        obnoveni: datumFormatovane,
        duvod: duvodText || undefined
      })
    }
  }

  return vypadky
}

// Globální promise sdílený mezi instancemi hooku (jen jedno stahování naráz)
let globalniNacitani = null

async function nactiVypadky() {
  // Zkontroluj cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { timestamp, data } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_PLATNOST_MS) {
        return new Map(data)
      }
    }
  } catch (_) {}

  // Stáhni ze SÚKL
  const response = await fetch(SUKL_CSV_URL, {
    headers: { Accept: 'text/csv,text/plain,*/*' }
  })
  if (!response.ok) throw new Error(`SÚKL HTTP ${response.status}`)

  // SÚKL používá Windows-1250, zkusíme přečíst jako latin1 (nejbližší dostupné)
  const buffer = await response.arrayBuffer()
  let text
  try {
    text = new TextDecoder('windows-1250').decode(buffer)
  } catch {
    text = new TextDecoder('utf-8').decode(buffer)
  }

  const mapa = parsujCsv(text)

  // Uložit do cache
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: [...mapa.entries()]
    }))
  } catch (_) {}

  return mapa
}

/**
 * Hook: vrátí stav dostupnosti pro seznam generik
 *
 * @param {string[]} generika - seznam názvů generických látek
 * @returns {{ stavDostupnosti: Object, nacitam: boolean, chyba: string|null }}
 *
 * stavDostupnosti = { [generikum]: { maVypadek: bool, obnoveni: string, duvod: string } }
 */
export function useSuklDostupnost(generika) {
  const [stavDostupnosti, setStavDostupnosti] = useState({})
  const [nacitam, setNacitam] = useState(false)
  const [chyba, setChyba] = useState(null)
  const klicRef = useRef(null)

  useEffect(() => {
    if (!generika || generika.length === 0) return

    // Zabránit zbytečnému re-fetchi pokud se seznam nezměnil
    const klic = generika.slice().sort().join('|')
    if (klicRef.current === klic) return
    klicRef.current = klic

    setNacitam(true)
    setChyba(null)

    // Sdílíme jediný promise přes záložky
    if (!globalniNacitani) {
      globalniNacitani = nactiVypadky().finally(() => {
        globalniNacitani = null
      })
    }

    globalniNacitani
      .then(vypadkyMapa => {
        const result = {}
        for (const generikum of generika) {
          const norm = normalizuj(generikum)
          // Hledáme shodu – generikum musí být obsaženo v názvu látky ze SÚKL
          let nalezeno = null
          for (const [klic, info] of vypadkyMapa) {
            if (klic.includes(norm) || norm.includes(klic)) {
              nalezeno = info
              break
            }
          }
          result[generikum] = nalezeno || { maVypadek: false, obnoveni: null, duvod: null }
        }
        setStavDostupnosti(result)
      })
      .catch(err => {
        console.warn('SÚKL dostupnost: nelze načíst data –', err.message)
        setChyba('Data SÚKL dočasně nedostupná')
        // Fallback – všechny léky "dostupné" (lepší než zobrazit chybu)
        const result = {}
        generika.forEach(g => { result[g] = { maVypadek: false, obnoveni: null, duvod: null } })
        setStavDostupnosti(result)
      })
      .finally(() => setNacitam(false))
  }, [generika?.join('|')])   // eslint-disable-line

  return { stavDostupnosti, nacitam, chyba }
}
