'use client'

import { useMainCategory } from '@/hooks/useCategory'

export default function CategoryPage() {
    const { mainCategories, isLoading, isError } = useMainCategory()
  
    if (isLoading) return <p>กำลังโหลด...</p>
    if (isError) return <p>โหลดข้อมูลผิดพลาด</p>
  
    return (
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">หมวดหมู่หลัก</h1>
        {mainCategories.map((cat: any) => (
          <div key={cat._id} className="mb-4">
            <h2 className="text-xl">{cat.name}</h2>
            {cat.description && (
              <p className="text-sm text-gray-500">{cat.description}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

