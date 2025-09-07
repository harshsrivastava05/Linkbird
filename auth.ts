import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/db";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { users } from "./lib/db/schema";
import { eq } from "drizzle-orm";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Credentials authorize called:", { email: credentials?.email });
        
        if (!credentials?.email || !credentials.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        try {
          // Find the user in the database
          const user = await db.query.users.findFirst({
            where: eq(users.email, credentials.email as string),
          });

          console.log("👤 User found:", user ? "Yes" : "No");

          // If user exists and has a password, check it
          if (user && user.hashedPassword) {
            const passwordsMatch = await bcrypt.compare(
              credentials.password as string,
              user.hashedPassword
            );

            console.log("🔑 Password match:", passwordsMatch);

            if (passwordsMatch) {
              // Return user without the hashed password
              const { hashedPassword, ...userWithoutPassword } = user;
              console.log("✅ User authenticated:", userWithoutPassword.id);
              return userWithoutPassword;
            }
          }

          console.log("❌ Authentication failed");
          return null;
        } catch (error) {
          console.error("💥 Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("🎫 JWT Callback:", { 
        hasUser: !!user, 
        tokenId: token.id, 
        userId: user?.id 
      });
      
      // Persist the user ID in the token
      if (user) {
        token.id = user.id;
        console.log("✅ Added user ID to token:", user.id);
      }
      return token;
    },
    async session({ session, token }) {
      console.log("🔗 Session Callback:", { 
        tokenId: token.id, 
        sessionUserId: session.user?.id 
      });
      
      // Send properties to the client
      if (token.id && session.user) {
        session.user.id = token.id as string;
        console.log("✅ Added user ID to session:", token.id);
      }
      return session;
    },
    async authorized({ request, auth }) {
      console.log("🛡️ Authorized callback:", { 
        path: request.nextUrl.pathname,
        hasAuth: !!auth 
      });
      return true; // Let middleware handle authorization
    }
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log("📝 Sign in event:", { userId: user.id, provider: account?.provider });
    },
    async session({ session, token }) {
      console.log("📊 Session event:", { userId: session.user?.id });
    }
  },
  debug: process.env.NODE_ENV === 'development',
});