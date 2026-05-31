import { useState, useMemo, useEffect } from 'react'
import { NavLink, useSearchParams } from 'react-router-dom'
import { SLOVNIK_PRIZNAKU } from '../data/symptomTaxonomy'
import PRIZNAKY_KLICE from '../data/priznakyKlice'
import guidelines from '../data/clinicalGuidelines_MKN10.json'
import klinickeGuidelines from '../data/guidelines.json'

const odstranDiakritiku = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Kategorie příznaků pokrývající všech 59 klíčů
const KATEGORIE = {
  'Kognitivní a paměť':     ['cognitive_decline','memory_short_term','memory_long_term','aphasia','apraxia','agnosia','consciousness_impaired','fluctuating_course','insidious_onset','abrupt_onset'],
  'Neurologické':            ['focal_neurology','ct_mri_ischemia'],
  'Psychotické':             ['delusions_paranoid','delusions_somatic','hallucinations_auditory','hallucinations_visual','disorganized_speech','negative_symptoms','catatonia','thought_insertion','social_dysfunction'],
  'Depresivní a afektivní':  ['depressed_mood','anhedonia','loss_of_energy','suicidal_ideation','sleep_disturbance_insomnia','sleep_disturbance_hypersomnia','psychomotor_retardation','guilt_worthlessness','concentration_impaired','emotional_lability'],
  'Manické':                 ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','psychomotor_agitation'],
  'Úzkostné':                ['anxiety_general','panic_attacks','phobic_avoidance','obsessions','compulsions','worry_excessive','somatic_anxiety','hypervigilance','derealization'],
  'Poruchy příjmu potravy':  ['restriction_eating','fear_weight_gain','body_image_distortion','binge_eating','purging','low_bmi'],
  'Poruchy osobnosti':       ['identity_instability','impulsivity','intense_relationships','emptiness','dissociation','grandiose_self','lack_empathy','exploitative'],
}

const BARVA_SHODY = (pct) => {
  if (pct >= 75) return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', bar: 'bg-emerald-500' }
  if (pct >= 50) return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',   bar: 'bg-yellow-500' }
  return              { badge: 'bg-orange-100 text-orange-800 border-orange-300',     bar: 'bg-orange-400' }
}

