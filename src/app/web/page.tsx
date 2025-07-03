import { HeroSection } from "@/components/home/HeroSection"
import CategoryCard from "@/components/category-card"
import { 
  GastroIcon, 
  RespiratoryIcon, 
  HealthyIcon, 
  HerbalIcon, 
  AntibioticIcon, 
  ChronicIcon 
} from "@/components/icons/CategoryIcons"
import Link from 'next/link'

export default function WebHomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />

      {/* Category Cards */}
      <section className="py-16 bg-gray-50 flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">หมวดหมู่สินค้า</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <CategoryCard
              thaiTitle="ยาระบบทางเดินหายใจ"
              englishTitle="Respiratory Drugs"
              backgroundColor="#B3E1FA"
              textColor="#0A5D82"
              icon={<RespiratoryIcon className="w-8 h-8" color="#0A5D82" />}
              link="/categories/respiratory"
            />
            <CategoryCard 
              thaiTitle="ยาระบบทางเดินอาหาร"
              englishTitle="Gastrointestinal Drugs"
              backgroundColor="#D1F5EB"
              textColor="#11A683"
              icon={<GastroIcon className="w-8 h-8" color="#11A683" />}
              link="/categories/gastrointestinal" 
            />
            <CategoryCard 
              thaiTitle="ยาต้านการติดเชื้อ"
              englishTitle="Antibiotic/Antiviral Drugs"
              backgroundColor="#E9D7F5"
              textColor="#7B3BA7"
              icon={<AntibioticIcon className="w-8 h-8" color="#7B3BA7" />}
              link="/categories/antibiotic" 
            />
            <CategoryCard
              thaiTitle="ผลิตภัณฑ์สุขภาพ"
              englishTitle="Health Products"
              backgroundColor="#FBCEE2"
              textColor="#D23484"
              icon={<HealthyIcon className="w-8 h-8" color="#D23484" />}
              link="/categories/health-products"
            />
            <CategoryCard
              thaiTitle="ผลิตภัณฑ์จากสมุนไพร"
              englishTitle="Herbal Products"
              backgroundColor="#F5E9DD"
              textColor="#9C6644"
              icon={<HerbalIcon className="w-8 h-8" color="#9C6644" />}
              link="/categories/herbs"
            />
            <CategoryCard
              thaiTitle="ยาโรคเรื้อรัง"
              englishTitle="Chronic Drugs"
              backgroundColor="#FEE0C8"
              textColor="#EA580C"
              icon={<ChronicIcon className="w-8 h-8" color="#EA580C" />}
              link="/categories/chronic"
            />
          </div>
        </div>
      </section>
      <div style={{ margin: '24px 0' }}>
        <Link href="/web/test-auth-callback" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          🔑 ทดสอบ Auth Callback & Session
        </Link>
      </div>
    </main>
  )
}
