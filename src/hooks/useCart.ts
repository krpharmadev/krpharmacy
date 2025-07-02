import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ProductWithInventory } from '@/lib/data/products';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export function useCartManager() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // โหลดตะกร้าจาก localStorage เมื่อเริ่มต้น
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
    setIsInitialized(true);
  }, []);

  // บันทึกตะกร้าลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  // เพิ่มสินค้าลงตะกร้า
  const addToCart = async (product: ProductWithInventory, quantity: number) => {
    setIsLoading(true);
    
    try {
      // ตรวจสอบความพร้อมของสินค้า
      const response = await fetch('/api/inventory/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success || !data.available) {
        toast.error('สินค้าไม่เพียงพอ', {
          description: data.message || `มีสินค้าเหลือเพียง ${data.available_quantity} ชิ้น`,
        });
        return false;
      }
      
      // จองสินค้า
      const reserveResponse = await fetch('/api/inventory/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          quantity,
        }),
      });
      
      const reserveData = await reserveResponse.json();
      
      if (!reserveData.success) {
        toast.error('ไม่สามารถจองสินค้าได้', {
          description: reserveData.message || 'กรุณาลองใหม่อีกครั้ง',
        });
        return false;
      }
      
      // เพิ่มสินค้าลงตะกร้า
      setCart(prevCart => {
        // ตรวจสอบว่ามีสินค้านี้ในตะกร้าแล้วหรือไม่
        const existingItemIndex = prevCart.findIndex(item => item.productId === product._id);
        
        if (existingItemIndex !== -1) {
          // ถ้ามีสินค้านี้ในตะกร้าแล้ว ให้เพิ่มจำนวน
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          return updatedCart;
        } else {
          // ถ้ายังไม่มีสินค้านี้ในตะกร้า ให้เพิ่มรายการใหม่
          return [...prevCart, {
            productId: product._id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.images?.[0]?.url,
          }];
        }
      });
      
      return true;
    } catch (error) {
      toast.error('เกิดข้อผิดพลาด', {
        description: 'ไม่สามารถเพิ่มสินค้าลงตะกร้าได้',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ลบสินค้าออกจากตะกร้า
  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    
    try {
      // หาสินค้าในตะกร้า
      const item = cart.find(item => item.productId === productId);
      
      if (!item) {
        return false;
      }
      
      // ยกเลิกการจองสินค้า
      const response = await fetch('/api/inventory/reserve', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: item.quantity,
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('Failed to release inventory:', data.message);
      }
      
      // ลบสินค้าออกจากตะกร้า
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
      
      return true;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // อัพเดตจำนวนสินค้าในตะกร้า
  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      return removeFromCart(productId);
    }
    
    setIsLoading(true);
    
    try {
      // หาสินค้าในตะกร้า
      const item = cart.find(item => item.productId === productId);
      
      if (!item) {
        return false;
      }
      
      const quantityDiff = newQuantity - item.quantity;
      
      if (quantityDiff === 0) {
        return true; // ไม่มีการเปลี่ยนแปลง
      }
      
      if (quantityDiff > 0) {
        // เพิ่มจำนวนสินค้า
        const response = await fetch('/api/inventory/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity: quantityDiff,
          }),
        });
        
        const data = await response.json();
        
        if (!data.success || !data.available) {
          toast.error('สินค้าไม่เพียงพอ', {
            description: data.message || `มีสินค้าเหลือเพียง ${data.available_quantity} ชิ้น`,
          });
          return false;
        }
        
        // จองสินค้าเพิ่ม
        const reserveResponse = await fetch('/api/inventory/reserve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity: quantityDiff,
          }),
        });
        
        const reserveData = await reserveResponse.json();
        
        if (!reserveData.success) {
          toast.error('ไม่สามารถจองสินค้าได้', {
            description: reserveData.message || 'กรุณาลองใหม่อีกครั้ง',
          });
          return false;
        }
      } else {
        // ลดจำนวนสินค้า
        const response = await fetch('/api/inventory/reserve', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId,
            quantity: Math.abs(quantityDiff),
          }),
        });
        
        const data = await response.json();
        
        if (!data.success) {
          console.error('Failed to release inventory:', data.message);
        }
      }
      
      // อัพเดตจำนวนสินค้าในตะกร้า
      setCart(prevCart => {
        const updatedCart = [...prevCart];
        const itemIndex = updatedCart.findIndex(item => item.productId === productId);
        
        if (itemIndex !== -1) {
          updatedCart[itemIndex].quantity = newQuantity;
        }
        
        return updatedCart;
      });
      
      return true;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ล้างตะกร้า
  const clearCart = async () => {
    setIsLoading(true);
    
    try {
      // ยกเลิกการจองสินค้าทั้งหมด
      const promises = cart.map(item => 
        fetch('/api/inventory/reserve', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        })
      );
      
      await Promise.all(promises);
      
      // ล้างตะกร้า
      setCart([]);
      
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // คำนวณราคารวม
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
  };
} 