// lib/autoCompleteMetadata.js - Sistema de auto-completado inteligente para capturistas

export const autoCompleteMetadata = {
  // Configuración por jefatura de la API BCS
  byJefatura: {
    "Dirección General": {
      seriesComunes: [
        "Acuerdos y Resoluciones",
        "Planes y Programas Institucionales",
        "Informes de Gestión",
        "Correspondencia Oficial",
      ],
      codigosFrec: ["001.001", "001.002", "001.003", "001.004"],
      vigenciaDefault: "10 años",
      valorDocumental: "administrativo",
      destinoFinal: "conservacion_permanente",
      soporteDefault: "electronico",
    },

    "Subdirección de Administración y Finanzas": {
      seriesComunes: [
        "Presupuestos",
        "Estados Financieros",
        "Facturas y Comprobantes",
        "Contratos y Convenios",
        "Nóminas",
      ],
      codigosFrec: ["005.001", "005.002", "005.003", "005.004", "005.005"],
      vigenciaDefault: "7 años",
      valorDocumental: "fiscal",
      destinoFinal: "baja_documental",
      soporteDefault: "electronico",
    },

    "Subdirección de Recursos Humanos": {
      seriesComunes: [
        "Expedientes de Personal",
        "Contratos Laborales",
        "Incapacidades y Permisos",
        "Capacitación y Desarrollo",
        "Evaluaciones de Desempeño",
      ],
      codigosFrec: ["004.001", "004.002", "004.003", "004.004", "004.005"],
      vigenciaDefault: "5 años",
      valorDocumental: "legal",
      destinoFinal: "transferencia",
      soporteDefault: "mixto",
    },

    "Subdirección de Operaciones Portuarias": {
      seriesComunes: [
        "Manifiestos de Carga",
        "Permisos de Atraque",
        "Registros de Movimientos",
        "Certificados de Seguridad",
        "Bitácoras Operativas",
      ],
      codigosFrec: ["007.001", "007.002", "007.003", "007.004", "007.005"],
      vigenciaDefault: "3 años",
      valorDocumental: "informativo",
      destinoFinal: "baja_documental",
      soporteDefault: "electronico",
    },

    "Subdirección de Ingeniería y Desarrollo": {
      seriesComunes: [
        "Proyectos de Obra",
        "Planos y Especificaciones",
        "Estudios Técnicos",
        "Dictámenes de Ingeniería",
        "Seguimiento de Obras",
      ],
      codigosFrec: ["008.001", "008.002", "008.003", "008.004", "008.005"],
      vigenciaDefault: "15 años",
      valorDocumental: "tecnico",
      destinoFinal: "conservacion_permanente",
      soporteDefault: "mixto",
    },

    "Coordinación de Seguridad": {
      seriesComunes: [
        "Planes de Seguridad",
        "Reportes de Incidentes",
        "Protocolos de Emergencia",
        "Capacitación en Seguridad",
        "Auditorías de Seguridad",
      ],
      codigosFrec: ["009.001", "009.002", "009.003", "009.004", "009.005"],
      vigenciaDefault: "5 años",
      valorDocumental: "legal",
      destinoFinal: "transferencia",
      soporteDefault: "electronico",
    },

    "Coordinación de Medio Ambiente": {
      seriesComunes: [
        "Estudios de Impacto Ambiental",
        "Permisos Ambientales",
        "Monitoreo Ambiental",
        "Planes de Manejo",
        "Reportes Ambientales",
      ],
      codigosFrec: ["010.001", "010.002", "010.003", "010.004", "010.005"],
      vigenciaDefault: "10 años",
      valorDocumental: "legal",
      destinoFinal: "conservacion_permanente",
      soporteDefault: "electronico",
    },

    "Coordinación Jurídica": {
      seriesComunes: [
        "Contratos y Convenios",
        "Dictámenes Legales",
        "Demandas y Juicios",
        "Normatividad Interna",
        "Asesorías Jurídicas",
      ],
      codigosFrec: ["015.001", "015.002", "015.003", "015.004", "015.005"],
      vigenciaDefault: "10 años",
      valorDocumental: "legal",
      destinoFinal: "conservacion_permanente",
      soporteDefault: "mixto",
    },
  },

  // Tipos de documento más comunes con sus metadatos típicos
  tiposDocumento: {
    Acta: {
      valorDocumental: "legal",
      plazoConservacion: "10 años",
      destinoFinal: "conservacion_permanente",
    },
    Factura: {
      valorDocumental: "fiscal",
      plazoConservacion: "7 años",
      destinoFinal: "baja_documental",
    },
    Contrato: {
      valorDocumental: "legal",
      plazoConservacion: "10 años",
      destinoFinal: "conservacion_permanente",
    },
    Informe: {
      valorDocumental: "informativo",
      plazoConservacion: "5 años",
      destinoFinal: "transferencia",
    },
    Oficio: {
      valorDocumental: "administrativo",
      plazoConservacion: "3 años",
      destinoFinal: "baja_documental",
    },
    Proyecto: {
      valorDocumental: "tecnico",
      plazoConservacion: "15 años",
      destinoFinal: "conservacion_permanente",
    },
  },

  // Patrones de nomenclatura por tipo
  nomenclaturaPatterns: {
    Acta: "ACTA_[FECHA]_[NUMERO]",
    Factura: "FACT_[PROVEEDOR]_[NUMERO]",
    Contrato: "CONT_[TIPO]_[NUMERO]_[AÑO]",
    Informe: "INF_[PERIODO]_[AREA]",
    Oficio: "OF_[NUMERO]_[DESTINATARIO]",
    Proyecto: "PROY_[CODIGO]_[NOMBRE]",
  },
};

