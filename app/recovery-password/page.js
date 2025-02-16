'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const RecoverPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí va la lógica para la recuperación de contraseña
    };

    return (
        <div className="recovery-container">
            <Image src="/login.jpg" alt="Fondo Recuperación" layout="fill" objectFit="cover" />
            <div className="recovery-form">
                <div className="logo">
                    <Image src="/bcs_logo.png" alt="Logo API-BCS" width={150} height={50} />
                </div>
                <h2>Restablecer contraseña</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo electrónico</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit">Enviar solicitud</button>
                </form>
                <Link href="/reset-password">
                    <a>Ir a restablecer contraseña</a>
                </Link>
            </div>
        </div>
    );
};

export default RecoverPassword;
