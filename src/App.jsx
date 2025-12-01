




// src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Booking from './pages/Booking'
// import MyBookings from './pages/MyBookings'
import Auth from './pages/Auth'
import Contact from './pages/Contact'
import About from './pages/About'
import CartPage from './pages/CartPage'
import Dashboard from './pages/Dashboard'

import { CartProvider } from './contexts/CartContext'
import { BookingProvider } from './contexts/BookingContext'

function AppContent() {
  const location = useLocation()

  const hideHeader = location.pathname === "/dashboard"

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Show header everywhere except dashboard */}
      {!hideHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/booking/:productid" element={<Booking />} />
        {/* <Route path="/mybookings" element={<MyBookings />} /> */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<CartPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<div className="p-6">Page not found. <Link to="/">Go home</Link></div>} />
      </Routes>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <BookingProvider>
          <AppContent />
        </BookingProvider>
      </CartProvider>
    </Router>
  )
}
