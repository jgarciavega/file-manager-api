// Sistema de Templates Inteligentes para Capturistas
// Proporciona plantillas pre-configuradas y personalizables

const TEMPLATES_PREDEFINIDAS = {
  // Templates por Jefatura - Recursos Humanos
  recursos_humanos: {
    expediente_personal: {
      nombre: "Expediente de Personal",
      descripcion: "Plantilla para expedientes de empleados",
      metadatos: {
        serie: "Expedientes de Personal",
        subserie: "Empleados Activos",
        codigo: "004.001",
        vigencia: "5 años",
        valorDocumental: "administrativo",
        nivelAcceso: "confidencial",
        soporte: "digital",
        plazoConservacion: 5,
      },
      camposObligatorios: ["nombre", "numeroEmpleado", "fecha_ingreso"],
      sugerenciasAdicionales: {
        observaciones: "Expediente conforme a Ley Federal del Trabajo",
        ubicacion: "Archivo de Concentración - RH",
      },
    },
    nomina: {
      nombre: "Nómina Quincenal",
      descripcion: "Plantilla para documentos de nómina",
      metadatos: {
        serie: "Nóminas",
        subserie: "Nómina Quincenal",
        codigo: "004.002",
        vigencia: "7 años",
        valorDocumental: "fiscal",
        nivelAcceso: "confidencial",
        soporte: "digital",
        plazoConservacion: 7,
      },
      camposObligatorios: ["periodo", "total_empleados", "monto_total"],
      sugerenciasAdicionales: {
        observaciones: "Documento fiscal - Conservar según normativa",
        ubicacion: "Archivo de Concentración - Fiscal",
      },
    },
    contrato: {
      nombre: "Contrato Laboral",
      descripcion: "Plantilla para contratos de trabajo",
      metadatos: {
        serie: "Contratos",
        subserie: "Contratos de Trabajo",
        codigo: "004.003",
        vigencia: "Permanente",
        valorDocumental: "legal",
        nivelAcceso: "confidencial",
        soporte: "digital",
        plazoConservacion: "permanente",
      },
      camposObligatorios: ["nombre_empleado", "puesto", "fecha_inicio"],
      sugerenciasAdicionales: {
        observaciones: "Contrato conforme a normativa laboral vigente",
        ubicacion: "Archivo Histórico",
      },
    },
  },

  // Templates por Jefatura - Finanzas
  finanzas: {
    factura: {
      nombre: "Factura de Proveedor",
      descripcion: "Plantilla para facturas recibidas",
      metadatos: {
        serie: "Facturas",
        subserie: "Facturas de Proveedores",
        codigo: "005.001",
        vigencia: "7 años",
        valorDocumental: "fiscal",
        nivelAcceso: "reservado",
        soporte: "digital",
        plazoConservacion: 7,
      },
      camposObligatorios: [
        "numero_factura",
        "proveedor",
        "monto",
        "fecha_factura",
      ],
      sugerenciasAdicionales: {
        observaciones: "Factura para efectos fiscales y contables",
        ubicacion: "Archivo de Concentración - Finanzas",
      },
    },
    presupuesto: {
      nombre: "Presupuesto Anual",
      descripcion: "Plantilla para documentos presupuestales",
      metadatos: {
        serie: "Presupuestos",
        subserie: "Presupuesto Anual",
        codigo: "005.002",
        vigencia: "10 años",
        valorDocumental: "administrativo",
        nivelAcceso: "publico",
        soporte: "digital",
        plazoConservacion: 10,
      },
      camposObligatorios: [
        "ejercicio_fiscal",
        "area_responsable",
        "monto_asignado",
      ],
      sugerenciasAdicionales: {
        observaciones: "Presupuesto autorizado conforme a normativa",
        ubicacion: "Archivo de Concentración",
      },
    },
    estado_financiero: {
      nombre: "Estado Financiero",
      descripcion: "Plantilla para estados financieros",
      metadatos: {
        serie: "Estados Financieros",
        subserie: "Estados Mensuales",
        codigo: "005.003",
        vigencia: "10 años",
        valorDocumental: "fiscal",
        nivelAcceso: "publico",
        soporte: "digital",
        plazoConservacion: 10,
      },
      camposObligatorios: ["periodo", "tipo_estado", "elaborado_por"],
      sugerenciasAdicionales: {
        observaciones: "Estado financiero conforme a principios contables",
        ubicacion: "Archivo Histórico",
      },
    },
  },

  // Templates por Jefatura - Administración
  administracion: {
    oficio: {
      nombre: "Oficio Oficial",
      descripcion: "Plantilla para oficios internos y externos",
      metadatos: {
        serie: "Correspondencia",
        subserie: "Oficios",
        codigo: "001.001",
        vigencia: "3 años",
        valorDocumental: "administrativo",
        nivelAcceso: "publico",
        soporte: "digital",
        plazoConservacion: 3,
      },
      camposObligatorios: ["numero_oficio", "destinatario", "asunto"],
      sugerenciasAdicionales: {
        observaciones: "Oficio conforme a manual de correspondencia",
        ubicacion: "Archivo de Trámite",
      },
    },
    convenio: {
      nombre: "Convenio Institucional",
      descripcion: "Plantilla para convenios y acuerdos",
      metadatos: {
        serie: "Convenios",
        subserie: "Convenios Interinstitucionales",
        codigo: "002.001",
        vigencia: "Permanente",
        valorDocumental: "legal",
        nivelAcceso: "publico",
        soporte: "digital",
        plazoConservacion: "permanente",
      },
      camposObligatorios: [
        "institucion_contraparte",
        "objeto_convenio",
        "vigencia_convenio",
      ],
      sugerenciasAdicionales: {
        observaciones: "Convenio con valor legal permanente",
        ubicacion: "Archivo Histórico",
      },
    },
  },

  // Templates por Jefatura - Operaciones Portuarias
  operaciones: {
    bitacora_operaciones: {
      nombre: "Bitácora de Operaciones",
      descripcion: "Plantilla para registro de operaciones portuarias",
      metadatos: {
        serie: "Bitácoras",
        subserie: "Operaciones Portuarias",
        codigo: "008.001",
        vigencia: "5 años",
        valorDocumental: "administrativo",
        nivelAcceso: "reservado",
        soporte: "digital",
        plazoConservacion: 5,
      },
      camposObligatorios: ["fecha_operacion", "tipo_operacion", "embarcacion"],
      sugerenciasAdicionales: {
        observaciones: "Registro de operaciones conforme a normativa portuaria",
        ubicacion: "Archivo de Concentración - Operaciones",
      },
    },
    manifiesto_carga: {
      nombre: "Manifiesto de Carga",
      descripcion: "Plantilla para manifiestos de carga",
      metadatos: {
        serie: "Manifiestos",
        subserie: "Manifiestos de Carga",
        codigo: "008.002",
        vigencia: "7 años",
        valorDocumental: "legal",
        nivelAcceso: "reservado",
        soporte: "digital",
        plazoConservacion: 7,
      },
      camposObligatorios: ["numero_manifiesto", "embarcacion", "puerto_origen"],
      sugerenciasAdicionales: {
        observaciones: "Manifiesto con valor legal y aduanal",
        ubicacion: "Archivo de Concentración",
      },
    },
  },

  // Templates por Jefatura - Sistemas/IT
  sistemas: {
    ticket_soporte: {
      nombre: "Ticket de Soporte",
      descripcion: "Plantilla para tickets de soporte técnico",
      metadatos: {
        serie: "Soporte Técnico",
        subserie: "Tickets de Incidencias",
        codigo: "011.001",
        vigencia: "2 años",
        valorDocumental: "administrativo",
        nivelAcceso: "reservado",
        soporte: "digital",
        plazoConservacion: 2,
      },
      camposObligatorios: ["usuario_afectado", "tipo_incidencia", "prioridad"],
      sugerenciasAdicionales: {
        observaciones: "Ticket de soporte conforme a procedimientos IT",
        ubicacion: "Archivo de Trámite - Sistemas",
      },
    },
    manual_sistema: {
      nombre: "Manual de Sistema",
      descripcion: "Plantilla para documentación de sistemas",
      metadatos: {
        serie: "Documentación Técnica",
        subserie: "Manuales de Sistema",
        codigo: "011.002",
        vigencia: "5 años",
        valorDocumental: "administrativo",
        nivelAcceso: "publico",
        soporte: "digital",
        plazoConservacion: 5,
      },
      camposObligatorios: ["sistema", "version", "responsable_tecnico"],
      sugerenciasAdicionales: {
        observaciones: "Manual técnico para usuarios y administradores",
        ubicacion: "Archivo de Concentración - IT",
      },
    },
    respaldo_datos: {
      nombre: "Respaldo de Datos",
      descripcion: "Plantilla para registros de respaldos",
      metadatos: {
        serie: "Respaldos",
        subserie: "Respaldos Diarios",
        codigo: "011.003",
        vigencia: "3 años",
        valorDocumental: "administrativo",
        nivelAcceso: "confidencial",
        soporte: "digital",
        plazoConservacion: 3,
      },
      camposObligatorios: ["fecha_respaldo", "sistema_origen", "tamaño_backup"],
      sugerenciasAdicionales: {
        observaciones: "Registro de respaldo conforme a políticas de seguridad",
        ubicacion: "Archivo de Concentración - Seguridad",
      },
    },
  },
};

