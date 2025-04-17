import { IUser } from "@/models/user";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: Pick<IUser, "id" | "name" | "email" | "avatar" | "type"> & {
      emailVerified?: Date | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: Pick<IUser, "id" | "name" | "email" | "avatar" | "type">;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Guest",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "Enter Guest Name" },
      },
      async authorize(credentials) {
        const randomGuestNumber = Math.floor(Math.random() * 10000);
        const guestId = "Guest-" + randomGuestNumber;
        const guestUser: Pick<
          IUser,
          "id" | "name" | "email" | "avatar" | "type"
        > & {
          createdAt: Date;
          updatedAt: Date;
        } = {
          id: guestId,
          name: ` ${credentials.name || "Guest"}${randomGuestNumber}`,
          email: `${guestId}@guest.com`,
          avatar: "/images/cat-guest.png",
          type: "guest",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return guestUser;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If signing in for the first time, set user details
      if (user) {
        token.user = {
          id: user.id || `Guest-${Math.floor(Math.random() * 10000)}`,
          name: user.name || "Guest User",
          email: user.email || `${token.user.id}@guest.com`,
          avatar: user.image || "/images/cat-guest.png",
          type: account?.provider === "google" ? "user" : "guest",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.user.id,
        name: token.user.name,
        email: token.user.email,
        avatar: token.user.avatar,
        type: token.user.type,
        emailVerified: token.user.type === "user" ? new Date() : null,
      };
      return session;
    },
  },
});
