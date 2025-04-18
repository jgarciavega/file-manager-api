"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import avatarMap from "../../lib/avatarMap";
import admMap from "../../lib/admMap";

export default function VerificationLEA() {
  const { data: session } = useSession();

  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";
  const userPosition = admMap[userEmail] || "000";

  const isAdmin = userEmail === "jorge.garcia@apibcs.com.mx"; // Puedes ajustar esto

  return (
    <div className="min-h-screen p-6 transition-all bg-gray-50 text-gray-800 dark:bg-[#0d1b2a] dark:text-white">
      <div className="flex justify-between items-start mb-6">
        <Image
          src="/api-dark23.png"
          alt="Logo"
          width={300}
          height={60}
          className="rounded-xl"
        />
        <div className="flex items-center gap-4">
          <Image
            src={userAvatar}
            alt={`Avatar de ${userName}`}
            width={50}
            height={50}
            className="rounded-full border-2 border-white"
          />
          <span className="font-semibold">{userName}</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400 text-center">
        Verificación de LEA-BCS
      </h1>

      {!isAdmin ? (
        <div className="p-6 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500 rounded-md text-center">
          ⚠️ No tienes permisos para acceder a esta sección. Por favor, consulta
          con el administrador del sistema.
        </div>
      ) : (
        <div className="text-center text-lg text-gray-600 dark:text-gray-300">
          Aquí irá la interfaz para la validación de cumplimiento con la Ley
          Estatal de Archivos...
          <Link
            href="/home"
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al Inicio
          </Link>
        </div>
      )}
    </div>
  );
}
