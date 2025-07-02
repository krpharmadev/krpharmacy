// types/auth.ts - Centralized auth types
export type UserRole = 'customer' | 'medical_personnel' | 'pharmacist' | 'sales_staff' | 'inventory_staff' | 'admin'

// Shared interface สำหรับ user data รวม lineId
export interface BaseUser {
  id: string
  email?: string
  name?: string
  image?: string
  role?: UserRole
  isProfessionalApproved?: boolean
  lineId?: string // เพิ่ม lineId support
}

// Extended interface สำหรับ NextAuth session
export interface AuthUser extends BaseUser {
  email: string // Required ใน session
  role: UserRole // Required ใน session
}

// Type guards สำหรับ runtime checking
export const isValidUserRole = (role: string): role is UserRole => {
  return ['customer', 'medical_personnel', 'pharmacist', 'sales_staff', 'inventory_staff', 'admin'].includes(role)
}

export const isProfessionalRole = (role: UserRole): boolean => {
  return ['medical_personnel', 'pharmacist'].includes(role)
}

// Shared utility functions (Pure functions - ไม่ขึ้นกับ context)
export const RoleUtils = {
  hasRole: (userRole: UserRole | undefined, targetRole: UserRole): boolean => {
    return userRole === targetRole
  },

  hasAnyRole: (userRole: UserRole | undefined, targetRoles: UserRole[]): boolean => {
    return userRole ? targetRoles.includes(userRole) : false
  },

  isAdmin: (userRole: UserRole | undefined): boolean => {
    return userRole === 'admin'
  },

  isMedicalPersonnel: (userRole: UserRole | undefined, isProfessionalApproved?: boolean): boolean => {
    return userRole === 'medical_personnel' && !!isProfessionalApproved
  },

  isPharmacist: (userRole: UserRole | undefined, isProfessionalApproved?: boolean): boolean => {
    return userRole === 'pharmacist' && !!isProfessionalApproved
  },

  isProfessional: (userRole: UserRole | undefined, isProfessionalApproved?: boolean): boolean => {
    return (userRole === 'medical_personnel' || userRole === 'pharmacist') && !!isProfessionalApproved
  },

  isStaff: (userRole: UserRole | undefined): boolean => {
    return RoleUtils.hasAnyRole(userRole, ['sales_staff', 'inventory_staff', 'admin'])
  },

  isSeller: (userRole: UserRole | undefined): boolean => {
    return RoleUtils.hasAnyRole(userRole, ['sales_staff', 'admin'])
  },

  // เพิ่มฟังก์ชันสำหรับตรวจสอบการใช้ LINE
  isLineUser: (user: BaseUser): boolean => {
    return !!user.lineId
  },

  // ฟังก์ชันสำหรับตรวจสอบว่าเป็น professional ที่ได้รับการอนุมัติแล้ว
  isApprovedProfessional: (userRole: UserRole | undefined, isProfessionalApproved?: boolean): boolean => {
    if (!isProfessionalRole(userRole || 'customer')) {
      return true // Non-professional roles ไม่ต้องการ approval
    }
    return !!isProfessionalApproved
  }
}

// Constants
export const USER_ROLES = {
  CUSTOMER: 'customer' as const,
  MEDICAL_PERSONNEL: 'medical_personnel' as const,
  PHARMACIST: 'pharmacist' as const,
  SALES_STAFF: 'sales_staff' as const,
  INVENTORY_STAFF: 'inventory_staff' as const,
  ADMIN: 'admin' as const,
} as const

// Role groups
export const PROFESSIONAL_ROLES: UserRole[] = ['medical_personnel', 'pharmacist']
export const STAFF_ROLES: UserRole[] = ['sales_staff', 'inventory_staff', 'admin']
export const SELLER_ROLES: UserRole[] = ['sales_staff', 'admin']
export const ADMIN_ROLES: UserRole[] = ['admin']

// Role hierarchy สำหรับ permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'customer': 1,
  'medical_personnel': 2,
  'pharmacist': 2,
  'sales_staff': 3,
  'inventory_staff': 3,
  'admin': 10
}

// Helper สำหรับตรวจสอบ role hierarchy
export const hasMinimumRole = (userRole: UserRole | undefined, minimumRole: UserRole): boolean => {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minimumRole]
}