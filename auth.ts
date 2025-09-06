// auth.ts
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
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Find the user in the database
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        // If user exists and has a password, check it
        if (user && user.hashedPassword) {
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (passwordsMatch) {
            // Return user without the hashed password
            const { hashedPassword, ...userWithoutPassword } = user;
            return userWithoutPassword;
          }
        }

        // Return null if authentication fails
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});