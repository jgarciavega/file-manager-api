"use client";

import Link from "next/link";
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

  const toggleMenu = (menu) => {
    setOpenMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  };

  const toggleSidebar = () => {
    isSidebarCollapsed(!isSidebarCollapsed);
    if (!isSidebarCollapsed) setOpenMenus([]);
  };

  const toggleUserInfo = () => {
    setUserInfoOpen(!isUserInfoOpen);
  };

  useEffect(() => {
    if (isSidebarCollapsed) setOpenMenus([]);
  }, [isSidebarCollapsed]);

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
            <div className="sidebar-logo">
              <Image
                src="/api.jpg"
                alt="API-BCS Logo"
                width={650}
                height={10}
                priority={true}
              />
            </div>
            <ul className="space-y-10 mt-36">
              <li className="font-bold text-red-800 flex items-center">
                <FontAwesomeIcon
                  icon={faBoxes}
                  className="mr-3 text-blue-400"
                  size="2x"
                />
                <a
                  onClick={() => toggleMenu("file")}
                  className="cursor-pointer flex-grow"
                >
                  Gestión de archivos
                </a>
                <span>{openMenus.includes("file") ? "−" : "+"}</span>
              </li>

              {openMenus.includes("file") && (
                <ul className="pl-10 text-violet-500 space-y-3">
                  <li className="font-bold text-violet-500">
                    <a href="/dashboard/upload" className="flex items-center">
                      <FontAwesomeIcon
                        icon={faUpload}
                        className="mr-2 text-blue-400"
                        size="1x"
                      />
                      Subir Documento
                    </a>
                  </li>

                  <li className="font-bold text-violet-500">
                    <Link
                      href="/dashboard/status"
                      className="flex items-center"
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="mr-2 text-blue-400"
                        size="1x"
                      />
                      Estado del Documento
                    </Link>
                  </li>

                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="mr-2" />{" "}
                    Favoritos/Marcados
                  </li>
                </ul>
              )}

              <li className="font-bold text-red-800 flex items-center">
                <FontAwesomeIcon
                  icon={faThumbtack}
                  className="mr-3 text-blue-400"
                  size="2x"
                />
                <a
                  onClick={() => toggleMenu("task")}
                  className="cursor-pointer flex-grow"
                >
                  Tareas Pendientes
                </a>
                <span>{openMenus.includes("task") ? "−" : "+"}</span>
              </li>
              {openMenus.includes("task") && (
                <ul className="pl-10 text-violet-500 space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{" "}
                    Documentos Pendientes de Validación
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />{" "}
                    Verificación de Cumplimiento LEA-BCS
                  </li>
                </ul>
              )}

              <li className="font-bold text-red-800 flex items-center">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="mr-3 text-blue-400"
                  size="2x"
                />
                <a
                  onClick={() => toggleMenu("reports")}
                  className="cursor-pointer flex-grow"
                >
                  Consultas & Reportes
                </a>
                <span>{openMenus.includes("reports") ? "−" : "+"}</span>
              </li>
              {openMenus.includes("reports") && (
                <ul className="pl-10 text-violet-500 space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />{" "}
                    Historial de Consultas
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" /> Informes
                  </li>
                </ul>
              )}

              <li className="font-bold text-red-800 flex items-center">
                <FontAwesomeIcon
                  icon={faCog}
                  className="mr-3 text-blue-400"
                  size="2x"
                />
                <a
                  onClick={() => toggleMenu("settings")}
                  className="cursor-pointer flex-grow"
                >
                  Configuración & Ayuda
                </a>
                <span>{openMenus.includes("settings") ? "−" : "+"}</span>
              </li>
              {openMenus.includes("settings") && (
                <ul className="pl-10 text-violet-500 space-y-3">
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />{" "}
                    Ajustes
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" /> Ayuda
                  </li>
                </ul>
              )}

              <li
                className="font-bold cursor-pointer mt-12 text-gray-500 flex items-center"
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
              <p className=" font-bold text-black-800 mt-2">{user.name}</p>
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
