import { useRef } from 'react';

// Hook de autocorrección automática al terminar palabra (espacio, punto, enter) con whitelist personalizable
export function useAutoCorrect() {
  const timeoutRef = useRef();

  // Obtener whitelist desde localStorage
  function getWhitelist() {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('autocorrectWhitelist') || '[]');
    } catch {
      return [];
    }
  }

  // Agregar palabra a whitelist y guardar en localStorage
  function addToWhitelist(word) {
    if (typeof window === 'undefined') return;
    const wl = getWhitelist();
    if (!wl.includes(word)) {
      wl.push(word);
      localStorage.setItem('autocorrectWhitelist', JSON.stringify(wl));
    }
  }

  // Función para autocorregir usando LanguageTool, ignorando palabras en whitelist
  async function autocorregirTexto(texto) {
    const wl = getWhitelist();
    // No corregir si la última palabra está en whitelist
    const palabras = texto.split(/\s+/);
    const ultima = palabras[palabras.length - 1]?.toLowerCase();
    if (wl.includes(ultima)) return texto;

    console.log('[AutoCorrect] Solicitando corrección para:', texto);
    const res = await fetch('https://api.languagetoolplus.com/v2/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: texto,
        language: 'es',
      })
    });
    const data = await res.json();
    console.log('[AutoCorrect] Respuesta de la API:', data);
    let corregido = texto;
    if (data.matches && data.matches.length > 0) {
      data.matches.sort((a, b) => b.offset - a.offset).forEach(match => {
        if (match.replacements && match.replacements.length > 0) {
          corregido = corregido.slice(0, match.offset) + match.replacements[0].value + corregido.slice(match.offset + match.length);
        }
      });
    }
    console.log('[AutoCorrect] Texto corregido:', corregido);
    return corregido;
  }

  // Handler global para onKeyUp
  function handleKeyUp(e, value, setValue) {
    if ([32, 190, 13].includes(e.keyCode)) {
      if (value.trim().length > 0) {
        // Evitar múltiples llamadas rápidas
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(async () => {
          const corregido = await autocorregirTexto(value);
          if (corregido !== value) {
            setValue(corregido);
          }
        }, 100);
      }
    }
  }

  // Exponer función para agregar palabras
  return Object.assign(handleKeyUp, { addToWhitelist });
}
