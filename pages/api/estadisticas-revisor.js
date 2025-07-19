import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: "No autorizado" });
    }

    // Verificar que el usuario tiene rol de revisor
    if (session.user.role !== "revisor" && session.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Acceso denegado. Se requiere rol de revisor." });
    }

    const now = new Date();
    const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inicioSemana = new Date(now);
    inicioSemana.setDate(now.getDate() - now.getDay());

    // Consultas paralelas para obtener estadísticas del revisor
    const [
      documentosPendientes,
      documentosRevisadosHoy,
      documentosRevisadosSemana,
      documentosAprobadosSemana,
      documentosRechazadosSemana,
      capturistasActivos,
      documentosProximosVencer,
    ] = await Promise.all([
      // Documentos pendientes de revisión
      prisma.documento.count({
        where: {
          estado: "PENDIENTE",
        },
      }),

      // Documentos revisados hoy por este revisor
      prisma.documento.count({
        where: {
          revisadoPor: session.user.id,
          fechaRevision: {
            gte: hoy,
          },
        },
      }),

      // Documentos revisados esta semana por este revisor
      prisma.documento.count({
        where: {
          revisadoPor: session.user.id,
          fechaRevision: {
            gte: inicioSemana,
          },
        },
      }),

      // Documentos aprobados esta semana por este revisor
      prisma.documento.count({
        where: {
          revisadoPor: session.user.id,
          estado: "APROBADO",
          fechaRevision: {
            gte: inicioSemana,
          },
        },
      }),

      // Documentos rechazados esta semana por este revisor
      prisma.documento.count({
        where: {
          revisadoPor: session.user.id,
          estado: "RECHAZADO",
          fechaRevision: {
            gte: inicioSemana,
          },
        },
      }),

      // Capturistas activos (que han subido documentos en la última semana)
      prisma.documento.findMany({
        where: {
          createdAt: {
            gte: inicioSemana,
          },
        },
        select: {
          uploadedBy: true,
        },
        distinct: ["uploadedBy"],
      }),

      // Documentos próximos a vencer (más de 3 días sin revisar)
      prisma.documento.count({
        where: {
          estado: "PENDIENTE",
          createdAt: {
            lte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
          },
        },
      }),
    ]);

    // Calcular métricas derivadas
    const totalRevisadosSemana =
      documentosAprobadosSemana + documentosRechazadosSemana;
    const tasaAprobacion =
      totalRevisadosSemana > 0
        ? ((documentosAprobadosSemana / totalRevisadosSemana) * 100).toFixed(1)
        : 0;

    // Calcular tiempo promedio de revisión
    const tiempoPromedio = await calcularTiempoPromedioRevision(
      session.user.id
    );

    // Generar alertas automáticas
    const alertasCalidad = [];

    if (documentosProximosVencer > 0) {
      alertasCalidad.push({
        tipo: "warning",
        mensaje: `${documentosProximosVencer} documentos próximos a vencer (más de 3 días)`,
      });
    }

    if (parseFloat(tasaAprobacion) < 85) {
      alertasCalidad.push({
        tipo: "warning",
        mensaje: "Tasa de aprobación semanal por debajo del 85%",
      });
    }

    if (documentosPendientes > 50) {
      alertasCalidad.push({
        tipo: "info",
        mensaje:
          "Cola de revisión alta. Considera priorizar documentos urgentes.",
      });
    }

    const estadisticas = {
      documentosPendientes,
      documentosRevisadosHoy,
      documentosRevisadosSemana,
      tiempoPromedioRevision: tiempoPromedio,
      tasaAprobacion: parseFloat(tasaAprobacion),
      documentosVencimiento: documentosProximosVencer,
      capturistasActivos: capturistasActivos.length,
      alertasCalidad,
    };

    res.status(200).json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas del revisor:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error interno",
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Función auxiliar para calcular tiempo promedio de revisión
async function calcularTiempoPromedioRevision(revisorId) {
  try {
    const documentosRevisados = await prisma.documento.findMany({
      where: {
        revisadoPor: revisorId,
        fechaRevision: {
          not: null,
        },
      },
      select: {
        createdAt: true,
        fechaRevision: true,
      },
      orderBy: {
        fechaRevision: "desc",
      },
      take: 30, // Últimos 30 documentos revisados
    });

    if (documentosRevisados.length === 0) {
      return 0;
    }

    const tiempos = documentosRevisados.map((doc) => {
      const diferencia = new Date(doc.fechaRevision) - new Date(doc.createdAt);
      return diferencia / (1000 * 60 * 60 * 24); // Convertir a días
    });

    const promedio =
      tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / tiempos.length;
    return Math.round(promedio * 10) / 10; // Redondear a 1 decimal
  } catch (error) {
    console.error("Error al calcular tiempo promedio:", error);
    return 2.0; // Valor por defecto
  }
}
