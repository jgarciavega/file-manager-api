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
    const { usuario_id } = req.query;

    // Si no se especifica usuario_id, usar el del usuario actual
    const targetUserId = usuario_id ? parseInt(usuario_id) : currentUser.id;

    // Solo admins pueden ver documentos de otros usuarios
    if (targetUserId !== currentUser.id && currentUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "No tienes permisos para ver estos documentos" });
    }

    console.log(
      `📄 Usuario ${currentUser.email} consultando documentos del usuario ${targetUserId}`
    );

    // Obtener documentos del usuario
    const documentos = await prisma.documentos.findMany({
      where: {
        usuarios_id: targetUserId,
      },
      include: {
        tipos_documentos: true,
        usuarios: {
          select: { id: true, nombre: true, email: true },
        },
      },
      orderBy: {
        fecha_subida: "desc",
      },
    });

    console.log(
      `📄 ${documentos.length} documentos encontrados para usuario ${targetUserId}`
    );

    res.status(200).json({
      success: true,
      documentos: documentos,
      total: documentos.length,
    });
  } catch (error) {
    console.error("ERROR DOCUMENTOS:", error);
    res.status(500).json({
      error: "Error al obtener documentos",
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
