'use client'

import { useRouter } from 'next/navigation'
import {
    Box,
    Container,
    Typography,
    Grid,
    Stack,
    Button,
    Breadcrumbs,
} from '@mui/material'
import Link from 'next/link'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCart } from '@/context/CartContext'
import CartItemCard from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import ProductCard from '@/components/product/ProductCard'

// Mock related products (replace with real API later)
const SUGGESTED = [
    { id: '4', title: 'Mezcla y Mastering Pro', slug: 'mezcla-mastering-pro', price: 67, originalPrice: 127, type: 'COURSE', rating: 4.9, reviewCount: 312 },
    { id: '5', title: 'House Music Pack Vol. 1', slug: 'house-music-pack-vol1', price: 39, type: 'SAMPLE_PACK', rating: 4.6, reviewCount: 98 },
    { id: '6', title: 'Piano Melodies Pack', slug: 'piano-melodies-pack', price: 22, type: 'MUSIC', rating: 4.5, reviewCount: 87 },
]

export default function CartPage() {
    const router = useRouter()
    const { items, itemCount, clearCart } = useCart()

    const handleCheckout = () => router.push('/checkout')

    if (items.length === 0) {
        return (
            <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Container maxWidth="sm">
                    <Box textAlign="center">
                        <ShoppingCartOutlinedIcon sx={{ fontSize: 100, color: 'text.secondary', opacity: 0.15, mb: 3 }} />
                        <Typography variant="h4" fontWeight={800} mb={1.5}>
                            Tu carrito está vacío
                        </Typography>
                        <Typography color="text.secondary" mb={4}>
                            Explora nuestros productos y encuentra algo que te encante.
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            href="/products"
                            sx={{
                                background: 'linear-gradient(135deg, #FF6B35, #FF8C61)',
                                fontWeight: 700,
                                px: 4,
                            }}
                        >
                            Ver productos
                        </Button>
                    </Box>
                </Container>
            </Box>
        )
    }

    return (
        <Box sx={{ py: { xs: 3, md: 6 }, minHeight: '80vh' }}>
            <Container maxWidth="xl">
                {/* Breadcrumbs */}
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3, fontSize: '0.875rem' }}>
                    <Link href="/" style={{ color: '#6C757D', textDecoration: 'none' }}>Inicio</Link>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>Carrito</Typography>
                </Breadcrumbs>

                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={800} mb={0.5}>
                            Mi carrito
                        </Typography>
                        <Typography color="text.secondary">
                            {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en tu carrito
                        </Typography>
                    </Box>
                    <Button
                        variant="text"
                        startIcon={<ArrowBackIcon />}
                        component={Link}
                        href="/products"
                        sx={{ fontWeight: 600 }}
                    >
                        Seguir comprando
                    </Button>
                </Stack>

                <Grid container spacing={4} alignItems="flex-start">
                    {/* ─── Cart Items ─── */}
                    <Grid item xs={12} md={7} lg={8}>
                        <Stack spacing={2}>
                            {items.map((item) => {
                                const p = item.product as any
                                return (
                                    <CartItemCard
                                        key={p.id}
                                        productId={p.id}
                                        title={p.title}
                                        price={p.price}
                                        comparePrice={p.comparePrice}
                                        type={p.type}
                                        image={p.image || p.images?.[0] || null}
                                        quantity={item.quantity}
                                    />
                                )
                            })}
                        </Stack>

                        {/* Clear Cart */}
                        <Box mt={2} textAlign="right">
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={clearCart}
                                sx={{ fontWeight: 600, opacity: 0.7, '&:hover': { opacity: 1 } }}
                            >
                                Vaciar carrito
                            </Button>
                        </Box>
                    </Grid>

                    {/* ─── Order Summary ─── */}
                    <Grid item xs={12} md={5} lg={4}>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                border: '1px solid #E9ECEF',
                                background: '#FFFFFF',
                                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                                position: { md: 'sticky' },
                                top: { md: 88 },
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} mb={3}>
                                Resumen del pedido
                            </Typography>
                            <CartSummary onCheckout={handleCheckout} />
                        </Box>

                        {/* Trust Badges */}
                        <Box
                            sx={{
                                mt: 2,
                                p: 2.5,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, rgba(255,107,53,0.04), rgba(78,205,196,0.04))',
                                border: '1px solid rgba(255,107,53,0.12)',
                            }}
                        >
                            {[
                                { icon: '🔒', text: 'Pago 100% seguro con SSL' },
                                { icon: '✅', text: 'Garantía de satisfacción 30 días' },
                                { icon: '⚡', text: 'Acceso inmediato al comprar' },
                                { icon: '🎓', text: 'Soporte directo del instructor' },
                            ].map(({ icon, text }) => (
                                <Stack key={text} direction="row" spacing={1.5} alignItems="center" mb={1}>
                                    <Typography sx={{ fontSize: '1.1rem' }}>{icon}</Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>{text}</Typography>
                                </Stack>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                {/* ─── Suggested Products ─── */}
                <Box mt={8}>
                    <Typography variant="h5" fontWeight={700} mb={3}>
                        También te puede interesar
                    </Typography>
                    <Grid container spacing={3}>
                        {SUGGESTED.map((p) => (
                            <Grid item xs={12} sm={6} md={4} key={p.id}>
                                <ProductCard {...p} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </Box>
    )
}
