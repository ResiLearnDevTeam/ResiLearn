import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import { db } from './db';
import bcrypt from 'bcryptjs';

export const authConfig = {
  adapter: PrismaAdapter(db) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

// -----------------------------------------------------------------------------
// ✅ เพิ่มส่วนนี้เท่านั้น
// ใช้เพื่อสร้างและ export ฟังก์ชัน `auth()` สำหรับดึง session ในฝั่ง server
// เช่นในไฟล์ /app/api/courses/route.ts จะสามารถ `import { auth } from '@/lib/auth'` ได้เลย
// -----------------------------------------------------------------------------

import NextAuth from 'next-auth';

// ✅ สร้าง instance ของ NextAuth จาก config ด้านบน
const { auth } = NextAuth(authConfig);

// ✅ export ฟังก์ชัน auth() ออกไปใช้ใน server-side routes
export { auth };
