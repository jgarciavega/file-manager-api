// pages/api/documentos/index.js

import { PrismaClient } from '@prisma/client'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

/**
 * 1️⃣ Desactivamos el bodyParser nativo de Next
 *    para poder procesar multipart/form-data con formidable
 */
export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // ————————————————————— GET —————————————————————
  if (req.method === 'GET') {
    try {
      // Filtrado opcional por usuario
      const where = {}
      if (req.query.usuarioId) {
        where.usuarios_id = Number(req.query.usuarioId)
      }

      const documentos = await prisma.documentos.findMany({
        where,
        include: {
          tipos_documentos: true,
          usuarios: {
            select: { id: true, nombre: true, email: true },
          },
        },
        orderBy: { fecha_subida: 'desc' },
      })

      return res.status(200).json(documentos)
    } catch (error) {
      console.error('Error en GET /api/documentos:', error)
      return res.status(500).json({ error: 'Fallo al consultar documentos' })
    } finally {
      await prisma.$disconnect()
    }
  }

  // ————————————————————— POST —————————————————————//
  if (req.method === 'POST') {
    /**
     * 2️⃣ Ensure upload directory exists and configure formidable
     *    to save files in public/uploads keeping extensions.
     */
    const uploadDir = path.join(process.cwd(), '/public/uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
        console.log('Created upload dir:', uploadDir);
      }
    } catch (mkdirErr) {
      console.error('Error creating upload dir:', mkdirErr);
      return res.status(500).json({ error: 'Error preparando directorio de subida', details: mkdirErr.message });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // límite: 10MB
    })

    // 3️⃣ Parseamos la petición
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error formidable:', err)
        return res.status(500).json({ error: 'Error procesando archivo', details: err.message })
      }

      // Debug: log parsed fields and file keys
      try {
        console.log('POST /api/documentos parsed fields:', fields);
        console.log('POST /api/documentos parsed files keys:', Object.keys(files || {}));
      } catch (logErr) {
        console.warn('Error logging parse results:', logErr);
      }

      // 4️⃣ Extraemos campos y archivo. Accept multiple possible file field names.
      const { nombre, descripcion, tipos_documentos_id, usuarios_id } = fields
  // Priorizar 'file' como campo principal (compatibilidad Postman y frontend)
  const file = files.file || files.archivo || files.ruta || Object.values(files || {})[0];
      if (!file) {
        return res.status(400).json({ error: 'Falta el archivo', availableFileKeys: Object.keys(files || {}) })
      }

      // If debug mode is set, return the parsed fields and file metadata without saving to DB
      if (req.query?.debug === 'true') {
        const fileMeta = {
          originalFilename: file.originalFilename || file.name || file.newFilename || null,
          filepath: file.filepath || file.path || null,
          size: file.size || null,
          mimetype: file.mimetype || file.type || null,
        };
        return res.status(200).json({ debug: true, fields, fileMeta, availableFileKeys: Object.keys(files || {}) });
      }

      // 5️⃣ Generamos la URL pública (next sirve static files desde /public)
      const fileName = path.basename(file.filepath)
      const ruta = `/uploads/${fileName}`

      try {
        // 6️⃣ Guardamos en la BD
        const mime = file.mimetype || file.type || '';
        const nuevo = await prisma.documentos.create({
          data: {
            nombre,
            descripcion,
            mime,
            ruta,
            tipos_documentos_id: tipos_documentos_id ? parseInt(tipos_documentos_id, 10) : null,
            usuarios_id: usuarios_id ? parseInt(usuarios_id, 10) : null,
            fecha_subida: new Date(),
          },
        })
        return res.status(201).json(nuevo)
      } catch (e) {
        console.error('Error al guardar en BD:', e)
        return res.status(500).json({ error: 'Error guardando en BD', details: e.message })
      } finally {
        await prisma.$disconnect()
      }
    })

    return // importante: no continuar tras parse()
  }

  // ————— Si es otro método, lo bloqueamos —————
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
