import { Box, Container, Typography, Grid, Chip, Button, Stack } from '@mui/material'
import Link from 'next/link'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

export const metadata = {
  title: 'Blog & Recursos',
  description: 'Artículos, tutoriales y videos sobre producción musical.',
}

const posts = [
  {
    id: '1',
    title: 'Cómo mezclar bajos en producción trap moderna',
    excerpt: 'Aprende las técnicas profesionales para conseguir ese sonido de bajo característico del trap actual.',
    category: 'Mezcla',
    readTime: '8 min',
    date: 'Feb 2026',
    youtubeId: null,
    color: '#FF6B35',
    slug: 'mezclar-bajos-trap',
  },
  {
    id: '2',
    title: 'Los mejores plugins gratuitos de 2024',
    excerpt: 'Recopilación de los mejores VST gratuitos que deberías tener en tu DAW.',
    category: 'Recursos',
    readTime: '12 min',
    date: 'Ene 2026',
    youtubeId: null,
    color: '#4ECDC4',
    slug: 'mejores-plugins-gratuitos-2024',
  },
  {
    id: '3',
    title: 'Cómo crear un sample pack desde cero',
    excerpt: 'Guía completa para crear, organizar y vender tu propio sample pack en línea.',
    category: 'Producción',
    readTime: '15 min',
    date: 'Ene 2026',
    youtubeId: null,
    color: '#A29BFE',
    slug: 'crear-sample-pack',
  },
  {
    id: '4',
    title: 'Masterización con IA: ¿Reemplazará a los ingenieros?',
    excerpt: 'Analizamos las herramientas de masterización con inteligencia artificial y su futuro.',
    category: 'Mastering',
    readTime: '10 min',
    date: 'Dic 2025',
    youtubeId: null,
    color: '#FFE66D',
    slug: 'masterizacion-ia',
  },
  {
    id: '5',
    title: 'Tutorial: Sidechain compression para principiantes',
    excerpt: 'Entiende y aplica el sidechain compression para dar energía a tus producciones.',
    category: 'Tutorial',
    readTime: '6 min',
    date: 'Dic 2025',
    youtubeId: null,
    color: '#FF6B35',
    slug: 'sidechain-compression',
  },
  {
    id: '6',
    title: 'Cómo monetizar tu música en streaming',
    excerpt: 'Estrategias probadas para generar ingresos con tu música en Spotify, Apple Music y más.',
    category: 'Negocios',
    readTime: '11 min',
    date: 'Nov 2025',
    youtubeId: null,
    color: '#4ECDC4',
    slug: 'monetizar-musica-streaming',
  },
]

const categories = ['Todos', 'Mezcla', 'Mastering', 'Producción', 'Recursos', 'Tutorial', 'Negocios']

export default function BlogPage() {
  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
          py: { xs: 10, md: 14 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" fontWeight={900} sx={{ color: '#FFFFFF', fontSize: { xs: '2rem', md: '3rem' } }}>
            Blog & Recursos
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mt: 2, fontWeight: 400 }}>
            Tutoriales, consejos y recursos para llevar tu producción al siguiente nivel
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="xl">
          <Stack direction="row" spacing={1} mb={6} flexWrap="wrap" gap={1} justifyContent="center">
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                clickable
                sx={{
                  fontWeight: 600,
                  '&:hover': { background: 'rgba(255,107,53,0.1)', color: '#FF6B35' },
                }}
              />
            ))}
          </Stack>

          <Grid container spacing={4}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} lg={4} key={post.id}>
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 180,
                      background: `linear-gradient(135deg, ${post.color}20, ${post.color}40)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 60, color: post.color, opacity: 0.4 }} />
                    <Chip
                      label={post.category}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: post.color,
                        color: '#FFF',
                        fontWeight: 700,
                        fontSize: '0.65rem',
                      }}
                    />
                  </Box>

                  <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                      component={Link}
                      href={`/blog/${post.slug}`}
                      variant="subtitle1"
                      fontWeight={700}
                      sx={{
                        textDecoration: 'none',
                        color: 'text.primary',
                        mb: 1.5,
                        display: 'block',
                        lineHeight: 1.4,
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7} mb={2} flex={1}>
                      {post.excerpt}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        <Typography variant="caption" color="text.disabled">
                          {post.readTime}
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.disabled">
                        {post.date}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              variant="outlined"
              size="large"
              sx={{ borderRadius: 3, fontWeight: 700, px: 5 }}
            >
              Cargar más artículos
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
