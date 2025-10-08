"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faUsers,
  faClipboardCheck,
  faExclamationTriangle,
  faChartLine,
  faDatabase,
  faShieldAlt,
  faCog,
  faCalendarAlt,
  faDownload,
  faUpload,
  faEye,
  faSearch,
  faBell,
  faServer,
  faGlobe,
  faHdd,
  faClock,
  faUserCheck,
  faFileContract,
  faArchive,
  faBalanceScale,
  faBuilding,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faRefresh,
  faFilter,
  faChartPie,
  faChartBar,
  faTrendingUp,
  faWifi,
  faMemory,
  faMicrochip,
  faThermometerHalf
} from "@fortawesome/free-solid-svg-icons";

export default function AdminHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [systemStats, setSystemStats] = useState({
    uptime: "72h 15m",
    cpu: 23,
    memory: 68,
    storage: 45,
    temperature: 42
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

  // Protección: solo admins pueden acceder
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/unauthorized");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role_id !== 2) {
        router.push("/unauthorized");
      } else {
        setUser(parsedUser);
      }
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      router.push("/unauthorized");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Simulación de actualización de estadísticas del sistema
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        temperature: Math.max(35, Math.min(75, prev.temperature + (Math.random() - 0.5) * 3))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <>
        {darkMode && <div className="fixed inset-0 bg-slate-900 -z-10"></div>}
        <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-600 dark:text-blue-400 animate-spin mb-4" />
            <p className="text-gray-900 dark:text-white text-lg">Cargando panel de administración...</p>
          </div>
        </div>
      </>
    );
  }

  const resumenDocumental = {
    total: 2847,
    revision: 23,
    aprobados: 2756,
    rechazados: 68,
    pendientes: 15,
    archivados: 2198
  };

  const estadisticasLEA = {
    cumplimiento: 94.7,
    series: 156,
    clasificaciones: 15,
    transferencias: 8,
    digitalizacion: 87.3
  };

  const usuariosActivos = {
    conectados: 47,
    totalUsuarios: 156,
    administradores: 8,
    revisores: 25,
    capturistas: 123
  };

  const ultimaActividad = [
    {
      usuario: "María González",
      accion: "Aprobó documento",
      documento: "Informe Trimestral Q3",
      tiempo: "hace 5 min",
      tipo: "aprobacion",
      folio: "DOC-2847"
    },
    {
      usuario: "Jorge Vega",
      accion: "Configuró catálogo",
      documento: "Series Documentales",
      tiempo: "hace 12 min",
      tipo: "configuracion",
      folio: "SYS-001"
    },
    {
      usuario: "Ana Rodríguez",
      accion: "Subió documento",
      documento: "Oficio Circular 045",
      tiempo: "hace 18 min",
      tipo: "subida",
      folio: "DOC-2846"
    },
    {
      usuario: "Carlos López",
      accion: "Validó expediente",
      documento: "Expediente Personal",
      tiempo: "hace 25 min",
      tipo: "validacion",
      folio: "EXP-1247"
    },
    {
      usuario: "Sistema",
      accion: "Backup automático",
      documento: "Base de datos completa",
      tiempo: "hace 1 hora",
      tipo: "sistema",
      folio: "BAK-001"
    }
  ];

  const alertasActivas = [
    {
      tipo: "warning",
      mensaje: "23 documentos pendientes de revisión",
      urgencia: "media",
      tiempo: "hace 2 horas"
    },
    {
      tipo: "info",
      mensaje: "Actualización del sistema disponible",
      urgencia: "baja",
      tiempo: "hace 1 día"
    },
    {
      tipo: "success",
      mensaje: "Backup completado exitosamente",
      urgencia: "baja",
      tiempo: "hace 3 horas"
    }
  ];

  const getIconForActivity = (tipo) => {
    switch (tipo) {
      case "aprobacion": return faCheckCircle;
      case "configuracion": return faCog;
      case "subida": return faUpload;
      case "validacion": return faUserCheck;
      case "sistema": return faServer;
      default: return faFileAlt;
    }
  };

  const getColorForActivity = (tipo) => {
    switch (tipo) {
      case "aprobacion": return "text-green-600 dark:text-green-400";
      case "configuracion": return "text-blue-600 dark:text-blue-400";
      case "subida": return "text-purple-600 dark:text-purple-400";
      case "validacion": return "text-amber-600 dark:text-amber-400";
      case "sistema": return "text-gray-600 dark:text-gray-400";
      default: return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <>
      {/* Full dark background overlay */}
      {darkMode && (
        <div className="fixed inset-0 bg-slate-900 -z-10"></div>
      )}
      
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <div className="p-6 space-y-6">
          {/* Header Principal */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-500 dark:text-yellow-300" />
                  Panel de Administración
                </h1>
                <p className="text-gray-600 dark:text-gray-100 text-lg">
                  Sistema de Gestión Documental API-BCS • {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                  <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-200">Sistema Operativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-600 dark:text-gray-200" />
                    <span className="text-sm text-gray-600 dark:text-gray-200">{usuariosActivos.conectados} usuarios conectados</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-gray-100 dark:bg-white/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{resumenDocumental.total.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-200">Documentos Totales</div>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {/* Documentos */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Revisión</p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{resumenDocumental.revision}</p>
                </div>
                <FontAwesomeIcon icon={faClock} className="text-2xl text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprobados</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{resumenDocumental.aprobados}</p>
                </div>
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rechazados</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{resumenDocumental.rechazados}</p>
                </div>
                <FontAwesomeIcon icon={faTimesCircle} className="text-2xl text-red-600 dark:text-red-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuarios</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{usuariosActivos.totalUsuarios}</p>
                </div>
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cumplimiento LEA</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{estadisticasLEA.cumplimiento}%</p>
                </div>
                <FontAwesomeIcon icon={faBalanceScale} className="text-2xl text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Series Activas</p>
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{estadisticasLEA.series}</p>
                </div>
                <FontAwesomeIcon icon={faArchive} className="text-2xl text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Sección Principal con 3 Columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Estadísticas del Sistema */}
            <div className="space-y-6">
              {/* Estado del Sistema */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faServer} className="text-gray-600 dark:text-gray-400" />
                  Estado del Sistema
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FontAwesomeIcon icon={faMicrochip} />
                        CPU
                      </span>
                      <span className="text-sm font-medium">{systemStats.cpu.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          systemStats.cpu > 80 ? 'bg-red-500' : 
                          systemStats.cpu > 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${systemStats.cpu}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FontAwesomeIcon icon={faMemory} />
                        Memoria
                      </span>
                      <span className="text-sm font-medium">{systemStats.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          systemStats.memory > 85 ? 'bg-red-500' : 
                          systemStats.memory > 70 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${systemStats.memory}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <FontAwesomeIcon icon={faHdd} />
                        Almacenamiento
                      </span>
                      <span className="text-sm font-medium">{systemStats.storage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500 transition-all duration-500"
                        style={{ width: `${systemStats.storage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t dark:border-slate-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FontAwesomeIcon icon={faThermometerHalf} />
                      Temperatura
                    </span>
                    <span className={`text-sm font-medium ${
                      systemStats.temperature > 60 ? 'text-red-500' : 
                      systemStats.temperature > 50 ? 'text-yellow-500' : 'text-green-500'
                    }`}>
                      {systemStats.temperature.toFixed(1)}°C
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <FontAwesomeIcon icon={faClock} />
                      Tiempo activo
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{systemStats.uptime}</span>
                  </div>
                </div>
              </div>

              {/* Alertas del Sistema */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBell} className="text-amber-600 dark:text-amber-400" />
                  Alertas del Sistema
                </h2>
                <div className="space-y-3">
                  {alertasActivas.map((alerta, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alerta.tipo === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500' :
                      alerta.tipo === 'info' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
                      'bg-green-50 dark:bg-green-900/20 border-green-500'
                    }`}>
                      <div className="flex items-start gap-3">
                        <FontAwesomeIcon 
                          icon={alerta.tipo === 'warning' ? faExclamationTriangle : 
                               alerta.tipo === 'info' ? faBell : faCheckCircle} 
                          className={`mt-0.5 ${
                            alerta.tipo === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            alerta.tipo === 'info' ? 'text-blue-600 dark:text-blue-400' :
                            'text-green-600 dark:text-green-400'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {alerta.mensaje}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {alerta.tiempo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Central - Actividad Reciente */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-600 dark:text-blue-400" />
                Actividad Reciente
              </h2>
              <div className="space-y-4">
                {ultimaActividad.map((actividad, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <FontAwesomeIcon 
                      icon={getIconForActivity(actividad.tipo)} 
                      className={`mt-1 ${getColorForActivity(actividad.tipo)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {actividad.usuario}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {actividad.accion}: <span className="font-medium">{actividad.documento}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-500">{actividad.tiempo}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">{actividad.folio}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha - Estadísticas LEA-BCS */}
            <div className="space-y-6">
              {/* Cumplimiento LEA-BCS */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faBalanceScale} className="text-purple-600 dark:text-purple-400" />
                  Cumplimiento LEA-BCS
                </h2>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {estadisticasLEA.cumplimiento}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Nivel de cumplimiento</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{estadisticasLEA.series}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Series Documentales</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticasLEA.clasificaciones}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Clasificaciones</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{estadisticasLEA.transferencias}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Transferencias</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{estadisticasLEA.digitalizacion}%</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Digitalización</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usuarios Activos */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faUsers} className="text-green-600 dark:text-green-400" />
                  Usuarios del Sistema
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Conectados ahora</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-bold text-green-600 dark:text-green-400">{usuariosActivos.conectados}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Administradores</span>
                      <span className="font-medium">{usuariosActivos.administradores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Revisores</span>
                      <span className="font-medium">{usuariosActivos.revisores}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Capturistas</span>
                      <span className="font-medium">{usuariosActivos.capturistas}</span>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t dark:border-slate-600">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Total de usuarios</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{usuariosActivos.totalUsuarios}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accesos Rápidos */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faCog} className="text-gray-600 dark:text-gray-400" />
              Accesos Rápidos de Administración
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: "Configuración", icon: faCog, color: "blue", href: "/admin/configuracion" },
                { name: "Usuarios", icon: faUsers, color: "green", href: "/admin/usuarios" },
                { name: "Reportes", icon: faChartLine, color: "purple", href: "/admin/reportes" },
                { name: "Verificación LEA", icon: faBalanceScale, color: "amber", href: "/admin/verificacion-lea" },
                { name: "Archivos", icon: faFileAlt, color: "indigo", href: "/admin/archivos" },
                { name: "Estado Sistema", icon: faServer, color: "red", href: "/admin/status" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.href)}
                  className={`p-4 rounded-lg text-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 bg-${item.color}-50 dark:bg-${item.color}-900/20 border border-${item.color}-200 dark:border-${item.color}-800 hover:bg-${item.color}-100 dark:hover:bg-${item.color}-800/30`}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={`text-2xl text-${item.color}-600 dark:text-${item.color}-400 mb-2`} 
                  />
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
