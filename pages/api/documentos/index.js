// pages/api/documentos/index.js - API con datos mock temporal
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
    return { documentos: [] };
  }
};

export default async function handler(req, res) {
  // Verificar autenticación para todas las operaciones
  const authResult = await requireAuth(req, res);
  if (authResult.error) {
    return res.status(authResult.status).json({ error: authResult.error });
  }

  const { user: currentUser } = authResult;

  try {
    if (req.method === "GET") {
      console.log(`📄 Usuario ${currentUser.email} consultando documentos`);
      
      // Cargar datos mock
      const mockData = getMockData();
      const documentos = mockData.documentos || [];
      
      // Si es admin, puede ver todos los documentos
      // Si es usuario normal, solo sus documentos
      let filteredDocs = documentos;
      if (currentUser.role !== "admin") {
        filteredDocs = documentos.filter(doc => doc.usuario_id === currentUser.id);
      }
      
      console.log(`✅ Devolviendo ${filteredDocs.length} documentos (datos mock)`);
      return res.status(200).json(filteredDocs);
      
    } else if (req.method === "POST") {
      // Para POST, aún necesitaríamos implementar la lógica de subida
      // Por ahora, retornamos un mensaje informativo
      return res.status(501).json({ 
        error: "Subida de archivos no disponible con datos mock. Configure MySQL para funcionalidad completa." 
      });
      
    } else {
      return res.status(405).json({ error: "Método no permitido" });
    }
    
  } catch (error) {
    console.error("Error en GET /api/documentos:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      message: "Usando datos mock temporales",
      details: error.message 
    });
  }
}
