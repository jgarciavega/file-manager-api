import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  const { id } = req.query;
  // Aquí deberías eliminar el registro en la base de datos (no implementado en este ejemplo)
  // Eliminar archivo físico
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const files = fs.readdirSync(uploadsDir);
  const fileName = files.find(f => f.startsWith(id));
  if (!fileName) {
    return res.status(404).json({ error: "Archivo no encontrado" });
  }
  const filePath = path.join(uploadsDir, fileName);
  try {
    fs.unlinkSync(filePath);
    // Aquí deberías eliminar el registro en la base de datos
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "No se pudo eliminar el archivo" });
  }
}
