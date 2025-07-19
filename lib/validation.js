// lib/validation.js
import { z } from "zod";

// Esquemas de validación
export const userSchema = z.object({
  email: z
    .string()
    .email("Formato de correo electrónico inválido")
    .min(5, "El correo debe tener al menos 5 caracteres")
    .max(100, "El correo no puede exceder 100 caracteres"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(128, "La contraseña no puede exceder 128 caracteres"),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
  role: z.enum(["admin", "revisor", "capturista"], {
    errorMap: () => ({
      message: "Rol inválido. Debe ser admin, revisor o capturista",
    }),
  }),
});

export const documentSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del documento es obligatorio")
    .max(255, "El nombre no puede exceder 255 caracteres")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s._-]+$/,
      "Nombre de archivo contiene caracteres inválidos"
    ),
  descripcion: z
    .string()
    .max(1000, "La descripción no puede exceder 1000 caracteres")
    .optional(),
  tipo_documento_id: z
    .number()
    .int("El tipo de documento debe ser un número entero")
    .positive("El tipo de documento debe ser positivo"),
  usuario_id: z
    .number()
    .int("El ID de usuario debe ser un número entero")
    .positive("El ID de usuario debe ser positivo"),
});

export const uploadSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido"),
  codigo_clasificacion: z.string().min(1, "Código de clasificación requerido"),
  serie: z.string().min(1, "Serie documental requerida"),
  valor_documental: z.string().min(1, "Valor documental requerido"),
  plazo_conservacion: z.string().min(1, "Plazo de conservación requerido"),
  destino_final: z.string().min(1, "Destino final requerido"),
  soporte_documental: z.string().min(1, "Soporte documental requerido"),
  procedencia_admin: z.string().min(1, "Procedencia administrativa requerida"),
});

// Función de validación genérica
export function validateInput(schema, data) {
  try {
    const validatedData = schema.parse(data);
    return {
      success: true,
      data: validatedData,
      errors: null,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      };
    }
    return {
      success: false,
      data: null,
      errors: [
        { field: "general", message: "Error de validación desconocido" },
      ],
    };
  }
}

// Sanitización de strings
export function sanitizeString(str) {
  if (typeof str !== "string") return "";

  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

// Validación de tipos MIME permitidos
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

// Validación de archivos
export function validateFile(file) {
  const errors = [];

  // Verificar tipo MIME
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    errors.push(`Tipo de archivo no permitido: ${file.mimetype}`);
  }

  // Verificar tamaño (50MB máximo)
  const MAX_SIZE = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    errors.push(`Archivo demasiado grande. Máximo permitido: 50MB`);
  }

  // Verificar extensión
  const allowedExtensions = [
    ".pdf",
    ".docx",
    ".doc",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".xls",
    ".xlsx",
    ".pptx",
  ];
  const extension = file.originalFilename
    .toLowerCase()
    .substring(file.originalFilename.lastIndexOf("."));
  if (!allowedExtensions.includes(extension)) {
    errors.push(`Extensión de archivo no permitida: ${extension}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Validación de ID numérico
export function validateId(id) {
  const parsed = parseInt(id);
  if (isNaN(parsed) || parsed <= 0) {
    return { isValid: false, error: "ID debe ser un número positivo" };
  }
  return { isValid: true, id: parsed };
}
