"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus } from "lucide-react"

interface CartComponentProps {
  platform: "web" | "liff"
}

const mockCartItems = [
  {
    id: "1",
    name: "สมาร์ทโฟน XYZ",
    price: 15900,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "หูฟังไร้สาย ABC",
    price: 2990,
    quantity: 2,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function CartComponent({ platform }: CartComponentProps) {
  const [cartItems, setCartItems] = useState(mockCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">🛒</span>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">ตะกร้าสินค้าว่างเปล่า</h3>
        <p className="text-gray-600 mb-6">เพิ่มสินค้าลงในตะกร้าเพื่อเริ่มช้อปปิ้ง</p>
        <Button>เลือกซื้อสินค้า</Button>
      </div>
    )
  }

  if (platform === "web") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-green-600 font-bold">฿{item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 border-x">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>จำนวนสินค้า</span>
                  <span>{totalItems} ชิ้น</span>
                </div>
                <div className="flex justify-between">
                  <span>ราคารวม</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าจัดส่ง</span>
                  <span className="text-green-600">ฟรี</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวมทั้งสิ้น</span>
                  <span className="text-green-600">฿{totalPrice.toLocaleString()}</span>
                </div>
                <Button className="w-full" size="lg">
                  ดำเนินการสั่งซื้อ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // LIFF Layout
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {cartItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{item.name}</h3>
                  <p className="text-green-600 font-bold text-sm">฿{item.price.toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 py-1 text-sm border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="sticky bottom-4 bg-white shadow-lg">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>จำนวนสินค้า</span>
            <span>{totalItems} ชิ้น</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>ค่าจัดส่ง</span>
            <span className="text-green-600">ฟรี</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>ยอดรวมทั้งสิ้น</span>
            <span className="text-green-600">฿{totalPrice.toLocaleString()}</span>
          </div>
          <Button className="w-full">ดำเนินการสั่งซื้อ</Button>
        </CardContent>
      </Card>
    </div>
  )
}
