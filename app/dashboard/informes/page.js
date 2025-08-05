"use client";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";


import UsuariosList from "../../../components/usuariosList";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "../../../components/BackToHomeButton";


export default function InformesPage() {
  const [darkMode, setDarkMode] = useState(false);
  // Datos de ejemplo
  const [informes, setInformes] = useState([
    {
      fecha: "2025-07-12",
      usuario: "Jorge Vega",
      tipo: "Acceso",
      descripcion: "Consultó expediente 2025/001",
      area: "Recursos Humanos",
      ip: "192.168.1.10",
      dispositivo: "PC Escritorio",
      estado: "Exitoso"
    },
    {
      fecha: "2025-07-11",
      usuario: "Lupita Pérez",
      tipo: "Descarga",
      descripcion: "Descargó documento confidencial",
      area: "Jurídico",
      ip: "192.168.1.15",
      dispositivo: "Laptop",
      estado: "Exitoso"
    },
    {
      fecha: "2025-07-10",
      usuario: "Carlos Ruiz",
      tipo: "Modificación",
      descripcion: "Editó metadatos de documento 2025/002",
      area: "Archivo",
      ip: "192.168.1.22",
      dispositivo: "Tablet",
      estado: "Exitoso"
    },
    {
      fecha: "2025-07-09",
      usuario: "Ana Torres",
      tipo: "Eliminación",
      descripcion: "Eliminó documento temporal",
      area: "Sistemas",
      ip: "192.168.1.30",
      dispositivo: "Móvil",
      estado: "Fallido"
    },
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
        {/* Header premium institucional reutilizable */}
        <DashboardHeader title="Informes" darkMode={darkMode} onToggleDarkMode={() => setDarkMode((v) => !v)} />
        {/* Botón volver reutilizable */}
        <div className="w-full flex mt-4">
          <div className="flex items-start">
            <BackToHomeButton darkMode={darkMode} />
          </div>
        </div>

      {/* Filtros premium y tabla a pantalla completa */}
      <div className="w-full mt-8 p-6 rounded-xl shadow-lg bg-transparent dark:bg-transparent border-0">
        <form className="flex flex-wrap gap-4 items-end justify-between mb-6" onSubmit={e => e.preventDefault()}>
          <div className="flex flex-col">
            <label htmlFor="dateStart" className="mb-1 text-xs font-bold text-blue-500 dark:text-yellow-400">Fecha inicial</label>
            <input id="dateStart" type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" />
          </div>
          <div className="flex flex-col">
            <label htmlFor="dateEnd" className="mb-1 text-xs font-bold text-blue-400 dark:text-gray-400">Fecha final</label>
            <input id="dateEnd" type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-[#232b47] border-blue-200 dark:border-[#232b47] text-blue-900 dark:text-blue-100 placeholder:text-blue-400 dark:placeholder:text-blue-400" />
          </div>
          <div className="flex flex-col min-w-[120px] max-w-[180px]">
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
        <div className={`overflow-x-auto rounded-lg ${darkMode ? "bg-[#181f36]" : "bg-white"}`}>
          <table className={`w-full min-w-[1400px] text-base table-fixed ${darkMode ? "text-blue-100" : "text-blue-900"}`}>
            <colgroup>
              <col style={{width: '120px'}} />
              <col style={{width: '140px'}} />
              <col style={{width: '140px'}} />
              <col style={{width: '220px'}} />
              <col style={{width: '120px'}} />
              <col style={{width: '160px'}} />
              <col style={{width: '120px'}} />
            </colgroup>
            <thead className={darkMode ? "bg-[#232b47] text-blue-100" : "bg-blue-50 text-blue-900"}>
              <tr>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Fecha</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Usuario</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Área</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Tipo de Informe</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">IP</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Dispositivo</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Estado</th>
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-left align-middle">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-lg font-semibold text-blue-700 dark:text-blue-200">
                    No hay resultados para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filtered.map((ev, idx) => (
                  <tr
                    key={idx}
                    className={
                      darkMode
                        ? `${idx % 2 === 0 ? "bg-[#232b47]" : "bg-[#181f36]"} hover:bg-[#2d3657] text-blue-100`
                        : `${idx % 2 === 0 ? "bg-white" : "bg-blue-50/60"} hover:bg-blue-100/80 text-blue-900`
                    }
                  >
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.fecha}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.usuario}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.area}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.tipo}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.ip}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.dispositivo}</td>
                    <td className="px-4 py-3 align-middle whitespace-nowrap">{ev.estado}</td>
                    <td className="px-4 py-3 align-middle">{ev.descripcion}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Lista de usuarios del sistema */}
      <UsuariosList />
      {/* Aviso legal de informes al pie de la página */}
      <footer className="w-full flex justify-center mt-24 mb-8">
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
