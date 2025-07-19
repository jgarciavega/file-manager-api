// pages/api/documentos-demo.js - API demo sin autenticación
import fs from "fs";
import path from "path";

// Cargar datos mock
const getMockData = () => {
  try {
    const mockDataPath = path.join(process.cwd(), "mock-data.json");
    const mockData = JSON.parse(fs.readFileSync(mockDataPath, "utf8"));
    return mockData;
  } catch (error) {
    console.error("Error cargando datos mock:", error);
    return { documentos: [] };
  }
};

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      console.log(`📄 Cargando documentos demo`);

      // Cargar datos mock
      const mockData = getMockData();
      const documentos = mockData.documentos || [];

      console.log(`✅ Devolviendo ${documentos.length} documentos demo`);
      return res.status(200).json(documentos);
    } else {
      res.setHeader("Allow", ["GET"]);
      return res.status(405).json({ error: "Método no permitido en demo" });
    }
  } catch (error) {
    console.error("Error en API documentos demo:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
