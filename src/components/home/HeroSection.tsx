"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="relative w-full bg-blue-900" style={{ minHeight: "600px", height: "calc(100vh - 120px)" }}>
      {/* Background Image - Full Hero */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-pharmacist.png"
          alt="Pharmacist"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/60 to-blue-900/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full z-10">
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center h-full">
            {/* Content - positioned on the left */}
            <div className="w-full md:w-2/3 lg:w-1/2 py-12 md:py-0 z-10">
              <div className="max-w-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                  ร้านขายยาออนไลน์ที่คุณไว้วางใจ
                </h1>
                <p className="text-base sm:text-lg text-white/90 mb-8">
                  บริการจัดส่งยาและเวชภัณฑ์ถึงบ้าน พร้อมคำแนะนำจากเภสัชกร
                </p>

                {/* Improved Search Box */}
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex items-center bg-white rounded-full overflow-hidden shadow-lg border-2 border-green-500">
                    <input
                      type="text"
                      placeholder="ค้นหายาและเวชภัณฑ์..."
                      className="w-full py-3 px-6 text-gray-700 focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-3 transition-colors">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
