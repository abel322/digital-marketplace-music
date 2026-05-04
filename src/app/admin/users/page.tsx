'use client'

import { useState } from 'react'
import {
    Box, Typography, Stack, Button, TextField, InputAdornment,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Chip, IconButton, Avatar, Menu, MenuItem, Tooltip,
    Pagination, Select, FormControl, InputLabel,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import BlockIcon from '@mui/icons-material/Block'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import EmailIcon from '@mui/icons-material/Email'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const MOCK_USERS = [
    { id: '1', name: 'María García', email: 'maria@email.com', role: 'USER', status: 'ACTIVE', purchases: 5, spent: 312, joined: '10 Ene 2026' },
    { id: '2', name: 'Juan Pérez', email: 'juan@email.com', role: 'USER', status: 'ACTIVE', purchases: 3, spent: 145, joined: '15 Ene 2026' },
    { id: '3', name: 'Carlos Admin', email: 'carlos@admin.com', role: 'ADMIN', status: 'ACTIVE', purchases: 0, spent: 0, joined: '1 Ene 2026' },
    { id: '4', name: 'Ana Torres', email: 'ana@email.com', role: 'INSTRUCTOR', status: 'ACTIVE', purchases: 2, spent: 86, joined: '20 Ene 2026' },
    { id: '5', name: 'Sofía Ruiz', email: 'sofia@email.com', role: 'USER', status: 'SUSPENDED', purchases: 1, spent: 29, joined: '25 Ene 2026' },
    { id: '6', name: 'Luis Martínez', email: 'luis@email.com', role: 'USER', status: 'ACTIVE', purchases: 4, spent: 274, joined: '2 Feb 2026' },
    { id: '7', name: 'Elena Castro', email: 'elena@email.com', role: 'INSTRUCTOR', status: 'ACTIVE', purchases: 1, spent: 97, joined: '5 Feb 2026' },
    { id: '8', name: 'Diego Morales', email: 'diego@email.com', role: 'USER', status: 'ACTIVE', purchases: 2, spent: 118, joined: '10 Feb 2026' },
]

const roleMap: Record<string, { bg: string; color: string; label: string }> = {
    ADMIN: { bg: 'rgba(255,107,53,0.12)', color: '#FF6B35', label: 'Admin' },
    INSTRUCTOR: { bg: 'rgba(162,155,254,0.12)', color: '#A29BFE', label: 'Instructor' },
    USER: { bg: 'rgba(108,117,125,0.08)', color: '#6C757D', label: 'Usuario' },
}

const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    ACTIVE: { bg: 'rgba(40,167,69,0.1)', color: '#28A745', label: 'Activo' },
    SUSPENDED: { bg: 'rgba(220,53,69,0.08)', color: '#DC3545', label: 'Suspendido' },
    BANNED: { bg: 'rgba(0,0,0,0.08)', color: '#343A40', label: 'Baneado' },
}

function stringAvatar(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const AVATAR_COLORS = ['#FF6B35', '#4ECDC4', '#A29BFE', '#FFC107', '#28A745', '#DC3545']

export default function AdminUsersPage() {
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL')
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
    const [page, setPage] = useState(1)
    const PER_PAGE = 6

    const filtered = MOCK_USERS.filter((u) => {
        if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
        if (statusFilter !== 'ALL' && u.status !== statusFilter) return false
        if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
        return true
    })

    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    const totalPages = Math.ceil(filtered.length / PER_PAGE)

    return (
        <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} mb={3} gap={2}>
                <Box>
                    <Typography variant="h5" fontWeight={800}>Usuarios</Typography>
                    <Typography variant="body2" color="text.secondary">{MOCK_USERS.length} usuarios registrados</Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Button variant="outlined" startIcon={<EmailIcon />}
                        sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                        Enviar email
                    </Button>
                </Stack>
            </Stack>

            {/* Filters */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                <TextField placeholder="Buscar por nombre o email..." size="small" sx={{ flex: 1 }}
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" color="action" /></InputAdornment> }} />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Rol</InputLabel>
                    <Select value={roleFilter} label="Rol" onChange={(e) => setRoleFilter(e.target.value)} sx={{ borderRadius: 2.5 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="USER">Usuarios</MenuItem>
                        <MenuItem value="INSTRUCTOR">Instructores</MenuItem>
                        <MenuItem value="ADMIN">Admins</MenuItem>
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Estado</InputLabel>
                    <Select value={statusFilter} label="Estado" onChange={(e) => setStatusFilter(e.target.value)} sx={{ borderRadius: 2.5 }}>
                        <MenuItem value="ALL">Todos</MenuItem>
                        <MenuItem value="ACTIVE">Activos</MenuItem>
                        <MenuItem value="SUSPENDED">Suspendidos</MenuItem>
                    </Select>
                </FormControl>
            </Stack>

            <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E9ECEF', overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: '#F8F9FA' }}>
                                {['Usuario', 'Rol', 'Compras', 'Gastado', 'Estado', 'Registrado', ''].map((h) => (
                                    <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary', py: 1.5 }}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginated.map((u, i) => {
                                const rc = roleMap[u.role]
                                const sc = statusMap[u.status]
                                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length]
                                return (
                                    <TableRow key={u.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                        <TableCell>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ width: 36, height: 36, background: avatarColor, fontSize: '0.8rem', fontWeight: 700 }}>
                                                    {stringAvatar(u.name)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600}>{u.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={rc.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: rc.bg, color: rc.color }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>{u.purchases}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={700} color="#FF6B35">${u.spent}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={sc.label} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, background: sc.bg, color: sc.color }} />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">{u.joined}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                                <Tooltip title="Hacer admin">
                                                    <IconButton size="small" sx={{ color: '#FF6B35' }}><AdminPanelSettingsIcon fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Suspender">
                                                    <IconButton size="small" sx={{ color: '#DC3545' }}><BlockIcon fontSize="small" /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Más opciones">
                                                    <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}><MoreVertIcon fontSize="small" /></IconButton>
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
                        <Typography color="text.secondary">No se encontraron usuarios</Typography>
                    </Box>
                )}
            </Paper>

            {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" mt={3}>
                    <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
                        sx={{ '& .MuiPaginationItem-root.Mui-selected': { background: 'linear-gradient(135deg, #FF6B35, #FF8C61)', color: '#fff' } }} />
                </Stack>
            )}

            <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}
                PaperProps={{ sx: { borderRadius: 2.5 } }}>
                <MenuItem onClick={() => setMenuAnchor(null)}>Ver perfil</MenuItem>
                <MenuItem onClick={() => setMenuAnchor(null)}>Ver compras</MenuItem>
                <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: '#DC3545' }}>Eliminar cuenta</MenuItem>
            </Menu>
        </Box>
    )
}