export default function DiagnosticCalculator() {
  const [searchParams] = useSearchParams()
  const [vek, setVek]             = useState('')
  const [pohlavi, setPohlavi]     = useState('ALL')
  const [searchQuery, setSearch]  = useState('')
  const [vybranePriznaky, setVP]  = useState([])
  const [viewMode, setViewMode]   = useState('abecedne') // 'abecedne' | 'kategorie'
  const [openKat, setOpenKat]     = useState(new Set(Object.keys(KATEGORIE)))
  const [zkopirovanoId, setZkopirovanoId] = useState(null)

  // Vyhledávací mapa klinických guidelines (farmakoterapie) dle kódu MKN-10
  const klinickaMap = useMemo(() =>
    Object.fromEntries(klinickeGuidelines.map(g => [g.kod_mkn10, g])),
  [])

  // Předvyplnění příznaků z URL parametru ?kod=F32
  useEffect(() => {
    const kod = searchParams.get('kod')
    if (kod && PRIZNAKY_KLICE[kod]) {
      setVP(PRIZNAKY_KLICE[kod])
    }
  }, [searchParams])

  const abecedniPriznaky = useMemo(() =>
    Object.entries(SLOVNIK_PRIZNAKU)
      .map(([klic, text]) => ({ klic, text }))
      .sort((a, b) => a.text.localeCompare(b.text, 'cs')),
  [])

  const filtrovanePriznaky = useMemo(() => {
    if (!searchQuery) return abecedniPriznaky
    const q = odstranDiakritiku(searchQuery)
    return abecedniPriznaky.filter(p => odstranDiakritiku(p.text).includes(q))
  }, [searchQuery, abecedniPriznaky])

  function togglePriznak(klic) {
    setVP(prev => prev.includes(klic) ? prev.filter(p => p !== klic) : [...prev, klic])
  }

  function resetVse() {
    setVek(''); setPohlavi('ALL'); setSearch(''); setVP([])
  }

  function kopirujDoDekurzu(diag) {
    const textPriznaky = diag.shodnePriznaky
      .map(klic => SLOVNIK_PRIZNAKU[klic])
      .join(', ')

    // Pokus najít farmakoterapii z klinických guidelines
    const klinGuideline = klinickaMap[diag.kod_mkn10]
    const farma1 = klinGuideline?.terapie_prvni_volby?.farmakoterapie?.[0]
    const skupinaLatek = farma1?.skupina_latek ?? '—'
    const generika = farma1?.priklady_generik?.join(', ') ?? '—'

    const pct = `${diag.pctZadanych} % ze zadaných příznaků | ${diag.pctDiagnozy} % pokrytí diagnózy`

    const text = [
      `DIFERENCIÁLNÍ ROZVAHA (MKN-10)`,
      `────────────────────────────────`,
      `Diagnóza:          ${diag.kod_mkn10} – ${diag.nazev_poruchy}`,
      `Věkový rozsah:     ${diag.vek_min}–${diag.vek_max} let`,
      `Shoda příznaků:    ${pct}`,
      ``,
      `Přítomné příznaky:`,
      `  ${textPriznaky}`,
      ``,
      `Farmakoterapie I. volby:`,
      `  Skupina: ${skupinaLatek}`,
      `  Generika: ${generika}`,
      ``,
      `Zdroj: Psychiatrická diagnostika CDSS`,
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setZkopirovanoId(diag.kod_mkn10)
      setTimeout(() => setZkopirovanoId(null), 2000)
    })
  }

  function toggleKat(nazev) {
    setOpenKat(prev => {
      const next = new Set(prev)
      next.has(nazev) ? next.delete(nazev) : next.add(nazev)
      return next
    })
  }

  const odpovidajiciDiagnozy = useMemo(() => {
    if (vybranePriznaky.length === 0) return []
    const vekNum = vek === '' ? null : Number(vek)
    return guidelines
      .map(diag => {
        const vekOk = vekNum === null || (vekNum >= diag.vek_min && vekNum <= diag.vek_max)
        const pohlaviOk = pohlavi === 'ALL' || diag.pohlavi === 'ALL' || diag.pohlavi === pohlavi
        if (!vekOk || !pohlaviOk) return null
        const diagKlice = diag.priznaky_klice || []
        const shodne = diagKlice.filter(k => vybranePriznaky.includes(k))
        if (shodne.length === 0) return null
        const pctZadanych  = Math.round((shodne.length / vybranePriznaky.length) * 100)
        const pctDiagnozy  = Math.round((shodne.length / diagKlice.length) * 100)
        return { ...diag, shodnePriznaky: shodne, pctZadanych, pctDiagnozy, pocetShodnych: shodne.length }
      })
      .filter(Boolean)
      .sort((a, b) => b.pctZadanych - a.pctZadanych || b.pocetShodnych - a.pocetShodnych)
  }, [vek, pohlavi, vybranePriznaky])

  const pocetZadanych = vybranePriznaky.length

  // Checkbox pro jeden příznak
  function PriznakyItem({ klic }) {
    const vybran = vybranePriznaky.includes(klic)
    const text = SLOVNIK_PRIZNAKU[klic]
    if (!text) return null
    return (
      <label className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${vybran ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
        <input type="checkbox" checked={vybran} onChange={() => togglePriznak(klic)} className="w-4 h-4 rounded accent-blue-600 shrink-0" />
        <span className={`text-xs leading-snug ${vybran ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>{text}</span>
      </label>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Záhlaví */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diferenciální kalkulačka MKN-10</h1>
          <p className="text-sm text-slate-500 mt-0.5">Zadejte demografii a zaškrtněte příznaky. Systém seřadí diagnózy podle shody.</p>
        </div>
        {(pocetZadanych > 0 || vek !== '' || pohlavi !== 'ALL') && (
          <button onClick={resetVse} className="shrink-0 text-xs px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Začít znovu
          </button>
        )}
      </div>

      {/* Hlavní layout – responsive */}
      <div className="flex flex-col md:flex-row gap-5 items-start">

        {/* ══ LEVÝ PANEL ══ */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-4">

          {/* Demografie */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demografie pacienta</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Věk</label>
                <input type="number" min="0" max="120" value={vek}
                  onChange={e => setVek(e.target.value)} placeholder="Např. 35"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Pohlaví</label>
                <select value={pohlavi} onChange={e => setPohlavi(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white">
                  <option value="ALL">Vše</option>
                  <option value="M">Muž</option>
                  <option value="F">Žena</option>
                </select>
              </div>
            </div>
          </div>

          {/* Příznaky */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Klinické příznaky</h3>
                {pocetZadanych > 0 && (
                  <button onClick={() => setVP([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                    Odznačit vše ({pocetZadanych})
                  </button>
                )}
              </div>

              {/* Vyhledávač */}
              <div className="relative mb-2">
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" value={searchQuery} onChange={e => setSearch(e.target.value)}
                  placeholder="Hledat příznak..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
              </div>

              {/* Přepínač zobrazení – jen bez aktivního hledání */}
              {!searchQuery && (
                <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
                  <button onClick={() => setViewMode('abecedne')}
                    className={`flex-1 text-xs py-1 rounded-md transition-colors ${viewMode === 'abecedne' ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                    Abecedně
                  </button>
                  <button onClick={() => setViewMode('kategorie')}
                    className={`flex-1 text-xs py-1 rounded-md transition-colors ${viewMode === 'kategorie' ? 'bg-white text-slate-800 shadow-sm font-medium' : 'text-slate-500 hover:text-slate-700'}`}>
                    Dle kategorií
                  </button>
                </div>
              )}
            </div>

            {/* Abecední seznam */}
            {(searchQuery || viewMode === 'abecedne') && (
              <div className="overflow-y-auto max-h-[480px] divide-y divide-slate-50">
                {filtrovanePriznaky.map(p => <PriznakyItem key={p.klic} klic={p.klic} />)}
                {filtrovanePriznaky.length === 0 && (
                  <div className="py-8 text-center text-xs text-slate-400">Žádný příznak neodpovídá hledání</div>
                )}
              </div>
            )}

            {/* Kategorický seznam */}
            {!searchQuery && viewMode === 'kategorie' && (
              <div className="overflow-y-auto max-h-[480px]">
                {Object.entries(KATEGORIE).map(([nazev, klice]) => {
                  const isOpen = openKat.has(nazev)
                  const vybrano = klice.filter(k => vybranePriznaky.includes(k)).length
                  return (
                    <div key={nazev} className="border-b border-slate-100 last:border-0">
                      <button onClick={() => toggleKat(nazev)}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 text-left">
                        <span className="text-xs font-semibold text-slate-600">{nazev}</span>
                        <div className="flex items-center gap-2">
                          {vybrano > 0 && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">{vybrano}</span>}
                          <svg className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="divide-y divide-slate-50 bg-slate-50/30">
                          {klice.map(k => <PriznakyItem key={k} klic={k} />)}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ══ PRAVÝ PANEL ══ */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Diferenciální rozvaha</h3>
                <p className="text-xs text-slate-400 mt-0.5">Seřazeno sestupně dle shody se zadanými příznaky</p>
              </div>
              {odpovidajiciDiagnozy.length > 0 && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {odpovidajiciDiagnozy.length} diagnóz
                </span>
              )}
            </div>

            <div className="p-4 space-y-3 min-h-64">

              {/* ── Aktivní filtry ──────────────────────────────── */}
              {(vek !== '' || pohlavi !== 'ALL' || vybranePriznaky.length > 0) && (
                <div className="flex flex-wrap items-center gap-1.5 pb-3 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 shrink-0">Aktivní filtry:</span>

                  {/* Věk */}
                  {vek !== '' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                      Věk: {vek} let
                      <button onClick={() => setVek('')} className="ml-0.5 text-slate-400 hover:text-slate-700 leading-none font-bold" aria-label="Odebrat věk">×</button>
                    </span>
                  )}

                  {/* Pohlaví */}
                  {pohlavi !== 'ALL' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-full border border-slate-200">
                      {pohlavi === 'M' ? 'Muž' : 'Žena'}
                      <button onClick={() => setPohlavi('ALL')} className="ml-0.5 text-slate-400 hover:text-slate-700 leading-none font-bold" aria-label="Odebrat pohlaví">×</button>
                    </span>
                  )}

                  {/* Příznaky */}
                  {vybranePriznaky.map(klic => (
                    <span key={klic} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
                      {SLOVNIK_PRIZNAKU[klic]}
                      <button onClick={() => togglePriznak(klic)} className="ml-0.5 text-blue-300 hover:text-blue-600 leading-none font-bold" aria-label={`Odebrat příznak ${SLOVNIK_PRIZNAKU[klic]}`}>×</button>
                    </span>
                  ))}
                </div>
              )}

              {/* Prázdný stav */}
              {pocetZadanych === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Zaškrtněte příznaky vlevo</p>
                  <p className="text-xs text-slate-400 mt-1">Diagnózy se zobrazí automaticky v reálném čase</p>
                </div>
              )}

              {/* Žádná shoda */}
              {pocetZadanych > 0 && odpovidajiciDiagnozy.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-slate-500 font-medium">Žádná diagnóza neodpovídá zadaným kritériím</p>
                  <p className="text-xs text-slate-400 mt-1">Zkuste upravit věk, pohlaví nebo výběr příznaků</p>
                </div>
              )}

              {/* Výsledky */}
              {odpovidajiciDiagnozy.map(diag => {
                const barva = BARVA_SHODY(diag.pctZadanych)
                return (
                  <div key={diag.kod_mkn10} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">

                    {/* Záhlaví */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded shrink-0">
                          {diag.kod_mkn10}
                        </span>
                        <NavLink to={`/diagnoza/${diag.kod_mkn10}`}
                          className="text-sm font-semibold text-blue-700 hover:text-blue-800 hover:underline leading-snug flex items-center gap-1 min-w-0">
                          <span className="truncate">{diag.nazev_poruchy}</span>
                          <svg className="w-3 h-3 shrink-0 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </NavLink>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${barva.badge}`}>
                        {diag.pctZadanych} %
                      </span>
                    </div>

                    {/* Tlačítko kopírovat do dekurzu */}
                    <button
                      onClick={() => kopirujDoDekurzu(diag)}
                      className={`shrink-0 flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border font-medium transition-all duration-200 ${
                        zkopirovanoId === diag.kod_mkn10
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                      }`}
                      title="Kopírovat souhrn do schránky pro vložení do dekurzu"
                    >
                      {zkopirovanoId === diag.kod_mkn10 ? (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          Zkopírováno!
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" />
                          </svg>
                          Do dekurzu
                        </>
                      )}
                    </button>

                    {/* Dvě metriky */}
                    <div className="mb-3 grid grid-cols-2 gap-3">
                      {/* Shoda se zadanými */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Ze zadaných příznaků</span>
                          <span className="font-medium">{diag.pocetShodnych}/{pocetZadanych}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${barva.bar}`} style={{ width: `${diag.pctZadanych}%` }} />
                        </div>
                      </div>
                      {/* Pokrytí diagnózy */}
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Pokrytí diagnózy</span>
                          <span className="font-medium">{diag.pocetShodnych}/{diag.priznaky_klice.length}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-violet-400" style={{ width: `${diag.pctDiagnozy}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Demografická info */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-xs text-slate-400">
                        {diag.vek_min}–{diag.vek_max} let · {diag.pohlavi === 'ALL' ? 'M/F' : diag.pohlavi === 'M' ? 'Muž' : 'Žena'}
                      </span>
                    </div>

                    {/* Shodné příznaky */}
                    <div className="flex flex-wrap gap-1.5">
                      {diag.shodnePriznaky.map(klic => (
                        <span key={klic} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full">
                          {SLOVNIK_PRIZNAKU[klic]}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 text-center">
            Kalkulačka slouží jako podpůrný nástroj — nenahrazuje klinické vyšetření ani diagnostický úsudek lékaře.
          </p>
        </div>

      </div>
    </div>
  )
}
