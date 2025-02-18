// pages/recovery-password.jsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const RecoverPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch("/api/recover-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      if (response.ok) {
        setMessage("Revisa tu correo para restablecer la contraseña.");
        setTimeout(() => router.push("/reset-password"), 3000);
      } else {
        setMessage(result.message || "Error en la recuperación. Verifica tu correo.");
      }
    } catch (error) {
      setMessage("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.");
    }
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center text-black">
      <Image src="/login.jpg" alt="Fondo" layout="fill" objectFit="cover" className="absolute top-0 left-0 w-full h-full filter brightness-50 -z-10" />
      <div className="bg-white shadow-xl p-8 w-[480px] border-2 rounded-lg min-h-[420px]">
        <div className="text-center mb-6">
          <Image src="/api_logo.png" alt="Logo" width={160} height={50} className="mx-auto" priority />
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Recuperar contraseña</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="w-full px-4 py-2 border-b-2 border-gray-400 outline-none"
          />
          <button type="submit" className="w-full py-3 text-white bg-[#813441] hover:bg-[#5f2730] rounded-xl">Enviar solicitud</button>
        </form>
        {message && <p className="text-center text-sm mt-4 text-red-600">{message}</p>}
      </div>
    </div>
  );
};
export default RecoverPassword;
