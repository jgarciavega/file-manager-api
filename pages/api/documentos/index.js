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
     * 2️⃣ Configuramos formidable para guardar
     *    el archivo en public/uploads manteniendo extensión.
     */
    const form = formidable({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // límite: 10MB
    })

    // 3️⃣ Parseamos la petición
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error formidable:', err)
        return res.status(500).json({ error: 'Error procesando archivo' })
      }

      // 4️⃣ Extraemos campos y archivo
      const { nombre, descripcion, tipos_documentos_id, usuarios_id } = fields
      const file = files.archivo
      if (!file) {
        return res.status(400).json({ error: 'Falta el archivo' })
      }

      // 5️⃣ Generamos la URL pública (next sirve static files desde /public)
      const fileName = path.basename(file.filepath)
      const ruta = `/uploads/${fileName}`

      try {
        // 6️⃣ Guardamos en la BD
        const nuevo = await prisma.documentos.create({
          data: {
            nombre,
            descripcion,
            mime: file.mimetype,
            ruta,
            tipos_documentos_id: parseInt(tipos_documentos_id, 10),
            usuarios_id:       parseInt(usuarios_id, 10),
            fecha_subida:      new Date(),
          },
        })
        return res.status(201).json(nuevo)
      } catch (e) {
        console.error('Error al guardar en BD:', e)
        return res.status(500).json({ error: 'Error guardando en BD' })
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
