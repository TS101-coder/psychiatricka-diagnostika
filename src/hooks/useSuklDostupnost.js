/**
 * Hook pro živé ověření výpadků léků ze SÚKL
 *
 * Volá serverless funkci /api/sukl-vypadky která:
 *   - Stáhne ZIP ze SÚKL (řeší CORS na straně serveru)
 *   - Vrátí JSON s aktivními výpadky: { vypadky: [{nazev, kodSukl, atc, obnoveni, duvod}] }
 *
 * Cache: SessionStorage (platí po dobu jedné relace prohlížeče)
 */
import { useState, useEffect, useRef } from 'react'

const API_URL = '/api/sukl-vypadky'
const CACHE_KEY = 'sukl_vypadky_v2'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hodina

// Normalizace textu – bez diakritiky, malá písmena
function normalizuj(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

// Globální promise sdílený mezi instancemi hooku (jen jedno volání naráz)
let globalniNacitani = null

async function nactiVypadky() {
  // Zkontroluj SessionStorage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const { timestamp, data } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_TTL_MS) {
        return data // pole výpadků
      }
    }
  } catch (_) {}

  // Volej serverless funkci
  const response = await fetch(API_URL)
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.chyba || `HTTP ${response.status}`)
  }

  const json = await response.json()
  const vypadky = json.vypadky || []

  // Ulož do SessionStorage
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: vypadky
    }))
  } catch (_) {}

  return vypadky
}

/**
 * Hook: vrátí stav dostupnosti pro seznam generik
 *
 * @param {string[]} generika
 * @returns {{ stavDostupnosti, nacitam, chyba }}
 *
 * stavDostupnosti[generikum] = { maVypadek: bool, obnoveni: string, duvod: string }
 */
export function useSuklDostupnost(generika) {
  const [stavDostupnosti, setStavDostupnosti] = useState({})
  const [nacitam, setNacitam] = useState(false)
  const [chyba, setChyba] = useState(null)
  const klicRef = useRef(null)

  useEffect(() => {
    if (!generika || generika.length === 0) return

    const klic = [...generika].sort().join('|')
    if (klicRef.current === klic) return
    klicRef.current = klic

    setNacitam(true)
    setChyba(null)

    if (!globalniNacitani) {
      globalniNacitani = nactiVypadky().finally(() => {
        globalniNacitani = null
      })
    }

    globalniNacitani
      .then(vypadky => {
        // Pro každé generikum hledáme shodu v názvech výpadků ze SÚKL
        const result = {}
        for (const generikum of generika) {
          const normGen = normalizuj(generikum)

          const nalezeny = vypadky.find(v => {
            const normNazev = normalizuj(v.nazev)
            // Shoda pokud název léku obsahuje název generika nebo naopak
            return normNazev.includes(normGen) || normGen.includes(normNazev.split(' ')[0])
          })

          result[generikum] = nalezeny
            ? { maVypadek: true, obnoveni: nalezeny.obnoveni, duvod: nalezeny.duvod }
            : { maVypadek: false, obnoveni: null, duvod: null }
        }
        setStavDostupnosti(result)
      })
      .catch(err => {
        console.warn('SÚKL dostupnost:', err.message)
        setChyba('SÚKL data dočasně nedostupná')
        const result = {}
        generika.forEach(g => { result[g] = { maVypadek: false, obnoveni: null, duvod: null } })
        setStavDostupnosti(result)
      })
      .finally(() => setNacitam(false))

  }, [generika?.join('|')]) // eslint-disable-line

  return { stavDostupnosti, nacitam, chyba }
}
