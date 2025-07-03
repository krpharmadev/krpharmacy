"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfessionalRegistrationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [licenseNumber, setLicenseNumber] = useState("");
  const [profession, setProfession] = useState<"medical" | "pharmacist">("medical");
  const [documentUrl, setDocumentUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/web/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">กำลังโหลด...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register/professional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseNumber, profession, documentUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }

      setSuccess("ลงทะเบียนสำเร็จ รอการอนุมัติ");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ลงทะเบียนสำหรับบุคลากรทางการแพทย์</h1>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label>หมายเลขใบอนุญาต</label>
          <input
            type="text"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label>อาชีพ</label>
          <select
            value={profession}
            onChange={(e) => setProfession(e.target.value as "medical" | "pharmacist")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="medical">แพทย์/พยาบาล</option>
            <option value="pharmacist">เภสัชกร</option>
          </select>
        </div>
        <div className="mb-4">
          <label>URL เอกสารใบอนุญาต (ถ้ามี)</label>
          <input
            type="text"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ส่งคำขอลงทะเบียน
        </button>
      </form>
    </div>
  );
}