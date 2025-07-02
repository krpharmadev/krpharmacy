"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PrescriptionView } from "@/components/views/prescription-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LiffPrescriptionPage() {
  const router = useRouter()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is registered
    const userRegistration = localStorage.getItem("userRegistration")
    if (userRegistration) {
      setIsRegistered(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isRegistered) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">ระบบใบสั่งยา</h1>
          <p className="text-sm text-gray-600">สำหรับบุคลากรทางการแพทย์</p>
        </div>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-orange-800 mb-2">จำเป็นต้องลงทะเบียน</h2>
            <p className="text-sm text-orange-700 mb-6">คุณจำเป็นต้องลงทะเบียนเป็นบุคลากรทางการแพทย์ก่อนเข้าใช้งานระบบใบสั่งยา</p>
            <div className="space-y-3">
              <Link href="/liff/register">
                <Button className="w-full" size="lg">
                  <UserPlus className="w-4 h-4 mr-2" />
                  ลงทะเบียนตอนนี้
                </Button>
              </Link>
              <Link href="/liff">
                <Button variant="outline" className="w-full bg-transparent">
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ใครสามารถลงทะเบียนได้?</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• แพทย์ที่มีใบประกอบวิชาชีพ</li>
            <li>• เภสัชกรที่มีใบประกอบวิชาชีพ</li>
            <li>• บุคลากรทางการแพทย์ที่ได้รับอนุญาต</li>
          </ul>
        </div>
      </div>
    )
  }

  return <PrescriptionView platform="liff" />
}
