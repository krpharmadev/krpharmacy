import { Suspense } from "react";
import { CategoriesPageClient } from "./CategoriesPageClient";

export default function CategoriesPage() {
  return (
    <Suspense>
      <CategoriesPageClient />
    </Suspense>
  );
} 