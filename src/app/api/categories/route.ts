import { NextResponse } from "next/server";
import { categories, CategoryType } from "@/lib/data/categories";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classification = searchParams.get("classification"); // ATC หรือ General

    let filteredCategories: CategoryType[] = categories;

    // กรองเฉพาะหมวดหมู่ "ยา" ถ้ามีการระบุ classification
    if (classification === "ATC" || classification === "General") {
      filteredCategories = categories.map((category) => {
        if (category.id === "1" && category.subcategories) {
          // กรองหมวดหมู่ย่อยของ "ยา" ตาม classification
          return {
            ...category,
            subcategories: category.subcategories.filter(
              (sub) => sub.classification === classification
            ),
          };
        }
        return category;
      });
    }

    if (!filteredCategories || filteredCategories.length === 0) {
      return NextResponse.json({ error: "No categories found" }, { status: 404 });
    }

    return NextResponse.json(filteredCategories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}