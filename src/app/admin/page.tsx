"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  Settings,
  Save,
  RefreshCw,
  Copy,
  ExternalLink,
  Upload,
  ImageIcon,
  MousePointer,
  RotateCcw,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"

interface RichMenuArea {
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
  action: {
    type: "uri" | "postback" | "message"
    uri?: string
    data?: string
    text?: string
    displayText?: string
  }
}

interface RichMenu {
  richMenuId?: string
  size: {
    width: number
    height: number
  }
  selected: boolean
  name: string
  chatBarText: string
  areas: RichMenuArea[]
  imageUrl?: string
  imageFile?: File
}

const LIFF_IDS = {
  REGISTER: process.env.NEXT_PUBLIC_LIFF_ID_REGISTER!,
  PRODUCT: process.env.NEXT_PUBLIC_LIFF_ID_PRODUCT!,
  ORDER: process.env.NEXT_PUBLIC_LIFF_ID_ORDER!,
}

const RICH_MENU_TEMPLATES = [
  {
    name: "ลงทะเบียน",
    imageUrl: "/images/richmenu-register.png",
    areas: [
      {
        bounds: { x: 0, y: 300, width: 600, height: 200 },
        action: { type: "uri", uri: `https://liff.line.me/${LIFF_IDS.PRODUCT}` },
      },
      {
        bounds: { x: 900, y: 300, width: 400, height: 200 },
        action: { type: "uri", uri: `https://liff.line.me/${LIFF_IDS.REGISTER}` },
      },
    ],
  },
  {
    name: "สั่งซื้อยา",
    imageUrl: "/images/richmenu-product.png",
    areas: [
      {
        bounds: { x: 0, y: 300, width: 600, height: 200 },
        action: { type: "uri", uri: `https://liff.line.me/${LIFF_IDS.PRODUCT}` },
      },
      {
        bounds: { x: 900, y: 300, width: 400, height: 200 },
        action: { type: "uri", uri: `https://liff.line.me/${LIFF_IDS.ORDER}` },
      },
    ],
  },
]

