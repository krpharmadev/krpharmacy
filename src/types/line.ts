export interface LineUser {
  userId: string;
  isRegistered: boolean;
  registeredAt?: Date;
  displayName?: string;
  pictureUrl?: string;
  email?: string;
  phone?: string;
}

export interface RichMenuConfig {
  size: {
    width: number;
    height: number;
  };
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: RichMenuArea[];
}

export interface RichMenuArea {
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  action: {
    type: 'uri' | 'postback' | 'message';
    uri?: string;
    data?: string;
    text?: string;
  };
}

export interface LineWebhookEvent {
  type: 'message' | 'follow' | 'unfollow' | 'postback' | 'beacon';
  source: {
    type: 'user' | 'group' | 'room';
    userId: string;
    groupId?: string;
    roomId?: string;
  };
  timestamp: number;
  replyToken?: string;
  message?: {
    id: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'location' | 'sticker';
    text?: string;
  };
  postback?: {
    data: string;
    params?: any;
  };
}

export interface LineWebhookBody {
  destination: string;
  events: LineWebhookEvent[];
}

export interface LineMessage {
  type: 'text' | 'image' | 'video' | 'audio' | 'location' | 'sticker' | 'template';
  text?: string;
  originalContentUrl?: string;
  previewImageUrl?: string;
  duration?: number;
  title?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  packageId?: string;
  stickerId?: string;
  template?: any;
}

export interface RichMenuResponse {
  richMenuId: string;
  size: {
    width: number;
    height: number;
  };
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: RichMenuArea[];
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}