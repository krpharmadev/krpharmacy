import crypto from 'crypto';
import { LineMessage, RichMenuConfig } from '@/types/line';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;

export class LineAPI {
  private static instance: LineAPI;
  private accessToken: string;

  private constructor() {
    if (!LINE_CHANNEL_ACCESS_TOKEN) {
      throw new Error('LINE_CHANNEL_ACCESS_TOKEN is not configured');
    }
    this.accessToken = LINE_CHANNEL_ACCESS_TOKEN;
  }

  public static getInstance(): LineAPI {
    if (!LineAPI.instance) {
      LineAPI.instance = new LineAPI();
    }
    return LineAPI.instance;
  }

  // ตรวจสอบ webhook signature
  public verifySignature(body: string, signature: string): boolean {
    if (!LINE_CHANNEL_SECRET) {
      console.error('LINE_CHANNEL_SECRET is not configured');
      return false;
    }

    const hash = crypto
      .createHmac('SHA256', LINE_CHANNEL_SECRET)
      .update(body)
      .digest('base64');

    return hash === signature;
  }

  // ส่ง reply message
  public async replyMessage(replyToken: string, messages: LineMessage[]): Promise<boolean> {
    try {
      const response = await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          replyToken,
          messages
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending reply message:', error);
      return false;
    }
  }

  // ส่ง push message
  public async pushMessage(userId: string, messages: LineMessage[]): Promise<boolean> {
    try {
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: userId,
          messages
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending push message:', error);
      return false;
    }
  }

  // สร้าง Rich Menu
  public async createRichMenu(menuConfig: RichMenuConfig): Promise<string | null> {
    try {
      const response = await fetch('https://api.line.me/v2/bot/richmenu', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(menuConfig)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create rich menu:', errorText);
        return null;
      }

      const result = await response.json();
      return result.richMenuId;
    } catch (error) {
      console.error('Error creating rich menu:', error);
      return null;
    }
  }

  // อัปโหลดรูปภาพ Rich Menu
  public async uploadRichMenuImage(richMenuId: string, imageBuffer: ArrayBuffer): Promise<boolean> {
    try {
      const response = await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'image/jpeg'
        },
        body: imageBuffer
      });

      return response.ok;
    } catch (error) {
      console.error('Error uploading rich menu image:', error);
      return false;
    }
  }

  // ตั้งค่า Rich Menu ให้กับผู้ใช้
  public async setUserRichMenu(userId: string, richMenuId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error setting user rich menu:', error);
      return false;
    }
  }

  // ลบ Rich Menu ของผู้ใช้
  public async unlinkUserRichMenu(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error unlinking user rich menu:', error);
      return false;
    }
  }

  // ลบ Rich Menu
  public async deleteRichMenu(richMenuId: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.line.me/v2/bot/richmenu/${richMenuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error deleting rich menu:', error);
      return false;
    }
  }

  // ดึงรายการ Rich Menu ทั้งหมด
  public async getRichMenuList(): Promise<any[]> {
    try {
      const response = await fetch('https://api.line.me/v2/bot/richmenu/list', {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        return [];
      }

      const result = await response.json();
      return result.richmenus || [];
    } catch (error) {
      console.error('Error fetching rich menu list:', error);
      return [];
    }
  }

  // ดึงข้อมูลผู้ใช้
  public async getUserProfile(userId: string): Promise<any | null> {
    try {
      const response = await fetch(`https://api.line.me/v2/bot/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }
}

// Rich Menu Templates
export class RichMenuTemplates {
  private static LIFF_ID_CATEGORIES = process.env.LIFF_ID_CATEGORIES;
  private static LIFF_ID_REGISTER = process.env.LIFF_ID_REGISTER;
  private static LIFF_ID_ORDERS = process.env.LIFF_ID_ORDERS;

  // สร้าง Rich Menu สำหรับผู้ใช้ที่ยังไม่ลงทะเบียน
  public static createUnregisteredMenu(): RichMenuConfig {
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
            uri: `https://liff.line.me/${this.LIFF_ID_CATEGORIES}`
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
            uri: `https://liff.line.me/${this.LIFF_ID_REGISTER}`
          }
        }
      ]
    };
  }

  // สร้าง Rich Menu สำหรับผู้ใช้ที่ลงทะเบียนแล้ว
  public static createRegisteredMenu(): RichMenuConfig {
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
            uri: `https://liff.line.me/${this.LIFF_ID_CATEGORIES}`
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
            uri: `https://liff.line.me/${this.LIFF_ID_ORDERS}`
          }
        }
      ]
    };
  }
}

// Message Templates
export class MessageTemplates {
  public static welcomeMessage(): LineMessage {
    return {
      type: 'text',
      text: 'ยินดีต้อนรับสู่โครงชณสีช! 🏥\n\nเลือกซื้อยา เวชภัณฑ์ และสินค้าอื่น\nหรือลงทะเบียนเพื่อรับสิทธิพิเศษ'
    };
  }

  public static registrationSuccessMessage(): LineMessage {
    return {
      type: 'text',
      text: '🎉 ลงทะเบียนสำเร็จแล้ว!\n\nตอนนี้คุณสามารถใช้งานระบบสั่งซื้อยาและรับสิทธิพิเศษต่างๆ ได้แล้ว\n\nสังเกตว่าเมนูด้านล่างเปลี่ยนเป็น "ใบสั่งซื้อยา" แล้ว ✨'
    };
  }

  public static pleaseRegisterMessage(): LineMessage {
    return {
      type: 'text',
      text: 'กรุณาลงทะเบียนก่อนเพื่อใช้งานระบบสั่งซื้อยา\n\nคลิกปุ่ม "ลงทะเบียน" ในเมนูด้านล่างได้เลยค่ะ'
    };
  }

  public static generalHelpMessage(): LineMessage {
    return {
      type: 'text',
      text: 'สวัสดีครับ! ใช้เมนูด้านล่างเพื่อเลือกซื้อสินค้าหรือลงทะเบียนได้เลยครับ'
    };
  }
}

export default LineAPI;