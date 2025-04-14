"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import admMap from "../../lib/admMap";
import avatarMap from "../../lib/avatarMap";
import profesionMap from "../../lib/profesionMap";

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
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isSidebarCollapsed }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState([]);
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);

  const email = session?.user?.email || "";
  const fullName = session?.user?.name || "Usuario";

  const user = {
    name: fullName,
    email: email,
    avatar: avatarMap[email] || "/default-avatar.png",
    position: admMap[email] || "000",
    title: profesionMap[email] || "",
    workArea: "Contraloría", // puedes cambiar esto a dinámico más adelante
  };

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
        router.push("/");
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
                alt={user.name}
                width={650}
                height={10}
                className="rounded-full mx-auto mb-2"
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

                  <li className="font-bold text-violet-500">
                    <Link
                      href="/dashboard/favorites"
                      className="flex items-center"
                    >
                      <FontAwesomeIcon
                        icon={faStar}
                        className="mr-2 text-blue-400"
                        size="1x"
                      />
                      Favoritos
                    </Link>
                  </li>
                </ul>
              )}

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
                    />
                    Tareas Pendientes
                  </div>
                  <span>{openMenus.includes("task") ? "−" : "+"}</span>
                </a>

                {openMenus.includes("task") && (
                  <ul className="ml-6 mt-2 text-violet-500 space-y-2">
                    <li className="font-bold text-violet-500">
                      <Link
                        href="/dashboard/PendientesDeValidacion"
                        className="flex items-center hover:text-blue-600 transition"
                      >
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="mr-2 text-blue-400"
                        />
                        Pendientes de Validación
                      </Link>
                    </li>
                    <li className="flex items-center">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Verificación de LEA-BCS
                    </li>
                  </ul>
                )}
              </li>

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
                    <FontAwesomeIcon icon={faHistory} className="mr-2" />
                    Historial de Consultas
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Informes
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
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Ajustes
                  </li>
                  <li className="flex items-center">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Ayuda
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
                />
                Cerrar sesión
              </li>
            </ul>

            {/* Avatar e información de usuario */}
            <div
              className={`${styles["user-info"]} mt-12 cursor-pointer flex flex-col items-center gap-2`}
              onClick={toggleUserInfo}
            >
              <Image
                src={user.avatar}
                alt={`Avatar de ${user.name}`}
                width={80}
                height={80}
                className="rounded-full border-2 border-gray-600 object-cover"
              />
              <p className="font-bold text-black-800 mt-2">
                {user.title} {user.name}
              </p>

              {isUserInfoOpen && (
                <div className="bg-blue-300 text-white p-3 rounded-xl shadow-lg text-xs text-left w-48 border-2 border-yellow-400 mt-2">
                  <p className="mb-1">
                    <strong>👤 :</strong> {user.name}
                  </p>
                  <p className="mb-1">
                    <strong>📍 Área:</strong> {user.workArea}
                  </p>
                  <p className="mb-1">
                    <strong>🆔 ADM:</strong> {user.position}
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
