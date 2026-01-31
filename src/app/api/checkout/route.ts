import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { FITNESS_SESSIONS } from '@/types/booking'
import { createBooking } from '@/lib/bookings'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, email, date, time } = body

    // Validate required fields
    if (!sessionId || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: sessionId, email, date, time' },
        { status: 400 }
      )
    }

    // Find the session
    const fitnessSession = FITNESS_SESSIONS.find(s => s.id === sessionId)
    if (!fitnessSession) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 400 }
      )
    }

    // Create booking record
    const booking = createBooking({
      sessionId: fitnessSession.id,
      sessionName: fitnessSession.name,
      customerEmail: email,
      date,
      time,
      paymentStatus: 'pending',
    })

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: fitnessSession.name,
              description: `${fitnessSession.description} - ${date} at ${time}`,
            },
            unit_amount: fitnessSession.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        sessionId: fitnessSession.id,
        date,
        time,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel?booking_id=${booking.id}`,
    })

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      bookingId: booking.id,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
