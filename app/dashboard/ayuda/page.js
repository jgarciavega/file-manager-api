"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

import BackToHomeButton from "../../../components/BackToHomeButton";
import DashboardHeader from '@/components/DashboardHeader'
import FAQSection from "./components/FAQSection";
import TutorialesSection from "./components/TutorialesSection";
import ContactoSection from "./components/ContactoSection";
import LegalSection from "./components/LegalSection";
import NovedadesSection from "./components/NovedadesSection";

export default function AyudaPage() {
  // No manejamos modo localmente: usamos el `DashboardHeader`/ThemeToggle global

  // Tabs para navegación interna
  const [tab, setTab] = useState(0);
  // Sincronizar tema con el toggle global (misma estrategia que Ajustes)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('theme');
      if (t === 'dark' || t === 'light') return t;
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    // Aplicar clase 'dark' en <html> según theme
    root.classList.remove('dark');
    if (theme === 'dark') root.classList.add('dark');

    // Ajustes visuales del body para contraste coherente
    if (theme === 'light') {
      document.body.style.background = '#f8fafc';
      document.body.style.color = '#1e293b';
    } else {
      document.body.style.background = '#0f1724';
      document.body.style.color = '#e6eef8';
    }

    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  // Escuchar cambios externos del tema (MutationObserver + evento global)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      const nowDark = root.classList.contains('dark');
      setTheme(nowDark ? 'dark' : 'light');
    });
    obs.observe(root, { attributes: true, attributeFilter: ['class'] });

    const onThemeChange = (e) => {
      const t = e?.detail?.theme;
      if (t === 'dark' || t === 'light') setTheme(t);
    };
    window.addEventListener('themechange', onThemeChange);

    return () => {
      obs.disconnect();
      window.removeEventListener('themechange', onThemeChange);
    };
  }, []);
  const tabs = [
    { label: "Preguntas Frecuentes", component: <FAQSection /> },
    { label: "Guías y Tutoriales", component: <TutorialesSection /> },
    { label: "Contacto y Soporte", component: <ContactoSection /> },
    { label: "Avisos Legales", component: <LegalSection /> },
    { label: "Novedades", component: <NovedadesSection /> },
  ];

  return (
  <div className={`min-h-screen transition-all duration-300 text-gray-900 dark:text-gray-100 ${theme === 'light' ? '' : ''}`}>
      {/* Reemplazado por DashboardHeader compartido para consistencia visual y toggle global */}
      <DashboardHeader title="Ayuda" avatarUrl="/blanca.jpeg" />

      {/* Barra con botón volver y menú de secciones pegado al header */}
      <div className="w-full flex items-center gap-4 px-6 py-2">
        <div>
          <BackToHomeButton href="/home" label="Volver al Inicio" size="lg" color="primary" shadow />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex gap-3 items-center flex-nowrap">
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
                className={`px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold text-sm md:text-lg transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400/60 select-none relative overflow-hidden border-2 ${
                  tab === i
                    ? "border-blue-600 dark:border-slate-600 bg-white/60 dark:bg-slate-800 text-blue-900 dark:text-yellow-600 shadow-sm scale-105"
                    : "border-gray-300 dark:border-slate-700 bg-transparent text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
                aria-describedby={tab === i ? `tab-feedback-${i}` : undefined}
              >
                {i === 0 && <span aria-hidden="true" className="text-blue-500 md:text-xl">❓</span>}
                {i === 1 && <span aria-hidden="true" className="text-green-500 md:text-xl">📚</span>}
                {i === 2 && <span aria-hidden="true" className="text-cyan-500 md:text-xl">💬</span>}
                {i === 3 && <span aria-hidden="true" className="text-purple-500 md:text-xl">⚖️</span>}
                {i === 4 && <span aria-hidden="true" className="text-yellow-500 md:text-xl">🆕</span>}
                <span className="ml-2">{t.label}</span>
                {tab === i && (
                  <span id={`tab-feedback-${i}`} className="sr-only">(sección activa, presiona flechas para navegar)</span>
                )}
                <span className={`absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 opacity-80 transition-all duration-500 ${tab === i ? 'scale-x-100' : 'scale-x-0'} origin-left`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Duplicado eliminado: el botón 'Volver al Inicio' permanece en la barra superior junto al menú */}


      <main
        className="max-w-5xl mx-auto mt-8 p-0 md:p-10 rounded-3xl shadow-none bg-transparent border border-transparent focus:outline-none"
        tabIndex={-1}
        aria-label="Centro de Ayuda"
      >
        {/* menu moved outside, see above */}

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
            {/* Mostrar la sección activa directamente sin tarjeta intermedia */}
            <div className="w-full transition-all duration-300 flex flex-col gap-6 relative overflow-visible px-2 md:px-0">
              {/* Forzar texto legible en descendientes y enlaces en ambos modos */}
              <div className="prose prose-blue max-w-none dark:prose-invert text-gray-900 dark:text-gray-100">
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
        <footer className="mt-10 py-6 border-t border-blue-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 dark:text-gray-400 bg-transparent">
          <div className="flex items-center gap-2">
            <Image src="/api_logo.png" alt="Logo institucional pequeño" width={32} height={32} className="object-contain" />
            <span>© {new Date().getFullYear()} Institución. Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-4">
            <a href="/aviso-privacidad" className="hover:underline focus:underline text-gray-700 dark:text-gray-200">Privacidad</a>
            <a href="/terminos-condiciones" className="hover:underline focus:underline text-gray-700 dark:text-gray-200">Términos</a>
            <a href="/contacto" className="hover:underline focus:underline text-gray-700 dark:text-gray-200">Contacto</a>
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
