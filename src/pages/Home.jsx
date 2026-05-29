import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnozy, useKategorie } from '../hooks/useDiagnozy'
import { vyhledej, getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'

export default function Home() {
  const diagnozy  = useDiagnozy()
  const kategorie = useKategorie()
  const navigate  = useNavigate()
  const [dotaz, setDotaz] = useState('')

  // Pouze hlavní kódy (bez podkódů s tečkou)
  const hlavni = useMemo(
    () => diagnozy.filter(d => !d.kod.includes('.')),
    [diagnozy]
  )

  // Výsledky hledání – přes celou databázi
  const vysledky = useMemo(() => {
    if (!dotaz.trim()) return null
    return vyhledej(diagnozy, dotaz).slice(0, 60)
  }, [diagnozy, dotaz])

  // Skupiny hlavních kódů dle kategorie (zachovává pořadí z mapping.json)
  const skupiny = useMemo(() => {
    return kategorie.map(kat => {
      const [od, do_] = kat.rozsah.split('-')
      const odNum = parseInt(od.replace('F', ''))
      const doNum = do_ ? parseInt(do_.replace('F', '')) : odNum
      const kody = hlavni.filter(d => {
        const num = parseInt(d.kod.replace('F', ''))
        return num >= odNum && num <= doNum
      })
      return { kat, kody }
    }).filter(s => s.kody.length > 0)
  }, [kategorie, hlavni])

  return (
    <div className="max-w-5xl mx-auto">
      {/* Záhlaví */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded-full">MKN-10</span>
          <h2 className="text-2xl font-bold text-slate-900">Přehled diagnóz MKN-10</h2>
        </div>
        <p className="text-slate-500 text-sm">
          {diagnozy.length} diagnóz · F00–F99 · Psychiatrická klasifikace dle WHO
        </p>
      </div>

      {/* Vyhledávání */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Hledat (kód, název, příznak...)"
            value={dotaz}
            onChange={e => setDotaz(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {dotaz && (
            <button
              onClick={() => setDotaz('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >✕</button>
          )}
        </div>
      </div>

      {/* Výsledky hledání */}
      {vysledky ? (
        <div>
          <p className="text-sm text-slate-500 mb-3">Nalezeno: {vysledky.length} záznamů</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {vysledky.map(d => {
              const barva = getKategorieBarva(d.kategorie)
              const bc = BARVA_CLASSES[barva] || BARVA_CLASSES.gray
              return (
                <button
                  key={d.id}
                  onClick={() => navigate(`/diagnoza/${d.id}`)}
                  className={`text-left p-3 rounded-lg border hover:shadow-sm transition-all ${bc.border} bg-white`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${bc.bg} ${bc.text}`}>{d.kod}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 leading-snug">{d.nazev_cz}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{d.kategorie}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          {vysledky.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">Žádná diagnóza nenalezena pro „<strong>{dotaz}</strong>"</p>
            </div>
          )}
        </div>
      ) : (
        /* Kategorie skupiny – stejný layout jako MKN-11 */
        <div className="space-y-8">
          {skupiny.map(({ kat, kody }) => {
            const barva = getKategorieBarva(kat.nazev + ' ' + kat.rozsah)
            const bc    = BARVA_CLASSES[barva] || BARVA_CLASSES.gray
            return (
              <div key={kat.rozsah}>
                {/* Záhlaví kategorie */}
                <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${bc.border}`}>
                  <span className={`w-3 h-3 rounded-full shrink-0 ${bc.badge}`} />
                  <h3 className={`font-semibold text-sm ${bc.text}`}>{kat.nazev}</h3>
                  <span className={`text-xs font-mono ${bc.text} opacity-60`}>{kat.rozsah}</span>
                  <span className="text-xs text-slate-400 ml-auto">{kody.length} kódů</span>
                </div>

                {/* Kartičky hlavních kódů */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {kody.map(d => (
                    <button
                      key={d.id}
                      onClick={() => navigate(`/diagnoza/${d.id}`)}
                      className={`text-left p-3 rounded-lg border hover:shadow-sm transition-all bg-white ${bc.border} hover:${bc.bg}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${bc.bg} ${bc.text}`}>
                          {d.kod}
                        </span>
                        <p className="text-xs text-slate-700 leading-snug">{d.nazev_cz}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
