import { Box, Container, Typography, Grid, Stack, Avatar, Chip } from '@mui/material'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import GroupIcon from '@mui/icons-material/Group'

const stats = [
  { icon: <SchoolIcon />, value: '500+', label: 'Productos Digitales', color: '#FF6B35' },
  { icon: <GroupIcon />, value: '10K+', label: 'Clientes Satisfechos', color: '#4ECDC4' },
  { icon: <MusicNoteIcon />, value: '5K+', label: 'Samples & Loops', color: '#A29BFE' },
  { icon: <EmojiEventsIcon />, value: '4.9★', label: 'Valoración Media', color: '#FFE66D' },
]

const team = [
  { name: 'Alejandro García', role: 'Fundador & Productor', avatar: 'A', color: '#FF6B35' },
  { name: 'Sofía Reyes', role: 'Directora de Contenido', avatar: 'S', color: '#4ECDC4' },
  { name: 'Luis Hernández', role: 'Lead Developer', avatar: 'L', color: '#A29BFE' },
]

export const metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce el equipo detrás de Digital Marketplace y nuestra misión.',
}

export default function AboutPage() {
  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          py: { xs: 10, md: 16 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{ color: '#4ECDC4', fontWeight: 700, letterSpacing: 3 }}
          >
            SOBRE NOSOTROS
          </Typography>
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{ color: '#FFFFFF', mt: 1, fontSize: { xs: '2rem', md: '3.5rem' } }}
          >
            Creamos el futuro de la{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              música digital
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.7)', mt: 3, fontWeight: 400, lineHeight: 1.8 }}
          >
            Somos una plataforma dedicada a empoderar a músicos y productores con herramientas,
            conocimiento y recursos de la más alta calidad.
          </Typography>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, background: '#F8F9FA' }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                  <Typography variant="h4" fontWeight={800} sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3 }}
              >
                NUESTRA MISIÓN
              </Typography>
              <Typography variant="h3" fontWeight={800} mt={1} mb={3} fontSize={{ xs: '1.8rem', md: '2.5rem' }}>
                Democratizar la producción musical profesional
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={3}>
                Creemos que cada músico merece acceso a recursos de calidad sin importar su
                presupuesto o ubicación. Por eso creamos una plataforma donde puedes aprender,
                descargar y vender productos digitales de forma fácil y segura.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {['Calidad Premium', 'Soporte 24/7', 'Garantía 30 días', 'Licencia Comercial'].map(
                  (tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{
                        background: 'rgba(255,107,53,0.1)',
                        color: '#FF6B35',
                        fontWeight: 600,
                        border: '1px solid rgba(255,107,53,0.2)',
                      }}
                    />
                  )
                )}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
                  p: 4,
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                <Typography variant="h4" fontWeight={800} mb={2}>
                  Fundado en 2023
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                  Comenzamos como un pequeño proyecto de músicos para músicos. Hoy somos la
                  plataforma de referencia en habla hispana para productos digitales musicales.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 10 }, background: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={7}>
            <Typography
              variant="overline"
              sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 3 }}
            >
              EQUIPO
            </Typography>
            <Typography variant="h3" fontWeight={800} mt={1} fontSize={{ xs: '1.8rem', md: '2.5rem' }}>
              Las personas detrás del proyecto
            </Typography>
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {team.map((member) => (
              <Grid item xs={12} sm={4} key={member.name}>
                <Box
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: '#FFFFFF',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      background: `linear-gradient(135deg, ${member.color}, ${member.color}80)`,
                      fontSize: '2rem',
                      fontWeight: 700,
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700}>
                    {member.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}
