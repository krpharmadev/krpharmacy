import { z } from "zod"

// สร้าง schema สำหรับตรวจสอบข้อมูลคำสั่งซื้อยา
export const medicationOrderSchema = z.object({
  professionalId: z.string().min(5, {
    message: "กรุณาระบุรหัสบุคลากรทางการแพทย์ที่ถูกต้อง",
  }),
  professionalType: z.enum(["doctor", "nurse", "pharmacist"], {
    required_error: "กรุณาเลือกประเภทบุคลากรทางการแพทย์",
  }),
  hospitalName: z.string().min(3, {
    message: "กรุณาระบุชื่อโรงพยาบาลหรือสถานพยาบาล",
  }),
  department: z.string().optional(),
  email: z.string().email({
    message: "กรุณาระบุอีเมลที่ถูกต้อง",
  }),
  phone: z.string().min(9, {
    message: "กรุณาระบุเบอร์โทรศัพท์ที่ถูกต้อง",
  }),
  deliveryAddress: z.string().min(10, {
    message: "กรุณาระบุที่อยู่ในการจัดส่งที่ครบถ้วน",
  }),
})

// สร้าง schema สำหรับตรวจสอบรายการในตะกร้าสินค้า
export const cartItemSchema = z.object({
  productId: z.string(),
  quantity: z
    .number()
    .min(1, {
      message: "จำนวนต้องมากกว่า 0",
    })
    .max(100, {
      message: "จำนวนสูงสุดต่อรายการคือ 100",
    }),
  notes: z.string().optional(),
})

// สร้าง schema สำหรับตรวจสอบการใช้คูปอง
export const couponSchema = z.object({
  code: z.string(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number(),
  minimumOrderValue: z.number().optional(),
  maxDiscountAmount: z.number().optional(),
  expiryDate: z.date().optional(),
})

// สร้าง type จาก schema
export type MedicationOrderFormData = z.infer<typeof medicationOrderSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type Coupon = z.infer<typeof couponSchema>