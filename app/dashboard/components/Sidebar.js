"use client";

export default function Sidebar() {
  return (
    <aside className="text-gray-800 w-64 bg-white shadow-lg p-4 mt-32">
      <h2 className="text-xl font-bold text-gray-800">Menú</h2>
      <ul>
        <li className="mt-2"><a href="#" className="text-gray-800">Inicio</a></li>
        <li className="mt-2"><a href="#" className="text-gray-800">Gestión de archivos</a></li>
        <li className="mt-2"><a href="#" className="text-gray-800">Cerrar sesión</a></li>
      </ul>
    </aside>
  );
}
