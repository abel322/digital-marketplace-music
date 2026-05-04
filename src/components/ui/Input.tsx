'use client'

import { TextField, TextFieldProps } from '@mui/material'

interface Props extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard'
}

export default function Input({ sx, ...props }: Props) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 3,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF6B35',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#FF6B35',
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#FF6B35',
        },
        ...sx,
      }}
      {...props}
    />
  )
}
