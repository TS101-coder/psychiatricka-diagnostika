export function getKategorieBarva(kategorie) {
  if (kategorie.includes('F00') || kategorie.includes('Organické')) return 'blue'
  if (kategorie.includes('F10') || kategorie.includes('psychoaktivními')) return 'orange'
  if (kategorie.includes('F20') || kategorie.includes('Schizofrenie') || kategorie.includes('psychotické')) return 'purple'
  if (kategorie.includes('F30') || kategorie.includes('Afektivní')) return 'yellow'
  if (kategorie.includes('F40') || kategorie.includes('Neurotické')) return 'green'
  if (kategorie.includes('F50') || kategorie.includes('Behaviorální')) return 'pink'
  if (kategorie.includes('F60') || kategorie.includes('Poruchy osobnosti')) return 'red'
  if (kategorie.includes('F70') || kategorie.includes('Mentální retardace')) return 'gray'
  if (kategorie.includes('F80') || kategorie.includes('vývoje')) return 'teal'
  if (kategorie.includes('F90') || kategorie.includes('dětství')) return 'indigo'
  return 'gray'
}

export const BARVA_CLASSES = {
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-800',   border: 'border-blue-300',   badge: 'bg-blue-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-300', badge: 'bg-orange-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', badge: 'bg-purple-500' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', badge: 'bg-yellow-500' },
  green:  { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  badge: 'bg-green-500' },
  pink:   { bg: 'bg-pink-100',   text: 'text-pink-800',   border: 'border-pink-300',   badge: 'bg-pink-500' },
  red:    { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-300',    badge: 'bg-red-500' },
  gray:   { bg: 'bg-gray-100',   text: 'text-gray-800',   border: 'border-gray-300',   badge: 'bg-gray-500' },
  teal:   { bg: 'bg-teal-100',   text: 'text-teal-800',   border: 'border-teal-300',   badge: 'bg-teal-500' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300', badge: 'bg-indigo-500' },
}

export function highlightText(text, query) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>')
}

export function vyhledej(diagnozy, dotaz) {
  if (!dotaz.trim()) return diagnozy
  const q = dotaz.toLowerCase().trim()
  return diagnozy.filter(d =>
    d.kod.toLowerCase().includes(q) ||
    d.nazev_cz.toLowerCase().includes(q) ||
    (d.popis && d.popis.toLowerCase().includes(q)) ||
    (d.priznaky && d.priznaky.some(p => p.toLowerCase().includes(q))) ||
    (d.kategorie && d.kategorie.toLowerCase().includes(q))
  )
}

// Finds shared and unique symptoms using normalized word overlap
function normalizuj(text) {
  return text.toLowerCase().replace(/[,;.()]/g, '').trim()
}

function similarne(p1, p2) {
  const w1 = normalizuj(p1).split(/\s+/)
  const w2 = normalizuj(p2).split(/\s+/)
  // consider similar if they share a meaningful word (length >= 4)
  return w1.some(w => w.length >= 4 && w2.some(w2w => w2w.includes(w) || w.includes(w2w)))
}

// Main comparison function — accepts array of 2 or 3 diagnoses
export function porovnejDiagnozy(diagnozy) {
  // backwards compat: also accept two separate args
  if (!Array.isArray(diagnozy)) {
    const [a, b] = [...arguments]
    diagnozy = [a, b]
  }

  const n = diagnozy.length // 2 or 3
  const priznakyAll = diagnozy.map(d => d.priznaky || [])

  // Symptoms shared by ALL diagnoses
  const shodne = priznakyAll[0].filter(p =>
    priznakyAll.slice(1).every(list => list.some(bp => similarne(p, bp)))
  )

  // Symptoms unique to each diagnosis (not similar to any in the others)
  const odlisne = priznakyAll.map((list, i) =>
    list.filter(p =>
      priznakyAll.every((otherList, j) =>
        j === i || !otherList.some(bp => similarne(p, bp))
      )
    )
  )

  // Clinical comparison table rows — values per diagnosis
  const srovnaniRows = []

  const hasOnset = diagnozy.some(d => d.onset)
  if (hasOnset) {
    srovnaniRows.push({
      rys: 'Onset / Nástup',
      hodnoty: diagnozy.map(d => d.onset || 'Neuvedeno'),
    })
  }

  const hasProb = diagnozy.some(d => d.prubeh)
  if (hasProb) {
    srovnaniRows.push({
      rys: 'Průběh',
      hodnoty: diagnozy.map(d => d.prubeh || 'Neuvedeno'),
    })
  }

  const uniqueKat = new Set(diagnozy.map(d => d.kategorie))
  if (uniqueKat.size > 1) {
    srovnaniRows.push({
      rys: 'Diagnostická skupina',
      hodnoty: diagnozy.map(d => d.kategorie),
    })
  }

  // Unique diagnostic criteria per diagnosis (not similar to any in others)
  const kriteriaAll = diagnozy.map(d => d.diagnosticka_kriteria || [])
  const unikatniKriteria = kriteriaAll.map((list, i) =>
    list.filter(k =>
      kriteriaAll.every((otherList, j) =>
        j === i || !otherList.some(kb => similarne(k, kb))
      )
    ).slice(0, 4)
  )

  return { shodne, odlisne, srovnaniRows, unikatniKriteria, n }
}
