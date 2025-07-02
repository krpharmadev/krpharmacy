"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, PhoneIcon, ClockIcon, X } from "lucide-react"
import { useState, useEffect } from "react"

interface LocationCardProps {
  latitude?: number
  longitude?: number
  address?: string
  phone?: string
  businessHours?: string
}

export function LocationCard({
  latitude = 14.991517500633622,
  longitude = 102.10432834417895,
  address = "616 ถนน ช้างเผือก ตำบลในเมือง อำเภอเมืองนครราชสีมา นครราชสีมา 30000",
  phone = "044 248 858",
  businessHours = "จันทร์-ศุกร์: 08:00-18:00, เสาร์-อาทิตย์: 09:00-18:00",
}: LocationCardProps) {
  const [showLocation, setShowLocation] = useState(false)

  // Listen for the custom event to show the location
  useEffect(() => {
    const handleShowLocation = (event: CustomEvent) => {
      setShowLocation(event.detail.show)
    }

    window.addEventListener("showLocation", handleShowLocation as EventListener)

    return () => {
      window.removeEventListener("showLocation", handleShowLocation as EventListener)
    }
  }, [])

  // สร้าง URL สำหรับ embed Google Maps
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${latitude},${longitude}&zoom=16`

  if (!showLocation) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="bg-green-50 relative">
            <button
              onClick={() => setShowLocation(false)}
              className="absolute top-4 right-4 p-2 hover:bg-green-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <CardTitle className="text-2xl font-bold text-green-700 flex items-center">
              <MapPinIcon className="w-6 h-6 mr-2" />
              ที่ตั้งร้าน KR Pharmacy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-[400px] rounded-lg overflow-hidden mb-6">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              ></iframe>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="flex items-start">
                <MapPinIcon className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">ที่อยู่</h3>
                  <p className="text-gray-700 text-sm">{address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <PhoneIcon className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">เบอร์โทรศัพท์</h3>
                  <a href={`tel:${phone}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <ClockIcon className="w-5 h-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">เวลาทำการ</h3>
                  <p className="text-gray-700 text-sm">{businessHours}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  เส้นทางไปร้าน
                </a>
                <a
                  href={`tel:${phone}`}
                  className="flex-1 bg-white border-2 border-green-600 text-green-600 text-center py-3 px-4 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  โทรหาร้าน
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
