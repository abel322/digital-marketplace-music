'use client'
import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string
      secondary: string
      hero: string
      card: string
    }
  }
  interface PaletteOptions {
    gradient?: {
      primary?: string
      secondary?: string
      hero?: string
      card?: string
    }
  }
}

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35',
      light: '#FF8C61',
      dark: '#E65A2E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4',
      light: '#6FD9D1',
      dark: '#3BB5AD',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212529',
      secondary: '#6C757D',
      disabled: '#ADB5BD',
    },
    error: { main: '#DC3545', light: '#F1AEB5' },
    warning: { main: '#FFC107', light: '#FFE69C' },
    info: { main: '#17A2B8', light: '#B6EFFB' },
    success: { main: '#28A745', light: '#A3CFBB' },
    divider: '#E9ECEF',
    gradient: {
      primary: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
      secondary: 'linear-gradient(135deg, #4ECDC4 0%, #6FD9D1 100%)',
      hero: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
      card: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 60%, #FFB347 100%)',
    },
  },

  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.01em' },
    h3: { fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.35 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.45 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.57 },
    caption: { fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
    overline: { fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0.02em' },
  },

  shape: { borderRadius: 12 },

  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 2px 8px rgba(0,0,0,0.08)',
    '0 4px 12px rgba(0,0,0,0.08)',
    '0 4px 16px rgba(0,0,0,0.1)',
    '0 8px 24px rgba(0,0,0,0.1)',
    '0 8px 32px rgba(0,0,0,0.12)',
    '0 12px 40px rgba(0,0,0,0.12)',
    '0 16px 48px rgba(0,0,0,0.14)',
    '0 20px 60px rgba(0,0,0,0.14)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
    '0 24px 64px rgba(0,0,0,0.16)',
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', sans-serif; background-color: #F8F9FA; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F3F5; }
        ::-webkit-scrollbar-thumb { background: #CED4DA; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #ADB5BD; }
      `,
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.9375rem',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:active': { transform: 'scale(0.98)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #E65A2E 0%, #FF6B35 100%)',
            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #4ECDC4 0%, #6FD9D1 100%)',
          boxShadow: '0 4px 12px rgba(78, 205, 196, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #3BB5AD 0%, #4ECDC4 100%)',
            boxShadow: '0 6px 20px rgba(78, 205, 196, 0.45)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 2,
          borderColor: '#FF6B35',
          color: '#FF6B35',
          '&:hover': {
            borderWidth: 2,
            background: alpha('#FF6B35', 0.06),
            borderColor: '#E65A2E',
          },
        },
        text: {
          color: '#FF6B35',
          '&:hover': { background: alpha('#FF6B35', 0.06) },
        },
        sizeLarge: { padding: '13px 32px', fontSize: '1rem' },
        sizeSmall: { padding: '7px 16px', fontSize: '0.8125rem', borderRadius: 8 },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#FFFFFF',
            transition: 'box-shadow 0.2s ease',
            '& fieldset': { borderColor: '#E9ECEF', borderWidth: 2 },
            '&:hover fieldset': { borderColor: '#FF6B35' },
            '&.Mui-focused fieldset': { borderColor: '#FF6B35', borderWidth: 2 },
            '&.Mui-focused': { boxShadow: '0 0 0 4px rgba(255,107,53,0.1)' },
          },
          '& .MuiInputLabel-root.Mui-focused': { color: '#FF6B35' },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
        colorPrimary: {
          background: alpha('#FF6B35', 0.12),
          color: '#E65A2E',
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#212529',
          boxShadow: '0 1px 0 #E9ECEF',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: 16 },
        elevation1: { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
        elevation2: { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
        elevation3: { boxShadow: '0 8px 24px rgba(0,0,0,0.10)' },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: { borderRadius: '16px 0 0 16px', border: 'none' },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #E9ECEF',
          height: 70,
          backgroundColor: '#FFFFFF',
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#ADB5BD',
          '&.Mui-selected': { color: '#FF6B35' },
          minWidth: 0,
          padding: '6px 0',
        },
        label: {
          fontSize: '0.6875rem',
          fontWeight: 500,
          '&.Mui-selected': { fontSize: '0.6875rem' },
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 999, height: 8, backgroundColor: '#E9ECEF' },
        bar: {
          borderRadius: 999,
          background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%)',
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
          color: '#FFFFFF',
          fontWeight: 700,
          fontSize: '0.7rem',
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%)',
          color: '#FFFFFF',
          fontWeight: 700,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9375rem',
          '&.Mui-selected': { color: '#FF6B35' },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          background: 'linear-gradient(90deg, #FF6B35 0%, #FF8C61 100%)',
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 12 },
        standardSuccess: { background: alpha('#28A745', 0.1), color: '#1A5928' },
        standardError: { background: alpha('#DC3545', 0.1), color: '#7B1020' },
        standardWarning: { background: alpha('#FFC107', 0.1), color: '#7A5C00' },
        standardInfo: { background: alpha('#17A2B8', 0.1), color: '#0B4D57' },
      },
    },

    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: '#E9ECEF' },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#E9ECEF' },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          backgroundColor: '#212529',
          fontSize: '0.8125rem',
          padding: '6px 12px',
        },
      },
    },
  },
})
