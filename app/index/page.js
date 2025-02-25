"use cliente";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react"; 
import FileUploader from "../components/FileUploader";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login"); // Redirigir al login si no hay sesión
    }
  }, [session, status]);

  if (status === "loading") return <p>Cargando...</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold text-center my-10">
        ¡Bienvenido a tu Gestor de Archivos!
      </h1>
      <FileUploader />
    </div>
  );
}
