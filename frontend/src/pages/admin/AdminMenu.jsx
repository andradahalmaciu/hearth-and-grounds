import { useEffect, useState } from 'react'
import { AdminSidebar } from './AdminDashboard'
import { getMenuAll, createMenuItem, updateMenuItem, deleteMenuItem } from '../../services/api'

const CATEGORIES = ['espresso', 'filter', 'roastery', 'food', 'pottery']

const EMPTY_FORM = {
  category: '',
  name: '',
  description: '',
  price: '',
  available: true,
}

export default function AdminMenu() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const loadItems = async () => {
    setLoading(true)
    try {
      const data = await getMenuAll()
      setItems(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.message || 'Failed to load menu items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadItems() }, [])

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditId(null)
    setFormError('')
    setShowForm(true)
  }

  const openEdit = (item) => {
    setForm({
      category: item.category || '',
      name: item.name || '',
      description: item.description || '',
      price: item.price !== undefined ? String(item.price) : '',
      available: item.available === 1 || item.available === true,
    })
    setEditId(item.id)
    setFormError('')
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = {
        category: form.category,
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        available: form.available ? 1 : 0,
      }
      if (editId) {
        await updateMenuItem(editId, payload)
      } else {
        await createMenuItem(payload)
      }
      cancelForm()
      await loadItems()
    } catch (err) {
      setFormError(err?.message || 'Failed to save item.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return
    try {
      await deleteMenuItem(item.id)
      await loadItems()
    } catch (err) {
      alert(err?.message || 'Failed to delete item.')
    }
  }

  const handleToggleAvailable = async (item) => {
    try {
      await updateMenuItem(item.id, { available: item.available ? 0 : 1 })
      await loadItems()
    } catch (err) {
      alert(err?.message || 'Failed to update availability.')
    }
  }

  return (
    <div className="flex min-h-screen bg-parchment">
      <AdminSidebar />

      <main className="ml-56 flex-1 px-10 py-12">
        <div className="max-w-5xl">

          {/* Header */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="font-sans text-clay text-xs tracking-widest uppercase mb-2">Manage</p>
              <h1 className="font-serif text-espresso text-4xl leading-tight">Menu Items</h1>
            </div>
            {!showForm && (
              <button
                onClick={openAdd}
                className="bg-espresso text-parchment font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-walnut transition-colors"
              >
                + Add Item
              </button>
            )}
          </div>

          {/* Inline form */}
          {showForm && (
            <div className="bg-white/60 border border-walnut/10 p-8 mb-8">
              <p className="font-sans text-xs tracking-widest uppercase text-walnut/40 mb-6">
                {editId ? 'Edit Item' : 'New Item'}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Category */}
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">Category</label>
                    <select
                      required
                      value={form.category}
                      onChange={set('category')}
                      className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso focus:outline-none focus:border-clay transition-colors appearance-none"
                    >
                      <option value="" disabled>Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Item name"
                      className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={set('description')}
                    placeholder="Short description (optional)"
                    className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 items-end">
                  {/* Price */}
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-walnut/40 block mb-2">Price (€)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={set('price')}
                      placeholder="0.00"
                      className="w-full bg-transparent border-b border-walnut/20 py-2.5 font-sans text-sm text-espresso placeholder-walnut/25 focus:outline-none focus:border-clay transition-colors"
                    />
                  </div>

                  {/* Available */}
                  <div className="flex items-center gap-3 pb-2.5">
                    <input
                      type="checkbox"
                      id="form-available"
                      checked={form.available}
                      onChange={set('available')}
                      className="w-4 h-4 accent-clay"
                    />
                    <label htmlFor="form-available" className="font-sans text-sm text-walnut/60 cursor-pointer">
                      Available
                    </label>
                  </div>
                </div>

                {formError && (
                  <p className="font-sans text-xs text-dusty">{formError}</p>
                )}

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-espresso text-parchment font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-walnut transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : editId ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="font-sans text-xs tracking-widest uppercase text-walnut/40 hover:text-walnut transition-colors px-4"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="font-sans text-sm text-dusty mb-6">{error}</p>
          )}

          {/* Table */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-walnut/5 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className="font-sans text-sm text-walnut/40">No menu items yet. Add one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-walnut/10">
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-6">Category</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-6">Name</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-6">Price</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3 pr-6">Available</th>
                    <th className="font-sans text-[10px] tracking-widest uppercase text-walnut/35 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-walnut/5 hover:bg-walnut/5 transition-colors">
                      <td className="font-sans text-xs text-walnut/50 py-4 pr-6 capitalize">{item.category}</td>
                      <td className="font-sans text-sm text-espresso py-4 pr-6">{item.name}</td>
                      <td className="font-sans text-sm text-walnut/70 py-4 pr-6">€{Number(item.price).toFixed(2)}</td>
                      <td className="py-4 pr-6">
                        <button
                          onClick={() => handleToggleAvailable(item)}
                          className={`font-sans text-[10px] tracking-widest uppercase px-2.5 py-1 transition-colors ${
                            item.available
                              ? 'bg-sage-light text-sage-dark'
                              : 'bg-walnut/10 text-walnut/40'
                          }`}
                        >
                          {item.available ? 'Yes' : 'No'}
                        </button>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-4">
                          <button
                            onClick={() => openEdit(item)}
                            className="font-sans text-xs text-clay hover:text-walnut transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="font-sans text-xs text-dusty/60 hover:text-dusty transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
