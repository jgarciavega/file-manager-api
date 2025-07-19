// pages/api/usuarios/index.js - API con datos mock temporal
// NOTA: Esta es una versión temporal que usa datos mock mientras se soluciona MySQL

import { requireAuth } from "../../../lib/auth-utils";
import fs from "fs";
import path from "path";

// Cargar datos mock
const getMockData = () => {
  try {
    const mockDataPath = path.join(process.cwd(), 'mock-data.json');
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, 'utf8'));
    return mockData;
  } catch (error) {
    console.error('Error cargando datos mock:', error);
    return { usuarios: [] };
  }
};

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
        console.log(`🔍 Admin ${currentUser.email} consultando usuarios`);
        
        // Cargar datos mock
        const mockData = getMockData();
        const usuarios = mockData.usuarios || [];
        
        console.log(`✅ Devolviendo ${usuarios.length} usuarios (datos mock)`);
        return res.status(200).json(usuarios);

      case "POST":
        // Para POST, simulamos la creación
        console.log(`➕ Admin ${currentUser.email} intentando crear usuario`);
        
        return res.status(501).json({ 
          error: "Creación de usuarios no disponible con datos mock. Configure MySQL para funcionalidad completa.",
          message: "Funcionalidad solo disponible con base de datos"
        });

      case "PUT":
        // Para PUT, simulamos la actualización
        console.log(`✏️ Admin ${currentUser.email} intentando actualizar usuario`);
        
        return res.status(501).json({ 
          error: "Actualización de usuarios no disponible con datos mock. Configure MySQL para funcionalidad completa.",
          message: "Funcionalidad solo disponible con base de datos"
        });

      case "DELETE":
        // Para DELETE, simulamos la eliminación
        console.log(`🗑️ Admin ${currentUser.email} intentando eliminar usuario`);
        
        return res.status(501).json({ 
          error: "Eliminación de usuarios no disponible con datos mock. Configure MySQL para funcionalidad completa.",
          message: "Funcionalidad solo disponible con base de datos"
        });

      default:
        return res.status(405).json({ error: "Método no permitido" });
    }
  } catch (error) {
    console.error("Error en API de usuarios:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      message: "Usando datos mock temporales",
      details: error.message 
    });
  }
}
