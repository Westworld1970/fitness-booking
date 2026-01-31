export interface FitnessSession {
  id: string
  name: string
  description: string
  price: number // in cents
  duration: number // in minutes
  type: 'personal' | 'group'
}

export interface Booking {
  id: string
  sessionId: string
  sessionName: string
  customerEmail: string
  date: string
  time: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentIntentId?: string
  createdAt: string
}

export const FITNESS_SESSIONS: FitnessSession[] = [
  {
    id: 'pt-single',
    name: 'Personal Training - Single Session',
    description: 'One-on-one session with a certified personal trainer. Customized workout plan.',
    price: 5000, // £50.00
    duration: 60,
    type: 'personal',
  },
  {
    id: 'pt-5pack',
    name: 'Personal Training - 5 Session Pack',
    description: 'Five personal training sessions. Save 10% compared to single sessions.',
    price: 22500, // £225.00
    duration: 60,
    type: 'personal',
  },
  {
    id: 'pt-10pack',
    name: 'Personal Training - 10 Session Pack',
    description: 'Ten personal training sessions. Save 20% compared to single sessions.',
    price: 40000, // £400.00
    duration: 60,
    type: 'personal',
  },
  {
    id: 'group-hiit',
    name: 'HIIT Class',
    description: 'High-intensity interval training class. Maximum 12 participants.',
    price: 1500, // £15.00
    duration: 45,
    type: 'group',
  },
  {
    id: 'group-yoga',
    name: 'Yoga Class',
    description: 'Relaxing yoga session for all levels. Maximum 15 participants.',
    price: 1200, // £12.00
    duration: 60,
    type: 'group',
  },
  {
    id: 'group-spin',
    name: 'Spin Class',
    description: 'Indoor cycling class with energizing music. Maximum 20 participants.',
    price: 1400, // £14.00
    duration: 45,
    type: 'group',
  },
]
