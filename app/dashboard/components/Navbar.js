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

      <div className="navbar-logo flex items-center justify-start">
        {/* Logo */}
        <div className="navbar-logo flex items-left justify-start">
          <Image
            src="/api.jpg"
            alt="API-BCS Logo"
            width={800} // Tamaño que mencionaste
            height={200}
            className="object-contain"
          />
        </div>

        {/* Buscador */}
        <div className="w-[800px] navbar-search flex items-center px-8 border border-black rounded-lg hover:border-blue-500 transition-colors duration-300">
          <div className="flex items-center">
            <span className="px-2 text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16.35 16.35A7.5 7.5 0 101 13a7.5 7.5 0 0015.35 3.35zm0 0L21 21"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar aquí........"
              className="w-[300px] border-none rounded-r-lg px-4 py-3 text-black focus:outline-none"
            />
          </div>
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
        <div className="absolute top-0 right-1 p-6 bg-black bg-opacity-40 rounded-lg w-full md:w-1/2 h-full flex flex-col justify-start items-center">
          <h2 className="text-4xl font-semibold text-blue-150 mt-64 tracking-wide">
            Bienvenido
          </h2>
          <p className="text-white mt-12 text-light text-xl text-center">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos
            directamente mediante esta sección.
          </p>

          <button className="mt-8 px-6 py-2 bg-transparent text-white border border-white rounded-md hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 flex items-center">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>
        </div>
      </div>

      {/* 🔹 Sección de reportes y documentos pendientes */}
      <div
        className={`${styles.container} p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}
      >
        {/* Sección: Reportes Generados */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}
        >
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-800 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition duration-300"></div>
            <div className="w-6 h-6 bg-white rounded-full shadow absolute top-[2px] left-1 peer-checked:left-7 transition-transform duration-300"></div>
          </label>
          <h1 className="text-3xl font-bold text-black">Reportes Generados</h1>
          <h4 className="text-green-800 text-2xl mt-3">
            22 archivos <FontAwesomeIcon icon={faUpload} />
            <p>Último Generado hace 4 días</p>
          </h4>
        </div>

        {/* Sección: Documentos Pendientes */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}
        >
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-14 h-8 bg-gray-800 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition duration-300"></div>
            <div className="w-6 h-6 bg-white rounded-full shadow absolute top-[2px] left-1 peer-checked:left-7 transition-transform duration-300"></div>
          </label>
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
