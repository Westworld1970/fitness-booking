import { Booking } from '@/types/booking'

// In-memory store for prototype - replace with database in production
const bookings: Map<string, Booking> = new Map()

export function createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const newBooking: Booking = {
    ...booking,
    id,
    createdAt: new Date().toISOString(),
  }
  bookings.set(id, newBooking)
  return newBooking
}

export function getBooking(id: string): Booking | undefined {
  return bookings.get(id)
}

export function getBookingByPaymentIntent(paymentIntentId: string): Booking | undefined {
  for (const booking of bookings.values()) {
    if (booking.paymentIntentId === paymentIntentId) {
      return booking
    }
  }
  return undefined
}

export function updateBookingPaymentStatus(
  id: string,
  status: Booking['paymentStatus'],
  paymentIntentId?: string
): Booking | undefined {
  const booking = bookings.get(id)
  if (booking) {
    booking.paymentStatus = status
    if (paymentIntentId) {
      booking.paymentIntentId = paymentIntentId
    }
    bookings.set(id, booking)
    return booking
  }
  return undefined
}

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values())
}
