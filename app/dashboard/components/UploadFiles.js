"use client"; 

import { useState } from "react";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faPaperPlane,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadFiles() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: "Registro_Facturacion.docx", date: "10/12/24", owner: "Dr. Jorge Venteño Estrada" },
  ]);

  // 📌 Manejar archivos seleccionados
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 📌 Simular subida de archivos
  const handleUpload = () => {
    if (!selectedFile) {
      Swal.fire("Error", "Selecciona un archivo antes de subirlo", "warning");
      return;
    }

    const newFile = {
      id: uploadedFiles.length + 1,
      name: selectedFile.name,
      date: new Date().toLocaleDateString(),
      owner: "Usuario Actual",
    };

    setUploadedFiles([...uploadedFiles, newFile]);
    setSelectedFile(null);
    Swal.fire("Éxito", "Archivo subido correctamente", "success");
  };

  return (
    <div className="p-6">
      {/* 📌 Título */}
      <h1 className="text-3xl font-bold text-center mb-6">Gestión de Archivos</h1>

      {/* 📌 Cuadro de carga de archivos */}
      <div className="bg-white shadow-md rounded-lg p-6 border">
        <h2 className="text-lg font-bold mb-3">Agregar Documento</h2>
        <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center">
          <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer">
            <FontAwesomeIcon icon={faUpload} className="text-gray-600 text-2xl mb-2" />
            <p className="text-gray-600">Arrastra o haz clic para seleccionar un archivo</p>
          </label>
        </div>

        {/* 📌 Botones */}
        <div className="flex justify-between mt-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center">
            <FontAwesomeIcon icon={faTimes} className="mr-2" /> Cancelar
          </button>
          <button onClick={handleUpload} className="bg-gray-700 text-white px-4 py-2 rounded flex items-center">
            <FontAwesomeIcon icon={faUpload} className="mr-2" /> Subir documento
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" /> Enviar
          </button>
        </div>
      </div>

      {/* 📌 Sección de archivos subidos */}
      <h2 className="text-lg font-bold mt-6">Favoritos</h2>
      <div className="bg-white shadow-md rounded-lg p-6 border mt-2">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Documento</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Responsable</th>
              <th className="p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file.id} className="border-b">
                <td className="p-2">{file.name}</td>
                <td className="p-2">{file.date}</td>
                <td className="p-2">{file.owner}</td>
                <td className="p-2 flex space-x-2">
                  <button className="text-blue-600">
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button className="text-red-600">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
