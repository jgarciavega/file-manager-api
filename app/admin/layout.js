import SidebarAdmin from './components/SidebarAdmin';


export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
const currentUser = {
  nombre: 'Jorge',
  rol: 'admin', 
};
