import authService from '@/services/authService';
import { SingInUserType } from '@/types/user';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials) {
        try {
          const response = await authService.signIn(
            credentials as SingInUserType,
          );

          if (response) {
            return response;
          }
        } catch (error) {
          throw new Error('Filed to login.');
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async signIn() {
      return true;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },

    async session({ session, user, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});

export { handler as GET, handler as POST };
