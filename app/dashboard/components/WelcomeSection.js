"use client";
import Image from 'next/image';
import styles from './WelcomeSection.module.css';

export default function WelcomeSection() {
  return (
    <div className={`relative ${styles.welcomeSection}`}>
      <Image
        src="/inicio.webp"
        alt="Imagen de Bienvenida"
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className={`absolute top-0 right-0 p-8 bg-white bg-opacity-75 rounded-lg ${styles.welcomeMessage}`}>
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2>
        <p className="text-gray-700 mt-2">
          Se han enviado a tu cuenta nuevos archivos, puedes revisarlos directamente mediante esta sección.
        </p>
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Consultar
        </button>
      </div>
    </div>
  );
}
