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

  const bcA = vybrane[0] ? BARVA_CLASSES[getKategorieBarva(vybrane[0].kategorie)] : null
  const bcB = vybrane[1] ? BARVA_CLASSES[getKategorieBarva(vybrane[1].kategorie)] : null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Diferenciální diagnostika</h2>
        <p className="text-slate-500 text-sm">Vyberte dvě diagnózy pro klinické srovnání — v čem se liší, co mají společné.</p>
      </div>

      {/* Slot pro výběr diagnóz */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6 no-print">
        {[0, 1].map(i => {
          const d = vybrane[i]
          const bc = d ? BARVA_CLASSES[getKategorieBarva(d.kategorie)] : null
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

      {/* Výsledek srovnání */}
      {vybrane.length === 2 && srovnani && (
        <div className="mb-8 space-y-5 print-full">

          {/* Záhlaví s tlačítkem tisku */}
          <div className="flex items-center justify-between no-print">
            <h3 className="font-semibold text-slate-900 text-lg">Klinické srovnání</h3>
            <button onClick={tisk} className="text-sm px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
              Tisk / PDF
            </button>
          </div>

          {/* Hlavičky diagnóz */}
          <div className="grid grid-cols-2 gap-4 print-section">
            {vybrane.map((d, idx) => {
              const bc = idx === 0 ? bcA : bcB
              return (
                <div key={d.id} className={`rounded-xl p-4 border-2 ${bc.border} ${bc.bg}`}>
                  <span className={`font-mono text-base font-bold ${bc.text}`}>{d.kod}</span>
                  <p className="font-semibold text-slate-800 text-sm mt-1 leading-snug">{d.nazev_cz}</p>
                  <p className="text-xs text-slate-500 mt-1">{d.kategorie}</p>
                </div>
              )
            })}
          </div>

          {/* Klinická srovnávací tabulka */}
          {srovnani.srovnani.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-section">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700">Klinické odlišnosti</h4>
                <p className="text-xs text-slate-400 mt-0.5">Konkrétní rozdíly v průběhu, nástupu a zařazení</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 px-5 py-2.5 w-40">Charakteristika</th>
                    <th className={`text-left text-xs font-semibold px-5 py-2.5 ${bcA.text}`}>
                      {vybrane[0].kod}
                    </th>
                    <th className={`text-left text-xs font-semibold px-5 py-2.5 ${bcB.text}`}>
                      {vybrane[1].kod}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {srovnani.srovnani.map((radek, i) => (
                    <tr key={i} className={`border-b border-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="px-5 py-3 text-xs font-semibold text-slate-500 align-top">{radek.rys}</td>
                      <td className={`px-5 py-3 text-sm text-slate-800 align-top border-l-2 ${bcA.border}`}>
                        {radek.hodnotaA}
                      </td>
                      <td className={`px-5 py-3 text-sm text-slate-800 align-top border-l-2 ${bcB.border}`}>
                        {radek.hodnotaB}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Příznaky specifické pro každou diagnózu — klíčový klinický rozdíl */}
          {(srovnani.odlisneA.length > 0 || srovnani.odlisneB.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-section">
              <div className={`rounded-xl border-2 ${bcA.border} ${bcA.bg} p-4`}>
                <h4 className={`text-sm font-semibold ${bcA.text} mb-3 flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-full ${bcA.badge}`}></span>
                  Příznaky typické pro {vybrane[0].kod}
                  <span className="font-normal opacity-70">({srovnani.odlisneA.length})</span>
                </h4>
                {srovnani.odlisneA.length > 0 ? (
                  <ul className="space-y-1.5">
                    {srovnani.odlisneA.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bcA.badge}`}></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Všechny příznaky sdíleny s druhou diagnózou</p>
                )}
              </div>

              <div className={`rounded-xl border-2 ${bcB.border} ${bcB.bg} p-4`}>
                <h4 className={`text-sm font-semibold ${bcB.text} mb-3 flex items-center gap-2`}>
                  <span className={`w-2 h-2 rounded-full ${bcB.badge}`}></span>
                  Příznaky typické pro {vybrane[1].kod}
                  <span className="font-normal opacity-70">({srovnani.odlisneB.length})</span>
                </h4>
                {srovnani.odlisneB.length > 0 ? (
                  <ul className="space-y-1.5">
                    {srovnani.odlisneB.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${bcB.badge}`}></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">Všechny příznaky sdíleny s druhou diagnózou</p>
                )}
              </div>
            </div>
          )}

          {/* Diagnostická kritéria specifická pro každou diagnózu */}
          {(srovnani.unikatniKriteriaA.length > 0 || srovnani.unikatniKriteriaB.length > 0) && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-section">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-sm font-semibold text-slate-700">Klíčová odlišující diagnostická kritéria</h4>
                <p className="text-xs text-slate-400 mt-0.5">Kritéria přítomná jen u jedné z diagnóz — rozhodující pro diferenciaci</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                <div className="p-5">
                  <p className={`text-xs font-bold ${bcA.text} mb-3`}>{vybrane[0].kod} — {vybrane[0].nazev_cz}</p>
                  {srovnani.unikatniKriteriaA.length > 0 ? (
                    <ul className="space-y-2">
                      {srovnani.unikatniKriteriaA.map((k, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bcA.bg} ${bcA.text}`}>{i + 1}</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Žádná výhradní kritéria nenalezena</p>
                  )}
                </div>
                <div className="p-5">
                  <p className={`text-xs font-bold ${bcB.text} mb-3`}>{vybrane[1].kod} — {vybrane[1].nazev_cz}</p>
                  {srovnani.unikatniKriteriaB.length > 0 ? (
                    <ul className="space-y-2">
                      {srovnani.unikatniKriteriaB.map((k, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bcB.bg} ${bcB.text}`}>{i + 1}</span>
                          {k}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Žádná výhradní kritéria nenalezena</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shodné příznaky */}
          {srovnani.shodne.length > 0 && (
            <div className="bg-green-50 rounded-xl border border-green-200 p-4 print-section">
              <h4 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Shodné / překrývající se příznaky ({srovnani.shodne.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {srovnani.shodne.map((p, i) => (
                  <span key={i} className="text-sm bg-white text-green-800 border border-green-300 px-3 py-1 rounded-full">{p}</span>
                ))}
              </div>
            </div>
          )}

          {/* Odkaz na detail + nové srovnání */}
          <div className="flex flex-wrap gap-4 no-print">
            {vybrane.map(d => (
              <button
                key={d.id}
                onClick={() => navigate(`/diagnoza/${d.id}`)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Celý detail: {d.kod} →
              </button>
            ))}
            <button
              onClick={() => setVybrane([])}
              className="ml-auto text-sm text-slate-600 hover:text-slate-900 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50"
            >
              Nové srovnání
            </button>
          </div>
        </div>
      )}

      {/* Výběr diagnóz */}
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
    </div>
  )
}
