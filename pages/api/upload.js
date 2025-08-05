import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Importante: deshabilitar el bodyParser de Next.js para multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Método ${req.method} no permitido`);
  }

  // Log de headers y método
  console.log("HEADERS:", req.headers);
  console.log("Método:", req.method);

  // Crear directorio si no existe
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  // Log de permisos del directorio
  try {
    const dirStats = await fs.promises.stat(uploadDir);
    console.log("Permisos del directorio de subida:", dirStats.mode.toString(8));
  } catch (permErr) {
    console.error("No se pudo obtener permisos del directorio:", permErr);
  }

  // Configuración del formulario
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
    maxFileSize: 300 * 1024 * 1024, // 300 MB
  });

  // Procesar el formulario
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parseando formulario:', err);
      return res.status(500).json({ success: false, error: 'Error al procesar el formulario', details: err.message });
    }

    // LOG para depuración
    console.log("FIELDS:", fields);
    console.log("FILES:", files);

    // Función helper para extraer valores (formidable puede devolver arrays)
    const getValue = (field) => {
      if (Array.isArray(field)) {
        return field[0] || '';
      }
      return field || '';
    };

    // Obtener valores del formulario
    const nombre = getValue(fields.nombre);
    const origin = getValue(fields.origin);
    const classification = getValue(fields.classification);
    const jefatura = getValue(fields.jefatura);
    const review = getValue(fields.review);
    const usuarioId = Number(getValue(fields.usuarioId)) || 1;

    // Verificar si el archivo se recibió
    let uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      console.error("No se recibió archivo");
      return res.status(400).json({ success: false, error: 'No se recibió ningún archivo', debug: { files } });
    }

    // Log explícito del tipo MIME recibido
    console.log("Tipo MIME recibido:", uploadedFile.mimetype);

    // Validar tipo de archivo permitido
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    ];
    if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
      console.error("Tipo de archivo no permitido:", uploadedFile.mimetype);
      return res.status(400).json({
        success: false,
        error: 'Tipo de archivo no permitido',
        allowed: allowedMimeTypes,
        received: uploadedFile.mimetype
      });
    }

    // Log de objeto uploadedFile
    console.log("uploadedFile:", uploadedFile);

    // Obtener información del archivo
    const finalFilename = uploadedFile.newFilename || path.basename(uploadedFile.filepath);
    const savedPath = `/uploads/${finalFilename}`;
    const absolutePath = path.join(uploadDir, finalFilename);

    // Validar existencia física del archivo y permisos
    try {
      await fs.promises.access(absolutePath, fs.constants.F_OK);
      const fileStats = await fs.promises.stat(absolutePath);
      console.log("Archivo guardado físicamente en:", absolutePath);
      console.log("Permisos del archivo:", fileStats.mode.toString(8));
      console.log("Tamaño del archivo:", fileStats.size);
    } catch (fileErr) {
      console.error("El archivo no existe físicamente tras la subida:", absolutePath, fileErr);
      return res.status(500).json({
        success: false,
        error: 'El archivo no se guardó correctamente en el servidor',
        details: fileErr.message,
        debug: { absolutePath, uploadedFile }
      });
    }

    try {
      // Guardar en la base de datos
      const documento = await prisma.documentos.create({
        data: {
          nombre: nombre || uploadedFile.originalFilename || finalFilename,
          descripcion: review || null,
          mime: uploadedFile.mimetype || 'application/octet-stream',
          ruta: savedPath,
          tipos_documentos_id: 1, // Asegúrate de que este ID existe en tu tabla tipos_documentos
          usuarios_id: usuarioId,
          fecha_subida: new Date(),
        },
      });

      console.log("Documento guardado exitosamente:", documento);

      // Responder al frontend
      return res.status(200).json({
        success: true,
        fileUrl: documento.ruta ? documento.ruta : '',
        documento,
        message: 'Documento subido exitosamente'
      });
    } catch (dbErr) {
      console.error('Error guardando en BD:', dbErr);
      return res.status(500).json({
        success: false,
        error: 'No se pudo guardar en la base de datos',
        details: dbErr.message
      });
    }
  });
}