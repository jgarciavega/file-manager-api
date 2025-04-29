"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faMoon,
  faSun,
  faStar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email,
    avatar: avatarMap[session?.user?.email] || "/default-avatar.png",
  };

  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 749,
      name: "Registro_Facturacion.docx",
      date: "10/12/2024",
      owner: "Arq. Julio Rubio",
      status: "Pendiente",
      favorite: true,
    },
    {
      id: 750,
      name: "Informe_Auditoria.pdf",
      date: "15/01/2025",
      owner: "Arq. Julio Rubio",
      status: "Revisado",
      favorite: true,
    },
  ]);

  const handleDownload = (file) => alert(`Descargando: ${file.name}`);
  const handleDelete = (id) => {
    if (confirm("¿Eliminar este archivo?")) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };
  const handleToggleFavorite = (id) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, favorite: !file.favorite } : file
      )
    );
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      file.favorite &&
      (file.name.toLowerCase().includes(search.toLowerCase()) ||
        file.owner.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColor = (status) => {
    switch (status) {
      case "Pendiente":
        return "text-yellow-500";
      case "Revisado":
        return "text-green-500";
      case "Rechazado":
        return "text-red-500";
      default:
        return "text-gray-800 dark:text-white";
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-all ${
        darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Encabezado superior */}
      <div className="flex justify-between items-start mb-6">
        <Image
          src={darkMode ? "/api-dark23.png" : "/api.jpg"}
          alt="Logo API"
          width={320}
          height={50}
        />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 hover:text-black dark:hover:text-white transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={user.avatar}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full border border-gray-300"
            />
            <span className="font-medium text-gray-600 dark:text-white">
              {user.name}
            </span>
          </div>
        </div>
      </div>

      {/* Botón regreso */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
        </Link>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
        Favoritos-Marcado
      </h1>

      {/* Buscador */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o responsable"
          className={`px-4 py-2 rounded-md border text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode
              ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
              : "bg-white text-gray-900 border-gray-400 placeholder-gray-600"
          }`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <div
        className={`shadow-md rounded-lg p-6 border ${
          darkMode ? "bg-[#1a2b3c] border-gray-800" : "bg-white border-gray-400"
        }`}
      >
        <table className="w-full table-auto text-sm border-collapse">
          <thead className={darkMode ? "bg-gray-700 text-white" : "bg-gray-200"}>
            <tr>
              {["Documento", "Fecha", "Responsable", "Estado", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    className={`p-3 border font-semibold text-sm ${
                      darkMode ? "border-gray-600" : "border-gray-400"
                    }`}
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length > 0 ? (
              filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className={`text-center ${
                    darkMode
                      ? "even:bg-[#2c3e50] odd:bg-[#1a2634]"
                      : "even:bg-gray-50 odd:bg-white"
                  }`}
                >
                  <td className="p-3 border dark:border-gray-600 border-gray-400">
                    {file.name}
                  </td>
                  <td className="p-3 border dark:border-gray-600 border-gray-400">
                    {file.date}
                  </td>
                  <td className="p-3 border dark:border-gray-600 border-gray-400">
                    {file.owner}
                  </td>
                  <td
                    className={`p-3 border font-semibold ${statusColor(
                      file.status
                    )} dark:border-gray-600 border-gray-400`}
                  >
                    {file.status}
                  </td>
                  <td className="p-3 border flex justify-center gap-4 dark:border-gray-600 border-gray-400">
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
                    <button
                      className="text-yellow-500"
                      onClick={() => handleToggleFavorite(file.id)}
                      title="Quitar de favoritos"
                    >
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  No hay documentos marcados como favoritos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
