'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useRole } from '@/hooks/auth-hooks'
import type { Product } from '../../sanity.types'

// Define the shape of your context's state
interface AppState {
  isCartOpen: boolean
  toggleCart: () => void
  // Cart-related state
  cartItemCount: number
  setCartItemCount: (count: number) => void
  // Navigation state
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  // Search state
  searchQuery: string
  setSearchQuery: (query: string) => void
  // Products-related state
  products: Product[]
  setProducts: (products: Product[]) => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  // Add other global state and functions here
}

// Create the context with a default value
const AppContext = createContext<AppState | undefined>(undefined)

// Create the provider component
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState)
  }

  const value = {
    isCartOpen,
    toggleCart,
    cartItemCount,
    setCartItemCount,
    isMobileMenuOpen,
    toggleMobileMenu,
    searchQuery,
    setSearchQuery,
    // Products-related state
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Create a custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }

  // เพิ่ม auth และ router logic
  const { user } = useUser()
  const { isSeller } = useRole()
  const router = useRouter()

  return {
    ...context,
    // Auth-related properties
    user,
    isSeller,
    // Navigation
    router,
  }
}

// Utility hook สำหรับใช้เฉพาะ cart state
export const useCart = () => {
  const { isCartOpen, toggleCart, cartItemCount, setCartItemCount } = useAppContext()
  
  return {
    isCartOpen,
    toggleCart,
    cartItemCount,
    setCartItemCount,
    addToCart: () => setCartItemCount(cartItemCount + 1),
    removeFromCart: () => setCartItemCount(Math.max(0, cartItemCount - 1)),
  }
}

// Utility hook สำหรับใช้เฉพาะ navigation state
export const useNavigation = () => {
  const { isMobileMenuOpen, toggleMobileMenu, router } = useAppContext()
  
  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    router,
  }
}

// Utility hook สำหรับใช้เฉพาะ search state
export const useSearch = () => {
  const { searchQuery, setSearchQuery } = useAppContext()
  
  return {
    searchQuery,
    setSearchQuery,
    clearSearch: () => setSearchQuery(''),
  }
}

// Utility hook สำหรับใช้เฉพาะ products state
export const useProducts = () => {
  const { products, setProducts, selectedProduct, setSelectedProduct } = useAppContext()
  return {
    products,
    setProducts,
    selectedProduct,
    setSelectedProduct,
  }
}