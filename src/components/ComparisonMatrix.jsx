import { useMemo } from 'react'
import { SLOVNIK_PRIZNAKU } from '../data/symptomTaxonomy'

function PriznakySloupec({ nadpis, klice, colorClass, emptyText }) {
  return (
    <div className={`rounded-xl border p-4 ${colorClass}`}>
      <h5 className="text-xs font-bold uppercase tracking-wide mb-3 opacity-80">{nadpis}</h5>
      {klice.length === 0 ? (
        <p className="text-xs opacity-50 italic">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {klice.map(klic => (
            <li key={klic} className="flex items-start gap-2 text-xs leading-snug">
              <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 opacity-60 bg-current" />
              {SLOVNIK_PRIZNAKU[klic] ?? klic}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * ComparisonMatrix — vizualizuje překryv a rozdíly příznaků dvou diagnóz.
 *
 * Zobrazuje pouze diagnózy, které mají alespoň jeden klíč v priznakyKlice.
 * Pokud ani jedna diagnóza klíče nemá, vrátí null (graceful degradation).
 */
export default function ComparisonMatrix({ diagnozaA, diagnozaB, barvaA, barvaB }) {
  const kliceA = diagnozaA?.priznakyKlice ?? []
  const kliceB = diagnozaB?.priznakyKlice ?? []

  const { spolecne, pouzeA, pouzeB } = useMemo(() => ({
    spolecne: kliceA.filter(k => kliceB.includes(k)),
    pouzeA:   kliceA.filter(k => !kliceB.includes(k)),
    pouzeB:   kliceB.filter(k => !kliceA.includes(k)),
  }), [kliceA, kliceB])

  // Nevykreslit nic pokud obě diagnózy nemají žádná klíčová data
  if (kliceA.length === 0 && kliceB.length === 0) return null

  const overlapPct = kliceA.length + kliceB.length > 0
    ? Math.round((spolecne.length * 2 / (kliceA.length + kliceB.length)) * 100)
    : 0

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden print-section">
      {/* Záhlaví */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-slate-700">Taxonomie příznaků</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Strukturované srovnání dle unifikovaných symptomových klíčů
          </p>
        </div>
        {/* Překryvový indikátor */}
        <div className="text-right shrink-0">
          <span className="text-2xl font-bold text-slate-700">{overlapPct}%</span>
          <p className="text-xs text-slate-400">překryv</p>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3">
        {/* Sloupec A — příznaky pouze u první diagnózy */}
        <PriznakySloupec
          nadpis={`Pouze ${diagnozaA.kod}`}
          klice={pouzeA}
          colorClass="bg-red-50 border-red-200 text-red-800"
          emptyText="Žádné specifické příznaky"
        />

        {/* Sloupec Společné */}
        <PriznakySloupec
          nadpis="Společné překryvy"
          klice={spolecne}
          colorClass="bg-emerald-50 border-emerald-200 text-emerald-800"
          emptyText="Žádný překryv příznaků"
        />

        {/* Sloupec B — příznaky pouze u druhé diagnózy */}
        <PriznakySloupec
          nadpis={`Pouze ${diagnozaB.kod}`}
          klice={pouzeB}
          colorClass="bg-blue-50 border-blue-200 text-blue-800"
          emptyText="Žádné specifické příznaky"
        />
      </div>

      {/* Upozornění na diagnózy bez klíčů */}
      {(kliceA.length === 0 || kliceB.length === 0) && (
        <div className="mx-4 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            <span className="font-semibold">Poznámka: </span>
            {kliceA.length === 0 ? diagnozaA.kod : diagnozaB.kod} nemá definované symptomové klíče —
            srovnání je částečné.
          </p>
        </div>
      )}
    </div>
  )
}
