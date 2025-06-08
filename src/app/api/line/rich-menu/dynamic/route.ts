import { NextRequest, NextResponse } from 'next/server';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LIFF_ID_CATEGORIES = process.env.LIFF_ID_CATEGORIES;
const LIFF_ID_REGISTER = process.env.LIFF_ID_REGISTER;
const LIFF_ID_ORDERS = process.env.LIFF_ID_ORDERS; // LIFF ID สำหรับใบสั่งซื้อยา

interface User {
  userId: string;
  isRegistered: boolean;
  registeredAt?: Date;
}

// จำลองฐานข้อมูลผู้ใช้ (ในการใช้งานจริงควรใช้ฐานข้อมูลจริง)
const users = new Map<string, User>();

// ฟังก์ชันสร้าง Rich Menu สำหรับผู้ใช้ที่ยังไม่ลงทะเบียน
function createUnregisteredRichMenu() {
  return {
    size: {
      width: 2500,
      height: 1686
    },
    selected: false,
    name: "Unregistered Menu",
    chatBarText: "เมนู",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: `https://liff.line.me/${LIFF_ID_CATEGORIES}`
        }
      },
      {
        bounds: {
          x: 1250,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: `https://liff.line.me/${LIFF_ID_REGISTER}`
        }
      }
    ]
  };
}

// ฟังก์ชันสร้าง Rich Menu สำหรับผู้ใช้ที่ลงทะเบียนแล้ว
function createRegisteredRichMenu() {
  return {
    size: {
      width: 2500,
      height: 1686
    },
    selected: false,
    name: "Registered Menu",
    chatBarText: "เมนู",
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: `https://liff.line.me/${LIFF_ID_CATEGORIES}`
        }
      },
      {
        bounds: {
          x: 1250,
          y: 0,
          width: 1250,
          height: 1686
        },
        action: {
          type: "uri",
          uri: `https://liff.line.me/${LIFF_ID_ORDERS}`
        }
      }
    ]
  };
}

// สร้าง Rich Menu
async function createRichMenu(menuData: any, imageName: string, request: NextRequest) {
  // สร้าง Rich Menu
  const createResponse = await fetch('https://api.line.me/v2/bot/richmenu', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(menuData)
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Failed to create rich menu: ${errorText}`);
  }

  const richMenuResponse = await createResponse.json();
  const richMenuId = richMenuResponse.richMenuId;

  // อัปโหลดรูปภาพ Rich Menu
  const imageResponse = await fetch(`${request.nextUrl.origin}/${imageName}`);
  if (!imageResponse.ok) {
    throw new Error(`Rich menu image ${imageName} not found`);
  }

  const imageBuffer = await imageResponse.arrayBuffer();

  const uploadResponse = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'image/jpeg'
    },
    body: imageBuffer
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`Failed to upload rich menu image: ${errorText}`);
  }

  return richMenuId;
}

// ตั้งค่า Rich Menu สำหรับผู้ใช้
async function setUserRichMenu(userId: string, richMenuId: string) {
  const response = await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to set user rich menu: ${errorText}`);
  }
}

// ลบ Rich Menu ของผู้ใช้
async function unlinkUserRichMenu(userId: string) {
  const response = await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
    }
  });

  return response.ok;
}

// POST: สร้าง Rich Menu แบบ Dynamic
export async function POST(request: NextRequest) {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { userId, isRegistered } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // อัปเดตสถานะผู้ใช้
    const user: User = users.get(userId) || { userId, isRegistered: false };
    user.isRegistered = isRegistered;
    if (isRegistered && !user.registeredAt) {
      user.registeredAt = new Date();
    }
    users.set(userId, user);

    // เลือก Rich Menu และรูปภาพตามสถานะ
    const menuData = isRegistered ? createRegisteredRichMenu() : createUnregisteredRichMenu();
    const imageName = isRegistered ? 'rich-menu-registered.jpg' : 'rich-menu-unregistered.jpg';

    // ลบ Rich Menu เก่าของผู้ใช้ (ถ้ามี)
    await unlinkUserRichMenu(userId);

    // สร้าง Rich Menu ใหม่
    const richMenuId = await createRichMenu(menuData, imageName, request);

    // ตั้งค่า Rich Menu ให้กับผู้ใช้
    await setUserRichMenu(userId, richMenuId);

    return NextResponse.json({
      success: true,
      richMenuId,
      userId,
      isRegistered,
      message: `Rich menu updated for ${isRegistered ? 'registered' : 'unregistered'} user`
    });

  } catch (error: any) {
    console.error('Error creating dynamic rich menu:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: ตรวจสอบสถานะผู้ใช้
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

    const user = users.get(userId);
    
    return NextResponse.json({
      userId,
      isRegistered: user?.isRegistered || false,
      registeredAt: user?.registeredAt || null
    });

  } catch (error) {
    console.error('Error fetching user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: อัปเดตสถานะการลงทะเบียน
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, isRegistered } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // อัปเดตสถานะผู้ใช้
    const user: User = users.get(userId) || { userId, isRegistered: false };
    const previousStatus = user.isRegistered;
    user.isRegistered = isRegistered;
    
    if (isRegistered && !user.registeredAt) {
      user.registeredAt = new Date();
    }
    
    users.set(userId, user);

    // ถ้าสถานะเปลี่ยน ให้อัปเดต Rich Menu
    if (previousStatus !== isRegistered) {
      const menuData = isRegistered ? createRegisteredRichMenu() : createUnregisteredRichMenu();
      const imageName = isRegistered ? 'rich-menu-registered.jpg' : 'rich-menu-unregistered.jpg';

      // ลบ Rich Menu เก่า
      await unlinkUserRichMenu(userId);

      // สร้าง Rich Menu ใหม่
      const richMenuId = await createRichMenu(menuData, imageName, request);

      // ตั้งค่า Rich Menu ใหม่
      await setUserRichMenu(userId, richMenuId);

      return NextResponse.json({
        success: true,
        richMenuId,
        userId,
        isRegistered,
        statusChanged: true,
        message: `Rich menu updated: ${previousStatus ? 'registered' : 'unregistered'} → ${isRegistered ? 'registered' : 'unregistered'}`
      });
    }

    return NextResponse.json({
      success: true,
      userId,
      isRegistered,
      statusChanged: false,
      message: 'User status updated (no menu change needed)'
    });

  } catch (error: any) {
    console.error('Error updating user registration:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}