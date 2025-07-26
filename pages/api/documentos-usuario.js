// API SIMPLIFICADA PARA DOCUMENTOS DEL USUARIO
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { usuario_id } = req.query;
    
    console.log('📋 API DOCUMENTOS-USUARIO - usuario_id recibido:', usuario_id);

    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id requerido' });
    }

    // Buscar documentos del usuario específico
    const documentos = await prisma.documentos.findMany({
      where: {
        usuarios_id: Number(usuario_id)
      },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true
          }
        },
        tipos_documentos: {
          select: {
            id: true,
            tipo: true
          }
        }
      },
      orderBy: {
        fecha_subida: 'desc'
      }
    });

    console.log(`📋 Documentos encontrados para usuario ${usuario_id}:`, documentos.length);

    // Formatear respuesta
    const documentosFormateados = documentos.map(doc => ({
      id: doc.id,
      nombre: doc.nombre,
      descripcion: doc.descripcion,
      fecha_subida: doc.fecha_subida,
      mime: doc.mime,
      ruta: doc.ruta,
      status: doc.status,
      responsable: `${doc.usuarios?.nombre || ''} ${doc.usuarios?.apellidos || ''}`.trim(),
      tipo: doc.tipos_documentos?.tipo || 'Sin clasificar',
      usuario_id: doc.usuarios_id,
      tipo_documento_id: doc.tipos_documentos_id
    }));

    return res.status(200).json(documentosFormateados);

  } catch (error) {
    console.error('❌ ERROR en API documentos-usuario:', error);
    return res.status(500).json({ 
      error: 'Error del servidor', 
      detalle: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
