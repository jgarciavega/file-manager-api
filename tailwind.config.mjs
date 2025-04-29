/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",    // primero va app porque Next.js 15 usa App Router
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",     
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightGray: "#f9f9f9",
        hoverGray: "#e2e2e2",
        lightBlue: "#f0f8ff",
        hoverBlue: "#dbeaff",
        lightGreen: "#f0fff4",
        hoverGreen: "#d9f7eb",
        lightRed: "#fff5f5",
        hoverRed: "#fddfdf",
        lightYellow: "#fffbdd",
        hoverYellow: "#fff9c2",
        lightPurple: "#f5f0ff",
        hoverPurple: "#eae2ff",
        lightPink: "#fff5f7",
        hoverPink: "#ffd7e8",
      },
    },
  },
  corePlugins: {
    highContrastAdjust: false,
  },
  plugins: [],
};
