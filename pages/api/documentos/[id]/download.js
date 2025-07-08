import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { id } = req.query;
  // Aquí deberías buscar el nombre real del archivo por ID en tu base de datos
  // Para ejemplo, asumimos que el nombre del archivo es igual al id
  // Reemplaza esto por la lógica real de tu app
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  // Ejemplo: busca el primer archivo que empiece con el id
  const files = fs.readdirSync(uploadsDir);
  const fileName = files.find(f => f.startsWith(id));
  if (!fileName) {
    res.status(404).json({ error: "Archivo no encontrado" });
    return;
  }
  const filePath = path.join(uploadsDir, fileName);
  res.setHeader("Content-Disposition", `attachment; filename=\"${fileName}\"`);
  res.setHeader("Content-Type", "application/octet-stream");
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
