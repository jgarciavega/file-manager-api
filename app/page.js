'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const { register, handleSubmit, setError, clearErrors } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (data) => {
    clearErrors();  // Limpiar errores antes de un nuevo intento de inicio de sesión
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("Login result:", result);
    
    if (result.error) {
      setLoginError(true);
      setError("email", { type: "manual", message: "Correo o contraseña incorrectos" });
      setError("password", { type: "manual", message: "Correo o contraseña incorrectos" });
      console.log("Redirecting to /recovery-password");
      router.push("/recovery-password");  // Redirigir a la página de recuperación de contraseña
    } else {
      setLoginError(false);
      router.push("/");
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center text-black">
      <Image
        src="/login.jpg"
        alt="Fondo"
        layout="fill"
        objectFit="cover"
        className="absolute top-0 left-0 w-full h-full -z-10"
      />

      {/* Contenedor más grande con fondo blanco sólido */}
      <div className="bg-white bg-opacity-100 shadow-xl rounded-xl p-8 w-[480px] border-2 border-gray-100 backdrop-blur-0 min-h-[420px]">
        <div className="text-center mb-6">
          <div className="flex justify-center">
            <Image
              src="/api_logo.png"
              alt="Logo"
              width={200}
              height={20}
              priority
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="mx-4">
            <input
              {...register("email", { required: true })}
              placeholder="Escriba aquí su usuario"
              className="w-[calc(100%-32px)] mx-auto block px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none placeholder-gray-400"
            />
            {loginError && (
              <div className="text-xs text-red-600 mt-2">
                Usuario incorrecto
              </div>
            )}
          </div>

          <div className="mx-4">
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Escriba aquí su contraseña"
              className="w-[calc(100%-32px)] mx-auto block px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none placeholder-gray-400"
            />
            {loginError && (
              <div className="text-xs text-red-600 mt-2">
                Contraseña incorrecta
              </div>
            )}
          </div>

          {/* Botón más compacto */}
          <div className="mx-4">
            <button
              type="submit"
              className="w-full py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
