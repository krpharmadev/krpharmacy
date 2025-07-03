import { db } from '@/lib/db/db'
import { orders, professionalOrders, order_item } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'

export interface OrderWithItems {
  id: number
  orderNumber: string
  customerName: string
  email: string
  phone: string
  deliveryAddress: string
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod?: string
  notes?: string
  createdAt: Date
  items: {
    id: number
    sku: string
    productName: string
    quantity: number
    price: number
    totalPrice: number
  }[]
}

export interface ProfessionalOrderWithItems {
  id: number
  orderNumber: string
  professionalId: string
  professionalType: string
  hospitalName: string
  department?: string
  email: string
  phone: string
  deliveryAddress: string
  totalAmount: number
  status: string
  paymentStatus: string
  paymentMethod?: string
  notes?: string
  createdAt: Date
  items: {
    id: number
    sku: string
    productName: string
    quantity: number
    price: number
    totalPrice: number
  }[]
}

// ดึงข้อมูล orders สำหรับลูกค้าทั่วไป
export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  try {
    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt))

    const ordersWithItems: OrderWithItems[] = []

    for (const order of userOrders) {
      const items = await db
        .select()
        .from(order_item)
        .where(eq(order_item.orderId, order.id))

      ordersWithItems.push({
        ...order,
        totalAmount: Number(order.totalAmount),
        items: items.map(item => ({
          ...item,
          price: Number(item.price),
          totalPrice: Number(item.totalPrice)
        }))
      })
    }

    return ordersWithItems
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

// ดึงข้อมูล professional orders
export async function getProfessionalOrdersByUserId(professionalId: string): Promise<ProfessionalOrderWithItems[]> {
  try {
    const professionalUserOrders = await db
      .select()
      .from(professionalOrders)
      .where(eq(professionalOrders.professionalId, professionalId))
      .orderBy(desc(professionalOrders.createdAt))

    const ordersWithItems: ProfessionalOrderWithItems[] = []

    for (const order of professionalUserOrders) {
      const items = await db
        .select()
        .from(order_item)
        .where(eq(order_item.professionalOrderId, order.id))

      ordersWithItems.push({
        ...order,
        totalAmount: Number(order.totalAmount),
        items: items.map(item => ({
          ...item,
          price: Number(item.price),
          totalPrice: Number(item.totalPrice)
        }))
      })
    }

    return ordersWithItems
  } catch (error) {
    console.error('Error fetching professional orders:', error)
    return []
  }
}

// ดึงข้อมูล order เดียวพร้อม items
export async function getOrderById(orderId: number): Promise<OrderWithItems | null> {
  try {
    const order = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)

    if (order.length === 0) return null

    const items = await db
      .select()
      .from(order_item)
      .where(eq(order_item.orderId, orderId))

    return {
      ...order[0],
      totalAmount: Number(order[0].totalAmount),
      items: items.map(item => ({
        ...item,
        price: Number(item.price),
        totalPrice: Number(item.totalPrice)
      }))
    }
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

// ดึงข้อมูล professional order เดียวพร้อม items
export async function getProfessionalOrderById(orderId: number): Promise<ProfessionalOrderWithItems | null> {
  try {
    const order = await db
      .select()
      .from(professionalOrders)
      .where(eq(professionalOrders.id, orderId))
      .limit(1)

    if (order.length === 0) return null

    const items = await db
      .select()
      .from(order_item)
      .where(eq(order_item.professionalOrderId, orderId))

    return {
      ...order[0],
      totalAmount: Number(order[0].totalAmount),
      items: items.map(item => ({
        ...item,
        price: Number(item.price),
        totalPrice: Number(item.totalPrice)
      }))
    }
  } catch (error) {
    console.error('Error fetching professional order:', error)
    return null
  }
} 