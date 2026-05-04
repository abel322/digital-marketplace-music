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
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
      }}
    >
      <Container maxWidth="md">
        <Stack alignItems="center" textAlign="center" spacing={3}>
          <EmailIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.8)' }} />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{ color: '#FFFFFF', fontSize: { xs: '1.8rem', md: '2.5rem' } }}
          >
            Únete a nuestra comunidad
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 400, maxWidth: 500 }}>
            Recibe ofertas exclusivas, nuevos samples gratis y consejos de producción directamente en tu email
          </Typography>

          {submitted ? (
            <Alert
              severity="success"
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 3,
                '& .MuiAlert-icon': { color: '#FFFFFF' },
              }}
            >
              ¡Gracias! Te has suscrito correctamente.
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 480 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: 3,
                      color: '#FFFFFF',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.8)' },
                      '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                    },
                    '& input::placeholder': { color: 'rgba(255,255,255,0.7)' },
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
                    borderRadius: 3,
                    whiteSpace: 'nowrap',
                    '&:hover': { background: '#F8F9FA' },
                  }}
                >
                  Suscribirme
                </Button>
              </Stack>
            </Box>
          )}

          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Sin spam. Cancela cuando quieras. +10K suscriptores.
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
