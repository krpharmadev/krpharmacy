import { db } from '@/lib/db/db';
import { users } from '@/lib/db/schema';

export async function createUser(name: string, email: string, line_user_id: string, role: 'medical_personnel' | 'pharmacist' | 'customer' | 'admin' | 'sales_staff' | 'inventory_staff' = 'customer') {
  const [user] = await db.insert(users).values({ name, email, lineId: line_user_id, role }).returning();
  return user;
}
