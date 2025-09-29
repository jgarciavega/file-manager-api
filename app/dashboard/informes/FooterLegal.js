import React, { useState, useEffect } from "react";

export default function FooterLegal({ darkMode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('openLegalModal', onOpen);
    return () => window.removeEventListener('openLegalModal', onOpen);
  }, []);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={`relative z-10 max-w-3xl w-full mx-4 rounded-lg shadow-2xl overflow-hidden transition-transform transform ${darkMode ? 'bg-slate-900 text-blue-100' : 'bg-white text-slate-900'}`} role="dialog" aria-modal="true" aria-label="Aviso legal de informes">
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-slate-700' : 'border-blue-100'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-blue-700 dark:text-blue-300">
                    <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.2A8.2 8.2 0 1 1 12 3.8a8.2 8.2 0 0 1 0 16.4Zm0-12.2a1 1 0 0 1 1 1v3.5a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1Zm0 7.2a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4Z"/>
                  </svg>
                  <h3 className="text-lg font-extrabold tracking-wide">Aviso de Informes y Protección de Datos</h3>
                </div>
                <button onClick={() => setOpen(false)} className="text-sm px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition">Cerrar</button>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-auto space-y-4 text-sm leading-relaxed">
              <p>
                Esta sección permite generar y consultar informes conforme a la
                <a
                  href="https://www.congresobcs.gob.mx/leyes/leyes/Ley_Estatal_de_Archivos.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-blue-700 dark:text-blue-200 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors"
                > Ley Estatal de Archivos de Baja California Sur (LES-BCS)</a> y la
                <a
                  href="https://www.diputados.gob.mx/LeyesBiblio/pdf/LGA_151221.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold text-blue-700 dark:text-blue-200 hover:text-blue-600 dark:hover:text-yellow-300 transition-colors"
                > Ley General de Archivos</a>.
              </p>
              <p>
                La información mostrada es <span className="font-bold text-red-700 dark:text-red-300">confidencial</span> y su uso está restringido a personal autorizado.
              </p>
              <p>
                Toda consulta queda registrada para fines de <span className="font-semibold text-blue-700 dark:text-blue-200">auditoría, transparencia y rendición de cuentas</span>.
              </p>
              <p>
                El uso indebido de esta información puede ser sancionado conforme a la legislación aplicable.
              </p>
            </div>
            <div className={`px-6 py-4 border-t text-right ${darkMode ? 'border-slate-700' : 'border-blue-100'}`}>
              <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-blue-500 text-white font-semibold hover:from-green-700 hover:to-blue-600 transition">Entendido</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
