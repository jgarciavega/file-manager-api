"use client";
import Image from "next/image";
import { useState } from "react";

import BackToHomeButton from "../../../components/BackToHomeButton";
import FAQSection from "./components/FAQSection";
import TutorialesSection from "./components/TutorialesSection";
import ContactoSection from "./components/ContactoSection";
import LegalSection from "./components/LegalSection";
import NovedadesSection from "./components/NovedadesSection";

export default function AyudaPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Tabs para navegación interna
  const [tab, setTab] = useState(0);
  const tabs = [
    { label: "Preguntas Frecuentes", component: <FAQSection /> },
    { label: "Guías y Tutoriales", component: <TutorialesSection /> },
    { label: "Contacto y Soporte", component: <ContactoSection /> },
    { label: "Avisos Legales", component: <LegalSection /> },
    { label: "Novedades", component: <NovedadesSection /> },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"
      }`}
    >
      {/* Header institucional sin el botón de regreso */}
      <div
        className={`sticky top-0 z-40 border-b flex items-center px-6 py-4 gap-6 ${
          darkMode
            ? "bg-slate-900/95 border-slate-700"
            : "bg-white/95 border-blue-200"
        }`}
      >
        <Image
          src="/api-dark23.png"
          alt="API Logo"
          width={260}
          height={90}
          className="object-contain"
          priority
        />
        <h1
          className="flex-1 text-5xl md:text-6xl font-extrabold text-center tracking-tight relative select-none animate-title-fadein"
          style={{ letterSpacing: '0.01em', lineHeight: 1.08 }}
        >
          <span
            className="inline-block transition-transform duration-300 animate-wave-text"
            style={{
              color: '#06b6d4', // cyan-400
              filter: 'none',
              display: 'inline-block',
            }}
          >
            {"Ayuda".split("").map((char, idx) => (
              <span
                key={idx}
                className="inline-block wave-char"
                style={{
                  animationDelay: `${idx * 0.10 + 0.2}s`,
                  opacity: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 0 #fff',
                  color: 'inherit',
                }}
              >
                {char === " " ? '\u00A0' : char}
              </span>
            ))}
          </span>
          <span className="block h-0.5 w-1/3 mx-auto mt-3 rounded-full bg-gradient-to-r from-blue-300 via-slate-300 to-blue-200 opacity-60 animate-underline-fade"></span>
          <style jsx>{`
            .animate-title-fadein {
              animation: title-fadein 1.2s cubic-bezier(0.23, 1, 0.32, 1) both;
            }
            @keyframes title-fadein {
              0% { opacity: 0; filter: blur(8px); letter-spacing: 0.2em; }
              60% { opacity: 1; filter: blur(0.5px); letter-spacing: 0.04em; }
              100% { opacity: 1; filter: blur(0); letter-spacing: 0.01em; }
            }
            .animate-underline-fade {
              animation: underline-fade 1.6s cubic-bezier(0.4,0,0.2,1) both;
            }
            @keyframes underline-fade {
              0% { opacity: 0; transform: scaleX(0.7); }
              60% { opacity: 0.7; transform: scaleX(1.1); }
              100% { opacity: 0.6; transform: scaleX(1); }
            }
            .animate-wave-text .wave-char {
              animation: wave-char 2.2s cubic-bezier(0.4,0,0.2,1) infinite alternate;
            }
            @keyframes wave-char {
              0% { transform: translateY(0px) scaleY(1); }
              30% { transform: translateY(-7px) scaleY(1.12); }
              60% { transform: translateY(2px) scaleY(0.98); }
              100% { transform: translateY(0px) scaleY(1); }
            }
            @media (max-width: 640px) {
              .animate-title-fadein { font-size: 2.2rem !important; }
            }
          `}</style>
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-slate-800 text-yellow-400"
                : "bg-gray-100 text-gray-600"
            }`}
            aria-label="Cambiar modo oscuro"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
          <Image
            src="/blanca.jpeg"
            alt="Avatar institucional"
            width={72}
            height={72}
            className="rounded-full border-4 border-blue-400 shadow object-cover"
            priority
          />
        </div>
      </div>

      {/* Botón volver al inicio alineado a la izquierda, debajo del header institucional */}
      <div className="w-full flex px-6 pt-3 pb-1">
        <BackToHomeButton
          href="/home"
          label="Volver al Inicio"
          size="lg"
          color="primary"
          className="mr-auto"
          shadow
        />
      </div>


      <main
        className="max-w-5xl mx-auto mt-10 p-0 md:p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-white/95 via-blue-50/90 to-green-50/90 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-blue-900/90 border border-blue-100 dark:border-slate-800 focus:outline-none"
        tabIndex={-1}
        aria-label="Centro de Ayuda"
      >
        {/* Navegación accesible por tabs premium */}
        <nav
          className="flex flex-wrap gap-3 justify-center mb-10 px-2 md:px-0"
          role="tablist"
          aria-label="Secciones de ayuda"
        >
          {tabs.map((t, i) => (
            <button
              key={t.label}
              id={`ayuda-tab-${i}`}
              role="tab"
              aria-selected={tab === i}
              aria-controls={`ayuda-panel-${i}`}
              tabIndex={tab === i ? 0 : -1}
              onClick={() => setTab(i)}
              onKeyDown={e => {
                if (e.key === 'ArrowRight') setTab((tab + 1) % tabs.length);
                if (e.key === 'ArrowLeft') setTab((tab - 1 + tabs.length) % tabs.length);
                if (e.key === 'Home') setTab(0);
                if (e.key === 'End') setTab(tabs.length - 1);
              }}
              className={`px-6 py-3 rounded-2xl font-bold text-lg transition-all duration-200 border-b-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60 shadow-md select-none group relative overflow-hidden ${
                tab === i
                  ? "border-blue-700 bg-gradient-to-r from-blue-100 via-cyan-100 to-green-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 text-blue-900 dark:text-blue-200 scale-105"
                  : "border-transparent bg-gray-100/60 dark:bg-slate-900/60 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800"
              }`}
              aria-describedby={tab === i ? `tab-feedback-${i}` : undefined}
            >
              <span className="flex items-center gap-2">
                {i === 0 && <span aria-hidden="true" className="text-blue-500 text-xl">❓</span>}
                {i === 1 && <span aria-hidden="true" className="text-green-500 text-xl">📚</span>}
                {i === 2 && <span aria-hidden="true" className="text-cyan-500 text-xl">💬</span>}
                {i === 3 && <span aria-hidden="true" className="text-purple-500 text-xl">⚖️</span>}
                {i === 4 && <span aria-hidden="true" className="text-yellow-500 text-xl">🆕</span>}
                <span>{t.label}</span>
              </span>
              {tab === i && (
                <span id={`tab-feedback-${i}`} className="sr-only">(sección activa, presiona flechas para navegar)</span>
              )}
              {/* Microinteracción animada */}
              <span className={`absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 opacity-80 transition-all duration-500 ${tab === i ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 origin-left`}></span>
            </button>
          ))}
        </nav>

        {/* Panel accesible con feedback visual, landmarks y animación */}
        <section
          id={`ayuda-panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`ayuda-tab-${tab}`}
          tabIndex={0}
          className="outline-none focus-visible:ring-4 focus-visible:ring-blue-300/60 transition-all duration-300"
        >
          <div className="relative min-h-[340px] md:min-h-[480px] flex flex-col gap-10 animate-fadein">
            {/* Separador visual premium */}
            <div className="w-full h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-green-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 rounded-full mb-2 opacity-90 shadow-lg" aria-hidden="true"></div>
            {/* Renderizado de la sección activa con tarjeta institucional */}
            <div className="rounded-3xl bg-white/95 shadow-2xl border border-blue-100 p-8 md:p-14 transition-all duration-300 flex flex-col gap-6 relative overflow-hidden dark:bg-gradient-to-br dark:from-[#0a2233]/95 dark:via-[#102a3a]/90 dark:to-[#0a1826]/95 dark:border-cyan-600 dark:text-cyan-100">
              {/* Detalle visual institucional */}
              <span className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 rounded-bl-3xl opacity-40 pointer-events-none dark:from-cyan-800 dark:via-cyan-700 dark:to-cyan-900" aria-hidden="true"></span>
              <div className="prose prose-blue max-w-none dark:prose-invert dark:text-cyan-100">
                {tabs[tab].component}
              </div>
            </div>
            {/* Mensaje de transparencia y legalidad destacado */}
            <div className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2 select-none px-2 md:px-0">
              <span className="inline-block align-middle mr-1">🔒</span>
              <span className="font-semibold">Transparencia y Legalidad:</span> Su información es tratada conforme a la <a href="/aviso-privacidad" className="underline hover:text-blue-600 focus:text-blue-700 transition-colors">Política de Privacidad</a> y <a href="/terminos-condiciones" className="underline hover:text-blue-600 focus:text-blue-700 transition-colors">Términos y Condiciones</a>.<br />
              Para soporte institucional, consulte la sección de contacto o escriba a <a href="mailto:soporte@institucion.edu" className="underline hover:text-cyan-600 focus:text-cyan-700 transition-colors">soporte@institucion.edu</a>.
            </div>
          </div>
        </section>
        {/* Footer institucional premium */}
        <footer className="mt-10 py-6 border-t border-blue-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400 bg-transparent">
          <div className="flex items-center gap-2">
            <Image src="/api_logo.png" alt="Logo institucional pequeño" width={32} height={32} className="object-contain" />
            <span>© {new Date().getFullYear()} Institución. Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-4">
            <a href="/aviso-privacidad" className="hover:underline focus:underline">Privacidad</a>
            <a href="/terminos-condiciones" className="hover:underline focus:underline">Términos</a>
            <a href="/contacto" className="hover:underline focus:underline">Contacto</a>
          </div>
        </footer>
        <style jsx>{`
          .animate-fadein {
            animation: fadein 0.7s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadein {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </main>
    </div>
  );
}
