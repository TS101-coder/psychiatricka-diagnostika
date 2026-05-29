import { useParams, useNavigate } from 'react-router-dom'
import { useDsm5Code, getDsm5Color, DSM5_COLOR_CLASSES } from '../hooks/useDsm5'

export default function Dsm5Detail() {
  const { id } = useParams()
  const diagnoza = useDsm5Code(id)
  const navigate = useNavigate()

  if (!diagnoza) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>DSM-5 kód <strong>{id}</strong> nebyl nalezen.</p>
        <button onClick={() => navigate('/dsm5')} className="mt-4 text-blue-600 hover:underline text-sm">
          Zpět na přehled DSM-5
        </button>
      </div>
    )
  }

  const color = getDsm5Color(diagnoza.chapter)
  const bc = DSM5_COLOR_CLASSES[color] || DSM5_COLOR_CLASSES.gray

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigace */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-500 no-print">
        <button onClick={() => navigate(-1)} className="hover:text-slate-800 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Zpět
        </button>
        <span>/</span>
        <span className="text-slate-400 text-xs">DSM-5-TR</span>
        <span>/</span>
        <span className="text-slate-800">{diagnoza.code}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Záhlaví */}
        <div className={`px-6 py-5 border-b-4 ${bc.border} ${bc.bg}`}>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`font-mono text-xl font-bold ${bc.text}`}>{diagnoza.code}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-white bg-opacity-70 text-slate-600 border border-slate-200">
                  DSM-5-TR
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bc.bg} ${bc.text} border ${bc.border}`}>
                  ICD-10-CM
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{diagnoza.name}</h1>
              <p className="text-sm text-slate-600">{diagnoza.chapter}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Popis */}
          {diagnoza.description && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Popis</h2>
              <p className="text-slate-800 leading-relaxed">{diagnoza.description}</p>
            </section>
          )}

          {/* Diagnostická kritéria */}
          {diagnoza.diagnostic_criteria?.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Diagnostická kritéria{' '}
                <span className={`font-semibold normal-case ${bc.text}`}>DSM-5-TR</span>
              </h2>
              <div className="space-y-3">
                {diagnoza.diagnostic_criteria.map((criterion, i) => {
                  const letter = criterion.match(/^([A-H])\./)?.[1] || String(i + 1)
                  const content = criterion.replace(/^[A-H]\.\s*/, '')
                  return (
                    <div key={i} className="flex gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${bc.bg} ${bc.text}`}>
                        {letter}
                      </span>
                      <p className="text-sm text-slate-800 leading-relaxed pt-0.5">{content}</p>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3 italic">
                Zdroj: DSM-5-TR, American Psychiatric Association, 2022
              </p>
            </section>
          )}

          {!diagnoza.diagnostic_criteria?.length && (
            <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-500 border border-slate-200">
              Pro tuto diagnózu jsou kritéria definována v rámci nadřazené diagnózy nebo jsou specifičtěji popsána v kapitole manuálu (str. {diagnoza.dsm_page}).
            </div>
          )}

          {/* Informace o stránce v manuálu */}
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Zdroj</h2>
            <div className={`rounded-lg p-4 border ${bc.border} ${bc.bg}`}>
              <p className="text-sm text-slate-700">
                <span className="font-medium">DSM-5-TR</span> — American Psychiatric Association (2022)
                <br />
                <span className="text-slate-500">Strana: {diagnoza.dsm_page} | ICD-10-CM kód: {diagnoza.code}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
