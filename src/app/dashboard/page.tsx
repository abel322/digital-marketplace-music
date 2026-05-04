'use client'

import {
    Box, Grid, Typography, Card, CardContent, Stack, Chip,
    LinearProgress, Button, Avatar, Divider,
} from '@mui/material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import SchoolIcon from '@mui/icons-material/School'
import StarIcon from '@mui/icons-material/Star'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

// Mock data
const STATS = [
    { label: 'Cursos comprados', value: 3, icon: <ShoppingBagIcon />, color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
    { label: 'Lecciones completadas', value: 47, icon: <CheckCircleIcon />, color: '#28A745', bg: 'rgba(40,167,69,0.1)' },
    { label: 'Horas de estudio', value: 24, icon: <SchoolIcon />, color: '#4ECDC4', bg: 'rgba(78,205,196,0.1)' },
    { label: 'Calificación promedio', value: '4.9', icon: <StarIcon />, color: '#FFC107', bg: 'rgba(255,193,7,0.1)' },
]

const RECENT_PURCHASES = [
    { id: '1', title: 'Producción Musical Completa', type: 'COURSE', price: 97, date: '2026-02-20', progress: 65 },
    { id: '2', title: 'Pack Trap Essentials 2024', type: 'SAMPLE_PACK', price: 29, date: '2026-02-15', progress: 100 },
    { id: '3', title: 'Lo-Fi Chill Beats Vol. 3', type: 'MUSIC', price: 19, date: '2026-02-10', progress: 100 },
]

const IN_PROGRESS = [
    { id: '1', title: 'Producción Musical Completa', lesson: 'Mezcla profesional', progress: 65, totalLessons: 8, completedLessons: 5 },
]

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35', MUSIC: '#4ECDC4', SAMPLE_PACK: '#A29BFE',
}

export default function DashboardPage() {
    const { data: session } = useSession()
    const user = session?.user as any
    const firstName = user?.name?.split(' ')[0] || 'Usuario'
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'

    return (
        <Box>
            {/* Header */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={800} mb={0.5}>
                    {greeting}, {firstName} 👋
                </Typography>
                <Typography color="text.secondary">
                    Aquí está el resumen de tu actividad
                </Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={3} mb={4}>
                {STATS.map((stat) => (
                    <Grid item xs={6} md={3} key={stat.label}>
                        <Card
                            elevation={0}
                            sx={{
                                borderRadius: 4, border: '1px solid #E9ECEF',
                                background: '#FFFFFF',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                            }}
                        >
                            <CardContent sx={{ p: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box>
                                        <Typography variant="h4" fontWeight={800} color={stat.color} mb={0.25}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            width: 44, height: 44, borderRadius: 2.5,
                                            background: stat.bg, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            color: stat.color,
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Continue Learning */}
                <Grid item xs={12} md={7}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                                <Typography variant="h6" fontWeight={700}>Continuar aprendiendo</Typography>
                                <Button
                                    component={Link} href="/dashboard/learning"
                                    endIcon={<ArrowForwardIcon />} size="small"
                                    sx={{ fontWeight: 600, color: '#FF6B35' }}
                                >
                                    Ver todo
                                </Button>
                            </Stack>

                            {IN_PROGRESS.map((course) => (
                                <Box
                                    key={course.id}
                                    sx={{
                                        p: 2.5, borderRadius: 3,
                                        background: 'linear-gradient(135deg, rgba(255,107,53,0.04), rgba(78,205,196,0.04))',
                                        border: '1px solid rgba(255,107,53,0.15)',
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                                        <Box
                                            sx={{
                                                width: 48, height: 48, borderRadius: 2, flexShrink: 0,
                                                background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >
                                            <SchoolIcon sx={{ color: '#fff', fontSize: 22 }} />
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography fontWeight={700} mb={0.25}>{course.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Próxima: {course.lesson}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label={`${course.progress}%`}
                                            size="small"
                                            sx={{ background: 'rgba(255,107,53,0.12)', color: '#FF6B35', fontWeight: 700 }}
                                        />
                                    </Stack>

                                    <Box mb={1.5}>
                                        <Stack direction="row" justifyContent="space-between" mb={0.75}>
                                            <Typography variant="caption" color="text.secondary">
                                                {course.completedLessons} de {course.totalLessons} lecciones
                                            </Typography>
                                            <Typography variant="caption" fontWeight={600} color="#FF6B35">
                                                {course.progress}%
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={course.progress}
                                            sx={{
                                                height: 8, borderRadius: 4,
                                                bgcolor: 'rgba(255,107,53,0.12)',
                                                '& .MuiLinearProgress-bar': {
                                                    background: 'linear-gradient(90deg, #FF6B35, #FF8C61)',
                                                    borderRadius: 4,
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Button
                                        variant="contained"
                                        startIcon={<PlayArrowIcon />}
                                        component={Link}
                                        href="/dashboard/learning"
                                        sx={{
                                            background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                            fontWeight: 700, borderRadius: 2.5, fontSize: '0.85rem',
                                        }}
                                    >
                                        Continuar
                                    </Button>
                                </Box>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Purchases */}
                <Grid item xs={12} md={5}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                                <Typography variant="h6" fontWeight={700}>Compras recientes</Typography>
                                <Button
                                    component={Link} href="/dashboard/purchases"
                                    endIcon={<ArrowForwardIcon />} size="small"
                                    sx={{ fontWeight: 600, color: '#FF6B35' }}
                                >
                                    Ver todo
                                </Button>
                            </Stack>

                            <Stack spacing={1.5}>
                                {RECENT_PURCHASES.map((p) => {
                                    const color = typeColors[p.type] || '#FF6B35'
                                    return (
                                        <Stack key={p.id} direction="row" spacing={1.5} alignItems="center"
                                            sx={{
                                                p: 1.5, borderRadius: 2.5, border: '1px solid #F0F0F0',
                                                transition: 'border-color 0.2s',
                                                '&:hover': { borderColor: `${color}40` },
                                            }}>
                                            <Box sx={{ width: 40, height: 40, borderRadius: 1.5, flexShrink: 0, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography fontWeight={700} color={color} sx={{ fontSize: '0.9rem' }}>
                                                    {p.title[0]}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography variant="body2" fontWeight={600} noWrap>{p.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">${p.price}</Typography>
                                            </Box>
                                            {p.progress === 100 ? (
                                                <CheckCircleIcon sx={{ color: '#28A745', fontSize: 20, flexShrink: 0 }} />
                                            ) : (
                                                <Chip label={`${p.progress}%`} size="small"
                                                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: `${color}15`, color }} />
                                            )}
                                        </Stack>
                                    )
                                })}
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Total invertido</Typography>
                                <Typography variant="body2" fontWeight={700} color="#FF6B35">$145.00</Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Progress Banner */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            p: 3, borderRadius: 4,
                            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 50%, #4ECDC4 100%)',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <TrendingUpIcon sx={{ fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800} variant="h6" lineHeight={1.2}>¡Vas muy bien!</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>Completaste el 65% de tu último curso</Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            component={Link} href="/dashboard/learning"
                            sx={{
                                background: 'rgba(255,255,255,0.25)',
                                backdropFilter: 'blur(8px)',
                                fontWeight: 700,
                                '&:hover': { background: 'rgba(255,255,255,0.35)' },
                                borderRadius: 3,
                            }}
                        >
                            Ver mi progreso
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
