import { Suspense } from "react";
import { CategoriesContent } from "@/components/categories/CategoriesContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { categories } from "@/lib/data/categories";

async function fetchCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      cache: "no-store",
    });
    return res.ok ? await res.json() : categories;
  } catch {
    return categories;
  }
}

export default async function WebCategories() {
  const initialCategories = await fetchCategories();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">หมวดหมู่สินค้า</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <CategoriesContent initialCategories={initialCategories} isLiff={false} />
      </Suspense>
    </div>
  );
}