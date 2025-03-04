import "../globals.css"; // Importa estilos globales en lugar de styles.css

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Menú</h2>
        <ul>
          <li><a href="/dashboard">Inicio</a></li>
          <li><a href="/dashboard/files">Gestión de archivos</a></li>
          <li><a href="/dashboard/pending">Documentos pendientes</a></li>
          <li><a href="/dashboard/history">Historial de consultas</a></li>
        </ul>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
