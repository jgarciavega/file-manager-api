"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Mientras la sesión se está cargando, no renderices nada (ni layout ni sidebar)
  if (status === "loading") {
    return <div style={{padding: 40, textAlign: 'center', color: '#2563eb', fontWeight: 600}}>Cargando sesión...</div>;
  }

  // Si no hay sesión, tampoco renderices nada (el useEffect hará la redirección)
  if (!session) {
    return null;
  }

  // Si hay sesión, renderiza normalmente
  return <>{children}</>;
}
