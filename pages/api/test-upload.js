export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Simular una respuesta exitosa
    const testDocument = {
      id: 999,
      nombre: 'Documento de prueba',
      descripcion: 'Este es un documento de prueba',
      ruta: '/uploads/test.pdf',
      fecha_subida: new Date(),
      usuarios_id: 1
    };

    return res.status(200).json({
      documento: testDocument,
      message: 'Prueba exitosa'
    });
  } catch (error) {
    console.error('Error en test:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
} 