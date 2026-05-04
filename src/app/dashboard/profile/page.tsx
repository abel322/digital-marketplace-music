'use client'

import { useState } from 'react'
import {
    Box, Typography, Grid, Stack, Button, TextField,
    Avatar, Divider, Card, CardContent, Chip, Alert,
    InputAdornment, IconButton, CircularProgress,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import YouTubeIcon from '@mui/icons-material/YouTube'
import LanguageIcon from '@mui/icons-material/Language'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

export default function ProfilePage() {
    const { data: session } = useSession()
    const user = session?.user as any

    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showPw, setShowPw] = useState(false)

    const [form, setForm] = useState({
        name: user?.name || 'Mi Nombre',
        email: user?.email || 'usuario@email.com',
        bio: 'Productor musical y amante de la música electrónica. Llevo 5 años aprendiendo producción y encontré esta plataforma increíble.',
        youtube: '',
        website: '',
        currentPw: '',
        newPw: '',
        confirmPw: '',
    })

    const handleSave = async () => {
        setSaving(true)
        await new Promise((r) => setTimeout(r, 1200))
        setSaving(false)
        setSaved(true)
        setEditing(false)
        setTimeout(() => setSaved(false), 3000)
    }

    const field = (key: keyof typeof form) => ({
        value: form[key],
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [key]: e.target.value })),
        disabled: !editing && !['currentPw', 'newPw', 'confirmPw'].includes(key),
    })

    const initials = form.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

    return (
        <Box>
            <Typography variant="h4" fontWeight={800} mb={0.5}>Mi Perfil</Typography>
            <Typography color="text.secondary" mb={4}>Gestiona tu información personal</Typography>

            {saved && <Alert severity="success" sx={{ mb: 3, borderRadius: 2.5 }}>✅ Perfil actualizado correctamente</Alert>}

            <Grid container spacing={3} alignItems="flex-start">
                {/* Left: Avatar + Quick Info */}
                <Grid item xs={12} md={4}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF', textAlign: 'center' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                <Avatar
                                    src={user?.image || ''}
                                    sx={{
                                        width: 100, height: 100,
                                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                        fontSize: '2rem', fontWeight: 700,
                                        mx: 'auto',
                                    }}
                                >
                                    {initials}
                                </Avatar>
                                <IconButton
                                    size="small"
                                    sx={{
                                        position: 'absolute', bottom: 0, right: 0,
                                        background: '#FFFFFF', border: '2px solid #E9ECEF',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        '&:hover': { background: '#FF6B35', color: '#fff' },
                                    }}
                                >
                                    <CameraAltIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>

                            <Typography variant="h6" fontWeight={700} mb={0.25}>{form.name}</Typography>
                            <Typography variant="body2" color="text.secondary" mb={1.5}>{form.email}</Typography>

                            {user?.role && (
                                <Chip
                                    label={user.role === 'ADMIN' ? 'Administrador' : user.role === 'INSTRUCTOR' ? 'Instructor' : 'Estudiante'}
                                    sx={{
                                        mb: 2, fontWeight: 700,
                                        background: user.role === 'ADMIN' ? 'rgba(255,107,53,0.1)' : 'rgba(78,205,196,0.1)',
                                        color: user.role === 'ADMIN' ? '#FF6B35' : '#4ECDC4',
                                    }}
                                />
                            )}

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={1} textAlign="left">
                                {[
                                    { label: 'Miembro desde', value: 'Enero 2026' },
                                    { label: 'Compras', value: '4 productos' },
                                    { label: 'Horas estudiadas', value: '24h' },
                                ].map(({ label, value }) => (
                                    <Stack key={label} direction="row" justifyContent="space-between">
                                        <Typography variant="caption" color="text.secondary">{label}</Typography>
                                        <Typography variant="caption" fontWeight={600}>{value}</Typography>
                                    </Stack>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Edit Form */}
                <Grid item xs={12} md={8}>
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF', mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight={700}>Información personal</Typography>
                                <Button
                                    variant={editing ? 'outlined' : 'contained'}
                                    startIcon={editing ? <SaveIcon /> : <EditIcon />}
                                    onClick={editing ? handleSave : () => setEditing(true)}
                                    disabled={saving}
                                    sx={{
                                        fontWeight: 700, borderRadius: 2.5,
                                        ...(editing
                                            ? { borderWidth: 2, '&:hover': { borderWidth: 2 } }
                                            : { background: 'linear-gradient(135deg, #FF6B35, #FF8C61)' }),
                                    }}
                                >
                                    {saving ? <CircularProgress size={18} color="inherit" /> : editing ? 'Guardar' : 'Editar'}
                                </Button>
                            </Stack>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Nombre completo" {...field('name')}
                                        InputProps={{ startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Correo electrónico" type="email" {...field('email')}
                                        InputProps={{ startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField fullWidth multiline rows={3} label="Biografía" placeholder="Cuéntanos sobre ti..." {...field('bio')} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Canal de YouTube" placeholder="@tucanal" {...field('youtube')}
                                        InputProps={{ startAdornment: <YouTubeIcon sx={{ color: '#FF0000', mr: 1, fontSize: 20 }} /> }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Sitio web" placeholder="https://..." {...field('website')}
                                        InputProps={{ startAdornment: <LanguageIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Password Section */}
                    <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
                                <LockIcon sx={{ color: '#FF6B35' }} />
                                <Typography variant="h6" fontWeight={700}>Cambiar contraseña</Typography>
                            </Stack>
                            <Grid container spacing={2.5}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Contraseña actual" type={showPw ? 'text' : 'password'} {...field('currentPw')}
                                        disabled={false}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setShowPw(!showPw)}>
                                                    {showPw ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>,
                                        }} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Nueva contraseña" type="password" {...field('newPw')} disabled={false} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField fullWidth label="Confirmar nueva contraseña" type="password" {...field('confirmPw')} disabled={false} />
                                </Grid>
                            </Grid>
                            <Button variant="outlined" sx={{ mt: 2.5, fontWeight: 700, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                                Actualizar contraseña
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}
