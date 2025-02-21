import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

console.log("NEXTAUTH_SECRET en servidor:", process.env.NEXTAUTH_SECRET);

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Muestra más información en la consola
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credenciales recibidas:", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        const user = { id: 1, name: "Test User", email: "jorge@File.com" };

        if (
          credentials.email === "jorge@File.com" &&
          credentials.password === "123456"
        ) {
          console.log("Usuario autenticado correctamente:", user);
          return user;
        }

        console.log("Error: Credenciales inválidas");
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
});
