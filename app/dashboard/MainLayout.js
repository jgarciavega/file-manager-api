import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { useSession } from "next-auth/react";

export default function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { data: session } = useSession();
  const user = {
    name: session?.user?.name || "Usuario",
    email: session?.user?.email || "",
    avatar: session?.user?.avatar || "/default-avatar.png",
    title: session?.user?.title || "",
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={sidebarCollapsed} />
      <div className="flex-1">
        <Navbar user={user} toggleSidebar={() => setSidebarCollapsed(prev => !prev)} />
        {children}
      </div>
    </div>
  );
}
