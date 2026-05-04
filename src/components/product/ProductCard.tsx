'use client'

import { Box, Typography, Chip, Rating, Stack, Button, IconButton } from '@mui/material'
import Link from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useCart } from '@/context/CartContext'

interface ProductCardProps {
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

const typeColors: Record<string, string> = {
  COURSE: '#FF6B35',
  MUSIC: '#4ECDC4',
  SAMPLE_PACK: '#A29BFE',
  BUNDLE: '#FFE66D',
}

const typeLabels: Record<string, string> = {
  COURSE: 'Curso',
  MUSIC: 'Música',
  SAMPLE_PACK: 'Samples',
  BUNDLE: 'Bundle',
}

export default function ProductCard({
  id,
  title,
  slug,
  price,
  originalPrice,
  type,
  images,
  rating = 4.8,
  reviewCount = 0,
  badge,
  badgeColor = '#FF6B35',
  previewUrl,
}: ProductCardProps) {
  const { addItem } = useCart()
  const color = typeColors[type] || '#FF6B35'
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id, title, price, image: images?.[0] || null, type })
  }

  return (
    <Box
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 24px 48px rgba(0,0,0,0.12), 0 0 0 2px ${color}30`,
        },
        '&:hover .product-actions': {
          opacity: 1,
          transform: 'translateY(0)',
        },
        '&:hover .product-overlay': {
          opacity: 1,
        },
      }}
    >
      <Box
        component={Link}
        href={`/products/${slug}`}
        sx={{
          display: 'block',
          position: 'relative',
          height: 200,
          background: `linear-gradient(135deg, ${color}15, ${color}35)`,
          textDecoration: 'none',
          overflow: 'hidden',
        }}
      >
        {images?.[0] ? (
          <Box
            component="img"
            src={images[0]}
            alt={title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 64, color, opacity: 0.35 }} />
          </Box>
        )}

        <Box
          className="product-overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {previewUrl && (
            <IconButton
              sx={{
                background: 'rgba(255,255,255,0.9)',
                color: '#1A1A2E',
                '&:hover': { background: '#FFFFFF' },
              }}
            >
              <PlayArrowIcon />
            </IconButton>
          )}
        </Box>

        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: 'absolute', top: 10, left: 10, right: 10, justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={0.5}>
            {badge && (
              <Chip
                label={badge}
                size="small"
                sx={{
                  background: badgeColor,
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 20,
                }}
              />
            )}
            {discount > 0 && (
              <Chip
                label={`-${discount}%`}
                size="small"
                sx={{
                  background: '#2ECC71',
                  color: '#FFF',
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  height: 20,
                }}
              />
            )}
          </Stack>
          <Chip
            label={typeLabels[type] || type}
            size="small"
            sx={{
              background: 'rgba(0,0,0,0.55)',
              color: '#FFF',
              fontWeight: 600,
              fontSize: '0.6rem',
              height: 20,
            }}
          />
        </Stack>

        <IconButton
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            background: 'rgba(255,255,255,0.9)',
            width: 32,
            height: 32,
            color: 'text.secondary',
            '&:hover': { background: '#FFFFFF', color: 'error.main' },
          }}
          onClick={(e) => e.preventDefault()}
        >
          <FavoriteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          component={Link}
          href={`/products/${slug}`}
          variant="subtitle1"
          fontWeight={700}
          sx={{
            textDecoration: 'none',
            color: 'text.primary',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            '&:hover': { color: 'primary.main' },
          }}
        >
          {title}
        </Typography>

        {reviewCount > 0 && (
          <Stack direction="row" alignItems="center" spacing={0.5} mb={1.5}>
            <Rating value={rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {rating} ({reviewCount})
            </Typography>
          </Stack>
        )}

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1}>
                ${price}
              </Typography>
              {originalPrice && (
                <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                  ${originalPrice}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<ShoppingCartIcon sx={{ fontSize: '14px !important' }} />}
              onClick={handleAddToCart}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                fontWeight: 700,
                borderRadius: 2,
                fontSize: '0.75rem',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A25, #FF6B35)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Añadir
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
