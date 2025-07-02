import { ProductList } from "@/components/product-list"

export default function LiffProductsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">สินค้าทั้งหมด</h1>
        <p className="text-gray-600 text-sm">เลือกซื้อสินค้าคุณภาพดี</p>
      </div>

      <ProductList platform="liff" />
    </div>
  )
}

