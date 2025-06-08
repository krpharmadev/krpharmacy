import Image from "next/image"
import Link from "next/link"
import { ReactNode } from "react"

interface CategoryCardProps {
  thaiTitle: string
  englishTitle: string
  icon?: ReactNode
  backgroundColor: string
  textColor: string
  link: string
}

export default function CategoryCard({ 
  thaiTitle, 
  englishTitle, 
  icon, 
  backgroundColor, 
  textColor,
  link 
}: CategoryCardProps) {
  return (
    <Link href={link} className="group">
      <div 
        className="rounded-lg overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full"
        style={{ backgroundColor }}
      >
        <div className="flex items-center p-3">
          <div className="w-12 h-12 flex items-center justify-center bg-white/30 rounded-full mr-3">
            {icon}
          </div>
          <div className="flex-1">
            <h3 
              className="font-bold text-lg leading-tight" 
              style={{ color: textColor }}
            >
              {thaiTitle}
            </h3>
            <p 
              className="text-xs font-light" 
              style={{ color: textColor }}
            >
              {englishTitle}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
