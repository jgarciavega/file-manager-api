"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

export default function ArchivosDemo() {
  const [documentos] = useState([
    {
      id: 1,
      nombre: "Manual de Usuario 2025.pdf",
      descripcion: "Guía completa para el uso del sistema",
      ruta: "/uploads/manual-usuario.pdf",
      fecha_subida: "2025-01-15T10:00:00.000Z",
      usuarios: { nombre: "Jorge García" },
      tipos_documentos: { tipo: "PDF" },
      tamaño: "2.5 MB",
    },
    {
      id: 2,
      nombre: "Reporte Financiero Q1.xlsx",
      descripcion: "Análisis financiero del primer trimestre",
      ruta: "/uploads/reporte-q1.xlsx",
      fecha_subida: "2025-01-14T14:30:00.000Z",
      usuarios: { nombre: "Admin Test" },
      tipos_documentos: { tipo: "Excel" },
      tamaño: "1.8 MB",
    },
    {
      id: 3,
      nombre: "Propuesta de Proyecto.docx",
      descripcion: "Documento de propuesta para nuevo proyecto",
      ruta: "/uploads/propuesta.docx",
      fecha_subida: "2025-01-13T09:15:00.000Z",
      usuarios: { nombre: "Julio Rubio" },
      tipos_documentos: { tipo: "Word" },
      tamaño: "856 KB",
    },
    {
      id: 4,
      nombre: "Logo Empresa 2025.png",
      descripcion: "Logo actualizado de la empresa",
      ruta: "/uploads/logo-2025.png",
      fecha_subida: "2025-01-12T16:45:00.000Z",
      usuarios: { nombre: "Annel Torres" },
      tipos_documentos: { tipo: "Imagen" },
      tamaño: "324 KB",
    },
    {
      id: 5,
      nombre: "Contrato de Servicios.pdf",
      descripcion: "Template de contrato para servicios",
      ruta: "/uploads/contrato-template.pdf",
      fecha_subida: "2025-01-11T11:20:00.000Z",
      usuarios: { nombre: "Jorge García" },
      tipos_documentos: { tipo: "PDF" },
      tamaño: "1.2 MB",
    },
    {
      id: 6,
      nombre: "Base de Datos Clientes.xlsx",
      descripcion: "Registro actualizado de clientes activos",
      ruta: "/uploads/bd-clientes.xlsx",
      fecha_subida: "2025-01-10T08:30:00.000Z",
      usuarios: { nombre: "Admin Test" },
      tipos_documentos: { tipo: "Excel" },
      tamaño: "3.1 MB",
    },
  ]);

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "PDF":
        return "📄";
      case "Word":
        return "📝";
      case "Excel":
        return "📊";
      case "Imagen":
        return "🖼️";
      default:
        return "📁";
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "PDF":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "Word":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Excel":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Imagen":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 dark:bg-[#0d1b2a] text-gray-900 dark:text-white">
      {/* ——— Cabecera ——— */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <Image
            src="/api-dark23.png"
            alt="Logo"
            width={300}
            height={60}
            className="w-full max-w-xs sm:max-w-sm"
          />
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full sm:w-auto justify-center sm:justify-start"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Volver al Dashboard
        </Link>
      </div>

      {/* ——— Título y Estadísticas ——— */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-blue-600 dark:text-blue-400 text-center">
          📂 Gestor de Archivos - Demo
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
          Documentos de ejemplo para demostración del sistema
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {documentos.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Documentos
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {
                documentos.filter((d) => d.tipos_documentos.tipo === "PDF")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Archivos PDF
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-purple-600">
              {
                documentos.filter((d) => d.tipos_documentos.tipo === "Excel")
                  .length
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Hojas Excel
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">9.8 MB</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Espacio Total
            </div>
          </div>
        </div>
      </div>

      {/* ——— Tabla de Documentos ——— */}
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tamaño
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {documentos.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getTipoIcon(doc.tipos_documentos.tipo)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {doc.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {doc.descripcion}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(
                        doc.tipos_documentos.tipo
                      )}`}
                    >
                      {doc.tipos_documentos.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {doc.usuarios.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(doc.fecha_subida).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {doc.tamaño}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => alert(`Vista previa de: ${doc.nombre}`)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                        title="Vista previa"
                      >
                        <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Descargando: ${doc.nombre}`)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors"
                        title="Descargar"
                      >
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista de cards para móvil y tablet */}
      <div className="lg:hidden space-y-4">
        {documentos.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {/* Header del card */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-3xl mr-3">
                  {getTipoIcon(doc.tipos_documentos.tipo)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {doc.nombre}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {doc.descripcion}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(
                    doc.tipos_documentos.tipo
                  )}`}
                >
                  {doc.tipos_documentos.tipo}
                </span>
              </div>
            </div>

            {/* Información del documento */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Usuario:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {doc.usuarios.nombre}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(doc.fecha_subida).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Tamaño:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {doc.tamaño}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  onClick={() => alert(`Vista previa de: ${doc.nombre}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                  Vista previa
                </button>
                <button
                  onClick={() => alert(`Descargando: ${doc.nombre}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ——— Información adicional ——— */}
      <div className="mt-8 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            💡 Información del Demo
          </h3>
          <p className="text-blue-600 dark:text-blue-300 text-sm">
            Estos son documentos de ejemplo para demostrar el funcionamiento del
            sistema.
            <br />
            En producción, estos documentos serían cargados desde la base de
            datos MySQL.
          </p>
        </div>
      </div>
    </div>
  );
}
