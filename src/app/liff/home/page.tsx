"use client"

import { useLIFFContext } from "@/contexts/LIFFProvider"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LiffHomePage() {
  const { profile, isLoggedIn } = useLIFFContext()
  const router = useRouter()
  
  return (
    <div className="container mx-auto px-4 py-6">
      {profile && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
          <p className="text-lg font-medium">สวัสดี, {profile.displayName}</p>
          {profile.pictureUrl && (
            <div className="mt-2 flex items-center">
              <img 
                src={profile.pictureUrl} 
                alt={profile.displayName} 
                className="w-12 h-12 rounded-full mr-3" 
              />
              <div>
                <p className="text-sm text-muted-foreground">ขอบคุณที่ใช้บริการของเรา</p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">สินค้าแนะนำ</h1>
        
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          variant="outline" 
          size="lg" 
          className="flex flex-col items-center justify-center h-24"
          onClick={() => router.push("/liff/categories")}
        >
          <span className="text-xl mb-1">🔍</span>
          <span>หมวดหมู่สินค้า</span>
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex flex-col items-center justify-center h-24"
          onClick={() => router.push("/liff/orders")}
        >
          <span className="text-xl mb-1">📦</span>
          <span>ออเดอร์ของฉัน</span>
        </Button>
      </div>
    </div>
  )
} 