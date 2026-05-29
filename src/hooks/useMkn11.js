import { useMemo } from 'react'
import mkn11Data from '../data/mkn11.json'

// Vrátí všechny záznamy MKN-11
export function useMkn11() {
  return useMemo(() => mkn11Data, [])
}

// Vrátí jeden záznam MKN-11 dle id
export function useMkn11Kod(id) {
  return useMemo(() => mkn11Data.find(d => d.id === id), [id])
}

// Vrátí unikátní kategorie MKN-11 s rozsahy
export function useMkn11Kategorie() {
  return useMemo(() => {
    const seen = new Set()
    const cats = []
    for (const d of mkn11Data) {
      if (!d.kategorie || seen.has(d.kategorie)) continue
      seen.add(d.kategorie)
      cats.push(d.kategorie)
    }
    return cats
  }, [])
}

// Barvy pro kategorie MKN-11
export const MKN11_BARVY = {
  'Neurovývojové poruchy': 'indigo',
  'Schizofrenie nebo jiné primární psychotické poruchy': 'purple',
  'Katatonie': 'violet',
  'Poruchy nálady – bipolární nebo příbuzné': 'yellow',
  'Poruchy nálady – depresivní': 'amber',
  'Poruchy nálady – specifikátory a průběh': 'orange',
  'Úzkostné poruchy nebo poruchy související se strachem': 'green',
  'Obsedantně-kompulzivní nebo příbuzné poruchy': 'teal',
  'Poruchy specificky spojené se stresem': 'cyan',
  'Disociativní poruchy': 'sky',
  'Poruchy příjmu potravy a stravovacího chování': 'pink',
  'Poruchy vylučování': 'rose',
  'Poruchy tělesné úzkosti nebo tělesných prožitků': 'red',
  'Poruchy způsobené užíváním návykových látek nebo návykovým chováním': 'orange',
  'Poruchy kontroly impulzů': 'lime',
  'Rušivé chování nebo disociální poruchy': 'yellow',
  'Poruchy osobnosti a související rysy': 'red',
  'Parafilní poruchy': 'gray',
  'Faktitivní porucha': 'slate',
  'Neurokognitivní poruchy': 'blue',
  'Sekundární duševní nebo behaviorální syndromy': 'slate',
  'Ostatní duševní, behaviorální nebo neurovývojové poruchy': 'gray',
}

export const MKN11_BARVA_CLASSES = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', badge: 'bg-indigo-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', badge: 'bg-purple-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-800', border: 'border-violet-300', badge: 'bg-violet-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', badge: 'bg-yellow-500' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-800',  border: 'border-amber-300',  badge: 'bg-amber-500'  },
  orange: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300', badge: 'bg-orange-500' },
  green:  { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-300',  badge: 'bg-green-500'  },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-300',   badge: 'bg-teal-500'   },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-800',   border: 'border-cyan-300',   badge: 'bg-cyan-500'   },
  sky:    { bg: 'bg-sky-50',    text: 'text-sky-800',    border: 'border-sky-300',    badge: 'bg-sky-500'    },
  pink:   { bg: 'bg-pink-50',   text: 'text-pink-800',   border: 'border-pink-300',   badge: 'bg-pink-500'   },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-800',   border: 'border-rose-300',   badge: 'bg-rose-500'   },
  red:    { bg: 'bg-red-50',    text: 'text-red-800',    border: 'border-red-300',    badge: 'bg-red-500'    },
  lime:   { bg: 'bg-lime-50',   text: 'text-lime-800',   border: 'border-lime-300',   badge: 'bg-lime-500'   },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-300',   badge: 'bg-blue-500'   },
  gray:   { bg: 'bg-gray-50',   text: 'text-gray-800',   border: 'border-gray-300',   badge: 'bg-gray-500'   },
  slate:  { bg: 'bg-slate-50',  text: 'text-slate-800',  border: 'border-slate-300',  badge: 'bg-slate-500'  },
}

export function getMkn11Barva(kategorie) {
  return MKN11_BARVY[kategorie] || 'gray'
}
