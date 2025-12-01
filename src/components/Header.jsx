

// src/components/Header.jsx
import React, { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { FiShoppingCart, FiLogIn, FiLogOut } from 'react-icons/fi'

export default function Header() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  // session from localStorage
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('raynott_session') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    function syncSession() {
      try {
        setSession(JSON.parse(localStorage.getItem('raynott_session') || 'null'))
      } catch {
        setSession(null)
      }
    }
    window.addEventListener('storage', syncSession)
    return () => window.removeEventListener('storage', syncSession)
  }, [])

  const itemCount = useMemo(
    () => cart.reduce((s, p) => s + (p.qty || 0), 0),
    [cart]
  )

  const [acctOpen, setAcctOpen] = useState(false)
  const acctRef = useRef(null)

  // close account dropdown on outside click
  useEffect(() => {
    function handleDoc(e) {
      if (acctRef.current && !acctRef.current.contains(e.target)) {
        setAcctOpen(false)
      }
    }
    document.addEventListener('mousedown', handleDoc)
    return () => document.removeEventListener('mousedown', handleDoc)
  }, [])

  function doLogout() {
    localStorage.removeItem('raynott_session')
    setSession(null)
    setAcctOpen(false)
    navigate('/')
  }

  const initials =
    session?.name
      ? session.name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U'

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4 py-3">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 
              flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              R
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-lg">Raynott</div>
              <div className="text-xs text-gray-500">International E-com</div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Right side */}
          <div className="flex items-center gap-3">

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <Link to="/" className="py-2 px-3 hover:bg-gray-100 rounded-md">Home</Link>
              <Link to="/products" className="py-2 px-3 hover:bg-gray-100 rounded-md">Products</Link>
              <Link to="/about" className="py-2 px-3 hover:bg-gray-100 rounded-md">About</Link>
              <Link to="/contact" className="py-2 px-3 hover:bg-gray-100 rounded-md">Contact</Link>
              {/* <Link to="/mybookings" className="py-2 px-3 hover:bg-gray-100 rounded-md">My Bookings</Link> */}
            </nav>

            {/* Cart (before login) */}
            <button
              onClick={() => navigate('/cart')}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FiShoppingCart size={22} className="text-gray-700" />
              <span className="hidden sm:inline text-sm">Cart</span>

              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                  {itemCount}
                </span>
              )}
            </button>

            {/* LOGIN — LAST ITEM ALWAYS */}
            <div className="relative" ref={acctRef}>
              {!session ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiLogIn size={18} className="text-gray-700" />
                  <span className="hidden sm:inline text-sm">Login</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setAcctOpen(s => !s)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                      {initials}
                    </div>
                    <span className="hidden sm:inline text-sm">{session.name}</span>
                  </button>

                  {acctOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-lg p-2">
                      <button
                        onClick={doLogout}
                        className="w-full flex items-center gap-2 px-2 py-2 text-sm hover:bg-gray-50 rounded"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(s => !s)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col gap-1 px-1">
              <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-md">Home</Link>
              <Link to="/products" onClick={() => setMobileOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-md">Products</Link>
              <Link to="/about" onClick={() => setMobileOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-md">About</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-md">Contact</Link>
              {/* <Link to="/mybookings" onClick={() => setMobileOpen(false)} className="px-3 py-2 hover:bg-gray-100 rounded-md">My Bookings</Link> */}

              {!session ? (
                <button
                  onClick={() => { navigate('/auth'); setMobileOpen(false) }}
                  className="mt-2 py-2 px-3 rounded-md bg-indigo-600 text-white"
                >
                  Login
                </button>
              ) : (
                <button
                  onClick={() => { doLogout(); setMobileOpen(false) }}
                  className="mt-2 py-2 px-3 rounded-md border"
                >
                  Logout
                </button>
              )}

              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded-md text-center"
              >
                View Cart ({itemCount})
              </Link>
            </div>
          </div>
        )}

      </div>
    </header>
  )
}
