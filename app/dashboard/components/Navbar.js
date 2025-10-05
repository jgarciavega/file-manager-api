"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import avatarMap from "../../../lib/avatarMap";
import profesionMap from "../../../lib/profesionMap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUpload,
  faArrowLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";


export default function Navbar({ toggleSidebar }) {
  const [reportesActivos, setReportesActivos] = useState(false);
  const [documentosActivos, setDocumentosActivos] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("❌ Error al parsear el usuario:", err);
      }
    }
  }, []);

  if (!user) {
    return <div className="text-white p-4">Cargando usuario...</div>;
  }

  const email = user.email || "";
  const title = profesionMap[email] || user.nombre || "Usuario";
  const saludo = ["annel", "blanca", "hdelreal"].includes(email.split("@")[0])
    ? "Bienvenida"
    : "Bienvenido";

  return (
    <>
      <div className="relative shadow-md w-full bg-url('/inicio.webp') bg-cover bg-center overflow-hidden">
        <img
          src="/inicio.webp"
          alt="Imagen de Bienvenida"
          width={1600}
          height={400}
          className="w-full h-screen md:h-64 lg:h-screen object-cover opacity-70"
          priority
        />

        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full flex flex-col items-center justify-center p-6 bg-black bg-opacity-50 rounded-l-lg text-white">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="https://ui-avatars.com/api/?name=Usuario&background=random"
              alt="Avatar de usuario"
              className="w-20 h-20 rounded-full border-2 border-white"
            />
            <div>
              <h2 className="text-xl font-semibold">
                {saludo}, {title}
              </h2>
              <p className="text-sm">Tienes nuevos archivos para revisar</p>
            </div>
          </div>

          <button className="px-4 py-2 bg-transparent text-white border border-white rounded-md hover:bg-slate-200 hover:text-gray-950 hover:shadow-lg transition-all duration-300 flex items-center text-sm">
            Consultar
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>

          {/* Cuadros de Reportes y Documentos */}
          <div className="w-full flex flex-col md:flex-row gap-8 mt-40 justify-center items-stretch">
            {/* Reportes */}
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
              <h1 className="text-lg font-bold text-blue-900 dark:text-blue-200 mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-100 transition-colors">
                Reportes Generados
              </h1>
              <h4 className="text-green-700 dark:text-green-300 text-base font-semibold flex items-center gap-2 group-hover:text-green-900 dark:group-hover:text-green-200 transition-colors">
                22 archivos <FontAwesomeIcon icon={faUpload} />
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Último generado hace 4 días
              </p>
            </div>

            {/* Documentos */}
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
              <h1 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-1 group-hover:text-yellow-700 dark:group-hover:text-yellow-100 transition-colors">
                Documentos Pendientes
              </h1>
              <h4 className="text-orange-700 dark:text-orange-300 text-base font-semibold flex items-center gap-2 group-hover:text-orange-900 dark:group-hover:text-orange-200 transition-colors">
                11 Archivos <FontAwesomeIcon icon={faArrowLeft} />
              </h4>
              <p className="text-gray-700 dark:text-gray-300 text-xs mt-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                Último documento enviado hace 5 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
