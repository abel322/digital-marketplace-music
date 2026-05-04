'use client'

import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useScrollTrigger,
  Container,
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/cart/CartDrawer'

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Cursos', href: '/courses' },
  { label: 'Música', href: '/music' },
  { label: 'Samples', href: '/samples' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const { items } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [cartOpen, setCartOpen] = useState(false)

  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 10 })
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <AppBar
        position="fixed"
        elevation={trigger ? 4 : 0}
        sx={{
          background: trigger
            ? 'rgba(255,255,255,0.95)'
            : 'transparent',
          backdropFilter: trigger ? 'blur(10px)' : 'none',
          borderBottom: trigger ? '1px solid rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.3s ease',
          color: trigger ? 'text.primary' : '#FFFFFF',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 64, md: 72 } }}>
            <Typography
              component={Link}
              href="/"
              variant="h6"
              sx={{
                fontWeight: 900,
                textDecoration: 'none',
                color: trigger ? 'primary.main' : '#FFFFFF',
                letterSpacing: '-0.5px',
                flexShrink: 0,
              }}
            >
              DigitalMarket
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  component={Link}
                  href={link.href}
                  sx={{
                    color: trigger ? 'text.primary' : '#FFFFFF',
                    fontWeight: 600,
                    borderRadius: 2,
                    '&:hover': {
                      background: trigger ? 'rgba(255,107,53,0.08)' : 'rgba(255,255,255,0.15)',
                      color: trigger ? 'primary.main' : '#FFFFFF',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            <IconButton
              onClick={() => setCartOpen(true)}
              sx={{ color: trigger ? 'text.primary' : '#FFFFFF', mr: 1 }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {session ? (
              <>
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ color: trigger ? 'text.primary' : '#FFFFFF' }}
                >
                  {session.user?.image ? (
                    <Avatar src={session.user.image} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 180 } }}
                >
                  <MenuItem component={Link} href="/dashboard" onClick={() => setAnchorEl(null)}>
                    Mi Dashboard
                  </MenuItem>
                  <MenuItem component={Link} href="/dashboard/purchases" onClick={() => setAnchorEl(null)}>
                    Mis Compras
                  </MenuItem>
                  <MenuItem component={Link} href="/dashboard/profile" onClick={() => setAnchorEl(null)}>
                    Mi Perfil
                  </MenuItem>
                  {(session.user as any)?.role === 'ADMIN' && (
                    <MenuItem component={Link} href="/admin" onClick={() => setAnchorEl(null)}>
                      Admin Panel
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={() => { setAnchorEl(null); signOut() }} sx={{ color: 'error.main' }}>
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                <Button
                  component={Link}
                  href="/auth/login"
                  sx={{ color: trigger ? 'text.primary' : '#FFFFFF', fontWeight: 600 }}
                >
                  Entrar
                </Button>
                <Button
                  component={Link}
                  href="/auth/register"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35, #FF8C60)',
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': { background: 'linear-gradient(135deg, #E55A25, #FF6B35)' },
                  }}
                >
                  Registrarse
                </Button>
              </Box>
            )}

            <IconButton
              sx={{ display: { md: 'none' }, color: trigger ? 'text.primary' : '#FFFFFF', ml: 1 }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Typography variant="h6" fontWeight={900} color="primary" sx={{ px: 2, mb: 2 }}>
            DigitalMarket
          </Typography>
          <Divider />
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            {session ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Mi Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => { setMobileOpen(false); signOut() }}>
                    <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Iniciar Sesión" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <ListItemText primary="Registrarse" primaryTypographyProps={{ color: 'primary', fontWeight: 700 }} />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      <Toolbar sx={{ minHeight: { xs: 64, md: 72 } }} />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
