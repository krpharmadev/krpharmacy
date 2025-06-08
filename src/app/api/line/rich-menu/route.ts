// app/api/line/rich-menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LIFF_ID_CATEGORIES = process.env.LIFF_ID_CATEGORIES; // LIFF ID สำหรับหมวดหมู่สินค้า
const LIFF_ID_REGISTER = process.env.LIFF_ID_REGISTER;     // LIFF ID สำหรับลงทะเบียน

export async function POST(request: NextRequest) {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    // สร้าง Rich Menu
    const richMenuData = {
      size: {
        width: 2500,
        height: 1686
      },
      selected: false,
      name: "Main Menu",
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
            uri: `https://liff.line.me/${LIFF_ID_REGISTER || 'YOUR_LIFF_ID_REGISTER'}`
          }
        }
      ]
    };

    // สร้าง Rich Menu
    const createResponse = await fetch('https://api.line.me/v2/bot/richmenu', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(richMenuData)
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Failed to create rich menu:', errorText);
      return NextResponse.json(
        { error: 'Failed to create rich menu', details: errorText },
        { status: createResponse.status }
      );
    }

    const richMenuResponse = await createResponse.json();
    const richMenuId = richMenuResponse.richMenuId;

    // อัปโหลดรูปภาพ Rich Menu
    const imageResponse = await fetch(`${request.nextUrl.origin}/rich-menu-image.jpg`);
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: 'Rich menu image not found. Please add rich-menu-image.jpg to your public folder' },
        { status: 404 }
      );
    }

    // รับข้อมูลรูปภาพ
    const imageArrayBuffer = await imageResponse.arrayBuffer();
    
    // ปรับขนาดและบีบอัดรูปภาพด้วย sharp
    const optimizedImageBuffer = await sharp(Buffer.from(imageArrayBuffer))
      .jpeg({ 
        quality: 80,  // ลดคุณภาพรูปเพื่อลดขนาดไฟล์
        progressive: true 
      })
      .toBuffer();

    // ตรวจสอบขนาดไฟล์
    console.log(`Optimized image size: ${optimizedImageBuffer.length} bytes`);
    
    // ถ้าไฟล์ยังใหญ่เกิน 1MB ให้บีบอัดเพิ่ม
    let finalImageBuffer = optimizedImageBuffer;
    if (optimizedImageBuffer.length > 1000000) {
      finalImageBuffer = await sharp(optimizedImageBuffer)
        .jpeg({ 
          quality: 70,  // ลดคุณภาพลงอีก
          progressive: true 
        })
        .toBuffer();
      console.log(`Further optimized image size: ${finalImageBuffer.length} bytes`);
    }

    const uploadResponse = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        'Content-Type': 'image/jpeg'
      },
      body: finalImageBuffer
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Failed to upload rich menu image:', errorText);
      return NextResponse.json(
        { error: 'Failed to upload rich menu image', details: errorText },
        { status: uploadResponse.status }
      );
    }

    // ตั้งเป็น Default Rich Menu
    const setDefaultResponse = await fetch(`https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });

    if (!setDefaultResponse.ok) {
      const errorText = await setDefaultResponse.text();
      console.error('Failed to set default rich menu:', errorText);
      return NextResponse.json(
        { error: 'Failed to set default rich menu', details: errorText },
        { status: setDefaultResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      richMenuId,
      message: 'Rich menu created and set as default successfully'
    });

  } catch (error) {
    console.error('Error creating rich menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ดู Rich Menu ทั้งหมด
export async function GET() {
  try {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.line.me/v2/bot/richmenu/list', {
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to fetch rich menus', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching rich menus:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ลบ Rich Menu
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const richMenuId = searchParams.get('richMenuId');

    if (!richMenuId) {
      return NextResponse.json(
        { error: 'richMenuId is required' },
        { status: 400 }
      );
    }

    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'LINE_CHANNEL_ACCESS_TOKEN is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.line.me/v2/bot/richmenu/${richMenuId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Failed to delete rich menu', details: errorText },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rich menu deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting rich menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
