"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUpload, faCheck, faStar, faHistory, faFileAlt, faTasks, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  // Define los datos del usuario aquí
  const user = {
    name: "Julio Rubio",
    avatar: "/av3.webp", // Reemplaza con la ruta correcta de la imagen de avatar
    workArea: "Contraloria",
    position: "Jefe de Seguimiento Administrativo"
  };

  const [openMenus, setOpenMenus] = useState([]);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUserInfoOpen, setUserInfoOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenus((prevOpenMenus) =>
      prevOpenMenus.includes(menu)
        ? prevOpenMenus.filter((m) => m !== menu)
        : [...prevOpenMenus, menu]
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
    if (!isSidebarCollapsed) {
      setOpenMenus([]); // Cerrar todos los submenús al colapsar el sidebar
    }
  };

  const toggleUserInfo = () => {
    setUserInfoOpen(!isUserInfoOpen);
  };

  useEffect(() => {
    if (isSidebarCollapsed) {
      setOpenMenus([]); // Cerrar todos los submenús al colapsar el sidebar
    }
  }, [isSidebarCollapsed]);

  return (
    <div className={styles['sidebar-container']}>
      <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles['sidebar-collapsed'] : ''}`}>
        <FontAwesomeIcon
          icon={faBars}
          className={`text-gray-800  ${styles['menu-icon']}`}
          onClick={toggleSidebar}
        />
        {!isSidebarCollapsed && (
          <>
            <div className={`${styles['user-info']} mb-28 flex items-center gap-3`} onClick={toggleUserInfo}>
              <Image
                src={user.avatar}
                alt="Usuario"
                width={150}
                height={15}
                className="rounded-full border border-gray-500"
              />
              <p className="font-bold text-gray-800">{user.name}</p>
              {isUserInfoOpen && (
                <div className={styles['user-details']}>
                  <p><strong>Nombre:</strong> {user.name}</p>
                  <p><strong>Área de Trabajo:</strong> {user.workArea}</p>
                  <p><strong>Puesto:</strong> {user.position}</p>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4"></h1>
            <ul className="space-y-4">
              <li className="font-bold text-gray-800">
                <a
                  href="#"
                  className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duración-300"
                  onClick={() => toggleMenu('file')}
                  aria-expanded={openMenus.includes('file')}
                >
                  <div className="text-lg font size-28 flex items-center">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Gestión de archivos
                  </div>
                  <span>{openMenus.includes('file') ? '−' : '+'}</span>
                </a>
                {openMenus.includes('file') && (
                  <ul className={`ml-6 mt-2 space-y-2 ${styles['sub-menu']}`}>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faUpload} className="mr-2" />⬆ Subir Documentos
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Estado del Documento
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faStar} className="mr-2" /> Favoritos/Marcados
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                    <FontAwesomeIcon icon={faHistory} className="mr-2" /> Historial de Consultas
                  </li>
                </ul>
                )}
              </li>
              {/* Continúa con el resto del código del sidebar */}
              <li className="font-bold text-gray-800">
                <a
                  href="#"
                  className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duración-300"
                  onClick={() => toggleMenu('task')}
                  aria-expanded={openMenus.includes('task')}
                >
                  <div className="text-lg font size-28 flex items-center">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" /> Tareas Pendientes
                  </div>
                  <span>{openMenus.includes('task') ? '−' : '+'}</span>
                </a>
                {openMenus.includes('task') && (
                  <ul className={`ml-6 mt-2 space-y-2 ${styles['sub-menu']}`}>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Documentos Pendientes de Validación
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Verificación de Cumplimiento LEA-BCS
                    </li>
                  </ul>
                )}
              </li>

              <li className="font-bold text-gray-800">
                <a
                  href="#"
                  className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duración-300"
                  onClick={() => toggleMenu('reports')}
                  aria-expanded={openMenus.includes('reports')}
                >
                  <div className="text-lg font size-28 flex items-center">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" /> Consultas & Reportes
                  </div>
                  <span>{openMenus.includes('reports') ? '−' : '+'}</span>
                </a>
                {openMenus.includes('reports') && (
                  <ul className={`ml-6 mt-2 space-y-2 ${styles['sub-menu']}`}>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Historial de Consultas
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Informes
                    </li>
                  </ul>
                )}
              </li>

              <li className="font-bold text-gray-800">
                <a
                  href="#"
                  className="text-lg font size-28 flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duración-300"
                  onClick={() => toggleMenu('settings')}
                  aria-expanded={openMenus.includes('settings')}
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faTasks} className="mr-2" /> Configuración & Ayuda
                  </div>
                  <span>{openMenus.includes('settings') ? '−' : '+'}</span>
                </a>
                {openMenus.includes('settings') && (
                  <ul className={`ml-6 mt-2 space-y-2 ${styles['sub-menu']}`}>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Ajustes
                    </li>
                    <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duración-300">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" /> Ayuda
                    </li>
                  </ul>
                )}
              </li>

              <li className="text-lg font size-28 font-bold text-gray-800">
                <a href="#" className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duración-300">
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Cerrar sesión
                  </a>
              </li>
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}