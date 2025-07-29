"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "../../home/HomePage.module.css";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import profesionMap from "../../../lib/profesionMap";
import { useAutoCorrect } from "../../../lib/useAutoCorrect";

export default function Home() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleAutoCorrect = useAutoCorrect();

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    fetch("/api/documentos")
      .then((res) => res.json())
      .then((data) => setDocs(Array.isArray(data) ? data : []))
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

  if (status === "loading")
    return <p className="text-white p-8">Cargando sesión...</p>;

  if (!session)
    return <p className="text-red-600 p-8">No estás autenticado.</p>;

  return (
    <div className={`flex-1 p-6 ${styles.background}`}>
      {/* Contenido principal de la Home sin sidebar ni navbar */}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          Bienvenido al Sistema de Gestión Documental
        </h1>
        <p className="text-blue-200 text-lg">
          Selecciona una opción del menú lateral para comenzar.
        </p>
      </div>
    </div>
  );
}
