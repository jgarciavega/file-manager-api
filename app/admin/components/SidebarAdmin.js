"use client";

import DarkModeToggle from "./../components/DarkModeToggle"; 
import Link from "next/link";

export default function SidebarAdmin() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
          Admin
        </h2>
        <ul className="space-y-3">
          <li>
            <Link href="/admin" className="hover:text-blue-400 transition">
              Inicio
            </Link>
          </li>
          <li>
            <Link
              href="/admin/archivos"
              className="hover:text-blue-400 transition"
            >
              Archivos
            </Link>
          </li>
          <li>
            <Link
              href="/admin/reportes"
              className="hover:text-blue-400 transition"
            >
              Reportes
            </Link>
          </li>
          <li>
            <Link
              href="/admin/usuarios"
              className="hover:text-blue-400 transition"
            >
              Usuarios
            </Link>
          </li>
          <li>
            <Link
              href="/admin/configuracion"
              className="hover:text-blue-400 transition"
            >
              Configuración
            </Link>
          </li>
        </ul>
      </div>

      {/* Botón modo oscuro */}
      <div className="mt-6 flex justify-center">
        <DarkModeToggle />
      </div>
    </aside>
  );
}
