"use client";

import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user }) {
  return (
    <div className={`navbar flex flex-col w-full ${styles.navbar}`}>
      {/* 🔹 Título principal */}
      <div className="image-container">
        {/* Título sobre la imagen */}
        <div className="title-container">
          GESTOR DE ARCHIVOS PUERTO PICHILINGUE
        </div>
      </div>

      <div className="navbar flex items-center justify-between w-full bg-[#fff] shadow-md">
        {/* Logo */}
        <div className="navbar-logo">
          <Image
            src="/api.jpg"
            alt="API-BCS Logo"
            width={800} // Tamaño que mencionaste
            height={200}
            className="object-contain"
          />
        </div>

        {/* Buscador */}

        <div className="md:w-[400px] navbar-search flex-grow flex justify-center px-8">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full md:w-96 border border-black rounded-lg px-4 py-2 text-black hover:border-blue-500 transition-colors duration-300"
          />
        </div>
        {/* Notificaciones */}
        <div className="navbar-notifications">
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-800" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-800 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* 🔹 Imagen de bienvenida con mensaje */}
      <div className="relative shadow-md w-full">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={600}
          height={400}
          className="rounded-lg"
        />
        <div className="absolute top-0 right-1 p-6 bg-black bg-opacity-40 rounded-lg w-full md:w-1/2 h-full flex flex-col justify-start">
          <h2 className="text-5xl font-bold text-blue-150 mt-48">Bienvenido</h2>
          <p className="text-white mt-8 text-light text-3xl">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos
            directamente mediante esta sección.
          </p>
          <button className="mt-4 px-3 py-1 bg-transparent text-white border-2 border-white rounded-lg hover:bg-blue-500 flex items-center justify-between">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>

      {/* 🔹 Sección de reportes y documentos pendientes */}

      <div
        className={`${styles.container} p-6 grid grid-cols-1 md:grid-cols-2 gap-4`}
      >
        {/* Sección: Reportes Generados */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400`}
        >
          <h1 className="text-3xl font-bold text-black">Reportes Generados</h1>
          <h4 className="text-green-800 text-2xl mt-3">
            22 archivos <FontAwesomeIcon icon={faUpload} />
            <p>Último Generado hace 4 días</p>
          </h4>
        </div>

        {/* Sección: Documentos Pendientes */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400`}
        >
          <h1 className="text-3xl font-bold text-black">
            Documentos Pendientes
          </h1>
          <h4 className="text-green-800 text-2xl mt-3">
            11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
            <p>Último Documento enviado hace 5 días</p>
          </h4>
        </div>
      </div>
    </div>
  );
}
