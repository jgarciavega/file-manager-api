"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import styles from "./HomePage.module.css";
import avatarMap from "../../lib/avatarMap";
import admMap from "../../lib/admMap";
import profesionMap from "../../lib/profesionMap";
import { useAutoCorrect } from '../../lib/useAutoCorrect';

export default function Home() {
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [search, setSearch] = useState('');
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleAutoCorrect = useAutoCorrect();

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch('/api/documentos')
      .then(res => res.json())
      .then(data => setDocs(data))
      .finally(() => setLoading(false));
  }, [session]);

  // Función utilitaria para normalizar texto (minúsculas, sin tildes, sin puntuación, sin espacios extra)
  function normalizeText(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita tildes
      .replace(/[.,;:!?¿¡()\[\]{}"'`´]/g, '') // quita puntuación
      .replace(/\s+/g, ' ') // espacios múltiples a uno
      .trim();
  }

  const filteredDocs = docs.filter(doc => {
    const nombre = normalizeText(doc.nombre);
    const descripcion = normalizeText(doc.descripcion);
    const searchNorm = normalizeText(search);
    return nombre.includes(searchNorm) || descripcion.includes(searchNorm);
  });

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  if (status === "loading")
    return <p className="text-white p-8">Cargando sesión...</p>;

  if (!session)
    return <p className="text-red-600 p-8">No estás autenticado.</p>;

  // Definimos user solo para el Navbar, Sidebar ya lo hace internamente
  const email = session.user.email;
  const user = {
    name: session.user.name,
    email: session.user.email,
    avatar: avatarMap[session.user.email] || "/default-avatar.png",
    position: admMap[session.user.email] || "000",
    title: profesionMap[session.user.email] || "",
    workArea: "Contraloría",
  };

  return (
    <div className={`flex h-screen ${styles.background}`}>
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      <div className="flex flex-col w-full">
        <Navbar user={user} toggleSidebar={toggleSidebar} />
        <div className="p-4">
          <input
            type="text"
            name="search"
            placeholder="Buscar documentos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyUp={e => handleAutoCorrect(e, e.target.value, v => setSearch(v))}
            spellCheck={true}
            autoCorrect="on"
            className="w-full p-2 rounded border-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-center text-gray-500">Cargando documentos...</p>
          ) : filteredDocs.length === 0 ? (
            <p className="text-center text-gray-500">No se encontraron documentos.</p>
          ) : (
            <table className="w-full border mt-4 text-sm">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 border">Nombre</th>
                  <th className="p-2 border">Descripción</th>
                  <th className="p-2 border">Tipo</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Descargar</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => (
                  <tr key={doc.id} className="text-center">
                    <td className="p-2 border">{doc.nombre}</td>
                    <td className="p-2 border">{doc.descripcion || '-'}</td>
                    <td className="p-2 border">{doc.tipos_documentos?.tipo || '-'}</td>
                    <td className="p-2 border">{doc.fecha_subida ? new Date(doc.fecha_subida).toLocaleDateString() : '-'}</td>
                    <td className="p-2 border">
                      {doc.ruta && (
                        <a href={doc.ruta} download className="text-blue-600 hover:underline">📥</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
