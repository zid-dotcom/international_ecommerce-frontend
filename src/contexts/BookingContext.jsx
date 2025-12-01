// src/contexts/BookingContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const BookingContext = createContext()
export function useBookings(){ return useContext(BookingContext) }

/**
 * BookingProvider - local-only bookings (no auth / firebase)
 * Bookings persist to localStorage under 'raynott_bookings'
 */
export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('raynott_bookings') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('raynott_bookings', JSON.stringify(bookings))
  }, [bookings])

  const createBooking = async (product, extra = {}) => {
    const booking = {
      id: 'b' + Date.now(),
      product,
      user: null, // no user when auth is disabled
      date: new Date().toISOString(),
      extra
    }
    setBookings(prev => [booking, ...prev])
    return booking
  }

  const fetchUserBookings = async () => {
    // Previously filtered by user; now simply return all local bookings
    return bookings
  }

  return (
    <BookingContext.Provider value={{ bookings, createBooking, fetchUserBookings }}>
      {children}
    </BookingContext.Provider>
  )
}
