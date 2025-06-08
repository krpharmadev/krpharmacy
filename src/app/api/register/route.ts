import { NextRequest, NextResponse } from "next/server";

// สร้าง Map เพื่อจำลองฐานข้อมูลชั่วคราว (ในการพัฒนาจริงควรใช้ฐานข้อมูล)
const userMap = new Map();

// ฟังก์ชันจำลองสำหรับการอัปเดท Rich Menu (ควรใช้ API LINE จริงในการพัฒนา)
async function unlinkRichMenuFromUser(userId: string): Promise<void> {
  // จำลองการเรียก LINE API
  console.log(`จำลองการลบ Rich Menu จากผู้ใช้ ${userId}`);
  // ในการพัฒนาจริง ควรเรียกใช้ LINE API
  return Promise.resolve();
}

export async function POST(request: NextRequest) {
    try {
      const { userId, name, phone, address, age, gender } = await request.json();
  
      // ตรวจสอบข้อมูลที่จำเป็น
      if (!userId || !name) {
        return NextResponse.json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
      }

      // ดึงข้อมูลผู้ใช้หรือสร้างใหม่ถ้ายังไม่มี
      let userData = userMap.get(userId) || { userId };
      
      // อัปเดทข้อมูลผู้ใช้
      userData = {
        ...userData,
        name,
        phone,
        address,
        age,
        gender,
        isRegistered: true,
        registeredAt: new Date()
      };
      
      // บันทึกลงใน Map (ในการพัฒนาจริงควรบันทึกลงฐานข้อมูล)
      userMap.set(userId, userData);
  
      // อัปเดท Rich Menu (ถ้าจำเป็น)
      try {
        // ยกเลิก Rich Menu ปัจจุบัน
        await unlinkRichMenuFromUser(userId);
        
        // สร้าง Rich Menu ใหม่สำหรับการสั่งซื้อ
        // หมายเหตุ: คุณต้องสร้างฟังก์ชันสำหรับสร้าง Rich Menu ด้วยรูปภาพที่เหมาะสม
        
        return NextResponse.json({ 
          success: true, 
          message: 'ลงทะเบียนสำเร็จ! เมนูได้อัพเดทเป็นเมนูสั่งซื้อแล้ว' 
        });
      } catch (error) {
        console.error('Rich menu update error:', error);
        return NextResponse.json({ 
          success: true, 
          message: 'ลงทะเบียนสำเร็จ!' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
  }