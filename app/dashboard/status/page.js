"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

export default function DocumentStatusPage() {
  const currentUser = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
  };

  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 749,
      name: "Registro_Facturacion.docx",
      date: "10/12/2024",
      owner: "Arq. Julio Rubio",
      status: "Pendiente",
    },
    {
      id: 750,
      name: "Informe_Auditoria.pdf",
      date: "15/01/2025",
      owner: "Arq. Julio Rubio",
      status: "Revisado",
    },
  ]);

  const handleDownload = (file) => {
    alert(`Descargando: ${file.name}`);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("¿Eliminar este archivo?");
    if (confirm) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };

  return (
    <div className="p-26 bg-white">
      
      <div className="flex justify-between items-start mb-4">
  {/* Logo subido un poco */}
  <Image
    src="/api.jpg"
    alt="Logo API"
    width={320}
    height={50}
    className="-mt-8" //sube el logo 
  />
  <div className="flex items-center mr-8 gap-4">
    <Image
      src={currentUser.avatar}
      alt={currentUser.name}
      width={40}
      height={40}
      className="rounded-full"
    />
    <span className="text-gray-950">{currentUser.name}</span>
  </div>
</div>

      


      <h1 className="text-4xl font-bold text-center mt-28 mb-8  text-gray-600">
        Estado del Documento
      </h1>

      <div className="bg-white shadow-md  mb-8rounded-lg p-6 border border-gray-300">
        <table className="w-full table-auto border border-gray-400">
          <thead>
            <tr className="bg-red-200 text-gray-800">
              <th className="p-3 border border-gray-800">Documento</th>
              <th className="p-3 border border-gray-800">Fecha</th>
              <th className="p-3 border border-gray-800">Responsable</th>
              <th className="p-3 border border-gray-800">Estado</th>
              <th className="p-3 border border-gray-800">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file.id} className="text-center">
                <td className="p-3 border text-gray-800">{file.name}</td>
                <td className="p-3 border text-gray-800">{file.date}</td>
                <td className="p-3 border text-gray-800">{file.owner}</td>
                <td className="p-3 border text-gray-800">{file.status}</td>
                <td className="p-3 border border-gray-800 flex justify-center gap-4">
                  <button className="text-blue-600" onClick={() => handleDownload(file)}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button className="text-red-600" onClick={() => handleDelete(file.id)}>
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
