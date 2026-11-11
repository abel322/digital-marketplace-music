'use client'

import { Box, Container, Typography, Grid } from '@mui/material'
import Link from 'next/link'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'

const categories = [
  {
    icon: <SchoolIcon sx={{ fontSize: 48 }} />,
    title: 'Cursos Online',
    desc: 'Producción musical, mezcla, mastering y más',
    count: 'Cursos',
    color: '#FF6B35',
    gradient: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
    href: '/products?type=COURSE',
  },
  {
    icon: <MusicNoteIcon sx={{ fontSize: 48 }} />,
    title: 'Música Digital',
    desc: 'Pistas, instrumentales y beats únicos',
    count: 'Beats & Tracks',
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4, #45B7D1)',
    href: '/products?type=MUSIC',
  },
  {
    icon: <GraphicEqIcon sx={{ fontSize: 48 }} />,
    title: 'Samples & Loops',
    desc: 'Librerías profesionales de alta calidad',
    count: 'Samples & Loops',
    color: '#FFE66D',
    gradient: 'linear-gradient(135deg, #FFE66D, #F9D423)',
    href: '/products?type=SAMPLES',
  },
  {
    icon: <LibraryMusicIcon sx={{ fontSize: 48 }} />,
    title: 'Packs Bundle',
    desc: 'Colecciones completas con descuento',
    count: 'Bundles',
    color: '#A29BFE',
    gradient: 'linear-gradient(135deg, #A29BFE, #6C5CE7)',
    href: '/products?type=BUNDLES',
  },
]

export default function CategoriesSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, background: '#090d16' }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={7}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3 }}
          >
            CATEGORÍAS
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ mt: 1, color: '#FFFFFF', fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Todo lo que necesitas para
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                ml: 1,
              }}
            >
              triunfar
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}
          >
            Explora nuestra colección de productos digitales diseñados para músicos y productores
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item xs={12} sm={6} lg={3} key={cat.title}>
              <Box
                component={Link}
                href={cat.href}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  p: 4,
                  borderRadius: 4,
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    border: `1px solid ${cat.color}60`,
                    boxShadow: `0 20px 40px ${cat.color}20`,
                    '& .cat-icon': {
                      transform: 'scale(1.1)',
                    },
                  },
                }}
              >
                <Box
                  className="cat-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    background: cat.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    mb: 3,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {cat.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} mb={1} sx={{ color: '#FFFFFF' }}>
                  {cat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2} lineHeight={1.6}>
                  {cat.desc}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{
                    color: cat.color,
                    background: `${cat.color}15`,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                  }}
                >
                  {cat.count}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
