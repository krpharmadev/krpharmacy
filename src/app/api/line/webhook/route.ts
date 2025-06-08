import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

interface LineEvent {
  type: string;
  source: {
    type: string;
    userId: string;
  };
  message?: {
    type: string;
    text: string;
  };
  postback?: {
    data: string;
  };
}

interface WebhookBody {
  events: LineEvent[];
}

// ตรวจสอบ signature
function verifySignature(body: string, signature: string): boolean {
  if (!LINE_CHANNEL_SECRET) return false;
  
  const hash = crypto
    .createHmac('SHA256', LINE_CHANNEL_SECRET)
    .update(body)
    .digest('base64');
  
  return hash === signature;
}

// ส่งข้อความตอบกลับ
async function replyMessage(replyToken: string, messages: any[]) {
  const response = await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      replyToken,
      messages
    })
  });

  return response.ok;
}

// อัปเดต Rich Menu สำหรับผู้ใช้
async function updateUserRichMenu(userId: string, isRegistered: boolean, request: NextRequest) {
  try {
    const response = await fetch(`${request.nextUrl.origin}/api/line/rich-menu/dynamic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        isRegistered
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating user rich menu:', error);
    return false;
  }
}

// จัดการเหตุการณ์เมื่อผู้ใช้เข้าร่วม/follow
async function handleFollow(event: LineEvent, request: NextRequest) {
  const userId = event.source.userId;
  
  // ตั้งค่า Rich Menu สำหรับผู้ใช้ใหม่ (ยังไม่ลงทะเบียน)
  await updateUserRichMenu(userId, false, request);
  
  // ส่งข้อความต้อนรับ
  const welcomeMessage = {
    type: 'text',
    text: 'ยินดีต้อนรับสู่โครงชณสีช! 🏥\n\nเลือกซื้อยา เวชภัณฑ์ และสินค้าอื่น\nหรือลงทะเบียนเพื่อรับสิทธิพิเศษ'
  };

  return [welcomeMessage];
}

// จัดการข้อความจากผู้ใช้
async function handleMessage(event: LineEvent, request: NextRequest) {
  const userId = event.source.userId;
  const messageText = event.message?.text?.toLowerCase() || '';

  // ตรวจสอบคำสั่งพิเศษ
  if (messageText.includes('ลงทะเบียน') || messageText.includes('register')) {
    return [{
      type: 'text',
      text: 'กรุณาคลิกปุ่ม "ลงทะเบียน" ในเมนูด้านล่างเพื่อลงทะเบียน'
    }];
  }

  if (messageText.includes('สั่งยา') || messageText.includes('ใบสั่ง')) {
    // ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือไม่
    const userStatusResponse = await fetch(`${request.nextUrl.origin}/api/line/rich-menu/dynamic?userId=${userId}`);
    const userStatus = await userStatusResponse.json();

    if (userStatus.isRegistered) {
      return [{
        type: 'text',
        text: 'กรุณาคลิกปุ่ม "ใบสั่งซื้อยา" ในเมนูด้านล่างเพื่อดูใบสั่งซื้อของคุณ'
      }];
    } else {
      return [{
        type: 'text',
        text: 'กรุณาลงทะเบียนก่อนเพื่อใช้งานระบบสั่งซื้อยา'
      }];
    }
  }

  // ข้อความทั่วไป
  return [{
    type: 'text',
    text: 'สวัสดีครับ! ใช้เมนูด้านล่างเพื่อเลือกซื้อสินค้าหรือลงทะเบียนได้เลยครับ'
  }];
}

// จัดการ Postback (เมื่อมีการลงทะเบียนสำเร็จ)
async function handlePostback(event: LineEvent, request: NextRequest) {
  const userId = event.source.userId;
  const postbackData = event.postback?.data || '';

  if (postbackData === 'registration_complete') {
    // อัปเดต Rich Menu เป็นแบบที่ลงทะเบียนแล้ว
    await updateUserRichMenu(userId, true, request);

    return [{
      type: 'text',
      text: '🎉 ลงทะเบียนสำเร็จแล้ว!\n\nตอนนี้คุณสามารถใช้งานระบบสั่งซื้อยาและรับสิทธิพิเศษต่างๆ ได้แล้ว\n\nสังเกตว่าเมนูด้านล่างเปลี่ยนเป็น "ใบสั่งซื้อยา" แล้ว'
    }];
  }

  return [];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-line-signature') || '';

    // ตรวจสอบ signature
    if (!verifySignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const webhookBody: WebhookBody = JSON.parse(body);

    for (const event of webhookBody.events) {
      let replyMessages: any[] = [];

      switch (event.type) {
        case 'follow':
          replyMessages = await handleFollow(event, request);
          break;

        case 'message':
          if (event.message?.type === 'text') {
            replyMessages = await handleMessage(event, request);
          }
          break;

        case 'postback':
          replyMessages = await handlePostback(event, request);
          break;

        default:
          continue;
      }

      // ส่งข้อความตอบกลับ (ถ้ามี)
      if (replyMessages.length > 0 && 'replyToken' in event) {
        await replyMessage((event as any).replyToken, replyMessages);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}