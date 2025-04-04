"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function UploadNew() {
  const [document, setDocument] = useState({
    name: "",
    origin: "",
    classification: "",
    review: "",
    file: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
    logo: "/api-dark23.png",
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setDocument((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleUpload = () => {
    if (!document.file || !document.name) return;

    const newEntry = {
      id: Date.now(),
      ...document,
      date: new Date().toLocaleDateString(),
      owner: currentUser.name,
    };

    setUploadedFiles((prev) => [...prev, newEntry]);
    setDocument({
      name: "",
      origin: "",
      classification: "",
      review: "",
      file: null,
    });
  };

  const filteredFiles = uploadedFiles.filter((doc) =>
    [doc.name, doc.review, doc.id.toString()].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div
      className={`p-6 min-h-screen transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <Image src={currentUser.logo} alt="Logo" width={500} height={60} />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <Image
            src={currentUser.avatar}
            alt="Avatar"
            width={80}
            height={50}
            className="rounded-full border"
          />
          <span className="font-semibold text-lg">{currentUser.name}</span>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-center text-blue-600 dark:text-blue-300 mb-6">
        Subir Documento
      </h1>

      {/* Formulario */}
      <div
        className={`rounded-lg shadow-md p-6 mb-10 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-semibold">Nombre del Documento *</label>
            <input
              type="text"
              name="name"
              value={document.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded-md dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="font-semibold">Origen</label>
            <input
              type="text"
              name="origin"
              value={document.origin}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded-md dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="font-semibold">Clasificación</label>
            <input
              type="text"
              name="classification"
              value={document.classification}
              onChange={handleChange}
              className="w-full p-2 border border-gray-400 rounded-md dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="font-semibold">Reseña</label>
            <textarea
              name="review"
              value={document.review}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-400 rounded-md dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Seleccionar archivo *</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full mt-2"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faUpload} />
          Subir Documento
        </button>
      </div>
      {/* Buscador */}
      <div className="mt-12 mb-4">
        <input
          type="text"
          placeholder="Buscar por folio, nombre o reseña..."
          className="w-full px-4 py-2 rounded-md border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:border-blue-500"
        />
      </div>

      {/* Tabla de documentos subidos */}
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full table-auto text-sm border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white font-bold text-center">
              <th className="p-3 border dark:border-gray-600">Folio</th>
              <th className="p-3 border dark:border-gray-600">Nombre</th>
              <th className="p-3 border dark:border-gray-600">Origen</th>
              <th className="p-3 border dark:border-gray-600">Clasificación</th>
              <th className="p-3 border dark:border-gray-600">Reseña</th>
              <th className="p-3 border dark:border-gray-600">Fecha</th>
              <th className="p-3 border dark:border-gray-600">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="p-4 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800"
                >
                  No hay documentos disponibles.
                </td>
              </tr>
            ) : (
              uploadedFiles.map((doc) => (
                <tr
                  key={doc.id}
                  className="text-center even:bg-gray-100 dark:even:bg-gray-800 odd:bg-white dark:odd:bg-gray-900 text-gray-900 dark:text-gray-200"
                >
                  <td className="p-3 border dark:border-gray-600">{doc.id}</td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.name}
                  </td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.origin}
                  </td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.classification}
                  </td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.review}
                  </td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.date}
                  </td>
                  <td className="p-3 border dark:border-gray-600">
                    {doc.owner}
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
