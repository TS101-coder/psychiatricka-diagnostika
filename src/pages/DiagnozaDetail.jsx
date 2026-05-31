import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDiagnoza, useDiagnozy } from '../hooks/useDiagnozy'
import { getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'
import { useGuidelines } from '../hooks/useGuidelines'
import { usePsychoterapie } from '../hooks/usePsychoterapie'
import GuidelinesSection from '../components/GuidelinesSection'
import PsychoterapieSection from '../components/PsychoterapieSection'

export default function DiagnozaDetail() {
  const { id } = useParams()
  const diagnoza = useDiagnoza(id)
  const diagnozy = useDiagnozy()
  const navigate = useNavigate()
  const [aktivniZalozka, setAktivniZalozka] = useState('farma')

  if (!diagnoza) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Diagnóza <strong>{id}</strong> nebyla nalezena.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline text-sm">
          Zpět na přehled
        </button>
      </div>
    )
  }

  const barva = getKategorieBarva(diagnoza.kategorie)
  const bc = BARVA_CLASSES[barva] || BARVA_CLASSES.gray

  const guideline = useGuidelines(diagnoza?.id)
  const psychoGuideline = usePsychoterapie(diagnoza?.id)
  const diferencialni = (diagnoza.diferencialni_diagnozy || [])
    .map(kod => diagnozy.find(d => d.id === kod))
    .filter(Boolean)

  // Přímé podkódy tohoto záznamu (např. F00 → F00.0, F00.1 …)
  const podkody = diagnozy.filter(d => {
    if (!d.id.startsWith(id + '.')) return false
    const rest = d.id.slice(id.length + 1)
    return !rest.includes('.')  // jen přímé podkódy, ne hlubší
  })

  function tisk() {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 no-print">
        <button onClick={() => navigate(-1)} className="hover:text-slate-800 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět
        </button>
        <span>/</span>
        <span className="text-slate-800">{diagnoza.kod}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-full">
        <div className={`px-6 py-5 border-b-4 ${bc.border} ${bc.bg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-mono text-xl font-bold ${bc.text}`}>{diagnoza.kod}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bc.bg} ${bc.text} border ${bc.border}`}>
                  {diagnoza.system}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{diagnoza.nazev_cz}</h1>
              <p className="text-sm text-slate-600">{diagnoza.kategorie}</p>
            </div>
            <div className="flex flex-wrap gap-2 no-print">
              <button
                onClick={() => navigate(`/diferencialni?a=${diagnoza.id}`)}
                className="text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                </svg>
                Porovnat
              </button>
              <button
                onClick={() => navigate(`/kalkulator?kod=${diagnoza.id}`)}
                className="text-sm px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M9 7V5a2 2 0 012-2h2M9 7h6m0 0V5a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" />
                </svg>
                V kalkulačce
              </button>
              <button
                onClick={tisk}
                className="text-sm px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium"
              >
                Tisk / PDF
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {diagnoza.popis && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Popis</h2>
              <p className="text-slate-800 leading-relaxed">{diagnoza.popis}</p>
            </section>
          )}

          {/* Diagnostická kritéria MKN-10 + MKN-11 vedle sebe */}
          {(diagnoza.diagnosticka_kriteria?.length > 0 || diagnoza.kriteria_mkn11?.length > 0) && (
            <div className={`grid gap-4 print-section ${
              diagnoza.diagnosticka_kriteria?.length > 0 && diagnoza.kriteria_mkn11?.length > 0
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}>

              {/* MKN-10 kritéria */}
              {diagnoza.diagnosticka_kriteria?.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
                    Diagnostická kritéria <span className="text-slate-400 font-normal normal-case">(MKN-10)</span>
                  </h2>

                  <ul className="space-y-1.5">
                    {diagnoza.diagnosticka_kriteria.map((k, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                        <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {k}
                      </li>
                    ))}
                  </ul>

                  {/* Obecná kritéria MKN-10 POD specifickými */}
                  {diagnoza.obecna_kriteria?.length > 0 && (
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                        {diagnoza.obecna_kriteria_nazev || 'Obecná kritéria MKN-10'}
                      </p>
                      <ul className="space-y-1.5">
                        {diagnoza.obecna_kriteria.map((k, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-blue-900">
                            <span className="w-5 h-5 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {k.match(/^G(\d+[ab]?)/)?.[1] || (i + 1)}
                            </span>
                            {k.replace(/^G\d+[ab]?\.\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              {/* MKN-11 kritéria */}
              {diagnoza.kriteria_mkn11?.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2 flex items-center gap-2">
                    Diagnostická kritéria <span className="font-semibold normal-case">MKN-11</span>
                    {diagnoza.mapovani?.mkn11 && (
                      <span className="text-xs font-mono bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                        {diagnoza.mapovani.mkn11}
                      </span>
                    )}
                  </h2>

                  <ul className="space-y-1.5">
                    {diagnoza.kriteria_mkn11.map((k, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                        <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {k}
                      </li>
                    ))}
                  </ul>

                  {/* Obecná kritéria MKN-11 POD specifickými */}
                  {diagnoza.obecna_kriteria_mkn11?.length > 0 && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">
                        {diagnoza.obecna_kriteria_nazev_mkn11 || 'Obecná kritéria MKN-11'}
                      </p>
                      <ul className="space-y-1.5">
                        {diagnoza.obecna_kriteria_mkn11.map((k, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-green-900">
                            <span className="w-5 h-5 bg-green-200 text-green-800 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {k.match(/^[A-F]\./)?.[0]?.replace('.','') || (i + 1)}
                            </span>
                            {k.replace(/^[A-F]\.\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

            </div>
          )}

          {diagnoza.priznaky?.length > 0 && (
            <section className="print-section">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Příznaky</h2>
              <div className="flex flex-wrap gap-2">
                {diagnoza.priznaky.map((p, i) => (
                  <span key={i} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                    {p}
                  </span>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-section">
            {diagnoza.prubeh && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <h3 className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Průběh</h3>
                <p className="text-sm text-amber-900">{diagnoza.prubeh}</p>
              </div>
            )}
            {diagnoza.onset && (
              <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
                <h3 className="text-xs font-semibold text-sky-700 uppercase tracking-wide mb-1">Onset / Nástup</h3>
                <p className="text-sm text-sky-900">{diagnoza.onset}</p>
              </div>
            )}
          </div>

          {/* Podkategorie – stejný styl jako v MKN-11 */}
          {podkody.length > 0 && (
            <section className="print-section">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Podkategorie</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {podkody.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => navigate(`/diagnoza/${sub.id}`)}
                    className={`text-left flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${bc.border} hover:${bc.bg} bg-white`}
                  >
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${bc.bg} ${bc.text}`}>
                      {sub.kod}
                    </span>
                    <span className="text-sm text-slate-700 leading-snug">{sub.nazev_cz}</span>
                  </button>
                ))}
              </div>
            </section>
          )}


          {diferencialni.length > 0 && (
            <section className="print-section">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Diferenciální diagnózy</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {diferencialni.map(d => {
                  const b2 = getKategorieBarva(d.kategorie)
                  const bc2 = BARVA_CLASSES[b2] || BARVA_CLASSES.gray
                  return (
                    <button
                      key={d.id}
                      onClick={() => navigate(`/diagnoza/${d.id}`)}
                      className="text-left flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors no-print"
                    >
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${bc2.bg} ${bc2.text}`}>{d.kod}</span>
                      <span className="text-sm text-slate-700">{d.nazev_cz}</span>
                    </button>
                  )
                })}
                {diagnoza.diferencialni_diagnozy?.filter(k => !diagnozy.find(d => d.id === k)).map(k => (
                  <div key={k} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 text-slate-400">
                    <span className="font-mono text-xs">{k}</span>
                    <span className="text-sm">(mimo psychiatrické F kódy)</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 no-print">
                <button
                  onClick={() => navigate(`/diferencialni?a=${diagnoza.id}`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10" />
                  </svg>
                  Spustit diferenciální srovnání
                </button>
              </div>
            </section>
          )}

          {/* Záložky: Farmakoterapie & SÚKL | Psychoterapeutické postupy */}
          {(guideline || psychoGuideline) && (
            <section className="print-section">
              {/* Tab navigace */}
              <div className="flex border-b border-slate-200 mb-4 no-print">
                <button
                  onClick={() => setAktivniZalozka('farma')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    aktivniZalozka === 'farma'
                      ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  Farmakoterapie & SÚKL
                  {!guideline && <span className="text-xs text-slate-400 ml-1">(není)</span>}
                </button>
                <button
                  onClick={() => setAktivniZalozka('psycho')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    aktivniZalozka === 'psycho'
                      ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Psychoterapeutické postupy
                  {!psychoGuideline && <span className="text-xs text-slate-400 ml-1">(není)</span>}
                </button>
              </div>

              {/* Obsah aktivní záložky */}
              {aktivniZalozka === 'farma' && (
                guideline
                  ? <GuidelinesSection guideline={guideline} />
                  : <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                      Pro tuto diagnózu nejsou dostupná farmakoterapeutická guidelines.
                    </div>
              )}
              {aktivniZalozka === 'psycho' && (
                <PsychoterapieSection
                  psychoGuideline={psychoGuideline}
                  nefarmakologickaTerapie={guideline?.terapie_prvni_volby?.nefarmakologicka_terapie || []}
                />
              )}
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
