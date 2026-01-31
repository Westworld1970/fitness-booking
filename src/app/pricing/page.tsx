'use client'

import Link from 'next/link'
import { FITNESS_SESSIONS } from '@/types/booking'

export default function PricingPage() {
  const personalSessions = FITNESS_SESSIONS.filter(s => s.type === 'personal')
  const groupClasses = FITNESS_SESSIONS.filter(s => s.type === 'group')

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(cents / 100)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the perfect plan for your fitness journey
          </p>
        </div>

        {/* Personal Training */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Training</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {personalSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-900">{session.name}</h3>
                <p className="mt-2 text-gray-600 text-sm">{session.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(session.price)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    / {session.id.includes('pack') ? 'pack' : 'session'}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{session.duration} min per session</p>
                <Link
                  href={`/booking?session=${session.id}`}
                  className="mt-6 block w-full text-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Group Classes */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Group Classes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {groupClasses.map((session) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-900">{session.name}</h3>
                <p className="mt-2 text-gray-600 text-sm">{session.description}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(session.price)}
                  </span>
                  <span className="text-gray-500 ml-2">/ class</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{session.duration} min</p>
                <Link
                  href={`/booking?session=${session.id}`}
                  className="mt-6 block w-full text-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
