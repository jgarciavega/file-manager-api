import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
providers: [
    CredentialsProvider({
    name: "Credentials",
    credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
        try {
        console.log("🔍 Verificando credenciales:", credentials);

          // Lista de usuarios válidos
        const usuariosRegistrados = {
            "jorge.garcia@apibcs.com.mx": {
            password: "123456",
            name: "Jorge",
            role: "admin",
            },
            "jrubio@apibcs.com.mx": {
            password: "123456",
            name: "Julio",
            role: "revisor",
            },
            "annel@apibcs.com.mx": {
            password: "123456",
            name: "Annel",
            role: "capturista",
            },
            "jose.monteverde@apibcs.com.mx": {
            password: "123456",
            name: "José",
            role: "capturista",
            },
            "blanca@apibcs.com.mx": {
            password: "123456",
            name: "Blanca",
            role: "revisor",
            },
            "hdelreal@apibcs.com.mx": {
            password: "123456",
            name: "Lupita",
            role: "revisor",
            },
        };

        const user = usuariosRegistrados[credentials.email];

        if (user && user.password === credentials.password) {
            return {
            id: credentials.email,
            email: credentials.email,
            name: user.name,
            role: user.role,
            };
        }

        console.log("❌ Credenciales inválidas");
        return null;
        } catch (error) {
        console.error("🚨 Error en autorización:", error);
        return null;
        }
    },
    }),
],
secret: process.env.NEXTAUTH_SECRET,
pages: {
    signIn: "/",
    error: "/",
},
callbacks: {
    async jwt({ token, user }) {
    if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
    }
    return token;
    },
    async session({ session, token }) {
    if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
    }
    return session;
    },
},
session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
},
debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
