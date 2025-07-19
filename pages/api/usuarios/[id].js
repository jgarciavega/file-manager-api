import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-utils";
import { auditLogger, getClientIP } from "../../../lib/audit-logger";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const authResult = await requireAuth(req, res, "admin");
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;
  const { id } = req.query;

  const userId = parseInt(id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    if (req.method === "PUT") {
      const { rol } = req.body;

      if (!rol) {
        return res.status(400).json({ error: "Falta el campo rol" });
      }

      const validRoles = ["admin", "revisor", "capturista"];
      if (!validRoles.includes(rol)) {
        return res.status(400).json({ error: "Rol inválido" });
      }

      console.log(`Actualizando rol del usuario ${userId} a ${rol}`);

      const existingUser = await prisma.usuarios.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Log de la operación antes del cambio
      await auditLogger.logDataOperation(
        "USER_ROLE_UPDATE",
        currentUser,
        "usuarios",
        {
          resourceId: userId,
          oldValue: existingUser.role || "unknown",
          newValue: rol,
          ip: getClientIP(req),
          success: true,
        }
      );

      const r = await prisma.roles.findFirst({ where: { tipo: rol } });
      if (!r) {
        return res.status(404).json({ error: "Rol no existe" });
      }

      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: userId },
      });

      await prisma.usuarios_has_roles.create({
        data: {
          usuarios_id: userId,
          roles_id: r.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Rol actualizado exitosamente",
        userId: userId,
        newRole: rol,
      });
    }

    if (req.method === "DELETE") {
      console.log(`Eliminando usuario ${userId}`);

      const existingUser = await prisma.usuarios.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (currentUser.id === userId) {
        return res
          .status(400)
          .json({ error: "No puedes eliminar tu propia cuenta" });
      }

      // Log de la operación de eliminación
      await auditLogger.logDataOperation(
        "USER_DELETE",
        currentUser,
        "usuarios",
        {
          resourceId: userId,
          oldValue: existingUser.nombre || "unknown",
          ip: getClientIP(req),
          success: true,
        }
      );

      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: userId },
      });

      await prisma.usuarios.delete({
        where: { id: userId },
      });

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    }

    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  } catch (err) {
    console.error("ERROR en operación usuario:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  } finally {
    await prisma.$disconnect();
  }
}
