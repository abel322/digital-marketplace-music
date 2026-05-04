'use client'

import { useState } from 'react'
import {
    Box, Typography, Stack, Button, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Menu, MenuItem, Select, FormControl,
    InputLabel, Avatar, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, Pagination,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FilterListIcon from '@mui/icons-material/FilterList'

const MOCK_PRODUCTS = [
    { id: '1', title: 'Producción Musical Completa', slug: 'produccion-musical-completa', type: 'COURSE', price: 97, comparePrice: 197, status: 'PUBLISHED', sales: 67, rating: 4.9, createdAt: '20 Ene 2026' },
    { id: '2', title: 'Pack Trap Essentials 2024', slug: 'trap-essentials-2024', type: 'SAMPLE_PACK', price: 29, comparePrice: null, status: 'PUBLISHED', sales: 43, rating: 4.7, createdAt: '15 Ene 2026' },
    { id: '3', title: 'Mezcla y Mastering Pro', slug: 'mezcla-mastering-pro', type: 'COURSE', price: 67, comparePrice: 127, status: 'PUBLISHED', sales: 38, rating: 4.9, createdAt: '10 Ene 2026' },
    { id: '4', title: 'FL Studio Completo', slug: 'fl-studio-completo', type: 'COURSE', price: 79, comparePrice: 149, status: 'PUBLISHED', sales: 29, rating: 4.8, createdAt: '5 Ene 2026' },
    { id: '5', title: 'Lo-Fi Chill Beats Vol. 3', slug: 'lofi-chill-beats-vol3', type: 'MUSIC', price: 19, comparePrice: null, status: 'PUBLISHED', sales: 24, rating: 4.5, createdAt: '2 Ene 2026' },
    { id: '6', title: 'House Music Pack Vol. 1', slug: 'house-music-pack-vol1', type: 'SAMPLE_PACK', price: 39, comparePrice: null, status: 'DRAFT', sales: 0, rating: 0, createdAt: '1 Mar 2026' },
    { id: '7', title: 'R&B Guitar Loops', slug: 'rnb-guitar-loops', type: 'SAMPLE_PACK', price: 25, comparePrice: null, status: 'DRAFT', sales: 0, rating: 0, createdAt: '28 Feb 2026' },
    { id: '8', title: 'Piano Melodies Bundle', slug: 'piano-melodies-bundle', type: 'BUNDLE', price: 89, comparePrice: 180, status: 'ARCHIVED', sales: 12, rating: 4.6, createdAt: '15 Dic 2025' },
]

const typeColors: Record<string, { bg: string; color: string }> = {
    COURSE: { bg: 'rgba(255,107,53,0.1)', color: '#FF6B35' },
    MUSIC: { bg: 'rgba(78,205,196,0.1)', color: '#4ECDC4' },
    SAMPLE_PACK: { bg: 'rgba(162,155,254,0.1)', color: '#A29BFE' },
    BUNDLE: { bg: 'rgba(255,193,7,0.1)', color: '#FFC107' },
}

const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    PUBLISHED: { bg: 'rgba(40,167,69,0.1)', color: '#28A745', label: 'Publicado' },
    DRAFT: { bg: 'rgba(108,117,125,0.1)', color: '#6C757D', label: 'Borrador' },
    ARCHIVED: { bg: 'rgba(220,53,69,0.08)', color: '#DC3545', label: 'Archivado' },
}

const typeLabels: Record<string, string> = {
    COURSE: 'Curso', MUSIC: 'Música', SAMPLE_PACK: 'Samples', BUNDLE: 'Bundle',
}

