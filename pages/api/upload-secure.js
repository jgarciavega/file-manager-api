// pages/api/upload-secure.js
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../lib/auth-utils";
import {
  validateFile,
  validateInput,
  uploadSchema,
} from "../../lib/validation";

// Configuración de Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

// Configuración segura de archivos
const UPLOAD_CONFIG = {
  maxFileSize: 50 * 1024 * 1024, // 50 MB
  allowedMimeTypes: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  allowedExtensions: [
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
  ],
};

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      error: "Método no permitido",
      allowedMethods: ["POST"],
    });
  }

  // Verificar autenticación
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user } = authResult;

  try {
    // Crear directorio seguro si no existe
    const uploadDir = path.join(process.cwd(), "private", "uploads");
    await fs.promises.mkdir(uploadDir, { recursive: true });

    // Configurar formidable con límites de seguridad
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
      multiples: false,
      maxFileSize: UPLOAD_CONFIG.maxFileSize,
      maxFieldsSize: 10 * 1024 * 1024, // 10MB para campos
      maxFields: 50,
      filename: (name, ext, part, form) => {
        // Generar nombre seguro
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 15);
        return `${timestamp}_${randomSuffix}${ext}`;
      },
    });

    // Procesar formulario
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("❌ Error parseando formulario:", err);
        return res.status(400).json({
          error: "Error al procesar el formulario",
          details:
            process.env.NODE_ENV === "development" ? err.message : undefined,
        });
      }

      try {
        // Función helper para extraer valores
        const getValue = (field) => {
          if (Array.isArray(field)) {
            return field[0] || "";
          }
          return field || "";
        };

        // Extraer y validar campos del formulario
        const formData = {
          nombre: getValue(fields.nombre),
          codigo_clasificacion: getValue(fields.codigo_clasificacion),
          serie: getValue(fields.serie),
          valor_documental: getValue(fields.valor_documental),
          plazo_conservacion: getValue(fields.plazo_conservacion),
          destino_final: getValue(fields.destino_final),
          soporte_documental: getValue(fields.soporte_documental),
          procedencia_admin: getValue(fields.procedencia_admin),
          descripcion: getValue(fields.descripcion) || null,
        };

        // Validar datos del formulario
        const validation = validateInput(uploadSchema, formData);
        if (!validation.success) {
          return res.status(400).json({
            error: "Datos del formulario inválidos",
            validationErrors: validation.errors,
          });
        }

        // Verificar archivo
        let uploadedFile = Array.isArray(files.file)
          ? files.file[0]
          : files.file;
        if (!uploadedFile) {
          return res.status(400).json({
            error: "No se recibió ningún archivo",
          });
        }

        // Validar archivo
        const fileValidation = validateFile(uploadedFile);
        if (!fileValidation.isValid) {
          // Eliminar archivo si la validación falla
          try {
            await fs.promises.unlink(uploadedFile.filepath);
          } catch (unlinkErr) {
            console.error("Error eliminando archivo inválido:", unlinkErr);
          }

          return res.status(400).json({
            error: "Archivo no válido",
            fileErrors: fileValidation.errors,
          });
        }

        // Verificar que el archivo existe físicamente
        try {
          await fs.promises.access(uploadedFile.filepath, fs.constants.F_OK);
          const fileStats = await fs.promises.stat(uploadedFile.filepath);

          console.log(`📁 Archivo procesado: ${uploadedFile.originalFilename}`);
          console.log(`📊 Tamaño: ${fileStats.size} bytes`);
          console.log(`🗂️ Tipo MIME: ${uploadedFile.mimetype}`);
        } catch (fileErr) {
          console.error("❌ Archivo no existe tras la subida:", fileErr);
          return res.status(500).json({
            error: "Error al procesar el archivo",
          });
        }

        // Generar ruta relativa segura
        const filename = path.basename(uploadedFile.filepath);
        const relativePath = `/uploads/${filename}`;

        // Guardar en base de datos con transacción
        const documento = await prisma.$transaction(async (tx) => {
          const doc = await tx.documentos.create({
            data: {
              nombre:
                formData.nombre || uploadedFile.originalFilename || filename,
              descripcion: formData.descripcion,
              mime: uploadedFile.mimetype || "application/octet-stream",
              ruta: relativePath,
              tipos_documentos_id: 1, // Valor por defecto
              usuarios_id: user.id,
              fecha_subida: new Date(),
              // Campos específicos LEA-BCS
              codigo_clasificacion: formData.codigo_clasificacion,
              serie: formData.serie,
              valor_documental: formData.valor_documental,
              plazo_conservacion: formData.plazo_conservacion,
              destino_final: formData.destino_final,
              soporte_documental: formData.soporte_documental,
              procedencia_admin: formData.procedencia_admin,
              estado_validacion: "Pendiente",
            },
          });

          // Registrar en bitácora
          await tx.bitacora.create({
            data: {
              accion: "SUBIDA_DOCUMENTO",
              documento_id: doc.id,
              usuario_id: user.id,
              descripcion: `Documento "${doc.nombre}" subido por ${user.name}`,
              fecha: new Date(),
              ip_address:
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                "unknown",
            },
          });

          return doc;
        });

        console.log(`✅ Documento guardado exitosamente - ID: ${documento.id}`);

        // Respuesta exitosa
        return res.status(201).json({
          success: true,
          documento: {
            id: documento.id,
            nombre: documento.nombre,
            fecha_subida: documento.fecha_subida,
            estado_validacion: documento.estado_validacion,
          },
          message: "Documento subido y registrado exitosamente",
        });
      } catch (dbErr) {
        console.error("❌ Error guardando en BD:", dbErr);

        // Limpiar archivo si hay error en BD
        try {
          if (files.file) {
            const fileToDelete = Array.isArray(files.file)
              ? files.file[0]
              : files.file;
            await fs.promises.unlink(fileToDelete.filepath);
          }
        } catch (cleanupErr) {
          console.error(
            "Error limpiando archivo tras error de BD:",
            cleanupErr
          );
        }

        return res.status(500).json({
          error: "Error interno del servidor",
          details:
            process.env.NODE_ENV === "development" ? dbErr.message : undefined,
        });
      }
    });
  } catch (error) {
    console.error("❌ Error general en upload:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
