import React from 'react'
import { useCart } from '../contexts/CartContext'

export default function CartPage(){
  const { cart, removeFromCart, updateQty, clearCart } = useCart()
  const total = cart.reduce((s,p)=>s + p.price * p.qty, 0)
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>
      {cart.length===0 ? <div>Your cart is empty.</div> : (
        <div>
          <div className="space-y-4">
            {cart.map(item=> (
              <div key={item.id} className="flex items-center gap-4 border p-3 rounded bg-white">
                <img src={item.img} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-600">${item.price} x {item.qty}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={()=>updateQty(item.id, item.qty-1>0?item.qty-1:1)} className="px-2 py-1 border rounded">-</button>
                  <button onClick={()=>updateQty(item.id, item.qty+1)} className="px-2 py-1 border rounded">+</button>
                  <button onClick={()=>removeFromCart(item.id)} className="px-3 py-1 border rounded">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div className="font-bold text-lg">Total: ${total.toFixed(2)}</div>
            <div className="flex gap-3">
              <button onClick={()=>clearCart()} className="px-4 py-2 border rounded">Clear</button>
              {/* <button onClick={()=>alert('Demo checkout — integrate with Stripe/PayPal for live payments')} className="px-4 py-2 bg-indigo-600 text-white rounded">Checkout</button> */}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
