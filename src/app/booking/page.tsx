'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FITNESS_SESSIONS, FitnessSession } from '@/types/booking'

function BookingForm() {
  const searchParams = useSearchParams()
  const sessionIdParam = searchParams.get('session')

  const [selectedSession, setSelectedSession] = useState<FitnessSession | null>(null)
  const [email, setEmail] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'redirecting'>('idle')

  useEffect(() => {
    if (sessionIdParam) {
      const session = FITNESS_SESSIONS.find(s => s.id === sessionIdParam)
      if (session) {
        setSelectedSession(session)
      }
    }
  }, [sessionIdParam])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(cents / 100)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSession) {
      setError('Please select a session')
      return
    }

    setIsLoading(true)
    setPaymentStatus('processing')
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: selectedSession.id,
          email,
          date,
          time,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      setPaymentStatus('redirecting')

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPaymentStatus('idle')
    } finally {
      setIsLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </Link>
          <Link href="/pricing" className="text-indigo-600 hover:text-indigo-800 font-medium">
            View Pricing
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Session</h1>
          <p className="mt-2 text-gray-600">Select your preferred session, date, and time</p>
        </div>

        {/* Payment Status Banner */}
        {paymentStatus !== 'idle' && (
          <div className={`mb-6 p-4 rounded-lg ${
            paymentStatus === 'processing' ? 'bg-blue-50 text-blue-700' :
            'bg-green-50 text-green-700'
          }`}>
            <div className="flex items-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {paymentStatus === 'processing' ? 'Creating checkout session...' : 'Redirecting to payment...'}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Session Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Session
            </label>
            <select
              value={selectedSession?.id || ''}
              onChange={(e) => {
                const session = FITNESS_SESSIONS.find(s => s.id === e.target.value)
                setSelectedSession(session || null)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Choose a session...</option>
              <optgroup label="Personal Training">
                {FITNESS_SESSIONS.filter(s => s.type === 'personal').map(session => (
                  <option key={session.id} value={session.id}>
                    {session.name} - {formatPrice(session.price)}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Group Classes">
                {FITNESS_SESSIONS.filter(s => s.type === 'group').map(session => (
                  <option key={session.id} value={session.id}>
                    {session.name} - {formatPrice(session.price)}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Selected Session Details */}
          {selectedSession && (
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-900">{selectedSession.name}</h3>
              <p className="text-sm text-indigo-700 mt-1">{selectedSession.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-indigo-600">{selectedSession.duration} minutes</span>
                <span className="text-lg font-bold text-indigo-900">{formatPrice(selectedSession.price)}</span>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Time */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a time...</option>
              <option value="06:00">6:00 AM</option>
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
              <option value="18:00">6:00 PM</option>
              <option value="19:00">7:00 PM</option>
              <option value="20:00">8:00 PM</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !selectedSession}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Pay ${selectedSession ? formatPrice(selectedSession.price) : ''}`}
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            You will be redirected to Stripe for secure payment
          </p>
        </form>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}
