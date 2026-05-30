import { NavLink, useNavigate } from 'react-router-dom'
import { useKategorie, useDiagnozy } from '../hooks/useDiagnozy'
import { useMkn11, getMkn11Barva, MKN11_BARVA_CLASSES } from '../hooks/useMkn11'
import { useState, useMemo } from 'react'
import { KATEGORIE_SKAL, SKALY } from '../data/skaly'

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

// Barvy kategorií škál
const SKALY_BARVA = {
  deprese:   'text-yellow-700 bg-yellow-50 border-yellow-200',
  uzkost:    'text-orange-700 bg-orange-50 border-orange-200',
  ptsd:      'text-red-700 bg-red-50 border-red-200',
  bipolarni: 'text-purple-700 bg-purple-50 border-purple-200',
  psychoza:  'text-violet-700 bg-violet-50 border-violet-200',
  ocd:       'text-teal-700 bg-teal-50 border-teal-200',
  alkohol:   'text-amber-700 bg-amber-50 border-amber-200',
  spanek:    'text-indigo-700 bg-indigo-50 border-indigo-200',
  adhd:      'text-sky-700 bg-sky-50 border-sky-200',
  kognitivni:'text-green-700 bg-green-50 border-green-200',
  obecne:    'text-slate-700 bg-slate-50 border-slate-200',
}

