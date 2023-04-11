import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || clientId.length === 0) {
    throw new Error("No GOOGLE_CLIENT_ID provided");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("No GOOGLE_CLIENT_SECRET provided");
  }
  return { clientId, clientSecret };
}

// function getSupabaseCredentials() {
//   const url = process.env.SUPABASE_URL;
//   const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
//   if (!url || url.length === 0) {
//     throw new Error("No supabase SUPABASE_URL has been provided");
//   }
//   if (!secret || secret.length === 0) {
//     throw new Error("No supabase SUPABASE_SERVICE_ROLE_KEY has been provided");
//   }
//   return { url, secret };
// }

/**
 * SupabaseAdapter({...getSupabaseCredentials()})
 * UpstashRedisAdapter(db)
 */

const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [GoogleProvider({ ...getGoogleCredentials() })],
  callbacks: {
    async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
    redirect() {
      return "/";
    },
  },
};

export default authOptions;
