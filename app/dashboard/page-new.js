"use client"; // Asegura que Next.js lo trate como un componente del lado del cliente

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import DashboardCapturista from "./components/DashboardCapturista";
import DashboardRevisor from "./components/DashboardRevisor";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (session?.user) {
      // Determinar el rol del usuario basado en su información
      const role = session.user.role || "capturista";
      setUserRole(role);
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Si es capturista, mostrar el dashboard personalizado
  if (userRole === "capturista") {
    return <DashboardCapturista />;
  }

  // Si es revisor, mostrar el dashboard de revisión
  if (userRole === "revisor") {
    return <DashboardRevisor />;
  }

  // Dashboard por defecto para otros roles
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Bienvenido al Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Hola {session?.user?.name || "Usuario"}, aquí puedes gestionar el
            sistema de archivos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Acciones rápidas para admin/revisor */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Gestión de Documentos
              </h3>
              <p className="text-blue-600 dark:text-blue-300 text-sm">
                Revisa y administra documentos del sistema
              </p>
            </div>

            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                Reportes y Estadísticas
              </h3>
              <p className="text-green-600 dark:text-green-300 text-sm">
                Accede a informes detallados del sistema
              </p>
            </div>

            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Configuración
              </h3>
              <p className="text-purple-600 dark:text-purple-300 text-sm">
                Ajusta las configuraciones del sistema
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
