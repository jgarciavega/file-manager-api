// pages/api/documentos/index.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  try {
    // Si llega ?usuarioId=123, filtramos; si no, devolvemos todo
    const where = {}
    if (req.query.usuarioId) {
      where.usuarios_id = Number(req.query.usuarioId)
    }

    const documentos = await prisma.documentos.findMany({
      where,
      include: {
        tipos_documentos: true,
        usuarios: {
          select: { id: true, nombre: true, email: true }
        }
      },
      orderBy: { fecha_subida: 'desc' }
    })

    return res.status(200).json(documentos)
  } catch (error) {
    console.error('Error en /api/documentos:', error)
    return res.status(500).json({ error: 'Fallo al consultar documentos' })
  } finally {
    await prisma.$disconnect()
  }
}
