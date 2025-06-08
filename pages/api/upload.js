// pages/api/upload.js

import { IncomingForm, File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

// Importante: deshabilitar el bodyParser de Next.js para multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Método ${req.method} no permitido`)
  }

  // 1️⃣ Asegúrate de que exista la carpeta public/uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.promises.mkdir(uploadDir, { recursive: true })

  // 2️⃣ Configura formidable 
  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
    multiples: false,
  })

  // 3️⃣ Parsear el formulario
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parseando formulario:', err)
      return res.status(500).json({ error: 'Error al procesar el formulario' })
    }

    // 4️⃣ Extraer valores de fields (pueden venir como array[])
    const nombreRaw = fields.nombre
    const originRaw = fields.origin
    const classificationRaw = fields.classification
    const jefaturaRaw = fields.jefatura
    const reviewRaw = fields.review
    const usuarioIdRaw = fields.usuarioId

    const nombre = Array.isArray(nombreRaw) ? nombreRaw[0] : nombreRaw || ''
    const origin = Array.isArray(originRaw) ? originRaw[0] : originRaw || ''
    const classification = Array.isArray(classificationRaw)
      ? classificationRaw[0]
      : classificationRaw || ''
    const jefatura = Array.isArray(jefaturaRaw) ? jefaturaRaw[0] : jefaturaRaw || ''
    const review = Array.isArray(reviewRaw) ? reviewRaw[0] : reviewRaw || ''
    const usuarioId = Number(Array.isArray(usuarioIdRaw) ? usuarioIdRaw[0] : usuarioIdRaw) || 1

    // 5️⃣ Obtener el archivo subido
    // Con formidable@3.x, files.file puede ser un objeto PersistentFile o un array
    let uploadedFile
    if (Array.isArray(files.file)) {
      uploadedFile = files.file[0]
    } else {
      uploadedFile = files.file
    }

    if (!uploadedFile) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }

    // 6️⃣ Determinar el nombre final en disco y la ruta pública
    // - En formidable@3.x, la propiedad es `uploadedFile.filepath` y el nombre generado en disco está en `uploadedFile.newFilename`.
    const finalFilename = uploadedFile.newFilename || path.basename(uploadedFile.filepath)
    const savedPath = `/uploads/${finalFilename}`

    try {
      // 7️⃣ Insertar el registro en la base de datos
      const documento = await prisma.documentos.create({
        data: {
          nombre:       nombre || uploadedFile.originalFilename || finalFilename,
          descripcion:  review,
          mime:         uploadedFile.mimetype,
          ruta:         savedPath,
          tipos_documentos_id: 1,         // Ajusta según tu lógica real
          usuarios_id:         usuarioId, // Viene del formulario (o de la sesión)
          fecha_subida:        new Date(),
        },
      })

      // 8️⃣ Responder al front
      return res.status(200).json({ documento })
    } catch (dbErr) {
      console.error('Error guardando en BD:', dbErr)
      return res.status(500).json({ error: 'No se pudo guardar en la base de datos' })
    } finally {
      await prisma.$disconnect()
    }
  })
}
