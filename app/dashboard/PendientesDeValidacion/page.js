"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faCheck,
  faTimes,
  faEye,
  faMoon,
  faSun,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Esta es nuestra página de Documentos Pendientes de Validación.
 * Usamos "use client" para permitir hooks y modo oscuro.
 */
export default function PendingDocumentsPage() {
  
   //Estado para manejar si estamos en modo oscuro o no.
  
  const [darkMode, setDarkMode] = useState(false);

  
    //solo para mostrar avatar y nombre.
  
  const currentUser = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
  };

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

  
  //filtro de busqueda
  const [filterState, setFilterState] = useState("Todos");

    //Búsqueda por nombre o responsable.
  
  const [searchTerm, setSearchTerm] = useState("");

   //Documento seleccionado para mostrar detalles más completos (modal).
  
  const [selectedDoc, setSelectedDoc] = useState(null);

  
    //Manejamos acciones sobre los documentos:
    //Descargar, Validar, Rechazar, Ver detalles...
  
  const handleDownload = (doc) => {
    alert(`Descargando: ${doc.name}`);
    // Aquí iría la lógica real de descarga si tuvieras el contenido en doc.content
  };

  const handleValidate = (doc) => {
    alert(`Documento: ${doc.name} Validado`);
    // En tu caso podrías setear un nuevo estado (doc.status = "Validado"), etc.
  };

  const handleReject = (doc) => {
    alert(`Documento: ${doc.name} Rechazado`);
    // Similar a lo de arriba, doc.status = "Rechazado"
  };

  const openDetails = (doc) => {
    setSelectedDoc(doc);
  };

  const closeDetails = () => {
    setSelectedDoc(null);
  };

  const filteredDocs = documents.filter((doc) => {
    // Filtro por estado
    if (filterState !== "Todos" && doc.status !== filterState) {
      return false;
    }

    // Filtro por búsqueda
    const term = searchTerm.toLowerCase();
    const matchesName = doc.name.toLowerCase().includes(term);
    const matchesOwner = doc.owner.toLowerCase().includes(term);

    return matchesName || matchesOwner;
  });

  return (
  
    <div
      className={`p-6 min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-800" : "bg-white text-gray-900"
      }`}
    >
      {/* Encabezado con logo y modo oscuro */}
      <div className="flex justify-between items-start mb-6">
        {/* Logo */}
        <Image src="/api.jpg" alt="Logo API" width={300} height={50} />

        {/* Modo oscuro + Avatar */}
        <div className="flex flex-col items-center gap-4 mr-4">
          {/* Botón para cambiar tema */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-gray-700 dark:text-yellow-300 hover:text-black dark:hover:text-white transition"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          {/* Avatar y nombre */}
          <div className="flex items-center gap-2">
            <Image
              src={currentUser.avatar}
              alt="Avatar"
              width={45}
              height={45}
              className="rounded-full border border-gray-300"
            />
            <span className="font-medium">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      {/* Título principal */}
      <h1 className="text-4xl text-blue-950 font-bold text-center mb-10">
        Documentos Pendientes de Validación
      </h1>

      {/* Controles de filtro y búsqueda */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Estado:</label>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 focus:outline-none"
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Validado">Validado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faSearch} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre/responsable..."
            className="border rounded px-2 py-1 focus:outline-none"
          />
        </div>
      </div>

      {/* Tabla con documentos filtrados */}
      <div
        className={`shadow-md rounded-lg p-6 border ${
          darkMode
            ? "bg-gray-800 border-gray-600"
            : "bg-white border-gray-300"
        }`}
      >
        <table
          className={`w-full table-auto border ${
            darkMode ? "border-gray-600" : "border-gray-400"
          }`}
        >
          <thead>
            <tr
              className={`${
                darkMode
                  ? "bg-yellow-600 text-white"
                  : "bg-yellow-200 text-gray-800"
              }`}
            >
              <th className="p-3 border">Documento</th>
              <th className="p-3 border">Fecha</th>
              <th className="p-3 border">Responsable</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="text-center border-t">
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.date}</td>
                <td className="p-3">{doc.owner}</td>
                <td className="p-3">{doc.status}</td>
                <td className="p-3 flex justify-center gap-3">
                  {/* Descargar */}
                  <button
                    className="text-blue-600 dark:text-blue-400"
                    onClick={() => handleDownload(doc)}
                    title="Descargar"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>

                  {/* Validar */}
                  <button
                    className="text-green-600 dark:text-green-400"
                    onClick={() => handleValidate(doc)}
                    title="Validar"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>

                  {/* Rechazar */}
                  <button
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleReject(doc)}
                    title="Rechazar"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>

                  {/* Ver Detalles */}
                  <button
                    className="text-yellow-500"
                    onClick={() => openDetails(doc)}
                    title="Ver Detalles"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}

            {/* Si no hay documentos que coincidan, mostramos mensaje */}
            {filteredDocs.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 dark:text-gray-300"
                >
                  No hay documentos que coincidan con el filtro o búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles - Se abriría si tuvieras un selectedDoc */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 w-96 rounded shadow-lg ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">Detalles del Documento</h2>
            <p>
              <strong>Nombre:</strong> {selectedDoc.name}
            </p>
            <p>
              <strong>Fecha:</strong> {selectedDoc.date}
            </p>
            <p>
              <strong>Responsable:</strong> {selectedDoc.owner}
            </p>
            <p>
              <strong>Estado:</strong> {selectedDoc.status}
            </p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Aquí podrías mostrar más información: {selectedDoc.description}
            </p>
            <button
              onClick={closeDetails}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