// Funciones para gestión de templates
const TemplateManager = {
  // Obtener templates por jefatura
  getTemplatesByJefatura: (jefatura) => {
    if (!jefatura) return {};

    // Mapeo específico para nombres comunes
    const mapeoJefaturas = {
      "recursos humanos": "recursos_humanos",
      rh: "recursos_humanos",
      finanzas: "finanzas",
      administracion: "administracion",
      administración: "administracion",
      operaciones: "operaciones",
      "operaciones portuarias": "operaciones",
      sistemas: "sistemas",
      it: "sistemas",
      informatica: "sistemas",
      informática: "sistemas",
      tecnologia: "sistemas",
      tecnología: "sistemas",
    };

    const jefaturaNormalizada = jefatura.toLowerCase().trim();

    // Buscar mapeo directo
    let jefaturaKey = mapeoJefaturas[jefaturaNormalizada];

    // Si no hay mapeo directo, usar transformación por defecto
    if (!jefaturaKey) {
      jefaturaKey = jefaturaNormalizada.replace(/\s+/g, "_");
    }

    return TEMPLATES_PREDEFINIDAS[jefaturaKey] || {};
  },

  // Obtener template específica
  getTemplate: (jefatura, templateKey) => {
    const templates = TemplateManager.getTemplatesByJefatura(jefatura);
    return templates[templateKey] || null;
  },

  // Aplicar template a formulario
  aplicarTemplate: (templateData, formData = {}) => {
    if (!templateData) return formData;

    const datosCompletos = {
      ...formData,
      ...templateData.metadatos,
      observaciones:
        templateData.sugerenciasAdicionales?.observaciones ||
        formData.observaciones,
      ubicacion:
        templateData.sugerenciasAdicionales?.ubicacion || formData.ubicacion,
    };

    return datosCompletos;
  },

  // Validar campos obligatorios de template
  validarCamposObligatorios: (templateData, formData) => {
    if (!templateData || !templateData.camposObligatorios)
      return { valido: true, faltantes: [] };

    const faltantes = templateData.camposObligatorios.filter((campo) => {
      return !formData[campo] || formData[campo].trim() === "";
    });

    return {
      valido: faltantes.length === 0,
      faltantes,
      mensaje:
        faltantes.length > 0
          ? `Campos obligatorios faltantes: ${faltantes.join(", ")}`
          : "Todos los campos obligatorios están completos",
    };
  },

  // Obtener sugerencias inteligentes
  getSugerenciasInteligentes: (jefatura, tipoDocumento) => {
    const template = TemplateManager.getTemplate(jefatura, tipoDocumento);
    if (!template) return null;

    return {
      metadatos: template.metadatos,
      sugerencias: template.sugerenciasAdicionales,
      camposObligatorios: template.camposObligatorios,
      descripcion: template.descripcion,
    };
  },

  // Crear template personalizada (para implementación futura)
  crearTemplatePersonalizada: (
    usuario,
    nombre,
    metadatos,
    camposObligatorios
  ) => {
    return {
      id: `custom_${Date.now()}`,
      nombre,
      descripcion: `Template personalizada de ${usuario}`,
      metadatos,
      camposObligatorios: camposObligatorios || [],
      tipo: "personalizada",
      creadoPor: usuario,
      fechaCreacion: new Date().toISOString(),
    };
  },

  // Obtener todas las templates disponibles para un usuario
  getTemplatesDisponibles: (jefaturaUsuario) => {
    const templatesJefatura =
      TemplateManager.getTemplatesByJefatura(jefaturaUsuario);
    const templatesList = [];

    Object.keys(templatesJefatura).forEach((key) => {
      const template = templatesJefatura[key];
      templatesList.push({
        key,
        nombre: template.nombre,
        descripcion: template.descripcion,
        categoria: jefaturaUsuario,
        tipo: "predefinida",
      });
    });

    return templatesList;
  },

  // Buscar templates por texto
  buscarTemplates: (texto, jefatura = null) => {
    const todasLasTemplates = jefatura
      ? { [jefatura]: TEMPLATES_PREDEFINIDAS[jefatura] || {} }
      : TEMPLATES_PREDEFINIDAS;

    const resultados = [];
    const textoBusqueda = texto.toLowerCase();

    Object.keys(todasLasTemplates).forEach((jefaturaKey) => {
      const templates = todasLasTemplates[jefaturaKey];
      Object.keys(templates).forEach((templateKey) => {
        const template = templates[templateKey];
        if (
          template.nombre.toLowerCase().includes(textoBusqueda) ||
          template.descripcion.toLowerCase().includes(textoBusqueda) ||
          template.metadatos.serie?.toLowerCase().includes(textoBusqueda)
        ) {
          resultados.push({
            key: templateKey,
            jefatura: jefaturaKey,
            ...template,
          });
        }
      });
    });

    return resultados;
  },
};

export default TemplateManager;
export { TEMPLATES_PREDEFINIDAS };
