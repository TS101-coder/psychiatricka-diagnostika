import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMkn11, getMkn11Barva, MKN11_BARVA_CLASSES } from '../hooks/useMkn11'

export default function Mkn11Home() {
  const diagnózy = useMkn11()
  const navigate = useNavigate()
  const [dotaz, setDotaz] = useState('')

  // Pouze hlavní kódy (bez subkódů s tečkou, tj. přímé kódy)
  const hlavni = useMemo(() => {
    if (!dotaz.trim()) {
      return diagnózy.filter(d => !d.id.includes('.'))
    }
    const q = dotaz.toLowerCase().trim()
    return diagnózy.filter(d =>
      d.id.toLowerCase().includes(q) ||
      d.nazev_cz.toLowerCase().includes(q) ||
      (d.popis && d.popis.toLowerCase().includes(q)) ||
      (d.kategorie && d.kategorie.toLowerCase().includes(q))
    ).slice(0, 50)
  }, [diagnózy, dotaz])

  // Skupiny dle kategorie
  const kategorie = useMemo(() => {
    if (dotaz.trim()) return null
    const map = new Map()
    for (const d of hlavni) {
      if (!map.has(d.kategorie)) map.set(d.kategorie, [])
      map.get(d.kategorie).push(d)
    }
    return map
  }, [hlavni, dotaz])

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold bg-green-100 text-green-700 border border-green-300 px-2 py-0.5 rounded-full">MKN-11</span>
          <h2 className="text-2xl font-bold text-slate-900">Přehled diagnóz MKN-11</h2>
        </div>
        <p className="text-slate-500 text-sm">ICD-11 Kapitola 06 – Duševní, behaviorální nebo neurovývojové poruchy · WHO 2025-01 · Česká verze</p>
      </div>

      {/* Vyhledávání */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Hledat v MKN-11..."
            value={dotaz}
            onChange={e => setDotaz(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Výsledky hledání */}
      {dotaz.trim() ? (
        <div>
          <p className="text-sm text-slate-500 mb-3">Nalezeno: {hlavni.length} záznamů</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {hlavni.map(d => {
              const barva = getMkn11Barva(d.kategorie)
              const bc = MKN11_BARVA_CLASSES[barva] || MKN11_BARVA_CLASSES.gray
              return (
                <button key={d.id} onClick={() => navigate(`/mkn11/${d.id}`)}
                  className={`text-left p-3 rounded-lg border hover:shadow-sm transition-all ${bc.border} bg-white`}>
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
        </div>
      ) : (
        /* Kategorie skupiny */
        <div className="space-y-8">
          {kategorie && [...kategorie.entries()].map(([kat, kody]) => {
            const barva = getMkn11Barva(kat)
            const bc = MKN11_BARVA_CLASSES[barva] || MKN11_BARVA_CLASSES.gray
            return (
              <div key={kat}>
                <div className={`flex items-center gap-2 mb-3 pb-2 border-b-2 ${bc.border}`}>
                  <span className={`w-3 h-3 rounded-full shrink-0 ${bc.badge}`} />
                  <h3 className={`font-semibold text-sm ${bc.text}`}>{kat}</h3>
                  <span className="text-xs text-slate-400 ml-auto">{kody.length} kódů</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {kody.map(d => (
                    <button key={d.id} onClick={() => navigate(`/mkn11/${d.id}`)}
                      className={`text-left p-3 rounded-lg border hover:shadow-sm transition-all bg-white ${bc.border} hover:${bc.bg}`}>
                      <div className="flex items-start gap-2">
                        <span className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded shrink-0 ${bc.bg} ${bc.text}`}>{d.kod}</span>
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
