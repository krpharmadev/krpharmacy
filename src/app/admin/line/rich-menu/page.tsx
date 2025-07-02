'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface RichMenu {
  richMenuId: string
  name: string
  chatBarText: string
  size: {
    width: number
    height: number
  }
  areas: any[]
}

export default function RichMenuAdmin() {
  const [richMenus, setRichMenus] = useState<RichMenu[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [creating, setCreating] = useState<boolean>(false)

  // โหลดข้อมูล Rich Menu เมื่อเปิดหน้า
  useEffect(() => {
    fetchRichMenus()
  }, [])

  // ดึงข้อมูล Rich Menu
  const fetchRichMenus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/line/rich-menu/list')
      const data = await response.json()
      
      if (data.success) {
        setRichMenus(data.richMenuList)
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่สามารถโหลดข้อมูล Rich Menu ได้'))
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ไม่สามารถโหลดข้อมูล Rich Menu ได้')
    } finally {
      setLoading(false)
    }
  }

  // สร้าง Rich Menu ใหม่
  const createNewRichMenu = async () => {
    try {
      setCreating(true)
      const response = await fetch('/api/line/rich-menu', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`สร้าง Rich Menu สำเร็จแล้ว (ID: ${data.richMenuId})`)
        // โหลดข้อมูลใหม่
        fetchRichMenus()
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่สามารถสร้าง Rich Menu ได้'))
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ไม่สามารถสร้าง Rich Menu ได้')
    } finally {
      setCreating(false)
    }
  }

  // ลบ Rich Menu
  const deleteRichMenu = async (richMenuId: string) => {
    if (!confirm(`คุณต้องการลบ Rich Menu ID: ${richMenuId} ใช่หรือไม่?`)) {
      return
    }
    
    try {
      const response = await fetch(`/api/line/rich-menu/delete/${richMenuId}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`ลบ Rich Menu สำเร็จแล้ว (ID: ${richMenuId})`)
        // โหลดข้อมูลใหม่
        fetchRichMenus()
      } else {
        toast.error('เกิดข้อผิดพลาด: ' + (data.error || 'ไม่สามารถลบ Rich Menu ได้'))
      }
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด: ไม่สามารถลบ Rich Menu ได้')
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">จัดการ LINE Rich Menu</h1>
        <Button 
          onClick={createNewRichMenu} 
          disabled={creating}
        >
          {creating ? 'กำลังสร้าง...' : 'สร้าง Rich Menu ใหม่'}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
                <div className="mt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : richMenus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {richMenus.map((richMenu) => (
            <Card key={richMenu.richMenuId}>
              <CardHeader>
                <CardTitle>{richMenu.name}</CardTitle>
                <CardDescription>Chat Bar: {richMenu.chatBarText}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center rounded-md mb-4">
                  <p className="text-sm text-gray-500">ขนาด: {richMenu.size.width}x{richMenu.size.height}</p>
                </div>
                <div className="text-sm">
                  <p><strong>Rich Menu ID:</strong> {richMenu.richMenuId}</p>
                  <p><strong>จำนวนพื้นที่:</strong> {richMenu.areas.length} พื้นที่</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => deleteRichMenu(richMenu.richMenuId)}
                >
                  ลบ Rich Menu
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">ไม่พบ Rich Menu</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">คุณยังไม่มี Rich Menu สำหรับ LINE OA ของคุณ</p>
          <Button onClick={createNewRichMenu} disabled={creating}>
            {creating ? 'กำลังสร้าง...' : 'สร้าง Rich Menu ใหม่'}
          </Button>
        </div>
      )}
    </div>
  )
}
