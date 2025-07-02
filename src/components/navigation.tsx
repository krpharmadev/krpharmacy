"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, Package, ShoppingCart, FileText, UserPlus } from "lucide-react"

interface NavigationProps {
  platform: "web" | "liff"
}

export function Navigation({ platform }: NavigationProps) {
  const pathname = usePathname()
  const basePath = platform === "web" ? "/web" : "/liff"

  const webNavItems = [
    { href: basePath, label: "หน้าหลัก", icon: Home },
    { href: `${basePath}/products`, label: "สินค้า", icon: Package },
    { href: `${basePath}/prescription`, label: "ใบสั่งยา", icon: FileText },
    { href: `${basePath}/cart`, label: "ตะกร้า", icon: ShoppingCart },
  ]

  const liffNavItems = [
    { href: basePath, label: "หน้าหลัก", icon: Home },
    { href: `${basePath}/products`, label: "สินค้า", icon: Package },
    { href: `${basePath}/register`, label: "ลงทะเบียน", icon: UserPlus },
    { href: `${basePath}/cart`, label: "ตะกร้า", icon: ShoppingCart },
  ]

  const navItems = platform === "web" ? webNavItems : liffNavItems

  if (platform === "web") {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href={basePath} className="text-xl font-bold text-gray-900">
              Web App
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant={isActive ? "default" : "ghost"} className="flex items-center space-x-2">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="px-4 py-3">
        <Link href={basePath} className="text-lg font-bold text-gray-900">
          LIFF App
        </Link>
      </div>
      <div className="flex border-t">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <div
                className={`flex flex-col items-center py-2 px-1 text-xs ${
                  isActive ? "text-blue-600 bg-blue-50" : "text-gray-600"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
