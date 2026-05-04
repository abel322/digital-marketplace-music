'use client'

import { Box, Container, Typography, Grid, Chip, Button, Stack, Rating } from '@mui/material'
import Link from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

const featuredProducts = [
  {
    id: '1',
    title: 'Producción Musical Completa',
    category: 'Curso',
    price: 97,
    originalPrice: 197,
    rating: 4.9,
    reviews: 234,
    image: null,
    badge: 'MÁS VENDIDO',
    badgeColor: '#FF6B35',
    type: 'course',
    href: '/courses/produccion-musical-completa',
  },
  {
    id: '2',
    title: 'Pack Trap Essentials 2024',
    category: 'Samples',
    price: 29,
    originalPrice: 59,
    rating: 4.8,
    reviews: 189,
    image: null,
    badge: 'NUEVO',
    badgeColor: '#4ECDC4',
    type: 'samples',
    href: '/samples/trap-essentials-2024',
  },
  {
    id: '3',
    title: 'Lo-Fi Chill Beats Vol. 3',
    category: 'Música',
    price: 19,
    originalPrice: null,
    rating: 4.7,
    reviews: 156,
    image: null,
    badge: null,
    badgeColor: null,
    type: 'music',
    href: '/music/lofi-chill-beats-vol3',
  },
  {
    id: '4',
    title: 'Mezcla y Mastering Pro',
    category: 'Curso',
    price: 67,
    originalPrice: 127,
    rating: 4.9,
    reviews: 312,
    image: null,
    badge: 'OFERTA',
    badgeColor: '#FF6B35',
    type: 'course',
    href: '/courses/mezcla-mastering-pro',
  },
]

const categoryColors: Record<string, string> = {
  Curso: '#FF6B35',
  Samples: '#4ECDC4',
  Música: '#A29BFE',
  Bundle: '#FFE66D',
}

export default function FeaturedProducts() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#FFFFFF' }}>
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} mb={7}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3 }}
            >
              PRODUCTOS DESTACADOS
            </Typography>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ mt: 1, fontSize: { xs: '1.8rem', md: '2.5rem' } }}
            >
              Los más populares
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/products"
            variant="outlined"
            sx={{ mt: { xs: 2, sm: 0 }, borderRadius: 3, fontWeight: 700 }}
          >
            Ver todos
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} lg={3} key={product.id}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <Box
                  component={Link}
                  href={product.href}
                  sx={{
                    display: 'block',
                    position: 'relative',
                    height: 200,
                    background: `linear-gradient(135deg, ${categoryColors[product.category]}20, ${categoryColors[product.category]}40)`,
                    textDecoration: 'none',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayArrowIcon
                      sx={{
                        fontSize: 60,
                        color: categoryColors[product.category],
                        opacity: 0.5,
                      }}
                    />
                  </Box>
                  {product.badge && (
                    <Chip
                      label={product.badge}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: product.badgeColor,
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                      }}
                    />
                  )}
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#FFF',
                      fontWeight: 600,
                      fontSize: '0.65rem',
                    }}
                  />
                </Box>

                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    component={Link}
                    href={product.href}
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      textDecoration: 'none',
                      color: 'text.primary',
                      mb: 1,
                      display: 'block',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {product.title}
                  </Typography>

                  <Stack direction="row" alignItems="center" spacing={0.5} mb={2}>
                    <Rating value={product.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="caption" color="text.secondary">
                      ({product.reviews})
                    </Typography>
                  </Stack>

                  <Box sx={{ mt: 'auto' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" fontWeight={800} color="primary.main">
                          ${product.price}
                        </Typography>
                        {product.originalPrice && (
                          <Typography
                            variant="caption"
                            sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                          >
                            ${product.originalPrice}
                          </Typography>
                        )}
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon fontSize="small" />}
                        sx={{
                          background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                          fontWeight: 700,
                          borderRadius: 2,
                          '&:hover': { background: 'linear-gradient(135deg, #E55A25, #FF6B35)' },
                        }}
                      >
                        Añadir
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
