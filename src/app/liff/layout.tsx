import type React from "react"
import { Navigation } from "@/components/navigation"

export default function LiffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation platform="liff" />
      <main className="px-4 py-4">{children}</main>
    </div>
  )
}


