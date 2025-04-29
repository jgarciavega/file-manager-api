import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = {
          "jorge.garcia@apibcs.com.mx": { password: "123456", name: "Jorge", role: "admin" },
          "jrubio@apibcs.com.mx": { password: "123456", name: "Julio", role: "revisor" },
          "annel@apibcs.com.mx": { password: "123456", name: "Annel", role: "capturista" },
        };

        const user = users[credentials.email];

        if (user && user.password === credentials.password) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: user.name,
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
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
