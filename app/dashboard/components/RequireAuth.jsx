"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // o cookies, según lo manejes

    if (!token) {
      router.replace("/login");
      return;
    }

    // Aquí puedes validar el token con tu backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then(() => {
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token"); // opcional
        router.replace("/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#2563eb", fontWeight: 600 }}>
        Verificando sesión...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El redirect ya se hizo en el useEffect
  }

  return <>{children}</>;
}
