'use client'

import {
    Box, Typography, Grid, Card, CardContent, Stack,
    Chip, Button, IconButton,
} from '@mui/material'
import Link from 'next/link'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import { useCart } from '@/context/CartContext'

const FAVORITES = [
    { id: '1', title: 'Mezcla y Mastering Pro', slug: 'mezcla-mastering-pro', type: 'COURSE', price: 67, originalPrice: 127, rating: 4.9, reviewCount: 312 },
    { id: '2', title: 'House Music Pack Vol. 1', slug: 'house-music-pack-vol1', type: 'SAMPLE_PACK', price: 39, rating: 4.6, reviewCount: 98 },
    { id: '3', title: 'R&B Guitar Loops', slug: 'rnb-guitar-loops', type: 'SAMPLE_PACK', price: 25, rating: 4.7, reviewCount: 143 },
    { id: '4', title: 'Piano Melodies Pack', slug: 'piano-melodies-pack', type: 'MUSIC', price: 22, rating: 4.5, reviewCount: 87 },
]

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35', MUSIC: '#4ECDC4', SAMPLE_PACK: '#A29BFE',
}

const typeIcons: Record<string, React.ReactNode> = {
    COURSE: <SchoolIcon />, MUSIC: <MusicNoteIcon />, SAMPLE_PACK: <LibraryMusicIcon />,
}

const typeLabels: Record<string, string> = {
    COURSE: 'Curso', MUSIC: 'Música', SAMPLE_PACK: 'Samples',
}

export default function FavoritesPage() {
    const { addItem } = useCart()

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight={800} mb={0.5}>Favoritos</Typography>
                    <Typography color="text.secondary">{FAVORITES.length} productos guardados</Typography>
                </Box>
                <Button component={Link} href="/products" variant="outlined"
                    sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                    Explorar más
                </Button>
            </Stack>

            <Grid container spacing={2.5}>
                {FAVORITES.map((p) => {
                    const color = typeColors[p.type] || '#FF6B35'
                    const discount = p.originalPrice
                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                        : 0

                    return (
                        <Grid item xs={12} sm={6} lg={3} key={p.id}>
                            <Card elevation={0} sx={{
                                borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF',
                                height: '100%', display: 'flex', flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: `0 8px 24px ${color}20` },
                            }}>
                                {/* Thumbnail */}
                                <Box sx={{
                                    height: 140, background: `linear-gradient(135deg, ${color}18, ${color}30)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative',
                                    borderRadius: '16px 16px 0 0',
                                }}>
                                    <Box sx={{ color, opacity: 0.6, '& svg': { fontSize: 52 } }}>
                                        {typeIcons[p.type]}
                                    </Box>
                                    <IconButton
                                        size="small"
                                        sx={{
                                            position: 'absolute', top: 8, right: 8,
                                            background: 'rgba(255,255,255,0.9)',
                                            '&:hover': { background: '#fff', color: '#DC3545' },
                                            color: '#DC3545',
                                        }}
                                    >
                                        <FavoriteIcon fontSize="small" />
                                    </IconButton>
                                    {discount > 0 && (
                                        <Chip
                                            label={`-${discount}%`}
                                            size="small"
                                            sx={{
                                                position: 'absolute', top: 8, left: 8,
                                                background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                                color: '#fff', fontWeight: 700, fontSize: '0.7rem',
                                            }}
                                        />
                                    )}
                                </Box>

                                <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Chip label={typeLabels[p.type]} size="small" sx={{ mb: 1.25, alignSelf: 'flex-start', height: 20, fontSize: '0.65rem', fontWeight: 700, background: `${color}15`, color }} />
                                    <Typography variant="body1" fontWeight={700} mb={0.5} sx={{ lineHeight: 1.3 }}>
                                        {p.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" mb={1.5}>
                                        ⭐ {p.rating} · {p.reviewCount} reseñas
                                    </Typography>

                                    <Stack direction="row" alignItems="center" spacing={1} mb={2} mt="auto">
                                        <Typography variant="h6" fontWeight={800} color={color}>${p.price}</Typography>
                                        {p.originalPrice && (
                                            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                                                ${p.originalPrice}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Button
                                            variant="contained" size="small" fullWidth
                                            startIcon={<ShoppingCartIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => addItem({ id: p.id, title: p.title, price: p.price, type: p.type, slug: p.slug })}
                                            sx={{ fontWeight: 700, borderRadius: 2.5, background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                                        >
                                            Agregar al carrito
                                        </Button>
                                        <Button
                                            variant="text" size="small" fullWidth
                                            component={Link} href={`/products/${p.slug}`}
                                            startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                                            sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.8rem' }}
                                        >
                                            Ver detalles
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
        </Box>
    )
}
