'use client'

import useSWR from 'swr'
import { useState, useCallback } from 'react'
import axios from 'axios'

// ============================================================================
// INTERFACES
// ============================================================================

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  price: number
  originalPrice?: number
  category: 'COURSE' | 'MUSIC' | 'SAMPLE' | 'LOOP'
  images: string[]
  rating: number
  reviewCount: number
  featured: boolean
  published: boolean
}

export interface UseProductsOptions {
  category?: 'COURSE' | 'MUSIC' | 'SAMPLE' | 'LOOP'
  search?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  pagination: PaginationInfo
  filters: UseProductsOptions
  setFilters: (filters: UseProductsOptions) => void
  nextPage: () => void
  previousPage: () => void
  getProductById: (id: string) => Promise<Product | null>
  refresh: () => void
}

// ============================================================================
// FETCHER
// ============================================================================

const fetcher = async (url: string) => {
  const response = await axios.get(url)
  return response.data
}

// ============================================================================
// USE PRODUCTS HOOK
// ============================================================================

export function useProducts(initialOptions: UseProductsOptions = {}): UseProductsReturn {
  const [filters, setFilters] = useState<UseProductsOptions>({
    page: 1,
    limit: 12,
    ...initialOptions,
  })

  // ============================================================================
  // BUILD QUERY STRING
  // ============================================================================

  const buildQueryString = useCallback((options: UseProductsOptions): string => {
    const params = new URLSearchParams()

    if (options.category) params.append('category', options.category)
    if (options.search) params.append('search', options.search)
    if (options.minPrice !== undefined) params.append('minPrice', options.minPrice.toString())
    if (options.maxPrice !== undefined) params.append('maxPrice', options.maxPrice.toString())
    if (options.page) params.append('page', options.page.toString())
    if (options.limit) params.append('limit', options.limit.toString())

    return params.toString()
  }, [])

  // ============================================================================
  // SWR HOOK
  // ============================================================================

  const queryString = buildQueryString(filters)
  const { data, error, isLoading, mutate } = useSWR(
    `/api/products?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  // ============================================================================
  // PAGINATION
  // ============================================================================

  const nextPage = useCallback(() => {
    if (data?.pagination && filters.page! < data.pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))
    }
  }, [data?.pagination, filters.page])

  const previousPage = useCallback(() => {
    if (filters.page! > 1) {
      setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))
    }
  }, [filters.page])

  // ============================================================================
  // GET PRODUCT BY ID
  // ============================================================================

  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      const response = await axios.get(`/api/products/${id}`)
      return response.data
    } catch (err) {
      console.error('Failed to fetch product:', err)
      return null
    }
  }, [])

  // ============================================================================
  // REFRESH
  // ============================================================================

  const refresh = useCallback(() => {
    mutate()
  }, [mutate])

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    products: data?.products || [],
    loading: isLoading,
    error: error ? 'Failed to load products' : null,
    pagination: data?.pagination || {
      page: filters.page || 1,
      limit: filters.limit || 12,
      total: 0,
      totalPages: 0,
    },
    filters,
    setFilters,
    nextPage,
    previousPage,
    getProductById,
    refresh,
  }
}
