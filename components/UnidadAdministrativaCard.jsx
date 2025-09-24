import React from "react";

/**
 * Componente de solo lectura para mostrar información institucional de la unidad administrativa de un usuario no administrador.
 * @param {Object} props
 * @param {string} props.nombreUnidad - Nombre de la unidad administrativa
 * @param {string} props.claveInstitucional - Clave institucional
 * @param {string} props.responsableArchivo - Responsable del archivo
 * @param {Array<{nombre: string, descripcion?: string}>} props.seriesDocumentales - Series documentales asignadas
 * @param {number} props.docCapturados - Documentos capturados
 * @param {number} props.docTramite - Documentos en trámite
 * @param {number} props.docTransferidos - Documentos transferidos
 * @param {function} [props.onReportError] - Función a ejecutar al reportar error
 */
const UnidadAdministrativaCard = ({
  nombreUnidad,
  claveInstitucional,
  responsableArchivo,
  seriesDocumentales = [],
  docCapturados = 0,
  docTramite = 0,
  docTransferidos = 0,
  onReportError,
}) => {
  return (
  <div className="bg-white dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-lg p-8 w-[850px] max-w-full flex flex-col gap-8">
      {/* Encabezado institucional */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label="Unidad administrativa">🏢</span>
          <span className="text-2xl font-extrabold text-blue-800 dark:text-blue-100 leading-tight">{nombreUnidad}</span>
        </div>
        <div className="flex items-center gap-2 text-blue-500 dark:text-blue-300 text-base font-semibold pl-1">
          <span className="text-lg" role="img" aria-label="Clave institucional">📌</span>
          <span>Clave institucional:</span>
          <span className="font-mono tracking-wide text-blue-700 dark:text-blue-200">{claveInstitucional}</span>
        </div>
      </div>

      {/* Responsable */}
      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200 text-base font-semibold">
        <span className="text-lg" role="img" aria-label="Responsable">👤</span>
        <span>Responsable del archivo:</span>
        <span className="font-normal text-blue-900 dark:text-blue-100">{responsableArchivo}</span>
      </div>

      {/* Series documentales */}
      <div>
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200 font-semibold mb-2">
          <span className="text-lg" role="img" aria-label="Series documentales">📁</span>
          <span>Series documentales asignadas</span>
        </div>
        <ul className="pl-0 flex flex-col gap-2">
          {seriesDocumentales.map((serie, idx) => (
            <li key={idx} className="flex items-start gap-2 group relative">
              <span className="text-blue-400 text-lg mt-0.5">•</span>
              <div>
                <span className="font-medium text-blue-900 dark:text-blue-100" title={serie.descripcion || serie.nombre}>{serie.nombre}</span>
                {serie.descripcion && (
                  <span className="block text-xs text-blue-500 mt-0.5">{serie.descripcion}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Estadísticas */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-200">
          <span className="text-lg" role="img" aria-label="Capturados">📊</span>
          <span className="font-semibold">Documentos capturados:</span>
          <span className="font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded px-3 py-1 text-base shadow-sm">{docCapturados}</span>
        </div>
        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-200">
          <span className="text-lg" role="img" aria-label="Trámite">📊</span>
          <span className="font-semibold">En trámite:</span>
          <span className="font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded px-3 py-1 text-base shadow-sm">{docTramite}</span>
        </div>
        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-200">
          <span className="text-lg" role="img" aria-label="Transferidos">📊</span>
          <span className="font-semibold">Transferidos:</span>
          <span className="font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded px-3 py-1 text-base shadow-sm">{docTransferidos}</span>
        </div>
      </div>
      {onReportError && (
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={onReportError}
            className="text-xs text-red-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-400 rounded px-2 py-1"
            title="Reportar error en la información"
          >
            <span role="img" aria-label="Reportar">⚠️</span> Reportar error
          </button>
        </div>
      )}
    </div>
  );
};

export default UnidadAdministrativaCard;
