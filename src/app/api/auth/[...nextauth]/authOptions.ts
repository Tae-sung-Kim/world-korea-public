import authService from '@/services/authService';
import { SingInUserType } from '@/types/user';
import jwtUtils from '@/utils/jwt';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const ROLE = {
  ADMIN: 'admin',
  USER: 'user',
  PARTNER: 'partner',
};

const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const response = await authService.login(
            credentials as SingInUserType
          );

          if (response && credentials) {
            const userData = jwtUtils.verify(response);

            if (userData) {
              return {
                id: userData.id,
                name: userData.name,
                role: userData.isAdmin ? ROLE.ADMIN : ROLE.USER,
                accessToken: response,
              };
            }
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
      return baseUrl;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        return {
          ...token,
          ...session.user,
        };
      }

      if (user) {
        return {
          accessToken: user.accessToken,
          user: {
            ...user,
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
    signOut: () => {},
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
};

export default authOptions;
