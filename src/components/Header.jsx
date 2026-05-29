import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vyhledej } from '../utils/helpers'
import { useDiagnozy } from '../hooks/useDiagnozy'

export default function Header({ onMenuClick }) {
  const [dotaz, setDotaz] = useState('')
  const [vysledky, setVysledky] = useState([])
  const [otevreno, setOtevreno] = useState(false)
  const diagnozy = useDiagnozy()
  const navigate = useNavigate()

  function handleHledani(e) {
    const q = e.target.value
    setDotaz(q)
    if (q.length >= 2) {
      setVysledky(vyhledej(diagnozy, q).slice(0, 8))
      setOtevreno(true)
    } else {
      setVysledky([])
      setOtevreno(false)
    }
  }

  function handleVybrat(diagnoza) {
    navigate(`/diagnoza/${diagnoza.id}`)
    setDotaz('')
    setOtevreno(false)
  }

  return (
    <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 no-print">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
        aria-label="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-bold">Dx</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-slate-900 leading-tight">Psychiatrická diagnostika</h1>
          <p className="text-xs text-slate-500">MKN-10 / MKN-11</p>
        </div>
      </div>

      <div className="flex-1 max-w-xl relative">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Hledat diagnózu (kód, název, příznak)..."
            value={dotaz}
            onChange={handleHledani}
            onBlur={() => setTimeout(() => setOtevreno(false), 200)}
            onFocus={() => dotaz.length >= 2 && setOtevreno(true)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {otevreno && vysledky.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {vysledky.map(d => (
              <button
                key={d.id}
                onMouseDown={() => handleVybrat(d)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-slate-100 last:border-0 flex items-center gap-3"
              >
                <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">{d.kod}</span>
                <span className="text-sm text-slate-800 truncate">{d.nazev_cz}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
