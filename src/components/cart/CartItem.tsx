'use client'

import {
    Box,
    Typography,
    IconButton,
    Stack,
    Chip,
    Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CloseIcon from '@mui/icons-material/Close'
import SchoolIcon from '@mui/icons-material/School'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

const typeColors: Record<string, string> = {
    COURSE: '#FF6B35',
    MUSIC: '#4ECDC4',
    SAMPLE_PACK: '#A29BFE',
    BUNDLE: '#FFE66D',
}

const typeIcons: Record<string, React.ReactNode> = {
    COURSE: <SchoolIcon sx={{ fontSize: 16 }} />,
    MUSIC: <MusicNoteIcon sx={{ fontSize: 16 }} />,
    SAMPLE_PACK: <LibraryMusicIcon sx={{ fontSize: 16 }} />,
    BUNDLE: <ShoppingBagIcon sx={{ fontSize: 16 }} />,
}

const typeLabels: Record<string, string> = {
    COURSE: 'Curso',
    MUSIC: 'Música',
    SAMPLE_PACK: 'Samples',
    BUNDLE: 'Bundle',
}

interface CartItemProps {
    productId: string
    title: string
    price: number
    comparePrice?: number | null
    type: string
    image?: string | null
    quantity: number
    compact?: boolean
}

export default function CartItemCard({
    productId,
    title,
    price,
    comparePrice,
    type,
    image,
    quantity,
    compact = false,
}: CartItemProps) {
    const { removeItem, updateQuantity } = useCart()
    const color = typeColors[type] || '#FF6B35'
    const lineTotal = price * quantity

    return (
        <Box
            sx={{
                display: 'flex',
                gap: compact ? 1.5 : 2,
                p: compact ? 1.5 : 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background: '#FFFFFF',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                    borderColor: `${color}50`,
                    boxShadow: `0 4px 16px ${color}15`,
                },
            }}
        >
            {/* Thumbnail */}
            <Box
                sx={{
                    width: compact ? 60 : 76,
                    height: compact ? 60 : 76,
                    borderRadius: 2,
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {image ? (
                    <Box
                        component="img"
                        src={image}
                        alt={title}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Box sx={{ color, opacity: 0.7 }}>{typeIcons[type]}</Box>
                )}
            </Box>

            {/* Info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                        mb: 0.5,
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.4,
                    }}
                >
                    {title}
                </Typography>

                <Chip
                    label={typeLabels[type] || type}
                    size="small"
                    icon={<Box sx={{ color: `${color} !important`, display: 'flex', ml: '4px !important' }}>{typeIcons[type]}</Box>}
                    sx={{
                        mb: 1,
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        background: `${color}15`,
                        color,
                        '& .MuiChip-icon': { ml: 0.5 },
                    }}
                />

                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    {/* Price */}
                    <Box>
                        <Typography variant="body2" fontWeight={800} color={color} lineHeight={1}>
                            {formatPrice(lineTotal)}
                        </Typography>
                        {quantity > 1 && (
                            <Typography variant="caption" color="text.disabled">
                                {formatPrice(price)} c/u
                            </Typography>
                        )}
                        {comparePrice && comparePrice > price && (
                            <Typography
                                variant="caption"
                                sx={{ textDecoration: 'line-through', color: 'text.disabled', display: 'block' }}
                            >
                                {formatPrice(comparePrice)}
                            </Typography>
                        )}
                    </Box>

                    {/* Quantity Controls */}
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Tooltip title="Quitar uno">
                            <IconButton
                                size="small"
                                onClick={() => updateQuantity(productId, quantity - 1)}
                                sx={{
                                    width: 28, height: 28, border: '1.5px solid',
                                    borderColor: 'divider', borderRadius: 1.5,
                                    '&:hover': { borderColor: color, color },
                                }}
                            >
                                <RemoveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ minWidth: 24, textAlign: 'center' }}
                        >
                            {quantity}
                        </Typography>
                        <Tooltip title="Agregar uno">
                            <IconButton
                                size="small"
                                onClick={() => updateQuantity(productId, quantity + 1)}
                                sx={{
                                    width: 28, height: 28, border: '1.5px solid',
                                    borderColor: 'divider', borderRadius: 1.5,
                                    '&:hover': { borderColor: color, color },
                                }}
                            >
                                <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Box>

            {/* Remove Button */}
            <Tooltip title="Eliminar">
                <IconButton
                    size="small"
                    onClick={() => removeItem(productId)}
                    sx={{
                        alignSelf: 'flex-start',
                        color: 'text.disabled',
                        '&:hover': { color: 'error.main', background: 'rgba(220,53,69,0.08)' },
                        transition: 'all 0.2s ease',
                    }}
                >
                    <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Tooltip>
        </Box>
    )
}
