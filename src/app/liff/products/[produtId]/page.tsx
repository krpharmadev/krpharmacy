import { NextResponse } from "next/server";
import { products } from "@/lib/data/products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const userRole = session?.user?.role || "customer";
    const isProfessionalApproved = session?.user?.isProfessionalApproved || false;

    const product = products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json(
        { error: `Product with ID ${productId} not found` },
        { status: 404 }
      );
    }

    const canViewATC = ["admin"].includes(userRole) || 
      (["medical_personnel", "pharmacist"].includes(userRole) && isProfessionalApproved);
    if (product.classification === "ATC" && !canViewATC) {
      return NextResponse.json(
        { error: "Unauthorized to access this product" },
        { status: 403 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API/products/[productId]] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}