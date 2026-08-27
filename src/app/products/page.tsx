'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import TuneIcon from '@mui/icons-material/Tune'
import ProductGrid from '@/components/product/ProductGrid'
import ProductFilters, { FilterState } from '@/components/product/ProductFilters'

const MOCK_PRODUCTS = [
  { id: '1', title: 'Producción Musical Completa', slug: 'produccion-musical-completa', price: 97, originalPrice: 197, type: 'COURSE', rating: 4.9, reviewCount: 234, badge: 'MÁS VENDIDO', badgeColor: '#FF6B35' },
  { id: '2', title: 'Pack Trap Essentials 2024', slug: 'trap-essentials-2024', price: 29, originalPrice: 59, type: 'SAMPLE_PACK', rating: 4.8, reviewCount: 189, badge: 'NUEVO', badgeColor: '#4ECDC4', previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', bpm: 140, keySignature: 'F# Min' },
  { id: '3', title: 'Lo-Fi Chill Beats Vol. 3', slug: 'lofi-chill-beats-vol3', price: 19, type: 'MUSIC', rating: 4.7, reviewCount: 156, previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', bpm: 85, keySignature: 'C Maj' },
  { id: '4', title: 'Mezcla y Mastering Pro', slug: 'mezcla-mastering-pro', price: 67, originalPrice: 127, type: 'COURSE', rating: 4.9, reviewCount: 312, badge: 'OFERTA', badgeColor: '#FF6B35' },
  { id: '5', title: 'House Music Pack Vol. 1', slug: 'house-music-pack-vol1', price: 39, type: 'SAMPLE_PACK', rating: 4.6, reviewCount: 98, previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', bpm: 126, keySignature: 'G Min' },
  { id: '6', title: 'FL Studio Completo', slug: 'fl-studio-completo', price: 79, originalPrice: 149, type: 'COURSE', rating: 4.8, reviewCount: 267 },
  { id: '7', title: 'R&B Guitar Loops', slug: 'rnb-guitar-loops', price: 25, type: 'SAMPLE_PACK', rating: 4.7, reviewCount: 143, previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', bpm: 90, keySignature: 'D Min' },
  { id: '8', title: 'Piano Melodies Pack', slug: 'piano-melodies-pack', price: 22, type: 'MUSIC', rating: 4.5, reviewCount: 87, previewUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', bpm: 75, keySignature: 'E Min' },
]

const SORT_OPTIONS = [
  { label: 'Más recientes', value: 'createdAt-desc' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Mejor valorados', value: 'rating-desc' },
]

const DEFAULT_FILTERS: FilterState = {
  priceRange: [0, 300],
  minRating: 0,
  types: [],
  tags: [],
}

export default function ProductsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sort, setSort] = useState('createdAt-desc')
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = MOCK_PRODUCTS.filter((p) => {
    if (filters.types.length > 0 && !filters.types.includes(p.type)) return false
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) return false
    if (filters.minRating > 0 && (p.rating || 0) < filters.minRating) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price
    if (sort === 'price-desc') return b.price - a.price
    if (sort === 'rating-desc') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, minHeight: '80vh' }}>
      <Container maxWidth="xl">
        {/* ─── Page Header ─── */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={800} mb={0.5}>
            Todos los productos
          </Typography>
          <Typography color="text.secondary">
            {filtered.length} de {MOCK_PRODUCTS.length} productos disponibles
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="flex-start">
          {/* ─── Sidebar Filters (Desktop) ─── */}
          {!isMobile && (
            <Box sx={{ width: 280, flexShrink: 0 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid #E9ECEF',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  background: '#FFFFFF',
                  position: 'sticky',
                  top: 88,
                }}
              >
                <ProductFilters filters={filters} onChange={setFilters} />
              </Box>
            </Box>
          )}

          {/* ─── Main Content ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Search + Sort + Mobile Filter Button */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              mb={3}
              alignItems={{ sm: 'center' }}
            >
              <TextField
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {isMobile && (
                <Button
                  startIcon={<TuneIcon />}
                  variant="outlined"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ borderRadius: 3, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                >
                  Filtros
                  {(filters.types.length > 0 || filters.minRating > 0 || filters.tags.length > 0) && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1, width: 18, height: 18, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                        color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {filters.types.length + (filters.minRating > 0 ? 1 : 0) + filters.tags.length}
                    </Box>
                  )}
                </Button>
              )}

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Ordenar por</InputLabel>
                <Select
                  value={sort}
                  label="Ordenar por"
                  onChange={(e) => setSort(e.target.value)}
                  sx={{ borderRadius: 3 }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Product Grid */}
            <ProductGrid
              products={filtered}
              emptyMessage="No se encontraron productos con esos filtros"
            />
          </Box>
        </Stack>
      </Container>

      {/* ─── Mobile Filter Drawer ─── */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 300, p: 3, borderRadius: '0 16px 16px 0' } }}
      >
        <ProductFilters
          filters={filters}
          onChange={setFilters}
          onClose={() => setDrawerOpen(false)}
        />
      </Drawer>
    </Box>
  )
}
