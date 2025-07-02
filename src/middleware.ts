import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || ""
  const pathname = request.nextUrl.pathname
  const searchParams = request.nextUrl.searchParams

  // ตรวจสอบ LIFF environment (ปรับปรุงการตรวจสอบ)
  const isLiffEnvironment =
    userAgent.includes("Line") ||
    searchParams.has("liff_id") ||
    searchParams.has("liff_section") ||
    request.headers.get("x-requested-with") === "LIFF" ||
    request.headers.get("referer")?.includes("liff")

  // ตรวจสอบ LIFF ID จาก query parameter
  const liffId = searchParams.get("liff_id")
  const liffSection = searchParams.get("liff_section")

  // กำหนด LIFF ID mapping
  const LIFF_ROUTES = {
    "2007364711-JXKDxaO0": "/liff/register",  // Register
    "2007364711-9kVr1kWL": "/liff/products", // Products
    "2007364711-Mb9E7DAy": "/liff/cart"      // Cart
  } as const

  // Log สำหรับ debugging
  if (process.env.NODE_ENV === "development") {
    console.log("=== LIFF Middleware Debug ===")
    console.log("User Agent:", userAgent.substring(0, 100) + "...")
    console.log("Is LIFF Environment:", isLiffEnvironment)
    console.log("Pathname:", pathname)
    console.log("LIFF ID:", liffId)
    console.log("LIFF Section:", liffSection)
    console.log("All Search Params:", Object.fromEntries(searchParams.entries()))
  }

  // Handle root path - redirect to appropriate platform
  if (pathname === "/") {
    if (isLiffEnvironment && liffId) {
      const targetRoute = LIFF_ROUTES[liffId as keyof typeof LIFF_ROUTES]
      if (targetRoute) {
        const newUrl = new URL(targetRoute, request.url)
        // เก็บ query parameters ทั้งหมด (รวม liff_id)
        searchParams.forEach((value, key) => {
          newUrl.searchParams.set(key, value)
        })
        return NextResponse.redirect(newUrl)
      } else {
        // LIFF ID ไม่รู้จัก - ไปหน้า default
        return NextResponse.redirect(new URL("/liff", request.url))
      }
    } else if (isLiffEnvironment) {
      // LIFF environment แต่ไม่มี liff_id
      return NextResponse.redirect(new URL("/liff", request.url))
    } else {
      // Web environment
      return NextResponse.redirect(new URL("/web", request.url))
    }
  }

  // Redirect logic for LIFF based on LIFF ID
  if (isLiffEnvironment && !pathname.startsWith("/liff")) {
    let newPath = "/liff" // default path

    if (liffId && LIFF_ROUTES[liffId as keyof typeof LIFF_ROUTES]) {
      // ใช้ LIFF ID เป็นหลัก
      newPath = LIFF_ROUTES[liffId as keyof typeof LIFF_ROUTES]
    } else if (liffSection) {
      // Fallback to section-based routing
      const sectionRoutes = {
        "register": "/liff/register",
        "product": "/liff/products",
        "products": "/liff/products", // รองรับทั้ง product และ products
        "order": "/liff/cart",
        "cart": "/liff/cart"
      } as const

      if (sectionRoutes[liffSection as keyof typeof sectionRoutes]) {
        newPath = sectionRoutes[liffSection as keyof typeof sectionRoutes]
      }
    }

    const newUrl = new URL(newPath, request.url)

    // เก็บ query parameters ที่สำคัญ
    searchParams.forEach((value, key) => {
      // เก็บ liff_id ไว้เพื่อใช้ใน LIFF app
      if (key === "liff_id" || (key !== "liff_section")) {
        newUrl.searchParams.set(key, value)
      }
    })

    if (process.env.NODE_ENV === "development") {
      console.log("Redirecting to:", newUrl.toString())
    }

    return NextResponse.redirect(newUrl)
  }

  // Redirect ออกจาก LIFF ถ้าไม่ใช่ LIFF environment
  if (!isLiffEnvironment && pathname.startsWith("/liff")) {
    let webPath = pathname.replace("/liff", "/web")
    
    // ถ้า path เป็น /liff เฉยๆ ให้ไป /web
    if (webPath === "/web" || webPath === "") {
      webPath = "/web"
    }

    const newUrl = new URL(webPath, request.url)
    
    // เก็บ query parameters (ยกเว้น LIFF-specific parameters)
    searchParams.forEach((value, key) => {
      if (!key.startsWith("liff_")) {
        newUrl.searchParams.set(key, value)
      }
    })

    return NextResponse.redirect(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp|.*\\.ico).*)"
  ],
}