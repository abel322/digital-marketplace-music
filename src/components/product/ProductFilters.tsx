'use client'

import {
    Box,
    Typography,
    Stack,
    Slider,
    Chip,
    Divider,
    IconButton,
    Rating,
    Button,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TuneIcon from '@mui/icons-material/Tune'

export interface FilterState {
    priceRange: [number, number]
    minRating: number
    types: string[]
    tags: string[]
}

interface ProductFiltersProps {
    filters: FilterState
    onChange: (filters: FilterState) => void
    onClose?: () => void
    showHeader?: boolean
    maxPrice?: number
    availableTags?: string[]
}

const TYPE_OPTIONS = [
    { label: 'Cursos', value: 'COURSE', color: '#FF6B35' },
    { label: 'Música', value: 'MUSIC', color: '#4ECDC4' },
    { label: 'Samples', value: 'SAMPLE_PACK', color: '#A29BFE' },
    { label: 'Bundles', value: 'BUNDLE', color: '#FFE66D' },
]

const DEFAULT_TAGS = [
    'Producción', 'Mezcla', 'Mastering', 'Trap', 'Lo-Fi', 'House',
    'FL Studio', 'Ableton', 'Piano', 'Guitarra', 'Beginner', 'Avanzado',
]

export default function ProductFilters({
    filters,
    onChange,
    onClose,
    showHeader = true,
    maxPrice = 300,
    availableTags = DEFAULT_TAGS,
}: ProductFiltersProps) {
    const activeFiltersCount =
        (filters.minRating > 0 ? 1 : 0) +
        filters.types.length +
        filters.tags.length +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0)

    const toggleType = (value: string) => {
        const next = filters.types.includes(value)
            ? filters.types.filter((t) => t !== value)
            : [...filters.types, value]
        onChange({ ...filters, types: next })
    }

    const toggleTag = (tag: string) => {
        const next = filters.tags.includes(tag)
            ? filters.tags.filter((t) => t !== tag)
            : [...filters.tags, tag]
        onChange({ ...filters, tags: next })
    }

    const clearAll = () => {
        onChange({ priceRange: [0, maxPrice], minRating: 0, types: [], tags: [] })
    }

    return (
        <Box>
            {showHeader && (
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <TuneIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Typography variant="subtitle1" fontWeight={700}>
                            Filtros
                        </Typography>
                        {activeFiltersCount > 0 && (
                            <Chip
                                label={activeFiltersCount}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    height: 20,
                                    fontSize: '0.7rem',
                                }}
                            />
                        )}
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                        {activeFiltersCount > 0 && (
                            <Button
                                size="small"
                                variant="text"
                                onClick={clearAll}
                                sx={{ fontSize: '0.75rem', py: 0.5 }}
                            >
                                Limpiar
                            </Button>
                        )}
                        {onClose && (
                            <IconButton size="small" onClick={onClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>
                </Stack>
            )}

            <Stack spacing={3}>
                {/* Type Filter */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.primary">
                        Tipo de producto
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {TYPE_OPTIONS.map((opt) => {
                            const selected = filters.types.includes(opt.value)
                            return (
                                <Chip
                                    key={opt.value}
                                    label={opt.label}
                                    clickable
                                    onClick={() => toggleType(opt.value)}
                                    sx={{
                                        fontWeight: 600,
                                        fontSize: '0.8125rem',
                                        transition: 'all 0.2s ease',
                                        ...(selected
                                            ? {
                                                background: opt.color,
                                                color: '#FFFFFF',
                                                boxShadow: `0 4px 12px ${opt.color}50`,
                                                transform: 'scale(1.02)',
                                            }
                                            : {
                                                background: '#F8F9FA',
                                                color: 'text.secondary',
                                                border: '1px solid #E9ECEF',
                                                '&:hover': { background: `${opt.color}15`, borderColor: opt.color },
                                            }),
                                    }}
                                />
                            )
                        })}
                    </Stack>
                </Box>

                <Divider />

                {/* Price Range */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={2} color="text.primary">
                        Rango de precio
                    </Typography>
                    <Slider
                        value={filters.priceRange}
                        onChange={(_, v) => onChange({ ...filters, priceRange: v as [number, number] })}
                        min={0}
                        max={maxPrice}
                        step={5}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `$${v}`}
                        sx={{
                            color: 'primary.main',
                            '& .MuiSlider-thumb': {
                                boxShadow: '0 0 0 8px rgba(255,107,53,0.12)',
                                '&:hover': { boxShadow: '0 0 0 12px rgba(255,107,53,0.18)' },
                            },
                            '& .MuiSlider-track': {
                                background: 'linear-gradient(90deg, #FF6B35, #FF8C61)',
                                border: 'none',
                            },
                        }}
                    />
                    <Stack direction="row" justifyContent="space-between" mt={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            ${filters.priceRange[0]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            ${filters.priceRange[1]}
                        </Typography>
                    </Stack>
                </Box>

                <Divider />

                {/* Min Rating */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.primary">
                        Valoración mínima
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Rating
                            value={filters.minRating}
                            onChange={(_, v) => onChange({ ...filters, minRating: v || 0 })}
                            size="medium"
                            sx={{
                                '& .MuiRating-iconFilled': { color: '#FFC107' },
                                '& .MuiRating-iconHover': { color: '#FFB300' },
                            }}
                        />
                        {filters.minRating > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                {filters.minRating}+ estrellas
                            </Typography>
                        )}
                    </Stack>
                </Box>

                <Divider />

                {/* Tags */}
                <Box>
                    <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="text.primary">
                        Etiquetas
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                        {availableTags.map((tag) => {
                            const selected = filters.tags.includes(tag)
                            return (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    size="small"
                                    clickable
                                    onClick={() => toggleTag(tag)}
                                    sx={{
                                        fontSize: '0.75rem',
                                        transition: 'all 0.2s ease',
                                        ...(selected
                                            ? {
                                                background: 'rgba(255,107,53,0.12)',
                                                color: '#E65A2E',
                                                border: '1px solid rgba(255,107,53,0.3)',
                                                fontWeight: 700,
                                            }
                                            : {
                                                background: '#F8F9FA',
                                                color: 'text.secondary',
                                                border: '1px solid #E9ECEF',
                                                fontWeight: 500,
                                                '&:hover': { background: 'rgba(255,107,53,0.07)' },
                                            }),
                                    }}
                                />
                            )
                        })}
                    </Box>
                </Box>
            </Stack>
        </Box>
    )
}
