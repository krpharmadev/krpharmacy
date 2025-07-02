import { ProductDetail } from "@/components/product-detail"

export default function LiffProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div>
      <ProductDetail productId={params.id} platform="liff" />
    </div>
  )
}
