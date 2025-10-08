"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faDatabase,
  faBuilding,
  faGavel,
  faFolder,
  faUsers,
  faShieldAlt,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faCancel,
  faSearch,
  faFilter,
  faFileContract,
  faCalendarAlt,
  faArchive,
  faBalanceScale,
  faClipboardList,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faDownload,
  faUpload,
  faRefresh,
  faKey,
  faEye,
  faEyeSlash,
  faBell,
  faServer,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";

export default function Configuracion() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState("catalogos");
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para catálogos LEA-BCS
  const [catalogos, setCatalogos] = useState({
    jefaturas: [
      { id: 1, codigo: "DG", nombre: "Dirección General", descripcion: "Dirección ejecutiva de la API", activo: true },
      { id: 2, codigo: "AF", nombre: "Administración y Finanzas", descripcion: "Gestión administrativa y financiera", activo: true },
      { id: 3, codigo: "OP", nombre: "Operaciones Portuarias", descripcion: "Operaciones y servicios portuarios", activo: true },
      { id: 4, codigo: "CJ", nombre: "Coordinación Jurídica", descripcion: "Asuntos legales y normativos", activo: true },
      { id: 5, codigo: "CS", nombre: "Coordinación de Seguridad", descripcion: "Seguridad portuaria y protección", activo: true }
    ],
    clasificacionesBCS: [
      { id: 1, codigo: "001", nombre: "Normatividad y Legislación", descripcion: "Leyes, reglamentos y normativas", conservacion: "Permanente", activo: true },
      { id: 2, codigo: "002", nombre: "Planeación y Programación", descripcion: "Planes institucionales y programas", conservacion: "10 años", activo: true },
      { id: 3, codigo: "003", nombre: "Organización y Funcionamiento", descripcion: "Estructura organizacional", conservacion: "10 años", activo: true },
      { id: 4, codigo: "004", nombre: "Recursos Humanos", descripcion: "Personal y nómina", conservacion: "7 años", activo: true },
      { id: 5, codigo: "005", nombre: "Recursos Financieros", descripcion: "Presupuesto y finanzas", conservacion: "7 años", activo: true },
      { id: 6, codigo: "007", nombre: "Servicios Portuarios", descripcion: "Operaciones marítimas", conservacion: "5 años", activo: true }
    ],
    seriesDocumentales: [
      { id: 1, codigo: "001.001", nombre: "Acuerdos y Resoluciones", clasificacion: "001", valorDocumental: "legal", plazo: "Permanente", activo: true },
      { id: 2, codigo: "004.001", nombre: "Expedientes de Personal", clasificacion: "004", valorDocumental: "administrativo", plazo: "7 años", activo: true },
      { id: 3, codigo: "005.001", nombre: "Presupuestos", clasificacion: "005", valorDocumental: "fiscal", plazo: "10 años", activo: true },
      { id: 4, codigo: "007.001", nombre: "Bitácoras Operativas", clasificacion: "007", valorDocumental: "administrativo", plazo: "5 años", activo: true }
    ],
    valoresDocumentales: [
      { id: 1, codigo: "ADM", nombre: "Administrativo", descripcion: "Documentos de gestión administrativa", activo: true },
      { id: 2, codigo: "LEG", nombre: "Legal", descripcion: "Documentos con valor jurídico", activo: true },
      { id: 3, codigo: "FIS", nombre: "Fiscal", descripcion: "Documentos fiscales y contables", activo: true },
      { id: 4, codigo: "HIS", nombre: "Histórico", descripcion: "Documentos de valor histórico", activo: true },
      { id: 5, codigo: "MIX", nombre: "Mixto", descripcion: "Documentos con múltiples valores", activo: true }
    ]
  });

  // Configuración del sistema
  const [configuracionSistema, setConfiguracionSistema] = useState({
    general: {
      nombreSistema: "Sistema de Gestión Documental API-BCS",
      versionSistema: "2.1.4",
      maxTamanoArchivo: "150",
      formatosPermitidos: "PDF,DOCX,XLSX,JPG,PNG",
      vigenciaSession: "8",
      habilitarAuditoria: true,
      habilitarNotificaciones: true
    },
    integracion: {
      urlApiExterna: "https://api.gobierno-bcs.gob.mx",
      tokenApi: "**********************",
      timeoutConexion: "30",
      habilitarBackup: true,
      frecuenciaBackup: "diario",
      rutaBackup: "/backups/documentos"
    },
    seguridad: {
      habilitarSSL: true,
      habilitarMFA: false,
      tiempoBloqueo: "15",
      intentosMaximos: "3",
      habilitarLogs: true,
      nivelLogs: "info"
    }
  });

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    const handleThemeChange = () => checkDarkMode();
    window.addEventListener('themechange', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  // Full background coverage for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.backgroundColor = '#0f172a';
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    }

    return () => {
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [darkMode]);

  const handleSaveConfig = (section, config) => {
    setConfiguracionSistema(prev => ({
      ...prev,
      [section]: config
    }));
    // Aquí iría la llamada a la API para guardar
    console.log(`Guardando configuración ${section}:`, config);
  };

  const handleAddCatalogItem = (catalogo, item) => {
    setCatalogos(prev => ({
      ...prev,
      [catalogo]: [...prev[catalogo], { ...item, id: Date.now() }]
    }));
    setShowAddModal(false);
  };

  const handleEditCatalogItem = (catalogo, itemId, updatedItem) => {
    setCatalogos(prev => ({
      ...prev,
      [catalogo]: prev[catalogo].map(item => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      )
    }));
    setEditingItem(null);
  };

  const handleDeleteCatalogItem = (catalogo, itemId) => {
    if (confirm("¿Estás seguro de eliminar este elemento?")) {
      setCatalogos(prev => ({
        ...prev,
        [catalogo]: prev[catalogo].filter(item => item.id !== itemId)
      }));
    }
  };

  const filteredCatalogItems = (catalogName) => {
    if (!searchTerm) return catalogos[catalogName];
    return catalogos[catalogName].filter(item => 
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <>
      {/* Full dark background overlay */}
      {darkMode && (
        <div className="fixed inset-0 bg-slate-900 -z-10"></div>
      )}
      
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <FontAwesomeIcon icon={faCog} className="text-blue-600 dark:text-blue-400" />
                  Configuración del Sistema
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Gestión de catálogos LEA-BCS y configuración general del sistema
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faSave} />
                  Guardar Cambios
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faRefresh} />
                  Recargar
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
            <div className="flex border-b border-gray-200 dark:border-slate-600">
              <button
                onClick={() => setActiveSection("catalogos")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeSection === "catalogos"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faDatabase} className="mr-2" />
                Catálogos LEA-BCS
              </button>
              <button
                onClick={() => setActiveSection("sistema")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeSection === "sistema"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faServer} className="mr-2" />
                Configuración Sistema
              </button>
              <button
                onClick={() => setActiveSection("usuarios")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeSection === "usuarios"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Gestión de Usuarios
              </button>
            </div>
          </div>

          {/* Catálogos LEA-BCS Section */}
          {activeSection === "catalogos" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar en catálogos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Nuevo Elemento
                  </button>
                </div>
              </div>

              {/* Jefaturas */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600 dark:text-blue-400" />
                  Jefaturas y Unidades Administrativas
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {filteredCatalogItems('jefaturas').map((jefatura) => (
                        <tr key={jefatura.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">
                            {jefatura.codigo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {jefatura.nombre}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {jefatura.descripcion}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              jefatura.activo 
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                            }`}>
                              {jefatura.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem({catalogo: 'jefaturas', item: jefatura})}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Editar"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteCatalogItem('jefaturas', jefatura.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Eliminar"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Clasificaciones BCS */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGavel} className="text-purple-600 dark:text-purple-400" />
                  Clasificaciones Archivísticas LEA-BCS
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Clasificación
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Conservación
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {filteredCatalogItems('clasificacionesBCS').map((clasificacion) => (
                        <tr key={clasificacion.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-purple-600 dark:text-purple-400">
                            {clasificacion.codigo}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {clasificacion.nombre}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-amber-600 dark:text-amber-400">
                            {clasificacion.conservacion}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              clasificacion.activo 
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                            }`}>
                              {clasificacion.activo ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem({catalogo: 'clasificacionesBCS', item: clasificacion})}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Editar"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteCatalogItem('clasificacionesBCS', clasificacion.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Eliminar"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Series Documentales */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFolder} className="text-green-600 dark:text-green-400" />
                  Series Documentales
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Serie
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Clasificación
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Plazo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {filteredCatalogItems('seriesDocumentales').map((serie) => (
                        <tr key={serie.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-green-600 dark:text-green-400">
                            {serie.codigo}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {serie.nombre}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 dark:text-purple-400">
                            {serie.clasificacion}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                            {serie.valorDocumental}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-amber-600 dark:text-amber-400">
                            {serie.plazo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem({catalogo: 'seriesDocumentales', item: serie})}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Editar"
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                onClick={() => handleDeleteCatalogItem('seriesDocumentales', serie.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Eliminar"
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Configuración Sistema Section */}
          {activeSection === "sistema" && (
            <div className="space-y-6">
              {/* Configuración General */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faCog} className="text-blue-600 dark:text-blue-400" />
                  Configuración General
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre del Sistema
                    </label>
                    <input
                      type="text"
                      value={configuracionSistema.general.nombreSistema}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        general: { ...prev.general, nombreSistema: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Versión del Sistema
                    </label>
                    <input
                      type="text"
                      value={configuracionSistema.general.versionSistema}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        general: { ...prev.general, versionSistema: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tamaño Máximo de Archivo (MB)
                    </label>
                    <input
                      type="number"
                      value={configuracionSistema.general.maxTamanoArchivo}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        general: { ...prev.general, maxTamanoArchivo: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Formatos Permitidos
                    </label>
                    <input
                      type="text"
                      value={configuracionSistema.general.formatosPermitidos}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        general: { ...prev.general, formatosPermitidos: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveConfig('general', configuracionSistema.general)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Guardar Configuración General
                  </button>
                </div>
              </div>

              {/* Configuración de Seguridad */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-red-600 dark:text-red-400" />
                  Configuración de Seguridad
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configuracionSistema.seguridad.habilitarSSL}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        seguridad: { ...prev.seguridad, habilitarSSL: e.target.checked }
                      }))}
                      className="mr-3"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar SSL/TLS
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={configuracionSistema.seguridad.habilitarMFA}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        seguridad: { ...prev.seguridad, habilitarMFA: e.target.checked }
                      }))}
                      className="mr-3"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Habilitar Autenticación Multifactor
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tiempo de Bloqueo (minutos)
                    </label>
                    <input
                      type="number"
                      value={configuracionSistema.seguridad.tiempoBloqueo}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        seguridad: { ...prev.seguridad, tiempoBloqueo: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Intentos Máximos de Login
                    </label>
                    <input
                      type="number"
                      value={configuracionSistema.seguridad.intentosMaximos}
                      onChange={(e) => setConfiguracionSistema(prev => ({
                        ...prev,
                        seguridad: { ...prev.seguridad, intentosMaximos: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleSaveConfig('seguridad', configuracionSistema.seguridad)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faSave} />
                    Guardar Configuración de Seguridad
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Gestión Usuarios Section */}
          {activeSection === "usuarios" && (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} className="text-indigo-600 dark:text-indigo-400" />
                Gestión de Usuarios y Permisos
              </h2>
              
              <div className="text-center p-8">
                <FontAwesomeIcon icon={faUsers} className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Módulo en Desarrollo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  La gestión de usuarios y permisos estará disponible en la próxima versión del sistema.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
