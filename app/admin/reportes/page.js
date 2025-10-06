"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faCalendarAlt,
  faBuilding,
  faFolder,
  faDownload,
  faChartBar,
  faSearch,
  faFilter,
  faFileExport,
  faPrint,
  faArchive,
  faGavel,
  faFileText,
  faHistory,
  faUsers,
  faBalanceScale,
  faClipboardList,
  faEye,
  faCog,
  faRefresh
} from "@fortawesome/free-solid-svg-icons";

export default function Reportes() {
  const [darkMode, setDarkMode] = useState(false);
  const [reportType, setReportType] = useState("general");
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    jefatura: "",
    clasificacion: "",
    valorDocumental: "",
    serie: "",
    usuario: "",
    estado: "todos"
  });

  // Datos de ejemplo para reportes
  const [reportData, setReportData] = useState({
    documentosPorJefatura: [
      { jefatura: "Dirección General", total: 1234, pendientes: 45, aprobados: 1189 },
      { jefatura: "Administración y Finanzas", total: 987, pendientes: 23, aprobados: 964 },
      { jefatura: "Operaciones Portuarias", total: 2156, pendientes: 78, aprobados: 2078 },
      { jefatura: "Coordinación Jurídica", total: 567, pendientes: 12, aprobados: 555 }
    ],
    documentosPorClasificacion: [
      { codigo: "001", nombre: "Normatividad y Legislación", total: 234, conservacion: "Permanente" },
      { codigo: "004", nombre: "Recursos Humanos", total: 456, conservacion: "7 años" },
      { codigo: "005", nombre: "Recursos Financieros", total: 789, conservacion: "7 años" },
      { codigo: "007", nombre: "Servicios Portuarios", total: 1123, conservacion: "5 años" }
    ],
    seriesDocumentales: [
      { serie: "Contratos y Convenios", total: 156, transferidas: 12, activas: 144 },
      { serie: "Facturación", total: 1234, transferidas: 234, activas: 1000 },
      { serie: "Correspondencia Oficial", total: 567, transferidas: 45, activas: 522 },
      { serie: "Bitácoras Operativas", total: 890, transferidas: 67, activas: 823 }
    ]
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

  const CLASIFICACIONES_BCS = {
    "001": "Normatividad y Legislación",
    "002": "Planeación y Programación", 
    "003": "Organización y Funcionamiento",
    "004": "Recursos Humanos",
    "005": "Recursos Financieros",
    "006": "Recursos Materiales",
    "007": "Servicios Portuarios",
    "008": "Operaciones Marítimas",
    "009": "Seguridad Portuaria",
    "010": "Medio Ambiente",
    "011": "Tecnologías de la Información",
    "015": "Asuntos Jurídicos"
  };

  const VALORES_DOCUMENTALES = {
    "administrativo": "Administrativo",
    "legal": "Legal", 
    "fiscal": "Fiscal",
    "historico": "Histórico",
    "mixto": "Mixto"
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportToCSV = (data, filename) => {
    let csvContent = "";
    
    if (reportType === "general") {
      csvContent = "Jefatura,Total Documentos,Pendientes,Aprobados\n";
      data.documentosPorJefatura.forEach(row => {
        csvContent += `"${row.jefatura}",${row.total},${row.pendientes},${row.aprobados}\n`;
      });
    } else if (reportType === "clasificacion") {
      csvContent = "Código,Clasificación,Total Documentos,Conservación\n";
      data.documentosPorClasificacion.forEach(row => {
        csvContent += `"${row.codigo}","${row.nombre}",${row.total},"${row.conservacion}"\n`;
      });
    } else if (reportType === "series") {
      csvContent = "Serie Documental,Total,Transferidas,Activas\n";
      data.seriesDocumentales.forEach(row => {
        csvContent += `"${row.serie}",${row.total},${row.transferidas},${row.activas}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
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
                  <FontAwesomeIcon icon={faChartBar} className="text-blue-600 dark:text-blue-400" />
                  Reportes e Informes Archivísticos
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Reportes de gestión documental conforme a la Ley Estatal de Archivos de BCS
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => exportToCSV(reportData, `reporte_${reportType}_${new Date().toISOString().split('T')[0]}`)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faFileExport} />
                  Exportar CSV
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                  <FontAwesomeIcon icon={faPrint} />
                  Imprimir
                </button>
              </div>
            </div>
          </div>

          {/* Tipos de Reporte */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardList} className="text-purple-600 dark:text-purple-400" />
              Tipo de Reporte
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setReportType("general")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  reportType === "general"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-slate-600 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faBuilding} className="text-2xl mb-2" />
                <div className="font-semibold">Documentos por Jefatura</div>
                <div className="text-sm">Distribución organizacional</div>
              </button>
              
              <button
                onClick={() => setReportType("clasificacion")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  reportType === "clasificacion"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-slate-600 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faGavel} className="text-2xl mb-2" />
                <div className="font-semibold">Por Clasificación LEA-BCS</div>
                <div className="text-sm">Cumplimiento archivístico</div>
              </button>
              
              <button
                onClick={() => setReportType("series")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  reportType === "series"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-300 dark:border-slate-600 hover:border-blue-300 text-gray-700 dark:text-gray-300"
                }`}
              >
                <FontAwesomeIcon icon={faArchive} className="text-2xl mb-2" />
                <div className="font-semibold">Series Documentales</div>
                <div className="text-sm">Gestión y transferencias</div>
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-orange-600 dark:text-orange-400" />
              Filtros de Consulta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Jefatura
                </label>
                <select
                  value={filters.jefatura}
                  onChange={(e) => handleFilterChange("jefatura", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todas las jefaturas</option>
                  {Object.entries(JEFATURAS).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Documental
                </label>
                <select
                  value={filters.valorDocumental}
                  onChange={(e) => handleFilterChange("valorDocumental", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Todos los valores</option>
                  {Object.entries(VALORES_DOCUMENTALES).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenido del Reporte */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            {reportType === "general" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-blue-600 dark:text-blue-400" />
                  Documentos por Jefatura
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
                          Aprobados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          % Completitud
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {reportData.documentosPorJefatura.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {row.jefatura}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                            {row.pendientes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                            {row.aprobados.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {((row.aprobados / row.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "clasificacion" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGavel} className="text-purple-600 dark:text-purple-400" />
                  Documentos por Clasificación LEA-BCS
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Código
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Clasificación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Documentos
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Plazo Conservación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {reportData.documentosPorClasificacion.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-400">
                            {row.codigo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {row.nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 dark:text-amber-400">
                            {row.conservacion}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {reportType === "series" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faArchive} className="text-green-600 dark:text-green-400" />
                  Series Documentales y Transferencias
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-slate-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Serie Documental
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Transferidas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Activas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          % Transferencia
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                      {reportData.seriesDocumentales.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {row.serie}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {row.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                            {row.transferidas}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                            {row.activas.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {((row.transferidas / row.total) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Cumplimiento LEA-BCS */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faBalanceScale} className="text-indigo-600 dark:text-indigo-400" />
              Cumplimiento Normativo LEA-BCS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">94.2%</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Documentos Clasificados</div>
                  </div>
                  <FontAwesomeIcon icon={faFileContract} className="text-3xl text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">87.8%</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Series Documentales</div>
                  </div>
                  <FontAwesomeIcon icon={faFolder} className="text-3xl text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">78.4%</div>
                    <div className="text-sm text-amber-600 dark:text-amber-400">Transferencias Realizadas</div>
                  </div>
                  <FontAwesomeIcon icon={faHistory} className="text-3xl text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            {/* Alertas y pendientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <h3 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-red-600 dark:text-red-400" />
                  Alertas Regulatorias
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Documentos vencidos:</span>
                    <span className="font-bold text-red-700 dark:text-red-300">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Transferencias pendientes:</span>
                    <span className="font-bold text-red-700 dark:text-red-300">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600 dark:text-red-400">Series sin actualizar:</span>
                    <span className="font-bold text-red-700 dark:text-red-300">8</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEye} className="text-purple-600 dark:text-purple-400" />
                  Monitoreo de Plazos
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Próximos a vencer (30 días):</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Próximos a transferir:</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">89</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-600 dark:text-purple-400">Conservación permanente:</span>
                    <span className="font-bold text-purple-700 dark:text-purple-300">234</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de Calidad Archivística */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCog} className="text-teal-600 dark:text-teal-400" />
              Indicadores de Calidad Archivística LEA-BCS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">15</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Cuadros de Clasificación</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">342</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Series Activas</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">1,567</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Expedientes Abiertos</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">98.1%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Integridad Documental</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
