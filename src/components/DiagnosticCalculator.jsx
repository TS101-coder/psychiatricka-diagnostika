import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { SLOVNIK_PRIZNAKU } from '../data/symptomTaxonomy'
import guidelines from '../data/clinicalGuidelines_MKN10.json'

const odstranDiakritiku = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const BARVA_SHODY = (pct) => {
  if (pct >= 75) return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', bar: 'bg-emerald-500' }
  if (pct >= 50) return { badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',   bar: 'bg-yellow-500' }
  return              { badge: 'bg-orange-100 text-orange-800 border-orange-300',     bar: 'bg-orange-500' }
}

export default function DiagnosticCalculator() {
  const [vek, setVek] = useState('')
  const [pohlavi, setPohlavi] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [vybranePriznaky, setVybranePriznaky] = useState([])

  // Seřazený seznam příznaků dle abecedy
  const abecedniPriznaky = useMemo(() =>
    Object.entries(SLOVNIK_PRIZNAKU)
      .map(([klic, text]) => ({ klic, text }))
      .sort((a, b) => a.text.localeCompare(b.text, 'cs')),
  [])

  // Filtrování dle vyhledávání (bez diakritiky, case-insensitive)
  const filtrovanePriznaky = useMemo(() => {
    if (!searchQuery) return abecedniPriznaky
    const q = odstranDiakritiku(searchQuery)
    return abecedniPriznaky.filter(p => odstranDiakritiku(p.text).includes(q))
  }, [searchQuery, abecedniPriznaky])

  function togglePriznak(klic) {
    setVybranePriznaky(prev =>
      prev.includes(klic) ? prev.filter(p => p !== klic) : [...prev, klic]
    )
  }

  function clearAll() {
    setVybranePriznaky([])
    setSearchQuery('')
  }

  // Výpočet odpovídajících diagnóz
  const odpovidajiciDiagnozy = useMemo(() => {
    if (vybranePriznaky.length === 0) return []
    const vekNum = vek === '' ? null : Number(vek)

    return guidelines
      .map(diag => {
        const vekOk = vekNum === null || (vekNum >= diag.vek_min && vekNum <= diag.vek_max)
        const pohlaviOk = pohlavi === 'ALL' || diag.pohlavi === 'ALL' || diag.pohlavi === pohlavi
        if (!vekOk || !pohlaviOk) return null

        const shodne = (diag.priznaky_klice || []).filter(k => vybranePriznaky.includes(k))
        if (shodne.length === 0) return null

        const pct = Math.round((shodne.length / vybranePriznaky.length) * 100)
        return { ...diag, shodnePriznaky: shodne, procentoShody: pct, pocetShodnych: shodne.length }
      })
      .filter(Boolean)
      .sort((a, b) => b.procentoShody - a.procentoShody || b.pocetShodnych - a.pocetShodnych)
  }, [vek, pohlavi, vybranePriznaky])

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* Záhlaví */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl font-bold text-slate-900">Diferenciální kalkulačka MKN-10</span>
        </div>
        <p className="text-sm text-slate-500">
          Zadejte demografii pacienta a zaškrtněte pozorované příznaky. Systém seřadí diagnózy podle míry překryvu.
        </p>
      </div>

      <div className="flex gap-5 items-start">

        {/* ══ LEVÝ PANEL ══════════════════════════════════════════════ */}
        <div className="w-80 shrink-0 flex flex-col gap-4">

          {/* Demografie */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Demografie pacienta</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Věk</label>
                <input
                  type="number"
                  min="0" max="120"
                  value={vek}
                  onChange={e => setVek(e.target.value)}
                  placeholder="Např. 35"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Pohlaví</label>
                <select
                  value={pohlavi}
                  onChange={e => setPohlavi(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                >
                  <option value="ALL">Vše</option>
                  <option value="M">Muž</option>
                  <option value="F">Žena</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vyhledávač + seznam příznaků */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Klinické příznaky</h3>
                {vybranePriznaky.length > 0 && (
                  <button onClick={clearAll} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                    Vymazat vše ({vybranePriznaky.length})
                  </button>
                )}
              </div>
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Hledat příznak..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Abecední checkbox list */}
            <div className="overflow-y-auto max-h-[500px] divide-y divide-slate-50">
              {filtrovanePriznaky.map(priznak => {
                const vybran = vybranePriznaky.includes(priznak.klic)
                return (
                  <label
                    key={priznak.klic}
                    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                      vybran ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={vybran}
                      onChange={() => togglePriznak(priznak.klic)}
                      className="w-4 h-4 rounded accent-blue-600 shrink-0"
                    />
                    <span className={`text-xs leading-snug ${vybran ? 'text-blue-700 font-medium' : 'text-slate-700'}`}>
                      {priznak.text}
                    </span>
                  </label>
                )
              })}
              {filtrovanePriznaky.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">Žádný příznak neodpovídá hledání</div>
              )}
            </div>
          </div>
        </div>

        {/* ══ PRAVÝ PANEL ═════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">Diferenciální rozvaha</h3>
                <p className="text-xs text-slate-400 mt-0.5">Seřazeno sestupně podle shody příznaků</p>
              </div>
              {odpovidajiciDiagnozy.length > 0 && (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {odpovidajiciDiagnozy.length} diagnóz
                </span>
              )}
            </div>

            <div className="p-4 space-y-3 min-h-64">

              {/* Prázdný stav */}
              {vybranePriznaky.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-slate-500">Zaškrtněte příznaky vlevo</p>
                  <p className="text-xs text-slate-400 mt-1">Diagnózy se zobrazí automaticky</p>
                </div>
              )}

              {/* Žádná shoda */}
              {vybranePriznaky.length > 0 && odpovidajiciDiagnozy.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <p className="text-sm text-slate-500 font-medium">Žádná diagnóza neodpovídá zadaným kritériím</p>
                  <p className="text-xs text-slate-400 mt-1">Zkuste upravit věk, pohlaví nebo výběr příznaků</p>
                </div>
              )}

              {/* Výsledky */}
              {odpovidajiciDiagnozy.map(diag => {
                const barva = BARVA_SHODY(diag.procentoShody)
                return (
                  <div key={diag.kod_mkn10} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">

                    {/* Záhlaví diagnózy */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-bold text-slate-400 shrink-0 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                          {diag.kod_mkn10}
                        </span>
                        <NavLink
                          to={`/diagnoza/${diag.kod_mkn10}`}
                          className="text-sm font-semibold text-blue-700 hover:underline leading-snug truncate"
                        >
                          {diag.nazev_poruchy}
                        </NavLink>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border shrink-0 ${barva.badge}`}>
                        {diag.procentoShody} %
                      </span>
                    </div>

                    {/* Progress bar shody */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                        <span>Shoda: {diag.pocetShodnych} z {vybranePriznaky.length} příznaků</span>
                        <span>{diag.vek_min}–{diag.vek_max} let · {diag.pohlavi === 'ALL' ? 'M/F' : diag.pohlavi === 'M' ? 'Muž' : 'Žena'}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${barva.bar}`}
                          style={{ width: `${diag.procentoShody}%` }}
                        />
                      </div>
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

          {/* Disclaimer */}
          <p className="mt-3 text-xs text-slate-400 text-center">
            Kalkulačka slouží jako podpůrný nástroj — nenahrazuje klinické vyšetření ani diagnostický úsudek lékaře.
          </p>
        </div>

      </div>
    </div>
  )
}
