"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import {
  faDownload,
  faCheck,
  faTimes,
  faEye,
  faMoon,
  faSun,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PendingDocumentsPage() {
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "default";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  const [darkMode, setDarkMode] = useState(false);
  const [filterState, setFilterState] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const [documents] = useState([
    {
      id: 1,
      name: "Informe_Tecnico.pdf",
      date: "20/03/2024",
      owner: "Dra. Cecilia Mendoza",
      status: "Pendiente",
      description: "Documento técnico que detalla análisis y conclusiones...",
    },
    {
      id: 2,
      name: "Plan_Estrategico.docx",
      date: "15/03/2024",
      owner: "Lic. Mario Pérez",
      status: "Pendiente",
      description: "Plan estratégico anual con objetivos y metas...",
    },
    {
      id: 3,
      name: "Proyecto_Obra.xlsx",
      date: "28/02/2024",
      owner: "Arq. Julio Rubio",
      status: "Validado",
      description: "Proyecto de obra pública con tiempos y costos.",
    },
    {
      id: 4,
      name: "Acta_Reunion.pdf",
      date: "01/02/2024",
      owner: "Lic. Mario Pérez",
      status: "Rechazado",
      description: "Acta de reunión con pendientes incompletos.",
    },
  ]);

  const handleDownload = (doc) => alert(`Descargando: ${doc.name}`);
  const handleValidate = (doc) => alert(`Documento: ${doc.name} Validado`);
  const handleReject = (doc) => alert(`Documento: ${doc.name} Rechazado`);
  const openDetails = (doc) => setSelectedDoc(doc);
  const closeDetails = () => setSelectedDoc(null);

  const filteredDocs = documents.filter((doc) => {
    if (filterState !== "Todos" && doc.status !== filterState) return false;
    const term = searchTerm.toLowerCase();
    return doc.name.toLowerCase().includes(term) || doc.owner.toLowerCase().includes(term);
  });

  return (
    <div className={`p-6 min-h-screen transition-all ${darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Encabezado */}
      <div className={`flex justify-between items-start mb-6 p-4 rounded-lg ${darkMode ? "bg-[#1a2b3c]" : "bg-white shadow"}`}>
        <Image src={darkMode ? "/api-dark23.png" : "/api.jpg"} alt="Logo API" width={300} height={50} />
        <div className="flex flex-col items-center gap-2">
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl" title="Cambiar modo">
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <div className="flex items-center gap-2">
            <Image src={userAvatar} alt="Avatar" width={45} height={45} className="rounded-full border border-gray-300" />
            <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{userName}</span>
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
      <h1 className="text-4xl font-bold text-center mb-10 text-blue-600 dark:text-blue-400">
        Documentos Pendientes de Validación
      </h1>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Estado:</label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className={`rounded px-2 py-1 border ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white border-gray-400 text-gray-800"}`}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Validado">Validado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar por nombre/responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 pr-10 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-400 placeholder-gray-500"
            }`}
          />
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className={`${darkMode ? "text-gray-400" : "text-gray-500"}`} />
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className={`shadow-md rounded-lg p-6 border ${darkMode ? "bg-[#1a2b3c] border-gray-800" : "bg-white border-gray-400"}`}>
        <table className="w-full table-auto text-sm border-collapse">
          <thead className={darkMode ? "bg-blue-600 text-white" : "bg-blue-400 text-gray-800"}>
            <tr>
              {["Documento", "Fecha", "Responsable", "Estado", "Acciones"].map((head) => (
                <th key={head} className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-400"}`}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className={`text-center ${darkMode ? "even:bg-[#2c3e50] odd:bg-[#1a2634]" : "even:bg-gray-50 odd:bg-white"}`}
                >
                  <td className="p-3 border dark:border-gray-700 border-gray-400">{doc.name}</td>
                  <td className="p-3 border dark:border-gray-700 border-gray-400">{doc.date}</td>
                  <td className="p-3 border dark:border-gray-700 border-gray-400">{doc.owner}</td>
                  <td className="p-3 border dark:border-gray-700 border-gray-400">{doc.status}</td>
                  <td className="p-3 border dark:border-gray-700 border-gray-400 flex justify-center gap-3">
                    <button onClick={() => handleDownload(doc)} className="text-blue-600 dark:text-blue-400">
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                    <button onClick={() => handleValidate(doc)} className="text-green-600 dark:text-green-400">
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button onClick={() => handleReject(doc)} className="text-red-600 dark:text-red-400">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <button onClick={() => openDetails(doc)} className="text-yellow-500">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500 dark:text-gray-300">
                  No hay documentos que coincidan con el filtro o búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalles */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 w-96 rounded shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <h2 className="text-xl font-bold mb-4">Detalles del Documento</h2>
            <p><strong>Nombre:</strong> {selectedDoc.name}</p>
            <p><strong>Fecha:</strong> {selectedDoc.date}</p>
            <p><strong>Responsable:</strong> {selectedDoc.owner}</p>
            <p><strong>Estado:</strong> {selectedDoc.status}</p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{selectedDoc.description}</p>
            <button onClick={closeDetails} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
