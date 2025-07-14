"use client";

import { useState, useRef } from "react";
// Tooltip visual accesible
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  const timeout = useRef();
  return (
    <span className="relative inline-block"
      onMouseEnter={() => { timeout.current = setTimeout(() => setShow(true), 300); }}
      onMouseLeave={() => { clearTimeout(timeout.current); setShow(false); }}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={-1}
    >
      {children}
      {show && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-gray-900 text-xs text-white shadow-lg whitespace-nowrap pointer-events-none animate-fade-in"
          role="tooltip"
        >{text}</span>
      )}
      <style jsx>{`
        .animate-fade-in { animation: fade-in 0.18s ease; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </span>
  );
}
import Image from "next/image";
import BackToHomeButton from "../../../components/BackToHomeButton";

export default function AjustesPage() {
  // Estado para modo oscuro (ejemplo, puedes conectar con global)
  const [darkMode, setDarkMode] = useState(false);
  // Estado para idioma visual
  const [lang, setLang] = useState("es"); // "es" o "en"
  // Estado para tamaño de fuente
  const [fontSize, setFontSize] = useState("md"); // "md" o "xl"

  // Datos de usuario simulados
  const user = {
    nombre: "Jorge Vega",
    correo: "jorge@ejemplo.com",
    avatar: "/blanca.jpeg",
  };

  // Estado y lógica para cambio de contraseña
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  function handlePasswordChange(e) {
    e.preventDefault();
    setMsg("");
    if (password.length < 8) {
      setMsgType("error");
      setMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    // Simulación de petición async
    setTimeout(() => {
      setLoading(false);
      setMsgType("success");
      setMsg("Contraseña actualizada correctamente.");
      setPassword("");
    }, 1200);
  }

  // Estado para historial de sesiones (simulado)
  const [sessions, setSessions] = useState([
    { id: 1, text: "Sesión iniciada el 13/07/2025 09:12 desde Windows 10 (Chrome)" },
    { id: 2, text: "Sesión cerrada el 12/07/2025 18:44 desde Windows 10 (Chrome)" },
    { id: 3, text: "Sesión iniciada el 12/07/2025 08:01 desde Android (App móvil)" },
  ]);
  // Eliminar sesión con animación
  function handleDeleteSession(id) {
    setSessions(sessions => sessions.filter(s => s.id !== id));
  }
  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"} ${fontSize === 'xl' ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}> 
      {/* Header premium institucional */}
      <div className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-4 ${darkMode ? "bg-slate-900/95 border-slate-700" : "bg-white/95 border-blue-200"}`}>
        {/* Logo institucional a la izquierda */}
        <div className="flex items-center gap-8 min-w-[320px]">
          <Image src="/api-dark23.png" alt="API Logo" width={280} height={120} className="object-contain" priority />
        </div>
        {/* Título */}
        <h1 className="flex-1 text-4xl md:text-6xl font-extrabold text-center tracking-tight relative group select-none"
          style={{ letterSpacing: '0.01em', lineHeight: 1.08 }}>
          <span className="inline-block bg-gradient-to-r from-blue-700 via-cyan-400 to-green-400 bg-[length:200%_200%] bg-clip-text text-transparent animate-gradient-move transition-transform duration-300 group-hover:scale-105"
            style={{
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textFillColor: 'transparent',
            }}>
            Ajustes
          </span>
          <span className="block h-1 w-1/2 mx-auto mt-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-green-300 opacity-80 animate-underline-move group-hover:scale-x-110 transition-transform duration-300"></span>
          <style jsx>{`
            .animate-gradient-move {
              animation: gradient-move 3.5s ease-in-out infinite alternate;
            }
            @keyframes gradient-move {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
            .animate-underline-move {
              animation: underline-move 2.2s cubic-bezier(0.4,0,0.2,1) infinite alternate;
            }
            @keyframes underline-move {
              0% { transform: scaleX(0.85); opacity: 0.7; }
              60% { transform: scaleX(1.1); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0.85; }
            }
          `}</style>
        </h1>
        {/* Controles de accesibilidad y avatar */}
        <div className="flex items-center justify-end min-w-[60px] gap-5 md:gap-7">
          {/* Botón modo oscuro */}
          <Tooltip text={lang === 'es' ? 'Cambiar modo oscuro' : 'Toggle dark mode'}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-4 rounded-2xl text-3xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${darkMode ? "bg-slate-800 text-yellow-400 hover:bg-slate-700 hover:text-yellow-300 hover:shadow-yellow-400/30" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-600 hover:shadow-blue-400/30"}`}
              tabIndex={0}
              aria-label={lang === 'es' ? 'Cambiar modo oscuro' : 'Toggle dark mode'}
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
          </Tooltip>
          {/* Botón tamaño de fuente */}
          <Tooltip text={lang === 'es' ? 'Aumentar tamaño de fuente' : 'Increase font size'}>
            <button
              onClick={() => setFontSize(fontSize === 'md' ? 'xl' : 'md')}
              className={`p-4 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 hover:-translate-y-1 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${darkMode ? "bg-slate-800 text-blue-200 hover:bg-slate-700 hover:text-blue-100" : "bg-gray-100 text-blue-700 hover:bg-gray-200 hover:text-blue-900"}`}
              tabIndex={0}
              aria-label={lang === 'es' ? 'Aumentar tamaño de fuente' : 'Increase font size'}
            >
              {fontSize === 'md' ? 'A+' : 'A'}
            </button>
          </Tooltip>
          {/* Selector de idioma */}
          <Tooltip text={lang === 'es' ? 'Seleccionar idioma' : 'Select language'}>
            <select
              value={lang}
              onChange={e => setLang(e.target.value)}
              className={`rounded-lg px-3 py-2 font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-400/40 transition ${darkMode ? 'bg-slate-800 text-blue-100 border-slate-700' : 'bg-white text-blue-900 border-blue-200'}`}
              tabIndex={0}
              aria-label={lang === 'es' ? 'Seleccionar idioma' : 'Select language'}
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </Tooltip>
          <Image src={user.avatar} alt="Avatar" width={64} height={64} className="rounded-full border-4 border-blue-400 shadow-xl object-cover" />
        </div>
      </div>

      {/* Botón volver al inicio alineado a la izquierda, debajo del logo */}
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
      {/* Layout institucional premium, sin datos de perfil */}
      <main className="max-w-3xl mx-auto mt-12 flex flex-col gap-10">
        {/* Botón de regreso eliminado para evitar duplicidad */}
        {/* Seguridad */}
        <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-400' : 'bg-white/95 border-blue-700'}`}>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl text-blue-700 dark:text-blue-300">🔒</span>
        <h2 className="text-2xl font-extrabold text-blue-800 dark:text-gray-100 tracking-tight">Seguridad</h2>
          </div>
          <form className="flex flex-col gap-2" onSubmit={handlePasswordChange}>
            <label className="font-semibold">Nueva contraseña</label>
            <input
              type="password"
              className={`px-3 py-2 rounded-lg border border-blue-200 ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-blue-900'}`}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
            />
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mínimo 8 caracteres, usa letras y números.</div>
            <button
              className="mt-2 px-4 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-800 transition disabled:opacity-60"
              type="submit"
              disabled={loading || password.length < 8}
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
            {msg && (
              <div className={`mt-2 text-sm font-semibold ${msgType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>
            )}
          </form>
          <div className={`mt-3 text-xs p-2 rounded ${darkMode ? 'text-blue-200 bg-gray-800/70' : 'text-blue-700 bg-blue-50'}`}> 
            Para mayor seguridad, activa el segundo factor de autenticación desde la Unidad de Transparencia institucional.
          </div>
        </section>

        {/* Preferencias */}
        <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-300' : 'bg-white/95 border-blue-500'}`}>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl text-blue-500 dark:text-blue-200">⚙️</span>
            <h2 className="text-2xl font-extrabold text-blue-700 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Preferencias' : 'Preferences'}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{lang === 'es' ? 'Idioma:' : 'Language:'}</span>
              <span className={`px-3 py-1 rounded font-semibold ${darkMode ? 'bg-gray-800 text-blue-200' : 'bg-blue-100 text-blue-900'}`}>{lang === 'es' ? 'Español' : 'English'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{lang === 'es' ? 'Accesibilidad:' : 'Accessibility:'}</span>
              <span className={`px-3 py-1 rounded font-semibold ${darkMode ? 'bg-gray-800 text-blue-200' : 'bg-blue-100 text-blue-900'}`}>AA+</span>
            </div>
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'es' ? 'Opciones de idioma y accesibilidad próximamente.' : 'Language and accessibility options coming soon.'}</div>
        </section>

        {/* Auditoría */}
        <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-200' : 'bg-white/95 border-blue-300'}`}>
          <div className="flex items-center gap-4 mb-2">
            <span className="text-3xl text-blue-400 dark:text-blue-100">🕑</span>
        <h2 className="text-2xl font-extrabold text-blue-600 dark:text-gray-100 tracking-tight">Auditoría</h2>
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Historial de sesiones y dispositivos recientes:</div>
          <ul className={`mt-2 text-xs list-disc list-inside space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}> 
            {sessions.length === 0 ? (
              <li className="italic text-gray-400">{lang === 'es' ? 'Sin sesiones recientes.' : 'No recent sessions.'}</li>
            ) : (
              sessions.map(session => (
                <li key={session.id} className="flex items-center gap-2 group transition-all duration-200">
                  <span>{session.text}</span>
                  <Tooltip text={lang === 'es' ? 'Eliminar sesión' : 'Delete session'}>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className={`ml-2 px-2 py-0.5 rounded text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${darkMode ? 'bg-gray-800 text-red-300 hover:bg-red-900 hover:text-white' : 'bg-gray-100 text-red-600 hover:bg-red-200 hover:text-red-900'}`}
                      aria-label={lang === 'es' ? 'Eliminar sesión' : 'Delete session'}
                      tabIndex={0}
                    >
                      {lang === 'es' ? 'Borrar' : 'Delete'}
                    </button>
                  </Tooltip>
                </li>
              ))
            )}
          </ul>
          <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solo se muestran los últimos accesos. Para más información, contacta a la Unidad de Transparencia.</div>
        </section>

        {/* Aviso legal y privacidad */}
        <section className={`p-7 rounded-2xl shadow border-2 text-center border-blue-300 ${darkMode ? 'bg-gray-900/90 text-blue-100 border-blue-900/60' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-900'}`}>
          <b className="block mb-2 text-blue-700 dark:text-blue-200 text-lg">Aviso de Confidencialidad y Protección de Datos</b>
          <p className="text-sm leading-relaxed font-medium">
            Esta sección cumple con la <b>Ley Estatal de Archivos de Baja California Sur (LEA-BCS)</b>.<br />
            Tus datos personales y configuraciones están protegidos y solo serán usados conforme a la legislación aplicable.<br />
            Toda modificación queda registrada para fines de auditoría y transparencia.<br />
            Derechos ARCO: Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, contacta a la Unidad de Transparencia institucional.
          </p>
        </section>

        {/* Botón de regreso eliminado de la parte inferior para evitar duplicidad */}
      </main>
    </div>
  );
}
