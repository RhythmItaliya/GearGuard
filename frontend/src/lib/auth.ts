import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { ENDPOINTS, API_BASE_URL } from '@/config/endpoints';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await axios.post(
            `${API_BASE_URL}${ENDPOINTS.AUTH.LOGIN}`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          if (response.data.success && response.data.data) {
            const user = response.data.data;
            return {
              id: user.id,
              email: user.email,
              name: user.fullName || user.email,
              token: user.token,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Authentication error:', error);
          throw new Error(
            error.response?.data?.message || 'Invalid credentials'
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
