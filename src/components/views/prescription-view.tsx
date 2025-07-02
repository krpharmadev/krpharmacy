"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Save, Send, FileText, User, Calendar, Pill } from "lucide-react"
import { toast } from "sonner"

interface PrescriptionItem {
  id: string
  medicineName: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface PrescriptionViewProps {
  platform: "liff" | "web"
}

export function PrescriptionView({ platform }: PrescriptionViewProps) {
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addPrescriptionItem = () => {
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: ""
    }
    setPrescriptionItems([...prescriptionItems, newItem])
  }

  const removePrescriptionItem = (id: string) => {
    setPrescriptionItems(prescriptionItems.filter(item => item.id !== id))
  }

  const updatePrescriptionItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems(prescriptionItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const handleSubmit = async () => {
    if (!patientName || !diagnosis || prescriptionItems.length === 0) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน")
      return
    }

    setIsSubmitting(true)
    
    try {
      // จำลองการส่งข้อมูล
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const prescriptionData = {
        patient: {
          name: patientName,
          id: patientId,
          age: patientAge,
          phone: patientPhone
        },
        diagnosis,
        medicines: prescriptionItems,
        platform,
        createdAt: new Date().toISOString()
      }

      console.log("Prescription Data:", prescriptionData)
      
      toast.success("บันทึกใบสั่งยาสำเร็จ")
      
      // รีเซ็ตฟอร์ม
      setPatientName("")
      setPatientId("")
      setPatientAge("")
      setPatientPhone("")
      setDiagnosis("")
      setPrescriptionItems([])
      
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ระบบใบสั่งยา</h1>
        <p className="text-sm text-gray-600">สำหรับบุคลากรทางการแพทย์</p>
      </div>

      {/* ข้อมูลผู้ป่วย */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            ข้อมูลผู้ป่วย
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">ชื่อ-นามสกุล *</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="ชื่อ-นามสกุลผู้ป่วย"
              />
            </div>
            <div>
              <Label htmlFor="patientId">เลขบัตรประชาชน</Label>
              <Input
                id="patientId"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="เลขบัตรประชาชน 13 หลัก"
              />
            </div>
            <div>
              <Label htmlFor="patientAge">อายุ</Label>
              <Input
                id="patientAge"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="อายุ (ปี)"
                type="number"
              />
            </div>
            <div>
              <Label htmlFor="patientPhone">เบอร์โทรศัพท์</Label>
              <Input
                id="patientPhone"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="เบอร์โทรศัพท์"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* การวินิจฉัย */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            การวินิจฉัย
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="diagnosis">การวินิจฉัย *</Label>
            <Textarea
              id="diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="ระบุการวินิจฉัยโรค"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* รายการยา */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            รายการยา
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptionItems.map((item, index) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">ยา #{index + 1}</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removePrescriptionItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>ชื่อยา *</Label>
                  <Input
                    value={item.medicineName}
                    onChange={(e) => updatePrescriptionItem(item.id, "medicineName", e.target.value)}
                    placeholder="ชื่อยา"
                  />
                </div>
                <div>
                  <Label>ขนาดยา *</Label>
                  <Input
                    value={item.dosage}
                    onChange={(e) => updatePrescriptionItem(item.id, "dosage", e.target.value)}
                    placeholder="เช่น 500mg, 1 เม็ด"
                  />
                </div>
                <div>
                  <Label>ความถี่ *</Label>
                  <Select value={item.frequency} onValueChange={(value) => updatePrescriptionItem(item.id, "frequency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกความถี่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="วันละ 1 ครั้ง">วันละ 1 ครั้ง</SelectItem>
                      <SelectItem value="วันละ 2 ครั้ง">วันละ 2 ครั้ง</SelectItem>
                      <SelectItem value="วันละ 3 ครั้ง">วันละ 3 ครั้ง</SelectItem>
                      <SelectItem value="วันละ 4 ครั้ง">วันละ 4 ครั้ง</SelectItem>
                      <SelectItem value="ทุก 6 ชั่วโมง">ทุก 6 ชั่วโมง</SelectItem>
                      <SelectItem value="ทุก 8 ชั่วโมง">ทุก 8 ชั่วโมง</SelectItem>
                      <SelectItem value="ทุก 12 ชั่วโมง">ทุก 12 ชั่วโมง</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>ระยะเวลา *</Label>
                  <Input
                    value={item.duration}
                    onChange={(e) => updatePrescriptionItem(item.id, "duration", e.target.value)}
                    placeholder="เช่น 7 วัน, 2 สัปดาห์"
                  />
                </div>
              </div>
              
              <div>
                <Label>คำแนะนำพิเศษ</Label>
                <Textarea
                  value={item.instructions}
                  onChange={(e) => updatePrescriptionItem(item.id, "instructions", e.target.value)}
                  placeholder="คำแนะนำพิเศษ เช่น รับประทานหลังอาหาร, งดอาหารบางชนิด"
                  rows={2}
                />
              </div>
            </div>
          ))}
          
          <Button
            onClick={addPrescriptionItem}
            variant="outline"
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มยา
          </Button>
        </CardContent>
      </Card>

      {/* ปุ่มดำเนินการ */}
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {isSubmitting ? "กำลังบันทึก..." : "บันทึกใบสั่งยา"}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => window.print()}
          className="flex-1"
          size="lg"
        >
          <Send className="w-4 h-4 mr-2" />
          พิมพ์ใบสั่งยา
        </Button>
      </div>

      {/* หมายเหตุ */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">หมายเหตุ</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก</li>
          <li>• ใบสั่งยาจะถูกบันทึกในระบบและสามารถพิมพ์ได้</li>
          <li>• หากมีข้อสงสัยกรุณาติดต่อเภสัชกร</li>
        </ul>
      </div>
    </div>
  )
} 