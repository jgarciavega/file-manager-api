// pages/api/usuarios/[id].js - Versión segura corregida
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-utils";
import { validateInput } from "../../../lib/validation";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar autenticación para todas las operaciones
  const authResult = await requireAuth(req, res, "admin"); // Solo admins pueden gestionar usuarios
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;
  const { id } = req.query;

  // Validar ID
  const userId = parseInt(id);
  if (isNaN(userId) || userId <= 0) {
    return res.status(400).json({ error: "ID de usuario inválido" });
  }

  try {
    if (req.method === "PUT") {
      const { rol } = req.body;

      // Validaciones de entrada
      if (!rol) {
        return res.status(400).json({ error: "Falta el campo rol" });
      }

      const validRoles = ["admin", "revisor", "capturista"];
      if (!validRoles.includes(rol)) {
        return res
          .status(400)
          .json({
            error: "Rol inválido. Debe ser: admin, revisor o capturista",
          });
      }

      console.log(
        `🔄 Admin ${currentUser.email} cambiando rol del usuario ${userId} a ${rol}`
      );

      // 1️⃣ Verificar que el usuario existe
      const existingUser = await prisma.usuarios.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // 2️⃣ Buscar rol
      const r = await prisma.roles.findFirst({ where: { tipo: rol } });
      if (!r) {
        return res.status(404).json({ error: "Rol no existe" });
      }

      // 3️⃣ Eliminar asignaciones anteriores
      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: userId },
      });

      // 4️⃣ Crear nueva asignación
      await prisma.usuarios_has_roles.create({
        data: {
          usuarios_id: userId,
          roles_id: r.id,
        },
      });

      console.log(`✅ Rol actualizado exitosamente para usuario ${userId}`);
      return res.status(200).json({
        success: true,
        message: "Rol actualizado exitosamente",
        userId: userId,
        newRole: rol,
      });
    }

    if (req.method === "DELETE") {
      console.log(`🗑️ Admin ${currentUser.email} eliminando usuario ${userId}`);

      // Verificar que el usuario existe
      const existingUser = await prisma.usuarios.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Prevenir auto-eliminación del admin
      if (currentUser.id === userId) {
        return res
          .status(400)
          .json({ error: "No puedes eliminar tu propia cuenta" });
      }

      // Borra relaciones y luego el usuario
      await prisma.usuarios_has_roles.deleteMany({
        where: { usuarios_id: userId },
      });

      await prisma.usuarios.delete({
        where: { id: userId },
      });

      console.log(`✅ Usuario ${userId} eliminado exitosamente`);
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
