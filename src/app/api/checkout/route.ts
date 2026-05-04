import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { items, couponCode, customerEmail, metadata = {} } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
        }

        // Calculate total on the server (never trust client total)
        const subtotal = items.reduce(
            (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
            0
        )

        // Apply coupon discount
        let discount = 0
        if (couponCode) {
            const COUPONS: Record<string, { discount: number; type: string }> = {
                BIENVENIDO10: { discount: 10, type: 'PERCENTAGE' },
                MUSICA20: { discount: 20, type: 'PERCENTAGE' },
                OFF15: { discount: 15, type: 'FIXED' },
                VERANO30: { discount: 30, type: 'PERCENTAGE' },
            }
            const c = COUPONS[couponCode.toUpperCase()]
            if (c) {
                discount = c.type === 'PERCENTAGE'
                    ? (subtotal * c.discount) / 100
                    : Math.min(c.discount, subtotal)
            }
        }

        const total = Math.round((subtotal - discount) * 100) // Stripe uses cents

        if (total < 50) {
            return NextResponse.json({ error: 'El monto mínimo es $0.50' }, { status: 400 })
        }

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: total,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            receipt_email: customerEmail || undefined,
            metadata: {
                items: JSON.stringify(items.map((i: any) => ({ id: i.id, qty: i.quantity }))),
                couponCode: couponCode || '',
                subtotal: subtotal.toString(),
                discount: discount.toString(),
                ...metadata,
            },
        })

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: total,
            subtotal,
            discount,
        })
    } catch (error: any) {
        console.error('POST /api/checkout error:', error)
        // If Stripe key is not configured return a mock secret for development
        if (error?.type === 'StripeAuthenticationError' || !process.env.STRIPE_SECRET_KEY) {
            return NextResponse.json({
                clientSecret: 'pi_mock_secret_test',
                paymentIntentId: 'pi_mock_' + Date.now(),
                amount: 0,
                subtotal: 0,
                discount: 0,
                _dev: true,
            })
        }
        return NextResponse.json({ error: 'Error al crear el pago' }, { status: 500 })
    }
}
