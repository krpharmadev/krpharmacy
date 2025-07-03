"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCategories } from "@/sanity/lib/category";
import { PRODUCTS_BY_CATEGORY_QUERY } from '@/sanity/queries/query';
import { sanityClient } from '@/sanity/lib/client';
import { useSearchParams } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  productCount?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  slug: { current: string };
  image?: string;
}

export function CategoriesPageClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  // Auto select category from query string
  useEffect(() => {
    if (categories.length === 0) return;
    const categorySlug = searchParams.get('category');
    if (categorySlug) {
      const found = categories.find(cat => cat.slug.current === categorySlug);
      if (found) {
        setSelected(found);
        return;
      }
    }
    // ถ้าไม่มี query หรือไม่เจอ ให้เลือกตัวแรก
    setSelected(categories[0] || null);
  }, [categories, searchParams]);

  useEffect(() => {
    if (selected) {
      setLoadingProducts(true);
      sanityClient.fetch(PRODUCTS_BY_CATEGORY_QUERY, { categorySlug: selected.slug.current })
        .then((data) => setProducts(data))
        .finally(() => setLoadingProducts(false));
    }
  }, [selected]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">หมวดหมู่สินค้า</h1>
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/web/categories?category=${cat.slug.current}`}
                  className={`w-full block text-left px-4 py-2 rounded transition font-medium ${selected?._id === cat._id ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100 text-gray-700'}`}
                  scroll={false}
                >
                  {cat.name}
                  {typeof cat.productCount === 'number' && (
                    <span className="ml-2 text-xs text-gray-400">({cat.productCount})</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
        {/* Product Grid */}
        <section className="flex-1">
          <h2 className="text-2xl font-semibold mb-4">{selected?.name}</h2>
          {selected?.description && <p className="text-gray-500 mb-4">{selected.description}</p>}
          {loadingProducts ? (
            <div className="text-center text-gray-500">กำลังโหลดสินค้า...</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400">ไม่มีสินค้าในหมวดหมู่นี้</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product.slug.current}`} className="border rounded-lg p-4 hover:shadow-md transition block">
                  {product.image && (
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
                  )}
                  <div className="font-medium text-lg mb-1">{product.name}</div>
                  <div className="text-green-700 font-bold">฿{product.price.toLocaleString()}</div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
} 