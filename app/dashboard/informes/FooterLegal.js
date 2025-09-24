import React, { useState } from "react";

export default function FooterLegal({ darkMode }) {
  const [open, setOpen] = useState(false);
  return (
    <footer className="w-full flex justify-center mt-10 mb-4">
      <div
        className={`max-w-3xl w-full mx-auto px-6 py-5 rounded-xl shadow border transition-colors duration-300 text-center flex flex-col items-center gap-2 cursor-pointer select-none
          ${darkMode
            ? 'bg-slate-800/90 text-blue-100 border-blue-900/60'
            : 'bg-blue-50 text-blue-900 border-blue-200'}
        `}
        onClick={() => setOpen((v) => !v)}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-label="Mostrar u ocultar aviso legal de informes"
      >
        <div className="flex items-center gap-2 mb-1">
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="inline-block text-blue-700 dark:text-blue-300"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/></svg>
          <span className="font-extrabold text-base tracking-wide uppercase text-blue-700 dark:text-blue-200">Aviso de Informes y Protección de Datos</span>
          <span className={`ml-2 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}>▶</span>
        </div>
        {open && (
          <p className="text-sm leading-relaxed font-medium max-w-2xl mx-auto mt-2">
            Esta sección permite generar y consultar informes conforme a la
            <a
              href="https://www.congresobcs.gob.mx/leyes/leyes/Ley_Estatal_de_Archivos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors"
            >
              Ley Estatal de Archivos de Baja California Sur (LES-BCS)
            </a>
            y la
            <a
              href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LGA_151221.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-blue-800 dark:text-blue-200 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors"
            >
              Ley General de Archivos
            </a>.
            <br />
            La información mostrada es <span className="font-bold text-red-700 dark:text-red-300">confidencial</span> y su uso está restringido a personal autorizado.<br />
            Toda consulta queda registrada para fines de <span className="font-semibold text-blue-700 dark:text-blue-200">auditoría, transparencia y rendición de cuentas</span>.<br />
            El uso indebido de esta información puede ser sancionado conforme a la legislación aplicable.
          </p>
        )}
      </div>
    </footer>
  );
}
