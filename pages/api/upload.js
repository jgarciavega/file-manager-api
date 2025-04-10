import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const uploadDir = path.join(process.cwd(), "/public/uploads");
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024, // 20MB
    filename: (name, ext, part) => Date.now() + "-" + part.originalFilename,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("❌ Error al subir archivo:", err);
      return res.status(500).json({ error: "Error al procesar archivo" });
    }

    res.status(200).json({ message: "✅ Archivo subido", fields, files });
  });
}
