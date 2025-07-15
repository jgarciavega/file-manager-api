"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import styles from "./Sidebar.module.css";
import Image from "next/image";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import admMap from "../../../lib/admMap";
import avatarMap from "../../../lib/avatarMap";
import profesionMap from "../../../lib/profesionMap";
import { faSearch, faMicrophone } from "@fortawesome/free-solid-svg-icons";
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
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Inicializa reconocimiento de voz 
  useEffect(() => {
    if (typeof window !== "undefined" && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-MX";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setGlobalSearch(transcript);
        setIsListening(false);
        // Ejecuta búsqueda automáticamente
        router.push(`/dashboard/busqueda?query=${encodeURIComponent(transcript)}`);
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [router, setGlobalSearch]);

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
      confirmButtonColor: "#0026e9",
      cancelButtonColor: "#ed1c24",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/");
      }
    });
  };

  const handleMicClick = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Reconocimiento de voz no soportado',
        text: 'Tu navegador no soporta reconocimiento de voz.',
      });
    }
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
        { label: "Bitácora", href: "/dashboard/bitacora", icon: faHistory },
        { label: "Informes", href: "/dashboard/informes", icon: faChartBar },
      ],
    },
    {
      key: "settings",
      label: "Configuración & Ayuda",
      icon: faCog,
      sub: [
        { label: "Ajustes", href: "/dashboard/ajustes", icon: faCog },
        { label: "Ayuda", href: "/dashboard/ayuda", icon: faArrowLeft },
      ],
    },
  ];

  // Filtrado de submenús según búsqueda
  const filteredMenus = menuOptions.map(menu => {
    const filteredSub = menu.sub.filter(sub => sub.label.toLowerCase().includes(search.toLowerCase()));
    return { ...menu, sub: filteredSub };
  }).filter(menu => menu.label.toLowerCase().includes(search.toLowerCase()) || menu.sub.length > 0);

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

  return (
    <div className={styles["sidebar-container"]} style={{ borderLeft: 'none' }}>
      <aside
        className={`${styles.sidebar} ${isSidebarCollapsed ? styles["sidebar-collapsed"] : ""} bg-blue-50 border-r border-blue-200 shadow-lg transition-all duration-300`}
        role="navigation"
        aria-label="Menú principal"
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
                      ${openMenus.includes(menu.key) ? "bg-blue-200 ring-2 ring-blue-500 scale-105" : "bg-white hover:bg-blue-100"}`}
                  >
                    <FontAwesomeIcon icon={menu.icon} size="xl" className="text-blue-600 group-hover:text-blue-800 transition-all duration-200" />
                  </button>
                  {/* Submenú: solo visible si está abierto */}
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
              {/* Separador visual */}
              <li className="w-full border-t border-blue-200 my-4"></li>
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
            <div className="sidebar-logo mt-16 mb-2 flex flex-col items-center justify-center w-full">
              <Image
                src="/api.jpg"
                alt="Logo institucional"
                width={260}
                height={80}
                className="object-contain"
                priority
              />
            </div>
            {/* Buscador debajo del logo */}
            <div style={{ marginTop: 48 }} /> {/* Aumenta el margen superior aquí */}
            {/* Buscador eliminado: ahora solo en el Navbar */}
            {/* Más separación entre buscador y menú */}
            <div style={{ marginTop: 48 }} />
            <ul className="space-y-6 mt-4 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar bg-white/90 rounded-2xl shadow-lg px-2 py-4 border border-blue-100">
              {filteredMenus.map(menu => (
                <li key={menu.key} className="flex flex-col">
                  <div
                    className={`flex items-center group rounded-lg px-2 py-2 transition-all duration-300 cursor-pointer relative ${openMenus.includes(menu.key) ? "bg-blue-100/80" : "hover:bg-blue-50/80"}`}
                    onClick={() => toggleMenu(menu.key)}
                    tabIndex={0}
                    aria-expanded={openMenus.includes(menu.key)}
                    role="button"
                  >
                    {/* Barra azul institucional para menú activo */}
                    <span className={`absolute left-0 top-0 h-full w-2 rounded-l-xl transition-all duration-300 ${openMenus.includes(menu.key) ? "bg-blue-700" : "bg-transparent"}`}></span>
                    <FontAwesomeIcon
                      icon={menu.icon}
                      className="mr-3 text-blue-700 group-hover:text-blue-900 transition-all duration-200 text-3xl"
                    />
                    <span className="flex-grow text-xl font-bold text-blue-900 group-hover:text-blue-800 select-none" style={{ letterSpacing: '0.5px' }}>
                      {menu.label}
                    </span>
                    <span className="ml-2 text-2xl text-blue-400 select-none">{openMenus.includes(menu.key) ? "−" : "+"}</span>
                  </div>
                  {/* Submenú: animación suave y estilos claros */}
                  <div className={`transition-all duration-300 ease-in-out ${openMenus.includes(menu.key) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                      <ul className="pl-8 mt-2 space-y-1 border-l-2 border-blue-100 bg-blue-50 rounded-lg py-2 shadow-sm">
                        {menu.sub.map(sub => (
                          <li key={sub.label} className={`flex items-center font-medium text-base px-2 py-1 rounded-lg transition-all duration-200 ${window.location.pathname === sub.href ? "bg-blue-300/60 text-blue-900 font-bold" : "text-blue-700 hover:text-blue-900 hover:bg-blue-100"}`}>
                            <FontAwesomeIcon
                              icon={sub.icon}
                              className="mr-2 text-blue-500 bg-white rounded-full p-1 border border-blue-200 shadow-sm text-xl"
                            />
                            <a href={sub.href} className="flex items-center">
                              <span className="ml-1">{sub.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Separador visual entre grupos de menú */}
                  <div className="w-full border-t border-blue-100 my-2"></div>
                </li>
              ))}
              {/* Cerrar sesión */}
              <li className="w-full border-t border-blue-200 my-4"></li>
              <li
                className="font-bold cursor-pointer text-gray-500 flex items-center hover:text-red-700 transition-all duration-200"
                onClick={handleLogoutClick}
                tabIndex={0}
                role="button"
                aria-label="Cerrar sesión"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className="mr-2 text-red-500"
                  size="2x"
                />
                Cerrar sesión
              </li>
            </ul>
            {/* Información institucional en la parte inferior */}
            <div className="mt-12 flex flex-col items-center gap-1 select-none">
              <span className="text-xs text-blue-900 font-semibold tracking-widest">Sistema de Gestión Documental</span>
              <span className="text-xs text-blue-700 font-medium">LEA-BCS © 2025</span>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}