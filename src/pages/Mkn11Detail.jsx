import { useParams, useNavigate } from 'react-router-dom'
import { useMkn11Kod, useMkn11, getMkn11Barva, MKN11_BARVA_CLASSES } from '../hooks/useMkn11'

export default function Mkn11Detail() {
  const { id } = useParams()
  const diagnoza = useMkn11Kod(id)
  const vsechnyMkn11 = useMkn11()
  const navigate = useNavigate()

  if (!diagnoza) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>MKN-11 kód <strong>{id}</strong> nebyl nalezen.</p>
        <button onClick={() => navigate('/mkn11')} className="mt-4 text-blue-600 hover:underline text-sm">
          Zpět na přehled MKN-11
        </button>
      </div>
    )
  }

  const barva = getMkn11Barva(diagnoza.kategorie)
  const bc = MKN11_BARVA_CLASSES[barva] || MKN11_BARVA_CLASSES.gray

  // Najdi subcodes (přímé podkódy tohoto záznamu)
  const subcodes = vsechnyMkn11.filter(d => {
    if (d.id === id) return false
    // Je přímý podkód: začíná tímto id + "."
    if (!d.id.startsWith(id + '.')) return false
    // Je přímý podkód (ne hlubší úroveň)
    const rest = d.id.slice(id.length + 1)
    return !rest.includes('.')
  })

  // Najdi mapované MKN-10 diagnózy
  const mkn10Kody = diagnoza.mapovani_mkn10 || []

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigace zpět */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 no-print">
        <button onClick={() => navigate(-1)} className="hover:text-slate-800 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět
        </button>
        <span>/</span>
        <span className="text-slate-400 text-xs">MKN-11</span>
        <span>/</span>
        <span className="text-slate-800">{diagnoza.kod}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Záhlaví */}
        <div className={`px-6 py-5 border-b-4 ${bc.border} ${bc.bg}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`font-mono text-xl font-bold ${bc.text}`}>{diagnoza.kod}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white bg-opacity-70 text-slate-600 border border-slate-200">
                  MKN-11
                </span>
                {diagnoza.podkategorie && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bc.bg} ${bc.text} border ${bc.border}`}>
                    {diagnoza.podkategorie}
                  </span>
                )}
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{diagnoza.nazev_cz}</h1>
              <p className="text-sm text-slate-600">{diagnoza.kategorie}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Popis */}
          {diagnoza.popis && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Popis</h2>
              <p className="text-slate-800 leading-relaxed">{diagnoza.popis}</p>
            </section>
          )}

          {/* Diagnostická kritéria */}
          {diagnoza.diagnosticka_kriteria?.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Diagnostická kritéria <span className={`font-semibold normal-case ${bc.text}`}>MKN-11</span>
              </h2>
              <ul className="space-y-1.5">
                {diagnoza.diagnosticka_kriteria.map((k, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-800">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${bc.bg} ${bc.text}`}>
                      {i + 1}
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Příznaky */}
          {diagnoza.priznaky?.length > 0 && (
            <section>
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

          {/* Průběh a onset */}
          {(diagnoza.prubeh || diagnoza.onset) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          )}

          {/* Podkódy */}
          {subcodes.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Podkategorie</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {subcodes.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => navigate(`/mkn11/${sub.id}`)}
                    className={`text-left flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-all ${bc.border} hover:${bc.bg}`}
                  >
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${bc.bg} ${bc.text} shrink-0`}>
                      {sub.kod}
                    </span>
                    <span className="text-sm text-slate-700 leading-snug">{sub.nazev_cz}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Mapování na MKN-10 */}
          {mkn10Kody.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Odpovídající kódy MKN-10</h2>
              <div className="flex flex-wrap gap-2">
                {mkn10Kody.map(kod => (
                  <button
                    key={kod}
                    onClick={() => navigate(`/diagnoza/${kod}`)}
                    className="font-mono text-sm bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {kod} →
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1">Kliknutím přejdete na detail v MKN-10</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
