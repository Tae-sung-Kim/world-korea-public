import jwtUtils from '@/app/api/utils/jwt.util';
import * as CONSTS from '@/definitions';
import authService, { UserSignIn } from '@/services/auth.service';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
          const response = await authService.login(credentials as UserSignIn);

          if (response && credentials) {
            const userData = jwtUtils.verify(response);

            if (userData) {
              return {
                id: userData.id,
                name: userData.name,
                role: userData.isAdmin
                  ? CONSTS.USER_ROLE.ADMIN
                  : CONSTS.USER_ROLE.USER,
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
    async redirect({ baseUrl }) {
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
