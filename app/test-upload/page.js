'use client';

import { useState } from 'react';

export default function TestUploadPage() {
  const [file, setFile] = useState(null);
  const [nombre, setNombre] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !nombre) {
      setResult('❌ Por favor completa todos los campos');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', nombre);
    formData.append('usuarioId', '1');

    try {
      setResult('⏳ Enviando...');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Éxito: ${data.message}`);
        console.log('Respuesta completa:', data);
      } else {
        setResult(`❌ Error: ${data.error}`);
        console.error('Error completo:', data);
      }
    } catch (error) {
      setResult(`❌ Error de red: ${error.message}`);
      console.error('Error de red:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prueba de Upload</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Nombre del documento:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-2">Archivo:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Probar Upload
        </button>
      </form>
      
      {result && (
        <div className="mt-4 p-4 border rounded">
          <strong>Resultado:</strong> {result}
        </div>
      )}
    </div>
  );
} 