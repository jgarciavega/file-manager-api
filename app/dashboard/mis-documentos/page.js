"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/DashboardHeader';
import BackToHomeButton from '@/components/BackToHomeButton';
import DashboardMenu from '@/components/DashboardMenu';
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEdit,
  faTrash,
  faMoon,
  faSun,
  faFileAlt,
  faArrowLeft,
  faSearch,
  faFilter,
  faChartLine,
  faShieldAlt,
  faCalendarAlt,
  faArchive,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faGavel,
  faFileContract,
  faHistory,
  faBarcode,

  faStar,
} from "@fortawesome/free-solid-svg-icons";

export default function MisDocumentosPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email,
    avatar: avatarMap[session?.user?.email] || "/default-avatar.png",
  };

  // Modo oscuro sincronizado exactamente como UploadNew.js
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const root = document.documentElement;

    const readTheme = () => {
      try {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') return true;
        if (stored === 'light') return false;
      } catch (e) {}
      return root.classList.contains('dark');
    };

    setDarkMode(readTheme());

    const onThemeChange = (e) => {
      const theme = e?.detail?.theme;
      if (theme) setDarkMode(theme === 'dark');
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
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("Todos");
  const [filterVigencia, setFilterVigencia] = useState("Todos");
  const [filterClasificacion, setFilterClasificacion] = useState("Todos");
  const [tiposDocumentos, setTiposDocumentos] = useState([]);
  const [showCompliance, setShowCompliance] = useState(true);
  const userId = session?.user?.id;

  // Wrapper seguro: si `documentos` no es un array, usamos un fallback vacío
  const listaDocumentos = Array.isArray(documentos)
    ? documentos
    : (documentos?.documentos || documentos?.data || []);

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
          const normalized = Array.isArray(data) ? data : (data?.documentos || data?.data || []);
          setDocumentos(normalized);
        } else {
          console.error('❌ Error al cargar documentos:', response.statusText);
          setDocumentos([]);
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
          setTiposDocumentos(Array.isArray(tipos) ? tipos : (tipos?.data || []));
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

  // El modo oscuro se controla globalmente

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
  <div className="min-h-screen bg-white transition-all duration-300 dark:bg-slate-900">
      <DashboardHeader title="Mis Documentos" avatarUrl={user.avatar} />

      <div className="w-full px-12 pt-4 pb-0">
        <div className="flex items-center justify-between w-full">
          <div>
            <BackToHomeButton />
          </div>
          <div className="">
            <DashboardMenu />
          </div>
        </div>
      </div>

  {/* Contenido principal */}
  <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Panel de Cumplimiento Legal */}
        {showCompliance && (
          <div className={`p-6 rounded-xl border mb-8 transition-all duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-700"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
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
                  color: "green",
                  description: "Cumplimiento de retención activa"
                },
                { 
                  label: "Próximos a Transferir", 
                  value: getComplianceMetrics().proximosVencer, 
                  icon: faExclamationTriangle, 
                  color: "yellow",
                  description: "Requieren evaluación de disposición"
                },
                { 
                  label: "Archivo Histórico", 
                  value: getComplianceMetrics().historicos, 
                  icon: faArchive, 
                  color: "blue",
                  description: "Conservación permanente o transferidos"
                }
              ].map((metric, index) => {
                // Definir el color de borde en modo claro para el panel de cumplimiento
                let borderColor = "border-gray-200";
                if (!darkMode) {
                  if (metric.color === "green") borderColor = "border-green-400";
                  else if (metric.color === "yellow") borderColor = "border-yellow-400";
                  else if (metric.color === "blue") borderColor = "border-blue-400";
                }
                return (
                  <div key={index} className={`p-4 rounded-lg border transition-all duration-300 ${
                    darkMode
                      ? "bg-slate-800/50 border-slate-600 hover:bg-slate-700/50"
                      : `bg-white/80 ${borderColor} hover:shadow-md`
                  }`}>
                    <div className="flex items-center gap-3 mb-2">
                      <FontAwesomeIcon 
                        icon={metric.icon} 
                        className={`text-lg ${
                          metric.color === "green" ? "text-green-500" :
                          metric.color === "yellow" ? "text-yellow-500" : "text-blue-500"
                        }`} 
                      />
                      <span className={`font-semibold text-lg ${
                        metric.color === "green" ? "text-green-600" :
                        metric.color === "yellow" ? "text-yellow-600" : "text-blue-600"
                      }`}>
                        {metric.value}
                      </span>
                    </div>
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {metric.label}
                    </p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {metric.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Estadísticas expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Documentos", value: documentos.length, icon: faFileAlt, color: "blue" },
            { label: "Subidos Hoy", value: documentos.filter(d => 
              new Date(d.fecha_subida).toDateString() === new Date().toDateString()
            ).length, icon: faChartLine, color: "green" },
            { label: "Tipos de Serie", value: new Set(documentos.map(d => d.tipos_documentos?.tipo)).size, icon: faFilter, color: "purple" },
            { label: "Retención Legal", value: `${Math.round((getComplianceMetrics().vigentes / (documentos.length || 1)) * 100)}%`, icon: faGavel, color: "orange" }
          ].map((stat, index) => {
            // Definir el color de borde en modo claro
            let borderColor = "border-gray-200";
            if (!darkMode) {
              if (stat.color === "blue") borderColor = "border-blue-400";
              else if (stat.color === "green") borderColor = "border-green-400";
              else if (stat.color === "purple") borderColor = "border-purple-400";
              else if (stat.color === "orange") borderColor = "border-orange-400";
            }
            return (
              <div
                key={index}
                className={`animate-scale-in p-6 rounded-xl border transition-all duration-300 ${
                  darkMode
                    ? "bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                    : `bg-white/80 ${borderColor} hover:shadow-lg backdrop-blur-sm`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {stat.label}
                    </p>
                    <p className={`text-2xl font-bold ${
                      stat.color === "blue" ? "text-blue-600" :
                      stat.color === "green" ? "text-green-600" :
                      stat.color === "purple" ? "text-purple-600" : "text-orange-600"
                    }`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    stat.color === "blue" ? "bg-blue-100 text-blue-600" :
                    stat.color === "green" ? "bg-green-100 text-green-600" :
                    stat.color === "purple" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"
                  }`}>
                    <FontAwesomeIcon icon={stat.icon} className="text-xl" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filtros archivísticos avanzados */}
        <div className={`p-6 rounded-xl border mb-8 transition-all duration-300 ${
            darkMode
              ? "bg-slate-800/50 border-slate-700"
              : "bg-white/80 border-gray-200 backdrop-blur-sm"
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
                onClick={() => alert("Generando reporte de inventario conforme a la Ley...")}
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
        <div className="bg-white/80 border-gray-200 backdrop-blur-sm dark:bg-slate-800/50 dark:border-slate-700 rounded-xl border overflow-hidden transition-all duration-300">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      📄 Documento / Serie
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      📂 Clasificación
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      📅 Fechas Archivísticas
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                      ⚖️ Estado Legal
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                      🛠️ Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredDocuments.map((documento, index) => {
                    const status = getDocumentStatus(documento);
                    return (
                      <tr key={documento.id} className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50">
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
                              title="Descargar documento"
                            >
                              <FontAwesomeIcon icon={faDownload} className="transition-all duration-300" />
                            </button>
                            <button
                              onClick={() => alert(`Visualizando metadatos archivísticos de: ${documento.nombre}`)}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode
                                  ? "text-green-400 hover:bg-green-900/50 hover:text-green-300 hover:shadow-green-400/30"
                                  : "text-green-600 hover:bg-green-50 hover:text-green-700 hover:shadow-green-400/30"
                              }`}
                              title="Ver metadatos legales"
                            >
                              <FontAwesomeIcon icon={faHistory} className="transition-all duration-300" />
                            </button>
                            <button
                              onClick={() => handleEdit(documento)}
                              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 hover:rotate-12 shadow-md hover:shadow-lg ${
                                darkMode
                                  ? "text-yellow-400 hover:bg-yellow-900/50 hover:text-yellow-300 hover:shadow-yellow-400/30"
                                  : "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 hover:shadow-yellow-400/30"
                              }`}
                              title="Editar metadatos"
                            >
                              <FontAwesomeIcon icon={faEdit} className="transition-all duration-300" />
                            </button>
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
                              title="Eliminar (cumplir normativa)"
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
