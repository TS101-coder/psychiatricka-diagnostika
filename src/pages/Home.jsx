import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDiagnozy, useKategorie } from '../hooks/useDiagnozy'
import { vyhledej, getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'
import DiagnozaKarta from '../components/DiagnozaKarta'

export default function Home() {
  const diagnozy = useDiagnozy()
  const kategorie = useKategorie()
  const navigate = useNavigate()
  const [dotaz, setDotaz] = useState('')
  const [vybKategorie, setVybKategorie] = useState('')
  const [zobrazit, setZobrazit] = useState(24)

  const filtrovane = useMemo(() => {
    let vysledek = vyhledej(diagnozy, dotaz)
    if (vybKategorie) {
      const [od, do_] = vybKategorie.split('-')
      const odNum = parseInt(od.replace('F', ''))
      const doNum = do_ ? parseInt(do_.replace('F', '')) : odNum
      vysledek = vysledek.filter(d => {
        const num = parseInt(d.kod.replace('F', ''))
        return num >= odNum && num <= doNum
      })
    }
    return vysledek
  }, [diagnozy, dotaz, vybKategorie])

  const zobrazene = filtrovane.slice(0, zobrazit)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Databáze diagnóz MKN-10</h2>
        <p className="text-slate-500 text-sm">{diagnozy.length} diagnóz · F00–F99 · Psychiatrická klasifikace</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-64 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Hledat (kód, název, příznak...)"
            value={dotaz}
            onChange={e => { setDotaz(e.target.value); setZobrazit(24) }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={vybKategorie}
          onChange={e => { setVybKategorie(e.target.value); setZobrazit(24) }}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
        >
          <option value="">Všechny kategorie</option>
          {kategorie.map(k => (
            <option key={k.rozsah} value={k.rozsah}>{k.rozsah} – {k.nazev}</option>
          ))}
        </select>

        {(dotaz || vybKategorie) && (
          <button
            onClick={() => { setDotaz(''); setVybKategorie(''); setZobrazit(24) }}
            className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            Zrušit filtr
          </button>
        )}
      </div>

      {!dotaz && !vybKategorie && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Kategorie</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {kategorie.map(kat => {
              const barva = getKategorieBarva(kat.nazev + kat.rozsah)
              const bc = BARVA_CLASSES[barva] || BARVA_CLASSES.gray
              const pocet = diagnozy.filter(d => {
                const [od, do_] = kat.rozsah.split('-')
                const num = parseInt(d.kod.replace('F', ''))
                const odNum = parseInt(od.replace('F', ''))
                const doNum = do_ ? parseInt(do_.replace('F', '')) : odNum
                return num >= odNum && num <= doNum
              }).length
              return (
                <button
                  key={kat.rozsah}
                  onClick={() => setVybKategorie(kat.rozsah)}
                  className={`text-left p-3 rounded-lg border-2 hover:shadow-md transition-all ${bc.bg} ${bc.border}`}
                >
                  <div className={`text-xs font-mono font-bold ${bc.text}`}>{kat.rozsah}</div>
                  <div className={`text-xs font-medium mt-0.5 ${bc.text} leading-tight`}>{kat.nazev}</div>
                  <div className={`text-xs mt-1 opacity-70 ${bc.text}`}>{pocet} diagnóz</div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Zobrazeno <strong>{zobrazene.length}</strong> z <strong>{filtrovane.length}</strong> diagnóz
        </p>
        <button
          onClick={() => navigate('/diferencialni')}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Diferenciální diagnostika
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {zobrazene.map(d => (
          <DiagnozaKarta key={d.id} diagnoza={d} />
        ))}
      </div>

      {filtrovane.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Žádná diagnóza nenalezena pro "<strong>{dotaz}</strong>"</p>
        </div>
      )}

      {filtrovane.length > zobrazit && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setZobrazit(z => z + 24)}
            className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium"
          >
            Načíst dalších 24 ({filtrovane.length - zobrazit} zbývá)
          </button>
        </div>
      )}
    </div>
  )
}
