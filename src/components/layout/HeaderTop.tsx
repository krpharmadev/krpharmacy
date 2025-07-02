"use client"

import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react"
import { useScrollDetection } from "@/hooks/useScrollDetection"

export function HeaderTop({ isLiff }: { isLiff?: boolean }) {
  const isScrolled = useScrollDetection({ threshold: 50 })

  const showLocationMap = () => {
    const event = new CustomEvent("showLocation", { detail: { show: true } })
    window.dispatchEvent(event)
  }

  return (
    <div
      className={`bg-white text-gray-600 border-b transition-all duration-500 ease-in-out sticky top-0 z-40 ${
        isScrolled ? "h-0 opacity-0 -translate-y-full" : "h-8 opacity-100 translate-y-0"
      } overflow-hidden`}
    >
      <div className={`container mx-auto px-4 transition-all duration-500 ease-in-out ${
        isScrolled ? "h-0" : "h-8"
      }`}>
        <div className={`flex justify-end items-center transition-all duration-500 ease-in-out ${
          isScrolled ? "h-0 opacity-0" : "h-8 opacity-100"
        }`}>
          <div className="flex items-center space-x-6">
            <a
              href="mailto:krpharma@hotmail.com"
              className="flex items-center space-x-2 hover:text-green-600 transition-colors text-sm"
            >
              <span className="text-green-500">
                <MailIcon className="w-4 h-4" />
              </span>
              <span className="hidden md:inline">krpharma@hotmail.com</span>
            </a>
            <a href="tel:044248858" className="flex items-center space-x-2 hover:text-green-600 transition-colors text-sm">
              <span className="text-green-500">
                <PhoneIcon className="w-4 h-4" />
              </span>
              <span className="hidden md:inline">044-248-858</span>
            </a>
            <button
              onClick={showLocationMap}
              className="flex items-center space-x-2 hover:text-green-600 transition-colors cursor-pointer text-sm"
            >
              <span className="text-green-500">
                <MapPinIcon className="w-4 h-4" />
              </span>
              <span className="hidden md:inline">แผนที่ร้าน</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}