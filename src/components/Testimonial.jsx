import React from 'react'
export default function Testimonial({name, body}){ return (
  <div className="p-4 border rounded-lg bg-white">
    <p className="text-gray-700">“{body}”</p>
    <div className="mt-3 text-sm font-semibold">— {name}</div>
  </div>
)}
