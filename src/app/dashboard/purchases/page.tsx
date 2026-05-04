'use client'

import { useState } from 'react'
import {
    Box, Typography, Grid, Card, CardContent, Stack,
    Chip, Button, TextField, InputAdornment,
    Select, MenuItem, FormControl, InputLabel, Divider,
    LinearProgress,
} from '@mui/material'
import Link from 'next/link'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import DownloadIcon from '@mui/icons-material/Download'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'

const PURCHASES = [
    {
        id: '1', title: 'Producción Musical Completa', type: 'COURSE', price: 97,
        date: '20 Feb 2026', slug: 'produccion-musical-completa',
        progress: 65, totalLessons: 8, completedLessons: 5,
        orderId: 'ORD-A1B2C3', status: 'PAID',
    },
    {
        id: '2', title: 'Pack Trap Essentials 2024', type: 'SAMPLE_PACK', price: 29,
        date: '15 Feb 2026', slug: 'trap-essentials-2024',
        progress: 100, totalLessons: 0, completedLessons: 0,
        orderId: 'ORD-D4E5F6', status: 'PAID',
    },
    {
        id: '3', title: 'Lo-Fi Chill Beats Vol. 3', type: 'MUSIC', price: 19,
        date: '10 Feb 2026', slug: 'lofi-chill-beats-vol3',
        progress: 100, totalLessons: 0, completedLessons: 0,
        orderId: 'ORD-G7H8I9', status: 'PAID',
    },
    {
        id: '4', title: 'FL Studio Completo', type: 'COURSE', price: 79,
        date: '2 Feb 2026', slug: 'fl-studio-completo',
        progress: 0, totalLessons: 12, completedLessons: 0,
        orderId: 'ORD-J1K2L3', status: 'PAID',
    },
]

const typeIcons: Record<string, React.ReactNode> = {
    COURSE: <SchoolIcon sx={{ fontSize: 20 }} />,
    MUSIC: <MusicNoteIcon sx={{ fontSize: 20 }} />,
    SAMPLE_PACK: <LibraryMusicIcon sx={{ fontSize: 20 }} />,
}

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35', MUSIC: '#4ECDC4', SAMPLE_PACK: '#A29BFE',
}

const typeLabels: Record<string, string> = {
    COURSE: 'Curso', MUSIC: 'Música', SAMPLE_PACK: 'Samples',
}

export default function PurchasesPage() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('ALL')

    const filtered = PURCHASES.filter((p) => {
        if (filter !== 'ALL' && p.type !== filter) return false
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const total = PURCHASES.reduce((s, p) => s + p.price, 0)

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-end' }} mb={4} gap={1}>
                <Box>
                    <Typography variant="h4" fontWeight={800} mb={0.5}>Mis Compras</Typography>
                    <Typography color="text.secondary">{PURCHASES.length} productos comprados · Total: ${total}</Typography>
                </Box>
            </Stack>

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField
                    placeholder="Buscar mis compras..." size="small" sx={{ flex: 1 }}
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }}
                />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel><FilterListIcon sx={{ fontSize: 16, mr: 0.5 }} />Tipo</InputLabel>
                    <Select value={filter} label="Tipo" onChange={(e) => setFilter(e.target.value)} sx={{ borderRadius: 3 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="COURSE">Cursos</MenuItem>
                        <MenuItem value="MUSIC">Música</MenuItem>
                        <MenuItem value="SAMPLE_PACK">Samples</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* Purchases Grid */}
            <Grid container spacing={2.5}>
                {filtered.map((p) => {
                    const color = typeColors[p.type] || '#FF6B35'
                    const isCourse = p.type === 'COURSE'
                    return (
                        <Grid item xs={12} sm={6} lg={4} key={p.id}>
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF', height: '100%',
                                    display: 'flex', flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                                }}
                            >
                                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Stack direction="row" spacing={1.5} mb={2}>
                                        <Box sx={{
                                            width: 52, height: 52, borderRadius: 2.5, flexShrink: 0,
                                            background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color,
                                        }}>
                                            {typeIcons[p.type]}
                                        </Box>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography variant="body1" fontWeight={700} mb={0.25} sx={{ lineHeight: 1.3 }}>
                                                {p.title}
                                            </Typography>
                                            <Stack direction="row" spacing={0.75} alignItems="center">
                                                <Chip label={typeLabels[p.type] || p.type} size="small"
                                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: `${color}15`, color }} />
                                                <Typography variant="caption" color="text.disabled">·</Typography>
                                                <Typography variant="caption" color="text.secondary">{p.date}</Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>

                                    {isCourse && (
                                        <Box mb={2}>
                                            <Stack direction="row" justifyContent="space-between" mb={0.75}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {p.completedLessons}/{p.totalLessons} lecciones
                                                </Typography>
                                                <Typography variant="caption" fontWeight={700} color={color}>{p.progress}%</Typography>
                                            </Stack>
                                            <LinearProgress variant="determinate" value={p.progress}
                                                sx={{
                                                    height: 7, borderRadius: 4, bgcolor: `${color}18`,
                                                    '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg, ${color}, ${color}99)`, borderRadius: 4 },
                                                }}
                                            />
                                        </Box>
                                    )}

                                    <Divider sx={{ mb: 2 }} />

                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                            Orden: {p.orderId}
                                        </Typography>
                                        <Typography fontWeight={700} color={color}>${p.price}</Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} mt="auto">
                                        {isCourse ? (
                                            <Button variant="contained" size="small" fullWidth
                                                startIcon={p.progress === 0 ? <PlayArrowIcon /> : p.progress === 100 ? <CheckCircleIcon /> : <PlayArrowIcon />}
                                                component={Link} href="/dashboard/learning"
                                                sx={{
                                                    fontWeight: 700, borderRadius: 2.5,
                                                    background: p.progress === 100
                                                        ? 'linear-gradient(135deg, #28A745, #2ECC71)'
                                                        : 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                                }}>
                                                {p.progress === 0 ? 'Comenzar' : p.progress === 100 ? 'Completado' : 'Continuar'}
                                            </Button>
                                        ) : (
                                            <Button variant="outlined" size="small" fullWidth startIcon={<DownloadIcon />}
                                                sx={{ fontWeight: 700, borderRadius: 2.5, borderWidth: 2, '&:hover': { borderWidth: 2 }, color, borderColor: color }}>
                                                Descargar
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>

            {filtered.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="text.secondary">No se encontraron compras</Typography>
                </Box>
            )}
        </Box>
    )
}
