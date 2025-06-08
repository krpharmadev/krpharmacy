// app/categories/page.tsx
import { redirect } from "next/navigation";

export default function CategoriesPage() {
  // Middleware จะ rewrite ไปยัง /liff/categories หรือ /web/categories
  // ถ้า middleware ไม่ทำงาน ให้ redirect ไป /web/categories เป็น fallback
  redirect("/web/categories");
}