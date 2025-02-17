'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);

  const onSubmit = async (data) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setLoginError(true);
    } else {
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
        className="absolute top-0 left-0 w-full h-full filter brightness-50 -z-10"
      />

      {/* Contenedor más grande con fondo blanco sólido */}
      <div className="bg-white bg-opacity-100  shadow-xl p-8 w-[480px] border-2 rounded-lg border-gray-100 backdrop-blur-0 min-h-[420px]">
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
          {loginError && (
            <div className="text-center text-xs text-red-600 mb-3">
              Correo o contraseña incorrectos
            </div>
          )}

          {/* Campos con tamaño controlado y mismo ancho */}
          <div className="mx-4">
            <input
              {...register("email", { required: true })}
              placeholder="Correo electrónico"
              className="w-80 mx-auto block px-4 py-2.5 text-sm border-b-2 border-gray-400 focus:ring-0 outline-none placeholder-gray-400"
            />
          </div>

          <div className="mx-4">
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Contraseña"
            className="w-80 mx-auto block px-4 py-2.5 text-sm border-b-2 border-gray-400 focus:ring-0 outline-none placeholder-gray-400 mb-6"
            />
          </div>

          <div>
          <h2 className="text-l font-bold text-center text-gray-800 -mb-4">
          ¿Olvidaste tu contraseña?
          
        </h2>
        
          </div>


          <div>
          <h2 className="text-l font-bold text-center text-[#a14e5c] mb-6">
          Restablecer
          
        </h2>
        
          </div>

          

          

          {/* Botón más compacto */}
          <div className="mx-24">
            <button
              type="submit"
              className="w-full py-3 text-sm font-semibold text-white bg-[#813441] hover:bg-red-700 rounded-3xl transition-colors duration-200"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}