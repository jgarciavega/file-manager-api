// pages/api/usuarios/[id].js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    const { rol } = req.body
    if (!rol) {
      return res.status(400).json({ error: 'Falta el campo rol' })
    }
    try {
      // 1️⃣ Buscar rol
      const r = await prisma.roles.findFirst({ where: { tipo: rol } })
      if (!r) return res.status(404).json({ error: 'Rol no existe' })

      // 2️⃣ Eliminar asignaciones anteriores
      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: Number(id) }
      })
      // 3️⃣ Crear nueva asignación
      await prisma.usuarios_has_roles.create({
        data: {
          usuarios_id: Number(id),
          roles_id: r.id
        }
      })
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'Error al actualizar rol' })
    } finally {
      await prisma.$disconnect()
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Borra relaciones y luego el usuario
      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: Number(id) }
      })
      await prisma.usuarios.delete({
        where: { id: Number(id) }
      })
      return res.status(200).json({ success: true })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: 'No se pudo eliminar usuario' })
    } finally {
      await prisma.$disconnect()
    }
  }

  res.setHeader('Allow', ['PUT','DELETE'])
  return res.status(405).end(`Method ${req.method} Not Allowed`)
}
