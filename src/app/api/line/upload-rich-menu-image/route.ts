import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'ไม่พบรูปภาพในคำขอ' },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'ไฟล์ที่อัพโหลดไม่ใช่รูปภาพ' },
        { status: 400 }
      );
    }

    // อ่านไฟล์เป็น ArrayBuffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ปรับขนาดรูปภาพและบีบอัดด้วย sharp
    const resizedImageBuffer = await sharp(buffer)
      .resize({ 
        width: 2500, 
        height: 1686, 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ 
        quality: 85,  // ลดคุณภาพรูปเพื่อลดขนาดไฟล์
        progressive: true
      })
      .toBuffer();

    // สร้างชื่อไฟล์ "rich-menu-image.jpg" เสมอ
    const filename = 'rich-menu-image.jpg';
    
    // เส้นทางที่จะบันทึกไฟล์ (ในโฟลเดอร์ public)
    const publicDir = join(process.cwd(), 'public');
    const filePath = join(publicDir, filename);

    // สร้างโฟลเดอร์หากยังไม่มี
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (error) {
      // ไม่ต้องทำอะไรหากโฟลเดอร์มีอยู่แล้ว
    }

    // เขียนไฟล์ที่ปรับขนาดแล้ว
    await writeFile(filePath, resizedImageBuffer);

    return NextResponse.json({ 
      success: true, 
      message: 'อัพโหลดรูปภาพสำเร็จ',
      path: `/${filename}`
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ' },
      { status: 500 }
    );
  }
} 