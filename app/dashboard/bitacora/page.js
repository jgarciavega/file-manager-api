"use client";
import Image from "next/image";
import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "../../../components/BackToHomeButton";

export default function BitacoraPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  // Estado para mostrar/ocultar el aviso legal
  const [showLegal, setShowLegal] = useState(false);

  const [bitacora, setBitacora] = useState([
    {
      id: 'EVT-001',
      fecha: "2025-07-12",
      hora: "09:15:23",
      usuario: "Jorge Vega",
      accion: "Descargó un documento",
      tipo: "Descarga",
      confidencial: false,
      ip: "192.168.1.10",
      estado: "Éxito",
      documento: "Contrato_2025.pdf",
      observaciones: "Descarga autorizada"
    },
    {
      id: 'EVT-005',
      fecha: "2025-07-08",
      hora: "08:55:12",
      usuario: "Lupita Pérez",
      accion: "Editó metadatos",
      tipo: "Edición",
      confidencial: true,
      ip: "192.168.1.22",
      estado: "Error",
      documento: "Acta_Confidencial.docx",
      observaciones: "Error de permisos"
    },
  ]);

  const filtered = bitacora.filter(ev =>
    (!search || ev.accion.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || ev.fecha === dateFilter) &&
    (!userFilter || ev.usuario.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

    const exportCSV = () => {
      const headers = ["Fecha", "Usuario", "Acción", "Tipo", "Confidencial"];
      const rows = filtered.map(ev => [ev.fecha, ev.usuario, ev.accion, ev.tipo, ev.confidencial ? "Sí" : "No"]);
      const csv = headers.join(",") + "\n" + rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bitacora.csv";
      a.click();
      URL.revokeObjectURL(url);
    };
  
    return (
      <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
        {/* Header premium reutilizable */}
        <DashboardHeader title="Bitácora" darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
  
        {/* Botón debajo del header */}
        <div className="w-full px-6 mt-4">
          <div className="max-w-5xl">
            <BackToHomeButton darkMode={darkMode} />
          </div>
        </div>
  
        {/* Contenedor principal */}
        <div className={`max-w-full mx-auto mt-10 p-10 rounded-2xl shadow-2xl border border-blue-100 dark:border-slate-800 ${darkMode ? 'bg-slate-900' : 'bg-white/80'} min-h-[700px]`}>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-white" />
            <input type="text" placeholder="Buscar usuario..." value={userFilter} onChange={e => setUserFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-white" />
            <input type="text" placeholder="Buscar acción..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-white" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-700 text-blue-900 dark:text-white">
              <option value="">Tipo de acción</option>
              <option value="Descarga">Descarga</option>
              <option value="Eliminación">Eliminación</option>
              <option value="Validación">Validación</option>
              <option value="Carga">Carga</option>
              <option value="Edición">Edición</option>
            </select>
            <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow hover:from-blue-700 hover:to-green-600 transition-all">
              Exportar CSV
            </button>
          </div>
  
          {/* Tabla */}
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[2000px] text-lg border-separate border-spacing-0">
              <thead className={darkMode ? "bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
                <tr>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">ID</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Fecha</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Hora</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Usuario</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Acción</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Tipo</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Confidencial</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">IP</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Estado</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Documento</th>
                  <th className="px-8 py-6 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((ev, idx) => (
                    <tr
                      key={ev.id}
                      className={`transition-all duration-200
                        ${darkMode
                          ? `${idx % 2 === 0 ? 'bg-slate-900' : 'bg-blue-900'} hover:bg-blue-800`
                          : `${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60'} hover:bg-blue-100/80`}
                        ${ev.confidencial ? ' font-bold text-red-600 dark:text-red-300' : ''}`}
                    >
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.id}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.fecha}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.hora}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.usuario}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.accion}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.tipo}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">
                        {ev.confidencial ? (
                          <span title="Acción sobre documento confidencial" className={`px-2 py-1 rounded-full font-semibold shadow-sm ${darkMode ? 'bg-red-900/80 text-red-200 border border-red-700/60' : 'bg-red-100 text-red-700'}`}>
                            Sí
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded-full font-semibold shadow-sm ${darkMode ? 'bg-green-900/80 text-green-200 border border-green-700/60' : 'bg-green-100 text-green-700'}`}>
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">{ev.ip}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60">
                        <span className={`px-2 py-1 rounded-full font-semibold shadow-sm 
                          ${ev.estado === 'Éxito' ? (darkMode ? 'bg-green-900/80 text-green-200 border border-green-700/60' : 'bg-green-100 text-green-700') : 'bg-red-100 text-red-700 dark:bg-red-900/80 dark:text-red-200 border border-red-700/60'}`}>{ev.estado}</span>
                      </td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60 truncate max-w-[320px]" title={ev.documento}>{ev.documento}</td>
                      <td className="px-8 py-6 border-b border-blue-900/30 dark:border-blue-900/60 truncate max-w-[400px]" title={ev.observaciones}>{ev.observaciones}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold">
                      No se encontraron resultados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
  
        {/* Aviso legal discreto como banner colapsable */}
        <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
          <div className={`pointer-events-auto transition-all duration-300 max-w-2xl w-full mx-auto mb-4 px-4`}>
            <div className={`flex items-center justify-between rounded-xl shadow-lg border border-blue-200 dark:border-blue-800 bg-white/90 dark:bg-slate-900/90 px-4 py-2`}>
              <div className="flex items-center gap-2">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="inline-block text-red-600 dark:text-red-400"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/></svg>
                <span className="font-semibold text-xs text-blue-800 dark:text-blue-200 tracking-wide">Aviso legal de Bitácora</span>
              </div>
              <button
                onClick={() => setShowLegal(prev => !prev)}
                className="ml-2 px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all"
                aria-expanded={showLegal ? 'true' : 'false'}
                aria-controls="bitacora-legal-banner"
              >
                {showLegal ? 'Ocultar' : 'Aviso legal'}
              </button>
            </div>
            {showLegal && (
              <div id="bitacora-legal-banner" className={`mt-2 rounded-xl shadow border border-blue-100 dark:border-blue-800 bg-white/95 dark:bg-slate-900/95 px-6 py-4 text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium`}>
                Esta bitácora registra y almacena todas las acciones realizadas sobre los documentos conforme a la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley Estatal de Archivos de Baja California Sur (LES-BCS)</b> y la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley General de Archivos</b>.<br />
                La información aquí contenida es <span className="font-bold text-red-700 dark:text-red-300">confidencial</span> y su acceso está restringido a personal autorizado.<br />
                Toda acción queda registrada con fecha, usuario y tipo de operación para fines de <span className="font-semibold text-blue-700 dark:text-blue-200">auditoría, transparencia y rendición de cuentas</span>.<br />
                El uso indebido de esta información puede ser sancionado conforme a la legislación aplicable.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
        