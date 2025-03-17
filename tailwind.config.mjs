/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightGray: "#f9f9f9", // Gris claro
        hoverGray: "#e2e2e2", // Gris ligeramente más oscuro
        lightBlue: "#f0f8ff", // Azul claro
        hoverBlue: "#dbeaff", // Azul tenue más oscuro
        lightGreen: "#f0fff4", // Verde claro
        hoverGreen: "#d9f7eb", // Verde tenue más oscuro
        lightRed: "#fff5f5", // Rojo claro
        hoverRed: "#fddfdf", // Rojo tenue más oscuro
        lightYellow: "#fffbdd", // Amarillo claro
        hoverYellow: "#fff9c2", // Amarillo tenue más oscuro
        lightPurple: "#f5f0ff", // Morado claro
        hoverPurple: "#eae2ff", // Morado tenue más oscuro
        lightPink: "#fff5f7", // Rosa claro
        hoverPink: "#ffd7e8", // Rosa tenue más oscuro
      },
    },
  },
  corePlugins: {
    highContrastAdjust: false, // ✅ Desactiva la propiedad obsoleta
  },
  plugins: [],
};
