"use client";

import { useEffect, useState } from "react";
import ThemeToggle from '@/components/ThemeToggle';
import Link from "next/link";
import Image from "next/image";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import profesionMap from "../../../lib/profesionMap";

import {
  FiHome,
  FiUsers,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiFolder,
  FiCheckCircle,
} from "react-icons/fi";

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

  const navItems = [
    { href: "/admin", label: "Inicio", icon: <FiHome /> },
    { href: "/admin/archivos", label: "Archivos", icon: <FiFolder /> },
    { href: "/admin/reportes", label: "Reportes", icon: <FiFileText /> },
    { href: "/admin/usuarios", label: "Usuarios", icon: <FiUsers /> },
    { href: "/admin/verificacion-lea", label: "Verificación LEA", icon: <FiCheckCircle /> },
    { href: "/admin/configuracion", label: "Configuración", icon: <FiSettings /> },
  ];

  return (
<>
  {/* Sidebar */}
  <aside className="fixed top-0 left-0 w-72 h-screen bg-gray-900 text-white flex flex-col justify-between shadow-lg z-50">
    <div className="p-6">
      {/* Encabezado */}
      <h2 className="text-2xl font-bold mb-6 text-blue-400 tracking-wide">Panel Admin</h2>

      {/* Navegación */}
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 hover:text-blue-300 transition-colors text-md"
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>

        {/* Perfil */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex flex-col items-center">
            <Image
              src={avatar}
              alt="Avatar"
              width={72}
              height={72}
              className="rounded-full border-2 border-gray-700 mb-3 object-cover"
            />
            <p className="font-semibold text-sm text-center">{title}</p>
            <p className="text-xs text-gray-400 italic text-center mb-2">ADM: {position}</p>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="flex items-center gap-2 text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded transition w-full justify-center"
            >
              <FiLogOut className="text-base" />
              Cerrar sesión
            </button>

            <div className="mt-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <main
        className="ml-64 min-h-screen p-8 bg-gray-100 dark:bg-gray-900 transition-all"
        style={{ maxWidth: "calc(100vw - 16rem)" }}
      >
        {children}
      </main>
    </>
  );
}
