import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import WelcomeSection from "../dashboard/components/WelcomeSection";
import ReportsCard from "../dashboard/components/ReportsCard";
import PendingDocumentsCard from "../dashboard/components/PendingDocumentsCard";
import styles from './HomePage.module.css';

export default function Home() {
  return (
    <div className={`flex h-screen ${styles.background}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar />

        {/* Welcome Section */}
        <div className={`p-6 bg-welcome-image bg-cover flex flex-col items-center ${styles.welcomeSection}`}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Gestor de Archivos Puerto de Pichilingue
          </h2>
          <WelcomeSection />
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Consultar
          </button>
        </div>

        {/* Cards Section */}
        <div className="text-gray-950 grid grid-cols-2 gap-4 p-6">
          <ReportsCard
            title="Reportes generados"
            count={22}
            lastUpdate="Hace 4 días"
            hasUploadButton={true}
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
