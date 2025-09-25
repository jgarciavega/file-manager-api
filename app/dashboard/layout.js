import "../globals.css"; // Importa estilos globales en lugar de styles.css
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import RequireAuth from "./components/RequireAuth";
import ThemeSync from "./components/ThemeSync";

export default function DashboardLayout({ children }) {
  return (
    <RequireAuth>
      <ThemeSync />
      <div className="dashboard-container">
        <aside className="sidebar">
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </RequireAuth>
  );
}
