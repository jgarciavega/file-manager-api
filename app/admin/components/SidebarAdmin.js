"use client";

import { useState } from "react";
import DarkModeToggle from "./../components/DarkModeToggle";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";
import profesionMap from "../../../lib/profesionMap";

export default function SidebarAdmin() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = {
    avatar: avatarMap[email] || "/default-avatar.png",
    position: admMap[email] || "000",
    // Sólo usamos lo que venga de profesionMap:
    title: profesionMap[email] || session?.user?.name || "Usuario",
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa para móviles */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 text-white p-3 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        aria-label="Abrir menú"
      >
        <FontAwesomeIcon
          icon={isMobileMenuOpen ? faTimes : faBars}
          className="w-5 h-5"
        />
      </button>

      {/* Overlay para móviles */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed md:relative
        w-64 bg-gray-900 text-white p-6 
        flex flex-col justify-between 
        min-h-screen h-full
        transform transition-transform duration-300 ease-in-out
        z-50
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }
      `}
      >
        {" "}
        {/* Menú */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold border-b border-gray-700 pb-2 flex-1">
              Admin
            </h2>
            {/* Botón cerrar en móviles */}
            <button
              onClick={closeMobileMenu}
              className="md:hidden text-gray-400 hover:text-white transition-colors ml-4"
              aria-label="Cerrar menú"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          </div>
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                🏠 Inicio
              </Link>
            </li>
            <li>
              <Link
                href="/admin/archivos-demo"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                📁 Archivos
              </Link>
            </li>
            <li>
              <Link
                href="/admin/archivos"
                className="block hover:text-gray-400 text-gray-500 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                � Archivos (Con Auth)
              </Link>
            </li>
            <li>
              <Link
                href="/admin/reportes"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                📊 Reportes
              </Link>
            </li>
            <li>
              <Link
                href="/admin/usuarios-demo"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                👤 Usuarios
              </Link>
            </li>
            <li>
              <Link
                href="/admin/usuarios"
                className="block hover:text-gray-400 text-gray-500 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                � Usuarios (Con Auth)
              </Link>
            </li>
            <li>
              <Link
                href="/admin/verificacion-lea"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                ✅ Verificación de LEA-BCS
              </Link>
            </li>
            <li>
              <Link
                href="/admin/configuracion"
                className="block hover:text-blue-400 transition-colors p-2 rounded hover:bg-gray-800"
                onClick={closeMobileMenu}
              >
                ⚙️ Configuración
              </Link>
            </li>
          </ul>
        </div>{" "}
        {/* Perfil */}
        <div className="flex flex-col items-center mt-8">
          <Image
            src={user.avatar}
            alt="Avatar"
            width={80}
            height={80}
            className="rounded-full border mb-2 object-cover bg-gray-700"
          />

          {/* Aquí sólo mostramos user.title */}
          <p className="font-semibold text-sm text-center">{user.title}</p>

          <p className="text-xs text-gray-300 mb-4 text-center">
            ADM: {user.position}
          </p>

          <button
            onClick={() => {
              signOut({ callbackUrl: "/" });
              closeMobileMenu();
            }}
            className="text-sm bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors w-full"
          >
            Cerrar sesión
          </button>

          <div className="mt-4">
            <DarkModeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
