"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileTemplate,
  faPlus,
  faSave,
  faSearch,
  faEdit,
  faTrash,
  faCopy,
  faCheck,
  faTimes,
  faLightbulb,
  faFileAlt,
  faStar,
  faHistory,
  faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";
import useTemplates from "../../../hooks/useTemplates";

const SelectorTemplates = ({
  jefaturaUsuario,
  onTemplateAplicada,
  formData = {},
  mostrarCrearPersonalizada = true,
}) => {
  const {
    templates,
    templatesPersonalizadas,
    templateActiva,
    loading,
    error,
    aplicarTemplate,
    validarTemplate,
    guardarTemplatePersonalizada,
    eliminarTemplatePersonalizada,
    buscarTemplates,
    obtenerSugerencias,
    limpiarTemplate,
    duplicarTemplate,
  } = useTemplates(jefaturaUsuario);

  // Debug logs - solo en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔍 SelectorTemplates - Debug:", {
        jefatura: jefaturaUsuario,
        predefinidas: templates.length,
        personalizadas: templatesPersonalizadas.length,
        loading,
        error,
      });
    }
  }, [jefaturaUsuario, templates, templatesPersonalizadas, loading, error]);

  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState(null);
  const [mostrarFormCrear, setMostrarFormCrear] = useState(false);
  const [nuevaTemplate, setNuevaTemplate] = useState({
    nombre: "",
    descripcion: "",
    metadatos: {},
    camposObligatorios: [],
  });

  // Buscar templates cuando cambia el texto de búsqueda
  useEffect(() => {
    if (busqueda.trim()) {
      const resultados = buscarTemplates(busqueda);
      setResultadosBusqueda(resultados);
    } else {
      setResultadosBusqueda(null);
    }
  }, [busqueda, buscarTemplates]);

  // Aplicar template seleccionada
  const handleAplicarTemplate = (templateKey, esPersonalizada = false) => {
    const resultado = aplicarTemplate(templateKey, formData, esPersonalizada);

    if (resultado.success) {
      onTemplateAplicada &&
        onTemplateAplicada(resultado.data, resultado.template);
      setMostrarPanel(false);
    }
  };

  // Crear template personalizada desde formulario actual
  const handleCrearDesdeFormulario = async () => {
    if (!nuevaTemplate.nombre.trim()) {
      alert("Por favor ingresa un nombre para la template");
      return;
    }

    const resultado = await guardarTemplatePersonalizada(
      nuevaTemplate.nombre,
      formData, // Usar datos actuales del formulario
      nuevaTemplate.camposObligatorios
    );

    if (resultado.success) {
      setMostrarFormCrear(false);
      setNuevaTemplate({
        nombre: "",
        descripcion: "",
        metadatos: {},
        camposObligatorios: [],
      });
      alert("Template personalizada creada exitosamente");
    }
  };

  // Duplicar template predefinida como personalizada
  const handleDuplicarTemplate = async (templateKey) => {
    const nombre = prompt("Nombre para la copia de la template:");
    if (!nombre) return;

    const resultado = await duplicarTemplate(templateKey, nombre);
    if (resultado.success) {
      alert("Template duplicada exitosamente");
    }
  };

  // Eliminar template personalizada
  const handleEliminarTemplate = async (templateId) => {
    if (!confirm("¿Estás seguro de eliminar esta template personalizada?"))
      return;

    const resultado = await eliminarTemplatePersonalizada(templateId);
    if (resultado.success) {
      alert("Template eliminada exitosamente");
    }
  };

  const templatesList = resultadosBusqueda
    ? [...resultadosBusqueda.predefinidas, ...resultadosBusqueda.personalizadas]
    : [...templates, ...templatesPersonalizadas];

  return (
    <div className="relative">
      {/* Botón principal para abrir panel */}
      <button
        onClick={() => setMostrarPanel(!mostrarPanel)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <FontAwesomeIcon icon={faFileTemplate} />
        <span className="font-medium">
          {templateActiva
            ? `Template: ${templateActiva.nombre}`
            : "Usar Template"}
        </span>
        {templateActiva && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              limpiarTemplate();
              onTemplateAplicada && onTemplateAplicada({}, null);
            }}
            className="ml-2 p-1 hover:bg-white/20 rounded"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xs" />
          </button>
        )}
      </button>

      {/* Panel de selección de templates */}
      {mostrarPanel && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
          {/* Header del panel */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faFileTemplate}
                  className="text-purple-600"
                />
                Templates Inteligentes
              </h3>
              <button
                onClick={() => setMostrarPanel(false)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </button>
            </div>

            {/* Búsqueda */}
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar templates..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Lista de templates */}
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2"></div>
                Cargando templates...
              </div>
            ) : templatesList.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FontAwesomeIcon icon={faFileAlt} className="text-2xl mb-2" />
                <p>No se encontraron templates</p>
              </div>
            ) : (
              <div className="p-2">
                {templatesList.map((template, index) => (
                  <div
                    key={template.key || template.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer group"
                  >
                    <div
                      className="flex-1"
                      onClick={() =>
                        handleAplicarTemplate(
                          template.key || template.id,
                          template.tipo === "personalizada"
                        )
                      }
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <FontAwesomeIcon
                          icon={
                            template.tipo === "personalizada"
                              ? faStar
                              : faLightbulb
                          }
                          className={`text-sm ${
                            template.tipo === "personalizada"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }`}
                        />
                        <span className="font-medium text-gray-800 dark:text-white text-sm">
                          {template.nombre}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {template.descripcion}
                      </p>
                      {template.metadatos?.serie && (
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                          📁 {template.metadatos.serie}
                        </p>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {template.tipo !== "personalizada" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicarTemplate(template.key);
                          }}
                          className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded text-blue-600"
                          title="Duplicar como personalizada"
                        >
                          <FontAwesomeIcon icon={faCopy} className="text-xs" />
                        </button>
                      )}

                      {template.tipo === "personalizada" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarTemplate(template.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-red-600"
                          title="Eliminar template"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con acciones */}
          {mostrarCrearPersonalizada && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              {!mostrarFormCrear ? (
                <button
                  onClick={() => setMostrarFormCrear(true)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Crear Template del Formulario Actual
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nombre de la template..."
                    value={nuevaTemplate.nombre}
                    onChange={(e) =>
                      setNuevaTemplate((prev) => ({
                        ...prev,
                        nombre: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCrearDesdeFormulario}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Guardar
                    </button>
                    <button
                      onClick={() => setMostrarFormCrear(false)}
                      className="px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Indicador de validación si hay template activa */}
      {templateActiva && (
        <div className="mt-2">
          <TemplateValidator
            template={templateActiva}
            formData={formData}
            validarTemplate={validarTemplate}
          />
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

// Componente para validar template activa
const TemplateValidator = ({ template, formData, validarTemplate }) => {
  const [validacion, setValidacion] = useState(null);

  useEffect(() => {
    if (template && formData) {
      const resultado = validarTemplate(formData);
      setValidacion(resultado);
    }
  }, [template, formData, validarTemplate]);

  if (!validacion) return null;

  return (
    <div
      className={`p-3 rounded-lg border ${
        validacion.valido
          ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      }`}
    >
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={validacion.valido ? faCheck : faMagicWandSparkles}
          className={validacion.valido ? "text-green-600" : "text-yellow-600"}
        />
        <span
          className={`text-sm font-medium ${
            validacion.valido
              ? "text-green-800 dark:text-green-200"
              : "text-yellow-800 dark:text-yellow-200"
          }`}
        >
          {validacion.mensaje}
        </span>
      </div>

      {!validacion.valido && validacion.faltantes.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-1">
            Campos requeridos por la template:
          </p>
          <div className="flex flex-wrap gap-1">
            {validacion.faltantes.map((campo) => (
              <span
                key={campo}
                className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs rounded"
              >
                {campo}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectorTemplates;
