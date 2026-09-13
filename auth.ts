import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Links NextAuth to your Prisma database to save Google users automatically
  adapter: PrismaAdapter(prisma),

  // Enables JWT session tokens instead of database-stored session tokens
  session: {
    strategy: "jwt",
  },

  providers: [
    // Google OAuth Authentication
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials Authentication (Demo/Guest Account)
    CredentialsProvider({
      id: "credentials",
      name: "Guest",
      credentials: {},
      async authorize() {
        const user = await prisma.user.findUnique({
          where: {
            email: "demo@flowledger.app",
          },
        });

        if (!user) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  // Overrides standard NextAuth pages to use your custom login view
  pages: {
    signIn: "/login",
    error: "/login", // Redirects back to login on failure instead of standard error page
  },

  callbacks: {
    // Passes user information into the encrypted JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    // Extracts information from the JWT token and exposes it to the frontend session
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },

  // Forces NextAuth to print the exact failure reason in your backend terminal
  logger: {
    error(code, metadata) {
      console.error("❌ NEXTAUTH_ERROR_CODE:", code, "DETAILS:", metadata);
    },
    warn(code) {
      console.warn("⚠️ NEXTAUTH_WARNING_CODE:", code);
    },
  },

  // Standard token signing key for NextAuth v4
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
};
