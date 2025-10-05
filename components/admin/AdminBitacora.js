"use client";
import { useState, useEffect } from "react";
import NEXT_PUBLIC_API_URL from "@/config";

export default function AdminBitacora() {
  const [darkMode, setDarkMode] = useState(false);
  const [bitacora, setBitacora] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // 🌙 Detectar modo oscuro
  useEffect(() => {
    const root = document.documentElement;
    const readTheme = () => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
      } catch { }
      return root.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    };
    setDarkMode(readTheme());
  }, []);

  // 📡 Obtener bitácora desde el backend
  useEffect(() => {
    const fetchBitacora = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${NEXT_PUBLIC_API_URL}/bitacora`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setBitacora(data.data || []);
      } catch (err) {
        console.error("Error cargando bitácora:", err);
      }
    };
    fetchBitacora();
  }, []);

  const filtered = bitacora.filter(ev =>
    (!search || ev.accion?.toLowerCase().includes(search.toLowerCase())) &&
    (!dateFilter || ev.fecha === dateFilter) &&
    (!userFilter || ev.usuario?.toLowerCase().includes(userFilter.toLowerCase())) &&
    (!typeFilter || ev.tipo === typeFilter)
  );

  const exportCSV = () => {
    const headers = ['Fecha', 'Usuario', 'Acción', 'Tipo', 'Confidencial', 'IP', 'Estado', 'Documento', 'Observaciones'];
    const rows = filtered.map(ev => [ev.fecha, ev.usuario, ev.accion, ev.tipo, ev.confidencial ? 'Sí' : 'No', ev.ip, ev.estado, ev.documento, ev.observaciones]);
    const csv = headers.join(',') + '\n' + rows.map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bitacora_admin_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-full px-6 mt-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Bitácora Administrativa</h1>
      </div>

      <main className={`w-full max-w-full mx-auto mt-10 p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white/80'} min-h-[700px]`}>
        {/* Filtros y export */}
        <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-white" />
          <input type="text" placeholder="Buscar usuario..." value={userFilter} onChange={e => setUserFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-white" />
          <input type="text" placeholder="Buscar acción..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-white" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-blue-700 text-blue-900 dark:text-white">
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
          <table className="w-full min-w-[1500px] text-lg border-separate border-spacing-0">
            <thead className={darkMode ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100' : 'bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900'}>
              <tr>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">ID</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Fecha</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Hora</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Usuario</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Acción</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Tipo</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Confidencial</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">IP</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Estado</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Documento</th>
                <th className="px-6 py-4 border-b font-semibold text-base uppercase">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((ev, idx) => (
                <tr key={ev.id} className={`${darkMode ? (idx % 2 === 0 ? 'bg-slate-900' : 'bg-blue-900/40') : (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60')} ${ev.confidencial ? ' font-bold text-red-600 dark:text-red-300' : ''}`}>
                  <td className="px-6 py-4 border-b">{ev.id}</td>
                  <td className="px-6 py-4 border-b">{ev.fecha}</td>
                  <td className="px-6 py-4 border-b">{ev.hora}</td>
                  <td className="px-6 py-4 border-b">{ev.usuario}</td>
                  <td className="px-6 py-4 border-b">{ev.accion}</td>
                  <td className="px-6 py-4 border-b">{ev.tipo}</td>
                  <td className="px-6 py-4 border-b">{ev.confidencial ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4 border-b">{ev.ip}</td>
                  <td className="px-6 py-4 border-b">{ev.estado}</td>
                  <td className="px-6 py-4 border-b truncate max-w-[320px]" title={ev.documento}>{ev.documento}</td>
                  <td className="px-6 py-4 border-b truncate max-w-[400px]" title={ev.observaciones}>{ev.observaciones}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="11" className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold">No se encontraron resultados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
