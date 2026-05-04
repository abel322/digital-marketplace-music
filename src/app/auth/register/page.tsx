'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Error al crear la cuenta')
        setLoading(false)
        return
      }

      await signIn('credentials', { email, password, redirect: false })
      router.push('/dashboard')
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #4ECDC4 0%, #FF6B35 100%)',
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
                Crear Cuenta
              </Typography>
              <Typography color="text.secondary" mt={1}>
                Únete a miles de creadores y estudiantes
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
              startIcon={
                <Box
                  component="img"
                  src="https://www.google.com/favicon.ico"
                  sx={{ width: 20, height: 20 }}
                />
              }
            >
              Registrarse con Google
            </Button>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                o con email
              </Typography>
            </Divider>

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  label="Nombre completo"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  helperText="Mínimo 8 caracteres"
                />
                <TextField
                  label="Confirmar contraseña"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear Cuenta Gratis'}
                </Button>
              </Stack>
            </form>

            <Typography textAlign="center" variant="body2">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/login" style={{ color: '#FF6B35', fontWeight: 600 }}>
                Inicia sesión
              </Link>
            </Typography>

            <Typography variant="caption" color="text.secondary" textAlign="center">
              Al registrarte aceptas nuestros{' '}
              <Link href="/terms" style={{ color: '#FF6B35' }}>
                Términos de Servicio
              </Link>{' '}
              y{' '}
              <Link href="/privacy" style={{ color: '#FF6B35' }}>
                Política de Privacidad
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
