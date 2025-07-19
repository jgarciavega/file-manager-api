import SidebarAdmin from "./components/SidebarAdmin";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen relative">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-4 md:p-8 overflow-y-auto">
        {/* Espacio para el botón hamburguesa en móviles */}
        <div className="pt-16 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
