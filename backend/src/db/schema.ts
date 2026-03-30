import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../hearth.db')

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      category    TEXT    NOT NULL,
      name        TEXT    NOT NULL,
      description TEXT    NOT NULL DEFAULT '',
      price       TEXT    NOT NULL,
      available   INTEGER NOT NULL DEFAULT 1,
      position    INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      phone       TEXT    NOT NULL DEFAULT '',
      date        TEXT    NOT NULL,
      time        TEXT    NOT NULL,
      party_size  INTEGER NOT NULL DEFAULT 2,
      notes       TEXT,
      status      TEXT    NOT NULL DEFAULT 'pending',
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      email       TEXT    NOT NULL,
      message     TEXT    NOT NULL,
      read        INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT    NOT NULL UNIQUE,
      password_hash TEXT    NOT NULL,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
  `)

  seedMenuItems(db)
  seedAdminUser(db)
}

function seedMenuItems(db: Database.Database): void {
  const count = (db.prepare('SELECT COUNT(*) as c FROM menu_items').get() as { c: number }).c
  if (count > 0) return

  const insert = db.prepare(`
    INSERT INTO menu_items (category, name, description, price, position)
    VALUES (@category, @name, @description, @price, @position)
  `)

  const items = [
    // Espresso
    { category: 'espresso', name: 'Ristretto',            description: '1:1 ratio — equal parts coffee and water. Short, sweet, and intensely concentrated.', price: '€3.00', position: 1 },
    { category: 'espresso', name: 'Espresso',             description: '1:2 ratio — single origin, dialled in daily by our baristas.',                        price: '€3.00', position: 2 },
    { category: 'espresso', name: 'Double Espresso',      description: 'More of a good thing.',                                                               price: '€3.50', position: 3 },
    { category: 'espresso', name: 'Cortado',              description: 'Equal parts espresso and warm milk. Balanced, clean.',                                price: '€3.80', position: 4 },
    { category: 'espresso', name: 'Flat White',           description: '18g espresso, velvety micro-foam. A proper daily ritual.',                            price: '€4.50', position: 5 },
    { category: 'espresso', name: 'Cappuccino',           description: 'Classic foam dome — dry or wet, your call.',                                          price: '€4.50', position: 6 },
    { category: 'espresso', name: 'Latte',                description: 'Smooth and milky. Ask about our house syrups.',                                       price: '€4.80', position: 7 },
    { category: 'espresso', name: 'Oat Latte',            description: 'Barista oat milk — a daily staple for many of our regulars.',                         price: '€5.20', position: 8 },
    { category: 'espresso', name: 'Honey Walnut Latte ✦', description: 'Our signature. House honey syrup, toasted walnut, oat milk.',                         price: '€5.80', position: 9 },
    { category: 'espresso', name: 'Rose Cardamom Latte ✦',description: 'Fragrant and floral. Rose water, cardamom, steamed milk.',                            price: '€5.80', position: 10 },
    // Filter
    { category: 'filter', name: 'Pour Over',   description: "Rotating single origins from our roastery. Ask what's on today.",  price: '€5.50', position: 1 },
    { category: 'filter', name: 'AeroPress',   description: 'Full immersion, clean cup. Our preferred morning method.',          price: '€4.80', position: 2 },
    { category: 'filter', name: 'Cold Brew',   description: '20-hour cold steep. Rich, smooth, and completely bitterness-free.', price: '€5.00', position: 3 },
    { category: 'filter', name: 'Batch Brew',  description: 'Freshly brewed filter on tap. Our most approachable cup.',          price: '€3.50', position: 4 },
    // Roastery
    { category: 'roastery', name: 'Ethiopian Yirgacheffe', description: 'Washed. Blueberry, jasmine, lemon verbena. Light roast. 250g bag.',        price: '€14.00', position: 1 },
    { category: 'roastery', name: 'Colombian Huila',       description: 'Natural. Brown sugar, dried apricot, milk chocolate. Medium. 250g.',        price: '€13.00', position: 2 },
    { category: 'roastery', name: 'Guatemalan Antigua',    description: 'Honey processed. Hazelnut, peach, golden syrup. Medium-dark. 250g.',        price: '€12.50', position: 3 },
    { category: 'roastery', name: 'Espresso Blend ✦',      description: 'Our house blend. Caramel, dark cherry, cocoa finish. 250g or 1kg.',         price: '€11.00', position: 4 },
    // Food
    { category: 'food', name: 'Sourdough Toast',          description: 'Two thick slices, cultured butter, sea salt flakes.',                         price: '€4.50', position: 1 },
    { category: 'food', name: 'Avocado Toast',            description: 'Smashed avo, pickled chilli, seeds, on house sourdough.',                    price: '€7.50', position: 2 },
    { category: 'food', name: 'Cardamom Knot',            description: 'House-baked. Soft, fragrant, and gone by 11am.',                             price: '€3.80', position: 3 },
    { category: 'food', name: 'Almond Croissant',         description: 'Twice-baked, frangipane, flaked almonds. A weekend ritual.',                 price: '€4.20', position: 4 },
    { category: 'food', name: 'Seasonal Tart',            description: 'Changes weekly. Ask the barista. Always worth it.',                          price: '€5.00', position: 5 },
    // Art & Pottery
    { category: 'pottery', name: 'Hand-thrown Mug',       description: 'Local ceramicist. Each one unique. 300ml capacity.',                         price: '€38.00', position: 1 },
    { category: 'pottery', name: 'Espresso Cup + Saucer', description: 'Stoneware, matte glaze. The cup our ristretto comes in.',                    price: '€28.00', position: 2 },
    { category: 'pottery', name: 'Poppy Dish ✦',          description: 'Hand-painted poppy motif. Limited run of 12. On display now.',               price: '€55.00', position: 3 },
    { category: 'pottery', name: 'Wall Print',            description: 'Local artist. A3 risograph print. Edition of 30.',                           price: '€45.00', position: 4 },
  ]

  type SeedItem = typeof items[number]
  const insertMany = db.transaction((items: SeedItem[]) => {
    for (const item of items) insert.run(item)
  })
  insertMany(items)
}

function seedAdminUser(db: Database.Database): void {
  const exists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin')
  if (exists) return
  const hash = bcrypt.hashSync('hearth2025', 10)
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', hash)
}

export function closeDb(): void {
  if (db) db.close()
}
