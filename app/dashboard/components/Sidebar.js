"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import admMap from "../../../lib/admMap";
import avatarMap from "../../../lib/avatarMap";
import profesionMap from "../../../lib/profesionMap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useGlobalSearch } from "../../context/GlobalSearchContext";

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
  faArrowLeft,
  faFolderOpen, // <-- Importa el icono de carpeta abierta
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isSidebarCollapsed }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { globalSearch, setGlobalSearch } = useGlobalSearch();
  const [openMenus, setOpenMenus] = useState([]);
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);
  const [search, setSearch] = useState("");

  const email = session?.user?.email || "";
  const fullName = session?.user?.name || "Usuario";

  const user = {
    name: fullName,
    email: email,
    avatar: avatarMap[email] || "/default-avatar.png",
    position: admMap[email] || "000",
    title: profesionMap[email] || "",
    workArea: "Contraloría",
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

  // Opciones de menú y submenú para filtrar
  const menuOptions = [
    {
      key: "file",
      label: "Gestión de archivos",
      icon: faBoxes,
      sub: [
        { label: "Subir Documento", href: "/dashboard/upload", icon: faUpload },
        { label: "Estado del Documento", href: "/dashboard/estado-documento", icon: faCheck },
        { label: "Favoritos", href: "/dashboard/favorites", icon: faStar },
        { label: "Mis Documentos", href: "/dashboard/mis-documentos", icon: faFolderOpen },
      ],
    },
    {
      key: "task",
      label: "Tareas Pendientes",
      icon: faThumbtack,
      sub: [
        { label: "Pendientes de Validación", href: "/dashboard/PendientesDeValidacion", icon: faTasks },
        { label: "Verificación de LEA-BCS", href: "/dashboard/verification", icon: faFileAlt },
      ],
    },
    {
      key: "reports",
      label: "Consultas & Reportes",
      icon: faChartBar,
      sub: [
        { label: "Historial de Consultas", href: "#", icon: faHistory },
        { label: "Informes", href: "#", icon: faChartBar },
      ],
    },
    {
      key: "settings",
      label: "Configuración & Ayuda",
      icon: faCog,
      sub: [
        { label: "Ajustes", href: "#", icon: faCog },
        { label: "Ayuda", href: "#", icon: faArrowLeft },
      ],
    },
  ];

  // Filtrado de submenús según búsqueda
  const filteredMenus = menuOptions.map(menu => {
    const filteredSub = menu.sub.filter(sub => sub.label.toLowerCase().includes(search.toLowerCase()));
    return { ...menu, sub: filteredSub };
  }).filter(menu => menu.label.toLowerCase().includes(search.toLowerCase()) || menu.sub.length > 0);

  return (
    <div className={styles["sidebar-container"]} style={{ borderLeft: 'none' }}>
      <aside
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles["sidebar-collapsed"] : ""
        }`}
        style={isSidebarCollapsed ? { backgroundColor: '#18181b' } : { backgroundColor: '#fff' }}
      >
        {/* Menú colapsado: solo íconos principales y submenús al hacer clic, SIN input de búsqueda */}
        {isSidebarCollapsed ? (
          <>
            {/* Solo íconos principales y submenús, sin input de búsqueda */}
            <ul className="flex flex-col items-center mt-8 space-y-8">
              {filteredMenus.map(menu => (
                <li key={menu.key}>
                  <button
                    title={menu.label}
                    onClick={() => toggleMenu(menu.key)}
                    className={`group focus:outline-none flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 shadow-md
                      ${openMenus.includes(menu.key) ? "bg-blue-100 ring-2 ring-blue-400" : "bg-white hover:bg-blue-50"}`}
                  >
                    <FontAwesomeIcon icon={menu.icon} size="xl" className="text-blue-500 group-hover:text-blue-700 transition-all duration-200" />
                  </button>
                  {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                    <ul className="flex flex-col items-center space-y-4 mt-2">
                      {menu.sub.map(sub => (
                        <li key={sub.label}>
                          <a href={sub.href} title={sub.label}
                            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-100 shadow-lg transition-all duration-200 border border-blue-200"
                          >
                            <FontAwesomeIcon icon={sub.icon} style={{color:'#2563eb', fontSize:'2rem'}} className="group-hover:text-blue-700 transition-all duration-200" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {/* Cerrar sesión */}
              <li>
                <span title="Cerrar sesión" onClick={handleLogoutClick}
                  className="group flex items-center justify-center w-14 h-14 rounded-full bg-white hover:bg-red-100 shadow transition-all duration-200 cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} size="lg" className="text-red-500 group-hover:text-red-700" />
                </span>
              </li>
            </ul>
          </>
        ) : (
          <>
            <div className="sidebar-logo mt-8">
              <Image
                src="/api.jpg"
                alt={user.name}
                width={650}
                height={10}
                className="rounded-full mx-auto mb-2"
              />
            </div>
            {/* Buscador debajo del logo */}
            <div style={{ marginTop: 48 }} /> {/* Aumenta el margen superior aquí */}
            <div className="flex items-center justify-center py-4 px-4">
              <input
                type="text"
                value={globalSearch}
                onChange={e => setGlobalSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && globalSearch.trim()) {
                    router.push(`/dashboard/busqueda?query=${encodeURIComponent(globalSearch)}`);
                  }
                }}
                placeholder="Buscar documentos..."
                className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-800 border-2 border-blue-500 focus:ring-2 focus:ring-blue-400 focus:border-blue-700 hover:border-blue-700 transition-all duration-200 outline-none"
                style={{ boxShadow: '0 1px 4px 0 rgba(0,0,0,0.04)' }}
              />
            </div>
            {/* Más separación entre buscador y menú */}
            <div style={{ marginTop: 48 }} />
            <ul className="space-y-6 mt-2 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar">
              {filteredMenus.map(menu => (
                <li key={menu.key} className="flex flex-col">
                  <div className="flex items-center group">
                    <FontAwesomeIcon
                      icon={menu.icon}
                      className="mr-3 text-blue-600 group-hover:text-blue-800 transition"
                      size="2x"
                    />
                    <span
                      onClick={() => toggleMenu(menu.key)}
                      className="cursor-pointer flex-grow text-xl font-bold text-gray-900 group-hover:text-blue-700 select-none"
                      style={{ letterSpacing: '0.5px' }}
                    >
                      {menu.label}
                    </span>
                    <span className="ml-2 text-2xl text-gray-400 select-none">{openMenus.includes(menu.key) ? "−" : "+"}</span>
                  </div>
                  {/* Submenú: justo debajo, con separación y estilos claros */}
                  {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                    <ul className="pl-8 mt-2 space-y-1 border-l-2 border-blue-100 bg-blue-50 rounded-lg py-2 shadow-sm">
                      {menu.sub.map(sub => (
                        <li key={sub.label} className="flex items-center font-medium text-base text-violet-700 hover:text-blue-900 transition px-2 py-1 rounded-lg hover:bg-blue-100">
                          <FontAwesomeIcon
                            icon={sub.icon}
                            className="mr-2 text-violet-500 bg-white rounded-full p-1 border border-blue-200 shadow-sm"
                            size="lg"
                          />
                          <a href={sub.href} className="flex items-center">
                            <span className="ml-1">{sub.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              {/* Cerrar sesión */}
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
            {/* Información de usuario */}
            <div
              className={`${styles["user-info"]} mt-12 cursor-pointer flex flex-col items-center gap-2`}
              onClick={toggleUserInfo}
            >
              <p className="font-bold text-black-800 mt-12 text-black">
                {user.title}
              </p>

              {isUserInfoOpen && (
                <div className="bg-blue-600 text-black p-3 rounded-xl shadow-lg text-left w-48 border-6 border-yellow-400 mt-1">
                  <p className="mb-3">
                    <strong>👤 :</strong> {user.name}
                  </p>
                  <p className="mb-3">
                    <strong>📍 Área:</strong> {user.workArea}
                  </p>
                  <p className="mb-3">
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