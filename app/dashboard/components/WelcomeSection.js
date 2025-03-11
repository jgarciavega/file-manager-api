// Indica que este es un componente del cliente
"use client"; 
import Image from 'next/image'; 
import styles from './WelcomeSection.module.css'; 


export default function WelcomeSection() {
  return (
    // Contenedor principal con posición relativa y estilos personalizados
    <div className={`relative ${styles.welcomeSection}`}> 

      {/* Componente de imagen con propiedades para ajustar y cubrir el contenedor */}
      <Image
        src="/inicio.webp" // Ruta de la imagen
        alt="Imagen de Bienvenida" // Texto alternativo para la imagen
        layout="fill" // Ocupa todo el espacio del contenedor
        objectFit="cover" // Ajusta la imagen para cubrir el contenedor
        className="rounded-lg" // Bordes redondeados para la imagen
      />

      {/* Contenedor del mensaje de bienvenida con estilo absoluto y fondo semi-transparente */}
      <div className={`absolute top-0 right-0 p-8 bg-white bg-opacity-75 rounded-lg ${styles.welcomeMessage}`}>
        
        {/* Título de bienvenida */}
        <h2 className="text-2xl font-bold text-gray-800">Bienvenido</h2> 
        
        {/* Mensaje descriptivo */}
        <p className="text-gray-700 mt-2">
          Se han enviado a tu cuenta nuevos archivos, puedes revisarlos directamente mediante esta sección.
        </p>
        
        {/* Botón para consultar */}
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Consultar
        </button>
      </div>
    </div>
  );
}