export default function AdminProductsPage() {
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [page, setPage] = useState(1)
    const PER_PAGE = 6

    const filtered = MOCK_PRODUCTS.filter((p) => {
        if (typeFilter !== 'ALL' && p.type !== typeFilter) return false
        if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const totalPages = Math.ceil(filtered.length / PER_PAGE)

    const openMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
        setMenuAnchor(e.currentTarget)
        setSelectedId(id)
    }

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} gap={2}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Productos</Typography>
                    <Typography variant="body2" color="text.secondary">{MOCK_PRODUCTS.length} productos en total</Typography>
                </Box>
                <Button variant="contained" startIcon={<AddIcon />}
                    sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', borderRadius: 2.5 }}>
                    Nuevo producto
                </Button>
            </Stack>

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField placeholder="Buscar productos..." size="small" sx={{ flex: 1 }}
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }} />
                <FormControl size="small" sx={{ minWidth: 130 }}>
                    <InputLabel>Tipo</InputLabel>
                    <Select value={typeFilter} label="Tipo" onChange={(e) => setTypeFilter(e.target.value)} sx={{ borderRadius: 2.5 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="COURSE">Cursos</MenuItem>
                        <MenuItem value="MUSIC">Música</MenuItem>
                        <MenuItem value="SAMPLE_PACK">Samples</MenuItem>
                        <MenuItem value="BUNDLE">Bundles</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: 2.5 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="PUBLISHED">Publicados</MenuItem>
                        <MenuItem value="DRAFT">Borradores</MenuItem>
                        <MenuItem value="ARCHIVED">Archivados</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            {/* Table */}
            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: '#F8F9FA' }}>
                                {['Producto', 'Tipo', 'Precio', 'Ventas', 'Calificación', 'Estado', 'Creado', ''].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginated.map((p) => {
                                const tc = typeColors[p.type] || typeColors.COURSE
                                const sc = statusMap[p.status]
                                return (
                                    <TableRow key={p.id} hover sx={{ '&:last-child td': { border: 0 }, cursor: 'default' }}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Box sx={{ width: 38, height: 38, borderRadius: 1.5, background: tc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <Typography variant="caption" fontWeight={700} color={tc.color}>{p.title[0]}</Typography>
                                                </Box>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 200 }}>{p.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">/{p.slug}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={typeLabels[p.type] || p.type} size="small"
                                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: tc.bg, color: tc.color }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700}>${p.price}</Typography>
                                            {p.comparePrice && <Typography variant="caption" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>${p.comparePrice}</Typography>}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{p.sales}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {p.rating > 0 ? `⭐ ${p.rating}` : '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={sc.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: sc.bg, color: sc.color }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">{p.createdAt}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Ver en el sitio">
                                                    <IconButton size="small" sx={{ color: 'text.secondary' }}><VisibilityIcon fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton size="small" sx={{ color: '#FF6B35' }}><EditIcon fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Más opciones">
                                                    <IconButton size="small" onClick={(e) => openMenu(e, p.id)}><MoreVertIcon fontSize="small" /></IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>

                {filtered.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                        <Typography color="text.secondary">No se encontraron productos</Typography>
                    </Box>
                )}
            </Paper>

            {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
                        sx={{ '& .MuiPaginationItem-root.Mui-selected': { background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', color: '#fff' } }} />
                </Stack>
            )}

            {/* Context Menu */}
            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}
                PaperProps={{ sx: { borderRadius: 2.5, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}>
                <MenuItem onClick={() => setMenuAnchor(null)} sx={{ gap: 1 }}>
                    <EditIcon fontSize="small" /> Editar
                </MenuItem>
                <MenuItem onClick={() => setMenuAnchor(null)} sx={{ gap: 1 }}>
                    <VisibilityIcon fontSize="small" /> Vista previa
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { setMenuAnchor(null); setDeleteDialog(true) }} sx={{ gap: 1, color: '#DC3545' }}>
                    <DeleteIcon fontSize="small" /> Eliminar
                </MenuItem>
            </Menu>

            {/* Delete Confirm Dialog */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}
                PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle fontWeight={700}>¿Eliminar producto?</DialogTitle>
                <DialogContent>
                    <DialogContentText>Esta acción no se puede deshacer. El producto será eliminado permanentemente.</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                    <Button onClick={() => setDeleteDialog(false)} variant="outlined" sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>Cancelar</Button>
                    <Button onClick={() => setDeleteDialog(false)} variant="contained" color="error" sx={{ fontWeight: 700 }}>Eliminar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

function Divider() {
    return <Box sx={{ borderTop: '1px solid #E9ECEF', my: 0.5 }} />
}
