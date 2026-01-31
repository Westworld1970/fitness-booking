import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getBooking, updateBookingPaymentStatus } from '@/lib/bookings'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        const booking = getBooking(bookingId)
        if (booking) {
          updateBookingPaymentStatus(
            bookingId,
            'paid',
            session.payment_intent as string
          )
          console.log(`Payment successful for booking ${bookingId}`)
        }
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        updateBookingPaymentStatus(bookingId, 'failed')
        console.log(`Payment expired for booking ${bookingId}`)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log(`Payment failed: ${paymentIntent.id}`)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      const paymentIntentId = charge.payment_intent as string

      // Find booking by payment intent and update status
      // In production, you'd query your database
      console.log(`Refund processed for payment intent: ${paymentIntentId}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
