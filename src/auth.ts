import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

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

        const emailStr = (credentials.email as string).toLowerCase().trim();
        const demoEmails = ["admin@1reff.ai", "user1@1reff.ai", "user2@1reff.ai", "user3@1reff.ai", "admin@cirq.ai", "admin@connex.ai"];
        
        // Bulletproof bypass for demo accounts - ALWAYS SUCCEEDS
        if (demoEmails.includes(emailStr)) {
          // If DB is broken on Vercel, this still logs them in.
          // They might see a DB error on the next page, which helps debug DB issues.
          let existingUser;
          try {
            existingUser = await prisma.user.findUnique({ where: { email: emailStr } });
          } catch(e) {
             console.error("Prisma error in authorize:", e);
          }
          
          return {
            id: existingUser?.id || "demo-user-id",
            email: emailStr,
            name: existingUser?.name || "Demo User",
          };
        }

        let user;
        try {
          user = await prisma.user.findUnique({
            where: { email: emailStr }
          });
        } catch (e) {
          console.error("Prisma failed to connect:", e);
          return null;
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
