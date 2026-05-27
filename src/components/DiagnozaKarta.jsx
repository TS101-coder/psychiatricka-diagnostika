import { useNavigate } from 'react-router-dom'
import { getKategorieBarva, BARVA_CLASSES } from '../utils/helpers'

export default function DiagnozaKarta({ diagnoza, onPorovnat, vybrana }) {
  const navigate = useNavigate()
  const barva = getKategorieBarva(diagnoza.kategorie)
  const bc = BARVA_CLASSES[barva] || BARVA_CLASSES.gray

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md ${
        vybrana ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${bc.bg} ${bc.text}`}>
            {diagnoza.kod}
          </span>
          <div className="flex gap-1">
            {diagnoza.mapovani?.mkn11 && (
              <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded">MKN-11</span>
            )}
            {diagnoza.mapovani?.dsm5 && (
              <span className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">DSM-5</span>
            )}
          </div>
        </div>

        <h3
          className="text-sm font-semibold text-slate-800 mb-1 leading-tight cursor-pointer hover:text-blue-700"
          onClick={() => navigate(`/diagnoza/${diagnoza.id}`)}
        >
          {diagnoza.nazev_cz}
        </h3>

        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{diagnoza.popis}</p>

        {diagnoza.priznaky && diagnoza.priznaky.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {diagnoza.priznaky.slice(0, 3).map((p, i) => (
              <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {p.length > 30 ? p.slice(0, 30) + '…' : p}
              </span>
            ))}
            {diagnoza.priznaky.length > 3 && (
              <span className="text-xs text-slate-400">+{diagnoza.priznaky.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/diagnoza/${diagnoza.id}`)}
            className="flex-1 text-xs py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
          >
            Detail
          </button>
          {onPorovnat && (
            <button
              onClick={() => onPorovnat(diagnoza)}
              className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium transition-colors ${
                vybrana
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
              }`}
            >
              {vybrana ? '✓ Vybráno' : 'Vybrat'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
