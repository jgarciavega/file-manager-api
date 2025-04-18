"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faMoon,
  faSun,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSession } from "next-auth/react";
import avatarMap from "../../lib/avatarMap";
import Link from "next/link";

export default function UploadNew() {
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "default";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  const [document, setDocument] = useState({
    name: "",
    origin: "",
    classification: "",
    jefatura: "",
    review: "",
    file: null,
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const currentUser = {
    name: userName,
    avatar: userAvatar,
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
        darkMode ? "bg-[#0d1b2a] text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-start mb-6 p-4 rounded-lg ${
          darkMode ? "bg-[#1a2b3c]" : "bg-white shadow"
        }`}
      >
        <Image src={currentUser.logo} alt="Logo API" width={300} height={60} />
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl"
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

      {/* Botón volver */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al Inicio
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-center mb-10 text-blue-500">
        Subir Documento
      </h1>

      <div
        className={`p-8 mb-10 rounded-lg shadow-md ${
          darkMode ? "bg-[#1f2937]" : "bg-white"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[{ label: "Nombre del Documento *", name: "name" }, { label: "Origen", name: "origin" }].map(
            ({ label, name }) => (
              <div key={name}>
                <label className="block font-semibold">{label}</label>
                <input
                  type="text"
                  name={name}
                  value={document[name]}
                  onChange={handleChange}
                  className={`w-full p-2 rounded-md border focus:outline-none focus:border-blue-500 transition-all duration-200
                    ${
                      darkMode
                        ? "bg-gray-800 border-gray-600 text-gray-100"
                        : "bg-white border-gray-400 text-gray-800"
                    }`}
                />
              </div>
            )
          )}

          {[{
            label: "Clasificación",
            name: "classification",
            options: ["Oficio", "Memorándum", "Circular", "Cédula de Auditoría", "Expediente de Investigación"],
          },
          {
            label: "Dirección / Jefatura",
            name: "jefatura",
            options: ["Contraloría e Investigación", "Contraloría y Resolución", "Contraloría y Substanciación", "Control Administrativo"],
          }].map(({ label, name, options }) => (
            <div key={name}>
              <label className="block font-semibold">{label}</label>
              <select
                name={name}
                value={document[name]}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">Seleccione una opción</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block font-semibold">Reseña</label>
            <textarea
              name="review"
              value={document.review}
              onChange={handleChange}
              rows="3"
              className={`w-full p-2 rounded-md border ${
                darkMode
                  ? "bg-gray-800 border-gray-600 text-gray-100"
                  : "bg-white border-gray-400 text-gray-800"
              }`}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Seleccionar archivo *</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className={`w-full mt-2 rounded border ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100"
                : "bg-white border-gray-300 text-gray-800"
            }`}
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faUpload} /> Subir Documento
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
            className={`w-full px-4 py-2 pr-10 rounded-md border shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
            }`}
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className={darkMode ? "text-gray-300" : "text-gray-400"}
            />
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-lg shadow-md ${darkMode ? "bg-[#1e293b]" : "bg-white"}`}>
        <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
          <thead>
            <tr
              className={`text-center font-semibold ${
                darkMode ? "bg-[#2d3748] text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {["Folio", "Nombre", "Origen", "Clasificación", "Jefatura", "Reseña", "Fecha", "Responsable"].map((th) => (
                <th key={th} className="p-3 border border-gray-600">
                  {th}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-400">
                  No hay documentos disponibles.
                </td>
              </tr>
            ) : (
              filteredFiles.map((doc) => (
                <tr
                  key={doc.id}
                  className={`text-center ${
                    darkMode
                      ? "even:bg-[#2c3e50] odd:bg-[#1a2634] text-gray-100"
                      : "even:bg-gray-50 odd:bg-white text-gray-800"
                  }`}
                >
                  <td className="p-3 border border-gray-600">{doc.id}</td>
                  <td className="p-3 border border-gray-600">{doc.name}</td>
                  <td className="p-3 border border-gray-600">{doc.origin}</td>
                  <td className="p-3 border border-gray-600">{doc.classification}</td>
                  <td className="p-3 border border-gray-600">{doc.jefatura}</td>
                  <td className="p-3 border border-gray-600">{doc.review}</td>
                  <td className="p-3 border border-gray-600">{doc.date}</td>
                  <td className="p-3 border border-gray-600">{doc.owner}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
