"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import styles from "./HomePage.module.css";
import avatarMap from "../../lib/avatarMap";
import admMap from "../../lib/admMap";
import profesionMap from "../../lib/profesionMap";
import { useAutoCorrect } from "../../lib/useAutoCorrect";

export default function Home() {
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleAutoCorrect = useAutoCorrect();

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/documentos")
      .then((res) => res.json())
      .then((data) => setDocs(data))
      .finally(() => setLoading(false));
  }, [session]);

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

  const filteredDocs = Array.isArray(docs)
    ? docs.filter((doc) => {
        const nombre = normalizeText(doc.nombre);
        const descripcion = normalizeText(doc.descripcion);
        const searchNorm = normalizeText(search);
        return nombre.includes(searchNorm) || descripcion.includes(searchNorm);
      })
    : [];

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
        {/* Aquí puedes agregar el contenido principal de la Home si lo necesitas, sin el buscador ni la tabla */}
      </div>
    </div>
  );
}
