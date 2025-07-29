"use client";

import { useGlobalSearch } from "../../context/GlobalSearchContext";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faUser,
  faFileAlt,
  faCalendar,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

const CLASIFICACIONES = ["Todos", "Informe", "Cédula", "Factura", "Oficio"];

export default function BusquedaPage() {
  const { globalSearch } = useGlobalSearch();
  const { data: session } = useSession();
  const router = useRouter();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clasificacion, setClasificacion] = useState("Todos");
  const [usuario, setUsuario] = useState("Todos");
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  useEffect(() => {
    if (!session?.user) return;
    fetch(
      `/api/documentos?query=${encodeURIComponent(globalSearch)}&usuarioId=${
        session.user.id
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setDocs(data);
        // Extraer usuarios únicos para el filtro
        const usuarios = Array.from(new Set(data.map((doc) => doc.usuario)));
        setUsuariosDisponibles(["Todos", ...usuarios]);
      })
      .catch(() => setError("Error al buscar documentos"))
      .finally(() => setLoading(false));
  }, [globalSearch, session]);

  // Función utilitaria para normalizar texto (minúsculas, sin tildes, sin puntuación, sin espacios extra)
  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "") // quita tildes
      .replace(/[.,;:!?¿¡()\[\]{}"'`´]/g, "") // quita puntuación
      .replace(/\s+/g, " ") // espacios múltiples a uno
      .trim();
  }

  // Filtro avanzado en frontend
  const filteredDocs = Array.isArray(docs)
    ? docs.filter((doc) => {
        const nombre = normalizeText(doc.nombre);
        const descripcion = normalizeText(doc.descripcion);
        const clasificacionDoc = normalizeText(doc.clasificacion);
        const usuarioDoc = normalizeText(doc.usuario);
        const searchNorm = normalizeText(globalSearch);
        const clasificacionNorm = normalizeText(clasificacion);
        const usuarioNorm = normalizeText(usuario);
        const matchText =
          nombre.includes(searchNorm) ||
          clasificacionDoc.includes(searchNorm) ||
          descripcion.includes(searchNorm);
        const matchClas =
          clasificacionNorm === "todos" ||
          clasificacionDoc === clasificacionNorm;
        const matchUser = usuarioNorm === "todos" || usuarioDoc === usuarioNorm;
        return matchText && matchClas && matchUser;
      })
    : [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/home")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Inicio
        </button>
        <h1 className="text-3xl font-bold text-blue-700 ml-4">
          Resultados de búsqueda
        </h1>
      </div>
      {/* Filtros avanzados */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <select
          value={clasificacion}
          onChange={(e) => setClasificacion(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white text-gray-800"
        >
          {CLASIFICACIONES.map((c) => (
            <option key={c} value={c}>
              {c === "Todos" ? "Clasificación" : c}
            </option>
          ))}
        </select>
        <select
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="px-4 py-2 border rounded-md bg-white text-gray-800"
        >
          {usuariosDisponibles.map((u) => (
            <option key={u} value={u}>
              {u === "Todos" ? "Usuario" : u}
            </option>
          ))}
        </select>
      </div>
      {loading && <p>Buscando documentos...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && filteredDocs.length === 0 && (
        <p className="text-gray-500">No se encontraron documentos.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="border rounded-xl shadow-lg p-6 bg-white flex flex-col gap-2 hover:shadow-2xl transition"
          >
            <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
              <FontAwesomeIcon icon={faFileAlt} />
              {doc.nombre || <span className="text-gray-400">Sin nombre</span>}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {doc.clasificacion || (
                <span className="text-gray-400">Sin tipo</span>
              )}
            </div>
            <div className="text-gray-700 text-sm mb-2">
              {doc.descripcion || (
                <span className="text-gray-400">Sin descripción</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FontAwesomeIcon icon={faUser} /> {doc.usuario || "Desconocido"}
              <FontAwesomeIcon icon={faCalendar} className="ml-4" />{" "}
              {doc.fecha_subida
                ? new Date(doc.fecha_subida).toLocaleDateString()
                : "Sin fecha"}
            </div>
            <div className="mt-2 flex gap-4">
              <a
                href={doc.url || "#"}
                download
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} /> Descargar
              </a>
              {/* Aquí puedes agregar más acciones, como ver detalles, etc. */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
