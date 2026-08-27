'use client'

import { useState } from 'react'
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Button,
    Chip,
    Tab,
    Tabs,
    Rating,
    Divider,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Breadcrumbs,
    useMediaQuery,
    useTheme,
    Skeleton,
} from '@mui/material'
import Link from 'next/link'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteFilledIcon from '@mui/icons-material/Favorite'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import VerifiedIcon from '@mui/icons-material/Verified'
import ShareIcon from '@mui/icons-material/Share'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import SchoolIcon from '@mui/icons-material/School'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import ProductCard from '@/components/product/ProductCard'
import { useCart } from '@/context/CartContext'
import PlayPreviewButton from '@/components/audio/PlayPreviewButton'

// ─── Mock data (will be replaced by real API) ────────────────────────────────
const MOCK_PRODUCTS: Record<string, any> = {
    'produccion-musical-completa': {
        id: '1', title: 'Producción Musical Completa', slug: 'produccion-musical-completa',
        price: 97, originalPrice: 197, type: 'COURSE', rating: 4.9, reviewCount: 234,
        badge: 'MÁS VENDIDO', badgeColor: '#FF6B35',
        description: 'Aprende producción musical desde cero hasta nivel profesional. Este curso cubre todo lo que necesitas saber para crear tus propias canciones, desde la elección de software hasta las técnicas avanzadas de mezcla y masterización.',
        features: ['Más de 40 horas de contenido en video', 'Acceso de por vida', 'Descarga de recursos exclusivos', 'Certificado de finalización', 'Soporte directo del instructor'],
        lessons: [
            { title: 'Introducción a la producción musical', duration: '45 min' },
            { title: 'Configuración del entorno de trabajo', duration: '1h 20 min' },
            { title: 'Fundamentos de teoría musical', duration: '2h 15 min' },
            { title: 'Programación de ritmos y beats', duration: '1h 50 min' },
            { title: 'Síntesis y diseño de sonido', duration: '2h 30 min' },
            { title: 'Grabación de instrumentos', duration: '1h 45 min' },
            { title: 'Mezcla profesional', duration: '3h 10 min' },
            { title: 'Masterización', duration: '2h 00 min' },
        ],
        instructor: { name: 'Carlos Medina', avatar: '', role: 'Productor con 15 años de experiencia' },
        images: [],
        tags: ['Producción', 'FL Studio', 'Mezcla', 'Beginner'],
        previewUrl: null,
    },
    'trap-essentials-2024': {
        id: '2', title: 'Pack Trap Essentials 2024', slug: 'trap-essentials-2024',
        price: 29, originalPrice: 59, type: 'SAMPLE_PACK', rating: 4.8, reviewCount: 189,
        badge: 'NUEVO', badgeColor: '#4ECDC4',
        description: 'El pack de samples de Trap más completo del año. Incluye más de 500 samples de alta calidad, loops de batería, melodías, efectos de sonido y mucho más.',
        features: ['500+ samples listos para usar', 'Formato 24-bit / 44.1 kHz', 'Compatible con todos los DAWs', 'Libre de regalías', 'Actualizaciones gratuitas'],
        lessons: [],
        instructor: { name: 'Beat Lab Studio', avatar: '', role: 'Colección oficial 2024' },
        images: [],
        tags: ['Trap', 'Samples', 'Loops', 'Avanzado'],
        previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        bpm: 140,
        key: 'F# Min',
    },
    'lofi-chill-beats-vol3': {
        id: '3', title: 'Lo-Fi Chill Beats Vol. 3', slug: 'lofi-chill-beats-vol3',
        price: 19, type: 'MUSIC', rating: 4.7, reviewCount: 156,
        description: 'Colección de beats lo-fi perfectos para estudiar, relajarse o crear contenido. Produce con la estética vintage que está de moda.',
        features: ['25 beats lo-fi exclusivos', 'Licencia comercial incluida', 'Stems descargables', 'Formato MP3 + WAV'],
        lessons: [],
        instructor: { name: 'ChillWave Beats', avatar: '', role: 'Productor Lo-Fi' },
        images: [],
        tags: ['Lo-Fi', 'Chill', 'Música'],
        previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        bpm: 85,
        key: 'C Maj',
    },
    default: {
        id: '0', title: 'Producto no encontrado', slug: '',
        price: 0, type: 'COURSE', rating: 0, reviewCount: 0,
        description: '',
        features: [], lessons: [], instructor: { name: '', avatar: '', role: '' },
        images: [], tags: [],
        previewUrl: null,
    },
}

