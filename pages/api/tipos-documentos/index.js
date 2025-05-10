// pages/api/tipos-documentos/index.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end();
  }
  try {
    const tipos = await prisma.tipos_documentos.findMany();
    res.status(200).json(tipos);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al leer tipos' });
  } finally {
    await prisma.$disconnect();
  }
}
