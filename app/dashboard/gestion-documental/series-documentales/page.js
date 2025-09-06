"use client";

import BackToHomeButton from "../../../../components/BackToHomeButton";

export default function SeriesDocumentales() {
  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-white shadow-md dark:bg-gray-800">
        <img
          src="/api.jpg"
          alt="Logo API-BCS"
          className="h-12 dark:hidden"
        />
        <img
          src="/api-dark23.png"
          alt="Logo API-BCS"
          className="h-12 hidden dark:block"
        />
        <h1 className="text-xl font-bold text-blue-900 dark:text-white text-center flex-grow">
          Series Documentales
        </h1>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
            🌙
          </button>
          <img
            src="/default-avatar.png"
            alt="Avatar"
            className="h-10 w-10 rounded-full"
          />
        </div>
      </header>
      <main className="p-4">
        <p>Contenido de la sección de series documentales.</p>
      </main>
      <footer className="p-4">
        <BackToHomeButton />
      </footer>
    </div>
  );
}
