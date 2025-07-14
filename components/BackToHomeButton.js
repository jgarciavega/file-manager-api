import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/**
 * Botón premium reutilizable para regresar a una vista anterior.
 * Props:
 * - href: ruta destino (default: "/home")
 * - label: texto visible (default: "Volver al Inicio")
 * - darkMode: bool, adapta colores
 * - color: tailwind color base (ej: "green", "blue", "slate")
 * - size: "md" | "lg" (tamaño del botón)
 * - icon: icono FontAwesome opcional
 * - className: estilos extra
 */
export default function BackToHomeButton({
  href = "/home",
  label = "Volver al Inicio",
  darkMode = false,
  color = "white",
  size = "md",
  icon = faArrowLeft,
  className = ""
}) {
  // Tamaños
  const sizeStyles = size === "lg"
    ? "px-8 py-3 text-lg gap-3"
    : "px-6 py-2.5 text-base gap-2";
  // Estilo premium botón claro y notorio
  const classes = [
    "relative overflow-hidden inline-flex items-center rounded-full font-bold border transition-all duration-200 ml-0 focus:outline-none focus:ring-2 focus:ring-blue-300/40 cursor-pointer select-none active:scale-95",
    sizeStyles,
    darkMode
      ? "bg-slate-900/90 text-white border-blue-400/50 hover:bg-blue-800/80 hover:text-blue-100 hover:shadow-blue-400/40"
      : "bg-white text-blue-900 border-blue-400/60 hover:bg-gradient-to-r hover:from-blue-400 hover:via-blue-600 hover:to-cyan-400 hover:text-white hover:border-blue-700 hover:shadow-blue-400/60",
    "hover:shadow-2xl shadow-md",
    "backdrop-blur-sm",
    className
  ].join(" ");

  return (
    <Link href={href} legacyBehavior>
      <a className={classes}>
        <span
          className="absolute left-0 top-0 w-full h-full pointer-events-none z-10 animate-shine-btn"
          style={{
            background: darkMode
              ? 'linear-gradient(120deg, rgba(59,130,246,0.13) 0%, rgba(30,58,138,0.18) 60%, rgba(14,165,233,0.10) 100%)'
              : 'linear-gradient(120deg, rgba(30,58,138,0.32) 0%, rgba(59,130,246,0.38) 60%, rgba(255,255,255,0.55) 100%)',
            opacity: darkMode ? 0.55 : 0.98,
            mixBlendMode: darkMode ? 'lighten' : 'color-dodge',
            borderRadius: 'inherit',
            filter: darkMode ? 'blur(2.5px)' : 'blur(3.5px)',
            border: darkMode ? '1.5px solid rgba(59,130,246,0.18)' : '1.5px solid rgba(30,58,138,0.18)',
            transition: 'background 0.3s, opacity 0.3s',
          }}
        />
        <FontAwesomeIcon icon={icon} className={size === "lg" ? "text-2xl" : "text-lg"} />
        {label}
        <style jsx>{`
          .animate-shine-btn {
            position: absolute;
            top: 0; left: -100%; width: 100%; height: 100%;
            animation: shine-btn 2.2s linear infinite;
            border-radius: 9999px;
            transition: opacity 0.2s;
            pointer-events: none;
            z-index: 10;
          }
          a:hover .animate-shine-btn {
            animation-duration: 1.1s;
            opacity: 1 !important;
            filter: brightness(1.35) blur(2px) !important;
          }
          @keyframes shine-btn {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}</style>
      </a>
    </Link>
  );
}
