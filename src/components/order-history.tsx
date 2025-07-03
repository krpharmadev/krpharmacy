'use client'

import React, { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getOrdersByUserId, getProfessionalOrdersByUserId, OrderWithItems, ProfessionalOrderWithItems } from "@/lib/data/orders";
import { useSession } from "next-auth/react";

export function OrderHistory() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<(OrderWithItems | ProfessionalOrderWithItems)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // ดึงข้อมูล orders ทั้งสองประเภท
        const [regularOrders, professionalOrders] = await Promise.all([
          getOrdersByUserId(session.user.id),
          getProfessionalOrdersByUserId(session.user.id)
        ]);

        // รวมข้อมูลและเรียงตามวันที่
        const allOrders = [...regularOrders, ...professionalOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setOrders(allOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลประวัติการสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [session?.user?.id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'รอดำเนินการ',
      'processing': 'กำลังดำเนินการ',
      'shipped': 'จัดส่งแล้ว',
      'delivered': 'จัดส่งสำเร็จ',
      'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'pending': 'text-yellow-700',
      'processing': 'text-blue-700',
      'shipped': 'text-green-700',
      'delivered': 'text-green-700',
      'cancelled': 'text-red-700'
    };
    return colorMap[status] || 'text-gray-700';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-blue-500 hover:underline"
        >
          ลองใหม่
        </button>
      </div>
    );
  }

  if (!session?.user?.id) {
    return (
      <div className="text-center text-gray-400 py-8">
        กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <div className="font-semibold text-base">
                เลขที่คำสั่งซื้อ: {order.orderNumber}
              </div>
              <div className="text-xs text-gray-500">
                วันที่: {formatDate(order.createdAt)}
              </div>
              {'professionalType' in order && (
                <div className="text-xs text-blue-600">
                  {order.professionalType} - {order.hospitalName}
                </div>
              )}
            </div>
            <div className={`text-sm font-bold ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </div>
          </div>
          <Separator className="my-2" />
          <div className="space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>{item.productName} x{item.quantity}</span>
                <span>{item.totalPrice.toLocaleString()} บาท</span>
              </div>
            ))}
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium">
            <span>รวมทั้งสิ้น</span>
            <span>{order.totalAmount.toLocaleString()} บาท</span>
          </div>
          {order.notes && (
            <div className="mt-2 text-xs text-gray-600">
              <span className="font-medium">หมายเหตุ:</span> {order.notes}
            </div>
          )}
        </Card>
      ))}
      {orders.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          ยังไม่มีประวัติการสั่งซื้อ
        </div>
      )}
    </div>
  );
} 