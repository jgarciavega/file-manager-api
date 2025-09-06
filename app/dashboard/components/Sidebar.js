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
import { faSearch, faMicrophone, faFolder, faPaperPlane, faFolderTree, faArrowUpZA } from "@fortawesome/free-solid-svg-icons";
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
import { FaDochub } from "react-icons/fa";

export default function Sidebar() {

  const darkMode = true; // Modo oscuro experimental para Home
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
      label: "GESTION DE ARCHIVOS",
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
      label: "TAREAS PENDIENTES",
      icon: faThumbtack,
      sub: [
        { label: "Pendientes de Validación", href: "/dashboard/PendientesDeValidacion", icon: faTasks },
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
      key: "gestion documental",
      label: "GESTION DOCUMENTAL",   
      icon: faFolder,
      sub: [
        { label: "Expedientes", href: "/dashboard/expedientes", icon: faFolderOpen },
        { label: "Prestamos de Documentos", href: "/dashboard/prestamos-documentos", icon: faFolderTree },
        { label: "Serie Documentales", href: "/dashboard/serie-documentales", icon: faHistory },
        { label: "Subserie Documentales", href: "/dashboard/subserie-documentales", icon: faCircleInfo },
        { label: "Transferencias", href: "/dashboard/transferencias", icon: faArrowUpZA },
        { label: "Versiones Documentales", href: "/dashboard/versiones-documentales", icon: faHistory },
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
    <div className={styles["sidebar-container"] + (darkMode ? " border-none" : "")} style={{ borderLeft: 'none', background: darkMode ? 'linear-gradient(135deg, #0a1120 60%, #1e293b 100%)' : undefined }}>
      <aside
        className={`${styles.sidebar} ${darkMode ? 'bg-gradient-to-br from-[#0a1120] via-[#1e293b] to-[#23395d] border-r border-blue-900 text-blue-100 shadow-2xl' : 'bg-blue-50 border-r border-blue-200 text-blue-900 shadow-lg'} transition-all duration-300`}
        role="navigation"
        aria-label="Menú principal"
      >
        {/* Sidebar expandido siempre */}
        <div className="sidebar-logo flex flex-col items-center justify-center w-full">
          <Image
            src="/api-dark23.png"
            alt="Logo institucional modo oscuro"
            width={450}
            height={120}
            className="object-contain invert"
            style={{ filter: "drop-shadow(0 0 32px rgba(37,99,235,0.35)) drop-shadow(0 4px 16px rgba(0,0,0,0.18))" }}
            priority
          />
          <div className="mt-6 text-center">
            <h1 className={`text-2xl font-sans font-bold ${darkMode ? 'text-blue-200' : 'text-blue-900'} tracking-wide leading-relaxed`}>
              Sistema de Gestión Documental LEA-BCS 2025
            </h1>
          </div>
        </div>
        {/* Buscador eliminado: ahora solo en el Navbar */}
        <ul className={`space-y-6 mt-8 overflow-y-auto max-h-[calc(100vh-350px)] pr-2 custom-scrollbar rounded-2xl shadow-xl px-2 py-4 border ${darkMode ? 'bg-gradient-to-br from-[#181f2a] via-[#23395d] to-[#1e293b] border-blue-900' : 'bg-white/90 border-blue-100'}`}>
          {filteredMenus.map(menu => (
            <li key={menu.key} className="flex flex-col">
              <div
                className={`flex items-center group rounded-xl px-3 transition-all duration-300 cursor-pointer relative shadow-md ${openMenus.includes(menu.key)
                  ? (darkMode ? 'bg-blue-900/90 border border-blue-400' : 'bg-blue-100/80 border border-blue-700')
                  : (darkMode ? 'hover:bg-blue-900/60 border border-transparent' : 'hover:bg-blue-50/80 border border-transparent')}`}
                onClick={() => toggleMenu(menu.key)}
                tabIndex={0}
                aria-expanded={openMenus.includes(menu.key)}
                role="button"
              >
                {/* Barra azul institucional para menú activo */}
                <span className={`absolute left-0 top-0 h-full w-2 rounded-l-xl transition-all duration-300 ${openMenus.includes(menu.key) ? (darkMode ? 'bg-gradient-to-b from-blue-400 to-blue-700' : 'bg-blue-700') : 'bg-transparent'}`}></span>
                <FontAwesomeIcon
                  icon={menu.icon}
                  className={darkMode ? "mr-3 text-blue-200 group-hover:text-blue-400 transition-all duration-200 text-3xl drop-shadow-lg" : "mr-3 text-blue-700 group-hover:text-blue-900 transition-all duration-200 text-3xl"}
                />
                <span className={`flex-grow text-md font-bold select-none ${darkMode ? 'text-blue-100 group-hover:text-blue-300 drop-shadow-sm' : 'text-blue-900 group-hover:text-blue-800'}`} style={{ letterSpacing: '0.5px' }}>
                  {menu.label}
                </span>
                <span className={`ml-2 text-2xl select-none ${darkMode ? 'text-blue-400' : 'text-blue-400'}`}>{openMenus.includes(menu.key) ? "−" : "+"}</span>
              </div>
              {/* Submenú: animación suave y estilos claros */}
              <div className={`transition-all duration-300 ease-in-out ${openMenus.includes(menu.key) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                {openMenus.includes(menu.key) && menu.sub.length > 0 && (
                  <ul className={`pl-8 mt-2 space-y-1 border-l-2 rounded-lg py-2 shadow-sm ${darkMode ? 'border-blue-900 bg-[#232b3b]' : 'border-blue-100 bg-blue-50'}`}>
                    {menu.sub.map(sub => (
                      <li key={sub.label} className={`flex items-center font-medium text-base px-2 py-1 rounded-lg transition-all duration-200 ${window.location.pathname === sub.href ? (darkMode ? 'bg-blue-900/80 text-blue-100 font-bold' : 'bg-blue-300/60 text-blue-900 font-bold') : (darkMode ? 'text-blue-300 hover:text-blue-100 hover:bg-blue-900/60' : 'text-blue-700 hover:text-blue-900 hover:bg-blue-100')}`}>
                        <FontAwesomeIcon
                          icon={sub.icon}
                          className={darkMode ? "mr-2 text-blue-400 bg-[#181f2a] rounded-full p-1 border border-blue-900 shadow-sm text-xl" : "mr-2 text-blue-500 bg-white rounded-full p-1 border border-blue-200 shadow-sm text-xl"}
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
              <div className={darkMode ? "w-full border-t border-blue-800 my-2" : "w-full border-t border-blue-100 my-2"}></div>
            </li>
          ))}
          {/* Cerrar sesión */}
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
        {/* Información institucional en la parte inferior */}
        <div className={`mt-4 mb-2 flex flex-col items-center gap-1 select-none ${darkMode ? 'bg-gradient-to-r from-[#181f2a] to-[#23395d] rounded-xl py-2 shadow-xl border border-blue-900' : ''}`}>
          <button 
            onClick={() => {
              Swal.fire({
                title: 'Notas sobre la LEA-BCS',
                html: `
                  <div class="text-left space-y-3">
                    <p><b class="text-blue-600">LEA-BCS</b> regula la gestión, conservación y acceso a los archivos públicos en Baja California Sur.</p>
                    <p>Todo documento debe ser <b class="text-blue-500">clasificado y resguardado</b> conforme a la ley.</p>
                    <p>El acceso a la información está garantizado, salvo <b class="text-red-500">excepciones legales</b>.</p>
                    <p>La <b class="text-green-600">transparencia</b> y la <b class="text-green-600">rendición de cuentas</b> son principios rectores.</p>
                    <p>El <b class="text-red-600">uso indebido</b> de información puede ser sancionado.</p>
                    <p class="mt-4">
                      <a href="https://www.cbcs.gob.mx/index.php/cmply/6728-ley-de-archivos-para-el-estado-de-baja-california-sur" 
                         target="_blank" 
                         class="text-blue-600 hover:text-blue-800 underline">
                        Consulta el texto completo aquí
                      </a>
                    </p>
                  </div>
                `,
                width: '600px',
                showCloseButton: true,
                showConfirmButton: false,
                background: darkMode ? '#1e293b' : '#ffffff',
                color: darkMode ? '#e2e8f0' : '#000000',
                customClass: {
                  popup: darkMode ? 'dark-mode-popup' : ''
                }
              });
            }}
            className={`flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer`}
          >
            <span className={`text-xs ${darkMode ? "text-blue-200" : "text-blue-900"} font-semibold tracking-widest drop-shadow-sm flex items-center gap-2`}>
              Sistema de Gestión Documental
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="inline-block">
                <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/>
              </svg>
            </span>
            <span className={darkMode ? "text-xs text-blue-400 font-medium drop-shadow-sm" : "text-xs text-blue-700 font-medium"}>LEA-BCS 2025</span>
          </button>
        </div>
      </aside>
    </div>
  );
}