import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle payment events
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (!orderId) {
        console.error('Checkout session missing orderId in metadata')
        break
      }

      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { 
            status: 'PAID',
            paymentIntent: session.payment_intent as string
          },
        })
        console.log(`Order ${orderId} marked as PAID`)
      } catch (error) {
        console.error(`Error updating order ${orderId}:`, error)
      }
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`)
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.error(`Payment failed: ${paymentIntent.id} — ${paymentIntent.last_payment_error?.message}`)
      
      const orderId = paymentIntent.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        })
      }
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      console.log(`Refund processed: ${charge.id}`)
      
      const orderId = charge.metadata?.orderId
      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'REFUNDED' },
        })
      }
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
