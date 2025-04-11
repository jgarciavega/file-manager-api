"use client";

const currentUser = {
  nombre: "Jorge",
  rol: "todos los roles", // Cambia a 'revisor' o 'capturista' para probar
};

export default function Configuracion() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Configuración del Sistema
      </h1>

      {/* Contenido solo visible para administradores */}
      {currentUser.rol === "admin" && (
        <div className="p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg border border-blue-300 dark:border-blue-600">
          <p className="font-semibold">
            Solo los administradores pueden ver esta sección.
          </p>
          <p className="text-sm mt-1">
            Aquí podrás editar clasificaciones, series documentales, jefaturas y
            otros catálogos del sistema.
          </p>
        </div>
      )}

      {/* Contenido general visible para todos */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-700">
        <p>Información general sobre la configuración y uso del sistema.</p>
      </div>
    </div>
  );
}
