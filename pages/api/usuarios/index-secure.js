// pages/api/usuarios/index.js - Versión segura
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../../lib/auth-utils";
import { validateInput, userSchema } from "../../../lib/validation";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Verificar autenticación para todas las operaciones
  const authResult = await requireAuth(req, res, "admin"); // Solo admins pueden gestionar usuarios
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;

  try {
    switch (req.method) {
      case "GET":
        try {
          console.log(`🔍 Admin ${currentUser.email} consultando usuarios`);

          // Traemos usuarios + sus roles
          const usuarios = await prisma.usuarios.findMany({
            include: {
              usuarios_has_roles: {
                include: { roles: true },
              },
            },
          });

          // Aplanamos para enviar sólo un campo `rol`
          const resultado = usuarios.map((u) => ({
            id: u.id,
            nombre: u.nombre,
            apellidos: u.apellidos,
            email: u.email,
            departamentos_id: u.departamentos_id,
            activo: u.activo,
            rol: u.usuarios_has_roles[0]?.roles?.tipo ?? null,
          }));

          console.log(
            `✅ ${resultado.length} usuarios enviados a ${currentUser.email}`
          );
          return res.status(200).json(resultado);
        } catch (err) {
          console.error("ERROR GET usuarios:", err);
          return res.status(500).json({ error: "Error al consultar usuarios" });
        }

      case "POST":
        try {
          const { nombre, rol } = req.body;

          // Validar entrada básica
          if (!nombre || !rol) {
            return res
              .status(400)
              .json({ error: "Nombre y rol son obligatorios" });
          }

          if (nombre.length < 2 || nombre.length > 50) {
            return res
              .status(400)
              .json({ error: "El nombre debe tener entre 2 y 50 caracteres" });
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
            `👤 Admin ${currentUser.email} creando usuario: ${nombre} (${rol})`
          );

          // 1️⃣ Crear al usuario
          const nuevo = await prisma.usuarios.create({
            data: { nombre, activo: 1 },
          });

          // 2️⃣ Buscar el rol
          const r = await prisma.roles.findFirst({ where: { tipo: rol } });
          if (!r) {
            return res.status(404).json({ error: "Rol no encontrado" });
          }

          // 3️⃣ Asignar la relación
          await prisma.usuarios_has_roles.create({
            data: {
              usuarios_id: nuevo.id,
              roles_id: r.id,
            },
          });

          console.log(`✅ Usuario creado exitosamente - ID: ${nuevo.id}`);

          return res.status(201).json({
            ...nuevo,
            rol,
            message: "Usuario creado exitosamente",
          });
        } catch (err) {
          console.error("ERROR POST usuarios:", err);
          return res.status(500).json({ error: "No se pudo crear usuario" });
        }

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res
          .status(405)
          .json({ error: `Método ${req.method} no permitido` });
    }
  } finally {
    await prisma.$disconnect();
  }
}
