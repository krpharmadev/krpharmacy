import React from "react"
import CategoryCard from "./category-card"
import { 
  GastroIcon, 
  RespiratoryIcon, 
  AntibioticIcon, 
  HealthyIcon, 
  HerbalIcon, 
  ChronicIcon 
} from "./icons/CategoryIcons"

export const CategoriesGrid = () => {
  const categories = [
    {
      thaiTitle: "ยาระบบทางเดินอาหาร",
      englishTitle: "Gastrointestinal Systems",
      backgroundColor: "#E6F4F3",
      textColor: "#2BB3A9",
      icon: <GastroIcon className="w-10 h-10" />,
      link: "/products?category=gastrointestinal"
    },
    {
      thaiTitle: "ผลิตภัณฑ์สุขภาพ",
      englishTitle: "Healthy Products",
      backgroundColor: "#FCE7F3",
      textColor: "#EC4899",
      icon: <HealthyIcon className="w-10 h-10" />,
      link: "/products?category=health"
    },
    {
      thaiTitle: "ยาระบบทางเดินหายใจ",
      englishTitle: "Respiratory Systems",
      backgroundColor: "#DBEAFE",
      textColor: "#3B82F6",
      icon: <RespiratoryIcon className="w-10 h-10" />,
      link: "/products?category=respiratory"
    },
    {
      thaiTitle: "ผลิตภัณฑ์จากสมุนไพร",
      englishTitle: "Herbal Products",
      backgroundColor: "#F5E9DD",
      textColor: "#9C6644",
      icon: <HerbalIcon className="w-10 h-10" />,
      link: "/products?category=herbal"
    },
    {
      thaiTitle: "ยาต้านการติดเชื้อ",
      englishTitle: "Antibiotic/Antiviral/Antifungal Drugs",
      backgroundColor: "#F3E8FC",
      textColor: "#9333EA",
      icon: <AntibioticIcon className="w-10 h-10" />,
      link: "/products?category=antibiotic"
    },
    {
      thaiTitle: "ยาโรคเรื้อรัง",
      englishTitle: "Chronic Drugs",
      backgroundColor: "#FEF0E7",
      textColor: "#EA580C",
      icon: <ChronicIcon className="w-10 h-10" />,
      link: "/products?category=chronic"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          thaiTitle={category.thaiTitle}
          englishTitle={category.englishTitle}
          backgroundColor={category.backgroundColor}
          textColor={category.textColor}
          icon={category.icon}
          link={category.link}
        />
      ))}
    </div>
  )
} 