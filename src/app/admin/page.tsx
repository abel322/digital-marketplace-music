'use client'

import {
    Box, Grid, Typography, Card, CardContent, Stack,
    Chip, Button, Divider, LinearProgress, Avatar,
} from '@mui/material'
import Link from 'next/link'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import InventoryIcon from '@mui/icons-material/Inventory'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import FiberNewIcon from '@mui/icons-material/FiberNew'

const STATS = [
    {
        label: 'Ingresos del mes',
        value: '$12,847',
        change: +18.5,
        icon: <AttachMoneyIcon />,
        color: '#28A745',
        bg: 'rgba(40,167,69,0.1)',
        sub: 'vs mes anterior',
    },
    {
        label: 'Nuevos usuarios',
        value: '384',
        change: +12.3,
        icon: <PeopleIcon />,
        color: '#4ECDC4',
        bg: 'rgba(78,205,196,0.1)',
        sub: 'este mes',
    },
    {
        label: 'Órdenes',
        value: '147',
        change: -3.1,
        icon: <ShoppingBagIcon />,
        color: '#FF6B35',
        bg: 'rgba(255,107,53,0.1)',
        sub: 'este mes',
    },
    {
        label: 'Productos activos',
        value: '24',
        change: +4,
        icon: <InventoryIcon />,
        color: '#A29BFE',
        bg: 'rgba(162,155,254,0.1)',
        sub: 'publicados',
    },
]

const TOP_PRODUCTS = [
    { title: 'Producción Musical Completa', type: 'COURSE', sales: 67, revenue: 6499, progress: 85 },
    { title: 'Pack Trap Essentials 2024', type: 'SAMPLE_PACK', sales: 43, revenue: 1247, progress: 55 },
    { title: 'Mezcla y Mastering Pro', type: 'COURSE', sales: 38, revenue: 2546, progress: 48 },
    { title: 'FL Studio Completo', type: 'COURSE', sales: 29, revenue: 2291, progress: 37 },
    { title: 'Lo-Fi Chill Beats Vol. 3', type: 'MUSIC', sales: 24, revenue: 456, progress: 30 },
]

const RECENT_ORDERS = [
    { id: 'ORD-A1B2C3', user: 'María García', email: 'maria@email.com', amount: 97, status: 'PAID', date: '03 Mar 2026' },
    { id: 'ORD-D4E5F6', user: 'Juan Pérez', email: 'juan@email.com', amount: 29, status: 'PAID', date: '03 Mar 2026' },
    { id: 'ORD-G7H8I9', user: 'Ana Torres', email: 'ana@email.com', amount: 146, status: 'PENDING', date: '02 Mar 2026' },
    { id: 'ORD-J1K2L3', user: 'Carlos López', email: 'carlos@email.com', amount: 79, status: 'PAID', date: '02 Mar 2026' },
    { id: 'ORD-M4N5O6', user: 'Sofía Ruiz', email: 'sofia@email.com', amount: 19, status: 'REFUNDED', date: '01 Mar 2026' },
]

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35', MUSIC: '#4ECDC4', SAMPLE_PACK: '#A29BFE',
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
    PAID: { bg: 'rgba(40,167,69,0.1)', color: '#28A745', label: 'Pagado' },
    PENDING: { bg: 'rgba(255,193,7,0.1)', color: '#FFC107', label: 'Pendiente' },
    FAILED: { bg: 'rgba(220,53,69,0.1)', color: '#DC3545', label: 'Fallido' },
    REFUNDED: { bg: 'rgba(108,117,125,0.1)', color: '#6C757D', label: 'Reembolsado' },
}

