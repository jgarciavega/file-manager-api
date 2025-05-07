"use client";

import DarkModeToggle from "./../components/DarkModeToggle";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import avatarMap from "../../../lib/avatarMap";
import admMap     from "../../../lib/admMap";
import profesionMap from "../../../lib/profesionMap";

export default function SidebarAdmin() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";

  const user = {
    avatar:   avatarMap[email]     || "/default-avatar.png",
    position: admMap[email]        || "000",
    // Sólo usamos lo que venga de profesionMap:
    title:    profesionMap[email]  || session?.user?.name || "Usuario"
  };

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between min-h-screen">
      {/* Menú */}
      <div>
        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Admin</h2>
        <ul className="space-y-3">
          <li><Link href="/admin"           className="hover:text-blue-400">Inicio</Link></li>
          <li><Link href="/admin/archivos"  className="hover:text-blue-400">Archivos</Link></li>
          <li><Link href="/admin/reportes"  className="hover:text-blue-400">Reportes</Link></li>
          <li><Link href="/admin/usuarios"  className="hover:text-blue-400">Usuarios</Link></li>
          <li><Link href="/admin/verificacion-lea" className="hover:text-blue-400">Verificación de LEA-BCS</Link></li>
          <li><Link href="/admin/configuracion"     className="hover:text-blue-400">Configuración</Link></li>
        </ul>
      </div>

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
        <p className="font-semibold text-sm">
          {user.title}
        </p>

        <p className="text-xs text-gray-300 mb-4">
          ADM: {user.position}
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-sm bg-red-600 hover:bg-red-700 px-4 py-1 rounded"
        >
          Cerrar sesión
        </button>

        <div className="mt-4">
          <DarkModeToggle />
        </div>
      </div>
    </aside>
  );
}
