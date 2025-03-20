"use client"
import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import { useState } from "react";
import Image from "next/image"; 
import styles from './HomePage.module.css';

export default function Home() {
  const user = {
    name: "Julio Rubio",
    avatar: "/julio-rubio.jpg",
    workArea: "Contraloria",
    position: "749",
    
  };

   // Estado de sidebar colapsado o no
   const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
   // alternar estado del sidebar
   const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <div className={`flex h-screen ${styles.background}`}>
      {/* recibe nuevo prop "isSidebarCollapsed" */}
      <Sidebar user={user} isSidebarCollapsed={isSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1"> 

        {/* Navbar recibe nueva función para controlar sidebar */}
        <Navbar user={user} toggleSidebar={toggleSidebar} />

        {/*  contenido de tu página principal */}
      </div>
    </div>
  );
}