// Función para obtener sugerencias basadas en jefatura
export const getSugerenciasPorJefatura = (jefatura) => {
  return (
    autoCompleteMetadata.byJefatura[jefatura] || {
      seriesComunes: [],
      codigosFrec: [],
      vigenciaDefault: "5 años",
      valorDocumental: "administrativo",
      destinoFinal: "baja_documental",
      soporteDefault: "electronico",
    }
  );
};

// Función para obtener metadatos por tipo de documento
export const getMetadatosPorTipo = (tipoDocumento) => {
  return (
    autoCompleteMetadata.tiposDocumento[tipoDocumento] || {
      valorDocumental: "administrativo",
      plazoConservacion: "5 años",
      destinoFinal: "baja_documental",
    }
  );
};

// Función para generar nomenclatura sugerida
export const generarNomenclaturaSugerida = (tipoDocumento, metadata = {}) => {
  const pattern = autoCompleteMetadata.nomenclaturaPatterns[tipoDocumento];
  if (!pattern) return "";

  const fecha = new Date().toISOString().split("T")[0].replace(/-/g, "");
  const año = new Date().getFullYear();

  return pattern
    .replace("[FECHA]", fecha)
    .replace("[AÑO]", año.toString())
    .replace("[NUMERO]", "001") // Placeholder
    .replace("[TIPO]", metadata.subtipo || "GENERAL")
    .replace("[PROVEEDOR]", metadata.proveedor || "PROVEEDOR")
    .replace("[DESTINATARIO]", metadata.destinatario || "DEST")
    .replace("[PERIODO]", metadata.periodo || "MENSUAL")
    .replace("[AREA]", metadata.area || "AREA")
    .replace("[CODIGO]", metadata.codigo || "COD")
    .replace("[NOMBRE]", metadata.nombre || "PROYECTO");
};

// Validadores en tiempo real
export const validadores = {
  codigoClasificacion: (codigo) => {
    const pattern = /^\d{3}\.\d{3}$/;
    return {
      valido: pattern.test(codigo),
      mensaje: pattern.test(codigo)
        ? "✅ Código válido"
        : "❌ Formato: 000.000 (ej: 001.001)",
    };
  },

  folioDocumento: (folio) => {
    const pattern = /^[A-Z0-9\-\/]+$/;
    return {
      valido: pattern.test(folio),
      mensaje: pattern.test(folio)
        ? "✅ Folio válido"
        : "❌ Solo letras mayúsculas, números y guiones",
    };
  },

  nombreArchivo: (nombre) => {
    const pattern = /^[A-Za-z0-9_\-\s]+$/;
    const longitud = nombre.length >= 5 && nombre.length <= 100;
    return {
      valido: pattern.test(nombre) && longitud,
      mensaje:
        pattern.test(nombre) && longitud
          ? "✅ Nombre válido"
          : "❌ 5-100 caracteres, sin caracteres especiales",
    };
  },
};

export default autoCompleteMetadata;
