// src/lib/auth.ts
import { type User } from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db/db';
import { users, sessions, accounts, professionalRegistrations } from '@/lib/db/schema/account';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';
import NextAuth from 'next-auth';
import type { AccountTableType } from '@/types/next-auth';
import { jwtDecode } from "jwt-decode";


export const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts as AccountTableType,
    sessionsTable: sessions,
  }) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('กรุณากรอกอีเมลและรหัสผ่าน');
        }

        const foundUsers = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (foundUsers.length === 0) {
          throw new Error('ไม่พบผู้ใช้ด้วยอีเมลนี้');
        }

        const user = foundUsers[0];

        if (!user.password) {
          throw new Error('บัญชีนี้ไม่ได้ตั้งรหัสผ่าน');
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          throw new Error('รหัสผ่านไม่ถูกต้อง');
        }

        // ตรวจสอบ professional registration
        let isProfessionalApproved = false;
        if (['medical_personnel', 'pharmacist'].includes(user.role)) {
          const registration = await db
            .select()
            .from(professionalRegistrations)
            .where(eq(professionalRegistrations.userId, user.id))
            .limit(1);
          isProfessionalApproved = registration.length > 0 && registration[0].status === 'approved';
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isProfessionalApproved,
        };
      },
    }),
    // LINE LIFF credentials provider
    {
      id: "line-liff",
      name: "LINE LIFF",
      type: "credentials",
      credentials: {
        idToken: { label: "ID Token", type: "text" }
      },
      async authorize(credentials) {
        try {
          const { idToken } = credentials as { idToken: string };
          if (!idToken) return null;

          // Decode idToken จริงจาก LINE
          const decoded: any = jwtDecode(idToken);
          // LINE LIFF idToken จะมี sub เป็น userId
          const lineProfile = {
            id: decoded.sub, // ใช้ sub เป็น lineId จริง
            name: decoded.name || "LINE User",
            email: decoded.email,
            picture: decoded.picture || decoded.pictureUrl
          };

          // ค้นหาผู้ใช้จาก LINE ID
          let [user] = await db
            .select()
            .from(users)
            .where(eq(users.lineId, lineProfile.id))
            .limit(1);

          // ถ้าไม่พบ แต่มี email ให้ค้นหาจาก email
          if (!user && lineProfile.email) {
            [user] = await db
              .select()
              .from(users)
              .where(eq(users.email, lineProfile.email))
              .limit(1);
          }

          // ถ้ายังไม่พบอีก ให้สร้างผู้ใช้ใหม่
          if (!user) {
            const [newUser] = await db
              .insert(users)
              .values({
                name: lineProfile.name,
                email: lineProfile.email,
                lineId: lineProfile.id,
                image: lineProfile.picture,
                emailVerified: new Date(),
                role: "customer"
              })
              .returning();
            user = newUser;
          }

          // ตรวจสอบ professional registration
          let isProfessionalApproved = false;
          if (["medical_personnel", "pharmacist"].includes(user.role)) {
            const registration = await db
              .select()
              .from(professionalRegistrations)
              .where(eq(professionalRegistrations.userId, user.id))
              .limit(1);
            isProfessionalApproved = registration.length > 0 && registration[0].status === "approved";
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            emailVerified: user.emailVerified,
            isProfessionalApproved,
          };
        } catch (error) {
          console.error("LINE LIFF authentication error:", error);
          return null;
        }
      }
    },
  ],
  pages: {
    signIn: '/web/login',
  },
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session  }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isProfessionalApproved = user.isProfessionalApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role!;
        session.user.isProfessionalApproved = token.isProfessionalApproved;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// สร้าง auth function และ export ออกไป
export const { auth, signIn, signOut } = NextAuth(authOptions);