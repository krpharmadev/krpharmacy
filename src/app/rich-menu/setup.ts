interface RichMenuTemplate {
    id: string;
    name: string;
    chatBarText: string;
    areas: Array<{
      bounds: { x: number; y: number; width: number; height: number };
      action: any;
    }>;
    size: { width: number; height: number };
  }
  
  export const RICH_MENU_TEMPLATES: { [key: string]: RichMenuTemplate } = {
    registration: {
      id: 'registration_menu',
      name: 'Registration Menu',
      chatBarText: 'เมนู',
      size: { width: 2500, height: 843 },
      areas: [
        {
          bounds: { x: 107, y: 372, width: 548, height: 471 },
          action: {
            type: 'postback',
            data: 'action=register'
          }
        }
      ]
    },
    order: {
      id: 'order_menu',
      name: 'Order Menu',
      chatBarText: 'เมนู',
      size: { width: 2500, height: 843 },
      areas: [
        {
          bounds: { x: 107, y: 372, width: 548, height: 471 },
          action: {
            type: 'uri',
            uri: process.env.NEXT_PUBLIC_BASE_URL + '/order'
          }
        }
      ]
    }
  };
  
  export class RichMenuManager {
    private accessToken: string;
    private createdMenus: Map<string, string> = new Map();
  
    constructor(accessToken: string) {
      this.accessToken = accessToken;
    }
  
    async createRichMenu(template: RichMenuTemplate): Promise<string> {
      if (this.createdMenus.has(template.id)) {
        return this.createdMenus.get(template.id)!;
      }
  
      const response = await fetch('https://api.line.me/v2/bot/richmenu', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          size: template.size,
          selected: false,
          name: template.name,
          chatBarText: template.chatBarText,
          areas: template.areas
        })
      });
  
      const result = await response.json();
      if (result.richMenuId) {
        this.createdMenus.set(template.id, result.richMenuId);
      }
      
      return result.richMenuId;
    }
  
    async linkMenuToUser(userId: string, richMenuId: string): Promise<void> {
      await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    }
  
    async unlinkMenuFromUser(userId: string): Promise<void> {
      await fetch(`https://api.line.me/v2/bot/user/${userId}/richmenu`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
    }
  
    async uploadImage(richMenuId: string, imageBuffer: Buffer): Promise<void> {
      await fetch(`https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'image/png'
        },
        body: imageBuffer
      });
    }
  
    async switchUserMenu(userId: string, templateId: string): Promise<void> {
      const template = RICH_MENU_TEMPLATES[templateId];
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }
  
      try {
        // Unlink current menu
        await this.unlinkMenuFromUser(userId);
        
        // Create or get existing menu
        const richMenuId = await this.createRichMenu(template);
        
        // Link new menu
        await this.linkMenuToUser(userId, richMenuId);
      } catch (error) {
        console.error('Error switching user menu:', error);
        throw error;
      }
    }
  }