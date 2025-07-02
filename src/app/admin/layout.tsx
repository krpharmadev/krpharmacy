import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">Rich Menu Management System</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="/web" className="text-sm text-blue-600 hover:text-blue-800">
                ไปหน้า Web
              </a>
              <a href="/liff" className="text-sm text-blue-600 hover:text-blue-800">
                ไปหน้า LIFF
              </a>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
