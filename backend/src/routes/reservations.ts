import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import { Reservation } from '../types'

const router = Router()

const ReservationSchema = z.object({
  name:       z.string().min(1, 'Name is required'),
  email:      z.string().email('Valid email required'),
  phone:      z.string().default(''),
  date:       z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time:       z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM'),
  party_size: z.number().int().min(1).max(20),
  notes:      z.string().optional(),
})

const StatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled']),
})

// Public — create reservation
router.post('/', (req: Request, res: Response): void => {
  const result = ReservationSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors })
    return
  }
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO reservations (name, email, phone, date, time, party_size, notes)
    VALUES (@name, @email, @phone, @date, @time, @party_size, @notes)
  `).run({ ...result.data, notes: result.data.notes ?? null })
  const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(info.lastInsertRowid) as Reservation
  res.status(201).json(reservation)
})

// Admin — list all reservations (optional ?date=YYYY-MM-DD filter)
router.get('/', requireAuth, (req: Request, res: Response): void => {
  const db = getDb()
  const { date } = req.query
  const reservations = date
    ? db.prepare('SELECT * FROM reservations WHERE date = ? ORDER BY time').all(date) as Reservation[]
    : db.prepare('SELECT * FROM reservations ORDER BY date DESC, time').all() as Reservation[]
  res.json(reservations)
})

// Admin — update status
router.patch('/:id', requireAuth, (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const result = StatusSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Status must be pending, confirmed, or cancelled' })
    return
  }
  const db = getDb()
  const info = db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(result.data.status, id)
  if (info.changes === 0) { res.status(404).json({ error: 'Not found' }); return }
  const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id) as Reservation
  res.json(updated)
})

export default router
