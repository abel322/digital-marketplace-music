'use client'

import { useSearchParams } from 'next/navigation'
import { Box, Container, Typography, Button, Stack, Alert } from '@mui/material'
import Link from 'next/link'

const errorMessages: Record<string, string> = {
  Configuration: 'Error de configuración del servidor.',
  AccessDenied: 'Acceso denegado.',
  Verification: 'El enlace de verificación ha expirado.',
  Default: 'Ocurrió un error durante la autenticación.',
  OAuthSignin: 'Error al conectar con el proveedor externo.',
  OAuthCallback: 'Error al procesar la respuesta del proveedor.',
  CredentialsSignin: 'Email o contraseña incorrectos.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Default'
  const message = errorMessages[error] || errorMessages.Default

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
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
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography variant="h4" fontWeight={800} color="error">
              Error de Autenticación
            </Typography>
            <Alert severity="error" sx={{ width: '100%' }}>
              {message}
            </Alert>
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                href="/auth/login"
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                  fontWeight: 700,
                }}
              >
                Intentar de nuevo
              </Button>
              <Button component={Link} href="/" variant="outlined">
                Ir al inicio
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
