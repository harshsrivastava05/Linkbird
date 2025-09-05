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

        // 1. Find the user in the database
        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        // 2. If user exists, check password
        if (user && user.hashedPassword) {
          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword
          );

          if (passwordsMatch) return user;
        }
        // 3. If user doesn't exist, create a new user
        if (!user) {
          const hashedPassword = await bcrypt.hash(
            credentials.password as string,
            10
          );
          const newUser = await db
            .insert(users)
            .values({
              id: crypto.randomUUID(),
              email: credentials.email as string,
              hashedPassword: hashedPassword,
              name: "New User", 
            })
            .returning();
          return newUser[0];
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
});
