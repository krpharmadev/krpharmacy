import { sanityClient } from "@/sanity/lib/client";
import { PRODUCT_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";

export default async function SanityDemoPage() {
  // ดึงข้อมูลจาก Sanity
  const products = await sanityClient.fetch(PRODUCT_QUERY);
  const categories = await sanityClient.fetch(CATEGORIES_QUERY);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ตัวอย่างข้อมูลจาก Sanity</h1>
      <h2 className="text-xl font-semibold mt-4 mb-2">หมวดหมู่สินค้า</h2>
      <ul className="mb-8">
        {categories.map((cat: any) => (
          <li key={cat._id} className="mb-2">
            <span className="font-bold">{cat.name}</span> - {cat.description}
          </li>
        ))}
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">สินค้า</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod: any) => (
          <div key={prod._id} className="border rounded p-4">
            <div className="font-bold">{prod.name}</div>
            <div className="text-gray-600">{prod.description}</div>
            <div className="text-green-600 mt-2">฿{prod.price}</div>
            <div className="text-sm text-gray-400 mt-1">
              หมวดหมู่: {prod.category?.name || "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}