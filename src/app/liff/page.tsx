import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "หน้าหลัก - LINE LIFF",
  description: "แอปพลิเคชันสำหรับ LINE",
}

export default function LiffHomePage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ยินดีต้อนรับสู่ LINE LIFF</h1>
        <p className="text-gray-600 mb-6">แอปพลิเคชันสำหรับ LINE</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">สินค้าของเรา</CardTitle>
            <CardDescription className="text-sm">เลือกซื้อสินค้าคุณภาพดี</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/liff/products">
              <Button className="w-full">ดูสินค้าทั้งหมด</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">ตะกร้าสินค้า</CardTitle>
            <CardDescription className="text-sm">ตรวจสอบสินค้าที่เลือกไว้</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/liff/cart">
              <Button variant="outline" className="w-full bg-transparent">
                ไปที่ตะกร้า
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Platform: LINE LIFF</h2>
        <p className="text-gray-700 text-sm">คุณกำลังใช้งานผ่าน LINE LIFF</p>
      </div>
    </div>
  )
}

