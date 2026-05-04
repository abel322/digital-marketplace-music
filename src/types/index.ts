export type Role = 'ADMIN' | 'INSTRUCTOR' | 'CUSTOMER'
export type Category = 'COURSE' | 'MUSIC' | 'SAMPLE' | 'LOOP'
export type ProductType = 'COURSE' | 'DIGITAL_DOWNLOAD'
export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type CouponType = 'PERCENTAGE' | 'FIXED'

export interface User {
  id: string
  email: string
  name?: string | null
  image?: string | null
  role: Role
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  bio?: string | null
  avatar?: string | null
  youtubeChannel?: string | null
  website?: string | null
  userId: string
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  originalPrice?: number | null
  category: Category
  type: ProductType
  authorId: string
  author?: User
  images: string[]
  previewUrl?: string | null
  fileUrl?: string | null
  youtubeId?: string | null
  features: string[]
  lessons?: Lesson[]
  reviews?: Review[]
  tags: string[]
  published: boolean
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  id: string
  title: string
  description?: string | null
  videoUrl: string
  videoId?: string | null
  duration?: number | null
  order: number
  isFree: boolean
  productId: string
  completedBy?: UserLesson[]
}

export interface UserLesson {
  userId: string
  lessonId: string
  completed: boolean
  completedAt?: Date | null
}

export interface Coupon {
  id: string
  code: string
  discount: number
  type: CouponType
  maxUses?: number | null
  usedCount: number
  expiresAt?: Date | null
  active: boolean
}

export interface Order {
  id: string
  userId: string
  user?: User
  items: OrderItem[]
  subtotal: number
  discount: number
  total: number
  status: OrderStatus
  paymentIntent?: string | null
  couponCode?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product?: Product
  quantity: number
  price: number
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  productId: string
  product?: Product
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
  coupon?: Coupon | null
  subtotal: number
  discount: number
  total: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ProductFilters {
  category?: Category
  type?: ProductType
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  search?: string
  featured?: boolean
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating'
  page?: number
  limit?: number
}
