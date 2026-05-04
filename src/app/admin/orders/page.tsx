'use client'

import { useState } from 'react'
import {
    Box, Typography, Stack, Button, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Avatar, Tooltip, Pagination,
    Select, FormControl, InputLabel, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefundIcon from '@mui/icons-material/Replay'
import ReceiptIcon from '@mui/icons-material/Receipt'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

const MOCK_ORDERS = [
    { id: 'ORD-A1B2C3', user: 'María García', email: 'maria@email.com', products: ['Producción Musical Completa'], amount: 97, status: 'PAID', method: 'Tarjeta', date: '03 Mar 2026', coupon: null },
    { id: 'ORD-D4E5F6', user: 'Juan Pérez', email: 'juan@email.com', products: ['Pack Trap Essentials 2024'], amount: 29, status: 'PAID', method: 'PayPal', date: '03 Mar 2026', coupon: 'MUSICA20' },
    { id: 'ORD-G7H8I9', user: 'Ana Torres', email: 'ana@email.com', products: ['FL Studio Completo', 'Mezcla y Mastering Pro'], amount: 146, status: 'PENDING', method: 'Tarjeta', date: '02 Mar 2026', coupon: null },
    { id: 'ORD-J1K2L3', user: 'Carlos López', email: 'carlos@email.com', products: ['FL Studio Completo'], amount: 79, status: 'PAID', method: 'Tarjeta', date: '02 Mar 2026', coupon: 'BIENVENIDO10' },
    { id: 'ORD-M4N5O6', user: 'Sofía Ruiz', email: 'sofia@email.com', products: ['Lo-Fi Chill Beats Vol. 3'], amount: 19, status: 'REFUNDED', method: 'Tarjeta', date: '01 Mar 2026', coupon: null },
    { id: 'ORD-P7Q8R9', user: 'Luis Martínez', email: 'luis@email.com', products: ['Piano Melodies Bundle'], amount: 89, status: 'PAID', method: 'PayPal', date: '28 Feb 2026', coupon: 'OFF15' },
    { id: 'ORD-S1T2U3', user: 'Elena Castro', email: 'elena@email.com', products: ['R&B Guitar Loops'], amount: 25, status: 'FAILED', method: 'Tarjeta', date: '27 Feb 2026', coupon: null },
    { id: 'ORD-V4W5X6', user: 'Diego Morales', email: 'diego@email.com', products: ['Producción Musical Completa', 'Pack Trap Essentials 2024'], amount: 118, status: 'PAID', method: 'Tarjeta', date: '25 Feb 2026', coupon: 'VERANO30' },
]

const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    PAID: { bg: 'rgba(40,167,69,0.1)', color: '#28A745', label: 'Pagado' },
    PENDING: { bg: 'rgba(255,193,7,0.1)', color: '#FFC107', label: 'Pendiente' },
    FAILED: { bg: 'rgba(220,53,69,0.1)', color: '#DC3545', label: 'Fallido' },
    REFUNDED: { bg: 'rgba(108,117,125,0.08)', color: '#6C757D', label: 'Reembolsado' },
}

const AVATAR_COLORS = ['#FF6B35', '#4ECDC4', '#A29BFE', '#FFC107', '#28A745', '#DC3545']

