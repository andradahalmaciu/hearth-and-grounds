export interface MenuItem {
  id: number
  category: string
  name: string
  description: string
  price: string
  available: number
  position: number
  created_at: string
}

export interface Reservation {
  id: number
  name: string
  email: string
  phone: string
  date: string
  time: string
  party_size: number
  notes: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  read: number
  created_at: string
}

export interface AdminUser {
  id: number
  username: string
  password_hash: string
  created_at: string
}

export interface JwtPayload {
  userId: number
  username: string
}
