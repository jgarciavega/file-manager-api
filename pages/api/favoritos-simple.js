// API SIMPLIFICADA PARA FAVORITOS
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { usuario_id } = req.query;
      
      console.log('⭐ API FAVORITOS - usuario_id recibido:', usuario_id);

      if (!usuario_id) {
        return res.status(400).json({ error: 'usuario_id requerido' });
      }

      // Buscar favoritos del usuario
      const favoritos = await prisma.favoritos.findMany({
        where: {
          usuario_id: Number(usuario_id)
        },
        include: {
          documento: {
            include: {
              usuarios: {
                select: {
                  nombre: true,
                  apellidos: true
                }
              },
              tipos_documentos: {
                select: {
                  tipo: true
                }
              }
            }
          }
        },
        orderBy: {
          fecha: 'desc'
        }
      });

      console.log(`⭐ Favoritos encontrados para usuario ${usuario_id}:`, favoritos.length);

      // Formatear respuesta
      const favoritosFormateados = favoritos.map(fav => ({
        id: fav.documento.id,
        nombre: fav.documento.nombre,
        descripcion: fav.documento.descripcion,
        fecha_subida: fav.documento.fecha_subida,
        mime: fav.documento.mime,
        ruta: fav.documento.ruta,
        status: fav.documento.status,
        responsable: `${fav.documento.usuarios?.nombre || ''} ${fav.documento.usuarios?.apellidos || ''}`.trim(),
        tipo: fav.documento.tipos_documentos?.tipo || 'Sin clasificar',
        fecha_favorito: fav.fecha,
        favorito_id: fav.id
      }));

      return res.status(200).json(favoritosFormateados);
    }

    if (req.method === 'POST') {
      const { usuario_id, documento_id } = req.body;

      if (!usuario_id || !documento_id) {
        return res.status(400).json({ error: 'usuario_id y documento_id requeridos' });
      }

      // Verificar si ya existe
      const existente = await prisma.favoritos.findFirst({
        where: {
          usuario_id: Number(usuario_id),
          documento_id: Number(documento_id)
        }
      });

      if (existente) {
        return res.status(400).json({ error: 'El documento ya está en favoritos' });
      }

      // Crear favorito
      const nuevoFavorito = await prisma.favoritos.create({
        data: {
          usuario_id: Number(usuario_id),
          documento_id: Number(documento_id),
          fecha: new Date()
        }
      });

      return res.status(201).json({ success: true, favorito: nuevoFavorito });
    }

    if (req.method === 'DELETE') {
      const { usuario_id, documento_id } = req.body;

      if (!usuario_id || !documento_id) {
        return res.status(400).json({ error: 'usuario_id y documento_id requeridos' });
      }

      // Eliminar favorito
      await prisma.favoritos.deleteMany({
        where: {
          usuario_id: Number(usuario_id),
          documento_id: Number(documento_id)
        }
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('❌ ERROR en API favoritos-simple:', error);
    return res.status(500).json({ 
      error: 'Error del servidor', 
      detalle: error.message 
    });
  } finally {
    await prisma.$disconnect();
  }
}
