"use client"

import type React from "react"
import { HeaderTop } from "./HeaderTop"
import { Footer } from "./Footer"
import { Navbar } from "./Navbar"
import { LocationCard } from "../location/LocationCard"
import Container from "@/components/Container";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Container className="min-h-0">
        <HeaderTop />
        <Navbar />
        <main className="flex-grow min-h-0 flex-1">{children}</main>
        <Footer />
      </Container>
      <LocationCard />
    </div>
  )
}
