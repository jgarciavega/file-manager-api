"use client";

import { Bell } from "lucide-react"; // Icono de notificación
import Image from "next/image";
import styles from "./Navbar.module.css"; // Importar estilos

export default function Navbar() {
  return (
    <nav
      className={`bg-white shadow-md p-4 flex justify-between items-center ${styles.navbar}`}
    >
      {/* Logo y título */}
      <div className="flex items-center gap-4">
        <Image
          src="/api.jpg" // Se corrigió la ruta de la imagen
          alt="API-BCS Logo"
          width={520}
          height={40}
        />
        <h1 className="text-xl font-bold text-black">Gestor de Archivos</h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className={`border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 ${styles.searchBar}`}
        />
      </div>

      {/* Notificación y perfil de usuario */}
      <div className="flex items-center gap-4">
        {/* Campana de notificaciones */}
        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Nombre de usuario */}
        <div className="flex items-center gap-2">
          <Image
            src="/av3.webp" // Imagen de perfil
            alt="Usuario"
            width={55}
            height={35}
            className="rounded-full"
          />
          <span className="text-gray-700 font-medium">Jorge Garcia</span>
        </div>
      </div>
    </nav>
  );
}
