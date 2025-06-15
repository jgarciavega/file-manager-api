import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PATCH') {
    const { status } = req.body
    try {
      const updated = await prisma.documentos.update({
        where: { id: Number(id) },
        data: { status },
      })
      return res.status(200).json(updated)
    } catch (error) {
      return res.status(500).json({ error: 'No se pudo actualizar el estado' })
    } finally {
      await prisma.$disconnect()
    }
  }

  res.setHeader('Allow', ['PATCH'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}