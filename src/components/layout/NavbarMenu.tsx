"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

// Header Navigation Data
const headerData = [
  {
    title: "หน้าแรก",
    href: "/",
  },
  {
    title: "สินค้า",
    href: "/web/products",
  },
  {
    title: "หมวดหมู่",
    href: "/web/categories",
  },
  {
    title: "สั่งซื้อ",
    href: "/web/order",
  },
  {
    title: "ใบสั่งยา",
    href: "/web/prescription",
  },
];

const NavbarMenu = () => {
    const pathname = usePathname();

    return (
        <div>
            {headerData?.map((item) => (
        <Link
          key={item?.title}
          href={item?.href}
          className={`hover:text-shop_light_green hoverEffect relative group ${
            pathname === item?.href && "text-shop_light_green"
          }`}
        >
          {item?.title}
          <span
            className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop_light_green hoverEffect group-hover:w-1/2 group-hover:left-0 ${
              pathname === item?.href && "w-1/2"
            }`}
          />
          <span
            className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop_light_green hoverEffect group-hover:w-1/2 group-hover:right-0 ${
              pathname === item?.href && "w-1/2"
            }`}
          />
        </Link>
      ))}
        </div>
    )
}

export default NavbarMenu

export const NavLink = ({ href, children, onClick, className = "" }: { 
  href: string; 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string 
}) => (
  <Link 
    href={href}
    className={`hover:text-blue-600 ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export const MobileNavLink = ({ href, children, onClick }: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Link 
    href={href}
    className="block px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
    onClick={onClick}
  >
    {children}
  </Link>
);