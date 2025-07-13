"use client";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import BackToHomeButton from "../../../components/BackToHomeButton";

export default function InformesPage() {
  const [darkMode, setDarkMode] = useState(false);
  // Datos de ejemplo
  const [informes, setInformes] = useState([
    { fecha: "2025-07-12", usuario: "Jorge Vega", tipo: "Acceso", descripcion: "Consultó expediente 2025/001" },
    { fecha: "2025-07-11", usuario: "Lupita Pérez", tipo: "Descarga", descripcion: "Descargó documento confidencial" },
  ]);
  // Filtros (puedes expandir lógica real después)
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  // Filtrado simple
  const filtered = informes.filter(ev =>
    (!dateStart || ev.fecha >= dateStart) &&
    (!dateEnd || ev.fecha <= dateEnd) &&
    (!userFilter || ev.usuario.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

  // Exportar CSV
  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["Fecha", "Usuario", "Tipo de Informe", "Descripción"];
    const rows = filtered.map(ev => [ev.fecha, ev.usuario, ev.tipo, ev.descripcion]);
    const csv = headers.join(",") + "\n" + rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `informes_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      {/* Header premium institucional */}
      <div className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-4 ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-blue-200"}`}>
        {/* Logo institucional a la izquierda */}
        <div className="flex items-center gap-6 min-w-[300px]">
          <Image src="/api-dark23.png" alt="API Logo" width={240} height={90} className="object-contain" priority />
        </div>
        {/* Título */}
        <h1
          className="flex-1 text-5xl md:text-6xl font-extrabold text-center tracking-tight relative group select-none"
          style={{ letterSpacing: '0.01em', lineHeight: 1.1 }}
        >
          <span
            className="inline-block bg-gradient-to-r from-blue-700 via-cyan-400 to-green-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move transition-transform duration-300 group-hover:scale-105"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textFillColor: 'transparent',
            }}
          >
            Informes
          </span>
          <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 opacity-80 animate-underline-move group-hover:scale-x-110 transition-transform duration-300"></span>
          <style jsx>{`
            .animate-gradient-move {
              animation: gradient-move 3.5s ease-in-out infinite alternate;
            }
            @keyframes gradient-move {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
            .animate-underline-move {
              animation: underline-move 2.2s cubic-bezier(0.4,0,0.2,1) infinite alternate;
            }
            @keyframes underline-move {
              0% { transform: scaleX(0.85); opacity: 0.7; }
              60% { transform: scaleX(1.1); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0.85; }
            }
          `}</style>
        </h1>
        {/* Toggle modo y avatar */}
        <div className="flex items-center justify-end min-w-[60px] gap-5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-4 rounded-xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:-translate-y-1 shadow-lg hover:shadow-xl ${darkMode ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 hover:shadow-yellow-400/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 hover:shadow-blue-400/30"}`}
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-2xl transition-all duration-300 hover:scale-125" />
          </button>
          <Image src="/blanca.jpeg" alt="Avatar" width={64} height={64} className="rounded-full border-4 border-blue-400 shadow-xl object-cover" />
        </div>
      </div>

      {/* Botón volver pegado al borde izquierdo debajo del header */}
      <div className="w-full flex mt-4">
        <div className="flex items-start">
          <BackToHomeButton darkMode={darkMode} />
        </div>
      </div>

      {/* Filtros premium */}
      <div className="max-w-7xl mx-auto mt-8 p-6 rounded-xl shadow-lg bg-blue/600 dark:bg-[#10172a] border border-blue-600 dark:border-[#10172a]">
        <form className="flex flex-wrap gap-4 items-end justify-between mb-6" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col">
            <label htmlFor="dateStart" className="mb-1 text-xs font-bold text-blue-500 dark:text-yellow-400">Fecha inicial</label>
            <input id="dateStart" type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dateEnd" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">Fecha final</label>
            <input id="dateEnd" type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" />
          </div>
          <div className="flex flex-col flex-1 min-w-[180px]">
            <label htmlFor="userFilter" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">Usuario</label>
            <input id="userFilter" type="text" value={userFilter} onChange={e => setUserFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" placeholder="Buscar por usuario..." />
          </div>
          <div className="flex flex-col min-w-[160px]">
            <label htmlFor="typeFilter" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">Tipo de informe</label>
            <select id="typeFilter" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100">
              <option value="">Todos</option>
              <option value="Acceso">Accesos</option>
              <option value="Descarga">Descargas</option>
              <option value="Modificación">Modificaciones</option>
              <option value="Eliminación">Eliminaciones</option>
              <option value="Otro">Otros</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-xs font-bold text-transparent select-none">Exportar</label>
            <button type="button" onClick={exportCSV} className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-blue-500 text-white font-bold shadow-lg hover:from-green-700 hover:to-blue-600 transition-all dark:shadow-blue-900/40">Exportar CSV</button>
          </div>
        </form>

        {/* Tabla de resultados premium */}
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
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap">{ev.fecha}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap">{ev.usuario}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle whitespace-nowrap">{ev.tipo}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60 align-middle">{ev.descripcion}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aviso legal de informes al pie de la página */}
      <footer className="w-full flex justify-center mt-10 mb-4">
        <div
          className={`max-w-3xl w-full mx-auto px-6 py-5 rounded-xl shadow border transition-colors duration-300 text-center flex flex-col items-center gap-2
            ${darkMode
              ? 'bg-slate-800/90 text-blue-100 border-blue-900/60'
              : 'bg-blue-50 text-blue-900 border-blue-200'}
          `}
        >
          <div className="flex items-center gap-2 mb-1">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="inline-block text-blue-700 dark:text-blue-300"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/></svg>
            <span className="font-extrabold text-base tracking-wide uppercase text-blue-700 dark:text-blue-200">Aviso de Informes y Protección de Datos</span>
          </div>
          <p className="text-sm leading-relaxed font-medium max-w-2xl mx-auto">
            Esta sección permite generar y consultar informes conforme a la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley Estatal de Archivos de Baja California Sur (LES-BCS)</b> y la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley General de Archivos</b>.<br />
            La información mostrada es <span className="font-bold text-red-700 dark:text-red-300">confidencial</span> y su uso está restringido a personal autorizado.<br />
            Toda consulta queda registrada para fines de <span className="font-semibold text-blue-700 dark:text-blue-200">auditoría, transparencia y rendición de cuentas</span>.<br />
            El uso indebido de esta información puede ser sancionado conforme a la legislación aplicable.
          </p>
        </div>
      </footer>
    </div>
  );
}
