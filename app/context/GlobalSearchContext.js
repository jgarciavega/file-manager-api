"use client";
import { createContext, useContext, useState } from "react";


/**
 * Contexto global para la búsqueda en toda la app.
 */
const GlobalSearchContext = createContext();


/**
 * Proveedor del contexto de búsqueda global.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function GlobalSearchProvider({ children }) {
  const [globalSearch, setGlobalSearch] = useState("");
  return (
    <GlobalSearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
      {children}
    </GlobalSearchContext.Provider>
  );
}


/**
 * Hook para acceder al contexto de búsqueda global.
 * Lanza error si se usa fuera del provider.
 */
export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error("useGlobalSearch debe usarse dentro de GlobalSearchProvider");
  return ctx;
}