const RELATED_PRODUCTS = [
    { id: '4', title: 'Mezcla y Mastering Pro', slug: 'mezcla-mastering-pro', price: 67, originalPrice: 127, type: 'COURSE', rating: 4.9, reviewCount: 312, badge: 'OFERTA' },
    { id: '5', title: 'House Music Pack Vol. 1', slug: 'house-music-pack-vol1', price: 39, type: 'SAMPLE_PACK', rating: 4.6, reviewCount: 98 },
    { id: '6', title: 'FL Studio Completo', slug: 'fl-studio-completo', price: 79, originalPrice: 149, type: 'COURSE', rating: 4.8, reviewCount: 267 },
    { id: '7', title: 'R&B Guitar Loops', slug: 'rnb-guitar-loops', price: 25, type: 'SAMPLE_PACK', rating: 4.7, reviewCount: 143 },
]

const REVIEWS_MOCK = [
    { id: 1, name: 'María G.', rating: 5, comment: 'Excelente curso, aprendí muchísimo. El instructor explica de forma clara y detallada.', date: 'Enero 2026' },
    { id: 2, name: 'Juan P.', rating: 5, comment: 'El mejor contenido de producción que he encontrado en español. 100% recomendado.', date: 'Diciembre 2025' },
    { id: 3, name: 'Sofia M.', rating: 4, comment: 'Muy buen contenido. Me hubiera gustado más material sobre síntesis, pero en general excelente.', date: 'Noviembre 2025' },
]

const typeIcons: Record<string, React.ReactNode> = {
    COURSE: <SchoolIcon />,
    MUSIC: <MusicNoteIcon />,
    SAMPLE_PACK: <LibraryMusicIcon />,
}

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35',
    MUSIC: '#4ECDC4',
    SAMPLE_PACK: '#A29BFE',
    BUNDLE: '#FFE66D',
}

// ─── TabPanel ────────────────────────────────────────────────────────────────
function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
    return (
        <Box role="tabpanel" hidden={value !== index} sx={{ pt: 3 }}>
            {value === index && children}
        </Box>
    )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ product }: { product: any }) {
    const color = typeColors[product.type] || '#FF6B35'
    const audioUrl = product.previewUrl || (product.type === 'SAMPLE_PACK' || product.type === 'MUSIC' ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' : null)

    return (
        <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden', aspectRatio: '16/9', background: `linear-gradient(135deg, ${color}15, ${color}35)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.images?.[0] ? (
                <Box component="img" src={product.images[0]} alt={product.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Box sx={{ fontSize: 80, mb: 2, opacity: 0.5 }}>
                        {typeIcons[product.type] || <PlayArrowIcon sx={{ fontSize: 80 }} />}
                    </Box>
                    <Typography color="text.secondary" variant="body2">
                        {audioUrl ? 'Haz clic abajo para escuchar una muestra' : 'Vista previa no disponible'}
                    </Typography>
                </Box>
            )}
            {audioUrl && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.35)',
                        transition: 'background 0.3s ease',
                        zIndex: 2,
                    }}
                >
                    <PlayPreviewButton
                        track={{
                            id: product.id,
                            title: product.title,
                            artist: product.instructor?.name || 'DigitalMarket',
                            audioUrl: audioUrl,
                            coverUrl: product.images?.[0],
                            bpm: product.bpm || (product.type === 'SAMPLE_PACK' ? 140 : 85),
                            key: product.key || (product.type === 'SAMPLE_PACK' ? 'F# Min' : 'C Maj'),
                        }}
                        variant="overlay"
                        className="!w-16 !h-16 shadow-2xl"
                    />
                </Box>
            )}
        </Box>
    )
}

