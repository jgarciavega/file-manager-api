"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faPlus,
  faTimes,
  faCheck,
  faExclamationTriangle,
  faInfoCircle,
  faUser,
  faClock,
  faPaperPlane,
  faReply,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const SistemaComentarios = ({ documentoId, onComentarioAgregado }) => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [tipoComentario, setTipoComentario] = useState("info");
  const [campoEspecifico, setCampoEspecifico] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState("");
  const [editandoComentario, setEditandoComentario] = useState(null);

  // Plantillas de comentarios comunes
  const plantillasComentarios = {
    metadatos_incompletos: {
      texto:
        "Los metadatos están incompletos. Por favor verifica que todos los campos obligatorios estén llenos.",
      tipo: "warning",
      campo: "metadatos",
    },
    nomenclatura_incorrecta: {
      texto:
        "La nomenclatura no sigue el estándar establecido. Consulta el cuadro de clasificación.",
      tipo: "error",
      campo: "nomenclatura",
    },
    fecha_invalida: {
      texto:
        "La fecha del documento no corresponde con el contenido. Por favor verifica.",
      tipo: "warning",
      campo: "fechaDocumento",
    },
    clasificacion_erronea: {
      texto:
        "La clasificación documental asignada no es correcta para este tipo de documento.",
      tipo: "error",
      campo: "clasificacion",
    },
    documento_aprobado: {
      texto:
        "Documento aprobado. Cumple con todos los requisitos establecidos.",
      tipo: "success",
      campo: "general",
    },
    calidad_excelente: {
      texto:
        "Excelente calidad en la captura. Felicitaciones por el trabajo realizado.",
      tipo: "success",
      campo: "general",
    },
  };

  const camposDocumento = [
    { value: "general", label: "General" },
    { value: "titulo", label: "Título" },
    { value: "metadatos", label: "Metadatos" },
    { value: "nomenclatura", label: "Nomenclatura" },
    { value: "clasificacion", label: "Clasificación" },
    { value: "fechaDocumento", label: "Fecha del Documento" },
    { value: "archivo", label: "Archivo Digital" },
    { value: "observaciones", label: "Observaciones" },
  ];

  // Cargar comentarios existentes
  useEffect(() => {
    cargarComentarios();
  }, [documentoId]);

  const cargarComentarios = async () => {
    try {
      const response = await fetch(
        `/api/comentarios-documento?documentoId=${documentoId}`
      );
      if (response.ok) {
        const data = await response.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
      // Datos de ejemplo para demo
      setComentarios([
        {
          id: 1,
          texto: "El título del documento necesita ser más específico.",
          tipo: "warning",
          campo: "titulo",
          autor: "María Revisor",
          fecha: new Date(Date.now() - 1000 * 60 * 60 * 2),
          resuelto: false,
        },
        {
          id: 2,
          texto: "Excelente trabajo en la clasificación documental.",
          tipo: "success",
          campo: "clasificacion",
          autor: "Carlos Supervisor",
          fecha: new Date(Date.now() - 1000 * 60 * 60 * 24),
          resuelto: true,
        },
      ]);
    }
  };

  const agregarComentario = async () => {
    if (!nuevoComentario.trim()) return;

    const comentario = {
      documentoId,
      texto: nuevoComentario,
      tipo: tipoComentario,
      campo: campoEspecifico || "general",
    };

    try {
      const response = await fetch("/api/comentarios-documento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comentario),
      });

      if (response.ok) {
        const nuevoComentarioData = await response.json();
        setComentarios([...comentarios, nuevoComentarioData]);
        setNuevoComentario("");
        setMostrarFormulario(false);
        onComentarioAgregado && onComentarioAgregado(nuevoComentarioData);
      }
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      // Agregar comentario localmente para demo
      const nuevoComentarioLocal = {
        id: Date.now(),
        ...comentario,
        autor: "Usuario Actual",
        fecha: new Date(),
        resuelto: false,
      };
      setComentarios([...comentarios, nuevoComentarioLocal]);
      setNuevoComentario("");
      setMostrarFormulario(false);
    }
  };

  const aplicarPlantilla = (plantillaKey) => {
    const plantilla = plantillasComentarios[plantillaKey];
    if (plantilla) {
      setNuevoComentario(plantilla.texto);
      setTipoComentario(plantilla.tipo);
      setCampoEspecifico(plantilla.campo);
    }
  };

  const marcarComoResuelto = async (comentarioId) => {
    try {
      const response = await fetch(
        `/api/comentarios-documento/${comentarioId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resuelto: true }),
        }
      );

      if (response.ok) {
        setComentarios(
          comentarios.map((c) =>
            c.id === comentarioId ? { ...c, resuelto: true } : c
          )
        );
      }
    } catch (error) {
      console.error("Error al marcar comentario como resuelto:", error);
      // Actualizar localmente para demo
      setComentarios(
        comentarios.map((c) =>
          c.id === comentarioId ? { ...c, resuelto: true } : c
        )
      );
    }
  };

  const obtenerIconoTipo = (tipo) => {
    switch (tipo) {
      case "success":
        return faCheck;
      case "warning":
        return faExclamationTriangle;
      case "error":
        return faTimes;
      default:
        return faInfoCircle;
    }
  };

  const obtenerColorTipo = (tipo) => {
    switch (tipo) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(fecha));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <FontAwesomeIcon icon={faComment} />
            Comentarios y Observaciones
          </h3>
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faPlus} />
            Agregar Comentario
          </button>
        </div>
      </div>

      {/* Formulario de Nuevo Comentario */}
      {mostrarFormulario && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          {/* Plantillas Rápidas */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plantillas Rápidas:
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(plantillasComentarios).map(([key, plantilla]) => (
                <button
                  key={key}
                  onClick={() => aplicarPlantilla(key)}
                  className="px-3 py-1 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                >
                  {key.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Selecciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Comentario:
              </label>
              <select
                value={tipoComentario}
                onChange={(e) => setTipoComentario(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              >
                <option value="info">Información</option>
                <option value="warning">Advertencia</option>
                <option value="error">Error</option>
                <option value="success">Aprobación</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campo Específico:
              </label>
              <select
                value={campoEspecifico}
                onChange={(e) => setCampoEspecifico(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              >
                {camposDocumento.map((campo) => (
                  <option key={campo.value} value={campo.value}>
                    {campo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Área de Texto */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comentario:
            </label>
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
              placeholder="Escribe tu comentario aquí..."
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <button
              onClick={agregarComentario}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
              Enviar Comentario
            </button>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de Comentarios */}
      <div className="p-6">
        {comentarios.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faComment} className="text-4xl mb-4" />
            <p>No hay comentarios aún. ¡Sé el primero en agregar uno!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <div
                key={comentario.id}
                className={`p-4 rounded-lg border ${obtenerColorTipo(
                  comentario.tipo
                )} ${comentario.resuelto ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon
                        icon={obtenerIconoTipo(comentario.tipo)}
                        className="text-sm"
                      />
                      <span className="font-medium text-sm">
                        {camposDocumento.find(
                          (c) => c.value === comentario.campo
                        )?.label || "General"}
                      </span>
                      {comentario.resuelto && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Resuelto
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 mb-3">
                      {comentario.texto}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} />
                        {comentario.autor}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {formatearFecha(comentario.fecha)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!comentario.resuelto && (
                      <button
                        onClick={() => marcarComoResuelto(comentario.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Marcar Resuelto
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SistemaComentarios;
