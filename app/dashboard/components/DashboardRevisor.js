"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCheck,
  faTimes,
  faClock,
  faExclamationTriangle,
  faChartLine,
  faUsers,
  faFileAlt,
  faComment,
  faBell,
  faFilter,
  faDownload,
  faSearch,
  faStar,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Link from "next/link";

const DashboardRevisor = () => {
  const { data: session } = useSession();
  const [estadisticas, setEstadisticas] = useState({
    documentosPendientes: 0,
    documentosRevisadosHoy: 0,
    documentosRevisadosSemana: 0,
    tiempoPromedioRevision: 0,
    tasaAprobacion: 0,
    documentosVencimiento: 0,
    capturistasActivos: 0,
    alertasCalidad: [],
  });

  const [documentosPendientes, setDocumentosPendientes] = useState([]);
  const [filtros, setFiltros] = useState({
    prioridad: "todos",
    area: "todas",
    capturista: "todos",
  });

  // Cargar estadísticas y documentos pendientes
  useEffect(() => {
    const cargarDatosRevisor = async () => {
      try {
        // Cargar estadísticas del revisor
        const responseStats = await fetch("/api/estadisticas-revisor");
        if (responseStats.ok) {
          const statsData = await responseStats.json();
          setEstadisticas(statsData);
        }

        // Cargar documentos pendientes
        const responseDocs = await fetch("/api/documentos-pendientes-revision");
        if (responseDocs.ok) {
          const docsData = await responseDocs.json();
          setDocumentosPendientes(docsData);
        }
      } catch (error) {
        console.error("Error al cargar datos del revisor:", error);
        // Datos de fallback para demo
        setEstadisticas({
          documentosPendientes: 23,
          documentosRevisadosHoy: 8,
          documentosRevisadosSemana: 47,
          tiempoPromedioRevision: 1.8,
          tasaAprobacion: 92.5,
          documentosVencimiento: 5,
          capturistasActivos: 12,
          alertasCalidad: [
            {
              tipo: "warning",
              mensaje: "5 documentos próximos a vencer (2 días)",
            },
            {
              tipo: "info",
              mensaje: "Juan Pérez ha mejorado su tasa de calidad al 95%",
            },
          ],
        });

        setDocumentosPendientes([
          {
            id: 1,
            titulo: "Contrato de Servicios - IT Solutions",
            capturista: "María García",
            area: "Finanzas",
            fechaSubida: new Date(Date.now() - 1000 * 60 * 60 * 24),
            prioridad: "alta",
            tipoDocumento: "Contrato",
          },
          {
            id: 2,
            titulo: "Factura No. 1234 - Suministros de Oficina",
            capturista: "Carlos López",
            area: "Administración",
            fechaSubida: new Date(Date.now() - 1000 * 60 * 60 * 48),
            prioridad: "media",
            tipoDocumento: "Factura",
          },
          {
            id: 3,
            titulo: "Expediente Personal - Empleado 001",
            capturista: "Ana Ruiz",
            area: "Recursos Humanos",
            fechaSubida: new Date(Date.now() - 1000 * 60 * 60 * 12),
            prioridad: "baja",
            tipoDocumento: "Expediente",
          },
        ]);
      }
    };

    cargarDatosRevisor();
  }, []);

  const obtenerPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "alta":
        return "text-red-600 bg-red-100";
      case "media":
        return "text-yellow-600 bg-yellow-100";
      case "baja":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const calcularDiasTranscurridos = (fecha) => {
    const ahora = new Date();
    const diferencia = ahora - new Date(fecha);
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header institucional premium con avatar y BackToHomeButton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <img src="/api_logo.png" alt="Logo" className="w-20 h-20 object-contain rounded-xl shadow-lg border-2 border-orange-200 dark:border-yellow-700" />
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                  {/* Avatar junto al icono de luna/sol */}
                  <img src="/blanca.jpeg" alt="Avatar institucional" className="w-14 h-14 rounded-full border-4 border-orange-300 dark:border-yellow-400 shadow-lg object-cover" />
                  {/* Icono de modo oscuro/claro */}
                  <button
                    className="p-2 rounded-full bg-gradient-to-r from-yellow-200 to-orange-300 text-orange-900 dark:bg-slate-800 dark:text-yellow-200 shadow"
                    aria-label="Cambiar modo oscuro/claro"
                    onClick={() => setDarkMode((prev) => !prev)}
                  >
                    <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-xl" />
                  </button>
                </div>
                <h1 className="text-5xl font-extrabold text-orange-700 dark:text-yellow-200 tracking-tight drop-shadow-2xl mb-1" style={{textShadow:'0 2px 12px #fbbf24,0 1px 0 #fff'}}>Dashboard de Revisión</h1>
                <p className="text-lg text-orange-900 dark:text-yellow-100 mt-2 font-semibold">Hola {session?.user?.name || "Revisor"}, aquí tienes tu centro de control</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <BackToHomeButton label="Volver al Inicio" size="lg" color="blue" darkMode={darkMode} />
              <button className="px-4 py-2 bg-gradient-to-r from-orange-400 to-yellow-400 text-white rounded-xl font-bold shadow hover:from-orange-500 hover:to-yellow-500 transition-all">
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Exportar Reporte
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl font-bold shadow hover:from-yellow-500 hover:to-orange-500 transition-all">
                <FontAwesomeIcon icon={faFilter} className="mr-2" />
                Filtros Avanzados
              </button>
            </div>
          </div>

        </div>

        {/* Alertas de Sistema */}
        {estadisticas.alertasCalidad.length > 0 && (
          <div className="mb-8 space-y-3">
            {estadisticas.alertasCalidad.map((alerta, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 ${
                  alerta.tipo === "warning"
                    ? "bg-yellow-100 border-yellow-500 text-yellow-900"
                    : alerta.tipo === "info"
                    ? "bg-orange-100 border-orange-400 text-orange-900"
                    : "bg-red-100 border-red-500 text-red-900"
                } shadow-md`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={
                      alerta.tipo === "warning"
                        ? faExclamationTriangle
                        : alerta.tipo === "info"
                        ? faBell
                        : faTimes
                    }
                  />
                  <span className="font-semibold">{alerta.mensaje}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Documentos Pendientes */}
          <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {estadisticas.documentosPendientes}
                </p>
                <p className="text-xs text-gray-500 mt-1">Por revisar</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-red-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Revisados Hoy */}
          <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Hoy
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {estadisticas.documentosRevisadosHoy}
                </p>
                <p className="text-xs text-gray-500 mt-1">Revisados</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faCheck}
                  className="text-blue-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Tasa de Aprobación */}
          <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Aprobación
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {estadisticas.tasaAprobacion}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Esta semana</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-green-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Tiempo Promedio */}
          <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tiempo Prom.
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {estadisticas.tiempoPromedioRevision}d
                </p>
                <p className="text-xs text-gray-500 mt-1">Por documento</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-purple-600 text-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Principal: Documentos Pendientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Documentos Pendientes */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-orange-50 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Documentos Pendientes de Revisión
                </h3>
                <div className="flex gap-2">
                  <select
                    value={filtros.prioridad}
                    onChange={(e) =>
                      setFiltros({ ...filtros, prioridad: e.target.value })
                    }
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="todos">Todas las prioridades</option>
                    <option value="alta">Alta prioridad</option>
                    <option value="media">Media prioridad</option>
                    <option value="baja">Baja prioridad</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {documentosPendientes.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-orange-200 dark:border-yellow-700 rounded-xl p-4 hover:shadow-lg transition-shadow bg-white/80 dark:bg-yellow-900/30"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-orange-900 dark:text-yellow-100 text-base">
                            {doc.titulo}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-bold shadow ${obtenerPrioridadColor(
                              doc.prioridad
                            )}`}
                          >
                            {doc.prioridad}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-orange-700 dark:text-yellow-200">
                          <span>
                            <FontAwesomeIcon icon={faUsers} className="mr-1" />
                            {doc.capturista}
                          </span>
                          <span>
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="mr-1"
                            />
                            {doc.area}
                          </span>
                          <span>
                            <FontAwesomeIcon
                              icon={faCalendarAlt}
                              className="mr-1"
                            />
                            Hace {calcularDiasTranscurridos(doc.fechaSubida)}{" "}
                            días
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/dashboard/verification?id=${doc.id}`}
                          className="px-3 py-1 bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm rounded-lg font-bold shadow hover:from-orange-500 hover:to-yellow-500 transition-all"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-1" />
                          Revisar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {documentosPendientes.length === 0 && (
                <div className="text-center py-8">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-4xl text-orange-400 mb-4"
                  />
                  <p className="text-orange-700 dark:text-yellow-200 font-bold">
                    ¡Excelente! No hay documentos pendientes por revisar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Panel Lateral: Estadísticas y Acciones */}
          <div className="space-y-6">
            {/* Progreso Semanal */}
            <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Progreso Semanal
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={(estadisticas.documentosRevisadosSemana / 50) * 100}
                    text={`${estadisticas.documentosRevisadosSemana}`}
                    styles={buildStyles({
                      textColor: "#10B981",
                      pathColor: "#10B981",
                      trailColor: "#E5E7EB",
                    })}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Documentos revisados
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {estadisticas.documentosRevisadosSemana} / 50
                  </p>
                </div>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-rose-100 dark:from-yellow-900 dark:via-orange-900/20 dark:to-rose-900/20 rounded-2xl p-6 shadow-lg border border-orange-200 dark:border-yellow-700">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/verification"
                  className="block w-full p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 transition-colors text-center"
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  Ver Todos los Pendientes
                </Link>
                <Link
                  href="/dashboard/reportes"
                  className="block w-full p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 transition-colors text-center"
                >
                  <FontAwesomeIcon icon={faChartLine} className="mr-2" />
                  Generar Reporte
                </Link>
                <Link
                  href="/dashboard/configuracion"
                  className="block w-full p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 transition-colors text-center"
                >
                  <FontAwesomeIcon icon={faFilter} className="mr-2" />
                  Configurar Filtros
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardRevisor;
