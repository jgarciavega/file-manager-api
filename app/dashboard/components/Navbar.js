"use client";

import { Bell } from "lucide-react";
import SearchBar from "./SearchBar";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faArrowLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user }) {
  return (
    <div className={`navbar flex flex-col w-full ${styles.navbar}`}>
      {/* 🔹 Barra superior con logo, buscador y notificaciones */}
      <div className="flex items-center justify-between w-full p-1 bg-[#fff] shadow-md">
        <div className="flex items-start">
          <Image
            src="/api.jpg"
            alt="API-BCS Logo"
            width={400}
            height={150}
            className="w-auto h-512"
          />
        </div>

        {/* 🔹 Buscador y notificaciones */}
        <div className="flex items-center justify-center mx-20">
  <div className="flex-grow">
    <input
      type="text"
      placeholder="Buscar..."
      className="w-full md:w-auto border-2 border-black rounded-lg px-56 py-4 text-gray-700 focus:outline-none focus:placeholder focus:ring-blue-300 hover:border-blue-500"
      aria-label="Buscar"
    />
  </div>
  <div className="flex-shrink- ml-80">
    <button className="relative" aria-label="Notificaciones">
      <Bell className="w-6 h-6 text-gray-600" />
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
    </button>
  </div>
</div>

      </div>

      {/* 🔹 Título principal */}
      <div className="bg-white shadow-md p-6 w-full text-center">
        <h2 className="text-5xl font-bold text-gray-800">
          {"Gestor de Archivos Puerto Pichilingue".toUpperCase() }
        </h2>
      </div>

      {/* 🔹 Imagen de bienvenida con mensaje */}
      <div className="relative shadow-md -p-1 w-full -mt-2">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={700}
          height={400}
          className="rounded-lg"
        />
        <div className="absolute top-0 right-1 p-2 bg-black bg-opacity-40 rounded-lg -m-3 w-full md:w-1/2 h-full flex flex-col justify-start">
          <h2 className="text-5xl font-bold text-blue-150 mt-96 ">Bienvenido</h2>
          <p className="text-white mt-8 text-light text-3xl">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos directamente mediante esta sección.
          </p>
          <button className="mt-4 px-3 py-1 bg-transparent text-white border-2 border-white rounded-lg hover:bg-blue-500 flex items-center justify-between">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>

      {/* 🔹 Sección de reportes y documentos pendientes */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-4 px-4">
  {/* 🔹 Reportes generados */}
  <div className={styles.container}>
    <h1 className="text-xl font-bold text-black">Reportes Generados</h1>
    <h4 className="text-black mt-3">
      22 archivos <FontAwesomeIcon icon={faUpload} />
      <h5>Último Generado hace 4 días</h5>
    </h4>
  </div>

  {/* 🔹 Documentos pendientes */}
  <div className={styles.container}>
    <h1 className="text-xl font-bold text-black">Documentos Pendientes</h1>
    <h4 className="text-black mt-3">
      11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
      <h5>Último Documento enviado hace 5 días</h5>
    </h4>
  </div>
</div>
    </div>
  );
}
