import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import { ContactMessage } from '../types'
import { emailSchema } from '../utils/validation'

const router = Router()

const MessageSchema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   emailSchema,
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

// Public — submit message
router.post('/', (req: Request, res: Response): void => {
  const result = MessageSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors })
    return
  }
  const db = getDb()
  const info = db.prepare(
    'INSERT INTO contact_messages (name, email, message) VALUES (@name, @email, @message)'
  ).run(result.data)
  const msg = db.prepare('SELECT * FROM contact_messages WHERE id = ?').get(info.lastInsertRowid) as ContactMessage
  res.status(201).json({ success: true, id: msg.id })
})

// Admin — list all messages
router.get('/', requireAuth, (_req: Request, res: Response): void => {
  const messages = getDb().prepare(
    'SELECT * FROM contact_messages ORDER BY read ASC, created_at DESC'
  ).all() as ContactMessage[]
  res.json(messages)
})

// Admin — mark as read
router.patch('/:id/read', requireAuth, (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const info = getDb().prepare('UPDATE contact_messages SET read = 1 WHERE id = ?').run(id)
  if (info.changes === 0) { res.status(404).json({ error: 'Not found' }); return }
  res.json({ success: true })
})

export default router
