import { useState } from 'react'

// Barva podle úrovně evidence
function evidenceBadge(uroven) {
  if (/strong/i.test(uroven))
    return 'bg-emerald-100 text-emerald-800 border-emerald-300'
  if (/moderate/i.test(uroven))
    return 'bg-blue-100 text-blue-800 border-blue-300'
  if (/NICE/i.test(uroven))
    return 'bg-purple-100 text-purple-800 border-purple-300'
  return 'bg-slate-100 text-slate-700 border-slate-300'
}

// Ikona úrovně evidence
function EvidenceIcon({ uroven }) {
  if (/strong/i.test(uroven))
    return <span title="Strong Support">⭐⭐⭐</span>
  if (/moderate/i.test(uroven))
    return <span title="Moderate Support">⭐⭐</span>
  return <span title="Clinical Support">⭐</span>
}

// Jeden modul (název + seznam technik) — vždy viditelný
function Modul({ modul, index }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
      >
        <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-slate-800 flex-1">{modul.nazev_modulu}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="px-4 py-3 space-y-2 bg-white">
          {modul.techniky.map((t, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span className="leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Jedna terapeutická metoda — karta s accordion moduly
function MetodaKarta({ metoda, index }) {
  const [open, setOpen] = useState(index === 0)
  const bc = evidenceBadge(metoda.uroven_evidence_apa)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Záhlaví karty */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-start gap-3 px-4 py-3 bg-white hover:bg-slate-50 text-left transition-colors"
      >
        <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-bold mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-snug">{metoda.metoda}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${bc}`}>
              <EvidenceIcon uroven={metoda.uroven_evidence_apa} />
              {metoda.uroven_evidence_apa}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform shrink-0 mt-1 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-100 space-y-3">
          {/* Moduly */}
          {metoda.struktura_a_konkretni_postupy?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Strukturované moduly & Techniky</p>
              {metoda.struktura_a_konkretni_postupy.map((m, i) => (
                <Modul key={i} modul={m} index={i} />
              ))}
            </div>
          )}

          {/* Formát a frekvence */}
          {metoda.format_a_frekvence && (
            <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
              <svg className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-0.5">Formát & Frekvence</p>
                <p className="text-xs text-indigo-900 leading-relaxed">{metoda.format_a_frekvence}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Sekce: Nefarmakologická terapie (z guidelines farmakoterapie)
function NefarmakologickaKarta({ polozky }) {
  const [open, setOpen] = useState(true)
  if (!polozky || polozky.length === 0) return null

  return (
    <div className="border border-sky-200 rounded-xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-sky-50 hover:bg-sky-100 text-left transition-colors"
      >
        <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full bg-sky-600 text-white text-sm">
          ★
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-sky-900">Nefarmakologická terapie</p>
          <p className="text-xs text-sky-600 mt-0.5">Doporučené nefarmakologické intervence dle klinických guidelines</p>
        </div>
        <svg
          className={`w-4 h-4 text-sky-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul className="px-4 py-3 space-y-2 bg-white border-t border-sky-100">
          {polozky.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Hlavní komponenta sekce
export default function PsychoterapieSection({ psychoGuideline, nefarmakologickaTerapie = [] }) {
  const metody = psychoGuideline?.psychoterapie_prvni_volby || []
  const maNeco = metody.length > 0 || nefarmakologickaTerapie.length > 0

  if (!maNeco) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
        <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-slate-500">Pro tuto diagnózu zatím nejsou dostupná psychoterapeutická guidelines.</p>
      </div>
    )
  }

  return (
    <section className="print-section space-y-4">

      {/* Záhlaví */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-lg">🧠</span>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Psychoterapeutické postupy & Nefarmakologická terapie
        </h2>
        {metody.length > 0 && (
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
            {metody.length} {metody.length === 1 ? 'metoda' : metody.length < 5 ? 'metody' : 'metod'}
          </span>
        )}
      </div>

      {/* Nefarmakologická terapie nahoře – přehledné shrnutí */}
      {nefarmakologickaTerapie.length > 0 && (
        <NefarmakologickaKarta polozky={nefarmakologickaTerapie} />
      )}

      {/* Podrobné psychoterapeutické metody s Accordion */}
      {metody.length > 0 && (
        <div className="space-y-3">
          {metody.map((m, i) => (
            <MetodaKarta key={i} metoda={m} index={i} />
          ))}
        </div>
      )}

      {/* Pokud jsou jen nefarmakologická data bez psychoterapeutických guidelines */}
      {metody.length === 0 && nefarmakologickaTerapie.length > 0 && (
        <p className="text-xs text-slate-400 text-center pt-2">
          Detailní psychoterapeutické protokoly pro tuto diagnózu nejsou v databázi.
        </p>
      )}

    </section>
  )
}
