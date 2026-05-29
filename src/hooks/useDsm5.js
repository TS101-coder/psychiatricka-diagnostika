import { useMemo } from 'react'
import dsm5Data from '../data/dsm5.json'

export function useDsm5() {
  return useMemo(() => dsm5Data, [])
}

export function useDsm5Code(id) {
  return useMemo(() => dsm5Data.find(d => d.id === id), [id])
}

export function useDsm5Chapters() {
  return useMemo(() => {
    const seen = new Set()
    const chapters = []
    for (const d of dsm5Data) {
      if (!d.chapter || seen.has(d.chapter)) continue
      seen.add(d.chapter)
      chapters.push(d.chapter)
    }
    return chapters
  }, [])
}

export const DSM5_CHAPTER_COLORS = {
  'Neurodevelopmental Disorders': 'indigo',
  'Schizophrenia Spectrum and Other Psychotic Disorders': 'purple',
  'Bipolar and Related Disorders': 'yellow',
  'Depressive Disorders': 'amber',
  'Anxiety Disorders': 'green',
  'Obsessive-Compulsive and Related Disorders': 'teal',
  'Trauma- and Stressor-Related Disorders': 'cyan',
  'Dissociative Disorders': 'sky',
  'Somatic Symptom and Related Disorders': 'rose',
  'Feeding and Eating Disorders': 'pink',
  'Elimination Disorders': 'orange',
  'Sleep-Wake Disorders': 'blue',
  'Sexual Dysfunctions': 'red',
  'Gender Dysphoria': 'violet',
  'Disruptive, Impulse-Control, and Conduct Disorders': 'lime',
  'Substance-Related and Addictive Disorders': 'orange',
  'Neurocognitive Disorders': 'blue',
  'Personality Disorders': 'red',
  'Paraphilic Disorders': 'gray',
  'Other Mental Disorders and Additional Codes': 'slate',
  'Other': 'gray',
}

export const DSM5_COLOR_CLASSES = {
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

export function getDsm5Color(chapter) {
  return DSM5_CHAPTER_COLORS[chapter] || 'gray'
}
