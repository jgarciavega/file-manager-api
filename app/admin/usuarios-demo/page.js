"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEdit,
  faTrash,
  faPlus,
  faUserCheck,
  faUserTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function UsuariosDemo() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [usuarios] = useState([
    {
      id: 1,
      nombre: "Jorge",
      apellidos: "García Vega",
      email: "jorge.garcia@apibcs.com.mx",
      role: "admin",
      activo: true,
      fecha_creacion: "2024-01-15T10:00:00.000Z",
      usuarios_has_roles: [{ roles: { tipo: "admin" } }],
    },
    {
      id: 2,
      nombre: "Annel",
      apellidos: "Torres",
      email: "annel@apibcs.com.mx",
      role: "capturista",
      activo: true,
      fecha_creacion: "2024-02-10T08:30:00.000Z",
      usuarios_has_roles: [{ roles: { tipo: "capturista" } }],
    },
    {
      id: 3,
      nombre: "Julio",
      apellidos: "Rubio",
      email: "jrubio@apibcs.com.mx",
      role: "revisor",
      activo: true,
      fecha_creacion: "2024-03-05T14:15:00.000Z",
      usuarios_has_roles: [{ roles: { tipo: "revisor" } }],
    },
    {
      id: 4,
      nombre: "Admin",
      apellidos: "Test",
      email: "admin@test.com",
      role: "admin",
      activo: true,
      fecha_creacion: "2025-01-01T12:00:00.000Z",
      usuarios_has_roles: [{ roles: { tipo: "admin" } }],
    },
    {
      id: 5,
      nombre: "Usuario",
      apellidos: "Demo",
      email: "user@demo.com",
      role: "user",
      activo: false,
      fecha_creacion: "2024-12-20T16:30:00.000Z",
      usuarios_has_roles: [{ roles: { tipo: "user" } }],
    },
  ]);

  // Verificar autenticación
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "revisor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "capturista":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "user":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return "👑";
      case "revisor":
        return "👨‍💼";
      case "capturista":
        return "✍️";
      case "user":
        return "👤";
      default:
        return "❓";
    }
  };

  const usuariosActivos = usuarios.filter((u) => u.activo);
  const usuariosInactivos = usuarios.filter((u) => !u.activo);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d1b2a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Verificando autenticación...
          </p>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            👥 Gestión de Usuarios - Demo
          </h1>
          <button
            onClick={() =>
              alert(
                "Funcionalidad de agregar usuario no disponible en modo demo"
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
          </button>
        </div>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Gestión completa de usuarios del sistema con roles y permisos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {usuarios.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Usuarios
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {usuariosActivos.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Usuarios Activos
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">
              {usuarios.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Administradores
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-orange-600">
              {usuariosInactivos.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Usuarios Inactivos
            </div>
          </div>
        </div>
      </div>

      {/* ——— Tabla de Usuarios ——— */}
      {/* Vista de tabla para desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {usuarios.map((usuario) => (
                <tr
                  key={usuario.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">
                        {getRoleIcon(usuario.role)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {usuario.nombre} {usuario.apellidos}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {usuario.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                        usuario.role
                      )}`}
                    >
                      {usuario.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        usuario.activo
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={usuario.activo ? faUserCheck : faUserTimes}
                        className="w-3 h-3 mr-1"
                      />
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(usuario.fecha_creacion).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          alert(
                            `Editar usuario: ${usuario.nombre} ${usuario.apellidos}`
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                        title="Editar usuario"
                      >
                        <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          alert(
                            `¿Eliminar usuario: ${usuario.nombre} ${usuario.apellidos}?`
                          )
                        }
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 transition-colors"
                        title="Eliminar usuario"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
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
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {/* Header del card */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="text-3xl mr-3">{getRoleIcon(usuario.role)}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {usuario.nombre} {usuario.apellidos}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ID: {usuario.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                    usuario.activo
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={usuario.activo ? faUserCheck : faUserTimes}
                    className="w-3 h-3 mr-1"
                  />
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            {/* Información del usuario */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {usuario.email}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rol:
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                    usuario.role
                  )}`}
                >
                  {usuario.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha de creación:
                </span>
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(usuario.fecha_creacion).toLocaleDateString(
                    "es-ES",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-3">
                <button
                  onClick={() =>
                    alert(
                      `Editar usuario: ${usuario.nombre} ${usuario.apellidos}`
                    )
                  }
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() =>
                    alert(
                      `¿Eliminar usuario: ${usuario.nombre} ${usuario.apellidos}?`
                    )
                  }
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                  Eliminar
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
            💡 Información del Demo - Usuarios
          </h3>
          <p className="text-blue-600 dark:text-blue-300 text-sm">
            Estos son usuarios de ejemplo para demostrar el sistema de gestión.
            <br />
            En producción, los usuarios serían gestionados desde la base de
            datos MySQL con funcionalidad completa.
          </p>
        </div>
      </div>
    </div>
  );
}
