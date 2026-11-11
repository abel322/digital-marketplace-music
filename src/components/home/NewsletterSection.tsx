'use client'

import { useState } from 'react'
import { Box, Container, Typography, TextField, Button, Stack, Alert } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, px: { xs: 2, sm: 4 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 6, md: 8 },
            px: { xs: 3, sm: 6, md: 8 },
            borderRadius: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.92) 0%, rgba(78, 205, 196, 0.92) 100%)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <EmailIcon sx={{ fontSize: 44, color: 'rgba(255,255,255,0.95)' }} />
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{ color: '#FFFFFF', fontSize: { xs: '1.75rem', md: '2.4rem' }, letterSpacing: '-0.02em' }}
            >
              Únete a nuestra comunidad
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, maxWidth: 520, fontSize: { xs: '0.95rem', md: '1.05rem' } }}>
              Recibe ofertas exclusivas, nuevos samples gratis y consejos de producción directamente en tu email
            </Typography>

            {submitted ? (
              <Alert
                severity="success"
                sx={{
                  background: 'rgba(255,255,255,0.25)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 3,
                  fontWeight: 600,
                  '& .MuiAlert-icon': { color: '#FFFFFF' },
                }}
              >
                ¡Gracias! Te has suscrito correctamente.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 480 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        background: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: 3,
                        color: '#FFFFFF',
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
                        '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                      },
                      '& input::placeholder': { color: 'rgba(255,255,255,0.75)' },
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{
                      background: '#FFFFFF',
                      color: '#FF6B35',
                      fontWeight: 800,
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      '&:hover': { background: '#F8F9FA', transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Suscribirme
                  </Button>
                </Stack>
              </Box>
            )}

            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
              Sin spam. Cancela cuando quieras. +10K creadores registrados.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
