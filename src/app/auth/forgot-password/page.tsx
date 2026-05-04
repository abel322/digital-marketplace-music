'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setSent(true)
      } else {
        setError('Error al enviar el email. Intenta de nuevo.')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    }

    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: '#FFFFFF',
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          <Stack spacing={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={800} color="primary">
                Recuperar Contraseña
              </Typography>
              <Typography color="text.secondary" mt={1}>
                Te enviaremos un enlace para restablecer tu contraseña
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            {sent ? (
              <Alert severity="success">
                Email enviado a <strong>{email}</strong>. Revisa tu bandeja de entrada.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                      borderRadius: 3,
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Enviar Email'}
                  </Button>
                </Stack>
              </form>
            )}

            <Typography textAlign="center" variant="body2">
              <Link href="/auth/login" style={{ color: '#FF6B35', fontWeight: 600 }}>
                Volver al inicio de sesión
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
