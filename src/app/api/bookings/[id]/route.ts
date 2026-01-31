import { NextRequest, NextResponse } from 'next/server'
import { getBooking } from '@/lib/bookings'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const booking = getBooking(params.id)

  if (!booking) {
    return NextResponse.json(
      { error: 'Booking not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    id: booking.id,
    sessionName: booking.sessionName,
    date: booking.date,
    time: booking.time,
    paymentStatus: booking.paymentStatus,
    createdAt: booking.createdAt,
  })
}
