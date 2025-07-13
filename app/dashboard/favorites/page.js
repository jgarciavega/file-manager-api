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
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold">×</button>
    </div>
  );
}

// Modal de historial/bitácora
function HistoryModal({ open, onClose, history }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        <button className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-red-500" onClick={onClose} aria-label="Cerrar">×</button>
        <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-300">Historial / Bitácora</h2>
        {history && history.length > 0 ? (
          <ul className="space-y-2 max-h-72 overflow-y-auto">
            {history.map((item, idx) => (
              <li key={idx} className="border-b pb-2 text-sm">
                <span className="font-semibold">{item.fecha}:</span> {item.accion}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 dark:text-gray-300">No hay historial disponible.</div>
        )}
      </div>
    </div>
  );
}

export default FavoritosPage;
function FavoritosPage() {
  const { data: session, status } = useSession();
  const [toast, setToast] = useState("");
  const [historyModal, setHistoryModal] = useState({ open: false, history: [] });
  const csvLink = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const userId = session?.user?.id;

  // Cargar favoritos desde la base de datos
  useEffect(() => {
    if (!userId) return;
    const cargarFavoritos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/favoritos-documentos?usuarioId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setFavoritos(data);
        }
      } catch (error) {
        console.error('❌ Error al cargar favoritos:', error);
      } finally {
        setLoading(false);
      }
    };
    cargarFavoritos();
  }, [userId]);

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


  const filteredFiles = favoritos.filter(
    (file) =>
      file.nombre?.toLowerCase().includes(search.toLowerCase()) ||
      file.responsable?.toLowerCase().includes(search.toLowerCase())
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
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"}`}>
      {/* Header premium */}
      <div className={`sticky top-0 z-40 border-b transition-all duration-300 flex items-center justify-between px-6 py-4 ${darkMode ? "bg-slate-900/95 border-slate-700 backdrop-blur-sm" : "bg-white/95 border-blue-200 backdrop-blur-sm"}`}>
        {/* Logo premium */}
        <Image
          src="/api-dark23.png"
          alt="API Logo"
          width={300}
          height={100}
          className="transition-all duration-300 hover:scale-105 object-contain"
          priority
        />
        {/* Título premium */}
        <div className="flex-1 text-center px-4">
          <h1
            className={`relative text-4xl md:text-5xl font-extrabold tracking-tight text-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 cursor-default overflow-hidden select-none`}
            style={{ letterSpacing: '0.04em' }}
          >
            <span className={`relative z-10 ${darkMode ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]" : "text-blue-900 drop-shadow-[0_2px_8px_rgba(96,165,250,0.25)]"}`}>Mis Favoritos</span>
            <span
              className="absolute left-0 top-0 h-full w-full pointer-events-none animate-shine"
              style={{
                background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mixBlendMode: 'lighten',
                opacity: 0.7,
              }}
            >
              Mis Favoritos
            </span>
          </h1>


          <div className={`text-sm font-medium mt-2 flex items-center justify-center gap-1 transition-all duration-300 hover:scale-105 ${darkMode ? "text-gray-300 hover:text-green-300" : "text-gray-600 hover:text-green-600"}`}>
            <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-base animate-bounce drop-shadow" />
            <span className="hover:tracking-wider transition-all duration-300 font-semibold">Tus documentos favoritos siempre a la mano</span>
          </div>
        </div>

        {/* Avatar y toggle */}
        <div className="flex items-center gap-3">
          <Image
            src={
              session?.user?.avatar
                ? session.user.avatar
                : avatarMap[session?.user?.rol] || "/blanca.jpeg"
            }
            alt="Avatar"
            width={90}
            height={90}
            className="rounded-full border-3 border-blue-400 shadow-lg hover:scale-105 transition-all duration-300"
          />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-lg transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:-translate-y-1 shadow-lg hover:shadow-xl ${darkMode ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 hover:shadow-yellow-400/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 hover:shadow-blue-400/30"}`}
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-lg transition-all duration-300 hover:scale-125" />
          </button>
        </div>
      </div>
      {/* Botón Volver al Inicio y Exportar */}
      <div className="px-6 pt-4 flex flex-wrap gap-4 items-center justify-between">
        <Link
          href="/home"
          className={`group inline-flex items-center gap-3 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 ${darkMode ? "bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-500 text-white hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-500/30" : "bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-500 text-white hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/30"}`}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm transition-all duration-300 group-hover:-translate-x-1 group-hover:scale-110" />
          <span className="font-semibold text-sm tracking-wide group-hover:tracking-wider transition-all duration-300">Volver al Inicio</span>
        </Link>
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
      {/* Advertencia confidencialidad */}
      <div className={`max-w-7xl mx-auto px-4 mt-4 mb-2`}>
        <div className={`rounded-lg p-3 flex items-center gap-3 text-sm font-semibold shadow-md border-2 ${darkMode ? "bg-yellow-900/30 text-yellow-100 border-yellow-700/60" : "bg-yellow-50 text-yellow-900 border-yellow-300/80"}`}>
          <FontAwesomeIcon icon={faStar} className="text-yellow-400 animate-pulse" />
          <span className="tracking-wide">Algunos documentos pueden ser confidenciales o restringidos. El acceso y descarga están sujetos a la Ley Estatal de Archivos y políticas internas.</span>
        </div>
      </div>
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
          <table className="w-full min-w-[1200px] table-auto text-sm border-collapse">
            <thead className={darkMode ? "bg-gradient-to-r from-blue-900 via-slate-800 to-blue-900 text-blue-100" : "bg-gradient-to-r from-blue-100 via-white to-blue-100 text-blue-900"}>
              <tr>
                <th className="px-4 py-3 border-b font-semibold text-xs">Documento</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Fecha</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Responsable</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Tipo</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Clasificación</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Vigencia</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Área</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Expediente</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Estado</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Hash/Folio</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Historial</th>
                <th className="px-4 py-3 border-b font-semibold text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFiles.length > 0 ? (
                paginatedFiles.map((file) => (
                  <tr key={file.id} className={`text-center transition-all duration-200 ${darkMode ? "hover:bg-blue-900/30" : "hover:bg-blue-50/60"}`} style={{ borderBottom: darkMode ? '1px solid #223' : '1px solid #e0e7ef' }}>
                    <td className="px-4 py-3">{file.nombre}</td>
                    <td className="px-4 py-3">{formatDate(file.fecha_subida)}</td>
                    <td className="px-4 py-3">{file.responsable || 'N/A'}</td>
                    <td className="px-4 py-3">{file.tipo}</td>
                    <td className="px-4 py-3">{file.clasificacion || <span className="italic text-gray-400">No especificada</span>}</td>
                    <td className="px-4 py-3">{file.vigencia || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3">{file.area || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3">{file.expediente || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className={`px-4 py-3 font-semibold ${statusColor(file.estado)}`}>{file.estado || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3">{file.hash || file.folio || <span className="italic text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3">
                      <button
                        className={`underline text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400 transition-all duration-200`}
                        title="Ver historial/bitácora"
                        onClick={() => handleShowHistory(file)}
                        aria-label={`Ver historial de ${file.nombre}`}
                      >
                        Ver
                      </button>
                    </td>
      <Toast message={toast} onClose={() => setToast("")} />
      <HistoryModal open={historyModal.open} onClose={() => setHistoryModal({ open: false, history: [] })} history={historyModal.history} />
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
      </div>
    </div>
  );
}
