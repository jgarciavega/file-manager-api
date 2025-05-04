// pages/api/test.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    // Sólo selecciona los campos que quieres exponer:
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        departamentos_id: true,
        activo: true,
      },
    });
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al consultar usuarios:", error);
    res.status(500).json({ error: "Error al consultar usuarios" });
  } finally {
    await prisma.$disconnect();
  }
}
