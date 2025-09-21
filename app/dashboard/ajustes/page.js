  // Clases dinámicas para bloques y selects según tema
  const sectionNormativa = theme === "light"
    ? "p-8 rounded-2xl shadow-xl flex flex-col gap-6 border-l-8 bg-white border-blue-300 text-blue-900"
    : "p-8 rounded-2xl shadow-xl flex flex-col gap-6 border-l-8 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-900/90 border-blue-500 text-blue-100";
  const sectionPrefs = theme === "light"
    ? "p-8 rounded-2xl shadow-xl flex flex-col gap-6 border-l-8 bg-white border-blue-200 text-blue-900"
    : "p-8 rounded-2xl shadow-xl flex flex-col gap-6 border-l-8 bg-[#181f2a]/90 border-blue-400 text-blue-100";
  const cardPrincipio = theme === "light"
    ? "bg-blue-50 border border-blue-200 text-blue-900"
    : "bg-blue-800/60 border-l-4 border-blue-400 text-blue-100";
  const selectClass = theme === "light"
    ? "rounded-lg px-3 py-2 font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-white text-blue-900 border-blue-300"
    : "rounded-lg px-3 py-2 font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400/40 bg-blue-900 text-blue-100 border-blue-700";
  const modalAccessibility = theme === "light"
    ? "rounded-2xl border border-blue-200 bg-white p-8 max-w-2xl w-full text-center shadow-2xl relative animate-fadein text-blue-900"
    : "rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 p-8 max-w-2xl w-full text-center shadow-2xl relative animate-fadein text-blue-100";

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
  const [theme, setTheme] = useState(() => typeof window !== "undefined" ? localStorage.getItem("theme") || "midnight" : "midnight");
  const [lang, setLang] = useState(() => typeof window !== "undefined" ? localStorage.getItem("lang") || "es" : "es");
  const [fontSize, setFontSize] = useState(() => typeof window !== "undefined" ? localStorage.getItem("fontSize") || "md" : "md");

  // Aplicar preferencias globales
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark", "midnight");
      document.documentElement.classList.add(theme);
      // Ajusta el fondo y color del body para mejor contraste
      if (theme === "light") {
        document.body.style.background = "#f8fafc";
        document.body.style.color = "#1e293b";
      } else if (theme === "dark") {
        document.body.style.background = "#181f2a";
        document.body.style.color = "#e2e8f0";
      } else {
        document.body.style.background = "#0a1120";
        document.body.style.color = "#e0e7ff";
      }
      localStorage.setItem("theme", theme);
      localStorage.setItem("lang", lang);
      localStorage.setItem("fontSize", fontSize);
    }
  }, [theme, lang, fontSize]);

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



      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-10">
        {/* Bloque normativo y de cultura archivística */}
        <section className={sectionNormativa}>
          <h2 className={theme === "light" ? "text-2xl font-extrabold text-blue-900 tracking-tight mb-2 flex items-center gap-2" : "text-2xl font-extrabold text-blue-100 tracking-tight mb-2 flex items-center gap-2"}>
            <span className={theme === "light" ? "text-blue-700" : "text-blue-200"}>📚</span> Principios rectores de la gestión documental
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base font-medium">
            <li className={`rounded-xl p-4 flex flex-col gap-1 shadow ${cardPrincipio}`}>
              <span className="font-bold">Organización homogénea</span>
              <span>Todos los documentos deben clasificarse y ordenarse bajo criterios uniformes institucionales.</span>
            </li>
            <li className={`rounded-xl p-4 flex flex-col gap-1 shadow ${cardPrincipio}`}>
              <span className="font-bold">Conservación</span>
              <span>La información debe preservarse íntegra y legible durante todo su ciclo de vida.</span>
            </li>
            <li className={`rounded-xl p-4 flex flex-col gap-1 shadow ${cardPrincipio}`}>
              <span className="font-bold">Disponibilidad</span>
              <span>Los archivos deben estar accesibles para su consulta y uso institucional en todo momento.</span>
            </li>
            <li className={`rounded-xl p-4 flex flex-col gap-1 shadow ${cardPrincipio}`}>
              <span className="font-bold">Integridad</span>
              <span>Se debe garantizar que los documentos no sean alterados ni manipulados indebidamente.</span>
            </li>
            <li className={`rounded-xl p-4 flex flex-col gap-1 shadow ${cardPrincipio} md:col-span-2`}>
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
        <section className={sectionPrefs}>
          <h2 className={theme === "light" ? "text-2xl font-extrabold text-blue-900 tracking-tight mb-2 flex items-center gap-2" : "text-2xl font-extrabold text-blue-100 tracking-tight mb-2 flex items-center gap-2"}>
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
                <option value="midnight">Midnight</option>
                <option value="dark">Oscuro</option>
                <option value="light">Claro</option>
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
        </section>

        {/* Botón para mostrar aviso de accesibilidad y protección de datos */}
        <div className="flex justify-center">
          <button
            className="mt-2 px-6 py-3 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100 font-semibold shadow-lg border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setShowAccessibility(true)}
          >
            Ver aviso de accesibilidad y protección de datos
          </button>
        </div>

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
