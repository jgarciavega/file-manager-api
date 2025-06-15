// pages/api/upload.js

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

  // 📁 Crear directorio si no existe
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.promises.mkdir(uploadDir, { recursive: true });

  // 📌 Configuración del formulario
  const form = new IncomingForm();
  form.uploadDir = uploadDir;
  form.keepExtensions = true;
  form.multiples = false;
  form.maxFileSize = 50 * 1024 * 1024; // 50 MB

  // 🛑 Verificar tamaño antes de procesar el archivo
  form.on('part', (part) => {
    if (part.byteCount > form.maxFileSize) {
      return res.status(413).json({ error: 'Archivo demasiado grande' });
    }
  });

  // 📤 Procesar el formulario
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parseando formulario:', err);
      return res.status(500).json({ error: 'Error al procesar el formulario' });
    }

    // 📌 Obtener valores del formulario
    const nombre = fields.nombre?.[0] || '';
    const review = fields.review?.[0] || '';
    const usuarioId = Number(fields.usuarioId?.[0]) || 1;

    // 📁 Verificar si el archivo se recibió
    let uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }

    // 🖼️ Obtener información del archivo
    const finalFilename = uploadedFile.newFilename || path.basename(uploadedFile.filepath);
    const savedPath = `/uploads/${finalFilename}`;

    try {
      // 🗄️ Guardar en la base de datos
      const documento = await prisma.documentos.create({
        data: {
          nombre: nombre || uploadedFile.originalFilename || finalFilename,
          descripcion: review,
          mime: uploadedFile.mimetype,
          ruta: savedPath,
          tipos_documentos_id: 1,
          usuarios_id: usuarioId,
          fecha_subida: new Date(),
        },
      });

      // ✅ Responder al frontend
      return res.status(200).json({ documento });
    } catch (dbErr) {
      console.error('Error guardando en BD:', dbErr);
      return res.status(500).json({ error: 'No se pudo guardar en la base de datos' });
    } finally {
      await prisma.$disconnect();
    }
  });
}
