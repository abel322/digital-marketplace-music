'use client'

import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material'
import Link from 'next/link'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import GraphicEqIcon from '@mui/icons-material/GraphicEq'

export default function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: { xs: '100vh', md: '90vh' },
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
        position: 'relative',
        overflow: 'hidden',
        mt: -9,
        pt: 9,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: { xs: 400, md: 700 },
          height: { xs: 400, md: 700 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(78,205,196,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={{ xs: 6, lg: 8 }}
          alignItems="center"
        >
          <Box sx={{ flex: 1, maxWidth: { lg: 600 } }}>
            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
              {['Cursos Online', 'Música', 'Samples & Loops'].map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    background: 'rgba(255,107,53,0.15)',
                    color: '#FF6B35',
                    border: '1px solid rgba(255,107,53,0.3)',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Stack>

            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                mb: 3,
              }}
            >
              Tu Música.
              <Box
                component="span"
                sx={{
                  display: 'block',
                  background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tu Carrera.
              </Box>
              Tu Éxito.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400,
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 520,
              }}
            >
              Aprende producción musical, descarga samples y loops profesionales, y lleva tu música
              al siguiente nivel con nuestros cursos online.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={5}>
              <Button
                component={Link}
                href="/courses"
                variant="contained"
                size="large"
                startIcon={<SchoolIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                  fontWeight: 700,
                  px: 4,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: '1rem',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A25, #FF6B35)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(255,107,53,0.4)',
                  },
                }}
              >
                Ver Cursos
              </Button>
              <Button
                component={Link}
                href="/samples"
                variant="outlined"
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  px: 4,
                  py: 1.8,
                  borderRadius: 3,
                  fontSize: '1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#4ECDC4',
                    color: '#4ECDC4',
                    background: 'rgba(78,205,196,0.08)',
                    borderWidth: 2,
                  },
                }}
              >
                Escuchar Samples
              </Button>
            </Stack>

            <Stack direction="row" spacing={4}>
              {[
                { value: '500+', label: 'Productos' },
                { value: '10K+', label: 'Clientes' },
                { value: '4.9★', label: 'Valoración' },
              ].map((stat) => (
                <Box key={stat.label}>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              maxWidth: { lg: 500 },
            }}
          >
            {[
              {
                icon: <SchoolIcon sx={{ fontSize: 40 }} />,
                title: 'Cursos Online',
                desc: 'Aprende con expertos',
                color: '#FF6B35',
                href: '/courses',
              },
              {
                icon: <MusicNoteIcon sx={{ fontSize: 40 }} />,
                title: 'Música Digital',
                desc: 'Pistas y beats únicos',
                color: '#4ECDC4',
                href: '/music',
              },
              {
                icon: <GraphicEqIcon sx={{ fontSize: 40 }} />,
                title: 'Samples & Loops',
                desc: 'Librerías profesionales',
                color: '#FFE66D',
                href: '/samples',
              },
            ].map((card) => (
              <Box
                key={card.title}
                component={Link}
                href={card.href}
                sx={{
                  width: { xs: '45%', sm: 160 },
                  p: 3,
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255,255,255,0.1)',
                    border: `1px solid ${card.color}40`,
                    boxShadow: `0 20px 40px ${card.color}20`,
                  },
                }}
              >
                <Box sx={{ color: card.color, mb: 1.5 }}>{card.icon}</Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#FFFFFF', mb: 0.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  {card.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
