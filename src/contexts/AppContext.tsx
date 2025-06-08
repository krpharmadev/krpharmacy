'use client'; // ระบุว่าเป็น client component

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession, SessionProvider } from 'next-auth/react';
import { toast } from 'sonner';
import { UserRole } from '@/lib/auth';

// Define types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  imageUrl?: string;
  classifications?: string[];
}

interface UserData {
  cartItems: Record<string, number>;
  // Add other user data fields as needed
}

interface AppContextType {
  user: any; // ใช้ any เพื่อหลีกเลี่ยงปัญหา type compatibility
  getToken: () => Promise<string | undefined>;
  currency: string | undefined;
  router: ReturnType<typeof useRouter>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  userData: UserData | false;
  fetchUserData: () => Promise<void>;
  products: Product[];
  fetchProductData: () => Promise<void>;
  cartItems: Record<string, number>;
  setCartItems: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  addToCart: (itemId: string) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  getCartCount: () => number;
  getCartAmount: () => number;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

const AppContextProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [products, setProducts] = useState<Product[]>([]);
  const [userData, setUserData] = useState<UserData | false>(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const getToken = async (): Promise<string | undefined> => {
    // จัดการ token ตามที่คุณต้องการ เช่น JWT หรือ cookie-based session
    return undefined;
  };

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user?.role === 'admin' || user?.role === 'inventory_staff') {
        setIsSeller(true);
      }

      const token = await getToken();
      if (!token) return; // ไม่ throw error เพื่อให้ไม่มีการแสดง error ในกรณีที่ไม่มี token

      const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const addToCart = async (itemId: string): Promise<void> => {
    if (!user) {
      toast('กรุณาเข้าสู่ระบบ', { icon: '⚠️' });
      return;
    }

    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        if (!token) return;
        await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('เพิ่มสินค้าลงตะกร้าแล้ว');
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number): Promise<void> => {
    let cartData = structuredClone(cartItems);
    if (quantity === 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        if (!token) return;
        await axios.post('/api/cart/update', { cartData }, { headers: { Authorization: `Bearer ${token}` } });
        toast.success('อัปเดตตะกร้าแล้ว');
      } catch (error) {
        toast.error((error as Error).message);
      }
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalCount += cartItems[item];
      }
    }
    return totalCount;
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const itemInfo = products.find((product) => product.id === item);
      if (cartItems[item] > 0 && itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value: AppContextType = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SessionProvider><AppContextProviderContent>{children}</AppContextProviderContent></SessionProvider>;
};