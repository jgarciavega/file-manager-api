import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Obtener todos los usuarios
    const usuarios = await prisma.usuarios.findMany();
    
    // Obtener todos los documentos
    const documentos = await prisma.documentos.findMany({
      include: {
        tipos_documentos: true,
        usuarios: true
      }
    });
    
    // Obtener todos los favoritos
    const favoritos = await prisma.favoritos.findMany({
      include: {
        usuario: true,
        documento: true
      }
    });

    res.status(200).json({
      resumen: {
        total_usuarios: usuarios.length,
        total_documentos: documentos.length,
        total_favoritos: favoritos.length
      },
      usuarios: usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        activo: u.activo
      })),
      documentos: documentos.slice(0, 5).map(d => ({
        id: d.id,
        nombre: d.nombre,
        usuario_id: d.usuarios_id,
        usuario_nombre: d.usuarios?.nombre || 'Sin usuario'
      })),
      favoritos: favoritos.map(f => ({
        id: f.id,
        documento_id: f.documento_id,
        usuario_id: f.usuario_id,
        usuario_nombre: f.usuarios?.nombre || 'Sin usuario',
        documento_nombre: f.documentos?.nombre || 'Sin documento'
      }))
    });

  } catch (error) {
    console.error("ERROR DEBUG GENERAL:", error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
}