export default function AdminPage() {
  const [richMenus, setRichMenus] = useState<RichMenu[]>([])
  const [currentMenu, setCurrentMenu] = useState<RichMenu>({
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "",
    chatBarText: "",
    areas: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("design")
  const [channelAccessToken, setChannelAccessToken] = useState("")
  const [selectedArea, setSelectedArea] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load saved data
  useEffect(() => {
    const savedToken = localStorage.getItem("lineChannelAccessToken")
    const savedMenus = localStorage.getItem("richMenus")

    if (savedToken) setChannelAccessToken(savedToken)
    if (savedMenus) setRichMenus(JSON.parse(savedMenus))
  }, [])

  // Save to localStorage
  const saveToStorage = () => {
    localStorage.setItem("lineChannelAccessToken", channelAccessToken)
    localStorage.setItem("richMenus", JSON.stringify(richMenus))
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          setCurrentMenu((prev) => ({
            ...prev,
            imageFile: file,
            imageUrl: e.target?.result as string,
            size: { width: img.width, height: img.height },
          }))
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  // Load template
  const loadTemplate = (template: (typeof RICH_MENU_TEMPLATES)[0]) => {
    setCurrentMenu({
      size: { width: 2500, height: 1686 },
      selected: false,
      name: `Rich Menu - ${template.name}`,
      chatBarText: "เมนู",
      areas: template.areas.map(area => ({
        ...area,
        action: {
          ...area.action,
          type: area.action.type as "uri" | "postback" | "message",
        },
      })),
      imageUrl: template.imageUrl,
    })
    setActiveTab("design")
  }

  // Create new Rich Menu
  const createNewMenu = () => {
    setCurrentMenu({
      size: { width: 2500, height: 1686 },
      selected: false,
      name: "Rich Menu ใหม่",
      chatBarText: "เมนู",
      areas: [],
    })
    setActiveTab("design")
  }

  // Handle canvas mouse events for drawing areas
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * currentMenu.size.width
    const y = ((e.clientY - rect.top) / rect.height) * currentMenu.size.height

    // Check if clicking on existing area
    const clickedAreaIndex = currentMenu.areas.findIndex(
      (area) =>
        x >= area.bounds.x &&
        x <= area.bounds.x + area.bounds.width &&
        y >= area.bounds.y &&
        y <= area.bounds.y + area.bounds.height,
    )

    if (clickedAreaIndex !== -1) {
      setSelectedArea(clickedAreaIndex)
      setIsDragging(true)
      setDragStart({
        x: x - currentMenu.areas[clickedAreaIndex].bounds.x,
        y: y - currentMenu.areas[clickedAreaIndex].bounds.y,
      })
    } else if (isDrawing) {
      // Start drawing new area
      const newArea: RichMenuArea = {
        bounds: { x, y, width: 0, height: 0 },
        action: { type: "uri", uri: `https://liff.line.me/${LIFF_IDS.PRODUCT}` },
      }
      setCurrentMenu((prev) => ({
        ...prev,
        areas: [...prev.areas, newArea],
      }))
      setSelectedArea(currentMenu.areas.length)
      setIsDragging(true)
      setDragStart({ x: 0, y: 0 })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !isDragging || selectedArea === null) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * currentMenu.size.width
    const y = ((e.clientY - rect.top) / rect.height) * currentMenu.size.height

    setCurrentMenu((prev) => ({
      ...prev,
      areas: prev.areas.map((area, index) => {
        if (index === selectedArea) {
          if (isDrawing && selectedArea === prev.areas.length - 1) {
            // Drawing new area
            return {
              ...area,
              bounds: {
                ...area.bounds,
                width: Math.max(50, x - area.bounds.x),
                height: Math.max(50, y - area.bounds.y),
              },
            }
          } else {
            // Moving existing area
            return {
              ...area,
              bounds: {
                ...area.bounds,
                x: Math.max(0, Math.min(x - dragStart.x, prev.size.width - area.bounds.width)),
                y: Math.max(0, Math.min(y - dragStart.y, prev.size.height - area.bounds.height)),
              },
            }
          }
        }
        return area
      }),
    }))
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setIsDrawing(false)
    setDragStart({ x: 0, y: 0 })
  }

  // Update area
  const updateArea = (index: number, field: string, value: any) => {
    setCurrentMenu((prev) => ({
      ...prev,
      areas: prev.areas.map((area, i) => (i === index ? { ...area, [field]: value } : area)),
    }))
  }

  // Remove area
  const removeArea = (index: number) => {
    setCurrentMenu((prev) => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index),
    }))
    setSelectedArea(null)
  }

  // Save current menu
  const saveCurrentMenu = () => {
    if (!currentMenu.name) {
      alert("กรุณากรอกชื่อ Rich Menu")
      return
    }

    const menuToSave = { ...currentMenu, richMenuId: Date.now().toString() }
    setRichMenus((prev) => [...prev, menuToSave])
    setCurrentMenu({
      size: { width: 2500, height: 1686 },
      selected: false,
      name: "",
      chatBarText: "",
      areas: [],
    })
    saveToStorage()
  }

  // Delete Rich Menu
  const deleteMenu = (richMenuId: string) => {
    setRichMenus((prev) => prev.filter((menu) => menu.richMenuId !== richMenuId))
    saveToStorage()
  }

  // Generate Rich Menu JSON for LINE API
  const generateRichMenuJSON = (menu: RichMenu) => {
    return {
      size: menu.size,
      selected: menu.selected,
      name: menu.name,
      chatBarText: menu.chatBarText,
      areas: menu.areas,
    }
  }

  // Simulate API call to create Rich Menu
  const createRichMenuAPI = async (menu: RichMenu) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Rich Menu สร้างสำเร็จ! (Simulation)")
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการสร้าง Rich Menu")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rich Menu Designer</h1>
            <p className="text-gray-600 mt-1">สร้างและจัดการ Rich Menu พร้อม Visual Editor</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={createNewMenu} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              สร้างใหม่
            </Button>
            <Button onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              อัพโหลดรูป
            </Button>
          </div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

        {/* Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Rich Menu Templates
            </CardTitle>
            <CardDescription>เลือกเทมเพลตสำเร็จรูป</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {RICH_MENU_TEMPLATES.map((template, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => loadTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-[2500/1686] relative mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={template.imageUrl || "/placeholder.svg"}
                        alt={template.name}
                        fill
                        className="object-cover"
                      />
                      {/* Show template areas */}
                      {template.areas.map((area, areaIndex) => (
                        <div
                          key={areaIndex}
                          className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                          style={{
                            left: `${(area.bounds.x / 2500) * 100}%`,
                            top: `${(area.bounds.y / 1686) * 100}%`,
                            width: `${(area.bounds.width / 2500) * 100}%`,
                            height: `${(area.bounds.height / 1686) * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.areas.length} ปุ่ม</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              การตั้งค่า
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channelAccessToken">Channel Access Token</Label>
              <Input
                id="channelAccessToken"
                type="password"
                value={channelAccessToken}
                onChange={(e) => setChannelAccessToken(e.target.value)}
                placeholder="กรอก Channel Access Token"
              />
            </div>
            <Button onClick={saveToStorage} variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              บันทึกการตั้งค่า
            </Button>
          </CardContent>
        </Card>

        {/* Rich Menu Designer */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Rich Menu Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="design">ออกแบบ</TabsTrigger>
                <TabsTrigger value="visual">Visual Editor</TabsTrigger>
                <TabsTrigger value="preview">ตัวอย่าง</TabsTrigger>
                <TabsTrigger value="code">JSON Code</TabsTrigger>
              </TabsList>

              <TabsContent value="design" className="space-y-6">
                {/* Basic Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="menuName">ชื่อ Rich Menu</Label>
                    <Input
                      id="menuName"
                      value={currentMenu.name}
                      onChange={(e) => setCurrentMenu((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="กรอกชื่อ Rich Menu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chatBarText">ข้อความแสดงในแชท</Label>
                    <Input
                      id="chatBarText"
                      value={currentMenu.chatBarText}
                      onChange={(e) => setCurrentMenu((prev) => ({ ...prev, chatBarText: e.target.value }))}
                      placeholder="เช่น เมนู, Menu"
                    />
                  </div>
                </div>

                {/* Image Info */}
                {currentMenu.imageUrl && (
                  <div className="space-y-2">
                    <Label>รูปภาพ Rich Menu</Label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20 h-12 relative bg-white rounded border overflow-hidden">
                        <Image
                          src={currentMenu.imageUrl || "/placeholder.svg"}
                          alt="Rich Menu"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          ขนาด: {currentMenu.size.width} x {currentMenu.size.height} px
                        </p>
                        <p className="text-sm text-gray-600">พื้นที่ปุ่ม: {currentMenu.areas.length} ปุ่ม</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button onClick={saveCurrentMenu} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    บันทึก Rich Menu
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="visual" className="space-y-6">
                <div className="space-y-4">
                  {/* Tools */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Switch checked={isDrawing} onCheckedChange={setIsDrawing} id="drawing-mode" />
                      <Label htmlFor="drawing-mode" className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4" />
                        โหมดวาดปุ่ม
                      </Label>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentMenu((prev) => ({ ...prev, areas: [] }))
                        setSelectedArea(null)
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      ล้างปุ่มทั้งหมด
                    </Button>
                    {selectedArea !== null && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeArea(selectedArea)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        ลบปุ่มที่เลือก
                      </Button>
                    )}
                  </div>

                  {/* Visual Editor */}
                  {currentMenu.imageUrl ? (
                    <div className="space-y-4">
                      <div
                        ref={canvasRef}
                        className="relative mx-auto border-2 border-gray-300 rounded-lg overflow-hidden cursor-crosshair"
                        style={{
                          maxWidth: "800px",
                          aspectRatio: `${currentMenu.size.width}/${currentMenu.size.height}`,
                        }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseUp}
                      >
                        <Image
                          src={currentMenu.imageUrl || "/placeholder.svg"}
                          alt="Rich Menu"
                          fill
                          className="object-contain"
                          draggable={false}
                        />

                        {/* Render areas */}
                        {currentMenu.areas.map((area, index) => (
                          <div
                            key={index}
                            className={`absolute border-2 ${
                              selectedArea === index ? "border-blue-500 bg-blue-500" : "border-red-500 bg-red-500"
                            } bg-opacity-20 flex items-center justify-center text-white font-bold text-sm cursor-move`}
                            style={{
                              left: `${(area.bounds.x / currentMenu.size.width) * 100}%`,
                              top: `${(area.bounds.y / currentMenu.size.height) * 100}%`,
                              width: `${(area.bounds.width / currentMenu.size.width) * 100}%`,
                              height: `${(area.bounds.height / currentMenu.size.height) * 100}%`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedArea(index)
                            }}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>

                      <Alert>
                        <MousePointer className="h-4 w-4" />
                        <AlertDescription>
                          {isDrawing ? "คลิกและลากเพื่อวาดพื้นที่ปุ่มใหม่" : "คลิกที่ปุ่มเพื่อเลือก หรือลากเพื่อย้ายตำแหน่ง"}
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">กรุณาอัพโหลดรูปภาพ Rich Menu ก่อน</p>
                      <Button onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        อัพโหลดรูป
                      </Button>
                    </div>
                  )}

                  {/* Area Properties */}
                  {selectedArea !== null && currentMenu.areas[selectedArea] && (
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader>
                        <CardTitle className="text-base">ปุ่มที่ {selectedArea + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Position & Size */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">X</Label>
                            <Input
                              type="number"
                              value={Math.round(currentMenu.areas[selectedArea].bounds.x)}
                              onChange={(e) =>
                                updateArea(selectedArea, "bounds", {
                                  ...currentMenu.areas[selectedArea].bounds,
                                  x: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Y</Label>
                            <Input
                              type="number"
                              value={Math.round(currentMenu.areas[selectedArea].bounds.y)}
                              onChange={(e) =>
                                updateArea(selectedArea, "bounds", {
                                  ...currentMenu.areas[selectedArea].bounds,
                                  y: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Width</Label>
                            <Input
                              type="number"
                              value={Math.round(currentMenu.areas[selectedArea].bounds.width)}
                              onChange={(e) =>
                                updateArea(selectedArea, "bounds", {
                                  ...currentMenu.areas[selectedArea].bounds,
                                  width: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Height</Label>
                            <Input
                              type="number"
                              value={Math.round(currentMenu.areas[selectedArea].bounds.height)}
                              onChange={(e) =>
                                updateArea(selectedArea, "bounds", {
                                  ...currentMenu.areas[selectedArea].bounds,
                                  height: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Action Settings */}
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>ประเภท Action</Label>
                            <Select
                              value={currentMenu.areas[selectedArea].action.type}
                              onValueChange={(value) =>
                                updateArea(selectedArea, "action", {
                                  ...currentMenu.areas[selectedArea].action,
                                  type: value,
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="uri">URI (เปิดลิงก์)</SelectItem>
                                <SelectItem value="postback">Postback</SelectItem>
                                <SelectItem value="message">Message</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {currentMenu.areas[selectedArea].action.type === "uri" && (
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={currentMenu.areas[selectedArea].action.uri || ""}
                                  onChange={(e) =>
                                    updateArea(selectedArea, "action", {
                                      ...currentMenu.areas[selectedArea].action,
                                      uri: e.target.value,
                                    })
                                  }
                                  placeholder="https://liff.line.me/..."
                                />
                                <Select
                                  onValueChange={(value) =>
                                    updateArea(selectedArea, "action", {
                                      ...currentMenu.areas[selectedArea].action,
                                      uri: `https://liff.line.me/${value}`,
                                    })
                                  }
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="LIFF ID" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={LIFF_IDS.REGISTER}>REGISTER</SelectItem>
                                    <SelectItem value={LIFF_IDS.PRODUCT}>PRODUCT</SelectItem>
                                    <SelectItem value={LIFF_IDS.ORDER}>ORDER</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">ตัวอย่าง Rich Menu</h3>
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-100 border rounded-lg overflow-hidden">
                      <div
                        className="relative bg-white border-b"
                        style={{
                          aspectRatio: `${currentMenu.size.width}/${currentMenu.size.height}`,
                          minHeight: "200px",
                        }}
                      >
                        {currentMenu.imageUrl ? (
                          <Image
                            src={currentMenu.imageUrl || "/placeholder.svg"}
                            alt="Rich Menu Preview"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500">ไม่มีรูปภาพ</p>
                          </div>
                        )}

                        {currentMenu.areas.map((area, index) => (
                          <div
                            key={index}
                            className="absolute border-2 border-blue-500 bg-blue-50 bg-opacity-50 flex items-center justify-center text-xs font-medium text-blue-700"
                            style={{
                              left: `${(area.bounds.x / currentMenu.size.width) * 100}%`,
                              top: `${(area.bounds.y / currentMenu.size.height) * 100}%`,
                              width: `${(area.bounds.width / currentMenu.size.width) * 100}%`,
                              height: `${(area.bounds.height / currentMenu.size.height) * 100}%`,
                            }}
                          >
                            ปุ่ม {index + 1}
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-50 p-2 text-center text-sm text-gray-600">
                        {currentMenu.chatBarText || "เมนู"}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">JSON Code สำหรับ LINE API</h3>
                  <Textarea
                    value={JSON.stringify(generateRichMenuJSON(currentMenu), null, 2)}
                    readOnly
                    className="font-mono text-sm min-h-[300px]"
                  />
                  <Button
                    onClick={() =>
                      navigator.clipboard.writeText(JSON.stringify(generateRichMenuJSON(currentMenu), null, 2))
                    }
                    variant="outline"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    คัดลอก JSON
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Saved Rich Menus */}
        <Card>
          <CardHeader>
            <CardTitle>Rich Menus ที่บันทึกไว้</CardTitle>
            <CardDescription>จัดการ Rich Menu ที่สร้างไว้</CardDescription>
          </CardHeader>
          <CardContent>
            {richMenus.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>ยังไม่มี Rich Menu ที่บันทึกไว้</p>
              </div>
            ) : (
              <div className="space-y-4">
                {richMenus.map((menu) => (
                  <Card key={menu.richMenuId} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {menu.imageUrl && (
                            <div className="w-16 h-10 relative bg-gray-100 rounded border overflow-hidden">
                              <Image
                                src={menu.imageUrl || "/placeholder.svg"}
                                alt={menu.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="space-y-1">
                            <h4 className="font-semibold">{menu.name}</h4>
                            <p className="text-sm text-gray-600">
                              ขนาด: {menu.size.width}x{menu.size.height} | ปุ่ม: {menu.areas.length} | แชทบาร์:{" "}
                              {menu.chatBarText}
                            </p>
                            <div className="flex gap-2">
                              {menu.selected && <Badge variant="default">Active</Badge>}
                              <Badge variant="outline">ID: {menu.richMenuId}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setCurrentMenu(menu)} variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => createRichMenuAPI(menu)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <ExternalLink className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => deleteMenu(menu.richMenuId!)}
                            variant="outline"
                            size="sm"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
