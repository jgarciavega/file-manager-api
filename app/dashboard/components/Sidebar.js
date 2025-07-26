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
  faCircleInfo,
  faFolderOpen,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ isCollapsed = false, onToggleCollapse }) {
  const darkMode = true;
  const { data: session } = useSession();
  const router = useRouter();
  const { globalSearch, setGlobalSearch } = useGlobalSearch();
  const [openMenus, setOpenMenus] = useState([]);
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    setCollapsed((prev) => !prev);
  };

  // Inicializa reconocimiento de voz
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
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

  const toggleUserInfo = () => {
    setUserInfoOpen(!isUserInfoOpen);
  };

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
        icon: "info",
        title: "Reconocimiento de voz no soportado",
        text: "Tu navegador no soporta reconocimiento de voz.",
      });
    }
  };

  // Opciones de menú y submenú para filtrar
  const menuOptions = [
    {
      key: "file",
      label: "GESTION DE ARCHIVOS",
      icon: faBoxes,
      sub: [
        { label: "Subir Documento", href: "/dashboard/upload", icon: faUpload },
        {
          label: "Estado del Documento",
          href: "/dashboard/estado-documento",
          icon: faCheck,
        },
        { label: "Favoritos", href: "/dashboard/favorites", icon: faStar },
        {
          label: "Mis Documentos",
          href: "/dashboard/mis-documentos",
          icon: faFolderOpen,
        },
      ],
    },
    {
      key: "task",
      label: "TAREAS PENDIENTES",
      icon: faThumbtack,
      sub: [
        {
          label: "Pendientes de Validación",
          href: "/dashboard/PendientesDeValidacion",
          icon: faTasks,
        },
        { label: "Verificación de LEA-BCS", href: "/dashboard/verification", icon: faFileAlt },
      ],
    },
    {
      key: "reports",
      label: "CONSULTAS & REPORTES",
      icon: faChartBar,
      sub: [
        { label: "Bitácora", href: "/dashboard/bitacora", icon: faHistory },
        { label: "Informes", href: "/dashboard/informes", icon: faFileAlt },
      ],
    },
    {
      key: "settings",
      label: "CONFIGURACION & AYUDA",
      icon: faCog,
      sub: [
        { label: "Ajustes", href: "/dashboard/ajustes", icon: faCog },
        { label: "Ayuda", href: "/dashboard/ayuda", icon: faCircleInfo },
      ],
    },
  ];

  // Filtrado de submenús según búsqueda
  const filteredMenus = menuOptions
    .map((menu) => {
      const filteredSub = menu.sub.filter((sub) =>
        sub.label.toLowerCase().includes(search.toLowerCase())
      );
      return { ...menu, sub: filteredSub };
    })
    .filter(
      (menu) =>
        menu.label.toLowerCase().includes(search.toLowerCase()) ||
        menu.sub.length > 0
    );

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
    <div
      className={
        styles["sidebar-container"] +
        (darkMode ? " border-none" : "") +
        (collapsed ? " sidebar-collapsed" : "")
      }
      style={{
        borderLeft: "none",
        background: darkMode
          ? "linear-gradient(135deg, #0a1120 60%, #1e293b 100%)"
          : undefined,
        width: collapsed ? "72px" : undefined,
        minWidth: collapsed ? "72px" : undefined,
        transition: "width 0.3s",
      }}
    >
      {/* Botón hamburguesa en el Sidebar */}
      <button
        className="absolute top-6 left-6 z-50 p-2 rounded-full bg-blue-700 text-white shadow-lg hover:bg-blue-900 transition-all"
        onClick={handleCollapseToggle}
        aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
        style={{ display: "block" }}
      >
        <FontAwesomeIcon icon={faBars} size="lg" />
      </button>
      <aside
        className={
          `${styles.sidebar} ${
            darkMode
              ? "bg-gradient-to-br from-[#0a1120] via-[#1e293b] to-[#23395d] border-r border-blue-900 text-blue-100 shadow-2xl rounded-2xl"
              : "bg-blue-50 border-r border-blue-200 text-blue-900 shadow-lg"
          } transition-all duration-300` + (collapsed ? " sidebar-collapsed" : "")
        }
        role="navigation"
        aria-label="Menú principal"
        style={{
          width: collapsed ? "72px" : undefined,
          minWidth: collapsed ? "72px" : undefined,
          transition: "width 0.3s",
        }}
      >
        {/* SOLO ICONOS PRINCIPALES Y BOTÓN HAMBURGUESA EN MODO CONTRAÍDO */}
        {collapsed ? (
          <ul className="flex flex-col items-center mt-40 space-y-6">
            {menuOptions.map(menu => (
              <li key={menu.key} className="flex flex-col items-center">
                <button
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 border-4 border-blue-400 shadow-2xl hover:bg-blue-600 transition-all duration-200"
                  onClick={() => setOpenMenus(prev => prev.includes(menu.key) ? prev.filter(m => m !== menu.key) : [...prev, menu.key])}
                  title={menu.label}
                  style={{ boxShadow: '0 4px 16px rgba(37,99,235,0.35)' }}
                >
                  <FontAwesomeIcon
                    icon={menu.icon}
                    className="text-white text-3xl drop-shadow"
                  />
                </button>
                {/* Submenú: solo íconos, debajo del ícono principal, funcionales, sin texto */}
                {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                  <ul className="flex flex-col items-center mt-2 space-y-3">
                    {menu.sub.map(sub => (
                      <li key={sub.label}>
                        <button
                          className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-300 border-2 border-blue-300 shadow transition-all duration-200"
                          onClick={() => router.push(sub.href)}
                          title={sub.label}
                        >
                          <FontAwesomeIcon
                            icon={sub.icon}
                            className="text-blue-700 text-xl"
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          // ...existing code...
          <>
            <div className="sidebar-logo mt-16 mb-2 flex flex-col items-center justify-center w-full">
              <Image
                src="/api-dark23.png"
                alt="Logo institucional modo oscuro"
                width={750}
                height={150}
                className="object-contain"
                style={{
                  filter:
                    "drop-shadow(0 0 32px rgba(37,99,235,0.35)) drop-shadow(0 4px 16px rgba(0,0,0,0.18))",
                  transition: "width 0.3s, height 0.3s",
                }}
                priority
              />
            </div>
            <div style={{ marginTop: 48 }} />
            <div style={{ marginTop: 48 }} />
            <ul className={`space-y-6 mt-4 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar rounded-2xl shadow-xl px-2 py-4 border ${darkMode ? 'bg-gradient-to-br from-[#181f2a] via-[#23395d] to-[#1e293b] border-blue-900' : 'bg-white/90 border-blue-100'}`}>
              {filteredMenus.map(menu => (
                <li key={menu.key} className="flex flex-col">
                  <div
                    className={`flex items-center group rounded-xl px-3 py-3 transition-all duration-300 cursor-pointer relative shadow-md ${openMenus.includes(menu.key)
                      ? (darkMode ? 'bg-blue-900/90 border border-blue-400' : 'bg-blue-100/80 border border-blue-700')
                      : (darkMode ? 'hover:bg-blue-900/60 border border-transparent' : 'hover:bg-blue-50/80 border border-transparent')}`}
                    onClick={() => toggleMenu(menu.key)}
                    tabIndex={0}
                    aria-expanded={openMenus.includes(menu.key)}
                    role="button"
                  >
                    <span className={`absolute left-0 top-0 h-full w-2 rounded-l-xl transition-all duration-300 ${openMenus.includes(menu.key) ? (darkMode ? 'bg-gradient-to-b from-blue-400 to-blue-700' : 'bg-blue-700') : 'bg-transparent'}`}></span>
                    <span className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 ${darkMode ? 'bg-blue-800 group-hover:bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-400'}`}>
                      <FontAwesomeIcon
                        icon={menu.icon}
                        className={darkMode ? "text-blue-100 group-hover:text-blue-300 text-3xl" : "text-blue-700 group-hover:text-blue-900 text-3xl"}
                      />
                    </span>
                    <span className={`flex-grow text-xl font-bold select-none ml-4 ${darkMode ? 'text-blue-100 group-hover:text-blue-300 drop-shadow-sm' : 'text-blue-900 group-hover:text-blue-800'}`} style={{ letterSpacing: '0.5px' }}>
                      {menu.label}
                    </span>
                    <span className={`ml-2 text-2xl select-none ${darkMode ? 'text-blue-400' : 'text-blue-400'}`}>{openMenus.includes(menu.key) ? "−" : "+"}</span>
                  </div>
                  {/* Submenú: solo visible si sidebar expandido */}
                  <div className={`transition-all duration-300 ease-in-out ${openMenus.includes(menu.key) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                      <ul className={`pl-8 mt-2 space-y-1 border-l-2 rounded-lg py-2 shadow-sm ${darkMode ? 'border-blue-900 bg-[#232b3b]' : 'border-blue-100 bg-blue-50'}`}>
                        {menu.sub.map(sub => (
                          <li key={sub.label} className={`flex items-center font-medium text-base px-2 py-1 rounded-lg transition-all duration-200 ${window.location.pathname === sub.href ? (darkMode ? 'bg-blue-900/80 text-blue-100 font-bold' : 'bg-blue-300/60 text-blue-900 font-bold') : (darkMode ? 'text-blue-300 hover:text-blue-100 hover:bg-blue-900/60' : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100')}`}>
                            <FontAwesomeIcon
                              icon={sub.icon}
                              className={darkMode ? "mr-2 text-blue-400 text-lg" : "mr-2 text-blue-500 text-lg"}
                            />
                            <a href={sub.href} className="flex items-center">
                              <span className="ml-1">{sub.label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className={darkMode ? "w-full border-t border-blue-800 my-2" : "w-full border-t border-blue-100 my-2"}></div>
                </li>
              ))}
              <li className={darkMode ? "w-full border-t border-blue-800 my-4" : "w-full border-t border-blue-200 my-4"}></li>
              <li
                className={`font-bold cursor-pointer flex items-center transition-all duration-200 rounded-xl px-3 py-3 shadow-md ${darkMode ? 'text-blue-200 hover:text-red-400 bg-[#1e293b] hover:bg-red-900 border border-blue-900' : 'text-gray-500 hover:text-red-700'}`}
                onClick={handleLogoutClick}
                tabIndex={0}
                role="button"
                aria-label="Cerrar sesión"
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  className={darkMode ? "mr-2 text-blue-600 drop-shadow-lg" : "mr-2 text-red-500"}
                  size="2x"
                />
                CERRAR SESION
              </li>
            </ul>
            <div className={`mt-12 flex flex-col items-center gap-1 select-none ${darkMode ? 'bg-gradient-to-r from-[#181f2a] to-[#23395d] rounded-xl py-3 shadow-xl border border-blue-900' : ''}`}>
              <span className={darkMode ? "text-xs text-blue-200 font-semibold tracking-widest drop-shadow-sm" : "text-xs text-blue-900 font-semibold tracking-widest"}>Sistema de Gestión Documental</span>
              <span className={darkMode ? "text-xs text-blue-400 font-medium drop-shadow-sm" : "text-xs text-blue-700 font-medium"}>LEA-BCS © 2025</span>
            </div>
            {/* Notas informativas LEA-BCS */}
            <div className="mt-6 px-4 pb-6">
              <div className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 rounded-2xl shadow-2xl border-4 border-blue-500 p-5 flex flex-col items-center animate-pulse">
                <span className="text-2xl font-extrabold text-white drop-shadow-lg tracking-wide mb-2 text-center" style={{letterSpacing:'1px'}}>¿Sabías que?</span>
                <span className="text-lg text-blue-100 font-semibold text-center mb-2 drop-shadow-sm">La <span className="text-blue-300 font-bold">Ley Estatal de Archivos de Baja California Sur</span> garantiza la transparencia, protección y acceso a la información pública documental.</span>
                <span className="text-base text-blue-200 text-center mb-2 italic">¡Tu gestión documental es parte fundamental de la legalidad y el futuro digital de BCS!</span>
                <span className="text-sm text-blue-300 text-center mt-2">#TransformaciónDigital #LEA-BCS #InnovaciónLegal</span>
                <div className="w-full h-1 bg-gradient-to-r from-blue-400 via-blue-700 to-blue-900 rounded-full mt-4 mb-2 animate-pulse"></div>
                <span className="text-xs text-blue-100 text-center">Para más información visita <a href="https://www.bcs.gob.mx/archivos" target="_blank" rel="noopener noreferrer" className="underline text-blue-300 hover:text-white font-bold">bcs.gob.mx/archivos</a></span>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}