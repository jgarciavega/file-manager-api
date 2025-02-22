import "dotenv/config"; // 🔹 Cargar variables de entorno antes de NextAuth

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // 🔹 Para ver más información en la consola
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔵 NextAuth recibió credenciales:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Faltan credenciales");
          throw new Error("Faltan credenciales");
        }

        const user = { id: 1, name: "Test User", email: "jorge@File.com" };

        if (
          credentials.email === "jorge@File.com" &&
          credentials.password === "123456"
        ) {
          console.log("🟢 Usuario autenticado correctamente:", user);
          return user;
        }

        console.log("❌ Error: Credenciales inválidas");
        throw new Error("Credenciales inválidas");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

// 🔹 Exportar API según el tipo de router de Next.js

// 🔹 Si usas App Router (Next.js 15):
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);





