"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "../../../components/BackToHomeButton";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faCheckCircle,
  faExclamationTriangle,
  faArchive,
  faFileAlt,
  faChartLine,
  faFilter,
  faGavel,
  faBarcode,
  faFileContract,
  faSearch,
  faStar,
  faDownload,
  faHistory,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";

export default function MisDocumentosPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email,
    avatar: avatarMap[session?.user?.email] || "/default-avatar.png",
  };

  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Todos");
  const [filterVigencia, setFilterVigencia] = useState("Todos");
  const [filterClasificacion, setFilterClasificacion] = useState("Todos");
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [showCompliance, setShowCompliance] = useState(true);
  const userId = session?.user?.id;

  // Estado para favoritos
  const [favoritos, setFavoritos] = useState([]); // array de strings

  // Cargar favoritos del usuario
  const cargarFavoritos = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/favoritos-documentos?usuarioId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setFavoritos(Array.isArray(data) ? data.map(fav => String(fav.documentoId)) : []);
      }
    } catch (error) {
      console.error('Error al cargar favoritos:', error);
    }
  };

  useEffect(() => {
    cargarFavoritos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Estado para saber si se está procesando el favorito
  const [favoritoLoading, setFavoritoLoading] = useState(null); // documentoId o null

  // Alternar favorito
  const toggleFavorito = async (documentoId) => {
    if (!userId) return;
    setFavoritoLoading(documentoId);
    const esFavorito = favoritos.includes(String(documentoId));
    try {
      let ok = false;
      if (esFavorito) {
        // Quitar de favoritos
        const response = await fetch('/api/favoritos-documentos', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: userId, documentoId })
        });
        ok = response.ok;
      } else {
        // Agregar a favoritos
        const response = await fetch('/api/favoritos-documentos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: userId, documentoId })
        });
        ok = response.ok;
      }
      if (ok) {
        await cargarFavoritos();
      }
    } catch (error) {
      console.error('Error al alternar favorito:', error);
    } finally {
      setFavoritoLoading(null);
    }
  };

  // Cargar documentos del usuario desde la base de datos
  useEffect(() => {
    if (!userId) {
      console.log('❌ No hay userId disponible para mis documentos');
      return;
    }
    
    const cargarDocumentos = async () => {
      try {
        console.log('=== DEBUG MIS DOCUMENTOS ===');
        console.log('userId:', userId);
        console.log('session completa:', session);
        console.log('===========================');
        
        setLoading(true);
        const response = await fetch(`/api/documentos?usuarioId=${userId}`);
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📄 Documentos recibidos:', data);
          setDocumentos(data);
        } else {
          console.error('❌ Error al cargar documentos:', response.statusText);
        }
      } catch (error) {
        console.error('❌ Error al cargar documentos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDocumentos();
  }, [userId]);

  // Cargar tipos de documentos para el filtro
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const response = await fetch('/api/tipos-documentos');
        if (response.ok) {
          const tipos = await response.json();
          setTiposDocumentos(tipos);
        }
      } catch (error) {
        console.error('Error al cargar tipos de documentos:', error);
      }
    };

    cargarTipos();
  }, []);

  const handleDownload = (documento) => {
    if (documento.ruta) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = documento.ruta;
      link.download = documento.nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert(`Descargando: ${documento.nombre}`);
    }
  };

  const handleEdit = (documento) => {
    // Aquí podrías implementar la funcionalidad de edición
    alert(`Editando: ${documento.nombre}`);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Está seguro de que desea eliminar este documento?")) {
      try {
        const response = await fetch(`/api/documentos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remover de la lista local
          setDocumentos(prev => prev.filter(doc => doc.id !== id));
          alert('Documento eliminado exitosamente');
        } else {
          alert('Error al eliminar el documento');
        }
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        alert('Error al eliminar el documento');
      }
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  // Filtrar documentos con criterios archivísticos
  const filteredDocuments = documentos.filter((doc) => {
    const matchesSearch = doc.nombre.toLowerCase().includes(search.toLowerCase()) ||
                         doc.descripcion?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "Todos" || doc.tipos_documentos?.tipo === filterType;
    
    // Simulación de vigencia basada en fecha de subida (en producción vendría de BD)
    const fechaSubida = new Date(doc.fecha_subida);
    const hoy = new Date();
    const diasTranscurridos = Math.floor((hoy - fechaSubida) / (1000 * 60 * 60 * 24));
    const vigencia = diasTranscurridos < 30 ? "Vigente" : 
                    diasTranscurridos < 365 ? "Próximo a vencer" : "Histórico";
    
    const matchesVigencia = filterVigencia === "Todos" || vigencia === filterVigencia;
    
    return matchesSearch && matchesType && matchesVigencia;
  });

  // Funciones de análisis archivístico
  const getDocumentStatus = (documento) => {
    const fechaSubida = new Date(documento.fecha_subida);
    const hoy = new Date();
    const diasTranscurridos = Math.floor((hoy - fechaSubida) / (1000 * 60 * 60 * 24));
    
    if (diasTranscurridos < 30) return { status: "Vigente", color: "green", icon: faCheckCircle };
    if (diasTranscurridos < 365) return { status: "Próximo a vencer", color: "yellow", icon: faExclamationTriangle };
    return { status: "Histórico", color: "blue", icon: faArchive };
  };

  const getComplianceMetrics = () => {
    const vigentes = documentos.filter(d => {
      const dias = Math.floor((new Date() - new Date(d.fecha_subida)) / (1000 * 60 * 60 * 24));
      return dias < 30;
    }).length;
    
    const proximosVencer = documentos.filter(d => {
      const dias = Math.floor((new Date() - new Date(d.fecha_subida)) / (1000 * 60 * 60 * 24));
      return dias >= 30 && dias < 365;
    }).length;
    
    const historicos = documentos.filter(d => {
      const dias = Math.floor((new Date() - new Date(d.fecha_subida)) / (1000 * 60 * 60 * 24));
      return dias >= 365;
    }).length;
    
    return { vigentes, proximosVencer, historicos };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getFileIcon = (mime) => {
    if (mime?.includes('pdf')) return '📄';
    if (mime?.includes('word') || mime?.includes('document')) return '📝';
    if (mime?.includes('excel') || mime?.includes('spreadsheet')) return '📊';
    if (mime?.includes('powerpoint') || mime?.includes('presentation')) return '📽️';
    if (mime?.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    }`}>
      {/* Header premium reutilizable */}
      <DashboardHeader title="Mis Documentos" darkMode={darkMode} onToggleDarkMode={toggleTheme} />
      {/* Botón Volver al Inicio premium */}
      <div className="px-6 pt-4">
        <BackToHomeButton href="/home" darkMode={darkMode} />
      </div>

      {/* Botón flotante para mostrar el panel de cumplimiento */}
      {!showCompliance && (
        <button
          onClick={() => setShowCompliance(true)}
          className={`fixed z-50 bottom-8 right-8 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg border-2 transition-all duration-300 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400/50
            ${darkMode
              ? "bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700 text-white hover:bg-blue-800/80 hover:border-blue-500"
              : "bg-white border-blue-400 text-blue-900 hover:bg-blue-100 hover:border-blue-600"}
          `}
          title="Mostrar Panel de Cumplimiento Archivístico"
          aria-label="Mostrar Panel de Cumplimiento Archivístico"
        >
          <FontAwesomeIcon icon={faShieldAlt} className="text-blue-500 text-lg" />
          Mostrar Panel de Cumplimiento
        </button>
      )}

      {/* Contenido principal */}
      <div className="w-screen max-w-full px-2 sm:px-4 py-6 mx-auto">
        {/* Panel de Cumplimiento Legal */}
        {showCompliance && (
          <div className={`p-6 rounded-xl border-4 mb-8 transition-all duration-300 ${
            darkMode 
              ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700" 
              : "bg-white border-blue-300 shadow-md"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-xl" />
                <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Panel de Cumplimiento Archivístico
                </h2>
              </div>
              <button
                onClick={() => setShowCompliance(false)}
                className={`text-sm px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 ${darkMode ? "text-gray-400 hover:text-gray-200 hover:bg-slate-700/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"}`}
              >
                Ocultar
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Documentos Vigentes",
                  value: getComplianceMetrics().vigentes,
                  icon: faCheckCircle,
                  color: "emerald",
                  bg: darkMode ? "bg-emerald-900/60" : "bg-emerald-200",
                  border: darkMode ? "border-emerald-700" : "border-emerald-300",
                  iconColor: darkMode ? "text-emerald-200" : "text-emerald-700",
                  text: darkMode ? "text-emerald-100" : "text-emerald-900",
                  description: "Cumplimiento de retención activa"
                },
                {
                  label: "Próximos a Transferir",
                  value: getComplianceMetrics().proximosVencer,
                  icon: faExclamationTriangle,
                  color: "amber",
                  bg: darkMode ? "bg-amber-900/60" : "bg-amber-200",
                  border: darkMode ? "border-amber-700" : "border-amber-300",
                  iconColor: darkMode ? "text-amber-200" : "text-amber-700",
                  text: darkMode ? "text-amber-100" : "text-amber-900",
                  description: "Requieren evaluación de disposición"
                },
                {
                  label: "Archivo Histórico",
                  value: getComplianceMetrics().historicos,
                  icon: faArchive,
                  color: "sky",
                  bg: darkMode ? "bg-sky-900/60" : "bg-sky-200",
                  border: darkMode ? "border-sky-700" : "border-sky-300",
                  iconColor: darkMode ? "text-sky-200" : "text-sky-700",
                  text: darkMode ? "text-sky-100" : "text-sky-900",
                  description: "Conservación permanente o transferidos"
                }
              ].map((metric, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl shadow-md border-2 transition-all duration-300 transform hover:scale-[1.035] hover:shadow-xl flex flex-col justify-between ${metric.bg} ${metric.border}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FontAwesomeIcon icon={metric.icon} className={`text-2xl ${metric.iconColor}`} />
                    <span className={`font-semibold text-lg ${metric.text}`}>{metric.value}</span>
                  </div>
                  <p className={`text-sm font-medium ${metric.text}`}>{metric.label}</p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{metric.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estadísticas expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Documentos",
              value: documentos.length,
              icon: faFileAlt,
              color: "sky",
              bg: darkMode ? "bg-sky-900/60" : "bg-sky-200",
              border: darkMode ? "border-sky-700" : "border-sky-300",
              iconColor: darkMode ? "text-sky-200" : "text-sky-700",
              text: darkMode ? "text-sky-100" : "text-sky-900"
            },
            {
              label: "Subidos Hoy",
              value: documentos.filter(d => new Date(d.fecha_subida).toDateString() === new Date().toDateString()).length,
              icon: faChartLine,
              color: "teal",
              bg: darkMode ? "bg-teal-900/60" : "bg-teal-200",
              border: darkMode ? "border-teal-700" : "border-teal-300",
              iconColor: darkMode ? "text-teal-200" : "text-teal-700",
              text: darkMode ? "text-teal-100" : "text-teal-900"
            },
            {
              label: "Tipos de Serie",
              value: new Set(documentos.map(d => d.tipos_documentos?.tipo)).size,
              icon: faFilter,
              color: "rose",
              bg: darkMode ? "bg-rose-900/60" : "bg-rose-200",
              border: darkMode ? "border-rose-700" : "border-rose-300",
              iconColor: darkMode ? "text-rose-200" : "text-rose-700",
              text: darkMode ? "text-rose-100" : "text-rose-900"
            },
            {
              label: "Retención Legal",
              value: `${Math.round((getComplianceMetrics().vigentes / (documentos.length || 1)) * 100)}%`,
              icon: faGavel,
              color: "violet",
              bg: darkMode ? "bg-violet-900/60" : "bg-violet-200",
              border: darkMode ? "border-violet-700" : "border-violet-300",
              iconColor: darkMode ? "text-violet-200" : "text-violet-700",
              text: darkMode ? "text-violet-100" : "text-violet-900"
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`animate-scale-in p-6 rounded-2xl shadow-md border-2 transition-all duration-300 transform hover:scale-[1.035] hover:shadow-xl flex flex-col justify-between ${stat.bg} ${stat.border}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 shadow ${stat.iconColor}`}>
                  <FontAwesomeIcon icon={stat.icon} className={`text-2xl ${stat.iconColor}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${stat.text}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros archivísticos avanzados */}
        <div className={`p-6 rounded-xl border mb-8 transition-all duration-300 ${
          darkMode 
            ? "bg-slate-800/50 border-slate-700" 
            : "bg-white border-blue-200 shadow-sm"
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faFileContract} className="text-blue-600" />
            <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Filtros de Gestión Archivística
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`} 
              />
              <input
                type="text"
                placeholder="Buscar por folio, nombre, contenido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-300 ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              />
            </div>

            {/* Filtro por Serie Documental */}
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="Todos">📁 Todas las Series</option>
                {tiposDocumentos.map((tipo) => (
                  <option key={tipo.id} value={tipo.tipo}>
                    📋 {tipo.tipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Vigencia */}
            <div>
              <select
                value={filterVigencia}
                onChange={(e) => setFilterVigencia(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition-all duration-300 ${
                  darkMode 
                    ? "bg-slate-700 border-slate-600 text-white focus:border-blue-500" 
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
              >
                <option value="Todos">⏱️ Toda Vigencia</option>
                <option value="Vigente">✅ Vigente (Archivo de Trámite)</option>
                <option value="Próximo a vencer">⚠️ Próximo a Transferir</option>
                <option value="Histórico">🏛️ Archivo Histórico</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => {
                  // Generar CSV de ejemplo de inventario legal
                  const encabezados = [
                    'ID', 'Nombre', 'Serie Documental', 'Fecha Ingreso', 'Estado Legal', 'Días en Archivo', 'Descripción', 'MIME'
                  ];
                  let rows = filteredDocuments.map(doc => {
                    const status = getDocumentStatus(doc);
                    const dias = Math.floor((new Date() - new Date(doc.fecha_subida)) / (1000 * 60 * 60 * 24));
                    return [
                      doc.id,
                      '"' + doc.nombre.replace(/"/g, '""') + '"',
                      doc.tipos_documentos?.tipo || 'Sin clasificar',
                      formatDate(doc.fecha_subida),
                      status.status,
                      dias,
                      '"' + (doc.descripcion ? doc.descripcion.replace(/"/g, '""') : '') + '"',
                      doc.mime
                    ].join(',');
                  });
                  if (rows.length === 0) {
                    rows = [
                      '1,"Ejemplo de documento","Serie General",01/01/2024,Vigente,12,"Descripción de ejemplo","application/pdf"'
                    ];
                  }
                  const csv = [encabezados.join(','), ...rows].join('\r\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'inventario_legal.csv';
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                className={`w-full px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl font-semibold ${
                  darkMode
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/30"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400 hover:shadow-green-400/30"
                }`}
              >
                <FontAwesomeIcon icon={faBarcode} className="mr-2 transition-all duration-300 hover:scale-125" />
                Inventario Legal
              </button>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${
          darkMode 
            ? "bg-slate-800/50 border-slate-700" 
            : "bg-white border-blue-200 shadow-sm"
        } w-screen max-w-full mx-auto`}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className={darkMode ? "text-gray-300" : "text-gray-600"}>Cargando documentos...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <FontAwesomeIcon icon={faFileAlt} className={`text-4xl mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} />
              <p className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {documentos.length === 0 ? "No tienes documentos subidos" : "No se encontraron documentos"}
              </p>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {documentos.length === 0 ? "Sube tu primer documento desde el dashboard" : "Intenta con otros términos de búsqueda"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <table className="w-screen max-w-full min-w-[1400px] mx-auto">
                <thead className={`${darkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                  <tr>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  title="Nombre del documento y serie documental"
                >
                  📄 Documento / Serie
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  title="Clasificación archivística o serie documental"
                >
                  📂 Clasificación
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  title="Fechas de ingreso y antigüedad en archivo"
                >
                  📅 Fechas Archivísticas
                </th>
                <th
                  className={`px-6 py-4 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  title="Estado legal según la Ley Estatal de Archivos"
                >
                  ⚖️ Estado Legal
                </th>
                <th
                  className={`px-6 py-4 text-center text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                  title="Acciones disponibles sobre el documento"
                >
                  🛠️ Acciones
                </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredDocuments.map((documento, index) => {
                    const status = getDocumentStatus(documento);
                    return (
                      <tr key={documento.id} className={`hover:${darkMode ? "bg-slate-700/50" : "bg-gray-50"} transition-all duration-200`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(documento.mime)}</span>
                            <div>
                              <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {documento.nombre}
                              </p>
                              {documento.descripcion && (
                                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  📋 {documento.descripcion}
                                </p>
                              )}
                              <p className={`text-xs ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                                🔗 ID: {documento.id} | 📊 MIME: {documento.mime}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              darkMode 
                                ? "bg-blue-900/50 text-blue-300" 
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              📁 {documento.tipos_documentos?.tipo || 'Sin clasificar'}
                            </span>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              Serie Documental
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                              📥 Ingreso: {formatDate(documento.fecha_subida)}
                            </p>
                            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              ⏰ {Math.floor((new Date() - new Date(documento.fecha_subida)) / (1000 * 60 * 60 * 24))} días en archivo
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon 
                              icon={status.icon} 
                              className={`text-${status.color}-500`} 
                            />
                            <span className={`text-sm font-medium text-${status.color}-600`}>
                              {status.status}
                            </span>
                          </div>
                          <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Conforme a Ley Estatal
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2">
                            {/* Botón Favorito */}
                            <button
                              onClick={() => toggleFavorito(documento.id)}
                              disabled={favoritoLoading === documento.id}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                favoritos.includes(String(documento.id))
                                  ? (darkMode ? "text-yellow-300 bg-yellow-900/50 hover:bg-yellow-800/70 hover:shadow-yellow-400/30" : "text-yellow-500 bg-yellow-100 hover:bg-yellow-200 hover:shadow-yellow-400/30")
                                  : (darkMode ? "text-gray-400 hover:text-yellow-300 hover:bg-yellow-900/30" : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-100/70")
                              } ${favoritoLoading === documento.id ? 'opacity-60 pointer-events-none' : ''}`}
                              title={favoritos.includes(String(documento.id)) ? "Quitar de favoritos" : "Agregar a favoritos"}
                              aria-label={favoritos.includes(String(documento.id)) ? "Quitar de favoritos" : "Agregar a favoritos"}
                            >
                              <FontAwesomeIcon icon={faStar} className="transition-all duration-300" />
                            </button>
                            {/* Botón Descargar */}
                            <button
                              onClick={() => handleDownload(documento)}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode 
                                  ? "text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 hover:shadow-blue-400/30" 
                                  : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-blue-400/30"
                              }`}
                              title="Descargar el documento en tu equipo"
                              aria-label="Descargar documento"
                            >
                              <FontAwesomeIcon icon={faDownload} className="transition-all duration-300" />
                            </button>
                            {/* Botón Metadatos */}
                            <button
                              onClick={() => alert(`Visualizando metadatos archivísticos de: ${documento.nombre}`)}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode 
                                  ? "text-green-400 hover:bg-green-900/50 hover:text-green-300 hover:shadow-green-400/30" 
                                  : "text-green-600 hover:bg-green-50 hover:text-green-700 hover:shadow-green-400/30"
                              }`}
                              title="Ver metadatos legales y archivísticos"
                              aria-label="Ver metadatos legales"
                            >
                              <FontAwesomeIcon icon={faHistory} className="transition-all duration-300" />
                            </button>
                            {/* Botón Editar */}
                            <button
                              onClick={() => handleEdit(documento)}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode 
                                  ? "text-yellow-400 hover:bg-yellow-900/50 hover:text-yellow-300 hover:shadow-yellow-400/30" 
                                  : "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow-yellow-400/30"
                              }`}
                              title="Editar metadatos del documento"
                              aria-label="Editar metadatos"
                            >
                              <FontAwesomeIcon icon={faEdit} className="transition-all duration-300" />
                            </button>
                            {/* Botón Eliminar */}
                            <button
                              onClick={() => {
                                if (confirm("⚠️ ATENCIÓN: Esta acción debe cumplir con los plazos de retención establecidos en la Ley Estatal de Archivos de BCS.\n\n¿Confirma la eliminación del documento?")) {
                                  handleDelete(documento.id);
                                }
                              }}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode 
                                  ? "text-red-400 hover:bg-red-900/50 hover:text-red-300 hover:shadow-red-400/30" 
                                  : "text-red-600 hover:bg-red-50 hover:text-red-700 hover:shadow-red-400/30"
                              }`}
                              title="Eliminar documento (cumplir normativa de archivo)"
                              aria-label="Eliminar documento"
                            >
                              <FontAwesomeIcon icon={faTrash} className="transition-all duration-300" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
