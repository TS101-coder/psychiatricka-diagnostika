import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useDiagnozy } from '../hooks/useDiagnozy'
import { vyhledej, porovnejDiagnozy, getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'
import DiagnozaKarta from '../components/DiagnozaKarta'

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
      if (prev.length >= 2) return [prev[1], diagnoza]
      return [...prev, diagnoza]
    })
  }

  const srovnani = useMemo(() => {
    if (vybrane.length !== 2) return null
    return porovnejDiagnozy(vybrane[0], vybrane[1])
  }, [vybrane])

  function tisk() { window.print() }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Diferenciální diagnostika</h2>
        <p className="text-slate-500 text-sm">Vyberte dvě diagnózy pro srovnání příznaků a diagnostických kritérií.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6 no-print">
        {[0, 1].map(i => {
          const d = vybrane[i]
          const barva = d ? getKategorieBarva(d.kategorie) : null
          const bc = barva ? BARVA_CLASSES[barva] : null
          return (
            <div key={i} className={`rounded-xl border-2 p-4 min-h-24 flex items-center ${d ? `${bc.border} ${bc.bg}` : 'border-dashed border-slate-300 bg-slate-50'}`}>
              {d ? (
                <div className="flex items-center justify-between w-full gap-3">
                  <div>
                    <span className={`font-mono text-sm font-bold ${bc.text}`}>{d.kod}</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{d.nazev_cz}</p>
                  </div>
                  <button
                    onClick={() => toggleVybrat(d)}
                    className="text-xs px-2 py-1 bg-white border border-slate-300 rounded hover:bg-red-50 hover:border-red-300 hover:text-red-600 text-slate-500"
                  >
                    Odebrat
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400 mx-auto">
                  {i === 0 ? 'Vyberte první diagnózu níže' : 'Vyberte druhou diagnózu níže'}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {vybrane.length === 2 && srovnani && (
        <div className="mb-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-full">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between no-print">
            <h3 className="font-semibold text-slate-900">Výsledek srovnání</h3>
            <button onClick={tisk} className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
              Tisk / PDF
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vybrane.map(d => {
                const b = getKategorieBarva(d.kategorie)
                const bc = BARVA_CLASSES[b]
                return (
                  <div key={d.id} className={`rounded-lg p-4 border ${bc.border} ${bc.bg}`}>
                    <div className={`font-mono text-sm font-bold ${bc.text}`}>{d.kod}</div>
                    <div className="font-semibold text-slate-800 text-sm mt-1">{d.nazev_cz}</div>
                    {d.onset && <div className="text-xs text-slate-600 mt-1"><strong>Onset:</strong> {d.onset}</div>}
                    {d.prubeh && <div className="text-xs text-slate-600 mt-0.5"><strong>Průběh:</strong> {d.prubeh}</div>}
                  </div>
                )
              })}
            </div>

            {srovnani.shodne.length > 0 && (
              <section className="print-section">
                <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                  Shodné příznaky ({srovnani.shodne.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {srovnani.shodne.map((p, i) => (
                    <span key={i} className="text-sm bg-green-100 text-green-800 border border-green-300 px-3 py-1 rounded-full">{p}</span>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-section">
              <section>
                <h4 className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span>
                  Specifické pro {vybrane[0].kod} ({srovnani.odlisneA.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {srovnani.odlisneA.length > 0
                    ? srovnani.odlisneA.map((p, i) => (
                      <span key={i} className="text-sm bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full">{p}</span>
                    ))
                    : <span className="text-sm text-slate-400">Žádné specifické příznaky</span>
                  }
                </div>
              </section>
              <section>
                <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full inline-block"></span>
                  Specifické pro {vybrane[1].kod} ({srovnani.odlisneB.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {srovnani.odlisneB.length > 0
                    ? srovnani.odlisneB.map((p, i) => (
                      <span key={i} className="text-sm bg-orange-100 text-orange-800 border border-orange-300 px-3 py-1 rounded-full">{p}</span>
                    ))
                    : <span className="text-sm text-slate-400">Žádné specifické příznaky</span>
                  }
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-section">
              {vybrane.map(d => (
                <section key={d.id}>
                  <h4 className="text-sm font-semibold text-slate-600 mb-2">Diagnostická kritéria {d.kod}</h4>
                  <ul className="space-y-1">
                    {(d.diagnosticka_kriteria || []).map((k, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-slate-400 shrink-0">▸</span>{k}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            <div className="no-print flex gap-3">
              {vybrane.map(d => (
                <button
                  key={d.id}
                  onClick={() => navigate(`/diagnoza/${d.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Detail: {d.kod} →
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {vybrane.length < 2 && (
        <div className="no-print">
          <div className="mb-3 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Hledat diagnózu..."
                value={dotaz}
                onChange={e => { setDotaz(e.target.value); setZobrazit(12) }}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm text-slate-500">Vybráno: {vybrane.length}/2</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtrovane.map(d => (
              <DiagnozaKarta
                key={d.id}
                diagnoza={d}
                onPorovnat={toggleVybrat}
                vybrana={!!vybrane.find(v => v.id === d.id)}
              />
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

      {vybrane.length === 2 && (
        <div className="no-print mt-4">
          <button
            onClick={() => setVybrane([])}
            className="text-sm text-slate-600 hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            Nové srovnání
          </button>
        </div>
      )}
    </div>
  )
}
