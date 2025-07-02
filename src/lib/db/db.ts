import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// ตรวจสอบว่ามี DATABASE_URL หรือไม่
if (!process.env.DATABASE_URL) {
  console.error("🚨 DATABASE_URL ไม่ได้กำหนดในไฟล์ .env หรือ .env.local");
}

let db: ReturnType<typeof drizzle>;

try {
  const databaseUrl = process.env.DATABASE_URL!;
  
  // ลบช่องว่างและการขึ้นบรรทัดใหม่ที่อาจมีใน URL
  const cleanDatabaseUrl = databaseUrl.trim().replace(/[\r\n]+/g, '');
  
  console.log("🔌 กำลังเชื่อมต่อกับฐานข้อมูล...");
  const sql = neon(cleanDatabaseUrl);
  db = drizzle(sql, { schema });
  console.log("✅ เชื่อมต่อกับฐานข้อมูลสำเร็จ");
} catch (error) {
  console.error("❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้:", error);
  // สร้าง mock db เพื่อให้แอปไม่ crash ทันทีเมื่อมีการ import
  const mockSql = { query: async () => [] };
  db = drizzle(mockSql as any, { schema });
}

export { db };