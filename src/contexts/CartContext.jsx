import React, { createContext, useContext, useState, useEffect } from 'react'
const CartContext = createContext()
export function useCart(){ return useContext(CartContext) }

export function CartProvider({ children }){
  const [cart, setCart] = useState(()=>{ try { return JSON.parse(localStorage.getItem('raynott_cart')||'[]') } catch { return [] } })
  useEffect(()=> localStorage.setItem('raynott_cart', JSON.stringify(cart)), [cart])
  const addToCart = (product)=> setCart(prev=>{ const ex = prev.find(p=>p.id===product.id); if(ex) return prev.map(p=>p.id===product.id?{...p,qty:p.qty+1}:p); return [...prev,{...product,qty:1}] })
  const removeFromCart = (id)=> setCart(prev=>prev.filter(p=>p.id!==id))
  const clearCart = ()=> setCart([])
  const updateQty = (id, qty)=> setCart(prev=>prev.map(p=>p.id===id?{...p,qty}:p))
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQty }}>{children}</CartContext.Provider>
}