export default function AdminPage() {
    return (
        <Box>
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={4} gap={2}>
                <Box>
                    <Typography variant="h4" fontWeight={800} mb={0.25}>Panel de Administración</Typography>
                    <Typography color="text.secondary">Resumen general · {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" component={Link} href="/admin/products/new"
                        sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                        + Nuevo producto
                    </Button>
                    <Button variant="contained" component={Link} href="/admin/analytics"
                        sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)' }}>
                        Ver analíticas
                    </Button>
                </Stack>
            </Stack>

            {/* Stats Row */}
            <Grid container spacing={2.5} mb={3}>
                {STATS.map((stat) => (
                    <Grid item xs={6} md={3} key={stat.label}>
                        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', background: '#FFFFFF', transition: 'all 0.2s', '&:hover': { boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transform: 'translateY(-2px)' } }}>
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h4" fontWeight={800} lineHeight={1} mb={0.25}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                                    </Box>
                                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                                        {stat.icon}
                                    </Box>
                                </Stack>
                                <Stack direction="row" spacing={0.5} alignItems="center" mt={1.5}>
                                    {stat.change >= 0
                                        ? <TrendingUpIcon sx={{ fontSize: 16, color: '#28A745' }} />
                                        : <TrendingDownIcon sx={{ fontSize: 16, color: '#DC3545' }} />
                                    }
                                    <Typography variant="caption" fontWeight={700} color={stat.change >= 0 ? '#28A745' : '#DC3545'}>
                                        {stat.change >= 0 ? '+' : ''}{stat.change}%
                                    </Typography>
                                    <Typography variant="caption" color="text.disabled">{stat.sub}</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Top Products */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                                <Typography variant="h6" fontWeight={700}>Top productos</Typography>
                                <Button component={Link} href="/admin/products" endIcon={<ArrowForwardIcon />} size="small" sx={{ fontWeight: 600, color: '#FF6B35' }}>
                                    Ver todos
                                </Button>
                            </Stack>
                            <Stack spacing={2.5}>
                                {TOP_PRODUCTS.map((p, i) => {
                                    const color = typeColors[p.type] || '#FF6B35'
                                    return (
                                        <Box key={p.title}>
                                            <Stack direction="row" alignItems="center" spacing={1.5} mb={0.75}>
                                                <Typography variant="caption" fontWeight={800} color="text.disabled" sx={{ width: 16 }}>
                                                    {i + 1}
                                                </Typography>
                                                <Box sx={{ width: 32, height: 32, borderRadius: 1.5, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Typography variant="caption" fontWeight={700} color={color}>{p.title[0]}</Typography>
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight={600} noWrap>{p.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{p.sales} ventas · ${p.revenue.toLocaleString()}</Typography>
                                                </Box>
                                                <Chip label={p.type === 'COURSE' ? 'Curso' : p.type === 'MUSIC' ? 'Música' : 'Samples'} size="small"
                                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: `${color}15`, color }} />
                                            </Stack>
                                            <LinearProgress variant="determinate" value={p.progress}
                                                sx={{ height: 5, borderRadius: 3, bgcolor: `${color}15`, '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 3 } }} />
                                        </Box>
                                    )
                                })}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Orders */}
                <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                                <Typography variant="h6" fontWeight={700}>Órdenes recientes</Typography>
                                <Button component={Link} href="/admin/orders" endIcon={<ArrowForwardIcon />} size="small" sx={{ fontWeight: 600, color: '#FF6B35' }}>
                                    Ver todas
                                </Button>
                            </Stack>
                            <Stack spacing={1.5}>
                                {RECENT_ORDERS.map((order) => {
                                    const st = statusColors[order.status]
                                    return (
                                        <Stack key={order.id} direction="row" alignItems="center" spacing={1.5}
                                            sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid #F0F0F0', '&:hover': { borderColor: '#FF6B3540' }, transition: 'border-color 0.2s' }}>
                                            <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', fontSize: '0.85rem', fontWeight: 700 }}>
                                                {order.user[0]}
                                            </Avatar>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body2" fontWeight={600} noWrap>{order.user}</Typography>
                                                <Typography variant="caption" color="text.secondary" noWrap>{order.id} · {order.date}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                                                <Typography variant="body2" fontWeight={700} color="#FF6B35">${order.amount}</Typography>
                                                <Chip label={st.label} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: st.bg, color: st.color }} />
                                            </Box>
                                        </Stack>
                                    )
                                })}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Actions */}
                <Grid item xs={12}>
                    <Box sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #1A1A2E, #16213E)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography fontWeight={800} color="#FFFFFF" variant="h6" mb={0.25}>Acciones rápidas</Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Gestiona tu plataforma desde aquí</Typography>
                        </Box>
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" gap={1}>
                            {[
                                { label: '+ Producto', href: '/admin/products/new', color: '#FF6B35' },
                                { label: 'Ver órdenes', href: '/admin/orders', color: '#4ECDC4' },
                                { label: 'Usuarios', href: '/admin/users', color: '#A29BFE' },
                                { label: 'Cupones', href: '/admin/coupons', color: '#FFC107' },
                            ].map((a) => (
                                <Button key={a.href} variant="contained" size="small" component={Link} href={a.href}
                                    sx={{ fontWeight: 700, background: `${a.color}25`, color: a.color, '&:hover': { background: `${a.color}40` }, borderRadius: 2, border: `1px solid ${a.color}40` }}>
                                    {a.label}
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
