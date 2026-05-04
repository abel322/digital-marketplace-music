'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Avatar, Divider, Stack, Chip,
    IconButton, useMediaQuery, useTheme, Badge,
} from '@mui/material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import SchoolIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HelpIcon from '@mui/icons-material/Help'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

const DRAWER_WIDTH = 260

const NAV_ITEMS = [
    { label: 'Resumen', href: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Mis Compras', href: '/dashboard/purchases', icon: <ShoppingBagIcon /> },
    { label: 'Mi Aprendizaje', href: '/dashboard/learning', icon: <SchoolIcon /> },
    { label: 'Favoritos', href: '/dashboard/favorites', icon: <FavoriteIcon /> },
    { label: 'Mi Perfil', href: '/dashboard/profile', icon: <PersonIcon /> },
]

const BOTTOM_ITEMS = [
    { label: 'Notificaciones', href: '/dashboard/notifications', icon: <NotificationsIcon /> },
    { label: 'Ayuda', href: '/help', icon: <HelpIcon /> },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user as any

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* User Info */}
            <Box
                sx={{
                    p: 3, pb: 2.5,
                    background: 'linear-gradient(135deg, rgba(255,107,53,0.08), rgba(78,205,196,0.08))',
                    borderBottom: '1px solid #F0F0F0',
                }}
            >
                {onClose && (
                    <IconButton size="small" onClick={onClose} sx={{ float: 'right', mt: -0.5 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                        src={user?.image || ''}
                        sx={{
                            width: 48, height: 48,
                            background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                            fontWeight: 700, fontSize: '1.1rem',
                        }}
                    >
                        {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={700} variant="body1" noWrap>
                            {user?.name || 'Mi Cuenta'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            {user?.email || 'usuario@email.com'}
                        </Typography>
                        {user?.role === 'ADMIN' && (
                            <Chip label="Admin" size="small" sx={{ ml: 0.5, height: 16, fontSize: '0.6rem', background: '#FF6B35', color: '#fff', fontWeight: 700 }} />
                        )}
                    </Box>
                </Stack>
            </Box>

            {/* Nav Items */}
            <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto' }}>
                <List disablePadding>
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                        return (
                            <ListItem key={item.href} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    href={item.href}
                                    onClick={onClose}
                                    sx={{
                                        borderRadius: 2.5,
                                        py: 1.2,
                                        background: active ? 'linear-gradient(135deg, rgba(255,107,53,0.12), rgba(255,107,53,0.06))' : 'transparent',
                                        '&:hover': { background: 'rgba(255,107,53,0.07)' },
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        '&::before': active ? {
                                            content: '""',
                                            position: 'absolute',
                                            left: 0, top: '20%', bottom: '20%',
                                            width: 3, borderRadius: '0 3px 3px 0',
                                            background: 'linear-gradient(#FF6B35, #FF8C61)',
                                        } : {},
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 38, color: active ? '#FF6B35' : 'text.secondary' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.9rem',
                                            color: active ? '#FF6B35' : 'text.primary',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>

            <Divider />

            {/* Bottom Items */}
            <List disablePadding sx={{ py: 1 }}>
                {BOTTOM_ITEMS.map((item) => (
                    <ListItem key={item.href} disablePadding sx={{ px: 1.5 }}>
                        <ListItemButton
                            component={Link}
                            href={item.href}
                            onClick={onClose}
                            sx={{ borderRadius: 2.5, py: 1, '&:hover': { background: 'rgba(0,0,0,0.04)' } }}
                        >
                            <ListItemIcon sx={{ minWidth: 38, color: 'text.secondary' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', background: '#F8F9FA' }}>
            {/* Desktop Sidebar */}
            {!isMobile && (
                <Box
                    sx={{
                        width: DRAWER_WIDTH, flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            border: 'none',
                            boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
                        },
                    }}
                    component="nav"
                >
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: DRAWER_WIDTH, top: 72,
                                height: 'calc(100% - 72px)',
                                background: '#FFFFFF',
                                border: 'none',
                                boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
                            },
                        }}
                        open
                    >
                        <SidebarContent />
                    </Drawer>
                </Box>
            )}

            {/* Mobile Hamburger */}
            {isMobile && (
                <Box
                    sx={{
                        position: 'fixed', top: 72, left: 16, zIndex: 1100,
                        background: '#FFFFFF', borderRadius: 2.5,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                    }}
                >
                    <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ p: 1 }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: DRAWER_WIDTH } }}
            >
                <SidebarContent onClose={() => setMobileOpen(false)} />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    ml: isMobile ? 0 : 0,
                    p: { xs: 2, md: 4 },
                    pt: { xs: 10, md: 4 },
                    maxWidth: '100%',
                    overflow: 'hidden',
                }}
            >
                {children}
            </Box>
        </Box>
    )
}
