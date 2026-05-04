'use client'

import { Card as MuiCard, CardProps, Box } from '@mui/material'

interface Props extends CardProps {
  hover?: boolean
  gradient?: boolean
}

export default function Card({ hover, gradient, children, sx, ...props }: Props) {
  return (
    <MuiCard
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        ...(hover && {
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          },
        }),
        ...(gradient && {
          background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
          color: '#FFF',
        }),
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  )
}
