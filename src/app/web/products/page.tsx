import { Suspense } from "react";
import { ProductsContent } from "@/components/ProductsContent";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default async function ProductsPage({ searchParams }: { searchParams: { category?: string; subcategory?: string } }) {
  const params = await searchParams;
  const { category, subcategory } = params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductsContent categoryId={category} subcategoryId={subcategory} isLiff={false} />
    </Suspense>
  );
}