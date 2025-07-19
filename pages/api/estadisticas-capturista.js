import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id;
    const ahora = new Date();
    const inicioHoy = new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate()
    );
    const inicioSemana = new Date(ahora);
    inicioSemana.setDate(ahora.getDate() - ahora.getDay());
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // Obtener estadísticas de documentos
    const [documentosHoy, documentosSemana, documentosMes, documentosTotal] =
      await Promise.all([
        // Documentos subidos hoy
        prisma.documento.count({
          where: {
            createdBy: userId,
            fechaSubida: {
              gte: inicioHoy,
            },
          },
        }),

        // Documentos subidos esta semana
        prisma.documento.count({
          where: {
            createdBy: userId,
            fechaSubida: {
              gte: inicioSemana,
            },
          },
        }),

        // Documentos subidos este mes
        prisma.documento.count({
          where: {
            createdBy: userId,
            fechaSubida: {
              gte: inicioMes,
            },
          },
        }),

        // Total de documentos
        prisma.documento.count({
          where: {
            createdBy: userId,
          },
        }),
      ]);

    // Obtener documentos por estatus
    const documentosPorEstatus = await prisma.documento.groupBy({
      by: ["estatus"],
      where: {
        createdBy: userId,
      },
      _count: {
        id: true,
      },
    });

    // Procesar estadísticas de estatus
    const estadisticasEstatus = {
      aprobados: 0,
      pendientes: 0,
      rechazados: 0,
    };

    documentosPorEstatus.forEach((item) => {
      switch (item.estatus) {
        case "APROBADO":
          estadisticasEstatus.aprobados = item._count.id;
          break;
        case "PENDIENTE":
          estadisticasEstatus.pendientes = item._count.id;
          break;
        case "RECHAZADO":
          estadisticasEstatus.rechazados = item._count.id;
          break;
      }
    });

    // Calcular tasa de aprobación
    const totalRevisados =
      estadisticasEstatus.aprobados + estadisticasEstatus.rechazados;
    const tasaAprobacion =
      totalRevisados > 0
        ? (estadisticasEstatus.aprobados / totalRevisados) * 100
        : 0;

    // Obtener errores comunes (simulado por ahora)
    const erroresComunes = await obtenerErroresComunes(userId);

    // Calcular tiempo promedio de revisión (simulado)
    const tiempoPromedioRevision = await calcularTiempoPromedioRevision(userId);

    const estadisticas = {
      documentosHoy,
      documentosSemana,
      documentosMes,
      documentosTotal,
      aprobados: estadisticasEstatus.aprobados,
      pendientes: estadisticasEstatus.pendientes,
      rechazados: estadisticasEstatus.rechazados,
      tasaAprobacion: Math.round(tasaAprobacion * 100) / 100,
      tiempoPromedioRevision,
      erroresComunes,
      metaSemanal: 25, // Configurable por usuario
      metaMensual: 100, // Configurable por usuario
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas del capturista:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Función auxiliar para obtener errores comunes
async function obtenerErroresComunes(userId) {
  try {
    // Por ahora retornamos datos simulados
    // En el futuro, esto se basaría en un sistema de tracking de errores
    return [
      { error: "Metadatos incompletos", frecuencia: 8 },
      { error: "Nomenclatura incorrecta", frecuencia: 5 },
      { error: "Clasificación errónea", frecuencia: 3 },
    ];
  } catch (error) {
    console.error("Error al obtener errores comunes:", error);
    return [];
  }
}

// Función auxiliar para calcular tiempo promedio de revisión
async function calcularTiempoPromedioRevision(userId) {
  try {
    // Obtener documentos aprobados o rechazados con fechas
    const documentosRevisados = await prisma.documento.findMany({
      where: {
        createdBy: userId,
        estatus: {
          in: ["APROBADO", "RECHAZADO"],
        },
        fechaRevision: {
          not: null,
        },
      },
      select: {
        fechaSubida: true,
        fechaRevision: true,
      },
      take: 50, // Últimos 50 documentos para el cálculo
    });

    if (documentosRevisados.length === 0) {
      return 0;
    }

    // Calcular tiempo promedio en días
    const tiemposTotales = documentosRevisados.map((doc) => {
      const tiempoRevision = doc.fechaRevision - doc.fechaSubida;
      return tiempoRevision / (1000 * 60 * 60 * 24); // Convertir a días
    });

    const tiempoPromedio =
      tiemposTotales.reduce((sum, tiempo) => sum + tiempo, 0) /
      tiemposTotales.length;

    return Math.round(tiempoPromedio * 10) / 10; // Redondear a 1 decimal
  } catch (error) {
    console.error("Error al calcular tiempo promedio:", error);
    return 2.5; // Valor por defecto
  }
}
