import "../globals.css"; // Importa estilos globales en lugar de styles.css
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
