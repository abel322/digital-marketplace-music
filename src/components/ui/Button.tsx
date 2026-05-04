'use client'

import { Button as MuiButton, ButtonProps, CircularProgress } from '@mui/material'

interface Props extends ButtonProps {
  loading?: boolean
  gradient?: boolean
}

export default function Button({ loading, gradient, children, disabled, sx, ...props }: Props) {
  return (
    <MuiButton
      disabled={disabled || loading}
      sx={{
        fontWeight: 700,
        borderRadius: 3,
        ...(gradient && {
          background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
          color: '#FFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #E55A25, #FF6B35)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(255,107,53,0.4)',
          },
          '&:disabled': {
            background: 'rgba(0,0,0,0.12)',
          },
        }),
        transition: 'all 0.2s ease',
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </MuiButton>
  )
}
