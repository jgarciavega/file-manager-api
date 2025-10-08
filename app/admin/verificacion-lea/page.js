"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShieldAlt,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faFileContract,
  faClipboardCheck,
  faBalanceScale,
  faChartLine,
  faFilter,
  faSearch,
  faDownload,
  faEye,
  faEdit,
  faTrash,
  faUserTie,
  faCalendarAlt,
  faBuilding,
  faGavel,
  faArchive,
  faClock,
  faFlag,
  faFileExport,
  faPrint,
  faRefresh,
  faSort,
  faBell,
  faInfoCircle,
  faListCheck,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";

export default function VerificacionLEA() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filters, setFilters] = useState({
    estado: "todos",
    fechaInicio: "",
    fechaFin: "",
    jefatura: "",
    clasificacion: "",
    valorDocumental: "",
    criticidad: "todos"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocs, setSelectedDocs] = useState([]);

  // Datos de ejemplo para verificación LEA-BCS
  const [dashboardData] = useState({
    resumenValidacion: {
      totalDocumentos: 4589,
      pendientesValidacion: 234,
      validados: 4123,
      rechazados: 232,
      porcentajeCumplimiento: 89.9
    },
    alertasCriticas: [
      { tipo: "Documentos vencidos", cantidad: 45, criticidad: "alta" },
      { tipo: "Sin clasificación LEA", cantidad: 89, criticidad: "media" },
      { tipo: "Series incompletas", cantidad: 23, criticidad: "alta" },
      { tipo: "Transferencias pendientes", cantidad: 156, criticidad: "media" }
    ],
    validacionesPorJefatura: [
      { jefatura: "Dirección General", total: 567, pendientes: 23, cumplimiento: 95.9 },
      { jefatura: "Administración y Finanzas", total: 1234, pendientes: 67, cumplimiento: 94.6 },
      { jefatura: "Operaciones Portuarias", total: 1890, pendientes: 89, cumplimiento: 95.3 },
      { jefatura: "Coordinación Jurídica", total: 898, pendientes: 55, cumplimiento: 93.9 }
    ]
  });

  const [documentosValidacion] = useState([
    {
      id: 1,
      nombre: "Informe_Trimestral_Q1_2024.pdf",
      jefatura: "Dirección General",
      responsable: "Dra. María González",
      fechaSubida: "2024-03-15",
      estado: "pendiente",
      clasificacion: "001.003",
      valorDocumental: "administrativo",
      plazoConservacion: "5 años",
      criticidad: "media",
      observaciones: "Requiere revisión de metadatos"
    },
    {
      id: 2,
      nombre: "Contrato_Servicios_2024.docx",
      jefatura: "Administración y Finanzas",
      responsable: "Lic. Carlos Mendez",
      fechaSubida: "2024-03-10",
      estado: "validado",
      clasificacion: "005.001",
      valorDocumental: "legal",
      plazoConservacion: "10 años",
      criticidad: "baja",
      observaciones: "Cumple normativa LEA-BCS"
    },
    {
      id: 3,
      nombre: "Bitacora_Operaciones_Marzo.xlsx",
      jefatura: "Operaciones Portuarias",
      responsable: "Ing. Ana López",
      fechaSubida: "2024-03-20",
      estado: "rechazado",
      clasificacion: "007.001",
      valorDocumental: "administrativo",
      plazoConservacion: "3 años",
      criticidad: "alta",
      observaciones: "Falta serie documental completa"
    },
    {
      id: 4,
      nombre: "Dictamen_Legal_Caso_2024_001.pdf",
      jefatura: "Coordinación Jurídica",
      responsable: "Mtro. Roberto Silva",
      fechaSubida: "2024-03-18",
      estado: "pendiente",
      clasificacion: "015.002",
      valorDocumental: "legal",
      plazoConservacion: "Permanente",
      criticidad: "alta",
      observaciones: "Documento con valor legal permanente"
    }
  ]);

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

  // Catálogos LEA-BCS
  const JEFATURAS = {
    "direccion": "Dirección General",
    "administracion": "Administración y Finanzas", 
    "operaciones": "Operaciones Portuarias",
    "juridico": "Coordinación Jurídica",
    "seguridad": "Coordinación de Seguridad",
    "ambiente": "Coordinación de Medio Ambiente",
    "ingenieria": "Subdirección de Ingeniería"
  };

  const ESTADOS_VALIDACION = {
    "pendiente": { label: "Pendiente", color: "amber", icon: faClock },
    "validado": { label: "Validado", color: "green", icon: faCheckCircle },
    "rechazado": { label: "Rechazado", color: "red", icon: faTimesCircle },
    "revision": { label: "En Revisión", color: "blue", icon: faEye }
  };

  const CRITICIDAD = {
    "baja": { label: "Baja", color: "green" },
    "media": { label: "Media", color: "yellow" },
    "alta": { label: "Alta", color: "red" }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleValidateDocument = (docId, decision, observaciones = "") => {
    console.log(`Documento ${docId} ${decision}: ${observaciones}`);
    // Aquí iría la lógica de actualización
  };

  const handleBulkAction = (action) => {
    if (selectedDocs.length === 0) {
      alert("Selecciona al menos un documento");
      return;
    }
    console.log(`Acción masiva: ${action} en documentos:`, selectedDocs);
  };

  const exportToCSV = () => {
    const csvContent = "Documento,Jefatura,Responsable,Estado,Criticidad,Observaciones\n" +
      documentosValidacion.map(doc => 
        `"${doc.nombre}","${doc.jefatura}","${doc.responsable}","${doc.estado}","${doc.criticidad}","${doc.observaciones}"`
      ).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `verificacion_lea_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                  <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 dark:text-blue-400" />
                  Verificación y Auditoría LEA-BCS
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Sistema de validación de cumplimiento archivístico conforme a la Ley Estatal de Archivos de BCS
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faFileExport} />
                  Exportar
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faRefresh} />
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
            <div className="flex border-b border-gray-200 dark:border-slate-600">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                Dashboard de Cumplimiento
              </button>
              <button
                onClick={() => setActiveTab("validacion")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "validacion"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                Validación de Documentos
              </button>
              <button
                onClick={() => setActiveTab("auditoria")}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === "auditoria"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
                Auditoría Archivística
              </button>
            </div>
          </div>

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData.resumenValidacion.totalDocumentos.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Documentos</div>
                    </div>
                    <FontAwesomeIcon icon={faFileContract} className="text-3xl text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                        {dashboardData.resumenValidacion.pendientesValidacion}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pendientes</div>
                    </div>
                    <FontAwesomeIcon icon={faClock} className="text-3xl text-amber-600 dark:text-amber-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {dashboardData.resumenValidacion.validados.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Validados</div>
                    </div>
                    <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-600 dark:text-green-400" />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {dashboardData.resumenValidacion.porcentajeCumplimiento}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cumplimiento LEA</div>
                    </div>
                    <FontAwesomeIcon icon={faBalanceScale} className="text-3xl text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Alertas Críticas */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600 dark:text-red-400" />
                  Alertas de Cumplimiento LEA-BCS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.alertasCriticas.map((alerta, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      alerta.criticidad === "alta" 
                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700"
                        : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`text-lg font-bold ${
                            alerta.criticidad === "alta" 
                              ? "text-red-700 dark:text-red-300"
                              : "text-yellow-700 dark:text-yellow-300"
                          }`}>
                            {alerta.cantidad}
                          </div>
                          <div className={`text-sm ${
                            alerta.criticidad === "alta" 
                              ? "text-red-600 dark:text-red-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}>
                            {alerta.tipo}
                          </div>
                        </div>
                        <FontAwesomeIcon 
                          icon={faFlag} 
                          className={`text-xl ${
                            alerta.criticidad === "alta" 
                              ? "text-red-600 dark:text-red-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Validaciones por Jefatura */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-purple-600 dark:text-purple-400" />
                  Cumplimiento por Jefatura
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Jefatura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Documentos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Pendientes
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          % Cumplimiento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {dashboardData.validacionesPorJefatura.map((jef, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {jef.jefatura}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {jef.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 dark:text-amber-400">
                            {jef.pendientes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                            {jef.cumplimiento}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              jef.cumplimiento >= 95 
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                : jef.cumplimiento >= 90
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                                : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                            }`}>
                              {jef.cumplimiento >= 95 ? "Excelente" : jef.cumplimiento >= 90 ? "Bueno" : "Requiere Atención"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Validación Tab */}
          {activeTab === "validacion" && (
            <div className="space-y-6">
              {/* Filtros */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faFilter} className="text-orange-600 dark:text-orange-400" />
                  Filtros de Validación
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estado
                    </label>
                    <select
                      value={filters.estado}
                      onChange={(e) => handleFilterChange("estado", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="todos">Todos</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="validado">Validados</option>
                      <option value="rechazado">Rechazados</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Criticidad
                    </label>
                    <select
                      value={filters.criticidad}
                      onChange={(e) => handleFilterChange("criticidad", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="todos">Todas</option>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Jefatura
                    </label>
                    <select
                      value={filters.jefatura}
                      onChange={(e) => handleFilterChange("jefatura", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Todas</option>
                      {Object.entries(JEFATURAS).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      value={filters.fechaInicio}
                      onChange={(e) => handleFilterChange("fechaInicio", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      value={filters.fechaFin}
                      onChange={(e) => handleFilterChange("fechaFin", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Buscar
                    </label>
                    <input
                      type="text"
                      placeholder="Buscar documento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Acciones Masivas */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 border dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedDocs.length} documento(s) seleccionado(s)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("validar")}
                      disabled={selectedDocs.length === 0}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Validar Seleccionados
                    </button>
                    <button
                      onClick={() => handleBulkAction("rechazar")}
                      disabled={selectedDocs.length === 0}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Rechazar Seleccionados
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla de Documentos */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border dark:border-slate-700">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-4 py-3 text-left">
                          <input 
                            type="checkbox" 
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedDocs(documentosValidacion.map(doc => doc.id));
                              } else {
                                setSelectedDocs([]);
                              }
                            }}
                            className="rounded" 
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Jefatura
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Responsable
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Criticidad
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Clasificación LEA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {documentosValidacion.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-4 py-4">
                            <input 
                              type="checkbox" 
                              checked={selectedDocs.includes(doc.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDocs([...selectedDocs, doc.id]);
                                } else {
                                  setSelectedDocs(selectedDocs.filter(id => id !== doc.id));
                                }
                              }}
                              className="rounded" 
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {doc.nombre}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {doc.fechaSubida}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {doc.jefatura}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {doc.responsable}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              doc.estado === "validado" 
                                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                : doc.estado === "rechazado"
                                ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                                : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                            }`}>
                              <FontAwesomeIcon icon={ESTADOS_VALIDACION[doc.estado].icon} className="mr-1" />
                              {ESTADOS_VALIDACION[doc.estado].label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              doc.criticidad === "alta"
                                ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                                : doc.criticidad === "media"
                                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
                                : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                            }`}>
                              {CRITICIDAD[doc.criticidad].label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">
                            {doc.clasificacion}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleValidateDocument(doc.id, "validar")}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                                title="Validar"
                              >
                                <FontAwesomeIcon icon={faCheckCircle} />
                              </button>
                              <button
                                onClick={() => handleValidateDocument(doc.id, "rechazar")}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="Rechazar"
                              >
                                <FontAwesomeIcon icon={faTimesCircle} />
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Ver detalles"
                              >
                                <FontAwesomeIcon icon={faEye} />
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

          {/* Auditoría Tab */}
          {activeTab === "auditoria" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserShield} className="text-indigo-600 dark:text-indigo-400" />
                  Auditoría Archivística LEA-BCS
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-700">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faListCheck} className="text-4xl text-blue-600 dark:text-blue-400 mb-4" />
                      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                        Verificación de Metadatos
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Validación automatizada de campos obligatorios LEA-BCS
                      </p>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">96.7%</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400">Completitud</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-700">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faArchive} className="text-4xl text-purple-600 dark:text-purple-400 mb-4" />
                      <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                        Series Documentales
                      </h3>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        Consistencia y organización por series
                      </p>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">87.3%</div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">Organización</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faGavel} className="text-4xl text-green-600 dark:text-green-400 mb-4" />
                      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                        Cumplimiento Legal
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Adherencia a normativa BCS y federal
                      </p>
                      <div className="mt-4">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-300">92.1%</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Conformidad</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Próximas Acciones Recomendadas:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• Revisar 45 documentos con metadatos incompletos</li>
                    <li>• Actualizar 23 series documentales obsoletas</li>
                    <li>• Completar transferencias pendientes (156 documentos)</li>
                    <li>• Ejecutar verificación trimestral de cumplimiento</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
