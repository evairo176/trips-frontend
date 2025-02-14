import axios from 'axios';
import { AuthOptions } from 'next-auth';

import CredentialProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 hari
  },
  providers: [
    CredentialProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text'
        },
        password: {
          label: 'password',
          type: 'password'
        }
      },
      async authorize(credentials, req): Promise<any> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('No input found');
          }

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password
            },
            { withCredentials: true }
          );

          if (response?.data?.data) {
            return {
              ...response?.data?.data.user,
              accessToken: response?.data?.data.user.accessToken,
              refreshToken: response?.data?.data.user.refreshToken,
              accessTokenExpires: response?.data?.data?.user.accessTokenExpires,
              companyId: response?.data?.data?.user.companyId,
              businessTypeCode: response?.data?.data.businessTypeCode,
              role: response?.data?.data.role,
              company: response?.data?.data.company
            };
          }

          throw new Error('Invalid login credentials');
        } catch (error: any) {
          console.error('Login Error:', error.response?.data || error.message);

          throw new Error(
            error.response?.data?.message || 'Authentication failed'
          );
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    newUser: '/register'
  },

  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      // the token object is passed done to the session call back for persistence
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user?.accessTokenExpires;
        token.companyId = user?.companyId;
        token.businessTypeCode = user.businessTypeCode;
        token.role = user.role;
        token.company = user.company;
      }

      if (trigger === 'update') {
        token.businessTypeCode = session.businessTypeCode;
        token.role = session.role;
      }

      // Cek apakah token sudah expired
      if (Date.now() > token.accessTokenExpires) {
        try {
          console.log({ token });
          console.log('🔄 Refreshing access token...');
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
            { refreshToken: token.refreshToken }, // ⬅️ Kirim refreshToken ke server
            { withCredentials: true }
          );

          if (res.data.accessToken) {
            console.log('✅ Access token refreshed!');
            return {
              ...token,
              accessToken: res.data.accessToken,
              accessTokenExpires: res.data.accessTokenExpires // 60 menit
            };
          }
        } catch (error: any) {
          console.error('❌ Refresh token failed:', error?.data?.message);
          console.log(error);
        }

        // Jika refresh gagal, hapus token agar user logout
        return { ...token, token: null, refreshToken: null };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      // console.log({ session, token });

      return session;
    }
  },
  theme: {
    colorScheme: 'auto' // "auto" | "dark" | "light"
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    }
  }
};

export default authOptions;
