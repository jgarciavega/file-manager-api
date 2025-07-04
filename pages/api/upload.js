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

  // Crear directorio si no existe
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  // Configuración del formulario
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    multiples: false,
    maxFileSize: 100 * 1024 * 1024, // 100 MB
  });

  // Procesar el formulario
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parseando formulario:', err);
      return res.status(500).json({ error: 'Error al procesar el formulario' });
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
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // Obtener información del archivo
    const finalFilename = uploadedFile.newFilename || path.basename(uploadedFile.filepath);
    const savedPath = `/uploads/${finalFilename}`;

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
        documento,
        message: 'Documento subido exitosamente'
      });
    } catch (dbErr) {
      console.error('Error guardando en BD:', dbErr);
      return res.status(500).json({
        error: 'No se pudo guardar en la base de datos',
        details: dbErr.message
      });
    }
  });
}