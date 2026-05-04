import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

// Stripe requires the raw body for webhook signature verification
export const config = { api: { bodyParser: false } }

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 })
    }

    let event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Handle payment events
    switch (event.type) {
        case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as any
            console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)

            // TODO: Create order in DB, send confirmation email, grant access to products
            // const order = await prisma.order.create({ ... })
            // await sendOrderConfirmationEmail(paymentIntent.receipt_email, order)
            break
        }

        case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as any
            console.error(`Payment failed: ${paymentIntent.id} — ${paymentIntent.last_payment_error?.message}`)
            // TODO: Notify user of failed payment
            break
        }

        case 'charge.refunded': {
            const charge = event.data.object as any
            console.log(`Refund processed: ${charge.id}`)
            // TODO: Update order status to REFUNDED
            break
        }

        default:
            console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
}
