import { NextRequest, NextResponse } from 'next/server';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

// ส่ง postback event เพื่อแจ้งว่าลงทะเบียนสำเร็จ
async function sendRegistrationCompletePostback(userId: string) {
  // ในที่นี้เราจะอัปเดต Rich Menu โดยตรงแทนการส่ง postback
  // เพราะ postback ต้องมาจากผู้ใช้กดปุ่มเท่านั้น
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/line/rich-menu/dynamic`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        isRegistered: true
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating rich menu after registration:', error);
    return false;
  }
}

// ส่งข้อความแจ้งเตือนการลงทะเบียนสำเร็จ
async function sendRegistrationSuccessMessage(userId: string) {
  const message = {
    type: 'text',
    text: '🎉 ลงทะเบียนสำเร็จแล้ว!\n\nตอนนี้คุณสามารถใช้งานระบบสั่งซื้อยาและรับสิทธิพิเศษต่างๆ ได้แล้ว\n\nสังเกตว่าเมนูด้านล่างเปลี่ยนเป็น "ใบสั่งซื้อยา" แล้ว ✨'
  };

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: userId,
        messages: [message]
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending registration success message:', error);
    return false;
  }
}

// POST: แจ้งว่าผู้ใช้ลงทะเบียนสำเร็จแล้ว
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userData } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // อัปเดต Rich Menu
    const menuUpdated = await sendRegistrationCompletePostback(userId);
    
    // ส่งข้อความแจ้งเตือน
    const messageSent = await sendRegistrationSuccessMessage(userId);

    // บันทึกข้อมูลผู้ใช้ลงฐานข้อมูล (ในที่นี้เป็นตอวอย่าง)
    console.log('User registered:', {
      userId,
      userData,
      registeredAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      userId,
      menuUpdated,
      messageSent,
      registeredAt: new Date().toISOString(),
      message: 'Registration completed successfully'
    });

  } catch (error) {
    console.error('Error completing registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: ตรวจสอบสถานะการลงทะเบียน
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // ตรวจสอบสถานะจาก dynamic rich menu API
    const response = await fetch(`${request.nextUrl.origin}/api/line/rich-menu/dynamic?userId=${userId}`);
    const userStatus = await response.json();

    return NextResponse.json({
      userId,
      isRegistered: userStatus.isRegistered || false,
      registeredAt: userStatus.registeredAt || null
    });

  } catch (error) {
    console.error('Error checking registration status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}