"use client";

import { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import styles from "./HomePage.module.css";
import avatarMap from "../../lib/avatarMap";
import admMap from "../../lib/admMap";
import profesionMap from "../../lib/profesionMap";
import { useAutoCorrect } from "../../lib/useAutoCorrect";

export default function Home() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleAutoCorrect = useAutoCorrect();

  useEffect(() => {
    // Cargar usuario desde localStorage
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      console.warn("No token o usuario en localStorage, no autenticado");
      setLoading(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (err) {
      console.error("Error parseando user:", err);
      setLoading(false);
      return;
    }

    // Después, cargar documentos con token
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documentos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (Array.isArray(data)) {
          setDocs(data);
        } else if (data.data && Array.isArray(data.data)) {
          setDocs(data.data);
        } else if (Array.isArray(data.documentos)) {
          setDocs(data.documentos);
        } else {
          setDocs([]);
        }
      } catch (err) {
        console.error("Error cargando documentos:", err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocs();
  }, []);

  function normalizeText(text) {
    if (!text) return "";
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[.,;:!?¿¡()\[\]{}"'`´]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const documentsList = Array.isArray(docs) ? docs : [];

  const filteredDocs = documentsList.filter((doc) => {
    const nombre = normalizeText(doc.nombre);
    const descripcion = normalizeText(doc.descripcion);
    const searchNorm = normalizeText(search);
    return nombre.includes(searchNorm) || descripcion.includes(searchNorm);
  });

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  // Mientras carga o no hay usuario, mostrar algo
  if (loading) {
    return <p className="text-white p-8">Cargando...</p>;
  }

  if (!user) {
    return <p className="text-red-600 p-8">No estás autenticado.</p>;
  }

  const email = user.email;
  const navbarUser = {
    name: user.nombre,
    email: user.email,
    avatar: avatarMap[user.email] || "/default-avatar.png",
    position: admMap[user.email] || "000",
    title: profesionMap[user.email] || "",
    workArea: "Contraloría",
  };

  return (
    <div className={`flex h-screen ${styles.background}`}>
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />
      <div className="flex flex-col w-full">
        <Navbar user={navbarUser} toggleSidebar={toggleSidebar} />
        {/* Aquí puedes agregar el contenido principal: buscador, lista, etc */}
        <div className="p-4">
          {/* Ejemplo: mostrar filteredDocs */}
          {filteredDocs.map((doc, i) => (
            <div key={i} className="mb-2 p-2 bg-white rounded shadow">
              <h3>{doc.nombre}</h3>
              <p>{doc.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
