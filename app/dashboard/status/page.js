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
  };

  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 749,
      name: "Registro_Facturacion.docx",
      classification: "Oficio",
      jefatura: "Contraloría e Investigación",
      date: "10/12/2024",
      owner: "Arq. Julio Rubio",
      status: "Subido",
      observations: "Pendiente de validación",
    },
    {
      id: 455,
      name: "Informe_Auditoria.pdf",
      classification: "Cédula de Auditoría",
      jefatura: "Contraloría y Resolución",
      date: "15/01/2020",
      owner: "Ing. Jorge Garcia",
      status: "Revisado",
      observations: "Observaciones corregidas",
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

  const handleStatusChange = (id, newStatus) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status: newStatus } : file
      )
    );
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen p-6 transition-all ${
        darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-start mb-6 p-4 rounded-lg ${
          darkMode ? "bg-[#1a2b3c]" : "bg-white"
        }`}
      >
        <Image
          src={darkMode ? "/api-dark23.png" : "/api.jpg"}
          alt="Logo API"
          width={450}
          height={60}
          className={
            darkMode ? "rounded-xl shadow-lg bg-white/ p-2" : "rounded-md"
          }
        />

        <div className="flex flex-col items-center gap-2 mr-4">
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
              height={50}
              className="rounded-full border"
            />
            <p className="font-semibold text-gray-800 dark:text-white">
              {currentUser.name}
            </p>
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Estado de Documentos
      </h1>

      {/* Buscador */}
      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
            ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-300"
            }`}
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
            />
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div
        className={`shadow-md rounded-lg p-6 border ${
          darkMode ? "bg-[#1a2b3c] border-gray-800" : "bg-white border-gray-300"
        }`}
      >
        <table className="w-full table-auto text-sm">
          <thead className={darkMode ? "bg-gray-600" : "bg-gray-200"}>
            <tr>
              {["Folio", "Nombre", "Clasificación", "Jefatura", "Fecha", "Estado", "Observaciones", "Acciones"].map(
                (title) => (
                  <th
                    key={title}
                    className={`p-3 border font-semibold text-sm ${
                      darkMode
                        ? "text-gray-100 border-gray-700"
                        : "text-gray-700 border-gray-300"
                    }`}
                  >
                    {title}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className={`text-center p-4 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className={`${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                  } transition`}
                >
                  <td className="p-3 border dark:border-gray-700">{file.id}</td>
                  <td className="p-3 border dark:border-gray-700">{file.name}</td>
                  <td className="p-3 border dark:border-gray-700">{file.classification}</td>
                  <td className="p-3 border dark:border-gray-700">{file.jefatura}</td>
                  <td className="p-3 border dark:border-gray-700">{file.date}</td>

                  <td className="p-3 border dark:border-gray-700">
                    <select
                      value={file.status}
                      onChange={(e) => handleStatusChange(file.id, e.target.value)}
                      className="w-full px-2 py-1 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-400"
                    >
                      <option value="Subido">📤 Subido</option>
                      <option value="En revisión">⏳ En revisión</option>
                      <option value="Revisado">✅ Revisado</option>
                      <option value="Rechazado">❌ Rechazado</option>
                      <option value="Aprobado">🎯 Aprobado</option>
                    </select>
                  </td>

                  <td className="p-3 border dark:border-gray-600">
                    {file.observations}
                  </td>

                  <td className="p-3 border flex justify-center gap-4 dark:border-gray-700">
                    <button
                      className="text-blue-600 dark:text-blue-400"
                      onClick={() => handleDownload(file)}
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button
                      className="text-red-600 dark:text-red-400"
                      onClick={() => handleDelete(file.id)}
                    >
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
