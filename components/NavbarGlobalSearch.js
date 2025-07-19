
"use client";
import { useRef, useState } from "react";
import { useGlobalSearch } from "../app/context/GlobalSearchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faMicrophone, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function NavbarGlobalSearch() {
  const { globalSearch, setGlobalSearch } = useGlobalSearch();
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);

  // Inicializa reconocimiento de voz solo en navegador
  const getRecognition = () => {
    if (typeof window === "undefined") return null;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-MX";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      recognitionRef.current.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        // Elimina punto final automático si existe
        transcript = transcript.replace(/[.。]$/, "");
        setGlobalSearch(transcript);
        setIsListening(false);
        inputRef.current?.focus();
      };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
    return recognitionRef.current;
  };

  const handleVoice = () => {
    const recognition = getRecognition();
    if (!recognition) {
      setVoiceError("Tu navegador no soporta búsqueda por voz");
      setTimeout(() => setVoiceError(""), 3000);
      return;
    }
    setGlobalSearch("");
    setIsListening(true);
    recognition.start();
  };

  return (
    <div
      className="relative flex items-center w-full max-w-md mx-auto group"
      tabIndex={-1}
    >
      <FontAwesomeIcon
        icon={faSearch}
        className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none transition-colors duration-200 group-focus-within:text-blue-500 group-hover:text-blue-500"
      />
      <input
        ref={inputRef}
        type="text"
        className="w-full pl-10 pr-12 py-2 rounded-full border-2 border-blue-500 dark:border-blue-400 bg-white/95 dark:bg-gray-900/95 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-300 text-base text-blue-900 dark:text-blue-100 hover:border-blue-700 dark:hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/40"
        placeholder="Buscar en toda la plataforma..."
        aria-label="Buscar en toda la plataforma"
        value={globalSearch}
        onChange={e => setGlobalSearch(e.target.value)}
        autoComplete="off"
      />
      {globalSearch && (
        <button
          type="button"
          className="absolute right-10 text-gray-400 hover:text-red-500 dark:hover:text-red-400 focus:outline-none transition-colors duration-200"
          aria-label="Limpiar búsqueda"
          onClick={() => setGlobalSearch("")}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      <button
        type="button"
        className={`absolute right-3 flex items-center justify-center w-9 h-9 rounded-full border-2 border-blue-500 dark:border-blue-400 transition-colors duration-200 focus:outline-none shadow-md
        ${isListening ? "bg-blue-600 dark:bg-blue-400 text-white dark:text-blue-900 animate-pulse scale-110" : "bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-blue-100"}`}
        aria-label={isListening ? "Escuchando..." : "Buscar por voz"}
        onClick={handleVoice}
        tabIndex={0}
      >
        <FontAwesomeIcon icon={faMicrophone} size="lg" />
      </button>
      {voiceError && (
        <span className="absolute -bottom-8 left-0 w-full text-center text-xs text-red-600 bg-white dark:bg-gray-900 border border-red-300 dark:border-red-700 rounded-md py-1 shadow-lg z-10 animate-fade-in">
          {voiceError}
        </span>
      )}
    </div>
  );
}
