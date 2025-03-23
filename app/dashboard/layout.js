import "../globals.css"; // Importa estilos globales en lugar de styles.css

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
