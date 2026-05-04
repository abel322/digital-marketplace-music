'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push(callbackUrl)
    }
  }

  const handleGoogle = () => {
    signIn('google', { callbackUrl })
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
                Bienvenido
              </Typography>
              <Typography color="text.secondary" mt={1}>
                Inicia sesión en tu cuenta
              </Typography>
            </Box>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={handleGoogle}
              sx={{ borderRadius: 3, py: 1.5, fontWeight: 600 }}
              startIcon={
                <Box
                  component="img"
                  src="https://www.google.com/favicon.ico"
                  sx={{ width: 20, height: 20 }}
                />
              }
            >
              Continuar con Google
            </Button>

            <Divider>
              <Typography variant="body2" color="text.secondary">
                o con email
              </Typography>
            </Divider>

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
                <TextField
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Typography variant="caption" color="primary">
                            {showPassword ? 'Ocultar' : 'Ver'}
                          </Typography>
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box textAlign="right">
                  <Link href="/auth/forgot-password" style={{ color: '#FF6B35', fontSize: '0.875rem' }}>
                    ¿Olvidaste tu contraseña?
                  </Link>
                </Box>

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
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </form>

            <Typography textAlign="center" variant="body2">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/register" style={{ color: '#FF6B35', fontWeight: 600 }}>
                Regístrate gratis
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
