import "dotenv/config"; // Cargar variables de entorno correctamente

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Permite ejecutar Next.js como una app independiente
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

export default nextConfig;
