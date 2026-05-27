import { useMemo } from 'react'
import mkn10Data from '../data/mkn10.json'
import mappingData from '../data/mapping.json'

export function useDiagnozy() {
  return useMemo(() => mkn10Data, [])
}

export function useKategorie() {
  return useMemo(() => mappingData.kategorie, [])
}

export function useDiagnoza(id) {
  return useMemo(() => mkn10Data.find(d => d.id === id), [id])
}
