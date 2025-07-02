"use client"

import type React from "react"
import { HeaderTop } from "./HeaderTop"
//import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { LocationCard } from "../location/LocationCard"
import { Toaster } from "@/components/ui/sonner"

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderTop />
      <Navbar />
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
      <LocationCard />
      <Toaster />
    </div>
  )
}
