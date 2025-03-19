"use client";
import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUpload, faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user, toggleSidebar }) {
  return (
    <>
      {/* 🔹 NAVBAR */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* 🔹 Botón Hamburguesa */}
        <button onClick={toggleSidebar} className="text-blue-800">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </nav> {/* ✅ Ahora el Navbar está correctamente cerrado */}

      {/* 🔹 Contenido Principal */}
      <div className={`navbar flex flex-col w-full ${styles.navbar}`}>
        {/* 🔹 Título principal */}
        <div className="image-container">
          <div className="title-container">
            GESTOR DE ARCHIVOS PUERTO PICHILINGUE
          </div>
        </div>

        <div className="navbar-logo flex items-center justify-start">
          {/* 🔹 Logo */}
          <div className="navbar-logo flex items-left justify-start ml-0 pl-0">
            <Image
              src="/api.jpg"
              alt="API-BCS Logo"
              width={800}
              height={200}
              className="object-contain"
            />
          </div>

          {/* 🔹 Buscador */}
          <div className="w-[800px] navbar-search flex items-center px-8 border border-black rounded-lg hover:border-blue-500 transition-colors duration-300">
            <div className="flex items-center">
              <span className="px-2 text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M16.35 16.35A7.5 7.5 0 101 13a7.5 7.5 0 0015.35 3.35zm0 0L21 21"/>
                </svg>
              </span>
              <input type="text" placeholder="Buscar aquí........" className="w-[300px] border-none rounded-r-lg px-4 py-3 text-black focus:outline-none" />
            </div>
          </div>
        </div> {/* ✅ Cierra correctamente el navbar-logo */}

        {/* 🔹 Imagen de bienvenida con mensaje */}
        <div className="relative shadow-md w-full">
          <Image src="/inicio.webp" alt="Imagen de Bienvenida" layout="responsive" width={600} height={400} className="rounded-lg" />
          <div className="absolute top-0 right-1 p-6 bg-black bg-opacity-40 rounded-lg w-full md:w-1/2 h-full flex flex-col justify-start items-center">
            <h2 className="text-4xl font-semibold text-blue-150 mt-64 tracking-wide">
              Bienvenido
            </h2>
            <p className="text-white mt-12 text-light text-xl text-center">
              Se han enviado a tu cuenta nuevos archivos, puedes revisarlos directamente mediante esta sección.
            </p>
            <button className="mt-8 px-6 py-2 bg-transparent text-white border border-white rounded-md hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 flex items-center">
              Consultar
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        </div>

        {/* 🔹 Sección de reportes y documentos pendientes */}
        <div className={`${styles.container} p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {/* 🔹 Reportes Generados */}
          <div className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}>
            <h1 className="text-3xl font-bold text-black">Reportes Generados</h1>
            <h4 className="text-green-800 text-2xl mt-3">
              22 archivos <FontAwesomeIcon icon={faUpload} />
              <p>Último Generado hace 4 días</p>
            </h4>
          </div>

          {/* 🔹 Documentos Pendientes */}
          <div className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}>
            <h1 className="text-3xl font-bold text-black">
              Documentos Pendientes
            </h1>
            <h4 className="text-green-800 text-2xl mt-3">
              11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
              <p>Último Documento enviado hace 5 días</p>
            </h4>
          </div>
        </div>
      </div> {/* ✅ Cierra correctamente el div principal */}
    </>
  );
}
