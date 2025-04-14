"use client";

import { useState } from "react";
import Image from "next/image";
import avatarMap from "../../lib/avatarMap";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUpload,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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
      <nav className="relative flex items-center justify-between mr-auto px-4 py-12 bg-white shadow-md w-full h-64">
        <div className="flex flex-col items-start ml-8">
          <h1 className="!text-2xl font-extrabold text-red-800 mt-12 tracking-wide">
            <p>GESTOR DE ARCHIVOS</p>
          </h1>
          <h1 className="!text-3xl font-extrabold text-blue-950 mt-2 tracking-wide">
            <p>Puerto de Pichilingue</p>
          </h1>
        </div>

        {/* 🔹 Buscador */}
        <div className="flex-grow flex justify-center">
          <div className="w-[500px] flex items-center px-4 py-2 border border-gray-800 rounded-lg bg-white shadow-sm">
            <span className="text-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
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
              placeholder="Buscar aquí..."
              className="w-full border-none bg-transparent px-3 text-gray-800 focus:outline-none"
            />
          </div>
        </div>

        {/* 🔹 Botón Hamburguesa */}
        <button
          onClick={toggleSidebar}
          className="text-blue-800 ml-auto text-3xl p-4 hover:bg-gray-400 rounded-md transition"
        >
          <FontAwesomeIcon size="2xl" icon={faBars} />
        </button>
      </nav>

      {/* 🔹 Sección de Bienvenida SOBRE la imagen */}
      <div className="relative shadow-md w-full">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={600}
          height={400}
          className="rounded-lg"
        />

        <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-8 bg-black bg-opacity-50 rounded-l-lg text-white">
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
        </div>
      </div>

      {/* 🔹 Reportes y Documentos pendientes */}
      <div
        className={`${styles.container} p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}
      >
        {/* 🔹 Reportes Generados */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}
        >
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={reportesActivos}
              onChange={() => setReportesActivos(!reportesActivos)}
            />
            <div className="w-14 h-8 bg-gray-800 rounded-full peer-checked:bg-blue-500 transition duration-300"></div>
            <div className="w-6 h-6 bg-white rounded-full shadow absolute top-[2px] left-1 peer-checked:left-7 transition-transform duration-300"></div>
          </label>
          <h1 className="text-3xl font-bold text-black">Reportes Generados</h1>
          <h4 className="text-green-800 text-2xl mt-3">
            22 archivos <FontAwesomeIcon icon={faUpload} />
            <p>Último Generado hace 4 días</p>
          </h4>
        </div>

        {/* 🔹 Documentos Pendientes */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}
        >
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={documentosActivos}
              onChange={() => setDocumentosActivos(!documentosActivos)}
            />
            <div className="w-14 h-8 bg-gray-800 rounded-full peer-checked:bg-blue-500 transition duration-300"></div>
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
    </>
  );
}
