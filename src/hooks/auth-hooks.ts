'use client'

import { useSession, signIn, signOut } from "next-auth/react"
// เปลี่ยนจาก "./auth-types" เป็น "@/types/auth"
import { UserRole, BaseUser, RoleUtils, AuthUser } from "@/types/auth"

// ส่วนที่เหลือเหมือนเดิม...
export const useUser = () => {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user ? {
      id: session.user.id,
      emailAddresses: [{ emailAddress: session.user.email || '' }],
      firstName: session.user.name?.split(' ')[0] || '',
      lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
      imageUrl: session.user.image || '',
      publicMetadata: {
        role: session.user.role,
        isProfessionalApproved: session.user.isProfessionalApproved,
        lineId: session.user.lineId
      }
    } : null,
    isLoaded: status !== 'loading',
    isSignedIn: !!session?.user
  }
}

export const useAuth = () => {
  const { data: session, status, update } = useSession()
  
  const getToken = async () => {
    if (session?.user?.id) {
      return session.user.id
    }
    return null
  }

  const updateUserRole = async (role: UserRole, isProfessionalApproved?: boolean) => {
    await update({
      user: {
        ...session?.user,
        role,
        isProfessionalApproved
      }
    })
  }

  const updateLineId = async (lineId: string) => {
    await update({
      user: {
        ...session?.user,
        lineId
      }
    })
  }

  return {
    userId: session?.user?.id || null,
    isLoaded: status !== 'loading',
    isSignedIn: !!session?.user,
    getToken,
    updateUserRole,
    updateLineId
  }
}

export const useClerk = () => {
  const openSignIn = () => {
    signIn()
  }

  const openSignOut = () => {
    signOut()
  }

  return {
    openSignIn,
    signOut: openSignOut
  }
}

export const useRole = () => {
  const { data: session } = useSession()
  const userRole = session?.user?.role as UserRole | undefined
  const isProfessionalApproved = session?.user?.isProfessionalApproved
  const user = session?.user as BaseUser | undefined
  
  return {
    role: userRole,
    isProfessionalApproved,
    lineId: session?.user?.lineId,
    
    hasRole: (role: UserRole) => RoleUtils.hasRole(userRole, role),
    hasAnyRole: (roles: UserRole[]) => RoleUtils.hasAnyRole(userRole, roles),
    isMedicalPersonnel: () => RoleUtils.isMedicalPersonnel(userRole, isProfessionalApproved),
    isPharmacist: () => RoleUtils.isPharmacist(userRole, isProfessionalApproved),
    isAdmin: () => RoleUtils.isAdmin(userRole),
    isStaff: () => RoleUtils.isStaff(userRole),
    isSeller: () => RoleUtils.isSeller(userRole),
    isProfessional: () => RoleUtils.isProfessional(userRole, isProfessionalApproved),
    isLineUser: () => user ? RoleUtils.isLineUser(user) : false,
    isApprovedProfessional: () => RoleUtils.isApprovedProfessional(userRole, isProfessionalApproved)
  }
}

export const useLine = () => {
  const { data: session } = useSession()
  const { updateLineId } = useAuth()
  
  return {
    lineId: session?.user?.lineId,
    isLineUser: !!session?.user?.lineId,
    linkLineAccount: updateLineId
  }
}