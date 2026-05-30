import { useNavigate } from 'react-router-dom'
import { SKALY, KATEGORIE_SKAL } from '../data/skaly'

const BARVA = {
  deprese:   { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  uzkost:    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  ptsd:      { bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800',    badge: 'bg-red-100 text-red-700 border-red-200' },
  bipolarni: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
  psychoza:  { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-800', badge: 'bg-violet-100 text-violet-700 border-violet-200' },
  ocd:       { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-800',   badge: 'bg-teal-100 text-teal-700 border-teal-200' },
  alkohol:   { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-800',  badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  spanek:    { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  adhd:      { bg: 'bg-sky-50',    border: 'border-sky-200',    text: 'text-sky-800',    badge: 'bg-sky-100 text-sky-700 border-sky-200' },
  kognitivni:{ bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-800',  badge: 'bg-green-100 text-green-700 border-green-200' },
  obecne:    { bg: 'bg-slate-50',  border: 'border-slate-200',  text: 'text-slate-800',  badge: 'bg-slate-100 text-slate-700 border-slate-200' },
}

function SkalaKarta({ skala }) {
  const navigate = useNavigate()
  const b = BARVA[skala.kategorie] || BARVA.obecne

  return (
    <button
      onClick={() => navigate(`/skaly/${skala.id}`)}
      className={`w-full text-left rounded-xl border-2 p-4 transition-all hover:shadow-sm hover:-translate-y-0.5 ${b.border} ${b.bg}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${b.badge}`}>
          {skala.zkratka}
        </span>
        <span className="text-xs text-slate-400 shrink-0">{skala.casNaplneni}</span>
      </div>
      <p className={`text-sm font-semibold leading-snug mb-1 ${b.text}`}>{skala.nazev}</p>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{skala.popis}</p>
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-slate-400">{skala.pocetOtazek} položek</span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400">
          {skala.skoring.rozsah[0]}–{skala.skoring.rozsah[1]} bodů
        </span>
      </div>
    </button>
  )
}

export default function SkalyHome() {
  const skupiny = KATEGORIE_SKAL
    .map(kat => ({ kat, skaly: SKALY.filter(s => s.kategorie === kat.id) }))
    .filter(({ skaly }) => skaly.length > 0)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Diagnostické škály</h1>
        <p className="text-slate-500 text-sm">
          {SKALY.length} volně dostupných nástrojů pro screening a hodnocení závažnosti.
          Kliknutím na škálu spustíte interaktivní kalkulátor.
        </p>
      </div>

      <div className="space-y-8">
        {skupiny.map(({ kat, skaly }) => {
          const b = BARVA[kat.id] || BARVA.obecne
          return (
            <section key={kat.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{kat.ikona}</span>
                <h2 className={`text-sm font-bold uppercase tracking-wide ${b.text}`}>{kat.nazev}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.badge}`}>
                  {skaly.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {skaly.map(s => <SkalaKarta key={s.id} skala={s} />)}
              </div>
            </section>
          )
        })}
      </div>

      <p className="mt-8 text-xs text-slate-400 text-center pb-4">
        Všechny škály jsou určeny pouze jako podpůrný klinický nástroj. Výsledky nenahrazují klinické vyšetření.
      </p>
    </div>
  )
}
