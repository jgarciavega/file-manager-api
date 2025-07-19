// hooks/useAutoComplete.js - Hook para auto-completado inteligente

import { useState, useEffect, useCallback } from "react";
import {
  getSugerenciasPorJefatura,
  getMetadatosPorTipo,
  generarNomenclaturaSugerida,
  validadores,
} from "../lib/autoCompleteMetadata";

export const useAutoComplete = (formData, setFormData) => {
  const [sugerencias, setSugerencias] = useState({});
  const [validacionEnTiempo, setValidacionEnTiempo] = useState({});
  const [alertasCalidad, setAlertasCalidad] = useState([]);

  // Auto-completado basado en jefatura
  const aplicarAutoCompletadoJefatura = useCallback(
    (jefatura) => {
      if (!jefatura) return;

      const sugerenciasJefatura = getSugerenciasPorJefatura(jefatura);

      setSugerencias((prev) => ({
        ...prev,
        series: sugerenciasJefatura.seriesComunes,
        codigos: sugerenciasJefatura.codigosFrec,
        vigencia: sugerenciasJefatura.vigenciaDefault,
        valorDocumental: sugerenciasJefatura.valorDocumental,
        destinoFinal: sugerenciasJefatura.destinoFinal,
        soporteDocumental: sugerenciasJefatura.soporteDefault,
      }));

      // Auto-llenar campos con valores por defecto
      setFormData((prev) => ({
        ...prev,
        vigencia: prev.vigencia || sugerenciasJefatura.vigenciaDefault,
        valor_documental:
          prev.valor_documental || sugerenciasJefatura.valorDocumental,
        destino_final: prev.destino_final || sugerenciasJefatura.destinoFinal,
        soporte_documental:
          prev.soporte_documental || sugerenciasJefatura.soporteDefault,
        procedencia_admin: prev.procedencia_admin || jefatura,
      }));
    },
    [setFormData]
  );

  // Auto-completado basado en tipo de documento
  const aplicarAutoCompletadoTipo = useCallback(
    (tipoDocumento) => {
      if (!tipoDocumento) return;

      const metadatosTipo = getMetadatosPorTipo(tipoDocumento);
      const nomenclaturaSugerida = generarNomenclaturaSugerida(
        tipoDocumento,
        formData
      );

      setSugerencias((prev) => ({
        ...prev,
        nomenclatura: nomenclaturaSugerida,
        metadatosTipo,
      }));

      // Sugerir valores si están vacíos
      setFormData((prev) => ({
        ...prev,
        valor_documental:
          prev.valor_documental || metadatosTipo.valorDocumental,
        plazo_conservacion:
          prev.plazo_conservacion || metadatosTipo.plazoConservacion,
        destino_final: prev.destino_final || metadatosTipo.destinoFinal,
      }));
    },
    [formData, setFormData]
  );

  // Validación en tiempo real
  const validarCampo = useCallback((campo, valor) => {
    let resultado = { valido: true, mensaje: "" };

    switch (campo) {
      case "codigo_clasificacion":
        resultado = validadores.codigoClasificacion(valor);
        break;
      case "folio_documento":
        resultado = validadores.folioDocumento(valor);
        break;
      case "nombre":
        resultado = validadores.nombreArchivo(valor);
        break;
      default:
        break;
    }

    setValidacionEnTiempo((prev) => ({
      ...prev,
      [campo]: resultado,
    }));

    return resultado;
  }, []);

  // Análisis de calidad del formulario
  const analizarCalidad = useCallback(() => {
    const alertas = [];

    // Verificar campos obligatorios LEA-BCS
    const camposObligatorios = [
      "nombre",
      "classification",
      "jefatura",
      "review",
      "codigo_clasificacion",
      "serie",
      "valor_documental",
      "plazo_conservacion",
      "destino_final",
      "soporte_documental",
    ];

    camposObligatorios.forEach((campo) => {
      if (!formData[campo] || formData[campo].trim() === "") {
        alertas.push({
          tipo: "error",
          campo,
          mensaje: `Campo obligatorio: ${campo.replace("_", " ")}`,
        });
      }
    });

    // Verificar coherencia de metadatos
    if (
      formData.valor_documental === "fiscal" &&
      !formData.plazo_conservacion.includes("7")
    ) {
      alertas.push({
        tipo: "warning",
        campo: "plazo_conservacion",
        mensaje: "Documentos fiscales generalmente tienen vigencia de 7 años",
      });
    }

    if (
      formData.destino_final === "conservacion_permanente" &&
      parseInt(formData.plazo_conservacion) < 10
    ) {
      alertas.push({
        tipo: "warning",
        campo: "destino_final",
        mensaje:
          "Documentos de conservación permanente usualmente tienen plazo ≥ 10 años",
      });
    }

    // Verificar nomenclatura
    if (formData.nombre && !formData.nombre.match(/^[A-Za-z0-9_\-\s]+$/)) {
      alertas.push({
        tipo: "error",
        campo: "nombre",
        mensaje: "El nombre contiene caracteres no permitidos",
      });
    }

    setAlertasCalidad(alertas);
    return alertas;
  }, [formData]);

  // Sugerencias inteligentes de mejora
  const obtenerSugerenciasMejora = useCallback(() => {
    const sugerenciasMejora = [];

    // Sugerir series documentales si está vacía
    if (
      !formData.serie &&
      formData.jefatura &&
      sugerencias.series?.length > 0
    ) {
      sugerenciasMejora.push({
        tipo: "sugerencia",
        mensaje: `Sugerencias de serie para ${formData.jefatura}:`,
        opciones: sugerencias.series,
      });
    }

    // Sugerir código de clasificación
    if (
      !formData.codigo_clasificacion &&
      formData.jefatura &&
      sugerencias.codigos?.length > 0
    ) {
      sugerenciasMejora.push({
        tipo: "sugerencia",
        mensaje: "Códigos frecuentes para esta jefatura:",
        opciones: sugerencias.codigos,
      });
    }

    // Sugerir nomenclatura si hay patrón disponible
    if (
      sugerencias.nomenclatura &&
      formData.nombre !== sugerencias.nomenclatura
    ) {
      sugerenciasMejora.push({
        tipo: "sugerencia",
        mensaje: "Nomenclatura sugerida:",
        valor: sugerencias.nomenclatura,
      });
    }

    return sugerenciasMejora;
  }, [formData, sugerencias]);

  // Efectos para auto-completado automático
  useEffect(() => {
    if (formData.jefatura) {
      aplicarAutoCompletadoJefatura(formData.jefatura);
    }
  }, [formData.jefatura, aplicarAutoCompletadoJefatura]);

  useEffect(() => {
    if (formData.classification) {
      aplicarAutoCompletadoTipo(formData.classification);
    }
  }, [formData.classification, aplicarAutoCompletadoTipo]);

  // Análisis de calidad en tiempo real (con debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      analizarCalidad();
    }, 500);

    return () => clearTimeout(timer);
  }, [formData, analizarCalidad]);

  return {
    sugerencias,
    validacionEnTiempo,
    alertasCalidad,
    validarCampo,
    obtenerSugerenciasMejora,
    aplicarAutoCompletadoJefatura,
    aplicarAutoCompletadoTipo,
    analizarCalidad,
  };
};

export default useAutoComplete;
