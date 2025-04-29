"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import styles from "./HomePage.module.css";
import avatarMap from "../../lib/avatarMap";
import admMap from "../../lib/admMap";
import profesionMap from "../../lib/profesionMap";

export default function Home() {
  const { data: session, status } = useSession();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  if (status === "loading")
    return <p className="text-white p-8">Cargando sesión...</p>;

  if (!session)
    return <p className="text-red-600 p-8">No estás autenticado.</p>;

  // Definimos user solo para el Navbar, Sidebar ya lo hace internamente
  const email = session.user.email;
  const user = {
    name: session.user.name,
    email: session.user.email,
    avatar: avatarMap[session.user.email] || "/default-avatar.png",
    position: admMap[session.user.email] || "000",
    title: profesionMap[session.user.email] || "",
    workArea: "Contraloría",
  };

  return (
    <div className={`flex h-screen ${styles.background}`}>
      <Sidebar isSidebarCollapsed={isSidebarCollapsed} />

      <div className="flex flex-col w-full">
        <Navbar user={user} toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
}
