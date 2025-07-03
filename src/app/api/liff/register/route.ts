import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { professionalOrders } from '@/lib/db/schema/order';
import { medicationOrderSchema } from '@/lib/validations/order';
import { users } from '@/lib/db/schema/account';
import { eq } from 'drizzle-orm';

// Mapping professionalType to user role
const professionalTypeToRole = {
  doctor: 'medical_personnel',
  nurse: 'medical_personnel',
  pharmacist: 'pharmacist',
} as const;

type ProfessionalType = keyof typeof professionalTypeToRole;

enum UserRole {
  Customer = 'customer',
  MedicalPersonnel = 'medical_personnel',
  Pharmacist = 'pharmacist',
  Admin = 'admin',
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // validate ข้อมูลด้วย zod
    const parsed = medicationOrderSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ message: 'ข้อมูลไม่ถูกต้อง', errors: parsed.error.flatten() }, { status: 400 });
    }
    const values = parsed.data;
    // insert ลง db
    await db.insert(professionalOrders).values({
      professionalId: values.professionalId,
      professionalType: values.professionalType,
      hospitalName: values.hospitalName,
      department: values.department,
      email: values.email,
      phone: values.phone,
      deliveryAddress: values.deliveryAddress,
    });
    // อัปเดต role ของ user ตาม professionalType
    const newRole = professionalTypeToRole[values.professionalType as ProfessionalType] || UserRole.Customer;
    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.email, values.email));
    return NextResponse.json({ message: 'บันทึกข้อมูลสำเร็จและอัปเดตสิทธิ์ผู้ใช้แล้ว' });
  } catch (err) {
    return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }, { status: 500 });
  }
} 