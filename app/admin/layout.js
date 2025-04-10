export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-xl font-bold mb-4">Admin</h2>
        <ul className="space-y-3">
          <li>
            <a href="/admin">Inicio</a>
          </li>
          <li>
            <a href="/admin/archivos">Archivos</a>
          </li>
          <li>
            <a href="/admin/reportes">Reportes</a>
          </li>
          <li>
            <a href="/admin/usuarios">Usuarios</a>
          </li>
          <li>
            <a href="/admin/configuracion">Configuración</a>
          </li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-8">
        {children}
      </main>
    </div>
  );
}
