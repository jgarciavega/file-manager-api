"use client";

import { useEffect, useState } from "react";
import DarkModeToggle from "./../components/DarkModeToggle";
import Link from "next/link";
import Image from "next/image";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import profesionMap from "../../../lib/profesionMap";

export default function SidebarAdminLayout({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } catch (e) {
        console.error("Error al parsear el usuario del localStorage:", e);
      }
    }
  }, []);

  if (!userData) {
    return (
      <div className="text-white p-4 bg-gray-900 min-h-screen flex items-center justify-center">
        Cargando información del usuario...
      </div>
    );
  }

  const email = userData.email || "";

  const avatar = avatarMap[email] || "/default-avatar.png";
  const title = profesionMap[email] || userData.nombre || "Usuario";
  const position = admMap[email] || "000";

  return (
    <>
      {/* Sidebar fija */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white p-6 flex flex-col overflow-hidden">
        {/* Menú */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Admin</h2>
          <ul className="space-y-3">
            <li><Link href="/admin" className="hover:text-blue-400">Inicio</Link></li>
            <li><Link href="/admin/archivos" className="hover:text-blue-400">Archivos</Link></li>
            <li><Link href="/admin/reportes" className="hover:text-blue-400">Reportes</Link></li>
            <li><Link href="/admin/usuarios" className="hover:text-blue-400">Usuarios</Link></li>
            <li><Link href="/admin/verificacion-lea" className="hover:text-blue-400">Verificación de LEA-BCS</Link></li>
            <li><Link href="/admin/configuracion" className="hover:text-blue-400">Configuración</Link></li>
          </ul>
        </div>

        {/* Perfil */}
        <div className="flex flex-col items-center mt-4">
          <Image
            src={avatar}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full border mb-2 object-cover bg-gray-700"
          />

          <p className="font-semibold text-sm">{title}</p>

          <p className="text-xs text-gray-300 mb-4 italic">
            ADM: {position}
          </p>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
          >
            Cerrar sesión
          </button>

          <div className="mt-4">
            <DarkModeToggle />
          </div>
        </div>
      </aside>

      {/* Contenido */}
      <main
        className="ml-48 min-h-screen p-8 bg-gray-100 dark:bg-gray-800 overflow-auto"
        style={{ maxWidth: "calc(100vw - 16rem)" }}
      >
        {children}
      </main>
    </>
  );
}
