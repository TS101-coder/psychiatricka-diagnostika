import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDsm5, useDsm5Chapters, getDsm5Color, DSM5_COLOR_CLASSES } from '../hooks/useDsm5'

export default function Dsm5Home() {
  const navigate = useNavigate()
  const all = useDsm5()
  const chapters = useDsm5Chapters()
  const [query, setQuery] = useState('')
  const [selectedChapter, setSelectedChapter] = useState('')

  const filtered = useMemo(() => {
    return all.filter(d => {
      const matchChapter = !selectedChapter || d.chapter === selectedChapter
      const q = query.toLowerCase()
      const matchQuery = !q ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        (d.description || '').toLowerCase().includes(q)
      return matchChapter && matchQuery
    })
  }, [all, query, selectedChapter])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-900">DSM-5-TR</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium border border-blue-200">
            APA 2022
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision
          — {all.length} diagnóz ve {chapters.length} kapitolách
        </p>
      </div>

      {/* Vyhledávání */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Hledat diagnózu nebo kód (F20.9, Schizophrenia...)"
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedChapter}
          onChange={e => setSelectedChapter(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
        >
          <option value="">Všechny kapitoly</option>
          {chapters.map(ch => (
            <option key={ch} value={ch}>{ch}</option>
          ))}
        </select>
      </div>

      {/* Chapter overview when no search */}
      {!query && !selectedChapter && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {chapters.map(ch => {
            const count = all.filter(d => d.chapter === ch).length
            const color = getDsm5Color(ch)
            const bc = DSM5_COLOR_CLASSES[color] || DSM5_COLOR_CLASSES.gray
            return (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`text-left p-3 rounded-lg border-2 ${bc.border} ${bc.bg} hover:shadow-md transition-all`}
              >
                <div className={`text-xs font-bold uppercase tracking-wide ${bc.text} mb-1`}>
                  {count} diagnóz
                </div>
                <div className="text-sm font-semibold text-slate-800 leading-snug">{ch}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* Results */}
      {(query || selectedChapter) && (
        <div>
          <p className="text-sm text-slate-500 mb-3">Nalezeno: {filtered.length} diagnóz</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(d => {
              const color = getDsm5Color(d.chapter)
              const bc = DSM5_COLOR_CLASSES[color] || DSM5_COLOR_CLASSES.gray
              return (
                <div
                  key={d.id}
                  onClick={() => navigate(`/dsm5/${d.id}`)}
                  className="bg-white rounded-lg border-2 border-slate-200 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer p-4"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded shrink-0 ${bc.bg} ${bc.text}`}>
                      {d.code}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">{d.chapter}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 mb-1 leading-tight">{d.name}</h3>
                  {d.description && (
                    <p className="text-xs text-slate-500 line-clamp-2">{d.description}</p>
                  )}
                  {d.diagnostic_criteria?.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-slate-400">{d.diagnostic_criteria.length} diagnostická kritéria</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
