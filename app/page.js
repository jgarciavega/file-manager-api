"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NEXT_PUBLIC_API_URL from "@/config"; // Asegúrate de que esté bien definido

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();
      console.log("🔐 Respuesta del login completa:", result);

      // Validación de la respuesta
      if (
        !result.success ||
        !result.data ||
        !result.data.token ||
        !result.data.user
      ) {
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

      const { token, user } = result.data;

      if (typeof user.id !== "number") {
        setLoginError("Error inesperado. Datos de usuario incompletos.");
        return;
      }

      // ✅ Registrar login en la bitácora
      try {
        await fetch(`${NEXT_PUBLIC_API_URL}/bitacora`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            accion: "login",
            descripcion: `El usuario ${user.nombre} inició sesión`,
            usuario_id: user.id,
          }),
        });
        console.log("✅ Login registrado en bitácora");
      } catch (error) {
        console.error("Error al registrar en bitácora:", error);
      }

      // ✅ Guardar token y usuario en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role_id", user.role_id.toString());
      localStorage.setItem("user_id", user.id.toString());

      setLoginError("");
      setAttempts(0);

      // ✅ Redireccionar según rol
      if (user.role_id === 2) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("❌ Error en login:", error);
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
