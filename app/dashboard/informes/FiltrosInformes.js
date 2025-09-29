import React from "react";

export default function FiltrosInformes({ dateStart, setDateStart, dateEnd, setDateEnd, userFilter, setUserFilter, typeFilter, setTypeFilter, exportCSV, darkMode }) {
  return (
    <form className="flex flex-wrap gap-4 items-start justify-between mb-6" onSubmit={e => e.preventDefault()} aria-label="Filtros de búsqueda de informes">
      <div className="flex flex-col justify-start h-full">
        <label htmlFor="dateStart" className="mb-1 text-xs font-bold text-blue-500 dark:text-yellow-400">
          Fecha inicial
          <span className="ml-1" title="Filtra los informes a partir de esta fecha. Requerido para búsquedas precisas.">🛈</span>
        </label>
  <input id="dateStart" type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="h-11 px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-400 dark:border-slate-700 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" aria-describedby="ayuda-fecha-inicial" />
        <span id="ayuda-fecha-inicial" className="text-xs text-blue-400 dark:text-blue-200 mt-1">Seleccione la fecha inicial para el rango de búsqueda.</span>
      </div>
  <div className="flex flex-col justify-start h-full">
        <label htmlFor="dateEnd" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">
          Fecha final
          <span className="ml-1" title="Filtra los informes hasta esta fecha. Útil para acotar periodos de consulta.">🛈</span>
        </label>
  <input id="dateEnd" type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="h-11 px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-400 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-400 dark:border-slate-700 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" aria-describedby="ayuda-fecha-final" />
        <span id="ayuda-fecha-final" className="text-xs text-blue-400 dark:text-blue-200 mt-1">Seleccione la fecha final para el rango de búsqueda.</span>
      </div>
  <div className="flex flex-col flex-1 min-w-[180px] justify-start h-full">
        <label htmlFor="userFilter" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">
          Usuario
          <span className="ml-1" title="Filtra por nombre de usuario. Puede escribir parcial o completo.">🛈</span>
        </label>
  <input id="userFilter" type="text" value={userFilter} onChange={e => setUserFilter(e.target.value)} className="h-11 px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-400 dark:border-slate-700 text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" placeholder="Buscar por usuario..." aria-describedby="ayuda-usuario" />
        <span id="ayuda-usuario" className="text-xs text-blue-400 dark:text-blue-200 mt-1">Ingrese el nombre o parte del nombre del usuario.</span>
      </div>
  <div className="flex flex-col min-w-[160px] justify-start h-full">
        <label htmlFor="typeFilter" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">
          Tipo de informe
          <span className="ml-1" title="Filtra por tipo de acción registrada en el informe.">🛈</span>
        </label>
  <div className="flex items-start w-full gap-4 min-w-0">
          <div className="flex flex-col w-full sm:w-60 min-w-0">
            <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="h-11 px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-400 dark:border-slate-700 text-blue-900 dark:text-blue-100 w-full" aria-describedby="ayuda-tipo-informe">
              <option value="">Todos</option>
              <option value="Acceso">Accesos</option>
              <option value="Descarga">Descargas</option>
              <option value="Modificación">Modificaciones</option>
              <option value="Eliminación">Eliminaciones</option>
              <option value="Otro">Otros</option>
            </select>
            <span id="ayuda-tipo-informe" className="text-xs text-blue-400 dark:text-blue-200 mt-1">Seleccione el tipo de acción para filtrar los informes.</span>
          </div>
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-bold shadow-lg hover:from-green-700 hover:to-blue-600 transition-all dark:shadow-blue-900/40 -mt-0"
              title="Exporta los resultados filtrados a un archivo CSV para su resguardo conforme a la Ley de Archivos."
              aria-label="Exportar resultados filtrados a CSV"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>
  
    </form>
  );
}
