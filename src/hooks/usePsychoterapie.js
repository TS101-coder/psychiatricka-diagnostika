import { useMemo } from 'react'
import psychoData from '../data/psychotherapyGuidelines.json'

/**
 * Vrátí psychoterapeutické guidelines pro daný MKN-10 kód.
 * Hledá přesnou shodu kódu nebo shodu v alternativních kódech.
 */
export function usePsychoterapie(kodMkn10) {
  return useMemo(() => {
    if (!kodMkn10) return null
    return psychoData.find(d =>
      d.kod_mkn10 === kodMkn10 ||
      (d.alternativni_kody || []).includes(kodMkn10)
    ) || null
  }, [kodMkn10])
}
