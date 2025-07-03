"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { medicationOrderSchema, type MedicationOrderFormData } from "@/lib/validations/order"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function OrderForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<MedicationOrderFormData>({
    resolver: zodResolver(medicationOrderSchema),
    defaultValues: {
      professionalId: "",
      professionalType: undefined,
      hospitalName: "",
      department: "",
      email: "",
      phone: "",
      deliveryAddress: "",
    },
  })

  async function onSubmit(data: MedicationOrderFormData) {
    setIsSubmitting(true)
    setError(null)
    try {
      const res = await fetch("/api/liff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        let message = "เกิดข้อผิดพลาดในการส่งข้อมูล";
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const result = await res.json();
            message = result.message || message;
          } else {
            message = await res.text();
          }
        } catch {}
        throw new Error(message);
      }
      setIsSuccess(true)
      if (onSuccess) onSuccess();
      setTimeout(() => {
        router.push("/products_by_order")
      }, 1000)
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600 mb-4" />
        <h3 className="text-lg font-medium text-green-800">ส่งข้อมูลสำเร็จ</h3>
        <p className="mt-2 text-sm text-green-700">เรากำลังนำท่านไปยังหน้ารายการสินค้า</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสประจำตัวบุคลากร</FormLabel>
                  <FormControl>
                    <Input placeholder="เลขที่ใบประกอบวิชาชีพ หรือรหัสบุคลากร" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="professionalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ประเภทบุคลากร</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกประเภทบุคลากร" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="doctor">แพทย์</SelectItem>
                      <SelectItem value="nurse">พยาบาล</SelectItem>
                      <SelectItem value="pharmacist">เภสัชกร</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="hospitalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อโรงพยาบาล/สถานพยาบาล</FormLabel>
                <FormControl>
                  <Input placeholder="ระบุชื่อสถานพยาบาล" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>แผนก (ถ้ามี)</FormLabel>
                <FormControl>
                  <Input placeholder="ระบุชื่อแผนก" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="อีเมลสำหรับติดต่อ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input placeholder="เบอร์โทรศัพท์สำหรับติดต่อ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ที่อยู่สำหรับจัดส่ง</FormLabel>
                <FormControl>
                  <Textarea placeholder="ระบุที่อยู่สำหรับจัดส่งยาและเวชภัณฑ์" className="resize-none min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3 text-red-800 mb-2">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">หมายเหตุ:</p>
            <p>ระบบนี้สงวนสิทธิ์สำหรับบุคลากรทางการแพทย์เท่านั้น กรุณาเตรียมเอกสารยืนยันตัวตนเมื่อรับสินค้า</p>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "กำลังส่งข้อมูล..." : "ยืนยันข้อมูลและไปยังรายการสินค้า"}
        </Button>
      </form>
    </Form>
  )
}