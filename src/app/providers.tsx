'use client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { theme } from '@/styles/theme'
import { CartProvider } from '@/context/CartContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              },
              success: {
                iconTheme: { primary: '#28A745', secondary: '#fff' },
                style: { borderLeft: '4px solid #28A745' },
              },
              error: {
                iconTheme: { primary: '#DC3545', secondary: '#fff' },
                style: { borderLeft: '4px solid #DC3545' },
              },
            }}
          />
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
