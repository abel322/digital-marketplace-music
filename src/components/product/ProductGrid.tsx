'use client'

import { Grid, Box, Skeleton, Typography } from '@mui/material'
import ProductCard from './ProductCard'

interface Product {
  id: string
  title: string
  slug: string
  price: number
  originalPrice?: number | null
  type: string
  images?: string[]
  rating?: number
  reviewCount?: number
  badge?: string
  badgeColor?: string
  previewUrl?: string | null
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  skeletonCount?: number
  columns?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number }
  emptyMessage?: string
}

function ProductSkeleton() {
  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 0 }} />
      <Box sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1.5 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="circular" width={16} height={16} />
          ))}
          <Skeleton variant="text" width={40} height={16} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Skeleton variant="text" width={60} height={28} />
            <Skeleton variant="text" width={40} height={16} />
          </Box>
          <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Box>
  )
}

export default function ProductGrid({
  products,
  loading = false,
  skeletonCount = 8,
  columns = { xs: 12, sm: 6, md: 6, lg: 4, xl: 3 },
  emptyMessage = 'No se encontraron productos',
}: ProductGridProps) {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Grid item key={i} xs={columns.xs} sm={columns.sm} md={columns.md} lg={columns.lg} xl={columns.xl}>
            <ProductSkeleton />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (products.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 10,
          px: 4,
          borderRadius: 4,
          background: 'rgba(255,107,53,0.04)',
          border: '2px dashed rgba(255,107,53,0.2)',
        }}
      >
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          {emptyMessage}
        </Typography>
        <Typography variant="body2" color="text.disabled" mt={1}>
          Intenta con otros filtros o términos de búsqueda
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {products.map((product, index) => (
        <Grid
          item
          key={product.id}
          xs={columns.xs}
          sm={columns.sm}
          md={columns.md}
          lg={columns.lg}
          xl={columns.xl}
          sx={{
            animation: 'fadeIn 0.4s ease forwards',
            animationDelay: `${index * 0.05}s`,
            opacity: 0,
            '@keyframes fadeIn': {
              from: { opacity: 0, transform: 'translateY(16px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <ProductCard {...product} />
        </Grid>
      ))}
    </Grid>
  )
}
