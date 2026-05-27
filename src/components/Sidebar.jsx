import { NavLink, useNavigate } from 'react-router-dom'
import { useKategorie, useDiagnozy } from '../hooks/useDiagnozy'
import { BARVA_CLASSES } from '../utils/helpers'
import { useState } from 'react'

const BARVA_MAP = {
  blue: 'bg-blue-500', orange: 'bg-orange-500', purple: 'bg-purple-500',
  yellow: 'bg-yellow-500', green: 'bg-green-500', pink: 'bg-pink-500',
  red: 'bg-red-500', gray: 'bg-slate-400', teal: 'bg-teal-500', indigo: 'bg-indigo-500'
}

export default function Sidebar({ open }) {
  const kategorie = useKategorie()
  const diagnozy = useDiagnozy()
  const navigate = useNavigate()
  const [rozbalena, setRozbalena] = useState(null)

  if (!open) return null

  function diagnozyKategorie(rozsah) {
    const [od, do_] = rozsah.split('-')
    return diagnozy.filter(d => {
      const num = parseInt(d.kod.replace('F', ''))
      const odNum = parseInt(od.replace('F', ''))
      const doNum = do_ ? parseInt(do_.replace('F', '')) : odNum
      return num >= odNum && num <= doNum && d.kod.length <= 3
    })
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full overflow-hidden no-print shrink-0">
      <div className="p-4 border-b border-slate-100">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Přehled
        </NavLink>
      </div>

      <div className="p-4 border-b border-slate-100">
        <NavLink
          to="/diferencialni"
          className={({ isActive }) =>
            `flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'}`
          }
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Diferenciální diagnostika
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          MKN-10 kategorie
        </div>
        {kategorie.map(kat => {
          const barva = BARVA_MAP[kat.barva] || 'bg-slate-400'
          const jeRozbalena = rozbalena === kat.rozsah
          const podDiagnozy = diagnozyKategorie(kat.rozsah)

          return (
            <div key={kat.rozsah}>
              <button
                onClick={() => setRozbalena(jeRozbalena ? null : kat.rozsah)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 group"
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${barva}`} />
                <span className="text-xs text-slate-600 font-medium flex-1 leading-tight">{kat.nazev}</span>
                <span className="text-xs text-slate-400">{kat.rozsah}</span>
                <svg
                  className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${jeRozbalena ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {jeRozbalena && (
                <div className="pl-4 border-l-2 border-slate-100 ml-4">
                  {podDiagnozy.map(d => (
                    <button
                      key={d.id}
                      onClick={() => navigate(`/diagnoza/${d.id}`)}
                      className="w-full text-left px-2 py-1.5 text-xs text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded flex items-center gap-2"
                    >
                      <span className="font-mono text-slate-400 shrink-0">{d.kod}</span>
                      <span className="truncate">{d.nazev_cz}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
