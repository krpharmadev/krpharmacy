import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
// เปลี่ยนจาก "./auth-types" เป็น "@/types/auth"
import { UserRole, BaseUser, RoleUtils } from "@/types/auth"

interface AuthResult {
  userId: string | null
  user: BaseUser | null
  sessionClaims: {
    role: UserRole
    isProfessionalApproved: boolean
  }
}

export async function getAuth(request?: NextRequest): Promise<AuthResult> {
  const session = await auth()
  
  return {
    userId: session?.user?.id || null,
    user: session?.user ? {
      id: session.user.id,
      email: session.user.email || undefined,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
      role: session.user.role as UserRole,
      isProfessionalApproved: session.user.isProfessionalApproved,
      lineId: session.user.lineId // เพิ่ม lineId support
    } : null,
    sessionClaims: {
      role: (session?.user?.role as UserRole) || 'customer',
      isProfessionalApproved: session?.user?.isProfessionalApproved || false
    }
  }
}

// ส่วนที่เหลือเหมือนเดิม แต่ใช้ RoleUtils จาก @/types/auth
export async function hasRole(role: UserRole, request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.hasRole(user?.role, role)
}

export async function hasAnyRole(roles: UserRole[], request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.hasAnyRole(user?.role, roles)
}

export async function isAdmin(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isAdmin(user?.role)
}

export async function isMedicalPersonnel(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isMedicalPersonnel(user?.role, user?.isProfessionalApproved)
}

export async function isPharmacist(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isPharmacist(user?.role, user?.isProfessionalApproved)
}

export async function isProfessional(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isProfessional(user?.role, user?.isProfessionalApproved)
}

export async function isStaff(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isStaff(user?.role)
}

export async function isSeller(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  return RoleUtils.isSeller(user?.role)
}

export async function isSellerAuthorized(userId: string | null): Promise<boolean> {
  if (!userId) return false
  
  const session = await auth()
  const userRole = session?.user?.role as UserRole | undefined
  return RoleUtils.isSeller(userRole)
}

export const authSeller = isSellerAuthorized

// ส่วนที่เหลือเหมือนเดิม (validation functions, middleware, etc.)
export async function requireRole(role: UserRole, request?: NextRequest): Promise<boolean> {
  const hasRequiredRole = await hasRole(role, request)
  if (!hasRequiredRole) {
    throw new Error(`Access denied. Required role: ${role}`)
  }
  return true
}

export async function requireAnyRole(roles: UserRole[], request?: NextRequest): Promise<boolean> {
  const hasRequiredRole = await hasAnyRole(roles, request)
  if (!hasRequiredRole) {
    throw new Error(`Access denied. Required roles: ${roles.join(', ')}`)
  }
  return true
}

export async function requireProfessionalApproval(request?: NextRequest): Promise<boolean> {
  const { user } = await getAuth(request)
  const isProfessionalRole = user?.role === 'medical_personnel' || user?.role === 'pharmacist'
  
  if (isProfessionalRole && !user?.isProfessionalApproved) {
    throw new Error('Professional approval required')
  }
  return true
}

export async function requireAuth(request?: NextRequest): Promise<AuthResult> {
  const authResult = await getAuth(request)
  if (!authResult.userId) {
    throw new Error('Authentication required')
  }
  return authResult
}

export function createAuthErrorResponse(message: string = 'Authentication required', status: number = 401) {
  return NextResponse.json(
    { error: message },
    { status }
  )
}

export function createForbiddenResponse(message: string = 'Access denied') {
  return NextResponse.json(
    { error: message },
    { status: 403 }
  )
}

export function withAuth(handler: (request: NextRequest, authResult: AuthResult) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const authResult = await requireAuth(request)
      return await handler(request, authResult)
    } catch (error) {
      return createAuthErrorResponse()
    }
  }
}

export function withRole(role: UserRole, handler: (request: NextRequest, authResult: AuthResult) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const authResult = await requireAuth(request)
      await requireRole(role, request)
      return await handler(request, authResult)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Access denied'
      return message.includes('Authentication') 
        ? createAuthErrorResponse() 
        : createForbiddenResponse(message)
    }
  }
}

export function withAnyRole(roles: UserRole[], handler: (request: NextRequest, authResult: AuthResult) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    try {
      const authResult = await requireAuth(request)
      await requireAnyRole(roles, request)
      return await handler(request, authResult)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Access denied'
      return message.includes('Authentication') 
        ? createAuthErrorResponse() 
        : createForbiddenResponse(message)
    }
  }
}