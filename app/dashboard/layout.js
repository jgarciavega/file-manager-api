"use client";
import "../globals.css"; // Importa estilos globales en lugar de styles.css
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import RequireAuth from "./components/RequireAuth";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email || "",
    avatar: session?.user?.avatar || "/default-avatar.png",
    title: session?.user?.title || "",
  };

  return (
    <RequireAuth>
      <div className="flex">
        <Sidebar isCollapsed={sidebarCollapsed} />
        <div className="flex-1">
          <Navbar user={user} toggleSidebar={() => setSidebarCollapsed(prev => !prev)} />
          {children}
        </div>
      </div>
    </RequireAuth>
  );
}
