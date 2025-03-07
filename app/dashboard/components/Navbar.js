"use client";
import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar({ user }) {
  return (
    <div className="navbar flex flex-col w-full">
      {/* Logo, buscador y notificaciones */}
      <div className="logo-container bg-white shadow-md p-4 w-full flex justify-between items-center">
        <div className="flex items-center">
          <Image
            src="/api.jpg"
            alt="API-BCS Logo"
            width={380}
            height={40}
            className="mr-4"
          />
        </div>
        <div className="flex items-center justify-center flex-grow relative mx-4">
          <input
            type="text"
            placeholder="Buscar..."
            className={`border-2 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 ${styles.searchBar}`}
            aria-label="Buscar"
          />
          <button className="relative ml-4" aria-label="Notificaciones">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Título principal */}
      <div className="title-container bg-white shadow-md p-4 w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Gestor de Archivos Puerto Pichilingue
        </h2>
      </div>

      {/* Imagen de bienvenida y mensaje */}
      <div className="welcome-section bg-white shadow-md p-4 w-full relative mt-4">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={700}
          height={300}
          className="rounded-lg"
        />
        <div className="absolute top-0 right-0 p-8 bg-white bg-opacity-75 rounded-lg m-4">
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
          <p className="text-gray-700 mt-2">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos directamente mediante esta sección.
          </p>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Consultar
          </button>
        </div>
      </div>

      {/* Cuadros de reportes y documentos pendientes */}
      <div className="report-section flex flex-col items-center gap-4 mt-4">
        <div className="reportes bg-white p-4 shadow-md w-full">
          <h2 className="text-xl font-bold text-gray-800">Reportes generados</h2>
        </div>
        <div className="pendientes bg-white p-4 shadow-md w-full">
          <h2 className="text-xl font-bold text-gray-800">Documentos pendientes</h2>
        </div>
      </div>
    </div>
  );
}
