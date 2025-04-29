"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import avatarMap from "../../../lib/avatarMap";
import admMap from "../../../lib/admMap";

export default function VerificacionLEA() {
  const { data: session, status } = useSession();

  // Mientras carga la sesión, no renderizamos nada para evitar desajustes
  if (status === "loading") {
    return null;
  }

  // Verificamos que exista sesión antes de mostrar contenido dinámico
  const userEmail = session?.user?.email || "";
  const userName = session?.user?.name || "Usuario";
  const userAvatar = avatarMap[userEmail] || "/default-avatar.png";
  const userPosition = admMap[userEmail] || "000";

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-[#0d1b2a] text-gray-800 dark:text-white transition">
      <div className="flex justify-between items-start mb-6">
        <Image src="/api-dark23.png" alt="Logo" width={300} height={60} />
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

      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-10">
        Verificación de LEA-BCS
      </h1>

      <p className="text-center text-lg text-gray-600 dark:text-gray-300 mb-6">
        Aquí irá la interfaz para la validación de cumplimiento con la Ley Estatal de Archivos...
      </p>

      <div className="text-center">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
