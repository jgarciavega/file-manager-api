// pages/login.jsx
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
  const [attempts, setAttempts] = useState(0);

  const onSubmit = async (data) => {
    clearErrors();
    if (!data.email.includes("@") || data.password.length < 6) {
      setError("email", { type: "manual", message: "Correo inválido" });
      setError("password", { type: "manual", message: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result.error) {
      setLoginError(true);
      setAttempts(prev => prev + 1);
      setError("email", { type: "manual", message: "Correo o contraseña incorrectos" });
      setError("password", { type: "manual", message: "Correo o contraseña incorrectos" });
      
      if (attempts >= 2) {
        router.push("/recovery-password");
      }
    } else {
      setLoginError(false);
      setAttempts(0);
      router.push("/");
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center text-black">
      <Image src="/login.jpg" alt="Fondo" layout="fill" objectFit="cover" className="absolute top-0 left-0 w-full h-full filter brightness-50 -z-10" />
      <div className="bg-white shadow-xl p-8 w-[480px] border-2 rounded-lg min-h-[420px]">
        <div className="text-center mb-6">
          <Image src="/api_logo.png" alt="Logo" width={160} height={50} className="mx-auto" priority />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input {...register("email", { required: true })} placeholder="Correo electrónico" className="w-full px-4 py-2 border-b-2 border-gray-400 outline-none" />
          <input type="password" {...register("password", { required: true })} placeholder="Contraseña" className="w-full px-4 py-2 border-b-2 border-gray-400 outline-none" />
          {loginError && <p className="text-red-600 text-sm">Usuario incorrecto</p>}
          <button type="submit" className="w-full py-3 text-white bg-[#813441] hover:bg-[#5f2730] rounded-xl">Ingresar</button>
        </form>
        <div className="text-center mt-4">
          <a href="/recovery-password" className="text-[#a14e5c]">¿Olvidaste tu contraseña? Restablecer</a>
        </div>
      </div>
    </div>
  );
}
