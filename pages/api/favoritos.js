import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // Obtener favoritos de un usuario
    const { usuario_id } = req.query;
    if (!usuario_id) return res.status(400).json({ error: 'usuario_id requerido' });

    const favoritos = await prisma.favoritos.findMany({
      where: { usuarios_id: Number(usuario_id) },
      select: { documentos_id: true }
    });
    return res.status(200).json(favoritos.map(f => f.documentos_id));
  }

  if (req.method === 'POST') {
    // Agregar favorito
    const { usuario_id, documentos_id } = req.body;
    if (!usuario_id || !documentos_id) return res.status(400).json({ error: 'Datos requeridos' });

    try {
      await prisma.favoritos.create({
        data: {
          usuarios_id: Number(usuario_id),
          documentos_id: Number(documentos_id)
        }
      });
      return res.status(201).json({ ok: true });
    } catch (e) {
      // Si ya existe, ignora el error de duplicado
      if (e.code === 'P2002') {
        return res.status(200).json({ ok: true, message: 'Ya es favorito' });
      }
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'DELETE') {
    // Eliminar favorito
    const { usuario_id, documentos_id } = req.body;
    if (!usuario_id || !documentos_id) return res.status(400).json({ error: 'Datos requeridos' });

    await prisma.favoritos.deleteMany({
      where: {
        usuarios_id: Number(usuario_id),
        documentos_id: Number(documentos_id)
      }
    });
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Método no permitido' });
}