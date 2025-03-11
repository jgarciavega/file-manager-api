"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user }) {
  return (
    <div className={`navbar flex flex-col w-full ${styles.navbar}`}>
      {/* Logo, buscador y notificaciones */}
      <div className="flex items-center justify-between w-full p-4 bg-[#d2d2cb] shadow-md">
        <div className="flex items-start">
          <Image
            src="/api.jpg"
            alt="API-BCS Logo"
            width={150}
            height={150}
          />
        </div>
        <div className="flex items-center justify-between flex-grow ml-4">
          <input
            type="text"
            placeholder="Buscar..."
            className={`border-2 border-white rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-300 hover:border-blue-500 ${styles.searchBar}`}
            aria-label="Buscar"
          />
          <button className="relative ml-4" aria-label="Notificaciones">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Título principal */}
      <div className={`title-container bg-white shadow-md p-4 w-full text-center ${styles['bg-white']}`}>
        <h2 className="text-2xl font-bold text-gray-800">
          Gestor de Archivos Puerto Pichilingue
        </h2>
      </div>

      {/* Imagen de bienvenida y mensaje */}
      <div className="welcome-section shadow-md p-4 w-full relative mt-4">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={700}
          height={500}
          className="rounded-lg"
        />
        <div className="absolute top-0 right-0 p-4 bg-black bg-opacity-30 rounded-lg m-4 w-1/3 h-full flex flex-col justify-start">
          <h2 className="text-4xl font-bold text-blue-500 mt-60">Bienvenido</h2>
          <p className="text-white mt-2 text-light text-2xl">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos
            directamente mediante esta sección.
          </p>
          <button className="mt-4 px-3 py-1 bg-transparent text-white border-2 border-white rounded-lg hover:bg-blue-500 flex items-center justify-between">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Cuadros de reportes y documentos pendientes */}
      <div className="report-section flex flex-row items-center gap-4 mt-4">
        <div className={`reportes bg-slate-600 p-8 shadow-md w-1/2 ${styles.reportes}`}>
          <h2 className="text-xl font-bold text-black">Reportes generados</h2>
          <h4>
            22 archivos <FontAwesomeIcon icon={faUpload} />
          </h4>
        </div>
        <div className={`pendientes bg-gray-500 p-8 shadow-md w-1/2 ${styles.pendientes}`}>
          <h2 className="text-xl font-bold text-gray-800">
            Documentos pendientes
          </h2>
          <h4>
            11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
          </h4>
        </div>
      </div>
    </div>
  );
}
