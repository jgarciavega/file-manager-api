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
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.id = user.id;
      }
      console.log("🔍 Token JWT:", token);
      return token;
    },
    async session(session, token) {
      session.user.id = token.id;
      console.log("🔍 Sesión:", session);
      return session;
    }
  }
};

console.log("🟢 NextAuth configurado correctamente");

export default NextAuth(authOptions);
