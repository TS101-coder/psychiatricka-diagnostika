import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SKALY from '../data/skaly'

const BARVA_INTERPRETACE = {
  green:  { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  yellow: { bg: 'bg-yellow-50',  border: 'border-yellow-200',  text: 'text-yellow-800',  dot: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800',  dot: 'bg-orange-500' },
  red:    { bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-800',     dot: 'bg-red-500' },
}

const BARVA_KAT = {
  deprese:   'bg-yellow-100 text-yellow-800 border-yellow-300',
  uzkost:    'bg-orange-100 text-orange-800 border-orange-300',
  ptsd:      'bg-red-100 text-red-800 border-red-300',
  bipolarni: 'bg-purple-100 text-purple-800 border-purple-300',
  psychoza:  'bg-violet-100 text-violet-800 border-violet-300',
  ocd:       'bg-teal-100 text-teal-800 border-teal-300',
  alkohol:   'bg-amber-100 text-amber-800 border-amber-300',
  spanek:    'bg-indigo-100 text-indigo-800 border-indigo-300',
  adhd:      'bg-sky-100 text-sky-800 border-sky-300',
  kognitivni:'bg-green-100 text-green-800 border-green-300',
  obecne:    'bg-slate-100 text-slate-800 border-slate-300',
  deti:      'bg-pink-100 text-pink-800 border-pink-300',
}

function ProgressBar({ hodnota, maximum, barva }) {
  const pct = Math.round((hodnota / maximum) * 100)
  const barvaBar = {
    green: 'bg-emerald-500', yellow: 'bg-yellow-500',
    orange: 'bg-orange-500', red: 'bg-red-500',
  }[barva] || 'bg-blue-500'

  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${barvaBar}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function SkalaDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const skala = useMemo(() => SKALY.find(s => s.id === id), [id])
  const [odpovedi, setOdpovedi] = useState({})
  const [zobrazitVysledek, setZobrazitVysledek] = useState(false)

  if (!skala) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p>Škála <strong>{id}</strong> nebyla nalezena.</p>
        <button onClick={() => navigate('/skaly')} className="mt-4 text-rose-600 hover:underline text-sm">
          Zpět na přehled škál
        </button>
      </div>
    )
  }

  // Výpočet skóre
  const zodpovezeno = skala.otazky.filter(q => odpovedi[q.id] !== undefined).length
  const celkem = skala.otazky.length
  const hotovo = zodpovezeno === celkem

  const skore = useMemo(() => {
    return skala.otazky.reduce((sum, q) => {
      const val = odpovedi[q.id]
      return val !== undefined ? sum + val : sum
    }, 0)
  }, [odpovedi, skala])

  // Výsledné skóre (s násobitelem pro WHO-5)
  const skoreZobrazeni = skala.skoring.nasobitel
    ? skore * skala.skoring.nasobitel
    : skore
  const skoreMax = skala.skoring.nasobitel
    ? skala.skoring.rozsah[1] * skala.skoring.nasobitel
    : skala.skoring.rozsah[1]

  // Interpretace
  const interpretace = useMemo(() => {
    if (!hotovo) return null
    return skala.skoring.interpretace.find(
      i => skore >= i.od && skore <= i.do
    ) || null
  }, [skore, hotovo, skala])

  function nastavOdpoved(otazkaId, hodnota) {
    setOdpovedi(prev => ({ ...prev, [otazkaId]: hodnota }))
    setZobrazitVysledek(false)
  }

  function reset() {
    setOdpovedi({})
    setZobrazitVysledek(false)
  }

  const badgeKat = BARVA_KAT[skala.kategorie] || BARVA_KAT.obecne

  return (
    <div className="max-w-3xl mx-auto">
      {/* Zpět */}
      <button
        onClick={() => navigate('/skaly')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Škály a dotazníky
      </button>

      {/* Záhlaví */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <span className={`font-mono text-lg font-bold px-3 py-1 rounded-lg border ${badgeKat}`}>
              {skala.zkratka}
            </span>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{skala.nazev}</h1>
              <p className="text-xs text-slate-500 mt-0.5">{skala.casNaplneni} · {skala.pocetOtazek} položek · skóre {skala.skoring.rozsah[0]}–{skala.skoring.rozsah[1]}{skala.skoring.nasobitel ? ` (×${skala.skoring.nasobitel} → ${skala.skoring.rozsah[0]*skala.skoring.nasobitel}–${skala.skoring.rozsah[1]*skala.skoring.nasobitel} %)` : ''}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{skala.popis}</p>

          {/* Instrukce */}
          {skala.instrukce && (
            <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-semibold">Instrukce: </span>{skala.instrukce}
              </p>
            </div>
          )}
        </div>

        {/* Průběh vyplňování */}
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Zodpovězeno {zodpovezeno} / {celkem}</span>
            {zodpovezeno > 0 && !hotovo && (
              <span className="text-slate-400">Zbývá {celkem - zodpovezeno} otázek</span>
            )}
            {hotovo && (
              <span className="text-emerald-600 font-medium">✓ Vše zodpovězeno</span>
            )}
          </div>
          <ProgressBar
            hodnota={zodpovezeno}
            maximum={celkem}
            barva={hotovo ? 'green' : 'yellow'}
          />
        </div>
      </div>

      {/* Otázky */}
      <div className="space-y-3">
        {skala.otazky.map((otazka, idx) => {
          const vybrano = odpovedi[otazka.id]
          const zodpovezena = vybrano !== undefined

          return (
            <div
              key={otazka.id}
              className={`bg-white rounded-xl border p-4 transition-colors ${
                zodpovezena ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              }`}
            >
              <div className="flex gap-3 mb-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                  zodpovezena ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {zodpovezena ? '✓' : idx + 1}
                </span>
                <p className="text-sm text-slate-800 leading-relaxed">{otazka.text}</p>
              </div>

              <div className="ml-9 flex flex-wrap gap-2">
                {otazka.odpovedi.map(odp => (
                  <button
                    key={odp.hodnota}
                    onClick={() => nastavOdpoved(otazka.id, odp.hodnota)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-medium ${
                      vybrano === odp.hodnota
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {odp.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Výsledek */}
      {hotovo && (
        <div className="mt-6 space-y-3">
          {/* Skóre */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800">Celkové skóre</h3>
              <span className="text-3xl font-bold text-slate-900">
                {skoreZobrazeni}
                <span className="text-lg text-slate-400 font-normal"> / {skoreMax}{skala.skoring.nasobitel ? ' %' : ''}</span>
              </span>
            </div>
            <ProgressBar
              hodnota={skore - skala.skoring.rozsah[0]}
              maximum={skala.skoring.rozsah[1] - skala.skoring.rozsah[0]}
              barva={interpretace?.barva || 'green'}
            />
          </div>

          {/* Interpretace */}
          {interpretace && (() => {
            const b = BARVA_INTERPRETACE[interpretace.barva] || BARVA_INTERPRETACE.green
            return (
              <div className={`rounded-xl border-2 p-4 ${b.bg} ${b.border}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full shrink-0 ${b.dot}`} />
                  <h4 className={`font-bold text-base ${b.text}`}>{interpretace.label}</h4>
                </div>
                {interpretace.popis && (
                  <p className={`text-sm leading-relaxed ${b.text} opacity-90`}>{interpretace.popis}</p>
                )}
                {skala.poznamka && (
                  <p className={`text-xs mt-2 ${b.text} opacity-75 border-t border-current border-opacity-20 pt-2`}>
                    ⚠ {skala.poznamka}
                  </p>
                )}
              </div>
            )
          })()}

          {/* Tabulka cut-offů */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Interpretační tabulka</h4>
            </div>
            <div className="divide-y divide-slate-50">
              {skala.skoring.interpretace.map((i, idx) => {
                const b = BARVA_INTERPRETACE[i.barva] || BARVA_INTERPRETACE.green
                const jeAktivni = hotovo && skore >= i.od && skore <= i.do
                return (
                  <div key={idx} className={`flex items-center gap-3 px-4 py-2.5 ${jeAktivni ? b.bg : ''}`}>
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${b.dot}`} />
                    <span className="text-xs font-mono text-slate-400 shrink-0 w-14">
                      {i.od}–{i.do}
                    </span>
                    <span className={`text-sm font-medium flex-1 ${jeAktivni ? b.text : 'text-slate-700'}`}>
                      {i.label}
                    </span>
                    {jeAktivni && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${b.bg} ${b.text} border ${b.border}`}>
                        ← váš výsledek
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Akce */}
          <div className="flex gap-3 pb-6">
            <button
              onClick={reset}
              className="flex-1 text-sm px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600 font-medium"
            >
              Vyplnit znovu
            </button>
            <button
              onClick={() => window.print()}
              className="text-sm px-4 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              Tisk / PDF
            </button>
          </div>
        </div>
      )}

      {/* Zdroj */}
      <div className="mt-4 pt-4 border-t border-slate-100 pb-8 space-y-1.5">
        <p className="text-xs text-slate-400">
          <span className="font-medium">Zdroj: </span>{skala.zdroj}
          {skala.url && (
            <> · <a href={skala.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{skala.url}</a></>
          )}
        </p>
        {skala.licencniUpozorneni && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
            ℹ️ <span className="font-medium">Licence: </span>{skala.licencniUpozorneni}
          </p>
        )}
        <p className="text-xs text-slate-400">
          Tento nástroj slouží pouze jako podpůrný klinický nástroj a nenahrazuje klinické vyšetření.
        </p>
      </div>
    </div>
  )
}
