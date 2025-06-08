"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePlatform } from "@/components/platform-detector"
import { useRouter } from "next/navigation"
import Image from "next/image"

type Product = {
  id: string;
  name: string;
  price: number;
}

type ProductListProps = {
  isLiff?: boolean
}

export function ProductList({ isLiff }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([])
  const { platform } = usePlatform()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // ตรวจสอบว่าเป็น client-side หรือไม่
  useEffect(() => {
    setIsClient(true)
  }, [])

  // โหลดข้อมูลสินค้า
  useEffect(() => {
    if (isClient) {
      // ในตัวอย่างนี้เราใช้ข้อมูลจำลอง
      setProducts([
        { id: "1", name: "Product 1", price: 100 },
        { id: "2", name: "Product 2", price: 200 },
        { id: "3", name: "Product 3", price: 300 },
      ])
    }
  }, [isClient])

  // ตรวจสอบว่าเป็น LIFF หรือไม่
  const isLiffPlatform = isLiff || platform === "liff"

  const handleProductClick = (productId: string) => {
    if (isLiffPlatform) {
      // ถ้าเป็น LIFF ให้ใช้ LIFF Navigation
      router.push(`/liff/products/${productId}`)
    } else {
      // ถ้าไม่ใช่ LIFF ให้ใช้ Next.js Router
      router.push(`/web/products/${productId}`)
    }
  }

  if (!isClient) {
    return <div className="text-center py-8">กำลังโหลด...</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted/30 p-4">
              <Image
                src="/placeholder.svg?height=200&width=200"
                alt={product.name}
                width={200}
                height={200}
                className="object-contain mx-auto"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-2">{product.name}</h3>
              <p className="text-lg font-bold text-primary mb-3">{product.price} บาท</p>
              <Button className="w-full" onClick={() => handleProductClick(product.id)}>
                ดูรายละเอียด
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
