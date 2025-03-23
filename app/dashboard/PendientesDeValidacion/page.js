"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faCheck,
  faTimes,
  faEye,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

export default function PendienteDeValidacion() {
  const [darkMode, setDarkMode] = useState(false);

  const currentUser = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
  };

  const [pendingDocs, setPendingDocs] = useState([
    {
      id: 1,
      name: "Informe_Tecnico.pdf",
      date: "20/03/2024",
      owner: "Dra. Cecilia Mendoza",
      status: "Pendiente",
    },
    {
      id: 2,
      name: "Plan_Estrategico.docx",
      date: "15/03/2024",
      owner: "Lic. Mario Pérez",
      status: "Pendiente",
    },
  ]);

  const handleDownload = (doc) => {
    alert(`Descargando: ${doc.name}`);
  };

  const handleValidate = (id) => {
    if (confirm("¿Validar este documento?")) {
      setPendingDocs((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, status: "Validado" } : doc
        )
      );
    }
  };

  const handleReject = (id) => {
    if (confirm("¿Rechazar este documento?")) {
      setPendingDocs((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, status: "Rechazado" } : doc
        )
      );
    }
  };

  return (
    <div className={`p-6 min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Encabezado */}
      <div className="flex justify-between items-start mb-6">
        <Image src="/api.jpg" alt="Logo API" width={300} height={50} />

        <div className="flex flex-col items-center gap-2 mr-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 hover:text-black dark:hover:text-white transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="flex items-center gap-2">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full border border-gray-300"
            />
            <span className="font-medium text-gray-800 dark:text-white">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-10 dark:text-white">
        Documentos Pendientes de Validación
      </h1>

      {/* Tabla */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-300 dark:border-gray-600">
        <table className="w-full table-auto border border-gray-400 dark:border-gray-600">
          <thead>
            <tr className="bg-yellow-200 text-gray-800 dark:bg-yellow-500 dark:text-white">
              <th className="p-3 border border-gray-800 dark:border-gray-600">Documento</th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">Fecha</th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">Responsable</th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">Estado</th>
              <th className="p-3 border border-gray-800 dark:border-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pendingDocs.map((doc) => (
              <tr key={doc.id} className="text-center">
                <td className="p-3 border text-gray-800 dark:text-white dark:border-gray-600">{doc.name}</td>
                <td className="p-3 border text-gray-800 dark:text-white dark:border-gray-600">{doc.date}</td>
                <td className="p-3 border text-gray-800 dark:text-white dark:border-gray-600">{doc.owner}</td>
                <td className="p-3 border text-gray-800 dark:text-white dark:border-gray-600">{doc.status}</td>
                <td className="p-3 border border-gray-800 dark:border-gray-600 flex justify-center gap-3">
                  <button
                    className="text-blue-600 dark:text-blue-400"
                    onClick={() => handleDownload(doc)}
                    title="Descargar"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                  <button
                    className="text-green-600 dark:text-green-400"
                    onClick={() => handleValidate(doc.id)}
                    title="Validar"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                  <button
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleReject(doc.id)}
                    title="Rechazar"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </td>
              </tr>
            ))}
            {pendingDocs.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-300">
                  No hay documentos pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
