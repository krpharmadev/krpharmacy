import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { accounts } from "@/lib/db/schema/account"

// Import UserRole จาก shared types แทนการประกาศใหม่
import type { UserRole } from "@/types/auth"

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: UserRole;
    isProfessionalApproved?: boolean; // สำหรับ medical_personnel, pharmacist
    lineId?: string; // เพิ่ม lineId สำหรับ LINE LIFF
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      isProfessionalApproved?: boolean;
      email: string;
      name?: string | null;
      image?: string | null;
      lineId?: string; // เพิ่ม lineId สำหรับ LINE LIFF
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role?: UserRole;
    isProfessionalApproved?: boolean;
    lineId?: string; // เพิ่ม lineId สำหรับ LINE LIFF
  }
}

// Optional: ถ้าคุณใช้ database adapter
export type AccountTableType = typeof accounts;