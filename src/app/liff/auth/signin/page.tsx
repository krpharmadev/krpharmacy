"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLIFFContext } from "@/contexts/LIFFProvider"

// สร้าง Client Component แยกเพื่อใช้ useSearchParams
function SignInContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { profile, isLoggedIn } = useLIFFContext()
  const searchParams = useSearchParams()

  useEffect(() => {
    // ถ้ามีโปรไฟล์ LINE แล้ว ให้ล็อกอินอัตโนมัติ
    if (profile && isLoggedIn) {
      handleLineLogin()
    }

    // ตรวจสอบ error จาก URL parameters
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(`เกิดข้อผิดพลาด: ${errorParam}`)
    }
  }, [profile, isLoggedIn, searchParams])

  const handleLineLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      // จำลองการล็อกอินด้วย LINE
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // ในสถานการณ์จริงควรใช้ signIn("line")
      // แต่ในที่นี้เราจะจำลองการล็อกอินสำเร็จ

      router.push("/liff/products")
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>เข้าสู่ระบบ</CardTitle>
          <CardDescription>เข้าสู่ระบบเพื่อจัดการบัญชีและดูประวัติการสั่งซื้อ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <Button
              className="w-full bg-[#06C755] hover:bg-[#06C755]/90 text-white"
              onClick={handleLineLogin}
              disabled={isLoading}
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบด้วย LINE"}
            </Button>

            {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

            {profile && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">ล็อกอินด้วยบัญชี:</p>
                <p className="font-medium">{profile.displayName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// หน้าหลักที่ครอบด้วย Suspense
export default function LiffSignInPage() {
  return (
      <Suspense fallback={<div className="flex justify-center py-12">กำลังโหลด...</div>}>
        <SignInContent />
      </Suspense>
  )
}
