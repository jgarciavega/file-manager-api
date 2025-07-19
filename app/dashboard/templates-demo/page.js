"use client";

import { useState } from "react";
import SelectorTemplates from "../components/SelectorTemplates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemplate,
  faRocket,
  faCheckCircle,
  faMagicWandSparkles,
  faFileAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

export default function TemplatesDemo() {
  const [formData, setFormData] = useState({});
  const [templateAplicada, setTemplateAplicada] = useState(null);
  const [tiempoAhorro, setTiempoAhorro] = useState(0);

  const handleTemplateAplicada = (datos, template) => {
    // Simular datos adicionales para completar validación
    const datosCompletos = {
      ...datos,
      // Agregar campos obligatorios faltantes con valores de ejemplo
      nombre_empleado: datos.nombre_empleado || "Juan Pérez García",
      puesto: datos.puesto || "Analista de Sistemas",
      fecha_inicio: datos.fecha_inicio || "2024-01-15",
      numeroEmpleado: datos.numeroEmpleado || "EMP-2024-001",
      fecha_ingreso: datos.fecha_ingreso || "2024-01-15",
      // Campos adicionales para otros templates
      numero_factura: datos.numero_factura || "FACT-2024-001",
      proveedor: datos.proveedor || "Proveedor Ejemplo S.A.",
      monto: datos.monto || "$15,000.00",
      fecha_factura: datos.fecha_factura || "2024-07-16",
      periodo: datos.periodo || "Julio 2024",
      total_empleados: datos.total_empleados || "25",
      monto_total: datos.monto_total || "$125,000.00",
    };

    setFormData(datosCompletos);
    setTemplateAplicada(template);

    // Calcular tiempo ahorrado estimado
    const camposCompletos = Object.keys(datosCompletos).filter(
      (key) => datosCompletos[key] && datosCompletos[key].toString().trim()
    ).length;
    const tiempoEstimado = camposCompletos * 30; // 30 segundos por campo
    setTiempoAhorro(tiempoEstimado);
  };

  const resetDemo = () => {
    setFormData({});
    setTemplateAplicada(null);
    setTiempoAhorro(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faTemplate}
              className="text-4xl text-purple-600"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Templates Inteligentes
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Acelera la captura de documentos con plantillas predefinidas. Reduce
            hasta un 60% el tiempo de llenado de formularios.
          </p>
        </div>

        {/* Estadísticas de rendimiento */}
        {tiempoAhorro > 0 && (
          <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faRocket}
                  className="text-2xl text-green-600"
                />
                <div>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                    ¡Template Aplicada Exitosamente!
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Template: {templateAplicada?.nombre}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600">
                  <FontAwesomeIcon icon={faClock} />
                  <span className="text-2xl font-bold">
                    {Math.floor(tiempoAhorro / 60)}:
                    {(tiempoAhorro % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <p className="text-xs text-green-500">
                  tiempo ahorrado estimado
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Panel principal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Selector de Templates */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
              <FontAwesomeIcon
                icon={faMagicWandSparkles}
                className="text-purple-600"
              />
              Seleccionar Template
            </h2>

            <SelectorTemplates
              jefaturaUsuario="Recursos Humanos" // Simulamos una jefatura
              onTemplateAplicada={handleTemplateAplicada}
              formData={formData}
              mostrarCrearPersonalizada={true}
            />
          </div>

          {/* Vista previa del formulario */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                <FontAwesomeIcon icon={faFileAlt} className="text-blue-600" />
                Vista Previa del Formulario
              </h2>
              {Object.keys(formData).length > 0 && (
                <button
                  onClick={resetDemo}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            {Object.keys(formData).length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FontAwesomeIcon
                  icon={faTemplate}
                  className="text-4xl mb-4 opacity-50"
                />
                <p>
                  Selecciona una template para ver la vista previa del
                  formulario
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData).map(([campo, valor]) => {
                  if (!valor || !valor.toString().trim()) return null;

                  return (
                    <div
                      key={campo}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {campo
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </label>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="text-green-500 text-sm"
                        />
                        <span className="text-gray-800 dark:text-white">
                          {valor.toString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Beneficio 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                icon={faRocket}
                className="text-2xl text-blue-600"
              />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                60% Más Rápido
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reduce significativamente el tiempo de captura de documentos
              usando templates predefinidas.
            </p>
          </div>

          {/* Beneficio 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-2xl text-green-600"
              />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Mayor Precisión
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Templates estandarizadas aseguran consistencia y reducen errores
              en la captura.
            </p>
          </div>

          {/* Beneficio 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                icon={faMagicWandSparkles}
                className="text-2xl text-purple-600"
              />
              <h3 className="font-semibold text-gray-800 dark:text-white">
                Inteligente
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Se adapta automáticamente a tu departamento y tipos de documentos
              más frecuentes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">
            🤖 Sistema de Templates Inteligentes • Desarrollado para optimizar
            la gestión documental
          </p>
        </div>
      </div>
    </div>
  );
}