export default function AdminOrdersPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [page, setPage] = useState(1)
    const [detailOrder, setDetailOrder] = useState<typeof MOCK_ORDERS[0] | null>(null)
    const PER_PAGE = 6

    const filtered = MOCK_ORDERS.filter((o) => {
        if (statusFilter !== 'ALL' && o.status !== statusFilter) return false
        if (search && !o.user.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const totalPages = Math.ceil(filtered.length / PER_PAGE)

    const totalRevenue = MOCK_ORDERS.filter((o) => o.status === 'PAID').reduce((s, o) => s + o.amount, 0)

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} gap={2}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Órdenes</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {MOCK_ORDERS.length} órdenes · Ingresos confirmados: <strong style={{ color: '#28A745' }}>${totalRevenue}</strong>
                    </Typography>
                </Box>
                <Button variant="outlined" startIcon={<FileDownloadIcon />}
                    sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                    Exportar CSV
                </Button>
            </Stack>

            {/* Status Summary Pills */}
            <Stack direction="row" spacing={1.5} mb={3} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(statusMap).map(([key, val]) => {
                    const count = MOCK_ORDERS.filter((o) => o.status === key).length
                    return (
                        <Chip
                            key={key}
                            label={`${val.label}: ${count}`}
                            onClick={() => setStatusFilter(statusFilter === key ? 'ALL' : key)}
                            sx={{
                                fontWeight: 700, cursor: 'pointer',
                                background: statusFilter === key ? val.bg : '#F8F9FA',
                                color: statusFilter === key ? val.color : 'text.secondary',
                                border: `1px solid ${statusFilter === key ? val.color + '40' : '#E9ECEF'}`,
                            }}
                        />
                    )
                })}
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField placeholder="Buscar por usuario o nº de orden..." size="small" sx={{ flex: 1 }}
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }} />
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: 2.5 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        {Object.entries(statusMap).map(([key, val]) => (
                            <MenuItem key={key} value={key}>{val.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: '#F8F9FA' }}>
                                {['Orden', 'Cliente', 'Productos', 'Cupón', 'Método', 'Importe', 'Estado', 'Fecha', ''].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginated.map((o, i) => {
                                const sc = statusMap[o.status]
                                return (
                                    <TableRow key={o.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700} color="#FF6B35">{o.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Avatar sx={{ width: 30, height: 30, background: AVATAR_COLORS[i % AVATAR_COLORS.length], fontSize: '0.75rem', fontWeight: 700 }}>
                                                    {o.user[0]}
                                                </Avatar>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: 110 }}>{o.user}</Typography>
                                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 110 }}>{o.email}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title={o.products.join(', ')}>
                                                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 120, display: 'block' }}>
                                                    {o.products.length === 1 ? o.products[0].slice(0, 20) + (o.products[0].length > 20 ? '…' : '') : `${o.products.length} productos`}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {o.coupon
                                                ? <Chip label={o.coupon} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: 'rgba(78,205,196,0.1)', color: '#3BB5AD' }} />
                                                : <Typography variant="caption" color="text.disabled">—</Typography>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">{o.method}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={800} color={o.status === 'REFUNDED' ? '#6C757D' : o.status === 'FAILED' ? '#DC3545' : '#FF6B35'}>
                                                ${o.amount}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={sc.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: sc.bg, color: sc.color }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">{o.date}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.25}>
                                                <Tooltip title="Ver detalle">
                                                    <IconButton size="small" onClick={() => setDetailOrder(o)} sx={{ color: '#FF6B35' }}>
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {o.status === 'PAID' && (
                                                    <Tooltip title="Reembolsar">
                                                        <IconButton size="small" sx={{ color: '#6C757D' }}>
                                                            <RefundIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
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
                        <Typography color="text.secondary">No se encontraron órdenes</Typography>
                    </Box>
                )}
            </Paper>

            {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
                        sx={{ '& .MuiPaginationItem-root.Mui-selected': { background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', color: '#fff' } }} />
                </Stack>
            )}

            {/* Order Detail Dialog */}
            <Dialog open={!!detailOrder} onClose={() => setDetailOrder(null)} maxWidth="xs" fullWidth
                PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <ReceiptIcon sx={{ color: '#FF6B35' }} />
                        <Box>
                            <Typography fontWeight={700}>{detailOrder?.id}</Typography>
                            <Typography variant="caption" color="text.secondary">{detailOrder?.date}</Typography>
                        </Box>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Cliente</Typography>
                            <Typography variant="body2" fontWeight={600}>{detailOrder?.user}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Email</Typography>
                            <Typography variant="body2" fontWeight={600}>{detailOrder?.email}</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Método</Typography>
                            <Typography variant="body2" fontWeight={600}>{detailOrder?.method}</Typography>
                        </Stack>
                        {detailOrder?.coupon && (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2" color="text.secondary">Cupón</Typography>
                                <Chip label={detailOrder.coupon} size="small" sx={{ height: 20, fontWeight: 700, background: 'rgba(78,205,196,0.1)', color: '#3BB5AD' }} />
                            </Stack>
                        )}
                        <Divider />
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>Productos:</Typography>
                        {detailOrder?.products.map((p) => (
                            <Typography key={p} variant="body2" sx={{ pl: 1 }}>• {p}</Typography>
                        ))}
                        <Divider />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
                            <Typography variant="subtitle1" fontWeight={800} color="#FF6B35">${detailOrder?.amount}</Typography>
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setDetailOrder(null)} variant="outlined" sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 } }}>Cerrar</Button>
                    <Button variant="contained" startIcon={<ReceiptIcon />}
                        sx={{ fontWeight: 700, background: 'linear-gradient(135deg, #FF6B35, #FF8C61)' }}>
                        Ver recibo
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
