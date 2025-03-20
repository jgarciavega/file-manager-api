"use client"
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import { useState } from "react";
import Image from "next/image"; 
import styles from './HomePage.module.css';

export default function Home() {
  const user = {
    name: "Julio Rubio",
    avatar: "/av3.webp",
    workArea: "Contraloria",
    position: "Jefe",
    
  };

   // Estado para controlar claramente si el sidebar está colapsado o no
   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

   // Función para alternar estado del sidebar
   const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

   
  return (
    <div className={`flex h-screen ${styles.background}`}>
      {/* Sidebar recibe nuevo prop "isSidebarCollapsed" */}
      <Sidebar user={user} isSidebarCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1"> {/* Cambia "flex-2" por "flex-1" */}
        {/* Navbar recibe nueva función para controlar sidebar */}
        <Navbar user={user} toggleSidebar={toggleSidebar} />

        {/*  contenido de tu página principal */}
      </div>
    </div>
  );
}