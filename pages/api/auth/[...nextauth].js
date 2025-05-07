// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Definimos fullName para incluir apellidos en el nombre real
        const users = {
          "jorge.garcia@apibcs.com.mx":     { password: "123456", fullName: "Jorge García Vega", role: "admin"        },
          "jrubio@apibcs.com.mx":           { password: "123456", fullName: "Julio Rubio",      role: "revisor"     },
          "annel@apibcs.com.mx":            { password: "123456", fullName: "Annel Torres",      role: "capturista"  },
          "blanca@apibcs.com.mx":           { password: "123456", fullName: "Blanca Ramírez",   role: "capturista"  },
          "jose.monteverde@apibcs.com.mx":  { password: "123456", fullName: "José Monteverde",  role: "capturista"  },
          "hdelreal@apibcs.com.mx":         { password: "123456", fullName: "Lupita Del Real",  role: "capturista"  },
        };

        const user = users[credentials.email];
        if (user && user.password === credentials.password) {
          return {
            id:    credentials.email,
            email: credentials.email,
            name:  user.fullName,   // <-- nombre limpio, sin "Ing."
            role:  user.role,
          };
        }
        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id   = token.id;
      session.user.role = token.role;
      // session.user.name proviene limpio de authorize()
      return session;
    },
  },

  pages: {
    signIn: "/",
    error:  "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
});
