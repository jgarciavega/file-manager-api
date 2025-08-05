"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import DashboardHeader from "../components/DashboardHeader";
import BackToHomeButton from "../../../components/BackToHomeButton";
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

export default function AjustesPage() {
  // Estado para modo oscuro (ejemplo, puedes conectar con global)
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState("es");
  const [fontSize, setFontSize] = useState("md");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");
  const [sessions, setSessions] = useState([
    { id: 1, text: "Sesión iniciada el 13/07/2025 09:12 desde Windows 10 (Chrome)" },
    { id: 2, text: "Sesión cerrada el 12/07/2025 18:44 desde Windows 10 (Chrome)" },
    { id: 3, text: "Sesión iniciada el 12/07/2025 08:01 desde Android (App móvil)" },
  ]);
  // Consentimiento de privacidad
  const [consent, setConsent] = useState(false);
  // Simulación de datos personales
  const personalData = {
    nombre: "Jorge Vega",
    correo: "jorge@ejemplo.com",
    rol: "Usuario",
    fechaRegistro: "2024-01-15",
  };
  // Historial de cambios de configuración (simulado)
  const [configHistory] = useState([
    { id: 1, text: "Cambio de contraseña el 13/07/2025 09:15" },
    { id: 2, text: "Cambio de idioma a Español el 12/07/2025 10:22" },
    { id: 3, text: "Aceptó aviso de privacidad el 12/07/2025 08:00" },
  ]);
  // Descargar datos personales
  function handleDownloadData() {
    const data = JSON.stringify(personalData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mis_datos_personales.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  // Solicitud de rectificación/cancelación (simulada)
  const [requestMsg, setRequestMsg] = useState("");
  function handleARCORequest(e) {
    e.preventDefault();
    setRequestMsg("Tu solicitud ha sido enviada. Pronto recibirás respuesta de la Unidad de Transparencia.");
  }
  function handlePasswordChange(e) {
    e.preventDefault();
    setMsg("");
    if (password.length < 8) {
      setMsgType("error");
      setMsg("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMsgType("success");
      setMsg("Contraseña actualizada correctamente.");
      setPassword("");
    }, 1200);
  }
  function handleDeleteSession(id) {
    setSessions(sessions => sessions.filter(s => s.id !== id));
  }
  // Layout rediseñado
  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900"} ${fontSize === 'xl' ? 'text-lg md:text-xl' : 'text-base md:text-lg'}`}> 
      {/* Header premium institucional reutilizable */}
      <DashboardHeader title={lang === 'es' ? 'Ajustes' : 'Settings'} darkMode={darkMode} onToggleDarkMode={() => setDarkMode(v => !v)} />
      {/* Botón volver reutilizable */}
      <div className="w-full flex mt-4">
        <div className="flex items-start">
          <BackToHomeButton darkMode={darkMode} />
        </div>
      </div>
      {/* Grid de paneles de ajustes */}
      <main className="w-full max-w-7xl mx-auto mt-10 px-2 md:px-8 flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel Consentimiento de privacidad */}
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-500' : 'bg-white/95 border-blue-500'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-600 dark:text-blue-200">📄</span>
              <h2 className="text-2xl font-extrabold text-blue-700 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Consentimiento de Privacidad' : 'Privacy Consent'}</h2>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="accent-blue-600 w-5 h-5"
              />
              <span className="text-sm font-medium">
                {lang === 'es'
                  ? 'He leído y acepto el aviso de privacidad y el tratamiento de mis datos personales conforme a la LEA-BCS.'
                  : 'I have read and accept the privacy notice and the processing of my personal data according to LEA-BCS.'}
              </span>
            </label>
            {!consent && (
              <div className="text-xs text-red-600 font-semibold mt-1">{lang === 'es' ? 'Debes aceptar el aviso de privacidad para usar todas las funciones.' : 'You must accept the privacy notice to use all features.'}</div>
            )}
          </section>
          {/* Panel Seguridad */}
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-400' : 'bg-white/95 border-blue-700'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-700 dark:text-blue-300">🔒</span>
              <h2 className="text-2xl font-extrabold text-blue-800 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Seguridad' : 'Security'}</h2>
            </div>
            <form className="flex flex-col gap-2" onSubmit={handlePasswordChange}>
              <label className="font-semibold">{lang === 'es' ? 'Nueva contraseña' : 'New password'}</label>
              <input
                type="password"
                className={`px-3 py-2 rounded-lg border border-blue-200 ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-blue-900'}`}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={8}
                autoComplete="new-password"
              />
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'es' ? 'Mínimo 8 caracteres, usa letras y números.' : 'At least 8 characters, use letters and numbers.'}</div>
              <button
                className="mt-2 px-4 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-800 transition disabled:opacity-60"
                type="submit"
                disabled={loading || password.length < 8}
              >
                {loading ? (lang === 'es' ? "Actualizando..." : "Updating...") : (lang === 'es' ? "Actualizar contraseña" : "Update password")}
              </button>
              {msg && (
                <div className={`mt-2 text-sm font-semibold ${msgType === 'success' ? 'text-green-600' : 'text-red-600'}`}>{msg}</div>
              )}
            </form>
            <div className={`mt-3 text-xs p-2 rounded ${darkMode ? 'text-blue-200 bg-gray-800/70' : 'text-blue-700 bg-blue-50'}`}> 
              {lang === 'es'
                ? 'Para mayor seguridad, activa el segundo factor de autenticación desde la Unidad de Transparencia institucional.'
                : 'For greater security, enable two-factor authentication from the Transparency Unit.'}
            </div>
          </section>
          {/* Panel Datos personales y ARCO */}
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-600' : 'bg-white/95 border-blue-600'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-800 dark:text-blue-200">🗂️</span>
              <h2 className="text-2xl font-extrabold text-blue-800 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Mis Datos Personales' : 'My Personal Data'}</h2>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div><b>{lang === 'es' ? 'Nombre:' : 'Name:'}</b> {personalData.nombre}</div>
              <div><b>{lang === 'es' ? 'Correo:' : 'Email:'}</b> {personalData.correo}</div>
              <div><b>{lang === 'es' ? 'Rol:' : 'Role:'}</b> {personalData.rol}</div>
              <div><b>{lang === 'es' ? 'Fecha de registro:' : 'Registration date:'}</b> {personalData.fechaRegistro}</div>
            </div>
            <button
              onClick={handleDownloadData}
              className="mt-2 px-4 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-800 transition w-fit"
            >
              {lang === 'es' ? 'Descargar mis datos' : 'Download my data'}
            </button>
            <form className="flex flex-col gap-2 mt-4" onSubmit={handleARCORequest}>
              <label className="font-semibold">{lang === 'es' ? 'Solicitar rectificación/cancelación de datos' : 'Request data rectification/cancellation'}</label>
              <textarea
                required
                minLength={10}
                className={`px-3 py-2 rounded-lg border border-blue-200 ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-blue-900'}`}
                placeholder={lang === 'es' ? 'Describe tu solicitud...' : 'Describe your request...'}
                rows={3}
              />
              <button
                type="submit"
                className="mt-1 px-4 py-2 rounded bg-blue-700 text-white font-bold hover:bg-blue-800 transition w-fit"
              >
                {lang === 'es' ? 'Enviar solicitud ARCO' : 'Send ARCO request'}
              </button>
              {requestMsg && <div className="text-green-600 text-xs font-semibold mt-1">{requestMsg}</div>}
            </form>
          </section>
          {/* Panel Preferencias */}
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-300' : 'bg-white/95 border-blue-500'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-500 dark:text-blue-200">⚙️</span>
              <h2 className="text-2xl font-extrabold text-blue-700 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Preferencias' : 'Preferences'}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold">{lang === 'es' ? 'Idioma:' : 'Language:'}</span>
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
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{lang === 'es' ? 'Tamaño de fuente:' : 'Font size:'}</span>
                <button
                  onClick={() => setFontSize(fontSize === 'md' ? 'xl' : 'md')}
                  className={`px-4 py-2 rounded-lg font-bold border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${darkMode ? 'bg-slate-800 text-blue-200 border-slate-700' : 'bg-white text-blue-900 border-blue-200'}`}
                  tabIndex={0}
                  aria-label={lang === 'es' ? 'Aumentar tamaño de fuente' : 'Increase font size'}
                >
                  {fontSize === 'md' ? 'A+' : 'A'}
                </button>
              </div>
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'es' ? 'Opciones de idioma y accesibilidad próximamente.' : 'Language and accessibility options coming soon.'}</div>
          </section>
          {/* Panel Historial de cambios de configuración */}
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-800' : 'bg-white/95 border-blue-800'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-900 dark:text-blue-200">📑</span>
              <h2 className="text-2xl font-extrabold text-blue-900 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Historial de Cambios' : 'Change History'}</h2>
            </div>
            <ul className={`mt-2 text-xs list-disc list-inside space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}> 
              {configHistory.length === 0 ? (
                <li className="italic text-gray-400">{lang === 'es' ? 'Sin cambios registrados.' : 'No changes recorded.'}</li>
              ) : (
                configHistory.map(item => (
                  <li key={item.id}>{item.text}</li>
                ))
              )}
            </ul>
          </section>
          <section className={`p-8 rounded-2xl shadow-xl flex flex-col gap-4 border-l-8 ${darkMode ? 'bg-gray-900/90 border-blue-200' : 'bg-white/95 border-blue-300'}`}>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-3xl text-blue-400 dark:text-blue-100">🕑</span>
              <h2 className="text-2xl font-extrabold text-blue-600 dark:text-gray-100 tracking-tight">{lang === 'es' ? 'Auditoría' : 'Audit'}</h2>
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{lang === 'es' ? 'Historial de sesiones y dispositivos recientes:' : 'Recent sessions and devices:'}</div>
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
            <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lang === 'es' ? 'Solo se muestran los últimos accesos. Para más información, contacta a la Unidad de Transparencia.' : 'Only the latest accesses are shown. For more information, contact the Transparency Unit.'}</div>
          </section>
          {/* Panel Aviso legal y privacidad */}
          <section className={`p-7 rounded-2xl shadow border-2 text-center border-blue-300 ${darkMode ? 'bg-gray-900/90 text-blue-100 border-blue-900/60' : 'bg-gradient-to-br from-blue-100 via-blue-50 to-white text-blue-900'}`}>
            <b className="block mb-2 text-blue-700 dark:text-blue-200 text-lg">{lang === 'es' ? 'Aviso de Confidencialidad y Protección de Datos' : 'Confidentiality and Data Protection Notice'}</b>
            <p className="text-sm leading-relaxed font-medium">
              {lang === 'es'
                ? (<>
                  Esta sección cumple con la <b>Ley Estatal de Archivos de Baja California Sur (LEA-BCS)</b>.<br />
                  Tus datos personales y configuraciones están protegidos y solo serán usados conforme a la legislación aplicable.<br />
                  Toda modificación queda registrada para fines de auditoría y transparencia.<br />
                  Derechos ARCO: Para ejercer tus derechos de acceso, rectificación, cancelación u oposición, contacta a la Unidad de Transparencia institucional.
                </>)
                : (<>
                  This section complies with the <b>State Archives Law of Baja California Sur (LEA-BCS)</b>.<br />
                  Your personal data and settings are protected and will only be used in accordance with applicable law.<br />
                  All changes are recorded for audit and transparency purposes.<br />
                  ARCO Rights: To exercise your rights of access, rectification, cancellation or opposition, contact the institutional Transparency Unit.
                </>)}
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
