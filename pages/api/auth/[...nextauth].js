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
             // ...existing code...
        const users = {
          "jorge.garcia@apibcs.com.mx": { id: 1, password: "123456", fullName: "Jorge García Vega", role: "admin" },
          "jrubio@apibcs.com.mx": { id: 3, password: "123456", fullName: "Julio Rubio", role: "revisor" },
          "annel@apibcs.com.mx": { id: 2, password: "123456", fullName: "Annel Torres", role: "capturista" },
          "blanca@apibcs.com.mx": { id: 18, password: "123456", fullName: "Blanca Ramírez", role: "capturista" },
          "jose.monteverde@apibcs.com.mx": { id: 19, password: "123456", fullName: "José Monteverde", role: "capturista" },
          "hdelreal@apibcs.com.mx": { id: 6, password: "123456", fullName: "Lupita Del Real", role: "capturista" },
        };

        const user = users[credentials.email];
        if (user && user.password === credentials.password) {
          return {
            id: user.id, // <-- Aquí va el id numérico
            email: credentials.email,
            name: user.fullName,
            role: user.role,
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
