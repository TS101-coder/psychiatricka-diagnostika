import { useState, useMemo } from 'react'
import { useSuklDostupnost } from '../hooks/useSuklDostupnost'

/**
 * Badge pro jedno generikum.
 * Zobrazuje počet výpadků konkrétních výrobků dle SÚKL.
 * DŮLEŽITÉ: Výpadek výrobku ≠ nedostupnost látky.
 * Jeden INN má zpravidla více výrobců – kliknutím se otevře SÚKL pro ověření.
 */
function SuklBadge({ generikum, stavDostupnosti, nacitam }) {
  const stav = stavDostupnosti[generikum]

  // Načítání – pulzující badge
  if (nacitam) return (
    <span className="font-mono text-xs bg-slate-100 text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full animate-pulse">
      {generikum}
    </span>
  )

  const pocet = stav?.pocetVypadku
  const suklUrl = stav?.suklUrl

  // Chyba načítání nebo neznámý stav
  if (pocet === null || pocet === undefined) return (
    <a href={suklUrl} target="_blank" rel="noopener noreferrer"
      className="font-mono text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
    >{generikum}</a>
  )

  // Výpadky u některých výrobců – informační hnědooranžový badge + link na SÚKL
  if (pocet > 0) {
    const tooltip = stav.vypadky?.map(v => `${v.nazev} (${v.obnoveni})`).join('\n') || ''
    return (
      <a
        href={suklUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`${pocet} výrobek/výrobců s hlášeným výpadkem dle SÚKL.\nVýpadek výrobce ≠ nedostupnost látky.\nKliknutím ověřte dostupnost přímo na SÚKL.\n\n${tooltip}`}
        className="font-mono text-xs bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
      >
        <span>⚠</span>
        <span>{generikum}</span>
        <span className="text-amber-600 font-normal">({pocet}×)</span>
      </a>
    )
  }

  // Žádné výpadky – modrý badge + link na SÚKL
  return (
    <a
      href={suklUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`Žádné hlášené výpadky dle SÚKL. Kliknutím ověřte na SÚKL.`}
      className="font-mono text-xs bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full hover:bg-blue-100 transition-colors"
    >
      {generikum}
    </a>
  )
}

