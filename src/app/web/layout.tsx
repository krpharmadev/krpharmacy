import type React from "react"
import { ClientLayout } from "@/components/layout/ClientLayout"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
