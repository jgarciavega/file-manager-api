"use client";

import BackToHomeButton from "@/components/BackToHomeButton";
import { useSession } from "next-auth/react";
import Image from "next/image";
import avatarMap from "@/lib/avatarMap";

export default function VersionesDocumentales() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Por favor inicia sesión para continuar.</p>
      </div>
    );
  }

  const userEmail = session.user.email;
  const userName = session.user.name;
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] text-gray-800 dark:text-white transition">
      <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
        <Image src="/api-dark23.png" alt="Logo" width={200} height={50} />
        <div className="flex items-center gap-4">
          <Image
            src={userAvatar}
            alt={`Avatar de ${userName}`}
            width={50}
            height={50}
            className="rounded-full border-2 border-blue-500 shadow-lg"
          />
          <span className="font-semibold text-lg">{userName}</span>
        </div>
      </header>

      <main className="p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-6">
          Versiones Documentales
        </h1>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300">
          
        </p>
      </main>

      <footer className="p-4">
        <BackToHomeButton />
      </footer>
    </div>
  );
}
