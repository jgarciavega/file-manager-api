"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faMoon,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function DocumentStatusPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const currentUser = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
    logo: "/api-dark23.png",
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

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 transition-all ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Image
          src={darkMode ? "/api-dark23.png" : "/api.jpg"}
          alt="Logo API"
          width={480}
          height={60}
          className="transition duration-300"
        />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 hover:text-black dark:hover:text-white transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-3">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={80}
              height={60}
              className="rounded-full border"
            />
            <span className="font-semibold text-gray-800 dark:text-white">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-600 dark:text-blue-300">
        Estado de Documentos
      </h1>

      {/* Buscador */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre o responsable"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 border rounded-md text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-300" />
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-300 dark:border-gray-600">
        <table className="w-full table-auto text-sm border border-gray-300 dark:border-gray-600">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-white">Documento</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-white">Fecha</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-white">Responsable</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-white">Estado</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600 font-bold text-gray-700 dark:text-white">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-300">
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id} className="text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">{file.name}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">{file.date}</td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white">{file.owner}</td>
                  <td className={`p-3 border border-gray-300 dark:border-gray-600 font-semibold ${
                    file.status === "Pendiente" ? "text-yellow-500" :
                    file.status === "Revisado" ? "text-blue-400" : "text-green-500"
                  }`}>
                    {file.status}
                  </td>
                  <td className="p-3 border border-gray-300 dark:border-gray-600 flex justify-center gap-4">
                    <button className="text-blue-600 dark:text-blue-400" onClick={() => handleDownload(file)}>
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button className="text-red-600 dark:text-red-400" onClick={() => handleDelete(file.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
