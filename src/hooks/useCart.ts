'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'
import axios from 'axios'

// ============================================================================
// INTERFACES
// ============================================================================

export interface CartItem {
  id: string
  productId: string
  title: string
  price: number
  quantity: number
  imageUrl: string
}

export interface UseCartReturn {
  items: CartItem[]
  total: number
  itemCount: number
  loading: boolean
  discount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  applyCoupon: (code: string) => Promise<void>
  clearCart: () => void
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CART_STORAGE_KEY = 'digital-marketplace-cart'

// ============================================================================
// USE CART HOOK
// ============================================================================

export function useCart(): UseCartReturn {
  const { isAuthenticated, user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [discount, setDiscount] = useState(0)

  // ============================================================================
  // LOAD CART ON MOUNT
  // ============================================================================

  useEffect(() => {
    loadCart()
  }, [isAuthenticated])

  // ============================================================================
  // SYNC WITH SERVER (for authenticated users)
  // ============================================================================

  useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      syncWithServer()
    }
  }, [items, isAuthenticated])

  // ============================================================================
  // LOAD CART
  // ============================================================================

  const loadCart = async () => {
    try {
      setLoading(true)

      if (isAuthenticated) {
        // Load from server
        const response = await axios.get('/api/cart')
        setItems(response.data.items || [])
      } else {
        // Load from localStorage
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          setItems(JSON.parse(stored))
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
      // Fallback to localStorage
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } finally {
      setLoading(false)
    }
  }

  // ============================================================================
  // SYNC WITH SERVER
  // ============================================================================

  const syncWithServer = async () => {
    try {
      await axios.post('/api/cart/sync', { items })
    } catch (error) {
      console.error('Failed to sync cart with server:', error)
    }
  }

  // ============================================================================
  // PERSIST TO LOCALSTORAGE
  // ============================================================================

  const persistToLocalStorage = (newItems: CartItem[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems))
  }

  // ============================================================================
  // ADD ITEM
  // ============================================================================

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.productId === item.productId)

      let newItems: CartItem[]
      if (existingItem) {
        // Increment quantity
        newItems = prevItems.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      } else {
        // Add new item
        newItems = [...prevItems, { ...item, quantity: 1 }]
      }

      // Persist for guests
      if (!isAuthenticated) {
        persistToLocalStorage(newItems)
      }

      return newItems
    })
  }, [isAuthenticated])

  // ============================================================================
  // UPDATE QUANTITY
  // ============================================================================

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prevItems => {
      let newItems: CartItem[]

      if (quantity === 0) {
        // Remove item
        newItems = prevItems.filter(i => i.productId !== productId)
      } else {
        // Update quantity
        newItems = prevItems.map(i =>
          i.productId === productId ? { ...i, quantity } : i
        )
      }

      // Persist for guests
      if (!isAuthenticated) {
        persistToLocalStorage(newItems)
      }

      return newItems
    })
  }, [isAuthenticated])

  // ============================================================================
  // REMOVE ITEM
  // ============================================================================

  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(i => i.productId !== productId)

      // Persist for guests
      if (!isAuthenticated) {
        persistToLocalStorage(newItems)
      }

      return newItems
    })
  }, [isAuthenticated])

  // ============================================================================
  // APPLY COUPON
  // ============================================================================

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const response = await axios.post('/api/coupons/validate', { code })
      
      if (response.data.valid) {
        const discountAmount = response.data.discount
        setDiscount(discountAmount)
      } else {
        throw new Error('Invalid coupon code')
      }
    } catch (error) {
      console.error('Failed to apply coupon:', error)
      throw error
    }
  }, [])

  // ============================================================================
  // CLEAR CART
  // ============================================================================

  const clearCart = useCallback(() => {
    setItems([])
    setDiscount(0)
    
    if (!isAuthenticated) {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [isAuthenticated])

  // ============================================================================
  // CALCULATE TOTAL
  // ============================================================================

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = Math.max(0, subtotal - discount)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    items,
    total,
    itemCount,
    loading,
    discount,
    addItem,
    updateQuantity,
    removeItem,
    applyCoupon,
    clearCart,
  }
}
