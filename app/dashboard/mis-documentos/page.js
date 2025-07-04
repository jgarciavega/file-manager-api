"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faStar as faStarSolid,
  faStar as faStarRegular,
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faSearch,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import avatarMap from "../../../lib/avatarMap";

const CLASIFICACIONES = [
  "Todos",
  "Informe",
  "Cédula",
  "Factura",
  "Oficio",
];

const ESTADOS = [
  "Todos",
  "Subido",
  "En revisión",
  "Revisado",
  "Aprobado",
  "Rechazado",
];

export default function MisDocumentosPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clasificacion, setClasificacion] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [favoritos, setFavoritos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [favMsg, setFavMsg] = useState("");

  // Datos de usuario
  const email = session?.user?.email || "";
  const avatar = avatarMap[email] || "/default-avatar.png";
  const userName = session?.user?.name || "Usuario";
  const userId = session?.user?.id;

  // Carga inicial de documentos
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`/api/documentos?usuarioId=${userId}`)
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .finally(() => setLoading(false));
  }, [userId]);

  // Carga inicial de favoritos desde la BD
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/favoritos?usuario_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setFavoritos(Array.isArray(data) ? data.map(Number) : []));
  }, [userId]);

  // Descargar documento
  const handleDownload = (doc) => {
    alert(`Descargando: ${doc.nombre}`);
    // Aquí puedes implementar la lógica real de descarga si tienes la ruta del archivo
  };

  // Toggle favoritos sincronizado con la BD
  const toggleFavorito = async (id) => {
    if (!userId) return;
    let response;
    if (favoritos.includes(id)) {
      response = await fetch('/api/favoritos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId, documentos_id: id })
      });
    } else {
      response = await fetch('/api/favoritos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId, documentos_id: id })
      });
    }
    const data = await response.json();
    console.log("Respuesta del backend favoritos:", data);
    // Refresca favoritos después de la acción
    fetch(`/api/favoritos?usuario_id=${userId}`)
      .then((res) => res.json())
      .then((data) => setFavoritos(Array.isArray(data) ? data.map(Number) : []));
    setTimeout(() => setFavMsg(""), 1200);
  };

  // Filtrado
  const filteredDocs = docs
    .filter((doc) =>
      doc.nombre?.toLowerCase().includes(search.toLowerCase())
    )
    .filter((doc) =>
      clasificacion === "Todos" ? true : doc.clasificacion === clasificacion
    )
    .filter((doc) =>
      estado === "Todos" ? true : doc.status === estado
    );

  // Paginación
  const totalPages = Math.ceil(filteredDocs.length / perPage);
  const paginatedDocs = filteredDocs.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className={`${darkMode ? "bg-[#0d1b2a] text-white" : "bg-gray-50 text-gray-900"} min-h-screen flex flex-col`}>  
      {/* Navbar superior */}
      <header className={`${darkMode ? "bg-[#16213e] border-b border-[#222f43]" : "bg-white border-b border-gray-200"} flex justify-between items-center px-8 py-5 shadow`}>  
        <div className="flex items-center gap-4">
          <Image
            src="/api-dark23.png"
            alt="BCS nos UNE"
            width={380}
            height={90}
            className="object-contain"
            priority
            style={{ filter: darkMode ? "invert(1) brightness(2)" : "none" }}
          />
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-2xl focus:outline-none"
            title="Cambiar modo"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className={darkMode ? "text-yellow-300" : "text-gray-700"} />
          </button>
          <div className="flex items-center gap-2">
            <Image
              src={avatar}
              alt={userName}
              width={48}
              height={48}
              className="rounded-full border-2 border-blue-200"
            />
            <span className="font-semibold">{userName}</span>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 overflow-auto">
        {/* Volver y título */}
        <div className="flex items-center px-8 mt-8 mb-4">
          <button
            onClick={() => router.push("/home")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Volver
          </button>
          <h1 className={`${darkMode ? "text-blue-300" : "text-blue-600"} text-3xl font-bold ml-8`}>Mis Documentos</h1>
        </div>

        {/* Filtros */}
        <form className={`${darkMode ? "bg-[#1a2b3c] border-[#222f43] text-white" : "bg-white border-gray-200 text-gray-900"} flex flex-wrap gap-4 px-8 mb-6 items-center rounded-lg shadow border`}>  
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${darkMode ? "bg-[#16213e] text-white border-[#222f43] placeholder-gray-400" : "bg-white text-gray-800 border-gray-400"} w-64 px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <FontAwesomeIcon icon={faSearch} />
            </span>
          </div>
          <select
            value={clasificacion}
            onChange={(e) => { setClasificacion(e.target.value); setPage(1); }}
            className={`${darkMode ? "bg-[#16213e] text-white border-[#222f43]" : "bg-white text-gray-800 border-gray-400"} px-4 py-2 border rounded-md`}
          >
            {CLASIFICACIONES.map((c) => (
              <option key={c} value={c} className={darkMode ? "bg-[#16213e] text-white" : ""}>
                {c === "Todos" ? "Clasificación" : c}
              </option>
            ))}
          </select>
          <select
            value={estado}
            onChange={(e) => { setEstado(e.target.value); setPage(1); }}
            className={`${darkMode ? "bg-[#16213e] text-white border-[#222f43]" : "bg-white text-gray-800 border-gray-400"} px-4 py-2 border rounded-md`}
          >
            {ESTADOS.map((e) => (
              <option key={e} value={e} className={darkMode ? "bg-[#16213e] text-white" : ""}>
                {e === "Todos" ? "Estado" : e}
              </option>
            ))}
          </select>
          {favMsg && <span className="ml-4 text-green-400 font-semibold">{favMsg}</span>}
        </form>

        <div className={`${darkMode ? "bg-[#16213e] border-[#222f43]" : "bg-white border-gray-200"} mx-8 shadow-lg rounded-lg border overflow-x-auto`}>  
          {loading ? (
            <div className="text-center py-10">Cargando...</div>
          ) : paginatedDocs.length === 0 ? (
            <div className="text-center py-10 text-gray-400">No tienes documentos.</div>
          ) : (
            <table className="w-full table-auto text-base border-collapse">
              <thead className={darkMode ? "bg-[#1a2b3c] text-white" : "bg-gray-100"}>
                <tr>
                  <th className="p-3 border">#</th>
                  <th className="p-3 border">Nombre</th>
                  <th className="p-3 border">Clasificación</th>
                  <th className="p-3 border">Fecha</th>
                  <th className="p-3 border">Fav</th>
                  <th className="p-3 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDocs.map((doc, idx) => (
                  <tr key={doc.id} className={darkMode ? "hover:bg-[#24304a] text-white" : "hover:bg-blue-50"}>
                    <td className="p-3 border text-center">{(page - 1) * perPage + idx + 1}</td>
                    <td className="p-3 border">{doc.nombre || <span className="text-gray-400">Sin nombre</span>}</td>
                    <td className="p-3 border">{doc.clasificacion || <span className="text-gray-400">Sin clasificación</span>}</td>
                    <td className="p-3 border">{doc.fecha_subida ? new Date(doc.fecha_subida).toLocaleDateString() : <span className="text-gray-400">Sin fecha</span>}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => toggleFavorito(doc.id)}
                        title={favoritos.includes(doc.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                        className="text-xl"
                      >
                        <FontAwesomeIcon
                          icon={favoritos.includes(doc.id) ? faStarSolid : faStarRegular}
                          className={favoritos.includes(doc.id) ? "text-yellow-400" : "text-gray-500"}
                        />
                      </button>
                    </td>
                    <td className="p-3 border flex justify-center gap-4">
                      <button
                        onClick={() => handleDownload(doc)}
                        title="Descargar"
                        className="text-2xl"
                      >
                        <FontAwesomeIcon icon={faDownload} className={darkMode ? "text-blue-300" : "text-blue-600"} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginación */}
        <div className={`${darkMode ? "bg-[#1a2b3c] border-t border-[#222f43] text-white" : "bg-white border-t border-gray-200 text-gray-900"} flex justify-between items-center px-8 py-6 rounded-b-lg mt-4`}>  
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-50"
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Anterior
          </button>
          <span>Página {page} de {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition disabled:opacity-50"
          >
            Siguiente <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </main>
    </div>
  );
}