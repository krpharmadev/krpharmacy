"use client";

import { useLIFFContext } from "@/contexts/LIFFProvider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`);
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.status}`);
  return res.json();
};

export function ProductDetail({
  productId,
  isLiff,
}: {
  productId: string;
  isLiff: boolean;
}) {
  const { liff } = useLIFFContext();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "customer";
  const isProfessionalApproved = session?.user?.isProfessionalApproved || false;

  const { data: product, error, isLoading } = useSWR<ProductType>(
    `/api/products/${productId}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const shareProduct = async () => {
    if (isLiff && liff && product) {
      try {
        await liff.shareTargetPicker({
          type: "text",
          text: `Check out ${product.name}! Price: ${product.price} THB\n${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`,
        });
      } catch (err) {
        console.error("Failed to share to LINE:", err);
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !product)
    return (
      <div className="text-red-500 text-center py-8">
        ไม่พบสินค้าหรือเกิดข้อผิดพลาด: {error?.message || "Unknown error"}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="text-blue-500 underline mb-4 inline-block">
        กลับไปยังรายการสินค้า
      </Link>
      <div className={`bg-white rounded-lg shadow p-6 ${isLiff ? "max-w-md mx-auto" : ""}`}>
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={isLiff ? 200 : 400}
            height={isLiff ? 200 : 400}
            className="rounded-md mb-4 object-cover mx-auto"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <p className="text-xl font-medium text-green-600 mb-4">฿{product.price}</p>
        <p className="text-sm text-gray-500 mb-2">
          หมวดหมู่: {product.categoryId} | หมวดหมู่ย่อย: {product.subcategoryId}
        </p>
        {product.classifications.length > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            การจัดหมวดหมู่: {product.classifications.join(", ")}
          </p>
        )}
        {["customer", "medical_personnel", "pharmacist"].includes(userRole) && (
          <button
            onClick={() => console.log(`Add to cart: ${product.id}`)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            เพิ่มลงตะกร้า
          </button>
        )}
        {["medical_personnel", "pharmacist"].includes(userRole) && isProfessionalApproved && (
          <button
            onClick={() => console.log(`Special order: ${product.id}`)}
            className="mt-4 ml-2 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            สั่งซื้อพิเศษ
          </button>
        )}
        {["inventory_staff", "admin"].includes(userRole) && (
          <button
            onClick={() => console.log(`Update stock: ${product.id}`)}
            className="mt-4 ml-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            อัปเดตสต๊อก
          </button>
        )}
        {["pharmacist", "admin"].includes(userRole) && (
          <button
            onClick={() => console.log(`Edit product: ${product.id}`)}
            className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            แก้ไขสินค้า
          </button>
        )}
        {isLiff && (
          <button
            onClick={shareProduct}
            className="mt-4 ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Share to LINE
          </button>
        )}
      </div>
    </div>
  );
}