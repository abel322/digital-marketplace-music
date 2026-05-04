'use client'

import { useRouter } from 'next/navigation'
import {
  Drawer, Box, Typography, IconButton, Button,
  Stack, Badge,
} from '@mui/material'
import {
  Close, Delete, ShoppingCartOutlined, ArrowForward,
} from '@mui/icons-material'
import { useCart } from '@/context/CartContext'
import CartItemCard from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter()
  const { items, clearCart, itemCount } = useCart()

  const handleCheckout = () => {
    onClose()
    router.push('/checkout')
  }

  const handleViewCart = () => {
    onClose()
    router.push('/cart')
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 420 },
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* ─── Header ─── */}
      <Box
        sx={{
          px: 3, py: 2.5,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid', borderColor: 'divider',
          background: 'linear-gradient(135deg, rgba(255,107,53,0.04) 0%, rgba(78,205,196,0.04) 100%)',
          flexShrink: 0,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Badge badgeContent={itemCount} color="primary" max={99}>
            <ShoppingCartOutlined sx={{ color: 'primary.main' }} />
          </Badge>
          <Box>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1}>Tu carrito</Typography>
            <Typography variant="caption" color="text.secondary">
              {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          {items.length > 0 && (
            <IconButton size="small" onClick={clearCart} title="Vaciar carrito" sx={{ color: 'text.secondary' }}>
              <Delete fontSize="small" />
            </IconButton>
          )}
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Stack>
      </Box>

      {/* ─── Items List ─── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCartOutlined sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.15, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600} gutterBottom>
              Tu carrito está vacío
            </Typography>
            <Typography variant="body2" color="text.disabled" mb={3}>
              Explora nuestros productos y agrega algo increíble
            </Typography>
            <Button
              variant="outlined"
              onClick={() => { onClose(); router.push('/products') }}
              sx={{ fontWeight: 600, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              Ver productos
            </Button>
          </Box>
        ) : (
          <Stack spacing={1.5}>
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
                  compact
                />
              )
            })}
          </Stack>
        )}
      </Box>

      {/* ─── Footer / Summary ─── */}
      {items.length > 0 && (
        <Box
          sx={{
            px: 3, py: 3, flexShrink: 0,
            borderTop: '1px solid', borderColor: 'divider',
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,107,53,0.02) 100%)',
          }}
        >
          <CartSummary onCheckout={handleCheckout} />

          <Button
            variant="text"
            fullWidth
            endIcon={<ArrowForward fontSize="small" />}
            onClick={handleViewCart}
            sx={{ mt: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.8125rem' }}
          >
            Ver carrito completo
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
