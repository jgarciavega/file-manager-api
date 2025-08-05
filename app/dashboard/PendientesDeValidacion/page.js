"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "../../../components/BackToHomeButton";
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

// Toast simple
function Toast({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-white/80 hover:text-white font-bold">×</button>
    </div>
  );
}

export default function PendingDocumentsPage() {
  // Funciones de acción (simples para evitar errores de referencia)
  function handleDownload(doc) {
    setToast(`Descargando: ${doc.name}`);
  }
  function handleValidate(doc) {
    setToast(`Documento validado: ${doc.name}`);
  }
  function handleReject(doc) {
    setToast(`Documento rechazado: ${doc.name}`);
  }
  function openDetails(doc) {
    setSelectedDoc(doc);
  }
  function closeDetails() {
    setSelectedDoc(null);
  }
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "default";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  const [darkMode, setDarkMode] = useState(false);
  const [filterState, setFilterState] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [toast, setToast] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Metadatos obligatorios según Ley Estatal de Archivos de BCS
  const [documents] = useState([
    {
      id: 1,
      name: "Informe_Tecnico.pdf",
      date: "20/03/2024",
      owner: "Dra. Cecilia Mendoza",
      status: "Pendiente",
      description: "Documento técnico que detalla análisis y conclusiones...",
      tipo: "Informe",
      clasificacion: "Pública",
      vigencia: "2024-2026",
      area: "Tecnología",
      expediente: "EXP-001",
      hash: "abc123def456",
    },
    {
      id: 2,
      name: "Plan_Estrategico.docx",
      date: "15/03/2024",
      owner: "Lic. Mario Pérez",
      status: "Pendiente",
      description: "Plan estratégico anual con objetivos y metas...",
      tipo: "Plan",
      clasificacion: "Reservada",
      vigencia: "2024-2025",
      area: "Planeación",
      expediente: "EXP-002",
      hash: "def789ghi012",
    },
    {
      id: 3,
      name: "Proyecto_Obra.xlsx",
      date: "28/02/2024",
      owner: "Arq. Julio Rubio",
      status: "Validado",
      description: "Proyecto de obra pública con tiempos y costos.",
      tipo: "Proyecto",
      clasificacion: "Confidencial",
      vigencia: "2024-2027",
      area: "Obras Públicas",
      expediente: "EXP-003",
      hash: "ghi345jkl678",
    },
    {
      id: 4,
      name: "Acta_Reunion.pdf",
      date: "01/02/2024",
      owner: "Lic. Mario Pérez",
      status: "Rechazado",
      description: "Acta de reunión con pendientes incompletos.",
      tipo: "Acta",
      clasificacion: "Pública",
      vigencia: "2024",
      area: "Jurídico",
      expediente: "EXP-004",
      hash: "jkl901mno234",
    },
  ]);

  const filteredDocs = documents.filter((doc) => {
    if (filterState !== "Todos" && doc.status !== filterState) return false;
    const term = searchTerm.toLowerCase();
    return doc.name.toLowerCase().includes(term) || doc.owner.toLowerCase().includes(term);
  });

  // Paginación real
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  const paginatedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header premium reutilizable */}
      <DashboardHeader title="Pendientes de Validación" darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
      {/* Botón Volver al Inicio premium */}
      <div className="px-6 pt-4">
        <BackToHomeButton href="/home" darkMode={darkMode} />
      </div>

      {/* Subtítulo premium */}
      <div className="flex flex-col items-center mt-2 mb-6">
        <span className="block mt-2 text-base md:text-lg text-red-400 dark:text-gray-600 opacity-95 animate-fade-in-up delay-150 text-center max-w-2xl font-semibold">
          Revisa, valida y gestiona documentos conforme a la LEA-BCS
        </span>
      </div>

      {/* Tabla premium sin fondo ni bordes */}
      <div className="w-screen max-w-full px-2 sm:px-4 py-6 mx-auto">
        <div className="overflow-x-auto w-full">
          <table className="w-screen max-w-full min-w-[1200px] mx-auto text-base">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Documento</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Fecha</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Responsable</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Tipo</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Clasificación</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Vigencia</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Área</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Expediente</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Hash/Folio</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200">Estado</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700 dark:text-gray-200">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocs.length > 0 ? (
                paginatedDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-blue-50 dark:hover:bg-slate-800 transition-all duration-200">
                    <td className="px-6 py-4">{doc.name}</td>
                    <td className="px-6 py-4">{doc.date}</td>
                    <td className="px-6 py-4">{doc.owner}</td>
                    <td className="px-6 py-4">{doc.tipo}</td>
                    <td className="px-6 py-4">{doc.clasificacion}</td>
                    <td className="px-6 py-4">{doc.vigencia}</td>
                    <td className="px-6 py-4">{doc.area}</td>
                    <td className="px-6 py-4">{doc.expediente}</td>
                    <td className="px-6 py-4">{doc.hash}</td>
                    <td className="px-6 py-4">{doc.status}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleDownload(doc)} className="text-blue-600 dark:text-blue-400 hover:scale-125 transition-transform duration-200" title="Descargar">
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button onClick={() => handleValidate(doc)} className="text-green-600 dark:text-green-400 hover:scale-125 transition-transform duration-200" title="Validar">
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button onClick={() => handleReject(doc)} className="text-red-600 dark:text-red-400 hover:scale-125 transition-transform duration-200" title="Rechazar">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                        <button onClick={() => openDetails(doc)} className="text-yellow-500 hover:scale-125 transition-transform duration-200" title="Ver historial/bitácora">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </div>
                      <Link href={`/dashboard/bitacora?docId=${doc.id}`} legacyBehavior>
                        <a className="mt-1 text-xs underline text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400 transition-all duration-200" title="Ver bitácora completa de este documento">
                          Ver Bitácora Completa
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center p-4 text-gray-500 dark:text-gray-300">
                    No hay documentos que coincidan con el filtro o búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Paginación */}
        <div className="flex justify-center items-center gap-2 py-6">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="mx-2 text-sm">Página {page} de {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
        <Toast message={toast} onClose={() => setToast("")} />
      </div>

      {/* Modal de Detalles / Bitácora */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 w-96 rounded shadow-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}> 
            <h2 className="text-xl font-bold mb-4">Detalles y Bitácora</h2>
            <p><strong>Nombre:</strong> {selectedDoc.name}</p>
            <p><strong>Fecha:</strong> {selectedDoc.date}</p>
            <p><strong>Responsable:</strong> {selectedDoc.owner}</p>
            <p><strong>Tipo:</strong> {selectedDoc.tipo}</p>
            <p><strong>Clasificación:</strong> {selectedDoc.clasificacion}</p>
            <p><strong>Vigencia:</strong> {selectedDoc.vigencia}</p>
            <p><strong>Área:</strong> {selectedDoc.area}</p>
            <p><strong>Expediente:</strong> {selectedDoc.expediente}</p>
            <p><strong>Hash/Folio:</strong> {selectedDoc.hash}</p>
            <p><strong>Estado:</strong> {selectedDoc.status}</p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{selectedDoc.description}</p>
            {/* Bitácora simulada */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Bitácora de acciones</h3>
              <ul className="text-xs space-y-1">
                <li>2025-07-10: Documento visualizado</li>
                <li>2025-07-09: Subido por {selectedDoc.owner}</li>
                <li>2025-07-08: Estado actualizado a {selectedDoc.status}</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button onClick={closeDetails} className="px-4 py-2 bg-blue-500 text-white rounded">
                Cerrar
              </button>
              <Link href={`/dashboard/bitacora?docId=${selectedDoc.id}`} legacyBehavior>
                <a className="text-xs underline text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400 transition-all duration-200 text-center" title="Ver bitácora completa de este documento">
                  Ver Bitácora Completa
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
