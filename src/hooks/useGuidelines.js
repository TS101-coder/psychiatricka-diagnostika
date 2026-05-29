import { useMemo } from 'react'
import guidelinesData from '../data/guidelines.json'

export function useGuidelines(kodMkn10) {
  return useMemo(
    () => guidelinesData.find(g => g.kod_mkn10 === kodMkn10) || null,
    [kodMkn10]
  )
}
