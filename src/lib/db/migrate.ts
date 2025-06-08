import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

// โหลดค่าจากไฟล์ .env.local
dotenv.config({ path: '.env.local' });

// รับค่า DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL ไม่ได้กำหนดในไฟล์ .env.local');
  process.exit(1);
}

// ทำความสะอาด URL (กำจัดการขึ้นบรรทัดใหม่หรือช่องว่างที่ไม่ต้องการ)
const cleanDatabaseUrl = databaseUrl.trim().replace(/[\r\n]+/g, '');

async function main() {
  console.log('🚀 เริ่มต้นการ migrate ฐานข้อมูล...');
  
  try {
    // สร้าง connection กับฐานข้อมูล
    const sql = neon(cleanDatabaseUrl);
    const db = drizzle(sql);
    
    // ทำการ migrate
    await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });
    
    console.log('✅ ทำการ migrate ฐานข้อมูลสำเร็จ');
    process.exit(0);
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาดในการ migrate:', error);
    process.exit(1);
  }
}

main(); 