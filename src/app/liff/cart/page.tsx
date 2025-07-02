import { CartComponent } from "@/components/cart-component"

export default function LiffCartPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">ตะกร้าสินค้า</h1>
        <p className="text-gray-600 text-sm">ตรวจสอบสินค้าที่เลือกไว้</p>
      </div>

      <CartComponent platform="liff" />
    </div>
  )
}
