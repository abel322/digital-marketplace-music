'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Box, Container, Typography, Grid, Stack,
    Stepper, Step, StepLabel, Button, TextField,
    Divider, Chip, CircularProgress, Alert,
    Paper, Radio, RadioGroup, FormControlLabel, FormControl,
    InputAdornment, Breadcrumbs,
} from '@mui/material'
import Link from 'next/link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import LockIcon from '@mui/icons-material/Lock'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

const STEPS = ['Datos personales', 'Pago', 'Confirmación']

// ─── Step 1: Billing Info ─────────────────────────────────────────────────────
function BillingStep({ data, onChange, onNext }: {
    data: any
    onChange: (key: string, val: string) => void
    onNext: () => void
}) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const e: Record<string, string> = {}
        if (!data.firstName) e.firstName = 'Requerido'
        if (!data.lastName) e.lastName = 'Requerido'
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) e.email = 'Email inválido'
        if (!data.phone) e.phone = 'Requerido'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={700} mb={3}>
                Información de contacto
            </Typography>
            <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth label="Nombre" placeholder="Juan"
                        value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)}
                        error={!!errors.firstName} helperText={errors.firstName}
                        InputProps={{ startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth label="Apellido" placeholder="Pérez"
                        value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)}
                        error={!!errors.lastName} helperText={errors.lastName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth label="Correo electrónico" placeholder="juan@ejemplo.com" type="email"
                        value={data.email} onChange={(e) => onChange('email', e.target.value)}
                        error={!!errors.email} helperText={errors.email}
                        InputProps={{ startAdornment: <EmailIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth label="Teléfono" placeholder="+1 555 000 0000"
                        value={data.phone} onChange={(e) => onChange('phone', e.target.value)}
                        error={!!errors.phone} helperText={errors.phone}
                        InputProps={{ startAdornment: <PhoneIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth label="País" placeholder="México"
                        value={data.country} onChange={(e) => onChange('country', e.target.value)}
                        InputProps={{ startAdornment: <LocationOnIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} /> }}
                    />
                </Grid>
            </Grid>

            <Box mt={4}>
                <Button
                    variant="contained" size="large" fullWidth
                    onClick={() => validate() && onNext()}
                    sx={{
                        py: 1.6, fontWeight: 700, fontSize: '1rem',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                        boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(255,107,53,0.45)' },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Continuar al pago →
                </Button>
            </Box>
        </Box>
    )
}

// ─── Step 2: Payment ──────────────────────────────────────────────────────────
function PaymentStep({ billing, onNext, onBack, loading, error }: {
    billing: any
    onNext: (method: string) => void
    onBack: () => void
    loading: boolean
    error: string
}) {
    const [method, setMethod] = useState('card')
    const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' })

    const formatCard = (val: string) =>
        val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

    const formatExpiry = (val: string) => {
        const clean = val.replace(/\D/g, '').slice(0, 4)
        return clean.length > 2 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
    }

    return (
        <Box>
            <Typography variant="h6" fontWeight={700} mb={3}>Método de pago</Typography>

            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <RadioGroup value={method} onChange={(e) => setMethod(e.target.value)}>
                    {[
                        { value: 'card', label: 'Tarjeta de crédito / débito', icon: '💳' },
                        { value: 'paypal', label: 'PayPal', icon: '🔵' },
                    ].map((opt) => (
                        <Paper
                            key={opt.value}
                            variant="outlined"
                            onClick={() => setMethod(opt.value)}
                            sx={{
                                p: 2, mb: 1.5, cursor: 'pointer', borderRadius: 3, borderWidth: 2,
                                borderColor: method === opt.value ? 'primary.main' : 'divider',
                                background: method === opt.value ? 'rgba(255,107,53,0.04)' : '#FFFFFF',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            <FormControlLabel
                                value={opt.value}
                                control={<Radio sx={{ '&.Mui-checked': { color: 'primary.main' } }} />}
                                label={
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography sx={{ fontSize: '1.2rem' }}>{opt.icon}</Typography>
                                        <Typography fontWeight={600}>{opt.label}</Typography>
                                    </Stack>
                                }
                                sx={{ m: 0, width: '100%' }}
                            />
                        </Paper>
                    ))}
                </RadioGroup>
            </FormControl>

            {method === 'card' && (
                <Box
                    sx={{
                        p: 3, borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255,107,53,0.03), rgba(78,205,196,0.03))',
                        border: '1px solid #E9ECEF',
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Nombre en la tarjeta" placeholder="Juan Pérez"
                                value={cardData.name}
                                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                                InputProps={{ startAdornment: <PersonIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} /> }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Número de tarjeta" placeholder="1234 5678 9012 3456"
                                value={cardData.number}
                                onChange={(e) => setCardData({ ...cardData, number: formatCard(e.target.value) })}
                                InputProps={{
                                    startAdornment: <CreditCardIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />,
                                    endAdornment: (
                                        <Stack direction="row" spacing={0.5}>
                                            {['💳', '🔵', '🟠'].map((i, k) => (
                                                <Typography key={k} sx={{ fontSize: '1rem' }}>{i}</Typography>
                                            ))}
                                        </Stack>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="Vencimiento" placeholder="MM/AA"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: formatExpiry(e.target.value) })}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth label="CVC" placeholder="123"
                                value={cardData.cvc}
                                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                InputProps={{ endAdornment: <LockIcon sx={{ color: 'text.secondary', fontSize: 18 }} /> }}
                            />
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} mt={2} alignItems="center">
                        <LockIcon sx={{ color: '#28A745', fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                            Tus datos están protegidos con encriptación SSL de 256 bits
                        </Typography>
                    </Stack>
                </Box>
            )}

            {method === 'paypal' && (
                <Box sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #E9ECEF', background: '#f7f9ff' }}>
                    <Typography variant="body2" color="text.secondary">
                        Serás redirigido a PayPal para completar el pago de forma segura.
                    </Typography>
                </Box>
            )}

            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
                <Button variant="outlined" onClick={onBack} sx={{ borderWidth: 2, '&:hover': { borderWidth: 2 }, fontWeight: 600 }}>
                    ← Volver
                </Button>
                <Button
                    variant="contained" size="large" fullWidth
                    onClick={() => onNext(method)}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockIcon />}
                    sx={{
                        py: 1.6, fontWeight: 700, fontSize: '1rem',
                        background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                        boxShadow: '0 4px 16px rgba(255,107,53,0.35)',
                        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(255,107,53,0.45)' },
                        transition: 'all 0.3s ease',
                    }}
                >
                    {loading ? 'Procesando...' : 'Confirmar pago'}
                </Button>
            </Stack>
        </Box>
    )
}

// ─── Order Summary Sidebar ────────────────────────────────────────────────────
function OrderSidebar({ items, subtotal, discount, total, coupon }: any) {
    return (
        <Box sx={{ p: 3, borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2.5}>
                Resumen del pedido
            </Typography>

            <Stack spacing={1.5} mb={2.5}>
                {items.map((item: any) => {
                    const p = item.product as any
                    const color = p.type === 'COURSE' ? '#FF6B35' : p.type === 'MUSIC' ? '#4ECDC4' : '#A29BFE'
                    return (
                        <Stack key={p.id} direction="row" alignItems="center" spacing={1.5}>
                            <Box
                                sx={{
                                    width: 44, height: 44, borderRadius: 1.5, flexShrink: 0,
                                    background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}
                            >
                                <Typography variant="caption" fontWeight={700} color={color}>
                                    {p.title[0]}
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography variant="body2" fontWeight={600} noWrap>{p.title}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    x{item.quantity}
                                </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight={700} color={color}>
                                {formatPrice(p.price * item.quantity)}
                            </Typography>
                        </Stack>
                    )
                })}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(subtotal)}</Typography>
                </Stack>
                {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2" color="#3BB5AD">Descuento</Typography>
                            {coupon && (
                                <Chip label={coupon.code} size="small" sx={{ height: 16, fontSize: '0.6rem', fontWeight: 700, background: 'rgba(78,205,196,0.12)', color: '#3BB5AD' }} />
                            )}
                        </Stack>
                        <Typography variant="body2" fontWeight={600} color="#3BB5AD">-{formatPrice(discount)}</Typography>
                    </Stack>
                )}
                <Divider />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">{formatPrice(total)}</Typography>
                </Stack>
            </Stack>

            <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #f0f0f0' }}>
                {[
                    { icon: '🔒', text: 'Pago seguro SSL' },
                    { icon: '↩️', text: 'Garantía 30 días' },
                    { icon: '⚡', text: 'Acceso inmediato' },
                ].map(({ icon, text }) => (
                    <Stack key={text} direction="row" spacing={1} alignItems="center" mb={0.75}>
                        <Typography sx={{ fontSize: '0.9rem' }}>{icon}</Typography>
                        <Typography variant="caption" color="text.secondary">{text}</Typography>
                    </Stack>
                ))}
            </Box>
        </Box>
    )
}

// ─── Main Checkout Page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
    const router = useRouter()
    const { items, subtotal, discount, total, coupon, clearCart } = useCart()
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [orderId, setOrderId] = useState('')

    const [billing, setBilling] = useState({
        firstName: '', lastName: '', email: '', phone: '', country: '',
    })

    useEffect(() => {
        if (items.length === 0 && activeStep === 0) {
            router.push('/cart')
        }
    }, [items, activeStep, router])

    const handleBillingChange = (key: string, val: string) => {
        setBilling((prev) => ({ ...prev, [key]: val }))
    }

    const handlePayment = async (method: string) => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map((i) => ({
                        id: (i.product as any).id,
                        title: (i.product as any).title,
                        price: (i.product as any).price,
                        quantity: i.quantity,
                    })),
                    couponCode: coupon?.code || null,
                    customerEmail: billing.email,
                    metadata: { method, customerName: `${billing.firstName} ${billing.lastName}` },
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al procesar el pago')
                return
            }

            // In production: use stripe.confirmPayment() with clientSecret
            // For now we simulate success
            const mockOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`
            setOrderId(mockOrderId)
            clearCart()
            setActiveStep(2)
        } catch {
            setError('Error de conexión. Por favor intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ py: { xs: 3, md: 5 }, minHeight: '80vh' }}>
            <Container maxWidth="lg">
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3, fontSize: '0.875rem' }}>
                    <Link href="/" style={{ color: '#6C757D', textDecoration: 'none' }}>Inicio</Link>
                    <Link href="/cart" style={{ color: '#6C757D', textDecoration: 'none' }}>Carrito</Link>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>Checkout</Typography>
                </Breadcrumbs>

                {/* Stepper */}
                <Stepper
                    activeStep={activeStep}
                    sx={{
                        mb: 5,
                        '& .MuiStepLabel-label': { fontWeight: 600 },
                        '& .MuiStepIcon-root.Mui-active': { color: '#FF6B35' },
                        '& .MuiStepIcon-root.Mui-completed': { color: '#28A745' },
                    }}
                >
                    {STEPS.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* Confirmation Step — full width */}
                {activeStep === 2 ? (
                    <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center', py: 4 }}>
                        <Box sx={{
                            width: 96, height: 96, borderRadius: '50%', mx: 'auto', mb: 3,
                            background: 'linear-gradient(135deg, #28A745, #2ECC71)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(40,167,69,0.35)',
                            animation: 'float 3s ease-in-out infinite',
                        }}>
                            <CheckCircleIcon sx={{ fontSize: 52, color: '#FFFFFF' }} />
                        </Box>

                        <Typography variant="h4" fontWeight={800} mb={1.5}>¡Pago exitoso!</Typography>
                        <Typography color="text.secondary" mb={1}>
                            Tu orden ha sido procesada correctamente.
                        </Typography>
                        <Chip
                            label={`Orden: ${orderId}`}
                            sx={{ mb: 3, fontWeight: 700, background: 'rgba(40,167,69,0.1)', color: '#1A5928', fontSize: '0.9rem', height: 32 }}
                        />

                        <Typography variant="body2" color="text.secondary" mb={4}>
                            Recibirás un correo en <strong>{billing.email || 'tu email'}</strong> con el acceso a tus productos.
                            El acceso inmediato ya está disponible en tu área de usuario.
                        </Typography>

                        <Stack spacing={2}>
                            <Button
                                variant="contained" size="large" fullWidth
                                component={Link} href="/dashboard"
                                sx={{
                                    py: 1.5, fontWeight: 700,
                                    background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                    boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
                                }}
                            >
                                Ir a mis compras
                            </Button>
                            <Button variant="outlined" fullWidth component={Link} href="/products"
                                sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                                Seguir comprando
                            </Button>
                        </Stack>
                    </Box>
                ) : (
                    <Grid container spacing={4} alignItems="flex-start">
                        {/* Form */}
                        <Grid item xs={12} md={7}>
                            <Box sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 4, border: '1px solid #E9ECEF', background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                {activeStep === 0 && (
                                    <BillingStep data={billing} onChange={handleBillingChange} onNext={() => setActiveStep(1)} />
                                )}
                                {activeStep === 1 && (
                                    <PaymentStep
                                        billing={billing}
                                        onNext={handlePayment}
                                        onBack={() => setActiveStep(0)}
                                        loading={loading}
                                        error={error}
                                    />
                                )}
                            </Box>
                        </Grid>

                        {/* Order Summary Sidebar — sticky */}
                        <Grid item xs={12} md={5}>
                            <Box sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
                                <OrderSidebar items={items} subtotal={subtotal} discount={discount} total={total} coupon={coupon} />
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box>
    )
}
