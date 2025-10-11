"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faMoon,
  faSun,
  faStar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import DashboardHeader from '@/components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';


// Toast simple
function Toast({ message, onClose, duration = 3000 }) {
  // Cierra el toast automáticamente
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
      {message}
    </div>
  );
}

// Componente modal simple para mostrar historial
function HistoryModal({ open, onClose, history = [] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Historial</h3>
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Cerrar</button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
          {history.length ? history.map((h, i) => (
            <div key={i} className="p-2 rounded-lg bg-gray-50 dark:bg-slate-800">
              <div className="font-medium">{h.accion}</div>
              <div className="text-xs opacity-75">{h.fecha}</div>
            </div>
          )) : (
            <div className="text-sm opacity-70">No hay historial disponible.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [toast, setToast] = useState("");
  const [historyModal, setHistoryModal] = useState({ open: false, history: [] });
  const csvLink = useRef(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);

  // Sincronizar el estado local de tema con la clase `dark` del root y con el evento global `themechange`
  useEffect(() => {
    const root = document.documentElement;
    const readStored = () => {
      try { return localStorage.getItem('theme'); } catch (e) { return null; }
    };

    const stored = readStored();
    if (stored === 'dark') setDarkMode(true);
    else if (stored === 'light') setDarkMode(false);
    else setDarkMode(root.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));

    const onThemeChange = (e) => {
      const t = e?.detail?.theme;
      if (t === 'dark') setDarkMode(true);
      else if (t === 'light') setDarkMode(false);
      else setDarkMode(root.classList.contains('dark'));
    };
    window.addEventListener('themechange', onThemeChange);

    const observer = new MutationObserver(() => {
      setDarkMode(root.classList.contains('dark'));
    });
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('themechange', onThemeChange);
      observer.disconnect();
    };
  }, []);
  const handleDownload = (file) => {
    if (file.ruta) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = file.ruta;
      link.download = file.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Descargando: ${file.nombre}`);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar este archivo de favoritos?")) {
      try {
        const response = await fetch('/api/favoritos-documentos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: userId, documentoId: id })
        });
        if (response.ok) {
          setFavoritos(prev => prev.filter(file => file.id !== id));
        } else {
          alert('Error al eliminar de favoritos');
        }
      } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        alert('Error al eliminar de favoritos');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };


  const listaFavoritos = Array.isArray(favoritos) ? favoritos : [];
  const filteredFiles = listaFavoritos.filter(
    (file) =>
      file?.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      file?.responsable?.toLowerCase().includes(search.toLowerCase())
  );

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredFiles.length / pageSize));
  const paginatedFiles = filteredFiles.slice((page - 1) * pageSize, page * pageSize);

  const statusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "text-yellow-500";
      case "Revisado":
        return "text-green-500";
      case "Rechazado":
        return "text-red-500";
      default:
        return "text-gray-800 dark:text-white";
    }
  };

  const handleExport = () => {
    if (!filteredFiles.length) {
      setToast("No hay documentos para exportar.");
      return;
    }
    const headers = [
      "Documento", "Fecha", "Responsable", "Tipo", "Clasificación", "Vigencia", "Área", "Expediente", "Estado", "Hash/Folio"
    ];
    const rows = filteredFiles.map(f => [
      f.nombre,
      formatDate(f.fecha_subida),
      f.responsable,
      f.tipo,
      f.clasificacion,
      f.vigencia,
      f.area,
      f.expediente,
      f.estado,
      f.hash || f.folio
    ]);
    let csv = headers.join(",") + "\n" + rows.map(r => r.map(x => '"'+(x||"").replace(/"/g,'""')+'"').join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    if (csvLink.current) {
      csvLink.current.href = url;
      csvLink.current.download = `favoritos_${new Date().toISOString().slice(0,10)}.csv`;
      csvLink.current.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setToast("Exportación exitosa");
    }
  };

  const handleShowHistory = (file) => {
    // Simulación: historial dummy
    const dummy = [
      { fecha: "2025-07-10", accion: "Descargado por el usuario" },
      { fecha: "2025-07-09", accion: "Marcado como favorito" },
      { fecha: "2025-07-08", accion: "Validado por el área legal" },
    ];
    setHistoryModal({ open: true, history: dummy });
  };

  // Validar sesión
  if (status === "loading") {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
        <div className="text-xl font-semibold">Cargando sesión...</div>
      </div>
    );
  }
  if (!session || !session.user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
        <div className="text-xl font-semibold">Debes iniciar sesión para ver tus favoritos.</div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <div className="text-xl font-semibold">Cargando favoritos...</div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-gray-900">
      {/* Reemplazado por componente DashboardHeader */}
      <DashboardHeader title="Mis Favoritos" avatarUrl={session?.user ? (session.user.avatar || avatarMap[session?.user?.email] || '/default-avatar.png') : '/default-avatar.png'} />
      {/* Botón Volver al Inicio y Exportar */}
      <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between">
        <BackToHomeButton href="/dashboard" label="Volver al Inicio" darkMode={darkMode} />
        {/* Botón exportar */}
        <button
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 ${darkMode ? "bg-gradient-to-r from-blue-700 to-purple-700 text-white hover:from-blue-600 hover:to-purple-600" : "bg-gradient-to-r from-blue-200 to-purple-200 text-blue-900 hover:from-blue-300 hover:to-purple-300"}`}
          title="Exportar lista de favoritos a Excel/CSV"
          onClick={handleExport}
        >
          <FontAwesomeIcon icon={faDownload} /> Exportar lista
        </button>
        <a ref={csvLink} style={{ display: 'none' }}>Descargar</a>
      </div>
      {/* (Advertencia movida abajo) */}
      {/* Buscador premium */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-end mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, responsable, expediente..."
            className={`px-4 py-2 rounded-lg border text-base w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-md font-semibold ${darkMode ? "bg-slate-800 border-slate-600 text-white placeholder-gray-400" : "bg-white border-blue-200 text-blue-900 placeholder-blue-400"}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ letterSpacing: '0.01em' }}
          />
        </div>

        {/* Tabla premium con nuevas columnas */}
        <div className={`rounded-xl border overflow-x-auto transition-all duration-300 shadow-xl ring-1 ring-blue-100/40 ${darkMode ? "bg-slate-900/90 border-slate-800 ring-0" : "bg-white/95 border-blue-100"}`}>
          <style jsx global>{`
            .premium-title-gradient-fav {
              background: linear-gradient(90deg, #1e3a8a 0%, #60a5fa 40%, #a78bfa 60%, #fff 100%);
              background-size: 200% auto;
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              -webkit-text-fill-color: transparent;
              animation: premium-gradient-move 3.5s linear infinite;
            }
            .dark-premium-title-gradient-fav {
              background: linear-gradient(90deg, #60a5fa 0%, #a78bfa 40%, #facc15 60%, #fff 100%);
              background-size: 200% auto;
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              -webkit-text-fill-color: transparent;
              animation: premium-gradient-move 3.5s linear infinite;
            }
            @keyframes premium-gradient-move {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
          `}</style>

          <table className="w-full min-w-[1200px] table-auto text-sm border-collapse border border-blue-500 dark:border-blue-900">
            <thead className={darkMode ? "bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
              <tr className="border-b border-blue-500 dark:border-blue-900">
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Documento</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Fecha</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Responsable</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Tipo</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Clasificación</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Vigencia</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Área</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Expediente</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Estado</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Hash/Folio</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Historial</th>
                <th className="px-4 py-3 border-b border-blue-500 dark:border-blue-900 font-semibold text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.length > 0 ? (
                paginatedFiles.map((file) => (
                  <tr key={file.id} className={`text-center transition-all duration-200 ${darkMode ? "hover:bg-blue-900/30" : "hover:bg-blue-50/60"} border-b border-blue-500 dark:border-blue-900`}>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.nombre}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{formatDate(file.fecha_subida)}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.responsable || 'N/A'}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.tipo}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.clasificacion || <span className="italic text-gray-400">No especificada</span>}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.vigencia || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.area || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.expediente || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className={`px-4 py-3 border-r border-blue-300 dark:border-blue-900 font-semibold ${statusColor(file.estado)}`}>{file.estado || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">{file.hash || file.folio || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3 border-r border-blue-300 dark:border-blue-900">
                      <button
                        className={`underline text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400 transition-all duration-200`}
                        title="Ver historial/bitácora"
                        onClick={() => handleShowHistory(file)}
                        aria-label={`Ver historial de ${file.nombre}`}
                      >
                        Ver
                      </button>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-2">
                      <button
                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${darkMode ? "text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 hover:shadow-blue-400/30" : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-blue-400/30"}`}
                        onClick={() => handleDownload(file)}
                        title="Descargar"
                        aria-label={`Descargar ${file.nombre}`}
                      >
                        <FontAwesomeIcon icon={faDownload} className="transition-all duration-300" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${darkMode ? "text-red-400 hover:bg-red-900/50 hover:text-red-300 hover:shadow-red-400/30" : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-red-400/30"}`}
                        onClick={() => handleDelete(file.id)}
                        title="Eliminar de favoritos"
                        aria-label={`Eliminar ${file.nombre} de favoritos`}
                      >
                        <FontAwesomeIcon icon={faTrash} className="transition-all duration-300" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center p-8 text-gray-500 dark:text-gray-300">No hay documentos marcados como favoritos.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-center items-center gap-2 py-6">
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-blue-200 hover:text-blue-800 dark:bg-slate-800 dark:text-blue-100 dark:hover:bg-blue-900 dark:hover:text-yellow-200"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            <span className="mx-2 text-base font-bold tracking-wide text-blue-900 dark:text-blue-100">Página {page} de {totalPages}</span>
            <button
              className="px-3 py-1 rounded bg-blue-100 text-blue-900 font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-blue-200 hover:text-blue-800 dark:bg-slate-800 dark:text-blue-100 dark:hover:bg-blue-900 dark:hover:text-yellow-200"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>

          <style jsx global>{`
            @keyframes shine {
              0% { left: -100%; }
              100% { left: 100%; }
            }
            .animate-shine {
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              animation: shine 2.5s linear infinite;
              background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%);
              background-clip: text;
              -webkit-background-clip: text;
              color: transparent;
              pointer-events: none;
              z-index: 20;
            }
          `}</style>
        </div>
        {/* Toast y modal movidos fuera de la tabla */}
        <Toast message={toast} onClose={() => setToast("")} />
        <HistoryModal open={historyModal.open} onClose={() => setHistoryModal({ open: false, history: [] })} history={historyModal.history} />

        {/* Advertencia confidencialidad (fuera del contenedor de la tabla) */}
        <div className={`max-w-7xl mx-auto px-4 mt-8 mb-8`}>
          <div className={`rounded-lg p-3 flex items-center gap-3 text-sm font-semibold shadow-md border-2 ${darkMode ? "bg-yellow-900/30 text-yellow-100 border-yellow-700/60" : "bg-yellow-50 text-yellow-900 border-yellow-300/80"}`}>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 animate-pulse" />
            <span className="tracking-wide">Algunos documentos pueden ser confidenciales o restringidos. El acceso y descarga están sujetos a la Ley Estatal de Archivos y políticas internas.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
