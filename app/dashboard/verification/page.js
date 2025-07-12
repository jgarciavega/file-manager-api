"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import { useState, useEffect } from "react";

// Toast simple reutilizable
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

export default function VerificacionLEA() {
  // Modo oscuro manual
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("leaDarkMode");
      if (stored !== null) return stored === "";
      return false; // Siempre inicia en modo claro si no hay preferencia guardada
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark");
    }
    localStorage.setItem("leaDarkMode", darkMode);
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prev) => !prev);
  }
  const { data: session, status } = useSession();
  const [toast, setToast] = useState("");
  const [filterState, setFilterState] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  if (status === "loading") {
    return null;
  }

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";
  const userPosition = admMap[userEmail] || "000";

  // Documentos de ejemplo (simulan los que requieren verificación LEA)
  const [documents] = useState([
    {
      id: 1,
      name: "Acta_Constitutiva.pdf",
      date: "10/06/2024",
      owner: "Lic. Ana Torres",
      status: "Pendiente",
      tipo: "Acta",
      clasificacion: "Pública",
      area: "Jurídico",
      expediente: "EXP-101",
      hash: "lea123abc456",
    },
    {
      id: 2,
      name: "Reglamento_Interno.docx",
      date: "22/05/2024",
      owner: "Dr. Luis Pérez",
      status: "Validado",
      tipo: "Reglamento",
      clasificacion: "Reservada",
      area: "Administración",
      expediente: "EXP-102",
      hash: "lea789def012",
    },
    {
      id: 3,
      name: "Informe_Anual.xlsx",
      date: "15/04/2024",
      owner: "C.P. Marta López",
      status: "Pendiente",
      tipo: "Informe",
      clasificacion: "Confidencial",
      area: "Finanzas",
      expediente: "EXP-103",
      hash: "lea345ghi678",
    },
  ]);

  // Filtros y búsqueda
  const filteredDocs = documents.filter((doc) => {
    if (filterState !== "Todos" && doc.status !== filterState) return false;
    const term = searchTerm.toLowerCase();
    return doc.name.toLowerCase().includes(term) || doc.owner.toLowerCase().includes(term);
  });
  const totalPages = Math.max(1, Math.ceil(filteredDocs.length / pageSize));
  const paginatedDocs = filteredDocs.slice((page - 1) * pageSize, page * pageSize);

  // Acciones
  function handleValidate(doc) {
    setToast(`Documento validado: ${doc.name}`);
  }
  function handleReject(doc) {
    setToast(`Documento rechazado: ${doc.name}`);
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0a1120] text-gray-800 dark:text-gray-100 transition" id="verificacion-lea-root">
      {/* Encabezado premium */}
      <div className="flex justify-between items-start mb-6 p-4 rounded-lg bg-white dark:bg-[#181f2a] shadow">
        <Image src="/api-dark23.png" alt="Logo" width={350} height={60} />
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="p-2 rounded-full border border-blue-200 dark:border-blue-700 bg-white dark:bg-[#232b3b] text-blue-700 dark:text-yellow-300 shadow hover:scale-110 transition-all"
            style={{ fontSize: 22 }}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
          <Image
            src={userAvatar}
            alt={`Avatar de ${userName}`}
            width={50}
            height={50}
            className="rounded-full border-2 border-white"
          />
          <span className="font-semibold">{userName}</span>
        </div>
      </div>

      {/* Botón regreso premium */}
      <div className="mb-6 flex justify-start animate-fade-in-up delay-200">
        <Link href="/home" legacyBehavior>
          <a className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 border border-blue-700/30 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
            <span className="tracking-wide">Volver al Inicio</span>
          </a>
        </Link>
      </div>

      {/* Título premium animado */}
      <div className="flex flex-col items-center mt-[-3rem] mb-14">
        <h1
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-center animate-title-slide-fade premium-title-gradient"
          style={{ letterSpacing: '0.04em' }}
        >
          Verificación de LEA-BCS
        </h1>
        <span className="block mt-4 text-base md:text-lg text-blue-900 dark:text-blue-200 opacity-95 animate-fade-in-up delay-150 text-center max-w-2xl font-semibold">
          Revisa y valida el cumplimiento de la LEA-BCS para cada documento.
        </span>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full max-w-5xl mx-auto mb-10 mt-16 px-6 py-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-transparent dark:border-none">
        <div className="flex gap-2 items-center w-full md:w-auto">
          <label className="font-semibold">Estado:</label>
          <select value={filterState} onChange={e => setFilterState(e.target.value)} className="rounded px-3 py-1 border border-blue-400 dark:border-blue-700 bg-white dark:bg-[#232b3b] text-gray-800 dark:text-blue-100 focus:ring-2 focus:ring-blue-300">
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Validado">Validado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o responsable..."
          className="rounded px-3 py-1 border border-blue-400 dark:border-blue-700 bg-white dark:bg-[#232b3b] text-gray-800 dark:text-blue-100 focus:ring-2 focus:ring-blue-300 w-full md:w-80"
        />
      </div>

      {/* Tabla premium */}
      <div className="w-full max-w-6xl mx-auto mt-2 shadow-md rounded-lg p-0 border bg-white dark:bg-[#181f2a] border-gray-300 dark:border-blue-800 transition-colors overflow-x-auto">
        <table className="w-full table-auto text-sm border-collapse">
          <thead className="bg-blue-400 text-gray-800 dark:bg-[#22315a] dark:text-blue-100">
            <tr>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Documento</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Fecha</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Responsable</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Tipo</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Clasificación</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Área</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Expediente</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Hash/Folio</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Estado</th>
              <th className="p-3 border border-gray-300 dark:border-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocs.length > 0 ? (
              paginatedDocs.map((doc, idx) => (
                <tr key={doc.id} className={`text-center even:bg-gray-50 odd:bg-white dark:even:bg-[#232b3b] dark:odd:bg-[#181f2a] dark:hover:bg-[#22315a] hover:bg-blue-50 transition-colors ${idx === paginatedDocs.length - 1 ? '' : 'border-b border-gray-300 dark:border-blue-800'}`}> 
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.name}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.date}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.owner}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.tipo}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.clasificacion}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.area}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.expediente}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.hash}</td>
                  <td className="p-3 border-l border-gray-300 dark:border-blue-800 dark:text-blue-100">{doc.status}</td>
                  <td className="p-3 border-l dark:text-blue-100 flex flex-col items-center gap-2 border-r border-gray-300 dark:border-blue-800"> 
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleValidate(doc)} className="text-green-600 dark:text-green-400" title="Validar">
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button onClick={() => handleReject(doc)} className="text-red-600 dark:text-red-400" title="Rechazar">
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4 text-gray-500 dark:text-blue-200">
                  No hay documentos que coincidan con el filtro o búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

      <style jsx global>{`
        @keyframes title-slide-fade {
          0% { opacity: 0; transform: translateY(-80px) scale(0.96); }
          60% { opacity: 1; transform: translateY(10px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-title-slide-fade {
          animation: title-slide-fade 1.1s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .premium-title-gradient {
          background: linear-gradient(90deg, #1e3a8a 0%, #60a5fa 50%, #fff 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: premium-gradient-move 3.5s linear infinite;
        }
        @keyframes premium-gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @media (max-width: 640px) {
          .animate-title-slide-fade { font-size: 2.2rem !important; }
        }
        body {
          background-color: #f8fafc;
        }
        html.dark body, body.dark, #verificacion-lea-root.dark, #verificacion-lea-root[theme='dark'] {
          background-color: #0a1120 !important;
          color: #e0e6f0 !important;
        }
      `}</style>
    </div>
  );
}

