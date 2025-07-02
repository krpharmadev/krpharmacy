import { ProductDetail } from "@/components/ProductDetail";

export default async function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params; // Await params

  if (!productId) {
    return <div className="text-red-500 text-center py-8">Product ID is required</div>;
  }

  return <ProductDetail productId={productId} isLiff={false} />;
}