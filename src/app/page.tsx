"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Default redirect to web version
    // Middleware will handle the actual platform detection
    router.replace("/web")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">กำลังโหลด...</h1>
        <p className="text-gray-600">กำลังตรวจสอบ environment และ redirect</p>
      </div>
    </div>
  )
}
