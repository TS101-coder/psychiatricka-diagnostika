import { NavLink, useNavigate } from 'react-router-dom'
import { useKategorie, useDiagnozy } from '../hooks/useDiagnozy'
import { useState } from 'react'

// Colour dots per category
const BARVA_MAP = {
  blue: 'bg-blue-500', orange: 'bg-orange-500', purple: 'bg-purple-500',
  yellow: 'bg-yellow-500', green: 'bg-green-500', pink: 'bg-pink-500',
  red: 'bg-red-500', gray: 'bg-slate-400', teal: 'bg-teal-500', indigo: 'bg-indigo-500'
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}

export default function Sidebar({ open }) {
  const kategorie = useKategorie()
  const diagnozy  = useDiagnozy()
  const navigate  = useNavigate()

  // Independent accordion: any number of categories and parent codes can be open at once
  const [openKat,   setOpenKat]   = useState(new Set())
  const [openRodic, setOpenRodic] = useState(new Set())

  if (!open) return null

  function toggleKat(rozsah) {
    setOpenKat(prev => {
      const next = new Set(prev)
      next.has(rozsah) ? next.delete(rozsah) : next.add(rozsah)
      return next
    })
  }

  function toggleRodic(id) {
    setOpenRodic(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // Parent codes (3-char: F00, F01 …) that belong to a category range
  function rodicoveKody(rozsah) {
    const [od, do_] = rozsah.split('-')
    const odNum = parseInt(od.replace('F', ''))
    const doNum = do_ ? parseInt(do_.replace('F', '')) : odNum
    return diagnozy.filter(d => {
      if (d.kod.includes('.')) return false   // skip subcodes
      const num = parseInt(d.kod.replace('F', ''))
      return num >= odNum && num <= doNum
    })
  }

  // Subcodes for a given parent (e.g. F01 → F01.0, F01.1 …)
  function subkody(kodrRodice) {
    return diagnozy.filter(d => d.id.startsWith(kodrRodice + '.'))
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden no-print shrink-0">

      {/* Home */}
      <div className="p-4 border-b border-slate-100">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Přehled
        </NavLink>
      </div>

      {/* Differential */}
      <div className="p-4 border-b border-slate-100">
        <NavLink
          to="/diferencialni"
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors
             ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Diferenciální diagnostika
        </NavLink>
      </div>

      {/* Category tree */}
      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          MKN-10 Kategorie
        </div>

        {kategorie.map(kat => {
          const barva     = BARVA_MAP[kat.barva] || 'bg-slate-400'
          const katOpen   = openKat.has(kat.rozsah)
          const rodice    = rodicoveKody(kat.rozsah)

          return (
            <div key={kat.rozsah}>

              {/* ── Level 1: category row ───────────────────────────────── */}
              <button
                onClick={() => toggleKat(kat.rozsah)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${barva}`} />
                <span className="text-xs text-slate-600 font-medium flex-1 leading-tight">{kat.nazev}</span>
                <span className="text-xs text-slate-400 font-mono">{kat.rozsah}</span>
                <ChevronIcon open={katOpen} />
              </button>

              {/* ── Level 2: parent codes ───────────────────────────────── */}
              {katOpen && (
                <div className="ml-3 border-l-2 border-slate-100">
                  {rodice.map(rod => {
                    const subs      = subkody(rod.id)
                    const hasSubs   = subs.length > 0
                    const rodOpen   = openRodic.has(rod.id)

                    return (
                      <div key={rod.id}>

                        {/* Parent code row */}
                        <div className="flex items-center group">
                          {/* Code + name → navigate to detail */}
                          <button
                            onClick={() => navigate(`/diagnoza/${rod.id}`)}
                            className="flex-1 flex items-center gap-2 pl-3 pr-1 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700 rounded-l"
                          >
                            <span className="font-mono text-xs text-slate-400 shrink-0">{rod.kod}</span>
                            <span className="text-xs text-slate-600 truncate leading-tight">{rod.nazev_cz}</span>
                          </button>

                          {/* Expand arrow (only when there are subcodes) */}
                          {hasSubs && (
                            <button
                              onClick={() => toggleRodic(rod.id)}
                              className="px-2 py-1.5 hover:bg-slate-100 rounded-r"
                              title="Zobrazit poddiagnózy"
                            >
                              <ChevronIcon open={rodOpen} />
                            </button>
                          )}
                        </div>

                        {/* ── Level 3: subcodes ─────────────────────────── */}
                        {hasSubs && rodOpen && (
                          <div className="ml-4 border-l-2 border-slate-100">
                            {subs.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => navigate(`/diagnoza/${sub.id}`)}
                                className="w-full flex items-center gap-2 pl-3 pr-2 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700 rounded"
                              >
                                <span className="font-mono text-xs text-slate-400 shrink-0 w-10">{sub.kod}</span>
                                <span className="text-xs text-slate-600 truncate leading-tight">{sub.nazev_cz}</span>
                              </button>
                            ))}
                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>
              )}

            </div>
          )
        })}
      </nav>
    </aside>
  )
}
