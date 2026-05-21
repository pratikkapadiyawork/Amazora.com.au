'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'
import { SITE } from '@/lib/constants'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to send')
      toast.success('Message sent! We will reply within 1 business day.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send message')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-navy text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold">Contact Us</h1>
          <p className="text-white/60 mt-3">We typically reply within one business day.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4 text-sm text-brand-muted">
          <div className="flex gap-3 items-start">
            <Mail size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-navy">Email</p>
              <a href={`mailto:${SITE.support}`} className="hover:text-brand-red">{SITE.support}</a>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Phone size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-navy">Phone</p>
              <p>{SITE.phone}</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <MapPin size={18} className="text-brand-red mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-brand-navy">Location</p>
              <p>Australia-wide delivery</p>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="md:col-span-3 bg-white rounded-2xl p-6 shadow-card space-y-4">
          {(['name', 'email', 'subject'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-semibold text-brand-navy mb-1.5 capitalize">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required={field !== 'subject'}
                value={form[field]}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-brand-navy mb-1.5">Message</label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-red resize-none"
            />
          </div>
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
            className="w-full h-12 bg-brand-red text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Sending…' : <><Send size={16} /> Send Message</>}
          </motion.button>
        </form>
      </div>
    </div>
  )
}
