"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload } from "@fortawesome/free-solid-svg-icons";
import NEXT_PUBLIC_API_URL from "@/config";
import Paginacion from "../components/Paginacion"; // ajusta la ruta según tu estructura

export default function ArchivosAdmin() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const limite = 10;

  // El token debería obtenerse dentro del useEffect para evitar problemas con SSR
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const resDocs = await fetch(
          `${NEXT_PUBLIC_API_URL}/documentos?page=${pagina}&limit=${limite}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataDocs = await resDocs.json();

        let docs = [];
        let pagination = { pages: 1 };
        if (dataDocs && dataDocs.data && Array.isArray(dataDocs.data.documentos)) {
          docs = dataDocs.data.documentos;
          pagination = dataDocs.data.pagination || { pages: 1 };
        }

        const resTipos = await fetch(`${NEXT_PUBLIC_API_URL}/tipos-documentos`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const dataTipos = await resTipos.json();

        let tiposMap = {};
        if (
          dataTipos &&
          dataTipos.data &&
          Array.isArray(dataTipos.data.tiposDocumentos)
        ) {
          dataTipos.data.tiposDocumentos.forEach((tipo) => {
            tiposMap[tipo.id] = tipo.tipo;
          });
        }

        const documentosConTipo = docs.map((doc) => ({
          ...doc,
          tipo_documento_text: tiposMap[doc.tipos_documentos_id] || "Desconocido",
        }));

        setDocumentos(documentosConTipo);
        setTotalPaginas(pagination.pages);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setDocumentos([]);
        setTotalPaginas(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pagina, token]);

  const documentosFiltrados = documentos.filter((doc) =>
    doc.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center flex-1">
          Gestión de Archivos
        </h1>
        <div className="w-32" />
      </div>

      <div className="flex justify-end">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            placeholder="Buscar por nombre de documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-6 text-center">Cargando documentos…</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table
              className="
                min-w-full 
                border border-gray-400 bg-white 
                dark:border-gray-700 dark:bg-gray-800 
                border-collapse text-center
              "
            >
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  {[
                    "Nombre",
                    "Descripción",
                    "Tipo",
                    "Usuario",
                    "Fecha",
                    "Acciones",
                  ].map((h) => (
                    <th
                      key={h}
                      className="
                      px-4 py-2 
                      border border-gray-400 dark:border-gray-700 
                      text-center 
                      text-sm
                      uppercase
                      font-black 
                      text-gray-700 dark:text-gray-300
                    "
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {documentosFiltrados.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-4 text-gray-700 dark:text-gray-300"
                    >
                      No se encontraron documentos.
                    </td>
                  </tr>
                ) : (
                  documentosFiltrados.map((doc, i) => (
                    <tr
                      key={doc.id}
                      className={`
    transition-colors duration-150
    hover:bg-gray-200 dark:hover:bg-gray-600
    ${i % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
  `}
                    >
                      <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {doc.nombre}
                      </td>
                      <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {doc.descripcion}
                      </td>
                      <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {doc.tipo_documento_text || `ID: ${doc.tipos_documentos_id}` || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {doc.usuarios?.nombre || "-"}
                      </td>
                      <td className="px-4 py-2 border border-gray-400 dark:border-gray-700 text-gray-800 dark:text-gray-200">
                        {doc.fecha_subida ? new Date(doc.fecha_subida).toLocaleDateString() : "-"}
                      </td>
                      <td className="flex justify-center py-2 border border-gray-400 dark:border-gray-700">
                        <a
                          href={doc.ruta}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition text-blue-600 dark:text-blue-400"
                          title="Descargar documento"
                        >
                          <FontAwesomeIcon icon={faDownload} size="lg" />
                        </a>
                      </td>
                    </tr>

                  ))
                )}
              </tbody>
            </table>
          </div>

          <Paginacion
            pagina={pagina}
            totalPaginas={totalPaginas}
            onChangePagina={setPagina}
          />
        </>
      )}
    </div>
  );
}
