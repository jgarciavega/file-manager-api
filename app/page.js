// pages/login.jsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [loginError, setLoginError] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const onSubmit = async (data) => {
    clearErrors();
    if (!data.email || !data.password) {
      setError("email", {
        type: "manual",
        message: "El correo es obligatorio",
      });
      setError("password", {
        type: "manual",
        message: "La contraseña es obligatoria",
      });
      return;
    }
    if (!data.email.includes("@") || data.password.length < 6) {
      setError("email", { type: "manual", message: "Correo inválido" });
      setError("password", {
        type: "manual",
        message: "La contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    console.log("Resultado del login:", result); // Depuración

    if (result.error) {
      setLoginError(true);
      setAttempts((prev) => prev + 1);
      setError("email", {
        type: "manual",
        message: "Correo o contraseña incorrectos",
      });
      setError("password", {
        type: "manual",
        message: "Correo o contraseña incorrectos",
      });

      if (attempts + 1 >= 3) {
        setTimeout(() => {
          router.push("/recovery-password");
        }, 1000);
      }
    } else {
      setLoginError(false);
      setAttempts(0);
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
            {...register("email", { required: true })}
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border-b-2 border-gray-400 outline-none"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Contraseña"
            className="w-full px-4 py-2 border-b-2 border-gray-400 outline-none"
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
          {loginError && (
            <p className="text-red-600 text-sm">Usuario incorrecto</p>
          )}
          <div className="text-center mt-4">
            <a href="/recovery-password" className="text-[#0a0a0a]">
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
              className="inline-block px-16 py-2 text-white bg-[#7e4142] hover:bg-[#cd4058] rounded-xl"
            >
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
