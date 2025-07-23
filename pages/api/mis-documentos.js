import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id es requerido' });
    }

    // Obtener documentos del usuario
    const documentos = await prisma.documentos.findMany({
      where: {
        usuarios_id: parseInt(usuario_id)
      },
      include: {
        tipos_documentos: true,
        usuarios: true
      },
      orderBy: {
        fecha_subida: 'desc'
      }
    });

    console.log(`📄 Documentos encontrados para usuario ${usuario_id}:`, documentos.length);

    res.status(200).json({
      success: true,
      documentos: documentos,
      total: documentos.length
    });

  } catch (error) {
    console.error('ERROR DOCUMENTOS:', error);
    res.status(500).json({ 
      error: 'Error al obtener documentos',
      details: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
