import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

console.log("🟢 NextAuth cargándose...");

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔍 Credenciales recibidas:", credentials);
        if (credentials.email === "jorge@File.com" && credentials.password === "123456") {
          console.log("✅ Usuario autenticado");
          return { id: 1, name: "Test User", email: "jorge@File.com" };
        }
        console.log("❌ Error: Credenciales inválidas");
        throw new Error("Credenciales inválidas");
      },
    }),
  ],
};

console.log("🟢 NextAuth configurado correctamente");

export default NextAuth(authOptions);
