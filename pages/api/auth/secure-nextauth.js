// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("❌ Credenciales incompletas");
            return null;
          }

          // Buscar usuario en la base de datos
          const user = await prisma.usuarios.findFirst({
            where: {
              email: credentials.email,
              activo: true, // Solo usuarios activos
            },
            include: {
              usuarios_has_roles: {
                include: { roles: true },
              },
            },
          });

          if (!user) {
            console.log("❌ Usuario no encontrado:", credentials.email);
            return null;
          }

          // Verificar contraseña
          if (!user.password) {
            console.log("❌ Usuario sin contraseña configurada");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordValid) {
            console.log("❌ Contraseña incorrecta para:", credentials.email);
            return null;
          }

          // Obtener rol del usuario
          const userRole =
            user.usuarios_has_roles[0]?.roles?.tipo || "capturista";

          console.log("✅ Login exitoso para:", credentials.email);

          return {
            id: user.id,
            email: user.email,
            name: `${user.nombre} ${user.apellidos || ""}`.trim(),
            role: userRole,
          };
        } catch (error) {
          console.error("❌ Error en autorización:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 horas
    updateAge: 2 * 60 * 60, // Actualizar cada 2 horas
  },

  jwt: {
    maxAge: 8 * 60 * 60, // 8 horas
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.iat = Math.floor(Date.now() / 1000); // Tiempo de emisión
      }

      // Verificar si el token ha expirado
      const now = Math.floor(Date.now() / 1000);
      if (token.iat && now - token.iat > 8 * 60 * 60) {
        console.log("⚠️ Token expirado para:", token.email);
        return null;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`🔐 Usuario logueado: ${user.email} - Rol: ${user.role}`);
    },
    async signOut({ session, token }) {
      console.log(`🚪 Usuario deslogueado: ${token?.email || "Desconocido"}`);
    },
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
