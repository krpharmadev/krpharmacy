// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent")?.toLowerCase() || "";
    const isLine = /line|liff/.test(userAgent);
    const basePath = isLine ? "/liff" : "/web";

    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Middleware] Path: ${pathname}, User-Agent: ${userAgent}, IsLine: ${isLine}`);
    }

    if (pathname === "/") {
      url.pathname = basePath;
      return NextResponse.redirect(url);
    }

    if (
      pathname === "/categories" ||
      pathname === "/products" ||
      pathname.startsWith("/products/")
    ) {
      url.pathname = `${basePath}${pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/", "/categories", "/products", "/products/:path*",
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};

