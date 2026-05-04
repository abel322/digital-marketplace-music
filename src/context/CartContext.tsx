'use client'
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import toast from 'react-hot-toast'
import type { CartItem, CartState, Coupon } from '@/types'

// Lightweight product for adding to cart — does not require all Product fields
export interface CartProduct {
  id: string
  title: string
  price: number
  type: string
  slug?: string
  image?: string | null
  comparePrice?: number | null
  images?: string[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: CartProduct }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'APPLY_COUPON'; coupon: Coupon }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE'; state: CartState }

const STORAGE_KEY = 'dm_cart'

function calcTotals(items: CartItem[], coupon?: Coupon | null) {
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  let discount = 0
  if (coupon) {
    discount =
      coupon.type === 'PERCENTAGE'
        ? (subtotal * coupon.discount) / 100
        : Math.min(coupon.discount, subtotal)
  }
  return { subtotal, discount, total: subtotal - discount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state

    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      const items = existing
        ? state.items.map((i) =>
          i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        : [...state.items, { product: action.product as any, quantity: 1 }]
      return { ...state, items, ...calcTotals(items, state.coupon) }
    }

    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.product.id !== action.productId)
      return { ...state, items, ...calcTotals(items, state.coupon) }
    }

    case 'UPDATE_QUANTITY': {
      if (action.quantity < 1) {
        const items = state.items.filter((i) => i.product.id !== action.productId)
        return { ...state, items, ...calcTotals(items, state.coupon) }
      }
      const items = state.items.map((i) =>
        i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
      )
      return { ...state, items, ...calcTotals(items, state.coupon) }
    }

    case 'APPLY_COUPON':
      return { ...state, coupon: action.coupon, ...calcTotals(state.items, action.coupon) }

    case 'REMOVE_COUPON':
      return { ...state, coupon: null, ...calcTotals(state.items, null) }

    case 'CLEAR_CART':
      return { items: [], coupon: null, subtotal: 0, discount: 0, total: 0 }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  coupon: null,
  subtotal: 0,
  discount: 0,
  total: 0,
}

interface CartContextType extends CartState {
  addItem: (product: CartProduct) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  clearCart: () => void
  itemCount: number
  hasItem: (productId: string) => boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) })
    } catch { }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addItem = (product: CartProduct) => {
    dispatch({ type: 'ADD_ITEM', product })
    toast.success(`"${product.title}" añadido al carrito`, {
      icon: '🛒',
    })
  }

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }

  const applyCoupon = (coupon: Coupon) => {
    dispatch({ type: 'APPLY_COUPON', coupon })
    toast.success(`Cupón "${coupon.code}" aplicado — ${coupon.discount}${coupon.type === 'PERCENTAGE' ? '%' : '$'} de descuento`)
  }

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)

  const hasItem = (productId: string) => state.items.some((i) => i.product.id === productId)

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
        itemCount,
        hasItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
