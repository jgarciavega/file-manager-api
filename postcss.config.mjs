/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}, // Agregado para compatibilidad automática con navegadores
  },
};

export default config;

