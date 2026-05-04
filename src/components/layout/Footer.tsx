'use client'

import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  Divider,
  Link as MuiLink,
} from '@mui/material'
import Link from 'next/link'
import YouTubeIcon from '@mui/icons-material/YouTube'
import InstagramIcon from '@mui/icons-material/Instagram'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'

const footerLinks = {
  Productos: [
    { label: 'Cursos Online', href: '/courses' },
    { label: 'Música', href: '/music' },
    { label: 'Samples & Loops', href: '/samples' },
    { label: 'Packs Bundle', href: '/bundles' },
  ],
  Empresa: [
    { label: 'Sobre Nosotros', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Afiliados', href: '/affiliates' },
    { label: 'Contacto', href: '/contact' },
  ],
  Soporte: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Centro de Ayuda', href: '/help' },
    { label: 'Política de Devolución', href: '/refunds' },
    { label: 'Términos de Servicio', href: '/terms' },
  ],
}

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
        color: 'rgba(255,255,255,0.8)',
        pt: 8,
        pb: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              DigitalMarket
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3, lineHeight: 1.8 }}>
              La plataforma de referencia para comprar y vender productos digitales: cursos, música,
              samples y loops de alta calidad.
            </Typography>
            <Stack direction="row" spacing={1}>
              {[
                { icon: <YouTubeIcon />, href: 'https://youtube.com', color: '#FF0000' },
                { icon: <InstagramIcon />, href: 'https://instagram.com', color: '#E1306C' },
                { icon: <TwitterIcon />, href: 'https://twitter.com', color: '#1DA1F2' },
                { icon: <FacebookIcon />, href: 'https://facebook.com', color: '#1877F2' },
              ].map((social, i) => (
                <IconButton
                  key={i}
                  component="a"
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    '&:hover': { color: social.color, transform: 'translateY(-2px)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid item xs={6} md={2.5} key={title}>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ color: '#FFFFFF', mb: 2 }}
              >
                {title}
              </Typography>
              <Stack spacing={1}>
                {links.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    underline="none"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.875rem',
                      transition: 'color 0.2s ease',
                      '&:hover': { color: '#FF6B35' },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} DigitalMarket. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={3}>
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <MuiLink
                key={item}
                component={Link}
                href={`/${item.toLowerCase()}`}
                underline="none"
                sx={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.75rem',
                  '&:hover': { color: '#FF6B35' },
                }}
              >
                {item}
              </MuiLink>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
