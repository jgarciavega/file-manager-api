import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../lib/auth-utils";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar autenticación
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;

  try {
    if (req.method === "GET") {
      // Los usuarios solo pueden ver sus propios favoritos
      const { usuario_id } = req.query;

      // Si no se especifica usuario_id, usar el del usuario actual
      const targetUserId = usuario_id ? Number(usuario_id) : currentUser.id;

      // Solo admins pueden ver favoritos de otros usuarios
      if (targetUserId !== currentUser.id && currentUser.role !== "admin") {
        return res
          .status(403)
          .json({ error: "No tienes permisos para ver estos favoritos" });
      }

      console.log(
        `📋 Usuario ${currentUser.email} consultando favoritos del usuario ${targetUserId}`
      );

      const favoritos = await prisma.favoritos.findMany({
        where: { usuario_id: targetUserId },
        select: { documento_id: true },
      });

      return res.status(200).json(favoritos.map((f) => f.documento_id));
    }

    if (req.method === "POST") {
      // Solo el usuario puede agregar sus propios favoritos
      const { documentos_id } = req.body;
      console.log(
        `⭐ Usuario ${currentUser.email} agregando favorito: documento ${documentos_id}`
      );

      if (!documentos_id) {
        return res.status(400).json({ error: "documento_id requerido" });
      }

      // Verificar que el documento existe
      const documento = await prisma.documentos.findUnique({
        where: { id: Number(documentos_id) },
      });

      if (!documento) {
        return res.status(404).json({ error: "Documento no encontrado" });
      }

      try {
        await prisma.favoritos.create({
          data: {
            usuario_id: currentUser.id, // Usar usuario autenticado
            documento_id: Number(documentos_id),
          },
        });

        console.log(`✅ Favorito agregado exitosamente`);
        return res
          .status(201)
          .json({ success: true, message: "Favorito agregado" });
      } catch (error) {
        if (error.code === "P2002") {
          return res.status(409).json({ error: "Ya está en favoritos" });
        }
        throw error;
      }
    }

    if (req.method === "DELETE") {
      // Eliminar favorito
      const { usuario_id, documentos_id } = req.body;
      if (!usuario_id || !documentos_id)
        return res.status(400).json({ error: "Datos requeridos" });

      await prisma.favoritos.deleteMany({
        where: {
          usuario_id: Number(usuario_id),
          documento_id: Number(documentos_id),
        },
      });
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: "Método no permitido" });
  } catch (error) {
    console.error("ERROR FAVORITOS:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor", detalle: error.message });
  }
  // No uses prisma.$disconnect() aquí en Next.js API routes
}
