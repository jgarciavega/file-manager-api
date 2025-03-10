"use client";

import { useState } from "react";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faCheck, faStar, faHistory, faFileAlt, faTasks, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import styles from './Sidebar.module.css';

export default function Sidebar({ user }) {
  const [isFileMenuOpen, setFileMenuOpen] = useState(false);
  const [isTaskMenuOpen, setTaskMenuOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <aside className={`text-blue-800 w-64 bg-gray-50 shadow-lg p-6 mt-16 rounded-lg ${styles.sidebar}`}>
      <div className="user-info mb-6 flex items-center gap-3">
        <Image
          src={user.avatar}
          alt="Usuario"
          width={55}
          height={35}
          className="rounded-full border border-gray-300"
        />
        <p className="font-bold text-gray-800">{user.name}</p>
      </div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Menú</h1>
      <ul className="space-y-4">
        <li className="font-bold text-gray-800">
          <a
            href="#"
            className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setFileMenuOpen(!isFileMenuOpen)}
            aria-expanded={isFileMenuOpen}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Gestión de archivos
            </div>
            <span>{isFileMenuOpen ? '−' : '+'}</span>
          </a>
          {isFileMenuOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faUpload} className="mr-2" />⬆ Subir Documentos
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Estado del Documento
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faStar} className="mr-2" /> Favoritos/Marcados
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faHistory} className="mr-2" /> Historial de Consultas
              </li>
            </ul>
          )}
        </li>

        <li className="font-bold text-gray-800">
          <a
            href="#"
            className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setTaskMenuOpen(!isTaskMenuOpen)}
            aria-expanded={isTaskMenuOpen}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTasks} className="mr-2" /> Tareas Pendientes
            </div>
            <span>{isTaskMenuOpen ? '−' : '+'}</span>
          </a>
          {isTaskMenuOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Documentos Pendientes de Validación
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Verificación de Cumplimiento LEA-BCS
              </li>
            </ul>
          )}
        </li>

        <li className="font-bold text-gray-800">
          <a
            href="#"
            className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setTaskMenuOpen(!isTaskMenuOpen)}
            aria-expanded={isTaskMenuOpen}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTasks} className="mr-2" /> Consultas & Reportes
            </div>
            <span>{isTaskMenuOpen ? '−' : '+'}</span>
          </a>
          {isTaskMenuOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Historial de Consultas
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Informes
              </li>
            </ul>
          )}
        </li>

        <li className="font-bold text-gray-800">
          <a
            href="#"
            className="flex items-center justify-between text-gray-800 hover:text-blue-600 transition-colors duration-300"
            onClick={() => setTaskMenuOpen(!isTaskMenuOpen)}
            aria-expanded={isTaskMenuOpen}
          >
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTasks} className="mr-2" /> Configuración & Ayuda
            </div>
            <span>{isTaskMenuOpen ? '−' : '+'}</span>
          </a>
          {isTaskMenuOpen && (
            <ul className="ml-6 mt-2 space-y-2">
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" /> Ajustes
              </li>
              <li className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300">
                <FontAwesomeIcon icon={faCheck} className="mr-2" /> Ayuda
              </li>
            </ul>
          )}
        </li>

        <li className="font-bold text-gray-800">
          <a href="#" className="flex items-center text-gray-800 hover:text-blue-600 transition-colors duration-300">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Cerrar sesión
          </a>
        </li>
      </ul>
    </aside>
  );
}
