'use client'

import { useState } from 'react'
import {
    Box,
    Typography,
    Stack,
    Divider,
    TextField,
    Button,
    CircularProgress,
    Chip,
    IconButton,
} from '@mui/material'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'

interface CartSummaryProps {
    onCheckout?: () => void
    showCheckoutButton?: boolean
}

export default function CartSummary({ onCheckout, showCheckoutButton = true }: CartSummaryProps) {
    const { subtotal, discount, total, coupon, applyCoupon, removeCoupon } = useCart()
    const [couponInput, setCouponInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: couponInput.trim().toUpperCase() }),
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Cupón no válido')
            } else {
                applyCoupon(data)
                setCouponInput('')
                setError('')
            }
        } catch {
            setError('Error al validar el cupón')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box>
            {/* Coupon Input */}
            {coupon ? (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2.5,
                        p: 1.5,
                        borderRadius: 2.5,
                        background: 'rgba(78,205,196,0.08)',
                        border: '1px solid rgba(78,205,196,0.35)',
                    }}
                >
                    <CheckCircleIcon sx={{ color: '#4ECDC4', fontSize: 20 }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={700} color="#3BB5AD">
                            {coupon.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {coupon.type === 'PERCENTAGE' ? `${coupon.discount}% de descuento` : `$${coupon.discount} de descuento`}
                        </Typography>
                    </Box>
                    <IconButton size="small" onClick={removeCoupon} sx={{ p: 0.4 }}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            ) : (
                <Box sx={{ mb: 2.5 }}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            size="small"
                            placeholder="Código de descuento"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            error={!!error}
                            helperText={error}
                            sx={{ flex: 1 }}
                            InputProps={{
                                startAdornment: (
                                    <LocalOfferIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                                ),
                            }}
                        />
                        <Button
                            variant="outlined"
                            onClick={handleApplyCoupon}
                            disabled={!couponInput.trim() || loading}
                            sx={{
                                minWidth: 88,
                                fontWeight: 700,
                                borderWidth: 2,
                                '&:hover': { borderWidth: 2 },
                            }}
                        >
                            {loading ? <CircularProgress size={16} /> : 'Aplicar'}
                        </Button>
                    </Stack>
                </Box>
            )}

            <Divider sx={{ mb: 2 }} />

            {/* Totals */}
            <Stack spacing={1.25} mb={2.5}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body2" fontWeight={600}>{formatPrice(subtotal)}</Typography>
                </Stack>

                {discount > 0 && (
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography variant="body2" color="#3BB5AD">Descuento</Typography>
                            {coupon && (
                                <Chip
                                    label={coupon.code}
                                    size="small"
                                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, background: 'rgba(78,205,196,0.12)', color: '#3BB5AD' }}
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" fontWeight={600} color="#3BB5AD">
                            -{formatPrice(discount)}
                        </Typography>
                    </Stack>
                )}

                <Divider />

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                        {formatPrice(total)}
                    </Typography>
                </Stack>
            </Stack>

            {/* Checkout Button */}
            {showCheckoutButton && (
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={onCheckout}
                    sx={{
                        py: 1.6,
                        fontWeight: 700,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C61 100%)',
                        boxShadow: '0 4px 20px rgba(255,107,53,0.35)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #E65A2E 0%, #FF6B35 100%)',
                            boxShadow: '0 8px 28px rgba(255,107,53,0.5)',
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                    }}
                >
                    Proceder al pago →
                </Button>
            )}

            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
                🔒 Pago seguro con SSL · Garantía de satisfacción
            </Typography>
        </Box>
    )
}
