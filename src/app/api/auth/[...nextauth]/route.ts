import authService from '@/services/authService';
import { SingInUserType, UserJwtPayloadType } from '@/types/user';
import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'Id', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await authService.signIn(
            credentials as SingInUserType
          );

          if (response && credentials) {
            return {
              id: credentials.id,
              accessToken: response,
            };
          }
        } catch (error) {
          throw new Error('Filed to login.');
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log(url, baseUrl);
      return baseUrl;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          accessToken: user.accessToken,
          user: {
            id: user.id,
          },
        };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user = token.user;
      }

      return session;
    },
  },

  events: {
    signOut: () => {
      console.log('Hi');
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
