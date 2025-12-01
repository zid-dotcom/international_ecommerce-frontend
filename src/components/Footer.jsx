// import React from 'react'

// export default function Footer(){
//   return (
//     <footer className="mt-12 border-t bg-white/80">
//       <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row justify-between gap-6">
//         <div>
//           <h3 className="font-bold">Raynott E‑com</h3>
//           <p className="text-sm text-gray-600">International marketplace focused on quality goods.</p>
//         </div>
//         <div className="text-sm text-gray-600">© {new Date().getFullYear()} Raynott. All rights reserved.</div>
//       </div>
//     </footer>
//   )
// }





// src/components/Footer.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', text: '' }) // type: 'error'|'success'

  function handleSubscribe(e) {
    e.preventDefault()
    const v = (email || '').trim()
    if (!v || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' })
      return
    }
    // demo: store subscription locally (replace with API call in production)
    try {
      const list = JSON.parse(localStorage.getItem('raynott_newsletter') || '[]')
      if (!list.includes(v)) {
        localStorage.setItem('raynott_newsletter', JSON.stringify([v, ...list]))
      }
      setStatus({ type: 'success', text: 'Thanks — you’re subscribed!' })
      setEmail('')
    } catch {
      setStatus({ type: 'error', text: 'Subscription failed — try again.' })
    }
  }

  return (
    <footer className="mt-12 border-t bg-white/90">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold shadow">
                R
              </div>
              <div>
                <div className="font-semibold">Raynott E-com</div>
                <div className="text-xs text-gray-500">Curated international goods</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Quality-first marketplace with straightforward shipping and friendly support.
            </p>

            <div className="flex items-center gap-3">
              <a href="#" aria-label="Follow on Instagram" className="p-2 rounded-md hover:bg-gray-100">
                <FiInstagram className="w-5 h-5 text-gray-700" />
              </a>
              <a href="#" aria-label="Follow on Twitter" className="p-2 rounded-md hover:bg-gray-100">
                <FiTwitter className="w-5 h-5 text-gray-700" />
              </a>
              <a href="#" aria-label="Follow on Facebook" className="p-2 rounded-md hover:bg-gray-100">
                <FiFacebook className="w-5 h-5 text-gray-700" />
              </a>
              <a href="mailto:support@raynott.com" aria-label="Email support" className="p-2 rounded-md hover:bg-gray-100">
                <FiMail className="w-5 h-5 text-gray-700" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <h4 className="text-sm font-semibold mb-2">Shop</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><Link to="/products" className="hover:underline">All products</Link></li>
                <li><a href="#" className="hover:underline">Gifts</a></li>
                <li><a href="#" className="hover:underline">New arrivals</a></li>
                <li><a href="#" className="hover:underline">Best sellers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Company</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><Link to="/about" className="hover:underline">About us</Link></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press</a></li>
                <li><Link to="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold mb-2">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3">Get 10% off your first order — updates on new products and offers.</p>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <label htmlFor="footer-email" className="sr-only">Email</label>
              <input
                id="footer-email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status.type) setStatus({ type: '', text: '' }) }}
                placeholder="you@example.com"
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                type="email"
                inputMode="email"
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:brightness-95"
                aria-label="Subscribe"
              >
                Subscribe
              </button>
            </form>

            {status.text && (
              <div className={`mt-2 text-sm ${status.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{status.text}</div>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div>© {new Date().getFullYear()} Raynott. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
