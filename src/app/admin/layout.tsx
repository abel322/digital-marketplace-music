'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, Typography, Divider, Stack, Chip,
    IconButton, useMediaQuery, useTheme, Avatar,
} from '@mui/material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import InventoryIcon from '@mui/icons-material/Inventory'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HomeIcon from '@mui/icons-material/Home'

const DRAWER_WIDTH = 260

const NAV_ITEMS = [
    { label: 'Resumen', href: '/admin', icon: <DashboardIcon /> },
    { label: 'Productos', href: '/admin/products', icon: <InventoryIcon />, badge: '24' },
    { label: 'Usuarios', href: '/admin/users', icon: <PeopleIcon />, badge: '1.2k' },
    { label: 'Órdenes', href: '/admin/orders', icon: <ShoppingBagIcon />, badge: '8' },
    { label: 'Cupones', href: '/admin/coupons', icon: <LocalOfferIcon /> },
    { label: 'Analíticas', href: '/admin/analytics', icon: <BarChartIcon /> },
]

const BOTTOM_NAV = [
    { label: 'Configuración', href: '/admin/settings', icon: <SettingsIcon /> },
    { label: 'Ir al sitio', href: '/', icon: <HomeIcon /> },
]

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname()
    const { data: session } = useSession()
    const user = session?.user as any

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{
                p: 3, pb: 2.5,
                background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
                {onClose && (
                    <IconButton size="small" onClick={onClose} sx={{ float: 'right', color: '#fff' }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                )}
                <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <AdminPanelSettingsIcon sx={{ color: '#fff', fontSize: 20 }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={800} color="#FFFFFF" variant="body1" lineHeight={1.1}>
                            Admin Panel
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                            DigitalMarket
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', fontSize: '0.85rem', fontWeight: 700 }}>
                        {user?.name?.[0] || 'A'}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" fontWeight={600} color="#FFFFFF" noWrap display="block">
                            {user?.name || 'Admin'}
                        </Typography>
                        <Chip label="ADMIN" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 800, background: '#FF6B35', color: '#fff' }} />
                    </Box>
                </Stack>
            </Box>

            {/* Nav */}
            <Box sx={{ flex: 1, py: 1.5, overflowY: 'auto', bgcolor: '#0F1117' }}>
                <Typography variant="overline" sx={{ px: 2.5, color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: 1.5 }}>
                    GESTIÓN
                </Typography>
                <List disablePadding>
                    {NAV_ITEMS.map((item) => {
                        const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                        return (
                            <ListItem key={item.href} disablePadding sx={{ px: 1.5, mb: 0.5 }}>
                                <ListItemButton
                                    component={Link} href={item.href} onClick={onClose}
                                    sx={{
                                        borderRadius: 2.5, py: 1,
                                        background: active ? 'linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,107,53,0.08))' : 'transparent',
                                        '&:hover': { background: 'rgba(255,255,255,0.06)' },
                                        transition: 'all 0.2s ease',
                                        borderLeft: active ? '3px solid #FF6B35' : '3px solid transparent',
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 38, color: active ? '#FF6B35' : 'rgba(255,255,255,0.5)' }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{ fontWeight: active ? 700 : 400, fontSize: '0.875rem', color: active ? '#FF6B35' : 'rgba(255,255,255,0.75)' }}
                                    />
                                    {item.badge && (
                                        <Chip label={item.badge} size="small"
                                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: active ? 'rgba(255,107,53,0.25)' : 'rgba(255,255,255,0.1)', color: active ? '#FF6B35' : 'rgba(255,255,255,0.5)' }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                </List>
            </Box>

            <Box sx={{ bgcolor: '#0F1117', borderTop: '1px solid rgba(255,255,255,0.06)', py: 1 }}>
                {BOTTOM_NAV.map((item) => (
                    <ListItem key={item.href} disablePadding sx={{ px: 1.5 }}>
                        <ListItemButton component={Link} href={item.href} onClick={onClose}
                            sx={{ borderRadius: 2.5, py: 0.9, '&:hover': { background: 'rgba(255,255,255,0.06)' } }}>
                            <ListItemIcon sx={{ minWidth: 38, color: 'rgba(255,255,255,0.4)' }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </Box>
        </Box>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F0F2F5' }}>
            {!isMobile && (
                <Box sx={{ width: DRAWER_WIDTH, flexShrink: 0 }}>
                    <Drawer variant="permanent"
                        sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, bgcolor: '#0F1117', border: 'none', boxShadow: '4px 0 16px rgba(0,0,0,0.25)', top: 0, height: '100%' } }}
                        open>
                        <SidebarContent />
                    </Drawer>
                </Box>
            )}

            {isMobile && (
                <Box sx={{ position: 'fixed', top: 76, left: 12, zIndex: 1100, bgcolor: '#0F1117', borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
                    <IconButton onClick={() => setMobileOpen(true)} size="small" sx={{ p: 1, color: '#fff' }}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            )}

            <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}
                PaperProps={{ sx: { width: DRAWER_WIDTH, bgcolor: '#0F1117' } }}>
                <SidebarContent onClose={() => setMobileOpen(false)} />
            </Drawer>

            <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 }, pt: { xs: 9, md: 4 }, maxWidth: '100%' }}>
                {children}
            </Box>
        </Box>
    )
}
