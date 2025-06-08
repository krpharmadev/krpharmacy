import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db/db";
import { professionalRegistrations } from "@/lib/db/schema/account";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { licenseNumber, profession, documentUrl } = await req.json();

    if (!licenseNumber || !["medical", "pharmacist"].includes(profession)) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    await db.insert(professionalRegistrations).values({
      userId: session.user.id,
      licenseNumber,
      profession,
      documentUrl,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering professional:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
};