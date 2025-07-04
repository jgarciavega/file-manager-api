import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Obtener documentos favoritos de un usuario con toda la información
      const { usuario_id } = req.query;
      if (!usuario_id) return res.status(400).json({ error: 'usuario_id requerido' });

      const favoritos = await prisma.favoritos.findMany({
        where: { usuario_id: Number(usuario_id) },
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
        }
      });

      // Transformar los datos para el frontend
      const documentosFavoritos = favoritos.map(fav => ({
        id: fav.documento.id,
        nombre: fav.documento.nombre,
        descripcion: fav.documento.descripcion,
        fecha_subida: fav.documento.fecha_subida,
        responsable: `${fav.documento.usuarios?.nombre || ''} ${fav.documento.usuarios?.apellidos || ''}`.trim(),
        tipo: fav.documento.tipos_documentos?.tipo || 'Sin clasificar',
        mime: fav.documento.mime,
        ruta: fav.documento.ruta,
        fecha_favorito: fav.fecha
      }));

      return res.status(200).json(documentosFavoritos);
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error("ERROR FAVORITOS DOCUMENTOS:", error);
    res.status(500).json({ error: 'Error en el servidor', detalle: error.message });
  }
} 