import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/db'
import { professionalRegistrations, users } from '@/lib/db/schema/account'
import { auth } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await req.json()
  const userId = session.user.id

  // ตรวจสอบว่ามีการลงทะเบียนแล้วหรือยัง
  const exist = await db
    .select()
    .from(professionalRegistrations)
    .where(eq(professionalRegistrations.userId, userId))
    .limit(1)

  if (exist.length > 0) {
    return NextResponse.json({ error: 'ลงทะเบียนแล้ว' }, { status: 400 })
  }

  // เพิ่มข้อมูลการลงทะเบียนใหม่
  const result = await db
    .insert(professionalRegistrations)
    .values({
      userId,
      licenseNumber: data.licenseNumber,
      profession: data.role === 'doctor' ? 'medical' : 'pharmacist',
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      hospital: data.hospital,
      experience: data.experience,
      status: 'pending',
    })
    .returning()

  return NextResponse.json({ success: true, registration: result[0] })
} 