import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDb } from '../db/schema'
import { signToken } from '../middleware/auth'
import { AdminUser } from '../types'

const router = Router()

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

router.post('/login', (req: Request, res: Response): void => {
  const result = LoginSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Username and password required' })
    return
  }
  const { username, password } = result.data
  const db = getDb()
  const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username) as AdminUser | undefined
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }
  const token = signToken({ userId: user.id, username: user.username })
  res.json({ token, username: user.username })
})

export default router
