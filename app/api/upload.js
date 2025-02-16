export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  // Implementa tu lógica de subida de archivos aquí
  // Ejemplo: guardar en sistema de archivos o servicio cloud

  return res.status(200).json({
    success: true,
    message: 'Archivo subido exitosamente',
    filePath: '/uploads/filename.jpg'
  });
}