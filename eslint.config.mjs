import next from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  next.configs.recommended, // 🔹 Configuración oficial de Next.js
  {
    languageOptions: {
      ecmaVersion: "latest",
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "react/jsx-key": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];
