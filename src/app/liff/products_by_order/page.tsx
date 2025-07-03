"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Search, Filter, ShoppingCart, Info, AlertTriangle, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { OrderHistory } from "@/components/order-history"
import { fetchProfessionalMedications } from "@/sanity/lib/medications"

export default function ProductsByOrderPage() {
  const [medications, setMedications] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isShowModal, setIsShowModal] = useState(false)
  const [selectedMed, setSelectedMed] = useState<string | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [sortOption, setSortOption] = useState("popular")
  const [prescriptionOnly, setPrescriptionOnly] = useState(false)
  const [professionalOnly, setProfessionalOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({})

  // ATC code list ตามภาพตัวอย่าง
  const atcList = ["A", "B", "C", "D", "J", "N", "R"];

  useEffect(() => {
    fetchProfessionalMedications().then(setMedications)
  }, [])

  // กรองยาตามเงื่อนไข
  const filteredMedications = useMemo(() => {
    let result = [...medications]
    if (selectedCategory) {
      result = result.filter((med) => med.drugDetails?.atcCode === selectedCategory)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (med) => med.name.toLowerCase().includes(query) || (med.description?.toLowerCase().includes(query))
      )
    }
    result = result.filter((med) => med.price >= priceRange[0] && med.price <= priceRange[1])
    if (prescriptionOnly) {
      result = result.filter((med) => med.requiresPrescription)
    }
    if (professionalOnly) {
      result = result.filter((med) => med.professionalOnly)
    }
    if (inStockOnly) {
      result = result.filter((med) => med.stock > 0)
    }
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "popular":
      default:
        result.sort((a, b) => Number(b.popularForProfessionals) - Number(a.popularForProfessionals))
        break
    }
    return result
  }, [medications, selectedCategory, searchQuery, priceRange, prescriptionOnly, professionalOnly, inStockOnly, sortOption])

  // จัดการเพิ่ม/ลดจำนวนในตะกร้า
  const handleAddToCart = (medId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev }
      if (newItems[medId]) {
        newItems[medId]++
      } else {
        newItems[medId] = 1
      }
      return newItems
    })
  }

  const handleRemoveFromCart = (medId: string) => {
    setCartItems((prev) => {
      const newItems = { ...prev }
      if (newItems[medId] > 1) {
        newItems[medId]--
      } else {
        delete newItems[medId]
      }
      return newItems
    })
  }

  const handleShowMedInfo = (medId: string) => {
    setSelectedMed(medId)
    setIsShowModal(true)
  }

  const selectedMedInfo = useMemo(() => {
    if (!selectedMed) return null
    return medications.find((med) => med._id === selectedMed)
  }, [selectedMed, medications])

  const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0)
  const totalCartValue = Object.entries(cartItems).reduce((sum, [id, qty]) => {
    const med = medications.find((m) => m._id === id)
    return sum + (med?.price || 0) * qty
  }, 0)

  // --- ดึง atcCode ทั้งหมดแบบ dynamic ---
  const atcCodes = useMemo(() => {
    // ดึงเฉพาะตัวอักษรตัวแรกของ atcCode (A, B, C, ...)
    const codes = medications
      .map((med) => med.drugDetails?.atcCode?.[0])
      .filter(Boolean);
    // ไม่ซ้ำกันและเรียงลำดับ
    return Array.from(new Set(codes)).sort();
  }, [medications]);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 px-2 sm:px-4">
        {/* Hero Banner */}
        <div className="bg-primary/10 py-6 sm:py-8">
          <div className="container mx-auto px-0 sm:px-4">
            <div className="max-w-full sm:max-w-3xl">
              <h1 className="text-xl sm:text-3xl font-bold mb-2">การสั่งซื้อสำหรับบุคลากรทางการแพทย์</h1>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                เลือกยาและเวชภัณฑ์คุณภาพสูงในราคาพิเศษสำหรับโรงพยาบาล คลินิก และบุคลากรทางการแพทย์โดยเฉพาะ
              </p>
              <Button asChild className="mt-2 w-full sm:w-auto">
                <Link href="/orders/new">ลงทะเบียนเพื่อรับสิทธิพิเศษ</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-0 sm:px-4 py-4 sm:py-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="mb-4 sm:mb-8 flex flex-wrap gap-2">
              <TabsTrigger value="products">รายการยา</TabsTrigger>
              <TabsTrigger value="history">ประวัติการสั่งซื้อ</TabsTrigger>
            </TabsList>
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="font-bold text-lg sm:text-2xl">สั่งซื้อทั้งหมด</div>
              <div className="relative w-full sm:w-80">
                <Input
                  type="text"
                  placeholder="ค้นหาชื่อหรือรหัสยา..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            {/* แท็บรายการสินค้า */}
            <TabsContent value="products">
              <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-1/4 order-2 lg:order-1 mb-4 lg:mb-0">
                  <div className="sticky top-4 space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">ตัวกรอง</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null)
                          setPrescriptionOnly(false)
                          setProfessionalOnly(false)
                          setInStockOnly(false)
                          setPriceRange([0, 2000])
                        }}
                      >
                        ล้างทั้งหมด
                      </Button>
                    </div>
                    <div>
                      <div className="font-medium mb-2">หมวดหมู่ยาแยกตามระบบ ATC</div>
                      <div className="flex flex-col gap-1">
                        {atcCodes.length === 0 ? (
                          <span className="text-gray-400 text-sm">ไม่มีข้อมูล ATC</span>
                        ) : (
                          atcCodes.map((code) => (
                            <button
                              key={code}
                              onClick={() => setSelectedCategory(selectedCategory === code ? null : code)}
                              className={`flex items-center gap-2 px-2 py-1 rounded transition-all text-left ${selectedCategory === code ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"}`}
                            >
                              <span className="w-6 h-6 flex items-center justify-center rounded border border-primary font-bold text-lg">{code}</span>
                              <span>ระบบ{code}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                    <Accordion type="single" collapsible defaultValue="type">
                      <AccordionItem value="type">
                        <AccordionTrigger>ประเภทยา</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="prescription"
                                checked={prescriptionOnly}
                                onCheckedChange={(checked) => setPrescriptionOnly(!!checked)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label htmlFor="prescription" className="text-sm font-medium leading-none">ยาควบคุมพิเศษ</label>
                                <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่ต้องมีใบสั่งยา</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="professional"
                                checked={professionalOnly}
                                onCheckedChange={(checked) => setProfessionalOnly(!!checked)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label htmlFor="professional" className="text-sm font-medium leading-none">เฉพาะบุคลากรทางการแพทย์</label>
                                <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่จำหน่ายให้บุคลากรทางการแพทย์</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Checkbox
                                id="instock"
                                checked={inStockOnly}
                                onCheckedChange={(checked) => setInStockOnly(!!checked)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label htmlFor="instock" className="text-sm font-medium leading-none">มีสินค้าพร้อมจำหน่าย</label>
                                <p className="text-sm text-muted-foreground">แสดงเฉพาะยาที่มีในสต็อก</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="price">
                        <AccordionTrigger>ช่วงราคา</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="min-price" className="text-sm">ต่ำสุด (฿)</label>
                                <Input
                                  id="min-price"
                                  type="number"
                                  min="0"
                                  value={priceRange[0]}
                                  onChange={(e) => setPriceRange([Number.parseInt(e.target.value) || 0, priceRange[1]])}
                                  className="mt-1"
                                />
                              </div>
                              <div>
                                <label htmlFor="max-price" className="text-sm">สูงสุด (฿)</label>
                                <Input
                                  id="max-price"
                                  type="number"
                                  min="0"
                                  value={priceRange[1]}
                                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value) || 2000])}
                                  className="mt-1"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" className="text-xs" onClick={() => setPriceRange([0, 500])}>ไม่เกิน 500฿</Button>
                              <Button variant="outline" size="sm" className="text-xs" onClick={() => setPriceRange([500, 1000])}>500฿ - 1,000฿</Button>
                              <Button variant="outline" size="sm" className="text-xs" onClick={() => setPriceRange([1000, 2000])}>มากกว่า 1,000฿</Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    {/* ตะกร้า */}
                    {totalCartItems > 0 && (
                      <div className="border rounded-lg p-4 bg-muted/30 space-y-3 mt-6">
                        <h3 className="font-semibold">รายการที่เลือก</h3>
                        <div className="space-y-2">
                          {Object.entries(cartItems).map(([id, qty]) => {
                            const med = medications.find((m) => m._id === id)
                            if (!med) return null
                            return (
                              <div key={id} className="flex justify-between items-center text-sm">
                                <span className="line-clamp-1 flex-1">{med.name}</span>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleRemoveFromCart(id)}><Minus className="h-3 w-3" /></Button>
                                  <span className="w-6 text-center">{qty}</span>
                                  <Button variant="outline" size="icon" className="h-6 w-6 rounded-full" onClick={() => handleAddToCart(id)}><Plus className="h-3 w-3" /></Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-sm">
                          <span>รวมทั้งสิ้น:</span>
                          <span className="font-bold">{totalCartValue.toLocaleString()} บาท</span>
                        </div>
                        <Button className="w-full" asChild>
                          <Link href="/checkout">ดำเนินการสั่งซื้อ ({totalCartItems} รายการ)</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </aside>
                {/* Product Grid */}
                <section className="flex-1 order-1 lg:order-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredMedications.map((med) => (
                      <Card key={med._id} className="flex flex-col h-full p-3">
                        <div className="relative w-full h-32 mb-2 flex items-center justify-center bg-gray-50 rounded">
                          <Image src={med.image || '/placeholder.svg'} alt={med.name} width={120} height={120} className="object-contain h-full w-auto" />
                          {med.discount && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{med.discount}%</Badge>
                          )}
                          {med.professionalOnly && (
                            <Badge className="absolute top-2 right-2 bg-black text-white">เฉพาะบุคลากร</Badge>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="font-semibold text-base line-clamp-2">{med.name}</div>
                          <div className="text-xs text-muted-foreground">{med.strength} {med.form} | {med.unitsPerPackage} หน่วย/กล่อง</div>
                          {med.requiresPrescription && (
                            <div className="flex items-center gap-1 text-xs text-orange-600 mt-1">
                              <AlertTriangle className="w-4 h-4" /> ต้องใช้ใบสั่งแพทย์
                            </div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-bold text-lg text-primary">{med.price?.toLocaleString()} บาท</span>
                            {med.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through">{med.originalPrice?.toLocaleString()} บาท</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{med.stock > 0 ? `${med.stock} ชิ้นในสต็อก` : 'หมดสต็อก'}</div>
                        </div>
                        <Button
                          size="sm"
                          className="mt-2 w-full"
                          disabled={med.stock === 0}
                          onClick={() => handleAddToCart(med._id)}
                        >
                          เพิ่มลงรายการ
                        </Button>
                      </Card>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>
            {/* แท็บประวัติการสั่งซื้อ */}
            <TabsContent value="history">
              <div className="max-w-5xl mx-auto">
                <OrderHistory />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      {/* Modal แสดงข้อมูลยา */}
      <Dialog open={isShowModal} onOpenChange={setIsShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>ข้อมูลยา</DialogTitle>
            <DialogDescription>รายละเอียดเพิ่มเติมเกี่ยวกับยาและการใช้งาน</DialogDescription>
          </DialogHeader>
          {selectedMedInfo && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/3 relative aspect-square bg-muted/30">
                  <Image
                    src={selectedMedInfo.image || "/placeholder.svg"}
                    alt={selectedMedInfo.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h3 className="font-semibold">{selectedMedInfo.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">{selectedMedInfo.description}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="text-muted-foreground">รหัส ATC:</div>
                    <div>{selectedMedInfo.atcCode}</div>
                    <div className="text-muted-foreground">หมวดหมู่ย่อย:</div>
                    <div>{selectedMedInfo.subCode}</div>
                    <div className="text-muted-foreground">ความแรง:</div>
                    <div>{selectedMedInfo.strength}</div>
                    <div className="text-muted-foreground">รูปแบบ:</div>
                    <div>{selectedMedInfo.form}</div>
                    <div className="text-muted-foreground">ขนาดบรรจุ:</div>
                    <div>
                      {selectedMedInfo.unitsPerPackage} {selectedMedInfo.form}/กล่อง
                    </div>
                    <div className="text-muted-foreground">ต้องมีใบสั่งยา:</div>
                    <div>{selectedMedInfo.requiresPrescription ? "ใช่" : "ไม่ใช่"}</div>
                    <div className="text-muted-foreground">ผู้ผลิต:</div>
                    <div>{selectedMedInfo.manufacturer}</div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-primary text-xl">{selectedMedInfo.price.toFixed(2)} บาท</span>
                  {selectedMedInfo.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {selectedMedInfo.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">สั่งขั้นต่ำ {selectedMedInfo.minOrderQuantity} ชิ้น</span>
              </div>
              <DialogFooter className="flex-row gap-2 sm:gap-0">
                <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setIsShowModal(false)}>
                  ปิด
                </Button>
                {selectedMedInfo.stock > 0 && (
                  <Button
                    className="flex-1 sm:flex-none"
                    onClick={() => {
                      handleAddToCart(selectedMedInfo._id)
                      setIsShowModal(false)
                    }}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    เพิ่มลงรายการ
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