// ─── Purchase Box ─────────────────────────────────────────────────────────────
function PurchaseBox({ product, onAddToCart, isFavorite, onToggleFavorite, isMobile = false }: any) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0

    const boxContent = (
        <Box
            sx={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.6)',
                borderRadius: isMobile ? 0 : 4,
                p: isMobile ? 2 : 3,
                boxShadow: isMobile ? '0 -4px 24px rgba(0,0,0,0.1)' : '0 8px 32px rgba(0,0,0,0.10)',
            }}
        >
            <Stack direction="row" alignItems="flex-end" spacing={1.5} mb={isMobile ? 1.5 : 2}>
                <Typography variant="h4" fontWeight={800} color="primary.main" lineHeight={1}>
                    ${product.price}
                </Typography>
                {product.originalPrice && (
                    <>
                        <Typography
                            variant="body1"
                            sx={{ textDecoration: 'line-through', color: 'text.disabled', lineHeight: 1.4 }}
                        >
                            ${product.originalPrice}
                        </Typography>
                        <Chip
                            label={`-${discount}%`}
                            size="small"
                            sx={{ background: 'linear-gradient(135deg, #28A745, #2ECC71)', color: '#fff', fontWeight: 700 }}
                        />
                    </>
                )}
            </Stack>

            <Stack spacing={1.5}>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={onAddToCart}
                    sx={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        py: 1.5,
                        boxShadow: '0 4px 20px rgba(255,107,53,0.4)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #E65A2E 0%, #FF6B35 100%)',
                            boxShadow: '0 8px 28px rgba(255,107,53,0.5)',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Agregar al carrito
                </Button>

                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={isFavorite ? <FavoriteFilledIcon sx={{ color: '#DC3545' }} /> : <FavoriteIcon />}
                        onClick={onToggleFavorite}
                        sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                    >
                        {isFavorite ? 'Guardado' : 'Guardar'}
                    </Button>
                    <IconButton sx={{ border: '2px solid', borderColor: 'divider', borderRadius: 2.5 }}>
                        <ShareIcon />
                    </IconButton>
                </Stack>
            </Stack>

            {!isMobile && (
                <>
                    <Divider sx={{ my: 2.5 }} />
                    <Stack spacing={1.5}>
                        {[
                            { icon: <VerifiedIcon sx={{ color: '#28A745', fontSize: 18 }} />, text: 'Garantía de 30 días' },
                            { icon: <CloudDownloadIcon sx={{ color: '#4ECDC4', fontSize: 18 }} />, text: 'Acceso inmediato' },
                            { icon: <AccessTimeIcon sx={{ color: '#FF6B35', fontSize: 18 }} />, text: 'Acceso de por vida' },
                        ].map(({ icon, text }) => (
                            <Stack key={text} direction="row" alignItems="center" spacing={1}>
                                {icon}
                                <Typography variant="body2" color="text.secondary">{text}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </>
            )}
        </Box>
    )

    if (isMobile) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1200,
                }}
            >
                {boxContent}
            </Box>
        )
    }

    return (
        <Box sx={{ position: 'sticky', top: 88 }}>
            {boxContent}
        </Box>
    )
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))
    const [tab, setTab] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const { addItem } = useCart()

    const product = MOCK_PRODUCTS[params.slug] || MOCK_PRODUCTS.default
    const color = typeColors[product.type] || '#FF6B35'
    const isCourse = product.type === 'COURSE'

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || null,
            type: product.type,
        })
    }

    return (
        <Box sx={{ pb: isMobile ? 14 : 0 }}>
            {/* ─── Breadcrumbs ─── */}
            <Box sx={{ background: '#F8F9FA', borderBottom: '1px solid #E9ECEF', py: 1.5, display: { xs: 'none', md: 'block' } }}>
                <Container maxWidth="xl">
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ fontSize: '0.875rem' }}>
                        <Link href="/" style={{ color: '#6C757D', textDecoration: 'none' }}>Inicio</Link>
                        <Link href="/products" style={{ color: '#6C757D', textDecoration: 'none' }}>Productos</Link>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>{product.title}</Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
                <Grid container spacing={{ xs: 3, md: 5 }}>

                    {/* ─── LEFT COLUMN (60%) ─── */}
                    <Grid item xs={12} md={7} lg={8}>

                        {/* Hero Badge + Title */}
                        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" gap={0.5}>
                            <Chip
                                icon={<Box sx={{ color: `${color} !important`, ml: 0.5 }}>{typeIcons[product.type]}</Box>}
                                label={product.type === 'COURSE' ? 'Curso' : product.type === 'MUSIC' ? 'Música' : product.type === 'SAMPLE_PACK' ? 'Sample Pack' : product.type}
                                sx={{ background: `${color}18`, color, fontWeight: 700, fontSize: '0.8125rem' }}
                            />
                            {product.badge && (
                                <Chip
                                    label={product.badge}
                                    sx={{ background: product.badgeColor || color, color: '#fff', fontWeight: 700, fontSize: '0.8125rem' }}
                                />
                            )}
                        </Stack>

                        <Typography
                            variant="h3"
                            fontWeight={800}
                            mb={2}
                            sx={{ lineHeight: 1.25, fontSize: { xs: '1.75rem', md: '2.25rem' } }}
                        >
                            {product.title}
                        </Typography>

                        {/* Rating Row */}
                        {product.reviewCount > 0 && (
                            <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
                                <Rating value={product.rating} precision={0.1} size="medium" readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFC107' } }} />
                                <Typography fontWeight={700} color="text.primary">{product.rating}</Typography>
                                <Typography color="text.secondary" variant="body2">({product.reviewCount} reseñas)</Typography>
                            </Stack>
                        )}

                        {/* Image Gallery */}
                        <Box mb={3}>
                            <ImageGallery product={product} />
                        </Box>

                        {/* Instructor (mobile above tabs) */}
                        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}
                            sx={{ p: 2, borderRadius: 3, background: '#F8F9FA', border: '1px solid #E9ECEF' }}>
                            <Avatar
                                sx={{
                                    width: 48, height: 48,
                                    background: `linear-gradient(135deg, ${color}, ${color}88)`,
                                    fontWeight: 700, fontSize: '1.1rem',
                                }}
                            >
                                {product.instructor?.name?.[0] || '?'}
                            </Avatar>
                            <Box>
                                <Typography fontWeight={700} variant="body1">{product.instructor?.name}</Typography>
                                <Typography variant="caption" color="text.secondary">{product.instructor?.role}</Typography>
                            </Box>
                        </Stack>

                        {/* ─── TABS ─── */}
                        <Box sx={{ borderBottom: '2px solid #E9ECEF' }}>
                            <Tabs
                                value={tab}
                                onChange={(_, v) => setTab(v)}
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        background: 'linear-gradient(90deg, #FF6B35, #FF8C61)',
                                        height: 3,
                                        borderRadius: '3px 3px 0 0',
                                    },
                                }}
                            >
                                <Tab label="Descripción" />
                                {(product.lessons?.length > 0 || isCourse) && <Tab label={isCourse ? 'Contenidos' : 'Archivos'} />}
                                {product.reviewCount > 0 && <Tab label={`Reseñas (${product.reviewCount})`} />}
                            </Tabs>
                        </Box>

                        {/* Tab 0: Descripción */}
                        <TabPanel value={tab} index={0}>
                            <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={3}>
                                {product.description}
                            </Typography>
                            {product.features?.length > 0 && (
                                <>
                                    <Typography variant="h6" fontWeight={700} mb={2}>¿Qué incluye?</Typography>
                                    <List disablePadding>
                                        {product.features.map((f: string, i: number) => (
                                            <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <CheckCircleIcon sx={{ color, fontSize: 20 }} />
                                                </ListItemIcon>
                                                <ListItemText primary={f} primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </>
                            )}
                            {product.tags?.length > 0 && (
                                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={3}>
                                    {product.tags.map((tag: string) => (
                                        <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
                                    ))}
                                </Stack>
                            )}
                        </TabPanel>

                        {/* Tab 1: Contenidos / Archivos */}
                        {(product.lessons?.length > 0 || isCourse) && (
                            <TabPanel value={tab} index={1}>
                                <Typography variant="h6" fontWeight={700} mb={2}>
                                    {isCourse ? `${product.lessons?.length} lecciones` : 'Archivos incluidos'}
                                </Typography>
                                <Stack spacing={1}>
                                    {(product.lessons || []).map((lesson: any, i: number) => (
                                        <Box
                                            key={i}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 2,
                                                borderRadius: 2.5,
                                                border: '1px solid #E9ECEF',
                                                background: '#FAFAFA',
                                                transition: 'all 0.2s ease',
                                                '&:hover': { background: `${color}08`, borderColor: `${color}40` },
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" spacing={1.5}>
                                                <Box
                                                    sx={{
                                                        width: 32, height: 32, borderRadius: '50%',
                                                        background: `${color}18`, display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="caption" fontWeight={700} color={color}>{i + 1}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>{lesson.title}</Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                                <Typography variant="caption" color="text.secondary">{lesson.duration}</Typography>
                                            </Stack>
                                        </Box>
                                    ))}
                                </Stack>
                            </TabPanel>
                        )}

                        {/* Tab 2: Reseñas */}
                        {product.reviewCount > 0 && (
                            <TabPanel value={tab} index={product.lessons?.length > 0 ? 2 : 1}>
                                <Stack spacing={3}>
                                    {REVIEWS_MOCK.map((review) => (
                                        <Box key={review.id} sx={{ p: 3, borderRadius: 3, border: '1px solid #E9ECEF', background: '#FAFAFA' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                    <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${color}, ${color}88)`, fontSize: '0.9rem', fontWeight: 700 }}>
                                                        {review.name[0]}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle2" fontWeight={700}>{review.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                                                    </Box>
                                                </Stack>
                                                <Rating value={review.rating} size="small" readOnly sx={{ '& .MuiRating-iconFilled': { color: '#FFC107' } }} />
                                            </Stack>
                                            <Typography variant="body2" color="text.secondary" lineHeight={1.7}>{review.comment}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </TabPanel>
                        )}
                    </Grid>

                    {/* ─── RIGHT COLUMN (40%) - Desktop only ─── */}
                    <Grid item md={5} lg={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                        <PurchaseBox
                            product={product}
                            onAddToCart={handleAddToCart}
                            isFavorite={isFavorite}
                            onToggleFavorite={() => setIsFavorite(!isFavorite)}
                        />

                        {/* Quick Stats */}
                        <Box sx={{ mt: 3, p: 3, borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                            <Typography variant="subtitle2" fontWeight={700} mb={2}>Detalles del producto</Typography>
                            <Stack spacing={1.5}>
                                {isCourse && product.lessons?.length > 0 && (
                                    <Stack direction="row" justifyContent="space-between">
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <OndemandVideoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="text.secondary">Lecciones</Typography>
                                        </Stack>
                                        <Typography variant="body2" fontWeight={600}>{product.lessons.length}</Typography>
                                    </Stack>
                                )}
                                <Stack direction="row" justifyContent="space-between">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <VerifiedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">Certificado</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={600}>{isCourse ? 'Incluido' : 'N/A'}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <CloudDownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2" color="text.secondary">Acceso</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={600}>De por vida</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>

                {/* ─── Related Products ─── */}
                <Box mt={{ xs: 6, md: 8 }}>
                    <Typography variant="h5" fontWeight={700} mb={3}>
                        También te puede interesar
                    </Typography>
                    <Grid container spacing={3}>
                        {RELATED_PRODUCTS.slice(0, 4).map((p) => (
                            <Grid item xs={12} sm={6} lg={3} key={p.id}>
                                <ProductCard {...p} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* ─── Sticky Bottom Bar (Mobile only) ─── */}
            {isMobile && (
                <PurchaseBox
                    product={product}
                    onAddToCart={handleAddToCart}
                    isFavorite={isFavorite}
                    onToggleFavorite={() => setIsFavorite(!isFavorite)}
                    isMobile={true}
                />
            )}
        </Box>
    )
}
