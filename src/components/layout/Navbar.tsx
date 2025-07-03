"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { ShoppingCart, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useScrollDetection } from "@/hooks/useScrollDetection";
import { LoginModal } from "@/components/auth/LoginModal";
//import LoginButton from '@/components/LoginButton';
import { useAppContext } from "@/contexts/AppContext";
import { NavLink, MobileNavLink } from "@/components/layout/NavbarMenu";
import { fetchCategories } from "@/sanity/lib/category";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isScrolled = useScrollDetection({ threshold: 50 });
  const [cartCount, setCartCount] = useState(0);
  const { data: session, status } = useSession();
  const { isAdmin, router, user } = useAppContext();

  // ดึงหมวดหมู่จาก Sanity
  const [categories, setCategories] = useState<{ _id: string, name: string, slug: { current: string } }[]>([]);
  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  // ปิดเมนูเมื่อคลิกนอกเมนู
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const userRole = session?.user?.role || "customer";
  const isProfessionalApproved = session?.user?.isProfessionalApproved || false;

  const canViewATC = useMemo(() => 
    ["admin"].includes(userRole) || 
    (["medical_personnel", "pharmacist"].includes(userRole) && isProfessionalApproved),
    [userRole, isProfessionalApproved]
  );

  // เมนูหมวดหมู่ตามบทบาท - ใช้ useMemo เพื่อหลีกเลี่ยงการคำนวณซ้ำ
  const categoryMenus = useMemo(() => [
    ...(userRole === "customer" || canViewATC
      ? [{ name: "ยาทั่วไป", href: "/products?category=General" }]
      : []),
    ...(canViewATC
      ? [{ name: "ยาสำหรับบุคลากรทางการแพทย์", href: "/categories" }]
      : []),
    { name: "ยาสามัญประจำบ้าน", href: "/products?categoryId=1" },
    { name: "เวชภัณฑ์", href: "/products?categoryId=2" },
    { name: "อุปกรณ์การแพทย์", href: "/products?categoryId=3" },
    { name: "วิตามินและอาหารเสริม", href: "/products?categoryId=4" },
    { name: "เวชสำอาง", href: "/products?categoryId=5" },
  ], [userRole, canViewATC]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`bg-white text-gray-700 sticky z-50 shadow-md h-16 transition-all duration-500 ease-in-out ${
          isScrolled ? 'top-0 -mt-8' : 'top-0'
        }`}
      >
        <div className={`container mx-auto px-4 h-full transition-all duration-300`}>
          <div className="flex justify-between items-center h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-14 h-14 relative flex items-center justify-center transition-all duration-300">
                <Image 
                  src="/logo.png" 
                  alt="Pharmacy Logo" 
                  width={50}
                  height={50}
                  className="transition-all duration-300"
                />
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <NavLink href="/">หน้าแรก</NavLink>

              {/* Dropdown: หมวดหมู่ */}
              <div className="relative group">
                <button className="flex items-center hover:text-blue-600">
                  หมวดหมู่
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className="absolute left-0 invisible group-hover:visible opacity-0 group-hover:opacity-100 bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-50 transition-all duration-200">
                  {categories.map((cat) => (
                    <NavLink
                      key={cat._id}
                      href={`/web/categories?category=${cat.slug.current}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-blue-50"
                    >
                      {cat.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              <NavLink href="/about">เกี่ยวกับเรา</NavLink>
              <NavLink href="/contact">ติดต่อเรา</NavLink>
            </div>
            {isAdmin() && (
              <button
                onClick={() => router.push('/studio')}
                className="text-xs border px-4 py-1.5 rounded-full"
              >
                Admin Dashboard
              </button>
            )}
            {/* <LoginButton /> */}

            {/* Right Side - User Menu, Cart */}
            <div className="flex items-center space-x-4">
              {/* User Menu */}
              {status === "loading" ? (
                <div className="h-9 w-24 bg-gray-200 rounded-full animate-pulse" />
              ) : session ? (
                <div className="relative user-menu-container">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                  >
                    <User className="h-4 w-4" />
                    <span className="max-w-[100px] truncate">{session.user?.name || "โปรไฟล์"}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <NavLink
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          โปรไฟล์
                        </NavLink>
                        <NavLink
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          ประวัติการสั่งซื้อ
                        </NavLink>
                        {["medical_personnel", "pharmacist"].includes(userRole) && (
                          <NavLink
                            href="/register/professional"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            ลงทะเบียนพิเศษ
                          </NavLink>
                        )}
                        {userRole === "admin" && (
                          <NavLink
                            href="/rich-menu"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <span className="mr-2">🎨</span>
                              Rich Menu
                            </div>
                          </NavLink>
                        )}
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <LogOut className="h-4 w-4 mr-2" />
                            ออกจากระบบ
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                >
                  <User className="h-4 w-4" />
                  เข้าสู่ระบบ
                </button>
              )}

              {/* Shopping Cart */}
              <NavLink href="/cart" className="hover:text-blue-600 relative">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-md">
            <div className="container mx-auto px-4 py-3 space-y-1">
          
              <MobileNavLink href="/" onClick={() => setIsMobileMenuOpen(false)}>
                หน้าแรก
              </MobileNavLink>
              
              {categoryMenus.map((menu) => (
                <MobileNavLink
                  key={menu.href}
                  href={menu.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {menu.name}
                </MobileNavLink>
              ))}
              
              <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                เกี่ยวกับเรา
              </MobileNavLink>
              
              <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                ติดต่อเรา
              </MobileNavLink>
              
              {session ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {session.user?.name} ({session.user?.email})
                  </div>
                  
                  <MobileNavLink href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    โปรไฟล์
                  </MobileNavLink>
                  
                  <MobileNavLink href="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                    ประวัติการสั่งซื้อ
                  </MobileNavLink>
                  
                  {["medical_personnel", "pharmacist"].includes(userRole) && (
                    <MobileNavLink href="/register/professional" onClick={() => setIsMobileMenuOpen(false)}>
                      ลงทะเบียนพิเศษ
                    </MobileNavLink>
                  )}
                  
                  {userRole === "admin" && (
                    <MobileNavLink href="/rich-menu" onClick={() => setIsMobileMenuOpen(false)}>
                      <div className="flex items-center">
                        <span className="mr-2">🎨</span>
                        Rich Menu
                      </div>
                    </MobileNavLink>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      ออกจากระบบ
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    เข้าสู่ระบบ
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}