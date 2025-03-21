import { useState } from "react";
import { Bell } from "lucide-react";
import Image from "next/image";
import styles from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUpload,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ user, toggleSidebar }) {
  // Estados para los interruptores deslizables
  const [reportesActivos, setReportesActivos] = useState(false);
  const [documentosActivos, setDocumentosActivos] = useState(false);

  return (
    <>
      {/* 🔹 NAVBAR */}
      <nav className="relative flex items-center justify-between px-4 py-12 bg-white shadow-md w-full h-64">
        {/* 🔹 Contenedor del Logo y Título */}
        <div className="flex flex-col items-start">
       
          {/* 🔹 Título */}
          <div>
            <h1 className="text-2xl font-extrabold text-red-800 mt-1 tracking-wide">
              <p>Gestor de Archivos</p>
            </h1>

            <h1 className="text-2xl font-extrabold text-blue-950 mt-2 tracking-wide">
              <p>Puerto de Pichilingue </p>
            </h1>
          </div>
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
          className="text-blue-800 text-3xl p-3 hover:bg-gray-200 rounded-md transition"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </nav>

      {/* 🔹 Sección de Bienvenida */}
      <div className="relative shadow-md w-full">
        <Image
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          layout="responsive"
          width={600}
          height={400}
          className="rounded-lg"
        />
        <div className="absolute top-0 right-0 w-1/2 h-full flex items-center p-8 bg-black bg-opacity-50 rounded-lg">
          <div className="w-2/3 text-white text-justify">
            <h2 className="text-4xl font-semibold tracking-wide mb-4">
              Bienvenido
            </h2>
            <p className="text-lg leading-relaxed">
              Se han enviado a tu cuenta nuevos archivos, puedes revisarlos
              directamente mediante esta sección.
            </p>
            <button
              className="mt-6 px-6 py-3 bg-transparent text-white border border-white rounded-md  hover:bg-white hover:text-black hover:shadow-lg transition-all 
            duration-300 flex items-center"
            >
              Consultar
              <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 Sección de reportes y documentos pendientes */}
      <div
        className={`${styles.container} p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}
      >
        {/* 🔹 Reportes Generados */}
        <div
          className={`${styles.customBox} p-4 rounded-md shadow hover:bg-blue-400 relative`}
        >
          {/* 🔹 Botón deslizable */}
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={reportesActivos}
              onChange={() => setReportesActivos(!reportesActivos)}
            />
            <div className="w-14 h-8 bg-gray-800 rounded-full peer-checked:bg-blue-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition duration-300"></div>
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
          {/* 🔹 Botón deslizable */}
          <label className="absolute top-3 right-3 inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={documentosActivos}
              onChange={() => setDocumentosActivos(!documentosActivos)}
            />
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
    </>
  );
}
