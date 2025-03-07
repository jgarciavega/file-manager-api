import Sidebar from "../dashboard/components/Sidebar";
import Navbar from "../dashboard/components/Navbar";
import Image from "next/image"; // Asegúrate de importar el componente Image
import styles from './HomePage.module.css';

export default function Home() {
  const user = {
    name: "Jorge Garcia",
    avatar: "/av3.webp"
  };

  return (
    <div className={`flex h-screen ${styles.background}`}>
      {/* Sidebar */}
      <Sidebar user={user} />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <Navbar user={user} />
      </div>
    </div>
  );
}
