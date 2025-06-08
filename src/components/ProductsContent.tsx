"use client";

import { useSession } from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { UserRole } from "@/lib/auth";

interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  classifications: string[];
  imageUrl?: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export function ProductsContent({ isLiff }: { isLiff: boolean }) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const { data: session } = useSession();
  const userRole = session?.user?.role || "customer";
  const isProfessionalApproved = session?.user?.isProfessionalApproved || false;

  const canViewATC = ["admin"].includes(userRole) || 
    (["medical_personnel", "pharmacist"].includes(userRole) && isProfessionalApproved);

  const apiUrl = `/api/products?category=${category || ""}&subcategory=${subcategory || ""}`;

  const { data: products, error, isLoading } = useSWR<ProductType[]>(apiUrl, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  // กรองสินค้าตาม role
  const filteredProducts = products?.filter((product) => {
    if (category === "ATC" && !canViewATC) return false;
    if (category === "General" && product.classifications.includes("General")) return true;
    if (category === "ATC" && product.classifications.includes("ATC") && canViewATC) return true;
    return !["ATC", "General"].includes(category || "");
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">สินค้า</h1>
      <div className={isLiff ? "space-y-4" : "grid grid-cols-1 md:grid-cols-3 gap-6"}>
        {filteredProducts?.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition">
              {product.imageUrl && (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={isLiff ? 150 : 300}
                  height={isLiff ? 150 : 300}
                  className="rounded-md mb-4 object-cover"
                />
              )}
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600 line-clamp-2">{product.description}</p>
              <p className="text-green-600 font-medium mt-2">฿{product.price}</p>
            </div>
          </Link>
        )) || <p className="text-gray-500">ไม่มีสินค้า</p>}
      </div>
    </div>
  );
}