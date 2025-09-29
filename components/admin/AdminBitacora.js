"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AdminBitacora() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const readTheme = () => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
      } catch (e) {}
      return root.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    setDarkMode(readTheme());

    const onThemeChange = (e) => {
      const t = e?.detail?.theme;
      if (t === 'dark') setDarkMode(true);
      else if (t === 'light') setDarkMode(false);
      else setDarkMode(root.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);

    const observer = new MutationObserver(() => setDarkMode(root.classList.contains('dark')));
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('themechange', onThemeChange);
      observer.disconnect();
    };
  }, []);

  // Forzar fondo global en modo oscuro para cubrir áreas grises del layout
  useEffect(() => {
    const color = '#0f172a'; // slate-900
    try {
      if (darkMode) {
        document.documentElement.style.backgroundColor = color;
        document.body.style.backgroundColor = color;
      } else {
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
      }
    } catch (e) {}
    return () => {
      try {
        document.documentElement.style.backgroundColor = '';
        document.body.style.backgroundColor = '';
      } catch (e) {}
    };
  }, [darkMode]);

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [bitacora] = useState([
    { id: 'EVT-001', fecha: '2025-07-12', hora: '09:15:23', usuario: 'Jorge Vega', accion: 'Descargó un documento', tipo: 'Descarga', confidencial: false, ip: '192.168.1.10', estado: 'Éxito', documento: 'Contrato_2025.pdf', observaciones: 'Descarga autorizada' },
    { id: 'EVT-002', fecha: '2025-07-11', hora: '13:42:10', usuario: 'Lupita Pérez', accion: 'Eliminó un archivo', tipo: 'Eliminación', confidencial: true, ip: '192.168.1.22', estado: 'Éxito', documento: 'Acta_Confidencial.docx', observaciones: 'Archivo confidencial eliminado' },
    { id: 'EVT-003', fecha: '2025-07-10', hora: '16:05:44', usuario: 'Julio Rubio', accion: 'Validó expediente', tipo: 'Validación', confidencial: false, ip: '192.168.1.33', estado: 'Éxito', documento: 'Expediente_2025.zip', observaciones: 'Validación completa' },
    { id: 'EVT-004', fecha: '2025-07-09', hora: '11:22:01', usuario: 'Jorge Vega', accion: 'Subió documento', tipo: 'Carga', confidencial: false, ip: '192.168.1.10', estado: 'Éxito', documento: 'Factura_1234.pdf', observaciones: 'Carga exitosa' },
    { id: 'EVT-005', fecha: '2025-07-08', hora: '08:55:12', usuario: 'Lupita Pérez', accion: 'Editó metadatos', tipo: 'Edición', confidencial: true, ip: '192.168.1.22', estado: 'Error', documento: 'Acta_Confidencial.docx', observaciones: 'Error de permisos' },
  ]);

  const filtered = bitacora.filter(ev =>
    (!search || ev.accion.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || ev.fecha === dateFilter) &&
    (!userFilter || ev.usuario.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

  const exportCSV = () => {
    const headers = ['Fecha', 'Usuario', 'Acción', 'Tipo', 'Confidencial'];
    const rows = filtered.map(ev => [ev.fecha, ev.usuario, ev.accion, ev.tipo, ev.confidencial ? 'Sí' : 'No']);
    const csv = headers.join(',') + '\n' + rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {darkMode && <div className="fixed inset-0 bg-slate-900 z-0" aria-hidden="true" />}

      <div className="relative z-10">
        <div className="w-full px-6 mt-6">
          <div className="max-w-5xl">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Bitácora (Admin)</h1>
          </div>
        </div>

        <main className={`max-w-full mx-auto mt-10 p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white/80'} min-h-[700px]`}>
          <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-slate-700 text-blue-900 dark:text-white" />
            <input type="text" placeholder="Buscar usuario..." value={userFilter} onChange={e => setUserFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-slate-700 text-blue-900 dark:text-white" />
            <input type="text" placeholder="Buscar acción..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-slate-700 text-blue-900 dark:text-white" />
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-slate-700 text-blue-900 dark:text-white">
              <option value="">Tipo de acción</option>
              <option value="Descarga">Descarga</option>
              <option value="Eliminación">Eliminación</option>
              <option value="Validación">Validación</option>
              <option value="Carga">Carga</option>
              <option value="Edición">Edición</option>
            </select>
            <div className="flex items-center space-x-3">
              <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow hover:from-blue-700 hover:to-green-600 transition-all">
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[1500px] text-lg border-separate border-spacing-0">
              <thead className={darkMode ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100' : 'bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900'}>
                <tr>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Hora</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Acción</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Confidencial</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">IP</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider">Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((ev, idx) => (
                    <tr key={ev.id} className={`transition-all duration-200 ${darkMode ? (idx % 2 === 0 ? 'bg-slate-900' : 'bg-blue-900') : (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60')} ${ev.confidencial ? ' font-bold text-red-600 dark:text-red-300' : ''}`}>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.id}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.fecha}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.hora}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.usuario}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.accion}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.tipo}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">
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
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">{ev.ip}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60">
                        <span className={`px-2 py-1 rounded-full font-semibold shadow-sm ${ev.estado === 'Éxito' ? (darkMode ? 'bg-green-900/80 text-green-200 border border-green-700/60' : 'bg-green-100 text-green-700') : 'bg-red-100 text-red-700 dark:bg-red-900/80 dark:text-red-200 border border-red-700/60'}`}>{ev.estado}</span>
                      </td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60 truncate max-w-[320px]" title={ev.documento}>{ev.documento}</td>
                      <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60 truncate max-w-[400px]" title={ev.observaciones}>{ev.observaciones}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold">No se encontraron resultados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
