// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
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

          // FALLBACK TEMPORAL: usuarios hardcodeados con contraseñas hasheadas
          // REMOVER CUANDO LA BASE DE DATOS ESTÉ CONFIGURADA
          const tempUsers = {
            // Usuario de prueba con credenciales simples
            "admin@test.com": {
              id: 4,
              password:
                "$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
              fullName: "Admin Test",
              role: "admin",
            },
            "jorge.garcia@apibcs.com.mx": {
              id: 1,
              password:
                "$2b$12$slWTCfAcbe4rUqoKSLsXlu0JeldpG.Zgd8.rqlFBO9IJkaqkJZoyW", // AdminSecure2024!
              fullName: "Jorge García Vega",
              role: "admin",
            },
            "jrubio@apibcs.com.mx": {
              id: 3,
              password:
                "$2b$12$0ifKBkBxeEzZh8LLAcp9Wecbk9DgnEkpb4gIzZTk.70sZ7CPi/1TW", // Revisor2024$Secure
              fullName: "Julio Rubio",
              role: "revisor",
            },
            "annel@apibcs.com.mx": {
              id: 2,
              password:
                "$2b$12$z6KaVhKpDfcm.33JdR6TJOBxHeEwrhFJ8iQ4hIAVu.7gPHm5WRmZe", // Captura2024#Safe
              fullName: "Annel Torres",
              role: "capturista",
            },
            "blanca@apibcs.com.mx": {
              id: 5,
              password:
                "$2b$12$R1GW5gv0ef2joe2aYFSF2efaIcQX49Ox6q483I63TTfj4eZIQgK3C", // Captura2024#Documents
              fullName: "Blanca Ramírez",
              role: "capturista",
            },
            "jose.monteverde@apibcs.com.mx": {
              id: 6,
              password:
                "$2b$12$5MWLg6VzXqyIoaoBEGQjq.ITChdO1Ut/vdChIBrIEv0cWzr46fz4O", // Captura2024#Files
              fullName: "José Monteverde",
              role: "capturista",
            },
            "hdelreal@apibcs.com.mx": {
              id: 7,
              password:
                "$2b$12$jzu/bLZ98w/3rzk8M2C41.br6rqokkGDj5IJSU941xtOsH3u7j.eO", // Captura2024#Data
              fullName: "Lupita Del Real",
              role: "capturista",
            },
          };

          // Verificar si el usuario existe en el fallback temporal
          const tempUser = tempUsers[credentials.email];
          if (tempUser) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              tempUser.password
            );
            if (isPasswordValid) {
              console.log("✅ Login exitoso (TEMPORAL):", credentials.email);
              return {
                id: tempUser.id,
                email: credentials.email,
                name: tempUser.fullName,
                role: tempUser.role,
              };
            }
          }

          try {
            // Intentar conexión con base de datos
            const user = await prisma.usuarios.findFirst({
              where: {
                email: credentials.email,
                activo: true,
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

            console.log("✅ Login exitoso (BD):", credentials.email);

            return {
              id: user.id,
              email: user.email,
              name: `${user.nombre} ${user.apellidos || ""}`.trim(),
              role: userRole,
            };
          } catch (dbError) {
            console.log(
              "⚠️ BD no disponible, usando fallback temporal para:",
              credentials.email
            );
            // Si hay error de BD pero encontramos usuario temporal, ya se manejó arriba
            return null;
          }
        } catch (error) {
          console.error("❌ Error en autorización:", error);
          return null;
        } finally {
          // Solo desconectar si prisma está disponible
          try {
            await prisma.$disconnect();
          } catch (e) {
            // Ignorar errores de desconexión si la BD no está disponible
          }
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
};

export default NextAuth(authOptions);
