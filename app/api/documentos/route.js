import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const documentos = await prisma.documentos.findMany(); // 👈 tabla en plural, según introspección

    return new Response(JSON.stringify(documentos), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener documentos" }), {
      status: 500,
    });
  }
}
