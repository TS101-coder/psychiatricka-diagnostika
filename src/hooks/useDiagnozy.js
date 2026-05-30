import { useMemo } from 'react'
import mkn10Data from '../data/mkn10.json'
import mappingData from '../data/mapping.json'
import PRIZNAKY_KLICE from '../data/priznakyKlice.js'

// Obohacení každé diagnózy o pole priznakyKlice ze samostatného mapovacího souboru.
// Diagnózy bez záznamu dostanou prázdné pole (bezpečné pro ComparisonMatrix).
const mkn10WithKeys = mkn10Data.map(d => ({
  ...d,
  priznakyKlice: PRIZNAKY_KLICE[d.id] || [],
}))

export function useDiagnozy() {
  return useMemo(() => mkn10WithKeys, [])
}

export function useKategorie() {
  return useMemo(() => mappingData.kategorie, [])
}

export function useDiagnoza(id) {
  return useMemo(() => mkn10WithKeys.find(d => d.id === id), [id])
}
