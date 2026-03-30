import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import { MenuItem } from '../types'

const router = Router()

const ItemSchema = z.object({
  category:    z.string().min(1),
  name:        z.string().min(1),
  description: z.string().default(''),
  price:       z.string().min(1),
  available:   z.number().int().min(0).max(1).default(1),
  position:    z.number().int().min(0).default(0),
})

// Public — get all available items grouped by category
router.get('/', (_req: Request, res: Response): void => {
  const db = getDb()
  const items = db.prepare(
    'SELECT * FROM menu_items ORDER BY category, position, name'
  ).all() as MenuItem[]

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  res.json(grouped)
})

// Admin — get all items (including unavailable)
router.get('/all', requireAuth, (_req: Request, res: Response): void => {
  const db = getDb()
  const items = db.prepare(
    'SELECT * FROM menu_items ORDER BY category, position, name'
  ).all() as MenuItem[]
  res.json(items)
})

// Admin — create item
router.post('/', requireAuth, (req: Request, res: Response): void => {
  const result = ItemSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() })
    return
  }
  const db = getDb()
  const info = db.prepare(`
    INSERT INTO menu_items (category, name, description, price, available, position)
    VALUES (@category, @name, @description, @price, @available, @position)
  `).run(result.data)
  const item = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(info.lastInsertRowid) as MenuItem
  res.status(201).json(item)
})

// Admin — update item
router.put('/:id', requireAuth, (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const existing = getDb().prepare('SELECT * FROM menu_items WHERE id = ?').get(id)
  if (!existing) { res.status(404).json({ error: 'Not found' }); return }

  const result = ItemSchema.partial().safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten() })
    return
  }
  const db = getDb()
  const fields = Object.keys(result.data).map(k => `${k} = @${k}`).join(', ')
  db.prepare(`UPDATE menu_items SET ${fields} WHERE id = @id`).run({ ...result.data, id })
  const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id) as MenuItem
  res.json(updated)
})

// Admin — delete item
router.delete('/:id', requireAuth, (req: Request, res: Response): void => {
  const id = Number(req.params.id)
  const info = getDb().prepare('DELETE FROM menu_items WHERE id = ?').run(id)
  if (info.changes === 0) { res.status(404).json({ error: 'Not found' }); return }
  res.status(204).send()
})

export default router
