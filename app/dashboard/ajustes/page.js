"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "components/BackToHomeButton";
import avatarMap from "lib/avatarMap";
import { useSession } from "next-auth/react";


export default function AjustesPage() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  const avatar = avatarMap[email] || "/default-avatar.png";
  const nombre = session?.user?.name || "Usuario";
  const [showHelp, setShowHelp] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  // Preferencias globales
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("theme");
      if (t === "dark" || t === "light") return t;
    }
    return "light";
  });
  const [lang, setLang] = useState(() => typeof window !== "undefined" ? localStorage.getItem("lang") || "es" : "es");
  const [fontSize, setFontSize] = useState(() => typeof window !== "undefined" ? localStorage.getItem("fontSize") || "md" : "md");

  // Clases dinámicas para bloques y selects según tema
  const sectionNormativa = theme === "light"
    ? "p-8 rounded-2xl shadow-lg flex flex-col gap-6 bg-white text-blue-900 font-sans"
    : "p-8 rounded-2xl shadow-lg flex flex-col gap-6 bg-[#1a2332] text-blue-100 font-sans";
  const sectionPrefs = theme === "light"
    ? "p-8 rounded-2xl shadow-lg flex flex-col gap-6 bg-white text-blue-900 font-sans"
    : "p-8 rounded-2xl shadow-lg flex flex-col gap-6 bg-[#1a2332] text-blue-100 font-sans";
  const cardPrincipio = theme === "light"
    ? "bg-blue-100 text-blue-900 rounded-lg shadow p-4"
    : "bg-blue-900/60 text-blue-100 rounded-lg shadow p-4";
  const selectClass = theme === "light"
    ? "rounded-lg px-3 py-2 font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-white text-blue-900 border-blue-300"
    : "rounded-lg px-3 py-2 font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-blue-900 text-blue-100 border-blue-700";
  const modalAccessibility = theme === "light"
    ? "rounded-2xl border border-blue-200 bg-white p-8 max-w-2xl w-full text-center shadow-2xl relative animate-fadein text-blue-900"
    : "rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-8 max-w-2xl w-full text-center shadow-2xl relative animate-fadein text-blue-100";

  // Aplicar preferencias globales
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Aplicar solo 'dark' o 'light' en <html>
      document.documentElement.classList.remove("dark");
      if (theme === "dark") document.documentElement.classList.add("dark");

      // Ajusta el fondo y color del body para mejor contraste
      if (theme === "light") {
        document.body.style.background = "#f8fafc";
        document.body.style.color = "#1e293b";
      } else {
        document.body.style.background = "#0f1724"; // fondo oscuro más neutro
        document.body.style.color = "#e6eef8";
      }
      localStorage.setItem("theme", theme);
      localStorage.setItem("lang", lang);
      localStorage.setItem("fontSize", fontSize);
    }
  }, [theme, lang, fontSize]);

  // Sincronizar el estado `theme` si otra parte de la app cambia la clase 'dark' en <html>
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const obs = new MutationObserver(() => {
      const nowDark = root.classList.contains("dark");
      setTheme(nowDark ? "dark" : "light");
    });
    obs.observe(root, { attributes: true, attributeFilter: ["class"] });
    // Además escuchar eventos explícitos emitidos por otros componentes (ej. DashboardHeader)
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

  // Determinar clases de fondo y texto según el tema
  const themeBg = theme === "light"
    ? "bg-gradient-to-br from-blue-50 via-white to-blue-100 text-blue-900"
    : theme === "dark"
      ? "bg-gradient-to-br from-[#181f2a] via-[#232b3b] to-[#23395d] text-blue-100"
      : "bg-gradient-to-br from-[#0a1120] via-[#1e293b] to-[#23395d] text-blue-100";

  return (
    <div className={`min-h-screen ${themeBg}`}>
      {/* Header institucional con DashboardHeader */}
      <DashboardHeader title="Ajustes" avatarUrl={avatar} />
      {/* Botón volver al inicio y ayuda contextual */}
      <div className="w-full flex px-6 pt-3 pb-1 items-center">
        <BackToHomeButton
          href="/home"
          label="Volver al Inicio"
          size="lg"
          color="primary"
          className="mr-auto"
          shadow
        />
        <button
          className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-100 font-semibold shadow-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="¿Por qué personalizar la experiencia?"
          onClick={() => setShowHelp(true)}
        >
          <span className="text-blue-300 text-xl">ℹ️</span>
          Ayuda
        </button>
      </div>

      {/* Modal de ayuda contextual */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white text-blue-900 rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fadein">
            <button
              className="absolute top-3 right-3 text-2xl text-blue-700 hover:text-red-600 font-bold"
              onClick={() => setShowHelp(false)}
              aria-label="Cerrar ayuda"
            >
              ×
            </button>
            <h2 className="text-2xl font-extrabold mb-2 text-blue-800">¿Por qué personalizar la experiencia?</h2>
            <div className="text-base leading-relaxed space-y-2">
              <p>
                La personalización y accesibilidad en el sistema de gestión documental permite que cada usuario adapte la plataforma a sus necesidades visuales y de idioma, promoviendo la inclusión y el acceso universal.
              </p>
              <p>
                Estas opciones cumplen con la <b>Ley Estatal de Archivos de BCS</b>, garantizando que la información sea accesible, comprensible y utilizable para todos los usuarios, sin distinción.
              </p>
              <p className="text-xs text-blue-700 mt-4">
                Puedes cambiar el idioma, el modo visual y el tamaño de fuente en cualquier momento. Tus preferencias se aplicarán en toda la aplicación.
              </p>
            </div>
          </div>
        </div>
      )}



  <main className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
  {/* Bloque normativo y de cultura archivística */}
  <section className={sectionNormativa + ' w-full'}>
          <h2 className={theme === "light" ? "text-3xl font-bold text-blue-900 mb-4 flex items-center gap-2" : "text-3xl font-bold text-blue-100 mb-4 flex items-center gap-2"}>
            <span className={theme === "light" ? "text-blue-700" : "text-blue-200"}>📚</span> Principios rectores de la gestión documental
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base font-medium">
            <li className={cardPrincipio}>
              <span className="font-bold">Organización homogénea</span>
              <span>Todos los documentos deben clasificarse y ordenarse bajo criterios uniformes institucionales.</span>
            </li>
            <li className={cardPrincipio}>
              <span className="font-bold">Conservación</span>
              <span>La información debe preservarse íntegra y legible durante todo su ciclo de vida.</span>
            </li>
            <li className={cardPrincipio}>
              <span className="font-bold">Disponibilidad</span>
              <span>Los archivos deben estar accesibles para su consulta y uso institucional en todo momento.</span>
            </li>
            <li className={cardPrincipio}>
              <span className="font-bold">Integridad</span>
              <span>Se debe garantizar que los documentos no sean alterados ni manipulados indebidamente.</span>
            </li>
            <li className={cardPrincipio + " md:col-span-2"}>
              <span className="font-bold">Acceso expedito</span>
              <span>La consulta de archivos debe ser ágil, transparente y conforme a la ley.</span>
            </li>
          </ul>
          <div className={theme === "light" ? "mt-4 text-sm text-blue-700" : "mt-4 text-sm text-blue-200"}>
            <b>Recuerda:</b> El cumplimiento de estos principios es responsabilidad de todos los usuarios del sistema.<br/>
            Consulta la <a href="https://www.cbcs.gob.mx/index.php/cmply/6728-ley-de-archivos-para-el-estado-de-baja-california-sur" target="_blank" className={theme === "light" ? "underline text-blue-800 hover:text-blue-600" : "underline text-blue-300 hover:text-blue-100"}>Ley Estatal de Archivos de BCS</a> y los <a href="/manual-organizacion" className={theme === "light" ? "underline text-blue-800 hover:text-blue-600" : "underline text-blue-300 hover:text-blue-100"}>manuales institucionales</a> para más información.
          </div>
        </section>

  {/* Preferencias globales */}
  <section className={sectionPrefs + ' w-full flex flex-col justify-between'}>
          <h2 className={theme === "light" ? "text-3xl font-bold text-blue-900 mb-4 flex items-center gap-2" : "text-3xl font-bold text-blue-100 mb-4 flex items-center gap-2"}>
            <span className={theme === "light" ? "text-blue-700" : "text-blue-300"}>⚙️</span> Preferencias de usuario
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Selector de idioma */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold">Idioma de la aplicación</label>
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                className={selectClass}
                aria-label="Seleccionar idioma"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            {/* Selector de tema visual */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold">Modo visual</label>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  className={selectClass}
                  aria-label="Seleccionar modo visual"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
            </div>
            {/* Selector de tamaño de fuente */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-semibold">Tamaño de fuente</label>
              <select
                value={fontSize}
                onChange={e => setFontSize(e.target.value)}
                className={selectClass}
                aria-label="Seleccionar tamaño de fuente"
              >
                <option value="md">Mediano</option>
                <option value="lg">Grande</option>
                <option value="xl">Extra grande</option>
              </select>
            </div>
          </div>
          <div className={theme === "light" ? "text-xs text-blue-700 mt-2" : "text-xs text-blue-300 mt-2"}>Estas preferencias se aplican en toda la aplicación y se guardan en tu dispositivo.</div>

          {/* Botón para mostrar aviso de accesibilidad y protección de datos alineado al fondo de la tarjeta */}
          <div className="mt-6 flex justify-center">
            <button
              className="mt-2 px-6 py-3 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-semibold shadow-md border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setShowAccessibility(true)}
            >
              Ver aviso de accesibilidad y protección de datos
            </button>
          </div>
        </section>

        {/* Modal de aviso de accesibilidad y protección de datos (formato visual de la captura) */}
        {showAccessibility && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={modalAccessibility}>
              <button
                className={theme === "light" ? "absolute top-3 right-3 text-2xl text-blue-700 hover:text-red-600 font-bold" : "absolute top-3 right-3 text-2xl text-blue-100 hover:text-red-200 font-bold"}
                onClick={() => setShowAccessibility(false)}
                aria-label="Cerrar aviso"
              >
                ×
              </button>
              <h2 className={theme === "light" ? "text-xl md:text-2xl font-extrabold mb-2 text-blue-900" : "text-xl md:text-2xl font-extrabold mb-2 text-blue-100"}>Aviso de Accesibilidad y Protección de Datos</h2>
              <p className={theme === "light" ? "text-base md:text-lg text-blue-900 font-medium" : "text-base md:text-lg text-blue-100 font-medium"}>
                Esta sección cumple con la <b>Ley Estatal de Archivos de Baja California Sur (LEA-BCS)</b>.<br />
                Tus preferencias de accesibilidad e idioma están protegidas y solo se usan para mejorar tu experiencia.<br />
                Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, contacta a la Unidad de Transparencia institucional.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
