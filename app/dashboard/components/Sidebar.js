"use client";

import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faUpload,
  faCheck,
  faStar,
  faHistory,
  faFileAlt,
  faTasks,
  faSignOutAlt,
  faCog,
  faChartBar,
  faThumbtack,
  faBoxes,
  faFolderTree,
  faFileLines,
} from "@fortawesome/free-solid-svg-icons";


export default function Sidebar({ user, isSidebarCollapsed }) {
  const [openMenus, setOpenMenus] = useState([]);
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);

  // Abrir/cerrar menús
  const toggleMenu = (menu) => {
    setOpenMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  // Colapsar Sidebar
  const toggleSidebar = () => {
    isSidebarCollapsed(!isSidebarCollapsed);
    if (!isSidebarCollapsed) setOpenMenus([]);
  };

  // Mostrar información usuario
  const toggleUserInfo = () => {
    setUserInfoOpen(!isUserInfoOpen);
    console.log("Estado de isUserInfoOpen:", !isUserInfoOpen);
  };

  useEffect(() => {
    if (isSidebarCollapsed) setOpenMenus([]);
  }, [isSidebarCollapsed]);

  /*confirmacion de cierre de sesion */
  const handleLogoutClick = () => {
    Swal.fire({
      title: "Cerrar sesión",
      text: "¿Seguro que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        //cierre de sesión real
        console.log("Sesión cerrada");
      }
    });
  };

  return (
    <div className={styles["sidebar-container"]}>
      <aside
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles["sidebar-collapsed"] : ""
        }`}
      >
        {!isSidebarCollapsed && (
          <>
            <h1 className="text-3xl font-semibold text-gray-800 mb-4"> </h1>
            <ul className="space-y-4">
              {/* Gestión de archivos */}
              <li className="font-bold text-red-800">
                <a
                  onClick={() => toggleMenu("file")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faBoxes}
                      className="mr-2 text-blue-400"
                      size="2x"
                    />{" "}
                    Gestión de archivos
                  </div>
                  <span>{openMenus.includes("file") ? "−" : "+"}</span>
                </a>
                {openMenus.includes("file") && (
                  <ul
                    className={`ml-6 text-violet-500 mt-2 space-y-2 ${
                      styles["sub-menu"]
                    } ${openMenus.includes("file") ? styles["open"] : ""}`}
                  >
                    <li>
                      <FontAwesomeIcon icon={faUpload} className="mr-2" /> Subir
                      Documentos
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Estado
                      del Documento
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faStar} className="mr-2" />{" "}
                      Favoritos/Marcados
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />{" "}
                      Historial de Consultas
                    </li>
                  </ul>
                )}
              </li>

              {/* Tareas Pendientes */}
              <li className="font-bold text-red-800">
                <a
                  onClick={() => toggleMenu("task")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faThumbtack}
                      className="mr-2 text-blue-400"
                      size="2x"
                    />{" "}
                    Tareas Pendientes
                  </div>
                  <span>{openMenus.includes("task") ? "−" : "+"}</span>
                </a>
                {openMenus.includes("task") && (
                  <ul
                    className={`ml-6 mt-2 text-violet-500 space-y-2 ${
                      styles["sub-menu"]
                    } ${openMenus.includes("task") ? styles["open"] : ""}`}
                  >
                    <li>
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{" "}
                      Documentos Pendientes de Validación
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />{" "}
                      Verificación de Cumplimiento LEA-BCS
                    </li>
                  </ul>
                )}
              </li>

              {/* Consultas & Reportes */}
              <li className="font-bold text-red-800">
                <a
                  onClick={() => toggleMenu("reports")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faFileLines}
                      className="mr-2 text-blue-400"
                      size="2x"
                    />
                    Consultas & Reportes
                  </div>
                  <span>{openMenus.includes("reports") ? "−" : "+"}</span>
                </a>
                {openMenus.includes("reports") && (
                  <ul
                    className={`ml-6 mt-2 text-violet-500 space-y-2 ${
                      styles["sub-menu"]
                    } ${openMenus.includes("reports") ? styles["open"] : ""}`}
                  >
                    <li>
                      <FontAwesomeIcon icon={faHistory} className="mr-2" />{" "}
                      Historial de Consultas
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />{" "}
                      Informes
                    </li>
                  </ul>
                )}
              </li>

              {/* Configuración & Ayuda */}
              <li className="font-bold text-red-800">
                <a
                  onClick={() => toggleMenu("settings")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <FontAwesomeIcon
                      icon={faCog}
                      className="mr-2 text-blue-400"
                      size="2x"
                    />{" "}
                    Configuración & Ayuda
                  </div>
                  <span>{openMenus.includes("settings") ? "−" : "+"}</span>
                </a>
                {openMenus.includes("settings") && (
                  <ul
                    className={`ml-6 mt-2 text-violet-500 space-y-2 ${
                      styles["sub-menu"]
                    } ${openMenus.includes("settings") ? styles["open"] : ""}`}
                  >
                    <li>
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{" "}
                      Ajustes
                    </li>
                    <li>
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Ayuda
                    </li>
                  </ul>
                )}
              </li>

              {/* Cerrar sesión */}
              <li
                className="font-bold cursor-pointer mt-12 text-gray-500"
                onClick={handleLogoutClick}
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="mr-2 text-red-500"
                  size="2x"
                />{" "}
                Cerrar sesión
              </li>
            </ul>

            /*Avatar */
            <div
              className={`${styles["user-info"]} mt-20 flex items-center gap-3`}
              onClick={toggleUserInfo}
            >
              <Image
                src={user.avatar}
                alt="Usuario"
                width={120}
                height={100}
                className="rounded-full border border-gray-800"
              />
              <p className=" font-bold text-blue-800 mt-2">{user.name}</p>
              {isUserInfoOpen && (
                <div className={styles["user-details"]}>
                  <p>
                    <strong>Nombre:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Área :</strong> {user.workArea}
                  </p>
                  <p>
                    <strong>ADM:</strong> {user.position}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
