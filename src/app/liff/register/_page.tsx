"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, UserPlus, Stethoscope, Pill, CheckCircle, Package, FileText } from "lucide-react"
import Link from "next/link"

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "doctor" | "pharmacist" | ""
  licenseNumber: string
  hospital: string
  department: string
  specialization: string
  experience: string
  address: string
  acceptTerms: boolean
}

export default function LiffRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    licenseNumber: "",
    hospital: "",
    department: "",
    specialization: "",
    experience: "",
    address: "",
    acceptTerms: false,
  })

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})

  // ตรวจสอบสถานะการลงทะเบียน
  useEffect(() => {
    async function checkRegistration() {
      const res = await fetch('/api/register-professional', { method: 'GET' })
      if (res.ok) {
        const data = await res.json()
        if (data.isRegistered) setIsRegistered(true)
      }
    }
    checkRegistration()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "กรุณากรอกชื่อ"
    if (!formData.lastName.trim()) newErrors.lastName = "กรุณากรอกนามสกุล"
    if (!formData.email.trim()) newErrors.email = "กรุณากรอกอีเมล"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง"
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์"
    else if (!/^[0-9]{10}$/.test(formData.phone.replace(/-/g, ""))) newErrors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง"
    if (!formData.role) newErrors.role = "กรุณาเลือกตำแหน่ง"
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "กรุณากรอกเลขใบประกอบวิชาชีพ"
    if (!formData.hospital.trim()) newErrors.hospital = "กรุณากรอกสถานพยาบาล"
    if (!formData.acceptTerms) newErrors.acceptTerms = "กรุณายอมรับเงื่อนไขการใช้งาน"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/register-professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const result = await res.json()
      if (!res.ok) {
        if (result.error) alert(result.error)
        else alert('เกิดข้อผิดพลาดในการลงทะเบียน')
        return
      }
      setIsRegistered(true)
      // แจ้ง LINE (ถ้ามี window.liff)
      if (typeof window !== "undefined" && (window as any).liff) {
        (window as any).liff.sendMessages([
          {
            type: "text",
            text: "ลงทะเบียนสำเร็จแล้ว! ตอนนี้คุณสามารถเข้าใช้งานระบบได้เต็มรูปแบบ",
          },
        ])
      }
      setTimeout(() => {
        window.location.href = `https://liff.line.me/2007193867-RZeDGAp9`
      }, 3000)
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลงทะเบียน')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const goToProducts = () => {
    // Redirect ไปยัง LIFF_ID_PRODUCT
    window.location.href = `https://liff.line.me/2007193867-RZeDGAp9`
  }

  // หากลงทะเบียนแล้ว แสดงหน้าสำเร็จ
  if (isRegistered) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">ลงทะเบียนสำเร็จ!</h1>
          <p className="text-sm text-gray-600">คุณได้ลงทะเบียนเรียบร้อยแล้ว</p>
        </div>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-green-800 mb-2">ลงทะเบียนสำเร็จ!</h2>
            <p className="text-sm text-green-700 mb-6">
              ขอบคุณที่ลงทะเบียนเป็นบุคลากรทางการแพทย์ ตอนนี้คุณสามารถเข้าใช้งานระบบได้เต็มรูปแบบแล้ว
            </p>

            <div className="space-y-3">
              <Button onClick={goToProducts} className="w-full" size="lg">
                <Package className="w-4 h-4 mr-2" />
                เข้าสู่ระบบสินค้า
              </Button>

              <Link href="/liff/prescription">
                <Button variant="outline" className="w-full bg-transparent">
                  <FileText className="w-4 h-4 mr-2" />
                  ระบบใบสั่งยา
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ขั้นตอนถัดไป</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• ใช้ Rich Menu เพื่อเข้าถึงฟีเจอร์ต่างๆ</li>
            <li>• ปุ่มแรก: ดูสินค้าและจัดการคำสั่งซื้อ</li>
            <li>• ปุ่มที่สอง: เข้าใช้งานระบบใบสั่งยา</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">ลงทะเบียนบุคลากรทางการแพทย์</h1>
          <p className="text-sm text-gray-600">สำหรับแพทย์และเภสัชกร</p>
        </div>
        <Link href="/liff">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            กลับ
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="w-5 h-5" />
            ข้อมูลส่วนตัว
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ข้อมูลส่วนตัว */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  ชื่อ *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={`text-sm ${errors.firstName ? "border-red-500" : ""}`}
                  placeholder="กรอกชื่อ"
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  นามสกุล *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={`text-sm ${errors.lastName ? "border-red-500" : ""}`}
                  placeholder="กรอกนามสกุล"
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                อีเมล *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`text-sm ${errors.email ? "border-red-500" : ""}`}
                placeholder="example@email.com"
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                เบอร์โทรศัพท์ *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`text-sm ${errors.phone ? "border-red-500" : ""}`}
                placeholder="0812345678"
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* ข้อมูลวิชาชีพ */}
            <div className="pt-4 border-t">
              <h3 className="flex items-center gap-2 text-base font-semibold mb-4">
                <Stethoscope className="w-4 h-4" />
                ข้อมูลวิชาชีพ
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">
                    ตำแหน่ง *
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger className={`text-sm ${errors.role ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="เลือกตำแหน่ง" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          แพทย์
                        </div>
                      </SelectItem>
                      <SelectItem value="pharmacist">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4" />
                          เภสัชกร
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-sm font-medium">
                    เลขใบประกอบวิชาชีพ *
                  </Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                    className={`text-sm ${errors.licenseNumber ? "border-red-500" : ""}`}
                    placeholder="กรอกเลขใบประกอบวิชาชีพ"
                  />
                  {errors.licenseNumber && <p className="text-xs text-red-500">{errors.licenseNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital" className="text-sm font-medium">
                    สถานพยาบาล *
                  </Label>
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => handleInputChange("hospital", e.target.value)}
                    className={`text-sm ${errors.hospital ? "border-red-500" : ""}`}
                    placeholder="ชื่อโรงพยาบาล/คลินิก/ร้านยา"
                  />
                  {errors.hospital && <p className="text-xs text-red-500">{errors.hospital}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-sm font-medium">
                    แผนก/หน่วยงาน
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    className="text-sm"
                    placeholder="เช่น แผนกอายุรกรรม, แผนกเภสัชกรรม"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-sm font-medium">
                    ความเชี่ยวชาญ
                  </Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => handleInputChange("specialization", e.target.value)}
                    className="text-sm"
                    placeholder="เช่น โรคหัวใจ, เภสัชกรรมคลินิก"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium">
                    ประสบการณ์ (ปี)
                  </Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="เลือกประสบการณ์" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 ปี</SelectItem>
                      <SelectItem value="2-5">2-5 ปี</SelectItem>
                      <SelectItem value="6-10">6-10 ปี</SelectItem>
                      <SelectItem value="11-15">11-15 ปี</SelectItem>
                      <SelectItem value="16+">มากกว่า 15 ปี</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    ที่อยู่
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="text-sm min-h-[60px]"
                    placeholder="ที่อยู่สำหรับติดต่อ"
                  />
                </div>
              </div>
            </div>

            {/* เงื่อนไขการใช้งาน */}
            <div className="pt-4 border-t">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
                  className={errors.acceptTerms ? "border-red-500" : ""}
                />
                <div className="space-y-1">
                  <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
                    ยอมรับเงื่อนไขการใช้งาน *
                  </Label>
                  <p className="text-xs text-gray-600">
                    ข้าพเจ้ายืนยันว่าข้อมูลที่กรอกเป็นความจริง และยอมรับเงื่อนไขการใช้งานระบบใบสั่งยา
                  </p>
                  {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังลงทะเบียน...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    ลงทะเบียน
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-xs text-gray-500">หลังจากลงทะเบียนสำเร็จ Rich Menu จะเปลี่ยนเป็นระบบสินค้าโดยอัตโนมัติ</p>
      </div>
    </div>
  )
}
