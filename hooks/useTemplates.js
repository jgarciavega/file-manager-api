"use client";

import { useState, useEffect, useCallback } from "react";
import TemplateManager from "../lib/templateManager";

const useTemplates = (jefaturaUsuario) => {
  const [templates, setTemplates] = useState([]);
  const [templatesPersonalizadas, setTemplatesPersonalizadas] = useState([]);
  const [templateActiva, setTemplateActiva] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar templates predefinidas
  const cargarTemplatesPredefinidas = useCallback(() => {
    try {
      setLoading(true);
      const templatesDisponibles =
        TemplateManager.getTemplatesDisponibles(jefaturaUsuario);
      setTemplates(templatesDisponibles);
      setError(null);
    } catch (err) {
      setError("Error al cargar templates predefinidas");
      console.error("Error cargando templates:", err);
    } finally {
      setLoading(false);
    }
  }, [jefaturaUsuario]);

  // Cargar templates personalizadas del usuario (simulado - implementar API)
  const cargarTemplatesPersonalizadas = useCallback(async () => {
    try {
      // Por ahora, usar datos simulados del localStorage
      const clave = `templates_${jefaturaUsuario}`;
      const templatesGuardadas = localStorage.getItem(clave) || "[]";
      const templates = JSON.parse(templatesGuardadas);
      setTemplatesPersonalizadas(templates);
    } catch (err) {
      console.error("❌ Error cargando templates personalizadas:", err);
      setTemplatesPersonalizadas([]); // Fallback a array vacío
    }
  }, [jefaturaUsuario]);

  // Cargar templates predefinidas y personalizadas al montar el componente
  useEffect(() => {
    cargarTemplatesPredefinidas();
    cargarTemplatesPersonalizadas();
  }, [cargarTemplatesPredefinidas, cargarTemplatesPersonalizadas]);

  // Aplicar template al formulario
  const aplicarTemplate = useCallback(
    (templateKey, formData = {}, esPersonalizada = false) => {
      try {
        let templateData = null;

        if (esPersonalizada) {
          templateData = templatesPersonalizadas.find(
            (t) => t.id === templateKey
          );
        } else {
          templateData = TemplateManager.getTemplate(
            jefaturaUsuario,
            templateKey
          );
        }

        if (!templateData) {
          throw new Error("Template no encontrada");
        }

        const datosAplicados = TemplateManager.aplicarTemplate(
          templateData,
          formData
        );
        setTemplateActiva(templateData);
        setError(null);

        return {
          success: true,
          data: datosAplicados,
          template: templateData,
        };
      } catch (err) {
        setError(err.message);
        return {
          success: false,
          error: err.message,
        };
      }
    },
    [jefaturaUsuario, templatesPersonalizadas]
  );

  // Validar campos obligatorios de la template activa
  const validarTemplate = useCallback(
    (formData) => {
      if (!templateActiva) {
        return {
          valido: true,
          faltantes: [],
          mensaje: "No hay template activa",
        };
      }

      return TemplateManager.validarCamposObligatorios(
        templateActiva,
        formData
      );
    },
    [templateActiva]
  );

  // Guardar template personalizada
  const guardarTemplatePersonalizada = useCallback(
    async (nombre, formData, camposObligatorios = []) => {
      try {
        setLoading(true);

        // Preparar metadatos desde formData
        const metadatos = {
          serie: formData.serie || "",
          subserie: formData.subserie || "",
          codigo_clasificacion: formData.codigo_clasificacion || "",
          valor_documental: formData.valor_documental || "",
          plazo_conservacion: formData.plazo_conservacion || "",
          destino_final: formData.destino_final || "",
          soporte_documental: formData.soporte_documental || "",
          acceso: formData.acceso || "",
          observaciones: formData.observaciones || "",
          classification: formData.classification || "",
          jefatura: formData.jefatura || jefaturaUsuario,
          vigencia: formData.vigencia || "",
          procedencia_admin: formData.procedencia_admin || "",
        };

        // Crear template personalizada
        const nuevaTemplate = {
          id: `custom_${Date.now()}`,
          nombre,
          descripcion: `Template personalizada: ${nombre}`,
          metadatos,
          camposObligatorios:
            camposObligatorios.length > 0
              ? camposObligatorios
              : Object.keys(metadatos).filter((key) => metadatos[key]),
          tipo: "personalizada",
          creadoPor: jefaturaUsuario,
          fechaCreacion: new Date().toISOString(),
        };

        // Guardar en localStorage (temporal - implementar API)
        const templatesActuales = [...templatesPersonalizadas, nuevaTemplate];
        const clave = `templates_${jefaturaUsuario}`;

        console.log("💾 Guardando template personalizada:", nuevaTemplate);
        console.log(
          "📊 Total templates después del guardado:",
          templatesActuales.length
        );

        localStorage.setItem(clave, JSON.stringify(templatesActuales));
        setTemplatesPersonalizadas(templatesActuales);

        // Verificar que se guardó correctamente
        const verificacion = localStorage.getItem(clave);
        console.log(
          "✅ Verificación localStorage:",
          verificacion ? "OK" : "FALLO"
        );

        // TODO: Implementar llamada a API
        // await fetch('/api/templates/personalizadas', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(nuevaTemplate)
        // });

        setError(null);

        // Recargar templates para asegurar sincronización
        setTimeout(() => {
          cargarTemplatesPersonalizadas();
        }, 100);

        return { success: true, template: nuevaTemplate };
      } catch (err) {
        setError("Error al guardar template personalizada");
        console.error("Error guardando template:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [jefaturaUsuario, templatesPersonalizadas]
  );

  // Eliminar template personalizada
  const eliminarTemplatePersonalizada = useCallback(
    async (templateId) => {
      try {
        setLoading(true);

        const templatesActualizadas = templatesPersonalizadas.filter(
          (t) => t.id !== templateId
        );
        localStorage.setItem(
          `templates_${jefaturaUsuario}`,
          JSON.stringify(templatesActualizadas)
        );
        setTemplatesPersonalizadas(templatesActualizadas);

        // TODO: Implementar llamada a API
        // await fetch(`/api/templates/personalizadas/${templateId}`, {
        //   method: 'DELETE'
        // });

        // Si la template eliminada era la activa, limpiar
        if (templateActiva && templateActiva.id === templateId) {
          setTemplateActiva(null);
        }

        setError(null);
        return { success: true };
      } catch (err) {
        setError("Error al eliminar template");
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    [templatesPersonalizadas, templateActiva, jefaturaUsuario]
  );

  // Buscar templates
  const buscarTemplates = useCallback(
    (texto) => {
      const resultadosPredefinidas = TemplateManager.buscarTemplates(
        texto,
        jefaturaUsuario
      );
      const resultadosPersonalizadas = templatesPersonalizadas.filter(
        (template) =>
          template.nombre.toLowerCase().includes(texto.toLowerCase()) ||
          template.descripcion.toLowerCase().includes(texto.toLowerCase())
      );

      return {
        predefinidas: resultadosPredefinidas,
        personalizadas: resultadosPersonalizadas,
        total: resultadosPredefinidas.length + resultadosPersonalizadas.length,
      };
    },
    [jefaturaUsuario, templatesPersonalizadas]
  );

  // Obtener sugerencias inteligentes
  const obtenerSugerencias = useCallback(
    (tipoDocumento) => {
      return TemplateManager.getSugerenciasInteligentes(
        jefaturaUsuario,
        tipoDocumento
      );
    },
    [jefaturaUsuario]
  );

  // Limpiar template activa
  const limpiarTemplate = useCallback(() => {
    setTemplateActiva(null);
    setError(null);
  }, []);

  // Duplicar template como personalizada
  const duplicarTemplate = useCallback(
    async (templateKey, nuevoNombre) => {
      try {
        const templateOriginal = TemplateManager.getTemplate(
          jefaturaUsuario,
          templateKey
        );
        if (!templateOriginal) {
          throw new Error("Template original no encontrada");
        }

        // Crear formData simulado desde la template original
        const formDataSimulado = {
          ...templateOriginal.metadatos,
          ...templateOriginal.sugerenciasAdicionales,
        };

        return await guardarTemplatePersonalizada(
          nuevoNombre,
          formDataSimulado,
          templateOriginal.camposObligatorios
        );
      } catch (err) {
        setError(err.message);
        return { success: false, error: err.message };
      }
    },
    [jefaturaUsuario, guardarTemplatePersonalizada]
  );

  // Obtener estadísticas de uso de templates
  const obtenerEstadisticas = useCallback(() => {
    return {
      totalPredefinidas: templates.length,
      totalPersonalizadas: templatesPersonalizadas.length,
      templateActiva: templateActiva?.nombre || null,
      ultimaUsada: templateActiva?.fechaUso || null,
    };
  }, [templates, templatesPersonalizadas, templateActiva]);

  return {
    // Estado
    templates,
    templatesPersonalizadas,
    templateActiva,
    loading,
    error,

    // Acciones
    aplicarTemplate,
    validarTemplate,
    guardarTemplatePersonalizada,
    eliminarTemplatePersonalizada,
    buscarTemplates,
    obtenerSugerencias,
    limpiarTemplate,
    duplicarTemplate,
    obtenerEstadisticas,

    // Funciones de carga
    cargarTemplatesPredefinidas,
    cargarTemplatesPersonalizadas,
  };
};

export default useTemplates;
