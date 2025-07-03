'use client'

import { OrderForm } from "@/components/forms/order-form"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NewOrderPage() {
  const router = useRouter()

  // ตรวจสอบสถานะการลงทะเบียน (ตัวอย่างใช้ localStorage)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const registered = localStorage.getItem("liff_registered")
      if (registered === "true") {
        router.replace("/liff/products_by_order")
      }
    }
  }, [router])

  // เมื่อ OrderForm สำเร็จ ให้ redirect และบันทึกสถานะ
  const handleSuccess = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("liff_registered", "true")
    }
    router.replace("/liff/products_by_order")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
          <div className="max-w-full sm:max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">ลงทะเบียนเพื่อสั่งซื้อยา</h1>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">กรุณากรอกข้อมูลบุคลากรทางการแพทย์เพื่อรับสิทธิพิเศษและสั่งซื้อยา</p>
            <OrderForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
    </div>
  )
}