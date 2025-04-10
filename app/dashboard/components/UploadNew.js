"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faMoon,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

export default function UploadNew() {
  const [document, setDocument] = useState({
    name: "",
    origin: "",
    classification: "",
    jefatura: "",
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

  const handleUpload = async () => {
    if (!document.file || !document.name) {
      alert("Faltan campos obligatorios.");
      return;
    }

    const formData = new FormData();
    formData.append("file", document.file);
    formData.append("name", document.name);
    formData.append("origin", document.origin);
    formData.append("classification", document.classification);
    formData.append("jefatura", document.jefatura);
    formData.append("review", document.review);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();

        const newEntry = {
          id: Date.now(),
          ...document,
          date: new Date().toLocaleDateString(),
          owner: currentUser.name,
          filename: result.files.file.originalFilename,
        };

        setUploadedFiles((prev) => [...prev, newEntry]);

        alert("✅ Documento subido exitosamente");

        setDocument({
          name: "",
          origin: "",
          classification: "",
          jefatura: "",
          review: "",
          file: null,
        });
      } else {
        alert("❌ Error al subir el documento");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error al conectar con el servidor");
    }
  };

  const filteredFiles = uploadedFiles.filter((doc) =>
    [doc.name, doc.review, doc.id.toString()].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div
      className={`min-h-screen p-4 transition-all ${
        darkMode ? "bg-[#0f172a] text-black" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-start mb-6 p-4 rounded-lg ${
          darkMode ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        <Image src={currentUser.logo} alt="Logo API" width={300} height={60} />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl dark:text-yellow-300 transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={50}
              height={50}
              className="rounded-full border border-gray-300"
            />
            <span className="font-medium">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-300">
        Subir Documento
      </h1>

      {/* Formulario */}
      <div
        className={`p-6 mb-10 rounded-lg shadow-md ${
          darkMode ? "bg-[#1e293b]" : "bg-gray-100"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">
              Nombre del Documento *
            </label>
            <input
              type="text"
              name="name"
              value={document.name}
              onChange={handleChange}
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block font-semibold">Origen</label>
            <input
              type="text"
              name="origin"
              value={document.origin}
              onChange={handleChange}
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block font-semibold">Clasificación</label>
            <select
              name="classification"
              value={document.classification}
              onChange={handleChange}
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Seleccione una clasificación</option>
              <option value="Oficio">Oficio</option>
              <option value="Memorándum">Memorándum</option>
              <option value="Circular">Circular</option>
              <option value="Cédula de Auditoría">Cédula de Auditoría</option>
              <option value="Expediente de Investigación">
                Expediente de Investigación
              </option>
            </select>
          </div>

          <div>
            <label className="block font-semibold">Dirección / Jefatura</label>
            <select
              name="jefatura"
              value={document.jefatura}
              onChange={handleChange}
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">Seleccione una jefatura</option>
              <option value="Contraloría e Investigación">
                Contraloría e Investigación
              </option>
              <option value="Contraloría y Resolución">
                Contraloría y Resolución
              </option>
              <option value="Contraloría y Substanciación">
                Contraloría y Substanciación
              </option>
              <option value="Control Administrativo">
                Control Administrativo
              </option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold">Reseña</label>
            <textarea
              name="review"
              value={document.review}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Seleccionar archivo *</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full mt-2 text-gray-900"
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
      <div className="flex justify-end mb-4">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Buscar por folio, nombre o reseña..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-md border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 dark:text-gray-300"
            />
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div
        className={`rounded-lg shadow-md ${
          darkMode ? "bg-[#1e293b]" : "bg-white"
        }`}
      >
        <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white text-center font-semibold">
              <th className="p-3 border dark:border-gray-600">Folio</th>
              <th className="p-3 border dark:border-gray-600">Nombre</th>
              <th className="p-3 border dark:border-gray-600">Origen</th>
              <th className="p-3 border dark:border-gray-600">Clasificación</th>
              <th className="p-3 border dark:border-gray-600">Jefatura</th>
              <th className="p-3 border dark:border-gray-600">Reseña</th>
              <th className="p-3 border dark:border-gray-600">Fecha</th>
              <th className="p-3 border dark:border-gray-600">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="p-4 text-center text-gray-500 dark:text-gray-300"
                >
                  No hay documentos disponibles.
                </td>
              </tr>
            ) : (
              filteredFiles.map((doc) => (
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
                    {doc.jefatura}
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
