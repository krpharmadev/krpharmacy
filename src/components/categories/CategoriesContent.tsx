"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { categories } from "@/lib/data/categories";
import { UserRole } from "@/lib/auth";

export function CategoriesContent() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "customer";
  const isProfessionalApproved = session?.user?.isProfessionalApproved || false;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const canViewATC = ["admin"].includes(userRole) || 
    (["medical_personnel", "pharmacist"].includes(userRole) && isProfessionalApproved);

  // กรองหมวดหมู่ตาม role
  const accessibleCategories = categories.filter((category) => {
    if (category.id === "ATC" && !canViewATC) return false;
    if (category.id === "General" && userRole !== "customer" && !canViewATC) return false;
    return true;
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    console.log("[Category Click] Selected:", categoryId);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">หมวดหมู่สินค้า</h1>
      <div className="mb-6">
        {accessibleCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`p-2 mr-2 mb-2 border rounded ${
              selectedCategory === category.id ? "bg-blue-100" : ""
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
      {selectedCategory && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {accessibleCategories
            .find((c) => c.id === selectedCategory)
            ?.subcategories?.map((sub) => (
              <Link
                href={`/products?category=${selectedCategory}&subcategory=${sub.id}`}
                key={sub.id}
                className="p-2 border rounded-md hover:bg-blue-100"
                onClick={() => console.log("[Subcategory Link] Clicked:", { id: sub.id, name: sub.name })}
              >
                {sub.name}
              </Link>
            )) || <p className="text-gray-500">ไม่มีหมวดหมู่ย่อย</p>}
        </div>
      )}
    </div>
  );
}