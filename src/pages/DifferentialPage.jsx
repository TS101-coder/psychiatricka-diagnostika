import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDiagnozy } from '../hooks/useDiagnozy'
import { vyhledej, porovnejDiagnozy, getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'
import DiagnozaKarta from '../components/DiagnozaKarta'

const MAX = 3  // max diagnoses to compare

export default function DifferentialPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const diagnozy = useDiagnozy()
  const [vybrane, setVybrane] = useState([])
  const [dotaz, setDotaz] = useState('')
  const [zobrazit, setZobrazit] = useState(12)

  useEffect(() => {
    const a = searchParams.get('a')
    if (a) {
      const d = diagnozy.find(x => x.id === a)
      if (d) setVybrane([d])
    }
  }, [searchParams, diagnozy])

  const filtrovane = useMemo(() => vyhledej(diagnozy, dotaz).slice(0, zobrazit), [diagnozy, dotaz, zobrazit])

  function toggleVybrat(diagnoza) {
    setVybrane(prev => {
      if (prev.find(d => d.id === diagnoza.id)) return prev.filter(d => d.id !== diagnoza.id)
      if (prev.length >= MAX) return [...prev.slice(1), diagnoza]  // slide window
      return [...prev, diagnoza]
    })
  }

  const pripraveno = vybrane.length >= 2
  const srovnani = useMemo(() => {
    if (!pripraveno) return null
    return porovnejDiagnozy(vybrane)
  }, [vybrane, pripraveno])

  function tisk() { window.print() }

  // colour palette per slot
  const bcs = vybrane.map(d => BARVA_CLASSES[getKategorieBarva(d.kategorie)])

  // labels for the 3 slot placeholders
  const slotLabels = ['první', 'druhou', 'třetí']

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Diferenciální diagnostika</h2>
        <p className="text-slate-500 text-sm">Vyberte 2–3 diagnózy pro klinické srovnání. Při výběru čtvrté se první automaticky vyřadí.</p>
      </div>

      {/* Slot cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6 no-print">
        {Array.from({ length: MAX }).map((_, i) => {
          const d = vybrane[i]
          const bc = d ? BARVA_CLASSES[getKategorieBarva(d.kategorie)] : null
          return (
            <div key={i} className={`rounded-xl border-2 p-4 min-h-20 flex items-center
              ${d ? `${bc.border} ${bc.bg}` : 'border-dashed border-slate-300 bg-slate-50'}`}>
              {d ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <div>
                    <span className={`font-mono text-sm font-bold ${bc.text}`}>{d.kod}</span>
                    <p className="text-xs font-semibold text-slate-800 mt-0.5 leading-snug">{d.nazev_cz}</p>
                  </div>
                  <button onClick={() => toggleVybrat(d)}
                    className="shrink-0 text-xs px-2 py-1 bg-white border border-slate-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-500">
                    ✕
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 mx-auto text-center">
                  {i < 2 ? `Vyberte ${slotLabels[i]} diagnózu níže` : <span className="text-slate-300">Volitelná třetí diagnóza</span>}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Results */}
      {pripraveno && srovnani && (
        <div className="mb-8 space-y-5 print-full">

          <div className="flex items-center justify-between no-print">
            <h3 className="font-semibold text-slate-900 text-lg">
              Klinické srovnání {vybrane.length === 3 ? '3 diagnóz' : ''}
            </h3>
            <button onClick={tisk} className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
              Tisk / PDF
            </button>
          </div>

          {/* Header cards */}
          <div className={`grid gap-4 print-section ${vybrane.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {vybrane.map((d, idx) => {
              const bc = bcs[idx]
              return (
                <div key={d.id} className={`rounded-xl p-4 border-2 ${bc.border} ${bc.bg}`}>
                  <span className={`font-mono text-base font-bold ${bc.text}`}>{d.kod}</span>
                  <p className="font-semibold text-slate-800 text-sm mt-1 leading-snug">{d.nazev_cz}</p>
                  <p className="text-xs text-slate-500 mt-1">{d.kategorie}</p>
                </div>
              )
            })}
          </div>

          {/* Clinical comparison table */}
          {srovnani.srovnaniRows.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-section">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700">Klinické odlišnosti</h4>
                <p className="text-xs text-slate-400 mt-0.5">Konkrétní rozdíly v průběhu, nástupu a zařazení</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-semibold text-slate-500 px-5 py-2.5 w-36">Charakteristika</th>
                      {vybrane.map((d, i) => (
                        <th key={d.id} className={`text-left text-xs font-semibold px-5 py-2.5 ${bcs[i].text}`}>
                          {d.kod}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {srovnani.srovnaniRows.map((radek, ri) => (
                      <tr key={ri} className={`border-b border-slate-50 ${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                        <td className="px-5 py-3 text-xs font-semibold text-slate-500 align-top">{radek.rys}</td>
                        {radek.hodnoty.map((val, i) => (
                          <td key={i} className={`px-5 py-3 text-sm text-slate-800 align-top border-l-2 ${bcs[i].border}`}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Unique symptoms per diagnosis */}
          {srovnani.odlisne.some(list => list.length > 0) && (
            <div className={`grid gap-4 print-section ${vybrane.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {vybrane.map((d, i) => {
                const bc = bcs[i]
                const list = srovnani.odlisne[i]
                return (
                  <div key={d.id} className={`rounded-xl border-2 ${bc.border} ${bc.bg} p-4`}>
                    <h4 className={`text-sm font-semibold ${bc.text} mb-3 flex items-center gap-2`}>
                      <span className={`w-2 h-2 rounded-full ${bc.badge}`}></span>
                      Typické pro {d.kod}
                      <span className="font-normal opacity-70">({list.length})</span>
                    </h4>
                    {list.length > 0 ? (
                      <ul className="space-y-1.5">
                        {list.map((p, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bc.badge}`}></span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400">Příznaky se překrývají s ostatními diagnózami</p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Unique diagnostic criteria */}
          {srovnani.unikatniKriteria.some(list => list.length > 0) && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-section">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700">Klíčová odlišující diagnostická kritéria</h4>
                <p className="text-xs text-slate-400 mt-0.5">Kritéria přítomná jen u jedné diagnózy — rozhodující pro diferenciaci</p>
              </div>
              <div className={`grid divide-slate-100 ${vybrane.length === 3 ? 'grid-cols-1 md:grid-cols-3 md:divide-x' : 'grid-cols-1 md:grid-cols-2 md:divide-x'} divide-y md:divide-y-0`}>
                {vybrane.map((d, i) => {
                  const bc = bcs[i]
                  const list = srovnani.unikatniKriteria[i]
                  return (
                    <div key={d.id} className="p-5">
                      <p className={`text-xs font-bold ${bc.text} mb-3`}>{d.kod} — {d.nazev_cz}</p>
                      {list.length > 0 ? (
                        <ul className="space-y-2">
                          {list.map((k, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bc.bg} ${bc.text}`}>
                                {j + 1}
                              </span>
                              {k}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400">Žádná výhradní kritéria nenalezena</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Shared symptoms */}
          {srovnani.shodne.length > 0 && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 print-section">
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Shodné příznaky u všech ({srovnani.shodne.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {srovnani.shodne.map((p, i) => (
                  <span key={i} className="text-sm bg-white text-green-800 border border-green-300 px-3 py-1 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="flex flex-wrap gap-4 no-print">
            {vybrane.map(d => (
              <button key={d.id} onClick={() => navigate(`/diagnoza/${d.id}`)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Celý detail: {d.kod} →
              </button>
            ))}
            <button onClick={() => setVybrane([])}
              className="ml-auto text-sm text-slate-600 hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50">
              Nové srovnání
            </button>
          </div>
        </div>
      )}

      {/* Search & selection */}
      {vybrane.length < MAX && (
        <div className="no-print">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Hledat diagnózu..."
                value={dotaz}
                onChange={e => { setDotaz(e.target.value); setZobrazit(12) }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-slate-500">Vybráno: {vybrane.length}/{MAX}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtrovane.map(d => (
              <DiagnozaKarta key={d.id} diagnoza={d} onPorovnat={toggleVybrat}
                vybrana={!!vybrane.find(v => v.id === d.id)} />
            ))}
          </div>
          {diagnozy.length > zobrazit && (
            <div className="mt-4 text-center">
              <button onClick={() => setZobrazit(z => z + 12)} className="text-sm text-blue-600 hover:text-blue-800">
                Načíst více
              </button>
            </div>
          )}
        </div>
      )}

      {/* Show search also when 2 selected (to pick 3rd) */}
      {vybrane.length === 2 && (
        <div className="no-print mt-6 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-500 mb-3">Chcete přidat třetí diagnózu k porovnání?</p>
          <div className="relative max-w-md mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Hledat třetí diagnózu..."
              value={dotaz}
              onChange={e => { setDotaz(e.target.value); setZobrazit(12) }}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtrovane.filter(d => !vybrane.find(v => v.id === d.id)).slice(0, 12).map(d => (
              <DiagnozaKarta key={d.id} diagnoza={d} onPorovnat={toggleVybrat} vybrana={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
