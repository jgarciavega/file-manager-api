"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [attempts, setAttempts] = useState(0);

  // Regex para la validación del correo
  const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      console.log("📌 Respuesta del login:", result);

      if (result?.error) {
        console.log("🚨 Error en el login:", result.error);
        setLoginError("Credenciales incorrectas");
        setAttempts((prev) => prev + 1);
        if (attempts + 1 >= 3) {
          setLoginError(
            "Demasiados intentos fallidos. Redirigiendo a recuperación de contraseña..."
          );
          setTimeout(() => {
            router.push("/recover-password");
          }, 2000);
        }
        return;
      }

      // ✅ Si el login es exitoso
      console.log("✅ Inicio de sesión exitoso, redirigiendo...");

      // Obtener la sesión para conocer el rol
      const res = await fetch("/api/auth/session");
      const session = await res.json();

      console.log("🧾 Sesión actual:", session);

      // Redirigir según el rol del usuario
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/home");
      }

      setLoginError("");
      setAttempts(0);
    } catch (error) {
      console.error("Error durante el login:", error);
      setLoginError("Error al intentar iniciar sesión");
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center text-black">
      <Image
        src="/login.jpg"
        alt="Fondo"
        fill={true}
        className="absolute top-0 left-0 w-full filter brightness-50 -z-10 object-cover"
      />
      <div className="bg-white shadow-xl p-8 w-[480px] border-2 rounded-lg min-h-[420px]">
        <div className="text-center mb-6">
          <Image
            src="/api_logo.png"
            alt="Logo"
            width={160}
            height={50}
            className="mx-auto"
            priority
          />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: EMAIL_REGEX,
                message: "Por favor ingrese un correo electrónico válido",
              },
            })}
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-1 border-b-2 border-gray-400 outline-none focus:border-[#7e4142]"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
          <input
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-1 border-b-2 border-gray-400 outline-none focus:border-[#7e4142]"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
          {loginError && (
            <p className="text-red-600 text-sm text-center">{loginError}</p>
          )}
          <div className="text-center mt-4">
            <a
              href="/recover-password"
              className="text-[#0a0a0a] hover:text-[#7e4142]"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div
            className="text-center text-gray-600 relative"
            style={{ top: "-20px" }}
          >
            Restablecer
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-block px-16 py-2 text-white bg-[#7e4142] hover:bg-[#cd4058] rounded-xl transition-colors duration-200"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
