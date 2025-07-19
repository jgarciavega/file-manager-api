// API SEGURA PARA DOCUMENTOS DEL USUARIO
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

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { usuario_id } = req.query;

    console.log(`📋 Usuario ${currentUser.email} consultando documentos`);

    // Si no se especifica usuario_id, usar el del usuario actual
    const targetUserId = usuario_id ? Number(usuario_id) : currentUser.id;

    // Solo admins pueden ver documentos de otros usuarios
    if (targetUserId !== currentUser.id && currentUser.role !== "admin") {
      return res
        .status(403)
        .json({ error: "No tienes permisos para ver estos documentos" });
    }

    // Buscar documentos del usuario específico
    const documentos = await prisma.documentos.findMany({
      where: {
        usuarios_id: targetUserId,
      },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
        tipos_documentos: {
          select: {
            id: true,
            tipo: true,
          },
        },
      },
      orderBy: {
        fecha_subida: "desc",
      },
    });

    console.log(
      `📋 Documentos encontrados para usuario ${targetUserId}:`,
      documentos.length
    );

    // Formatear respuesta
    const documentosFormateados = documentos.map((doc) => ({
      id: doc.id,
      nombre: doc.nombre,
      descripcion: doc.descripcion,
      fecha_subida: doc.fecha_subida,
      mime: doc.mime,
      ruta: doc.ruta,
      status: doc.status,
      responsable: `${doc.usuarios?.nombre || ""} ${
        doc.usuarios?.apellidos || ""
      }`.trim(),
      tipo: doc.tipos_documentos?.tipo || "Sin clasificar",
      usuario_id: doc.usuarios_id,
      tipo_documento_id: doc.tipos_documentos_id,
    }));

    return res.status(200).json(documentosFormateados);
  } catch (error) {
    console.error("❌ ERROR en API documentos-usuario:", error);
    return res.status(500).json({
      error: "Error del servidor",
      detalle: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
