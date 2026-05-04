'use client'

import { Box, Container, Typography, Grid, Avatar, Rating, Stack } from '@mui/material'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'

const testimonials = [
  {
    name: 'Carlos Martínez',
    role: 'Productor Musical',
    avatar: 'C',
    rating: 5,
    text: 'Los cursos cambiaron completamente mi forma de producir. En 3 meses pasé de aficionado a tener mis primeras ventas en Spotify.',
    color: '#FF6B35',
  },
  {
    name: 'Ana López',
    role: 'DJ & Compositora',
    avatar: 'A',
    rating: 5,
    text: 'Los samples son increíbles. La calidad es profesional y los packs tienen exactamente lo que necesito para mis sets.',
    color: '#4ECDC4',
  },
  {
    name: 'Miguel Torres',
    role: 'Beatmaker',
    avatar: 'M',
    rating: 5,
    text: 'Compré el bundle completo y fue la mejor inversión. Ahora vendo mis beats en línea y genero ingresos pasivos.',
    color: '#A29BFE',
  },
]

export default function TestimonialsSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
      }}
    >
      <Container maxWidth="xl">
        <Box textAlign="center" mb={7}>
          <Typography
            variant="overline"
            sx={{ color: '#4ECDC4', fontWeight: 700, letterSpacing: 3 }}
          >
            TESTIMONIOS
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mt: 1, color: '#FFFFFF', fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Lo que dicen nuestros clientes
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {testimonials.map((t) => (
            <Grid item xs={12} md={4} key={t.name}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.08)',
                    transform: 'translateY(-4px)',
                    border: `1px solid ${t.color}40`,
                  },
                }}
              >
                <FormatQuoteIcon sx={{ fontSize: 40, color: t.color, mb: 2, opacity: 0.7 }} />
                <Typography
                  variant="body1"
                  sx={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, flex: 1, mb: 3 }}
                >
                  {t.text}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ background: t.color, fontWeight: 700 }}>{t.avatar}</Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#FFFFFF' }}>
                      {t.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      {t.role}
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 'auto' }}>
                    <Rating value={t.rating} size="small" readOnly sx={{ color: '#FFE66D' }} />
                  </Box>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
