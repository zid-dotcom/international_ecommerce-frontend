// src/pages/Contact.jsx
import React, { useState } from 'react'
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState({ mode: '', text: '' }) // mode: '', 'success', 'error'
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (status.mode) setStatus({ mode: '', text: '' })
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email.'
    if (!form.message.trim() || form.message.trim().length < 10) return 'Please enter a message (10+ characters).'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) {
      setStatus({ mode: 'error', text: err })
      return
    }
    setSubmitting(true)
    setStatus({ mode: '', text: '' })

    // Demo: simulate async send
    await new Promise(r => setTimeout(r, 900))
    setSubmitting(false)
    setForm({ name: '', email: '', message: '' })
    setStatus({ mode: 'success', text: 'Thanks — your message was sent. We’ll reply within 24 hours.' })
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: contact info */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-2xl font-bold">Contact us</h2>
          <p className="text-gray-600">
            Need help or want to partner with Raynott? Reach out — we’re happy to assist with orders, shipping,
            and custom requests.
          </p>

          <div className="space-y-3">
            <ContactCard
              icon={<FaEnvelope className="w-5 h-5 text-indigo-600" />}
              title="Email"
              body={<a href="mailto:support@raynott.com" className="text-sm text-gray-700 hover:underline">support@raynott.com</a>}
            />
            <ContactCard
              icon={<FaPhoneAlt className="w-5 h-5 text-indigo-600" />}
              title="Phone"
              body={<a href="tel:+15551234567" className="text-sm text-gray-700 hover:underline">+1 555 123 4567</a>}
            />
            <ContactCard
              icon={<FaMapMarkerAlt className="w-5 h-5 text-indigo-600" />}
              title="Address"
              body={<div className="text-sm text-gray-700">123 Global Way, International City</div>}
            />
            <ContactCard
              icon={<FaClock className="w-5 h-5 text-indigo-600" />}
              title="Hours"
              body={<div className="text-sm text-gray-700">Mon — Fri: 9:00 — 18:00 (UTC)</div>}
            />
          </div>

          {/* Small map placeholder (replace src with your map) */}
          <div className="mt-4">
            <div className="text-xs text-gray-500 mb-2">Location</div>
            <div className="rounded-lg overflow-hidden border">
              <iframe
                title="Raynott location"
                src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-40"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Right column: contact form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Send a message</h3>
          <p className="text-sm text-gray-600 mb-4">Fill out the form and our team will get back to you shortly.</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <label className="sr-only" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-required="true"
            />

            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your email"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-required="true"
            />

            <label className="sr-only" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              placeholder="How can we help you?"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-required="true"
            />

            {/* status messages */}
            {status.mode === 'error' && (
              <div role="alert" className="text-sm text-red-600">{status.text}</div>
            )}
            {status.mode === 'success' && (
              <div role="status" className="text-sm text-green-600">{status.text}</div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-3 rounded-2xl bg-indigo-600 text-white shadow hover:brightness-95 disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send message'}
              </button>

              <button
                type="button"
                onClick={() => { setForm({ name: '', email: '', message: '' }); setStatus({ mode: '', text: '' }) }}
                className="px-4 py-2 border rounded-2xl text-sm"
              >
                Reset
              </button>

              <div className="ml-auto text-xs text-gray-500">We reply within 24 hours</div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

/* Small ContactCard component */
function ContactCard({ icon, title, body }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-white">
      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-sm text-gray-600 mt-1">{body}</div>
      </div>
    </div>
  )
}
