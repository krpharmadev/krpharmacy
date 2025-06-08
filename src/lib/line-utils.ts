import { RichMenuRequest, RichMenuResponse } from '@/types/line';

const LINE_API_BASE = 'https://api.line.me/v2/bot';
const LINE_DATA_API_BASE = 'https://api-data.line.me/v2/bot';

export class LineRichMenuService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getHeaders(contentType: string = 'application/json') {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': contentType
    };
  }

  async createRichMenu(richMenuData: RichMenuRequest): Promise<{ richMenuId: string }> {
    const response = await fetch(`${LINE_API_BASE}/richmenu`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(richMenuData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create rich menu: ${errorText}`);
    }

    return response.json();
  }

  async uploadRichMenuImage(richMenuId: string, imageBuffer: ArrayBuffer): Promise<void> {
    const response = await fetch(`${LINE_DATA_API_BASE}/richmenu/${richMenuId}/content`, {
      method: 'POST',
      headers: this.getHeaders('image/jpeg'),
      body: imageBuffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload rich menu image: ${errorText}`);
    }
  }

  async setDefaultRichMenu(richMenuId: string): Promise<void> {
    const response = await fetch(`${LINE_API_BASE}/user/all/richmenu/${richMenuId}`, {
      method: 'POST',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set default rich menu: ${errorText}`);
    }
  }

  async getAllRichMenus(): Promise<{ richmenus: RichMenuResponse[] }> {
    const response = await fetch(`${LINE_API_BASE}/richmenu/list`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch rich menus: ${errorText}`);
    }

    return response.json();
  }

  async deleteRichMenu(richMenuId: string): Promise<void> {
    const response = await fetch(`${LINE_API_BASE}/richmenu/${richMenuId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete rich menu: ${errorText}`);
    }
  }

  async getRichMenu(richMenuId: string): Promise<RichMenuResponse> {
    const response = await fetch(`${LINE_API_BASE}/richmenu/${richMenuId}`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get rich menu: ${errorText}`);
    }

    return response.json();
  }

  // สร้าง Rich Menu แบบ 2 ปุ่ม (หมวดหมู่สินค้า และ ลงทะเบียน)
  createTwoButtonRichMenu(liffIdCategories: string, liffIdRegister: string): RichMenuRequest {
    return {
      size: {
        width: 2500,
        height: 1686
      },
      selected: false,
      name: "Main Menu - Two Buttons",
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
            uri: `https://liff.line.me/${liffIdCategories}`
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
            uri: `https://liff.line.me/${liffIdRegister}`
          }
        }
      ]
    };
  }
}