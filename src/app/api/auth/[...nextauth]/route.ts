import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // DB-stored password takes priority over env var
        // (allows password changes to persist across restarts)
        const dbSetting = await prisma.siteSettings.findUnique({
          where: { key: "ADMIN_PASSWORD" },
        });
        const effectivePassword = dbSetting?.value ?? process.env.ADMIN_PASSWORD;

        if (credentials?.password === effectivePassword) {
          return { id: "1", name: "Admin" };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
