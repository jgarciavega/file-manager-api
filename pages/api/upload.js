// pages/api/upload.js

const nc = require('next-connect')
const multer = require('multer')
const { PrismaClient } = require('@prisma/client')
const path = require('path')
const fs = require('fs')

const prisma = new PrismaClient()

// 1️⃣ Configuramos Multer para guardar en public/uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      fs.mkdirSync(uploadDir, { recursive: true })
      cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  }),
})

// 2️⃣ Creamos el handler con next-connect
const handler = nc({
  onError(err, _req, res) {
    console.error('Error en /api/upload:', err)
    res.status(500).json({ error: 'Error interno al procesar la petición' })
  },
  onNoMatch(_req, res) {
    res.status(405).json({ error: `Método ${_req.method} no permitido` })
  },
})

// 3️⃣ Desactivamos el bodyParser nativo de Next.js
exports.config = {
  api: {
    bodyParser: false,
  },
}

// 4️⃣ Inyectamos Multer para procesar multipart/form-data
handler.use(upload.single('file'))

// 5️⃣ Definimos el POST
handler.post(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se recibió ningún archivo' })
    }

    // Leemos los campos que mandaste en el FormData
    const { nombre, origin, classification, jefatura, review, usuarioId } = req.body

    // (Opcional) Busca el tipo de documento
    const tipoDoc = await prisma.tipos_documentos.findFirst({
      where: { tipo: classification },
    })

    // 7️⃣ Insertamos en la BD
    const documento = await prisma.documentos.create({
      data: {
        nombre:              nombre       || req.file.originalname,
        descripcion:         review       || '',
        mime:                req.file.mimetype,
        ruta:                `/uploads/${req.file.filename}`,
        tipos_documentos_id: tipoDoc?.id  || null,
        usuarios_id:         Number(usuarioId) || 1,
        fecha_subida:        new Date(),
      },
    })

    return res.status(200).json({ documento })
  } catch (err) {
    console.error('Error al guardar documento:', err)
    return res.status(500).json({ error: 'No se pudo guardar en BD' })
  } finally {
    await prisma.$disconnect()
  }
})

module.exports = handler
