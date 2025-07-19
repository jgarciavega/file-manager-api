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

    const { page = 1, limit = 10, prioridad, area, capturista } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Construir filtros dinámicos
    const filtros = {
      estado: "PENDIENTE",
    };

    if (prioridad && prioridad !== "todos") {
      filtros.prioridad = prioridad.toUpperCase();
    }

    if (area && area !== "todas") {
      filtros.area = area;
    }

    if (capturista && capturista !== "todos") {
      filtros.uploadedBy = capturista;
    }

    // Obtener documentos pendientes con información del capturista
    const documentosPendientes = await prisma.documento.findMany({
      where: filtros,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tipoDocumento: {
          select: {
            nombre: true,
            codigo: true,
          },
        },
      },
      orderBy: [
        { prioridad: "desc" }, // Alta prioridad primero
        { createdAt: "asc" }, // Más antiguos primero
      ],
      skip,
      take: parseInt(limit),
    });

    // Contar total de documentos pendientes para paginación
    const totalDocumentos = await prisma.documento.count({
      where: filtros,
    });

    // Formatear datos para el frontend
    const documentosFormateados = documentosPendientes.map((doc) => ({
      id: doc.id,
      titulo:
        doc.titulo ||
        `${doc.tipoDocumento?.nombre || "Documento"} - ${
          doc.numeroExpediente || "S/N"
        }`,
      capturista: doc.uploader?.name || "Usuario desconocido",
      capturistaId: doc.uploader?.id,
      area: doc.area || "Sin área",
      fechaSubida: doc.createdAt,
      prioridad: doc.prioridad?.toLowerCase() || "media",
      tipoDocumento: doc.tipoDocumento?.nombre || "Sin tipo",
      numeroExpediente: doc.numeroExpediente,
      observaciones: doc.observaciones,
      metadatos: {
        serie: doc.serie,
        subserie: doc.subserie,
        codigo: doc.codigo,
        vigencia: doc.vigencia,
        fechaDocumento: doc.fechaDocumento,
      },
    }));

    // Información adicional para filtros
    const opcionesFiltros = await obtenerOpcionesFiltros();

    const respuesta = {
      documentos: documentosFormateados,
      paginacion: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalDocumentos,
        totalPages: Math.ceil(totalDocumentos / parseInt(limit)),
      },
      filtros: opcionesFiltros,
    };

    res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al obtener documentos pendientes:", error);
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

// Función auxiliar para obtener opciones de filtros
async function obtenerOpcionesFiltros() {
  try {
    const [areas, capturistas] = await Promise.all([
      // Obtener áreas únicas de documentos pendientes
      prisma.documento.findMany({
        where: { estado: "PENDIENTE" },
        select: { area: true },
        distinct: ["area"],
      }),

      // Obtener capturistas únicos de documentos pendientes
      prisma.documento.findMany({
        where: { estado: "PENDIENTE" },
        include: {
          uploader: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        distinct: ["uploadedBy"],
      }),
    ]);

    return {
      areas: areas.map((item) => item.area).filter(Boolean),
      capturistas: capturistas
        .map((item) => ({
          id: item.uploader?.id,
          nombre: item.uploader?.name,
        }))
        .filter((item) => item.id),
      prioridades: ["alta", "media", "baja"],
    };
  } catch (error) {
    console.error("Error al obtener opciones de filtros:", error);
    return {
      areas: [],
      capturistas: [],
      prioridades: ["alta", "media", "baja"],
    };
  }
}
