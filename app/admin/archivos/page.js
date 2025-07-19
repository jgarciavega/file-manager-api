"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function ArchivosAdmin() {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setError(null);
        console.log("🔍 Cargando documentos...");

        const res = await fetch("/api/documentos-demo", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            console.error("❌ No autorizado - redirigiendo al login");
            console.log("⚠️ No autenticado, pero continuando con datos mock");
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log("✅ Documentos cargados:", data.length);
        setDocumentos(data);
      } catch (error) {
        console.error("❌ Error al cargar documentos:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1b2a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando documentos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0d1b2a] text-gray-900 dark:text-white">
      {/* ——— Cabecera ——— */}
      <div className="flex justify-between items-start mb-6">
        <Image src="/api-dark23.png" alt="Logo" width={300} height={60} />
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Inicio
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400 text-center">
        Gestor de Archivos
      </h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando documentos...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold mb-2">
            Error al cargar documentos
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700 text-left">
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Descripción</th>
                <th className="px-4 py-2 border">Tipo</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Fecha</th>
                {/* — Nueva columna para descarga — */}
                <th className="px-4 py-2 border text-center">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {documentos.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No hay documentos disponibles.
                  </td>
                </tr>
              ) : (
                documentos.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2 border">{doc.nombre}</td>
                    <td className="px-4 py-2 border">{doc.descripcion}</td>
                    {/* 🔧 Ajuste: mostramos el tipo real */}
                    <td className="px-4 py-2 border">
                      {doc.tipos_documentos?.tipo || "-"}
                    </td>
                    {/* 🔧 Ajuste: mostramos el nombre del usuario */}
                    <td className="px-4 py-2 border">
                      {doc.usuarios?.nombre || "-"}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(doc.fecha_subida).toLocaleDateString()}
                    </td>
                    {/* 🔧 Enlace de descarga */}
                    <td className="px-4 py-2 border text-center">
                      <a
                        href={doc.ruta}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📥
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
