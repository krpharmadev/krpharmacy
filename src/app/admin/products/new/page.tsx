"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import { toast } from "sonner"

export default function NewProductPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ข้อมูลสินค้า
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    inStock: true,
    requiresPrescription: false,
    image: "",
  })

  // จัดการการเปลี่ยนแปลงข้อมูล
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  // จัดการการเปลี่ยนแปลง select
  const handleSelectChange = (name: string, value: string) => {
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  // จัดการการเปลี่ยนแปลง switch
  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData((prev) => ({ ...prev, [name]: checked }))
  }

  // จัดการการส่งฟอร์ม
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // ตรวจสอบข้อมูล
    if (!productData.name || !productData.price || !productData.category || !productData.stock) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
      setIsSubmitting(false)
      return
    }

    // จำลองการส่งข้อมูลไปยังเซิร์ฟเวอร์
    setTimeout(() => {
      toast.success("เพิ่มสินค้าสำเร็จ", {
        description: "สินค้าถูกเพิ่มเข้าสู่ระบบแล้ว",
      })
      setIsSubmitting(false)
      router.push("/admin/products")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              กลับ
            </Button>
            <h1 className="text-2xl font-bold">เพิ่มสินค้าใหม่</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ข้อมูลสินค้า</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">ชื่อสินค้า</Label>
                      <Input
                        id="name"
                        name="name"
                        value={productData.name}
                        onChange={handleChange}
                        placeholder="ระบุชื่อสินค้า"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">รายละเอียดสินค้า</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={productData.description}
                        onChange={handleChange}
                        placeholder="ระบุรายละเอียดสินค้า"
                        rows={5}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">ราคา (บาท)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={productData.price}
                          onChange={handleChange}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="stock">จำนวนในคลัง</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          value={productData.stock}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">หมวดหมู่</Label>
                      <Select
                        value={productData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical-equipment">เครื่องมือทางการแพทย์</SelectItem>
                          <SelectItem value="medication">ยา</SelectItem>
                          <SelectItem value="supplements">อาหารเสริมและวิตามิน</SelectItem>
                          <SelectItem value="covid">อุปกรณ์ป้องกันโควิด</SelectItem>
                          <SelectItem value="personal-care">ผลิตภัณฑ์ดูแลส่วนบุคคล</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">URL รูปภาพ</Label>
                      <Input
                        id="image"
                        name="image"
                        value={productData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>ตั้งค่าสินค้า</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inStock" className="cursor-pointer">
                        มีสินค้าพร้อมจำหน่าย
                      </Label>
                      <Switch
                        id="inStock"
                        checked={productData.inStock}
                        onCheckedChange={(checked) => handleSwitchChange("inStock", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="requiresPrescription" className="cursor-pointer">
                        ต้องมีใบสั่งแพทย์
                      </Label>
                      <Switch
                        id="requiresPrescription"
                        checked={productData.requiresPrescription}
                        onCheckedChange={(checked) => handleSwitchChange("requiresPrescription", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-4">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "กำลังบันทึก..." : "บันทึกสินค้า"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
                    ยกเลิก
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
