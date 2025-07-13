"use client";
import Image from "next/image";
import { useState } from "react";
import BackToHomeButton from "../../../components/BackToHomeButton";

export default function BitacoraPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [bitacora, setBitacora] = useState([
    { fecha: "2025-07-12", usuario: "Jorge Vega", accion: "Descargó un documento", tipo: "Descarga", confidencial: false },
    { fecha: "2025-07-11", usuario: "Lupita Pérez", accion: "Eliminó un archivo", tipo: "Eliminación", confidencial: true },
    { fecha: "2025-07-10", usuario: "Julio Rubio", accion: "Validó expediente", tipo: "Validación", confidencial: false },
    { fecha: "2025-07-09", usuario: "Jorge Vega", accion: "Subió documento", tipo: "Carga", confidencial: false },
    { fecha: "2025-07-08", usuario: "Lupita Pérez", accion: "Editó metadatos", tipo: "Edición", confidencial: true },
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
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bitacora_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>

      {/* Header */}
      <div className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-6 ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-blue-200"}`}>
        <Image src="/api-dark23.png" alt="API Logo" width={260} height={90} className="object-contain" priority />
        <h1
          className="text-5xl font-extrabold text-center flex-1 tracking-tight animate-title-glow"
          style={{
            letterSpacing: '0.01em',
            color: darkMode ? '#e0e6f0' : '#1e3a8a',
            textShadow: darkMode
              ? '0 0 16px #60a5fa, 0 0 32px #22d3ee, 0 2px 8px #0008'
              : '0 0 12px #60a5fa, 0 0 24px #1e3a8a, 0 2px 8px #0002',
            transition: 'color 0.3s',
          }}
        >
          Bitácora
        </h1>
        <style jsx>{`
          .animate-title-glow {
            animation: title-glow-fade 2.2s cubic-bezier(0.23, 1, 0.32, 1) both, title-glow-pulse 2.8s ease-in-out infinite alternate;
          }
          @keyframes title-glow-fade {
            0% { opacity: 0; transform: translateY(-40px) scale(0.96); }
            60% { opacity: 1; transform: translateY(10px) scale(1.04); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes title-glow-pulse {
            0% { text-shadow: 0 0 8px #60a5fa, 0 0 16px #22d3ee, 0 2px 8px #0004; }
            100% { text-shadow: 0 0 24px #60a5fa, 0 0 48px #22d3ee, 0 2px 16px #0006; }
          }
        `}</style>
        <div className="flex items-center gap-5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-xl text-2xl ${darkMode ? "bg-slate-800 text-yellow-400" : "bg-gray-100 text-gray-600"}`}
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <Image
            src="/blanca.jpeg"
            alt="Avatar Blanca"
            width={64}
            height={64}
            className="rounded-full border-4 border-white shadow-xl"
            priority
          />
        </div>

        {/* ...existing code... */}
      </div>

      {/* Botón debajo del header */}
      <div className="w-full px-6 mt-4">
        <div className="max-w-5xl">
          <BackToHomeButton darkMode={darkMode} />
        </div>
      </div>

      {/* Contenedor principal */}
      <div className={`max-w-5xl mx-auto mt-10 p-6 rounded-xl shadow-lg border border-blue-100 dark:border-slate-800 ${darkMode ? 'bg-slate-900' : 'bg-white/80'}`}> 

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

      {/* Aviso legal de bitácora al pie de la página */}
      

        {/* Tabla */}
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full min-w-[700px] text-sm border-separate border-spacing-0">
            <thead className={darkMode ? "bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
              <tr>
                <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider">Acción</th>
                <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-3 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-xs uppercase tracking-wider">Confidencial</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((ev, idx) => (
                  <tr
                    key={idx}
                    className={`transition-all duration-200
                      ${darkMode
                        ? `${idx % 2 === 0 ? 'bg-slate-900' : 'bg-blue-900'} hover:bg-blue-800`
                        : `${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60'} hover:bg-blue-100/80`}
                      ${ev.confidencial ? ' font-bold text-red-600 dark:text-red-300' : ''}`}
                  >
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60">{ev.fecha}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60">{ev.usuario}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60">{ev.accion}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60">{ev.tipo}</td>
                    <td className="px-4 py-3 border-b border-blue-900/30 dark:border-blue-900/60">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
                    </div>



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
            <span className="font-extrabold text-base tracking-wide uppercase text-blue-700 dark:text-blue-200">Aviso de Bitácora y Protección de Datos</span>
          </div>
          <p className="text-sm leading-relaxed font-medium max-w-2xl mx-auto">
            Esta bitácora registra y almacena todas las acciones realizadas sobre los documentos conforme a la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley Estatal de Archivos de Baja California Sur (LES-BCS)</b> y la <b className="font-semibold text-blue-800 dark:text-blue-200">Ley General de Archivos</b>.<br />
            La información aquí contenida es <span className="font-bold text-red-700 dark:text-red-300">confidencial</span> y su acceso está restringido a personal autorizado.<br />
            Toda acción queda registrada con fecha, usuario y tipo de operación para fines de <span className="font-semibold text-blue-700 dark:text-blue-200">auditoría, transparencia y rendición de cuentas</span>.<br />
            El uso indebido de esta información puede ser sancionado conforme a la legislación aplicable.
          </p>
        </div>
      </footer>


                  </div>
                );
                
              }
        