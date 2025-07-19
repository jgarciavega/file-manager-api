"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faCheck,
  faTimes,
  faClock,
  faFileAlt,
  faChartLine,
  faStar,
  faExclamationTriangle,
  faLightbulb,
  faTrophy,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Link from "next/link";

const DashboardCapturista = () => {
  const { data: session } = useSession();
  const [estadisticas, setEstadisticas] = useState({
    documentosHoy: 0,
    documentosSemana: 0,
    documentosMes: 0,
    documentosTotal: 0,
    aprobados: 0,
    pendientes: 0,
    rechazados: 0,
    tasaAprobacion: 0,
    tiempoPromedioRevision: 0,
    erroresComunes: [],
    metasSemanal: 25,
    metaMensual: 100,
  });

  const [alertasCalidad, setAlertasCalidad] = useState([]);
  const [recomendaciones, setRecomendaciones] = useState([]);

  // Cargar estadísticas desde la API
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await fetch("/api/estadisticas-capturista");
        if (response.ok) {
          const estadisticasData = await response.json();
          setEstadisticas(estadisticasData);
        } else {
          // En caso de error, usar datos simulados como fallback
          const estadisticasMock = {
            documentosHoy: 8,
            documentosSemana: 23,
            documentosMes: 87,
            documentosTotal: 342,
            aprobados: 298,
            pendientes: 12,
            rechazados: 32,
            tasaAprobacion: 87.2,
            tiempoPromedioRevision: 2.5,
            erroresComunes: [
              { error: "Metadatos incompletos", frecuencia: 15 },
              { error: "Nomenclatura incorrecta", frecuencia: 8 },
              { error: "Clasificación errónea", frecuencia: 5 },
            ],
            metaSemanal: 25,
            metaMensual: 100,
          };
          setEstadisticas(estadisticasMock);
        }
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
        // Fallback a datos simulados
        const estadisticasMock = {
          documentosHoy: 8,
          documentosSemana: 23,
          documentosMes: 87,
          documentosTotal: 342,
          aprobados: 298,
          pendientes: 12,
          rechazados: 32,
          tasaAprobacion: 87.2,
          tiempoPromedioRevision: 2.5,
          erroresComunes: [
            { error: "Metadatos incompletos", frecuencia: 15 },
            { error: "Nomenclatura incorrecta", frecuencia: 8 },
            { error: "Clasificación errónea", frecuencia: 5 },
          ],
          metaSemanal: 25,
          metaMensual: 100,
        };
        setEstadisticas(estadisticasMock);
      }

      // Generar alertas de calidad basadas en estadísticas
      const alertas = [];
      if (estadisticas.tasaAprobacion < 90) {
        alertas.push({
          tipo: "warning",
          mensaje:
            "Tu tasa de aprobación ha bajado. Revisa los errores más comunes.",
        });
      }
      if (estadisticas.documentosSemana >= estadisticas.metaSemanal * 0.9) {
        alertas.push({
          tipo: "success",
          mensaje: "¡Excelente! Estás cerca de alcanzar tu meta semanal.",
        });
      }
      setAlertasCalidad(alertas);

      // Generar recomendaciones personalizadas
      const recomendacionesPersonalizadas = [
        "Usa las plantillas inteligentes para documentos de " +
          (session?.user?.name?.includes("Finanzas") ? "finanzas" : "tu área"),
        "Revisa el cuadro de clasificación antes de asignar códigos",
        "Utiliza el auto-completado para evitar errores de nomenclatura",
      ];
      setRecomendaciones(recomendacionesPersonalizadas);
    };

    cargarEstadisticas();
  }, [session]);

  const porcentajeMensual =
    (estadisticas.documentosMes / estadisticas.metaMensual) * 100;
  const porcentajeSemanal =
    (estadisticas.documentosSemana / estadisticas.metaSemanal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
                Dashboard Personal
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Hola {session?.user?.name || "Capturista"}, aquí tienes tu
                resumen de actividad
              </p>
            </div>
            <Link
              href="/dashboard/subir-documento"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Subir Documento
            </Link>
          </div>
        </div>

        {/* Alertas de Calidad */}
        {alertasCalidad.length > 0 && (
          <div className="mb-8 space-y-3">
            {alertasCalidad.map((alerta, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-l-4 ${
                  alerta.tipo === "success"
                    ? "bg-green-50 border-green-400 text-green-800"
                    : alerta.tipo === "warning"
                    ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                    : "bg-red-50 border-red-400 text-red-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon
                    icon={
                      alerta.tipo === "success"
                        ? faCheck
                        : alerta.tipo === "warning"
                        ? faExclamationTriangle
                        : faTimes
                    }
                  />
                  <span className="font-medium">{alerta.mensaje}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Documentos Hoy */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Hoy
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {estadisticas.documentosHoy}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="text-blue-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Documentos Semana */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Esta Semana
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {estadisticas.documentosSemana}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-green-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Tasa de Aprobación */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tasa Aprobación
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {estadisticas.tasaAprobacion}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-purple-600 text-xl"
                />
              </div>
            </div>
          </div>

          {/* Pendientes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pendientes
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {estadisticas.pendientes}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                <FontAwesomeIcon
                  icon={faClock}
                  className="text-yellow-600 text-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Progreso de Metas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Meta Semanal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Meta Semanal
              </h3>
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-yellow-500 text-xl"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={porcentajeSemanal}
                  text={`${Math.round(porcentajeSemanal)}%`}
                  styles={buildStyles({
                    textColor: "#10B981",
                    pathColor: "#10B981",
                    trailColor: "#E5E7EB",
                  })}
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {estadisticas.documentosSemana} de {estadisticas.metaSemanal}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faltan{" "}
                  {Math.max(
                    0,
                    estadisticas.metaSemanal - estadisticas.documentosSemana
                  )}{" "}
                  documentos
                </p>
              </div>
            </div>
          </div>

          {/* Meta Mensual */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Meta Mensual
              </h3>
              <FontAwesomeIcon
                icon={faTrophy}
                className="text-blue-500 text-xl"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24">
                <CircularProgressbar
                  value={porcentajeMensual}
                  text={`${Math.round(porcentajeMensual)}%`}
                  styles={buildStyles({
                    textColor: "#3B82F6",
                    pathColor: "#3B82F6",
                    trailColor: "#E5E7EB",
                  })}
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {estadisticas.documentosMes} de {estadisticas.metaMensual}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faltan{" "}
                  {Math.max(
                    0,
                    estadisticas.metaMensual - estadisticas.documentosMes
                  )}{" "}
                  documentos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Errores Comunes y Recomendaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Errores Más Comunes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Errores Más Comunes
            </h3>
            <div className="space-y-4">
              {estadisticas.erroresComunes.map((error, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-800 dark:text-white">
                    {error.error}
                  </span>
                  <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                    {error.frecuencia} veces
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
              Recomendaciones Personalizadas
            </h3>
            <div className="space-y-4">
              {recomendaciones.map((recomendacion, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <FontAwesomeIcon
                    icon={faLightbulb}
                    className="text-blue-600 mt-0.5"
                  />
                  <span className="text-sm text-gray-800 dark:text-white">
                    {recomendacion}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCapturista;
