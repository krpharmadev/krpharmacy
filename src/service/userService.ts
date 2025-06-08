import { LineUser } from '@/types/line';

// จำลองฐานข้อมูลผู้ใช้ (ในการใช้งานจริงควรใช้ฐานข้อมูลจริง)
class UserService {
  private static instance: UserService;
  private users: Map<string, LineUser> = new Map();

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // ดึงข้อมูลผู้ใช้
  public getUser(userId: string): LineUser | null {
    return this.users.get(userId) || null;
  }

  // สร้างผู้ใช้ใหม่
  public createUser(userId: string, additionalData?: Partial<LineUser>): LineUser {
    const user: LineUser = {
      userId,
      isRegistered: false,
      ...additionalData
    };

    this.users.set(userId, user);
    return user;
  }

  // อัปเดตข้อมูลผู้ใช้
  public updateUser(userId: string, updateData: Partial<LineUser>): LineUser | null {
    const existingUser = this.users.get(userId);
    if (!existingUser) {
      return null;
    }

    const updatedUser = {
      ...existingUser,
      ...updateData
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // ลงทะเบียนผู้ใช้
  public registerUser(userId: string, registrationData?: Partial<LineUser>): LineUser {
    const existingUser = this.users.get(userId);
    const user: LineUser = {
      userId,
      isRegistered: true,
      registeredAt: new Date(),
      ...existingUser,
      ...registrationData
    };

    this.users.set(userId, user);
    return user;
  }

  // ตรวจสอบว่าผู้ใช้ลงทะเบียนแล้วหรือไม่
  public isUserRegistered(userId: string): boolean {
    const user = this.users.get(userId);
    return user?.isRegistered || false;
  }

  // ดึงรายการผู้ใช้ทั้งหมด
  public getAllUsers(): LineUser[] {
    return Array.from(this.users.values());
  }

  // ดึงรายการผู้ใช้ที่ลงทะเบียนแล้ว
  public getRegisteredUsers(): LineUser[] {
    return Array.from(this.users.values()).filter(user => user.isRegistered);
  }

  // ดึงรายการผู้ใช้ที่ยังไม่ลงทะเบียน
  public getUnregisteredUsers(): LineUser[] {
    return Array.from(this.users.values()).filter(user => !user.isRegistered);
  }

  // ลบผู้ใช้
  public deleteUser(userId: string): boolean {
    return this.users.delete(userId);
  }

  // นับจำนวนผู้ใช้
  public getUserStats() {
    const allUsers = this.getAllUsers();
    const registeredUsers = allUsers.filter(user => user.isRegistered);
    const unregisteredUsers = allUsers.filter(user => !user.isRegistered);

    return {
      total: allUsers.length,
      registered: registeredUsers.length,
      unregistered: unregisteredUsers.length,
      registrationRate: allUsers.length > 0 ? (registeredUsers.length / allUsers.length) * 100 : 0
    };
  }

  // ค้นหาผู้ใช้
  public searchUsers(query: string): LineUser[] {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.users.values()).filter(user =>
      user.displayName?.toLowerCase().includes(lowercaseQuery) ||
      user.email?.toLowerCase().includes(lowercaseQuery) ||
      user.userId.toLowerCase().includes(lowercaseQuery)
    );
  }

  // ผู้ใช้ที่ลงทะเบียนล่าสุด
  public getRecentlyRegisteredUsers(limit: number = 10): LineUser[] {
    return Array.from(this.users.values())
      .filter(user => user.isRegistered && user.registeredAt)
      .sort((a, b) => {
        if (!a.registeredAt || !b.registeredAt) return 0;
        return b.registeredAt.getTime() - a.registeredAt.getTime();
      })
      .slice(0, limit);
  }

  // Export ข้อมูลผู้ใช้ (สำหรับ backup)
  public exportUsers(): string {
    const users = Array.from(this.users.entries()).map(([userId, user]) => ({
      ...user,
      registeredAt: user.registeredAt?.toISOString()
    }));
    
    return JSON.stringify(users, null, 2);
  }

  // Import ข้อมูลผู้ใช้ (สำหรับ restore)
  public importUsers(jsonData: string): boolean {
    try {
      const users = JSON.parse(jsonData);
      
      for (const userData of users) {
        const user: LineUser = {
          ...userData,
          registeredAt: userData.registeredAt ? new Date(userData.registeredAt) : undefined
        };
        this.users.set(user.userId, user);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing users:', error);
      return false;
    }
  }

  // Clear all users (ใช้สำหรับ testing)
  public clearAllUsers(): void {
    this.users.clear();
  }
}

export default UserService;