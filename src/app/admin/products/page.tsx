"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Plus, Search } from "lucide-react"
import { toast } from "sonner"

// ข้อมูลตัวอย่างสินค้า
const sampleProducts = [
  {
    id: "1",
    name: "เครื่องวัดความดันโลหิตดิจิตอล Omron HEM-7120",
    price: 1990,
    category: "medical-equipment",
    stock: 50,
    inStock: true,
  },
  {
    id: "2",
    name: "เทอร์โมมิเตอร์วัดไข้ทางหน้าผากแบบอินฟราเรด",
    price: 1290,
    category: "medical-equipment",
    stock: 30,
    inStock: true,
  },
  {
    id: "3",
    name: "หน้ากาก N95 (แพ็ค 10 ชิ้น)",
    price: 350,
    category: "covid",
    stock: 100,
    inStock: true,
  },
  {
    id: "4",
    name: "พาราเซตามอล 500 มก. (100 เม็ด)",
    price: 120,
    category: "medication",
    stock: 200,
    inStock: true,
  },
  {
    id: "5",
    name: "อะม็อกซีซิลลิน 500 มก. (20 แคปซูล)",
    price: 180,
    category: "medication",
    stock: 150,
    inStock: true,
  },
]

export default function AdminProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState(sampleProducts)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // ตรวจสอบสิทธิ์การเข้าถึง
  useEffect(() => {
    if (status === "loading") return

    if (status === "unauthenticated" || session?.user?.role !== "admin") {
      toast.error("ไม่มีสิทธิ์เข้าถึง", {
        description: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
      })
      router.push("/web/auth/signin")
    } else {
      setIsLoading(false)
    }
  }, [status, session, router])

  // กรองสินค้าตามคำค้นหา
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // จัดการลบสินค้า
  const handleDeleteProduct = (productId: string) => {
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      setProducts(products.filter((product) => product.id !== productId))
      toast.success("ลบสินค้าสำเร็จ", {
        description: "สินค้าถูกลบออกจากระบบแล้ว",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">จัดการสินค้า</h1>
            <Button onClick={() => router.push("/admin/products/new")}>
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มสินค้าใหม่
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>ค้นหาและกรองสินค้า</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="ค้นหาตามชื่อสินค้า..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>รหัสสินค้า</TableHead>
                    <TableHead>ชื่อสินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="text-right">คงเหลือ</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-right">{product.price.toLocaleString()} บาท</TableCell>
                        <TableCell className="text-right">{product.stock}</TableCell>
                        <TableCell>
                          {product.inStock ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              มีสินค้า
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              สินค้าหมด
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        ไม่พบสินค้าที่ตรงกับการค้นหา
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
