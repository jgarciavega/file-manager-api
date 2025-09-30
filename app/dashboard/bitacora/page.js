"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import BackToHomeButton from "../../../components/BackToHomeButton";
import DashboardHeader from '@/components/DashboardHeader';
import avatarMap from '../../../lib/avatarMap';

export default function BitacoraPage() {
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

    // Inicializar desde preferencia guardada o clase actual
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
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [bitacora, setBitacora] = useState([
    {
      id: 'EVT-100',
      fecha: "2025-09-20",
      hora: "10:12:05",
      usuario: "Jorge Vega",
      accion: "Descargó comprobante de pago",
      tipo: "Descarga",
      confidencial: false,
      ip: "10.0.0.15",
      estado: "Éxito",
      documento: "Comprobante_0920.pdf",
      observaciones: "Descarga realizada desde dispositivo móvil"
    },
    {
      id: 'EVT-101',
      fecha: "2025-09-18",
      hora: "14:44:18",
      usuario: "Jorge Vega",
      accion: "Editó metadatos del expediente",
      tipo: "Edición",
      confidencial: false,
      ip: "10.0.0.15",
      estado: "Éxito",
      documento: "Expediente_2024.zip",
      observaciones: "Campo 'responsable' actualizado"
    },
    {
      id: 'EVT-102',
      fecha: "2025-09-15",
      hora: "09:05:33",
      usuario: "Jorge Vega",
      accion: "Subió documento de soporte",
      tipo: "Carga",
      confidencial: false,
      ip: "10.0.0.15",
      estado: "Éxito",
      documento: "Soporte_0915.pdf",
      observaciones: "Carga realizada sin incidencias"
    }
  ]);
  

  // Versión reducida: mostrar solo eventos del usuario actual (Mi actividad)
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const currentUserName = session?.user?.name || "";

  let filtered = bitacora.filter(ev => {
    // coincidencia por usuario (nombre) o por email; si no hay sesión, mostrar todo
    const name = currentUserName || "";
    const email = userEmail || "";
    const evUser = (ev.usuario || "").toLowerCase();
    const nameMatch = name ? evUser.includes(name.toLowerCase()) : false;
    // intentar con la parte local del email (antes de @) por si el nombre en session es un correo
    const emailLocal = email.split('@')[0] || "";
    const emailMatch = email ? (evUser.includes(email.toLowerCase()) || (emailLocal && evUser.includes(emailLocal.toLowerCase()))) : false;

    const userOk = (name || email) ? (nameMatch || emailMatch) : true;
    const searchOk = !search || ev.accion.toLowerCase().includes(search.toLowerCase());
    return userOk && searchOk;
  });

  // Si no hay coincidencias para el usuario actual, mostrar un pequeño conjunto de ejemplo
  // Esto facilita el desarrollo cuando la sesión no coincide con los nombres de ejemplo.
  if (filtered.length === 0) {
    filtered = bitacora.slice(0, 3);
  }

  const exportCSV = () => {
    const headers = ["Fecha", "Acción", "Tipo"];
    const rows = filtered.map(ev => [ev.fecha, ev.accion, ev.tipo]);
    const csv = headers.join(",") + "\n" + rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mi_actividad_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Cerrar modal con Escape
  useEffect(() => {
    if (!showModal) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setShowModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showModal]);

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>

      {/* Reusable DashboardHeader (no other changes) */}
      {/* Cabecera reutilizable */}
      <DashboardHeader title={"Bitácora"} avatarUrl={avatarMap[userEmail] || "/default-avatar.png"} />
      {/* Quitar la línea inferior del header solo en esta vista */}
      <style jsx>{`
        header { border-bottom: none !important; }
      `}</style>

      {/* Botón debajo del header (Mi actividad) */}
      <div className="w-full px-6 mt-4">
        <div className="max-w-5xl flex justify-between items-center">
          <BackToHomeButton darkMode={darkMode} />
          <div className="flex items-center space-x-3">
            <input type="text" placeholder="Buscar en mis acciones..." value={search} onChange={e => setSearch(e.target.value)} className="px-3 py-2 rounded-lg border text-sm font-semibold focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-sm bg-white dark:bg-slate-800 border-blue-400 dark:border-slate-700 text-blue-900 dark:text-white" />
            <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow hover:from-blue-700 hover:to-green-600 transition-all text-sm">
              Exportar (mis registros)
            </button>
          </div>
        </div>
      </div>

      {/* (Icono movido dentro del contenedor de filtros, justo encima del botón Exportar CSV) */}

  {/* Contenedor principal */}
      <div className={`max-w-full mx-auto mt-10 p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-slate-900' : 'bg-white/80'} min-h-[700px]`}> 

        {/* Filtros */}
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
            <button
              onClick={() => setShowModal(true)}
              aria-label="Abrir aviso legal"
              className="p-3 rounded-full bg-white/90 dark:bg-slate-900/50 border border-grey-100 dark:border-slate-700 shadow-sm hover:scale-105 transition"
              title="Aviso legal"
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" className="text-blue-600 dark:text-blue-500">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 9a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 6h-2v-4h2v4Z" />
              </svg>
            </button>
            <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow hover:from-blue-700 hover:to-green-600 transition-all">
              Exportar CSV
            </button>
          </div>
        </div>

      {/* Aviso legal de bitácora al pie de la página */}
      

        {/* Tabla */}
        <div className="overflow-x-auto rounded-2xl">
          <table className="w-full text-lg table-fixed border-collapse">
            <colgroup>
              <col className="w-1/4" />
              <col className="w-1/2" />
              <col className="w-1/4" />
            </colgroup>
            <thead className={darkMode ? "bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
              <tr>
                <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider text-left">Fecha</th>
                <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider text-left">Acción</th>
                <th className="px-6 py-4 border-b border-blue-800/60 dark:border-blue-900/80 font-semibold text-base uppercase tracking-wider text-left">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((ev, idx) => (
                  <tr key={ev.id} className={`transition-all duration-150 ${darkMode ? (idx % 2 === 0 ? 'bg-slate-900' : 'bg-blue-900') : (idx % 2 === 0 ? 'bg-white' : 'bg-blue-50/60')}`}>
                    <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60 text-left">{ev.fecha} {ev.hora}</td>
                    <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60 text-left">{ev.accion}</td>
                    <td className="px-6 py-4 border-b border-blue-900/30 dark:border-blue-900/60 text-left">{ev.tipo}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400 dark:text-gray-500 font-semibold">
                    No tienes actividad reciente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
                    </div>

      {/* Modal de aviso legal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div role="dialog" aria-modal="true" className="relative z-10 w-[90%] max-w-2xl p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Aviso legal — Bitácora</h3>
              <button onClick={() => setShowModal(false)} aria-label="Cerrar" className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">✕</button>
            </div>
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
              <p>Esta bitácora registra y almacena todas las acciones realizadas en el sistema conforme a la LES-BCS. El acceso y manejo de la información está restringido y auditado.</p>
              <p className="mt-3 text-xs text-gray-500">Al continuar está aceptando las políticas de uso y confidencialidad.</p>
            </div>
          </div>
        </div>
      )}

      {/* Aviso legal (eliminado el banner fijo inferior — ahora el icono arriba controla su vista) */}

    </div>
  );

}
