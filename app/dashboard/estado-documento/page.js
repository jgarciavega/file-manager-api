'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTrash,
  faMoon,
  faSun,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function EstadoDocumentoPage() {
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email,
    avatar: avatarMap[session?.user?.email] || "/default-avatar.png",
    position: admMap[session?.user?.email] || "000",
  };

  const tiposDocumentos = [
    { id: 1, tipo: "Informe" },
    { id: 2, tipo: "Oficio" },
    { id: 3, tipo: "Cédula de Auditoría" },
    { id: 4, tipo: "Factura" },
  ];

  const jefaturas = [
    { id: 1, nombre: "Contraloría e Investigación" },
    { id: 2, nombre: "Contraloría y Resolución" },
    { id: 3, nombre: "Dirección General" },
    { id: 4, nombre: "Dirección Administrativa" },
  ];

  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalObs, setModalObs] = useState({ open: false, text: "" });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documentos");
        const data = await res.json();
        setUploadedFiles(data);
      } catch (error) {
        alert("Error al cargar documentos");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleObsClick = (obs) => {
    if (obs) setModalObs({ open: true, text: obs });
  };

  const handleStatusChange = async (id, newStatus) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, status: newStatus } : file
          )
        );
      } else {
        alert('No se pudo actualizar el estado');
      }
    } catch (error) {
      alert('Error de red al actualizar el estado');
    }
  };

  const handleClasificacionChange = async (id, newTipoId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipos_documentos_id: Number(newTipoId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, tipos_documentos_id: Number(newTipoId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la clasificación');
      }
    } catch (error) {
      alert('Error de red al actualizar la clasificación');
    }
  };

  const handleJefaturaChange = async (id, newJefaturaId) => {
    if (user.position !== "admin") return;
    try {
      const res = await fetch(`/api/documentos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jefatura_id: Number(newJefaturaId) }),
      });
      if (res.ok) {
        setUploadedFiles((prev) =>
          prev.map((file) =>
            file.id === id ? { ...file, jefatura_id: Number(newJefaturaId) } : file
          )
        );
      } else {
        alert('No se pudo actualizar la jefatura/dirección');
      }
    } catch (error) {
      alert('Error de red al actualizar la jefatura/dirección');
    }
  };

  const handleDownload = (file) => {
    alert(`Descargando: ${file.nombre}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este archivo?")) {
      setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    }
  };

  const filteredFiles = uploadedFiles.filter(
    (file) =>
      (file.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.usuarios?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className={`p-10 text-center ${darkMode ? "bg-[#0d1b2a] text-white min-h-screen" : ""}`}>
        Cargando documentos...
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-all ${darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Modal de observaciones */}
      {modalObs.open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`p-6 rounded shadow-lg max-w-md w-full ${darkMode ? "bg-[#1a2b3c] text-white" : "bg-white"}`}>
            <h2 className="font-bold mb-2">Observaciones</h2>
            <p className="mb-4">{modalObs.text}</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={() => setModalObs({ open: false, text: "" })}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex justify-between items-start mb-6 p-4 rounded-lg shadow-xl ${darkMode ? "bg-[#16213e]" : "bg-white"}`}>
        {/* Logo institucional */}
        <div className="flex items-center gap-6">
      
          <Image
            src={darkMode ? "/api-dark23.png" : "/api.jpg"}
            alt="Logo API BCS"
            width={350}
            height={90}
            className="rounded-md"
            priority
          />
        </div>

        <div className="flex flex-col items-center gap-2 mr-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`text-xl ${darkMode ? "text-yellow-300" : "text-gray-700"} hover:text-black dark:hover:text-white transition`}
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="flex items-center gap-3">
            <Image
              src={user.avatar}
              alt={`Avatar de ${user.name}`}
              width={60}
              height={60}
              className="rounded-full border-2 border-white"
            />
            <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
              {user.name}
            </p>
          </div>
        </div>
      </div>

      {/* Botón regresar */}
      <div className="mb-6">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
        </Link>
      </div>

      {/* Título y buscador */}
      <h1 className={`text-3xl font-bold text-center mb-10 ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
        Estado de Documentos
      </h1>

      <div className="flex justify-end mb-6">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-4 py-2 pr-10 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-[#1a2b3c] text-white border-gray-700 placeholder-gray-400"
                : "bg-white text-gray-800 border-gray-400"
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

      {/* Tabla de documentos */}
      <div className={`shadow-xl rounded-lg p-6 border ${darkMode ? "bg-[#16213e] border-gray-700" : "bg-white border-gray-200"}`}>
        <table className="w-full table-auto text-sm border-collapse">
          <thead className={darkMode ? "bg-[#1a2b3c]" : "bg-gray-100"}>
            <tr>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Folio</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Nombre</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Clasificación</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Jefatura/Dirección</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Fecha</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Estado</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Observaciones</th>
              <th className={`p-3 border font-semibold text-sm ${darkMode ? "border-gray-700 text-blue-200" : ""}`}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.length === 0 ? (
              <tr>
                <td colSpan="8" className={`text-center p-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              filteredFiles.map((file) => (
                <tr key={file.id} className={`${darkMode ? "hover:bg-[#24304a]" : "hover:bg-blue-50"} transition`}>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{file.id}</td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>{file.nombre}</td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <select
                      value={file.tipos_documentos_id}
                      disabled={user.position !== "admin"}
                      className={`w-full px-2 py-1 rounded-md ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                      onChange={user.position === "admin"
                        ? (e) => handleClasificacionChange(file.id, e.target.value)
                        : undefined}
                    >
                      {tiposDocumentos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <select
                      value={file.jefatura_id}
                      disabled={user.position !== "admin"}
                      className={`w-full px-2 py-1 rounded-md ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                      onChange={user.position === "admin"
                        ? (e) => handleJefaturaChange(file.id, e.target.value)
                        : undefined}
                    >
                      {jefaturas.map((j) => (
                        <option key={j.id} value={j.id}>{j.nombre}</option>
                      ))}
                    </select>
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    {file.fecha_subida ? new Date(file.fecha_subida).toLocaleDateString() : ""}
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"}`}>
                    <select
                      value={file.status}
                      onChange={(e) => handleStatusChange(file.id, e.target.value)}
                      className={`w-full px-2 py-1 rounded-md ${darkMode ? "bg-[#1a2b3c] text-white border-gray-700" : "bg-white text-gray-800 border-gray-400"}`}
                      disabled={user.position !== "admin"}
                    >
                      <option value="Subido">📤 Subido</option>
                      <option value="En revisión">⏳ En revisión</option>
                      <option value="Revisado">✅ Revisado</option>
                      <option value="Rechazado">❌ Rechazado</option>
                      <option value="Aprobado">🎯 Aprobado</option>
                    </select>
                  </td>
                  <td
                    className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} cursor-pointer underline`}
                    onClick={() => handleObsClick(file.observaciones || file.observations || file.resena || "")}
                  >
                    {(file.observaciones || file.observations || file.resena) ? "Ver observación" : ""}
                  </td>
                  <td className={`p-3 border ${darkMode ? "border-gray-700" : "border-gray-300"} flex justify-center gap-4`}>
                    {user.position === 'admin' && (
                      <>
                        <button className="text-blue-400 dark:text-blue-300 text-lg" onClick={() => handleDownload(file)}>
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                        <button className="text-red-500 dark:text-red-400 text-lg" onClick={() => handleDelete(file.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </>
                    )}
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