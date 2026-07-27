import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        let user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        // Auto-create demo accounts on-the-fly in serverless environments if they don't exist yet!
        const emailStr = (credentials.email as string).toLowerCase();
        const demoEmails = ["admin@1reff.ai", "user1@1reff.ai", "user2@1reff.ai", "user3@1reff.ai", "admin@cirq.ai", "admin@connex.ai"];
        if (!user && demoEmails.includes(emailStr) && credentials.password === "password123") {
          const hashedPassword = await bcrypt.hash("password123", 10);
          const nameMap: Record<string, string> = {
            "admin@1reff.ai": "Platform Admin",
            "admin@cirq.ai": "Platform Admin",
            "admin@connex.ai": "Platform Admin",
            "user1@1reff.ai": "Alex Rivera",
            "user2@1reff.ai": "Elena Rostova",
            "user3@1reff.ai": "Marcus Vance"
          };
          const roleMap: Record<string, string> = {
            "admin@1reff.ai": "ADMIN",
            "admin@cirq.ai": "ADMIN",
            "admin@connex.ai": "ADMIN"
          };
          user = await prisma.user.create({
            data: {
              email: emailStr,
              name: nameMap[emailStr] || "Demo User",
              password: hashedPassword,
              role: roleMap[emailStr] || "USER",
              title: emailStr.includes("admin") ? "Head of AI Networking" : "Verified Member",
              bio: "Active 1Reff networking account."
            }
          });
        }

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  }
})
