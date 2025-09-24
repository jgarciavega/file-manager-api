import React from "react";

export default function TablaInformes({ filtered, darkMode }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white dark:bg-[#232b47]">
      <table className="w-full min-w-[700px] text-sm border-separate border-spacing-0 table-fixed">
        <colgroup>
          <col style={{width: '120px'}} />
          <col style={{width: '180px'}} />
          <col style={{width: '160px'}} />
          <col />
        </colgroup>
        <thead className={darkMode ? "bg-[#181f36] text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
          <tr>
            <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider text-left align-middle">Fecha</th>
            <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider text-left align-middle">Usuario</th>
            <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider text-left align-middle">Tipo de Informe</th>
            <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider text-left align-middle">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-lg font-semibold text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-slate-900/60 border-b border-blue-200 dark:border-blue-900/40">
                No hay resultados para los filtros seleccionados.
              </td>
            </tr>
          ) : (
            filtered.map((ev, idx) => (
              <tr key={idx} className={darkMode ? (idx % 2 === 0 ? "bg-[#232b47] hover:bg-[#2d3657]" : "bg-[#181f36] hover:bg-[#232b47]") : (idx % 2 === 0 ? "bg-white hover:bg-blue-100/80" : "bg-blue-50/60 hover:bg-blue-100/80") }>
                <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap text-left">{ev.fecha}</td>
                <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap text-left">{ev.usuario}</td>
                <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap text-left">{ev.tipo}</td>
                <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle text-left">{ev.descripcion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
