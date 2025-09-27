"use client";

import { useSession } from "next-auth/react";
import DashboardHeader from "@/components/DashboardHeader";
import avatarMap from "@/lib/avatarMap";
import BackToHomeButton from "@/components/BackToHomeButton";

export default function Expedientes() {
  const { data: session } = useSession();
  const email = session?.user?.email;
  const avatarUrl = email && avatarMap[email] ? avatarMap[email] : "/login.jpg";

  return (
    <div className="min-h-screen bg-white dark:bg-[#151a2c]">
      <DashboardHeader title="Expedientes" avatarUrl={avatarUrl} />
      <main className="p-6 space-y-8">
        <div className="mb-2">
          <BackToHomeButton />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Gestión de Expedientes
        </h1>
        {/* Filtros de búsqueda */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Buscar por título o código"
          />
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Serie documental"
          />
          <input
            className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100"
            placeholder="Unidad administrativa"
          />
          <input className="border rounded px-2 py-1 bg-white dark:bg-[#232b4a] text-gray-900 dark:text-gray-100" placeholder="Estado" />
        </div>
        {/* Tabla de expedientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-400 bg-white dark:border-[#25304d] dark:bg-[#1a2036] border-collapse text-center">
            <thead className="bg-gray-200 dark:bg-[#232b4a]">
              <tr>
                <th className="px-4 py-2 border">Código</th>
                <th className="px-4 py-2 border">Título</th>
                <th className="px-4 py-2 border">Serie documental</th>
                <th className="px-4 py-2 border">Unidad administrativa</th>
                <th className="px-4 py-2 border">Fecha apertura</th>
                <th className="px-4 py-2 border">Fecha cierre</th>
                <th className="px-4 py-2 border">Plazo conservación</th>
                <th className="px-4 py-2 border">Estado</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {/* Aquí iría el mapeo de expedientes */}
              <tr>
                <td className="border px-2 py-1" colSpan={9}>
                  Sin expedientes registrados
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
