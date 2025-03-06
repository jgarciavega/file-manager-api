// pages/index.js
"use client";

import NotificationBell from "../dashboard/components/NotificationBell";
import Navbar from "../dashboard/components/Navbar";
import Sidebar from "../dashboard/components/Sidebar";
import WelcomeSection from "../dashboard/components/WelcomeSection";
import ReportsCard from "../dashboard/components/ReportsCard";
import PendingDocumentsCard from "../dashboard/components/PendingDocumentsCard";
import SearchBar from "../dashboard/components/SearchBar";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Welcome Section */}
        <div className="p-6 bg-welcome-image bg-cover">
          <WelcomeSection />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 p-6">
          <ReportsCard
            title="Reportes generados"
            count={22}
            lastUpdate="Hace 4 días"
          />
          <PendingDocumentsCard
            title="Documentos pendientes"
            count={11}
            lastUpdate="Hace 5 días"
          />
        </div>
      </div>
    </div>
  );
}
