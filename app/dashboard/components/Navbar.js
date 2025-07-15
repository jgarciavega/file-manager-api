"use client";

import { useState } from "react";
import Image from "next/image";
import avatarMap from "../../../lib/avatarMap";
import styles from "./Navbar.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUpload,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import NavbarGlobalSearch from "../../../components/NavbarGlobalSearch";

export default function Navbar({ user, toggleSidebar }) {
  const [reportesActivos, setReportesActivos] = useState(false);
  const [documentosActivos, setDocumentosActivos] = useState(false);

  const saludo = ["annel", "blanca", "hdelreal"].includes(
    user?.email?.split("@")[0]
  )
    ? "Bienvenida"
    : "Bienvenido";

  return (
    <>
      {/* 🔹 NAVBAR SUPERIOR */}
      <nav className="relative flex items-center justify-between mr-auto px-4 py-12 bg-white shadow-md w-full h-64 gap-6">
        <div className="flex flex-col items-start ml-8">
          <h1 className="!text-2xl font-extrabold text-red-800 mt-12 tracking-wide">
            <p>GESTOR DE ARCHIVOS</p>
          </h1>
          <h1 className="!text-3xl font-extrabold text-blue-950 mt-2 tracking-wide">
            <p>Puerto de Pichilingue</p>
          </h1>
        </div>

        {/* 🔹 Buscador global (input + micrófono) */}
        <div className="flex-1 flex justify-center">
          <NavbarGlobalSearch />
        </div>

        {/* 🔹 Botón Hamburguesa */}
        <button
          onClick={toggleSidebar}
          className="text-blue-800 ml-auto text-3xl p-4 hover:bg-gray-400 rounded-md transition"
        >
          <FontAwesomeIcon size="2xl" icon={faBars} />
        </button>
      </nav>

      {/* 🔹 Sección de Bienvenida SOBRE la imagen y tarjetas integradas */}
      <div className="relative shadow-md w-full">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={600}
          height={400}
          className="rounded-lg"
        />

        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center p-8 bg-black bg-opacity-50 rounded-l-lg text-white">
          <Image
            src={user.avatar}
            alt={`Avatar de ${user.name}`}
            width={180}
            height={100}
            className="rounded-full border-4 border-white mb-4"
          />
          <h2 className="text-3xl font-semibold tracking-wide mb-2 text-center">
            {saludo}: {user.title}
          </h2>
          <p className="text-lg leading-relaxed text-center">
            Se han enviado a tu cuenta nuevos archivos, puedes revisarlos
            directamente mediante esta sección.
          </p>
          <button className="mt-6 px-6 py-3 bg-transparent text-white border border-white rounded-md hover:bg-white hover:text-black hover:shadow-lg transition-all duration-300 flex items-center">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>

          {/* Cuadros de Reportes y Documentos más grandes y más abajo */}
          <div className="w-full flex flex-col md:flex-row gap-8 mt-40 justify-center items-stretch">
            {/* Reportes Generados */}
            <div
              className="flex-1 min-w-[260px] max-w-lg bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900 dark:via-blue-950 dark:to-gray-900 p-10 rounded-3xl border-2 border-blue-400 dark:border-blue-700 shadow-2xl hover:shadow-blue-300 dark:hover:shadow-blue-900 hover:scale-105 hover:border-blue-600 dark:hover:border-blue-300 transition-all duration-300 relative group cursor-pointer"
            >
              <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={reportesActivos}
                  onChange={() => setReportesActivos(!reportesActivos)}
                />
                <div className="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-blue-500 transition duration-300"></div>
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-[2px] left-1 peer-checked:left-5 transition-transform duration-300"></div>
              </label>
              <h1 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-100 transition-colors">Reportes Generados</h1>
              <h4 className="text-green-700 dark:text-green-300 text-base font-semibold flex items-center gap-2 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">
                22 archivos <FontAwesomeIcon icon={faUpload} />
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Último generado hace 4 días</p>
            </div>

            {/* Documentos Pendientes */}
            <div
              className="flex-1 min-w-[260px] max-w-lg bg-gradient-to-br from-yellow-100 via-yellow-50 to-white dark:from-yellow-900 dark:via-yellow-950 dark:to-gray-900 p-10 rounded-3xl border-2 border-yellow-400 dark:border-yellow-700 shadow-2xl hover:shadow-yellow-200 dark:hover:shadow-yellow-900 hover:scale-105 hover:border-yellow-600 dark:hover:border-yellow-300 transition-all duration-300 relative group cursor-pointer"
            >
              <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={documentosActivos}
                  onChange={() => setDocumentosActivos(!documentosActivos)}
                />
                <div className="w-10 h-6 bg-gray-300 dark:bg-gray-700 rounded-full peer-checked:bg-yellow-500 transition duration-300"></div>
                <div className="w-5 h-5 bg-white rounded-full shadow absolute top-[2px] left-1 peer-checked:left-5 transition-transform duration-300"></div>
              </label>
              <h1 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-1 group-hover:text-yellow-700 dark:group-hover:text-yellow-100 transition-colors">Documentos Pendientes</h1>
              <h4 className="text-orange-700 dark:text-orange-300 text-base font-semibold flex items-center gap-2 group-hover:text-orange-900 dark:group-hover:text-orange-200 transition-colors">
                11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">Último documento enviado hace 5 días</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
