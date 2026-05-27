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

export function porovnejDiagnozy(a, b) {
  const priznakyA = a.priznaky || []
  const priznakyB = b.priznaky || []

  const shodne = priznakyA.filter(p => priznakyB.some(bp => similarne(p, bp)))
  const shodneB = new Set(priznakyB.filter(p => priznakyA.some(ap => similarne(p, ap))))

  const odlisneA = priznakyA.filter(p => !shodne.includes(p))
  const odlisneB = priznakyB.filter(p => !shodneB.has(p))

  // Structured clinical comparison rows — each row is one observable clinical dimension
  const srovnani = []

  if (a.onset || b.onset) {
    srovnani.push({
      rys: 'Onset / Nástup',
      hodnotaA: a.onset || 'Neuvedeno',
      hodnotaB: b.onset || 'Neuvedeno',
    })
  }

  if (a.prubeh || b.prubeh) {
    srovnani.push({
      rys: 'Průběh',
      hodnotaA: a.prubeh || 'Neuvedeno',
      hodnotaB: b.prubeh || 'Neuvedeno',
    })
  }

  if (a.kategorie !== b.kategorie) {
    srovnani.push({
      rys: 'Diagnostická skupina',
      hodnotaA: a.kategorie,
      hodnotaB: b.kategorie,
    })
  }

  // Pull up to 3 diagnostická kritéria unique to each diagnosis for clinical contrast
  const kriteriaA = (a.diagnosticka_kriteria || [])
  const kriteriaB = (b.diagnosticka_kriteria || [])
  const unikatniKriteriaA = kriteriaA.filter(k => !kriteriaB.some(kb => similarne(k, kb))).slice(0, 4)
  const unikatniKriteriaB = kriteriaB.filter(k => !kriteriaA.some(ka => similarne(k, ka))).slice(0, 4)

  return { shodne, odlisneA, odlisneB, srovnani, unikatniKriteriaA, unikatniKriteriaB }
}