function DrugCard({ drug, index, colorClass, stavDostupnosti, nacitam }) {
  const [open, setOpen] = useState(index === 0)

  // Počet generik s výpadky (jen pro záhlaví karty)
  const pocetSVypadkem = drug.priklady_generik?.filter(
    g => (stavDostupnosti[g]?.pocetVypadku ?? 0) > 0
  ).length ?? 0

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
      >
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${colorClass}`}>
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-slate-800 flex-1">{drug.skupina_latek}</span>
        {/* Informační badge – neznamená "nedostupné", jen "výpadek u části výrobců" */}
        {pocetSVypadkem > 0 && !nacitam && (
          <span className="text-xs text-amber-700 font-medium shrink-0">
            ⚠ {pocetSVypadkem} {pocetSVypadkem === 1 ? 'látka' : pocetSVypadkem < 5 ? 'látky' : 'látek'} s výpadkem výrobce
          </span>
        )}
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="p-3 space-y-2.5 bg-white text-sm">
          {/* Generika – každý je odkaz na SÚKL, žlutý badge pokud má výpadky */}
          {drug.priklady_generik?.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex flex-wrap gap-1.5">
                {drug.priklady_generik.map(g => (
                  <SuklBadge
                    key={g}
                    generikum={g}
                    stavDostupnosti={stavDostupnosti}
                    nacitam={nacitam}
                  />
                ))}
                {drug.dostupnost_cr_sukl && !nacitam && (
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                    ✓ SÚKL registrováno
                  </span>
                )}
              </div>
              {/* Vysvětlivka jen pokud jsou výpadky */}
              {pocetSVypadkem > 0 && !nacitam && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  ⚠ Číslo v závorce = počet hlášených výpadků konkrétních výrobků dle SÚKL.
                  Výpadek jednoho výrobce <strong>neznamená nedostupnost látky</strong> –
                  kliknutím na název ověřte aktuální dostupnost přímo na SÚKL.
                </p>
              )}
            </div>
          )}

          {/* Davkovani */}
          {drug.doporucene_davkovani_zahajovaci && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Zahajovací dávkování</p>
              <p className="text-slate-700 text-xs leading-relaxed">{drug.doporucene_davkovani_zahajovaci}</p>
            </div>
          )}

          {/* SUKL poznamka */}
          {drug.sukl_poznamka && (
            <div className="bg-amber-50 border border-amber-200 rounded p-2">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">ℹ SÚKL / Preskripce: </span>
                {drug.sukl_poznamka}
              </p>
            </div>
          )}

          {/* Nezadouci ucinky */}
          {drug.hlavni_nezadouci_ucinky?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Hlavní nežádoucí účinky</p>
              <div className="flex flex-wrap gap-1">
                {drug.hlavni_nezadouci_ucinky.map(u => (
                  <span key={u} className="text-xs bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Kontraindikace */}
          {drug.kontraindikace?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-0.5">Kontraindikace</p>
              <ul className="space-y-0.5">
                {drug.kontraindikace.map((k, i) => (
                  <li key={i} className="text-xs text-slate-700 flex gap-1">
                    <span className="text-red-500 shrink-0">•</span>{k}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Indikace k nasazeni (2. volba) */}
          {drug.indikace_k_nasazeni && (
            <div className="bg-slate-50 rounded p-2">
              <p className="text-xs text-slate-600">
                <span className="font-semibold">Kdy nasadit: </span>
                {drug.indikace_k_nasazeni}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GuidelinesSection({ guideline }) {
  const [showSafety, setShowSafety] = useState(false)

  if (!guideline) return null

  const farma1 = guideline.terapie_prvni_volby?.farmakoterapie || []
  const farma2 = guideline.terapie_druhe_volby?.farmakoterapie || []
  const safety = guideline.zvlastni_upozorneni_a_bezpecnost
  const zdroje = guideline.zdroje || []

  // Sesbíráme všechna generika pro SÚKL checker
  const vsechnaGenerika = useMemo(() => {
    const gen = new Set()
    ;[...farma1, ...farma2].forEach(f =>
      f.priklady_generik?.forEach(g => gen.add(g))
    )
    return [...gen]
  }, [farma1, farma2])

  const { stavDostupnosti, nacitam, chyba } = useSuklDostupnost(vsechnaGenerika)

  return (
    <section className="print-section">
      {/* Záhlaví */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
          Terapeutické postupy & Medikace
        </h2>
        {nacitam && (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Ověřuji dostupnost v SÚKL…
          </span>
        )}
        {chyba && (
          <span className="text-xs text-slate-400" title={chyba}>⚠ SÚKL offline</span>
        )}
        <span className="text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
          Guidelines
        </span>
      </div>

      <div className="space-y-4">

        {/* 1. volba – farmakoterapie */}
        {farma1.length > 0 && (
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              Farmakoterapie první volby
            </p>
            <div className="space-y-2">
              {farma1.map((drug, i) => (
                <DrugCard key={i} drug={drug} index={i} colorClass="bg-emerald-100 text-emerald-800" stavDostupnosti={stavDostupnosti} nacitam={nacitam} />
              ))}
            </div>
          </div>
        )}

        {/* 2. volba */}
        {farma2.length > 0 && (
          <div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <span className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              Farmakoterapie druhé volby / augmentace
            </p>
            <div className="space-y-2">
              {farma2.map((drug, i) => (
                <DrugCard key={i} drug={drug} index={i} colorClass="bg-amber-100 text-amber-800" stavDostupnosti={stavDostupnosti} nacitam={nacitam} />
              ))}
            </div>
          </div>
        )}

        {/* Bezpecnost */}
        {safety && (
          <div>
            <button
              onClick={() => setShowSafety(v => !v)}
              className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wide mb-1 hover:text-red-800"
            >
              <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">!</span>
              Bezpečnost & Upozornění
              <svg className={`w-3 h-3 transition-transform ${showSafety ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showSafety && (
              <div className="space-y-2 mt-2">
                {safety.black_box_warning && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-xs font-bold text-red-700 mb-1">⚠ Black Box / Kritické varování</p>
                    <p className="text-xs text-red-800 leading-relaxed">{safety.black_box_warning}</p>
                  </div>
                )}
                {safety.interakce?.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-orange-700 mb-1">Kritické lékové interakce</p>
                    <ul className="space-y-0.5">
                      {safety.interakce.map((i, idx) => (
                        <li key={idx} className="text-xs text-orange-900 flex gap-1">
                          <span className="shrink-0">•</span>{i}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {safety.monitoring?.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-bold text-blue-700 mb-1">Monitoring</p>
                    <ul className="space-y-0.5">
                      {safety.monitoring.map((m, idx) => (
                        <li key={idx} className="text-xs text-blue-900 flex gap-1">
                          <span className="shrink-0">•</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Zdroje */}
        {zdroje.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Zdroje & Guidelines</p>
            <div className="flex flex-wrap gap-1.5">
              {zdroje.map((z, i) => {
                const nazev = typeof z === 'object' ? z.nazev : z;
                const url   = typeof z === 'object' ? z.url   : null;
                return url ? (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded px-2 py-1 transition-colors"
                    title={nazev}
                  >
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {nazev}
                  </a>
                ) : (
                  <span key={i} className="inline-flex items-center text-xs bg-slate-50 text-slate-500 border border-slate-200 rounded px-2 py-1">
                    {nazev}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