function SkalySekce({ navigate }) {
  const [open, setOpen] = useState(false)
  const [openKat, setOpenKat] = useState(new Set())

  // Skupiny škál dle kategorie
  const skupiny = useMemo(() => {
    const map = new Map()
    for (const kat of KATEGORIE_SKAL) {
      const skaly = SKALY.filter(s => s.kategorie === kat.id)
      if (skaly.length > 0) map.set(kat, skaly)
    }
    return map
  }, [])

  function toggleKat(id) {
    setOpenKat(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="mt-1">
      {/* Záhlaví sekce */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-rose-50 transition-colors"
      >
        <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <span className="text-sm font-medium text-slate-700 flex-1">Škály a dotazníky</span>
        <span className="text-xs text-slate-400">{SKALY.length}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="mt-1 space-y-0.5">
          {[...skupiny.entries()].map(([kat, skaly]) => {
            const katOpen = openKat.has(kat.id)
            return (
              <div key={kat.id}>
                {/* Kategorie */}
                <button
                  onClick={() => toggleKat(kat.id)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-50 text-left"
                >
                  <span className="text-sm shrink-0">{kat.ikona}</span>
                  <span className="text-xs text-slate-600 font-medium flex-1">{kat.nazev}</span>
                  <span className="text-xs text-slate-400">{skaly.length}</span>
                  <ChevronIcon open={katOpen} />
                </button>

                {/* Škály v kategorii */}
                {katOpen && (
                  <div className="ml-5 border-l-2 border-slate-100 space-y-0.5 mb-1">
                    {skaly.map(skala => (
                      <button
                        key={skala.id}
                        onClick={() => navigate(`/skaly/${skala.id}`)}
                        className="w-full flex items-center gap-2 pl-3 pr-2 py-1.5 rounded text-left hover:bg-rose-50 group"
                      >
                        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${SKALY_BARVA[skala.kategorie] || SKALY_BARVA.obecne}`}>
                          {skala.zkratka}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-700 leading-tight line-clamp-1 flex-1">
                          {skala.pocetOtazek} pol.
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Odkaz na přehled všech */}
          <NavLink
            to="/skaly"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors mt-1
               ${isActive ? 'bg-rose-50 text-rose-700 font-medium' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`
            }
          >
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h7" />
            </svg>
            Přehled všech škál
          </NavLink>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ open }) {
  const kategorie  = useKategorie()
  const diagnozy   = useDiagnozy()
  const mkn11Data  = useMkn11()
  const navigate   = useNavigate()

  // MKN-10 sekce – defaultně otevřená
  const [mkn10Open, setMkn10Open] = useState(true)

  // MKN-10 accordion
  const [openKat,   setOpenKat]   = useState(new Set())
  const [openRodic, setOpenRodic] = useState(new Set())

  // MKN-11 accordion
  const [mkn11Open,    setMkn11Open]    = useState(false)
  const [openMkn11Kat, setOpenMkn11Kat] = useState(new Set())
  const [openMkn11Kod, setOpenMkn11Kod] = useState(new Set())

  // MKN-11 kategorie a kódy
  const mkn11Kategorie = useMemo(() => {
    const map = new Map()
    for (const d of mkn11Data) {
      if (d.id.includes('.')) continue  // přeskočit subkódy
      if (!map.has(d.kategorie)) map.set(d.kategorie, [])
      map.get(d.kategorie).push(d)
    }
    return map
  }, [mkn11Data])

  // Subkódy pro daný rodičovský kód MKN-11
  function mkn11Subkody(parentId) {
    return mkn11Data.filter(d => {
      if (!d.id.startsWith(parentId + '.')) return false
      const rest = d.id.slice(parentId.length + 1)
      return !rest.includes('.')  // jen přímé subkódy
    })
  }

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

      {/* Quick nav: MKN-10 + MKN-11 */}
      <div className="flex border-b border-slate-100">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors
             ${isActive ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-blue-50 hover:text-blue-700'}`
          }
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
          MKN-10
        </NavLink>
        <NavLink
          to="/mkn11"
          className={({ isActive }) =>
            `flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-colors border-l border-slate-100
             ${isActive ? 'bg-green-50 text-green-700 border-b-2 border-green-500' : 'text-slate-500 hover:bg-green-50 hover:text-green-700'}`
          }
        >
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          MKN-11
        </NavLink>
      </div>

      {/* Differential */}
      <div className="px-4 pt-3 pb-1 border-b border-slate-100">
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

        {/* Škály */}
        <SkalySekce navigate={navigate} />
      </div>

      {/* Společný scrollovatelný blok – MKN-10 + MKN-11 pod sebou */}
      <div className="flex-1 overflow-y-auto">

        {/* ════ MKN-10 ZÁHLAVÍ (klikací, modré) ════════════════════ */}
        <button
          onClick={() => setMkn10Open(v => !v)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-blue-50 bg-blue-50 border-b border-blue-100"
        >
          <span className="w-2 h-2 rounded-full shrink-0 bg-blue-500" />
          <span className="text-xs font-bold text-blue-700 flex-1">MKN-10</span>
          <span className="text-xs text-blue-400 font-mono">F00–F99</span>
          <ChevronIcon open={mkn10Open} />
        </button>

        {mkn10Open && (
        <nav className="py-2">

          {/* Přehled MKN-10 */}
          <div className="px-3 py-1 border-b border-blue-100 mb-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 text-xs py-1.5 px-2 rounded transition-colors
                 ${isActive ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'}`
              }
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Přehled MKN-10
            </NavLink>
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
                    const subs    = subkody(rod.id)
                    const hasSubs = subs.length > 0
                    const rodOpen = openRodic.has(rod.id)

                    return (
                      <div key={rod.id}>

                        {/* Parent code row — text naviguje, šipka rozbaluje */}
                        <div className="flex items-center rounded hover:bg-blue-50 group">
                          <button
                            onClick={() => navigate(`/diagnoza/${rod.id}`)}
                            className="flex items-center gap-2 pl-3 py-1.5 flex-1 text-left hover:text-blue-700 min-w-0"
                            title={rod.nazev_cz}
                          >
                            <span className="font-mono text-xs text-slate-400 shrink-0 w-8">{rod.kod}</span>
                            <span className="text-xs text-slate-600 group-hover:text-blue-700 flex-1 leading-tight line-clamp-2">{rod.nazev_cz}</span>
                          </button>
                          {hasSubs && (
                            <button
                              onClick={() => toggleRodic(rod.id)}
                              className="px-2 py-1.5 shrink-0 hover:text-blue-700"
                              title="Zobrazit podkódy"
                            >
                              <ChevronIcon open={rodOpen} />
                            </button>
                          )}
                        </div>

                        {/* ── Level 3: podkódy ──────────────────────────── */}
                        {hasSubs && rodOpen && (
                          <div className="ml-4 border-l-2 border-slate-100">
                            {subs.map(sub => (
                              <button
                                key={sub.id}
                                onClick={() => navigate(`/diagnoza/${sub.id}`)}
                                className="w-full flex items-center gap-2 pl-3 pr-2 py-1.5 text-left hover:bg-blue-50 hover:text-blue-700 rounded"
                                title={sub.nazev_cz}
                              >
                                <span className="font-mono text-xs text-slate-400 shrink-0 w-10">{sub.kod}</span>
                                <span className="text-xs text-slate-600 flex-1 leading-tight line-clamp-2">{sub.nazev_cz}</span>
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
        )}

        {/* ════ MKN-11 SEKCE – hned pod MKN-10 ════════════════════ */}
        <div className="border-t-2 border-green-200">
        {/* Záhlaví MKN-11 sekce */}
        <button
          onClick={() => setMkn11Open(v => !v)}
          className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-green-50 bg-green-50"
        >
          <span className="w-2 h-2 rounded-full shrink-0 bg-green-500" />
          <span className="text-xs font-bold text-green-700 flex-1">MKN-11</span>
          <span className="text-xs text-green-500 font-mono">06</span>
          <ChevronIcon open={mkn11Open} />
        </button>

        {/* Odkaz na přehled MKN-11 */}
        {mkn11Open && (
          <div className="px-3 py-1 border-b border-green-100">
            <NavLink
              to="/mkn11"
              className={({ isActive }) =>
                `flex items-center gap-2 text-xs py-1.5 px-2 rounded transition-colors
                 ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'text-slate-600 hover:text-green-700 hover:bg-green-50'}`
              }
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Přehled MKN-11
            </NavLink>
          </div>
        )}

        {/* Strom MKN-11 */}
        {mkn11Open && (
          <nav className="overflow-y-auto max-h-96 py-1">
            <div className="px-3 py-1 text-xs font-semibold text-green-500 uppercase tracking-wider">
              Kapitola 06 – Duševní poruchy
            </div>
            {[...mkn11Kategorie.entries()].map(([kat, kody]) => {
              const katOpen = openMkn11Kat.has(kat)
              const barva = getMkn11Barva(kat)
              const bc = MKN11_BARVA_CLASSES[barva] || MKN11_BARVA_CLASSES.gray

              return (
                <div key={kat}>
                  {/* Level 1: Kategorie */}
                  <button
                    onClick={() => setOpenMkn11Kat(prev => {
                      const next = new Set(prev)
                      next.has(kat) ? next.delete(kat) : next.add(kat)
                      return next
                    })}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-50"
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${bc.badge}`} />
                    <span className="text-xs text-slate-600 font-medium flex-1 leading-tight">{kat}</span>
                    <ChevronIcon open={katOpen} />
                  </button>

                  {/* Level 2: Hlavní kódy */}
                  {katOpen && (
                    <div className="ml-3 border-l-2 border-slate-100">
                      {kody.map(kod => {
                        const subs = mkn11Subkody(kod.id)
                        const hasSubs = subs.length > 0
                        const kodOpen = openMkn11Kod.has(kod.id)

                        return (
                          <div key={kod.id}>
                            {/* MKN-11 parent row — text naviguje, šipka rozbaluje */}
                            <div className="flex items-center rounded hover:bg-green-50 group">
                              <button
                                onClick={() => navigate(`/mkn11/${kod.id}`)}
                                className="flex items-center gap-2 pl-3 py-1.5 flex-1 text-left min-w-0"
                                title={kod.nazev_cz}
                              >
                                <span className="font-mono text-xs text-slate-400 shrink-0 w-10">{kod.kod}</span>
                                <span className="text-xs text-slate-600 group-hover:text-green-700 flex-1 leading-tight line-clamp-2">{kod.nazev_cz}</span>
                              </button>
                              {hasSubs && (
                                <button
                                  onClick={() => setOpenMkn11Kod(prev => {
                                    const next = new Set(prev)
                                    next.has(kod.id) ? next.delete(kod.id) : next.add(kod.id)
                                    return next
                                  })}
                                  className="px-2 py-1.5 shrink-0 hover:text-green-700"
                                  title="Zobrazit podkódy"
                                >
                                  <ChevronIcon open={kodOpen} />
                                </button>
                              )}
                            </div>

                            {/* Level 3: Subkódy */}
                            {hasSubs && kodOpen && (
                              <div className="ml-4 border-l-2 border-slate-100">
                                {subs.map(sub => (
                                  <button
                                    key={sub.id}
                                    onClick={() => navigate(`/mkn11/${sub.id}`)}
                                    className="w-full flex items-center gap-2 pl-3 pr-2 py-1.5 text-left hover:bg-green-50 hover:text-green-700 rounded"
                                    title={sub.nazev_cz}
                                  >
                                    <span className="font-mono text-xs text-slate-400 shrink-0 w-12">{sub.kod}</span>
                                    <span className="text-xs text-slate-600 flex-1 leading-tight line-clamp-2">{sub.nazev_cz}</span>
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
        )}
        </div>


      </div>
    </aside>
  )
}
