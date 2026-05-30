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
        // Pro každé generikum spočítáme VŠECHNY záznamy s výpadkem
        // (jeden INN může mít výpadky u více výrobců)
        const result = {}
        for (const generikum of generika) {
          const normGen = normalizuj(generikum)

          // Najdi VŠECHNY záznamy pro tuto látku (ne jen první)
          const shody = vypadky.filter(v => {
            const normNazev = normalizuj(v.nazev)
            // Název produktu ze SÚKL musí obsahovat INN jako celé slovo nebo prefix
            // Příklad: "sertralin" najde "SERTRALIN ARROW 50 MG", "SERTRALINUM AUROBINDO"
            // ale NE "sertralinum" při hledání "sertal" apod.
            return normNazev.includes(normGen)
          })

          // URL na SÚKL přehled léčiv (nový portál gov.cz)
          // SÚKL nepodporuje předvyplnění hledání přes URL – název se zkopíruje do schránky při kliknutí
          const suklUrl = 'https://prehledy.sukl.gov.cz/prehled_leciv.html#/'

          if (shody.length > 0) {
            // Seřaď: nejnovější obnovení první, neurčené nakonec
            const serazene = [...shody].sort((a, b) => {
              if (a.obnoveni === 'Termín neurčen') return 1
              if (b.obnoveni === 'Termín neurčen') return -1
              return a.obnoveni.localeCompare(b.obnoveni)
            })
            result[generikum] = {
              pocetVypadku: shody.length,
              nejblizsiObnoveni: serazene[0].obnoveni,
              vypadky: serazene.slice(0, 3), // max 3 pro tooltip
              suklUrl
            }
          } else {
            result[generikum] = { pocetVypadku: 0, suklUrl }
          }
        }
        setStavDostupnosti(result)
      })
      .catch(err => {
        console.warn('SÚKL dostupnost:', err.message)
        setChyba('SÚKL data dočasně nedostupná')
        const result = {}
        generika.forEach(g => {
          result[g] = {
            pocetVypadku: null, // null = neznámé (chyba načítání)
            suklUrl: 'https://prehledy.sukl.gov.cz/prehled_leciv.html#/'
          }
        })
        setStavDostupnosti(result)
      })
      .finally(() => setNacitam(false))

  }, [generika?.join('|')]) // eslint-disable-line

  return { stavDostupnosti, nacitam, chyba }
}
