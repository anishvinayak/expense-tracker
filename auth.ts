
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    // Google OAuth login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Email and password login
    CredentialsProvider({
      id: "credentials",
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.password) {
          return null;
        }

        const validPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),

    // Guest demo login
  
CredentialsProvider({
  id: "guest",
  name: "Guest Demo",
  credentials: {},

  async authorize() {
    console.log("[Guest] authorize() called");

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: "demo@flowledger.app",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      console.log(
        "[Guest] Database result:",
        user ? "USER FOUND" : "USER NOT FOUND"
      );

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name ?? "Demo User",
        email: user.email,
      };
    } catch (error) {
      console.error("[Guest] Database error:", error);
      throw error;
    }
  },
}),
  ],

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    async signIn({ user, account }) {
      // For Google sign-in, ensure a usable email is provided.
      if (account?.provider === "google" && !user.email) {
        return false;
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as typeof session.user & { id: string }).id =
          token.id as string;
      }

      return session;
    },
  },
};