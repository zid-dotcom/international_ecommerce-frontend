



// import React, { useEffect, useState, useRef } from "react"
// import AllApi from "../services/AllApi"
// import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi"

// export default function Dashboard() {
//   const [products, setProducts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState("")

//   // form
//   const [showForm, setShowForm] = useState(false)
//   const [isEditing, setIsEditing] = useState(false)
//   const [currentId, setCurrentId] = useState(null)
//   const [form, setForm] = useState({ name: "", price: "", description: "", rating: "" })
//   const fileRef = useRef(null)

//   // load all products
//   useEffect(() => {
//     fetchProducts()
//   }, [])

//   async function fetchProducts() {
//     setLoading(true)
//     const res = await AllApi.listProducts()
//     if (res.success) {
//       setProducts(res.data)
//     } else {
//       setError(res.error || "Failed to load products")
//     }
//     setLoading(false)
//   }

//   function openAddForm() {
//     setIsEditing(false)
//     setCurrentId(null)
//     setForm({ name: "", price: "", description: "", rating: "" })
//     if (fileRef.current) fileRef.current.value = null
//     setShowForm(true)
//   }

//   function openEditForm(p) {
//     setIsEditing(true)
//     setCurrentId(p._id)
//     setForm({
//       name: p.name,
//       price: p.price,
//       description: p.description,
//       rating: p.rating,
//     })
//     if (fileRef.current) fileRef.current.value = null
//     setShowForm(true)
//   }

//   function handleChange(e) {
//     const { name, value } = e.target
//     setForm(prev => ({ ...prev, [name]: value }))
//   }

//   async function submitForm(e) {
//     e.preventDefault()
//     setLoading(true)
//     setError("")

//     try {
//       const fd = new FormData()
//       fd.append("name", form.name)
//       fd.append("price", form.price)
//       fd.append("description", form.description)
//       fd.append("rating", form.rating)

//       const file = fileRef.current?.files?.[0]
//       if (file) fd.append("image", file)

//       let res
//       if (isEditing && currentId) {
//         res = await AllApi.editProduct(currentId, fd, { isForm: true })
//       } else {
//         res = await AllApi.addProduct(fd, { isForm: true })
//       }

//       if (res.success) {
//         await fetchProducts()
//         setShowForm(false)
//       } else {
//         setError(res.error || "Operation failed")
//       }
//     } catch (err) {
//       setError(err.message)
//     }

//     setLoading(false)
//   }

//   async function handleDelete(id) {
//     if (!window.confirm("Are you sure you want to delete this product?")) return
//     setLoading(true)
//     const res = await AllApi.deleteProduct(id)
//     if (res.success) {
//       setProducts(prev => prev.filter(p => p._id !== id))
//     } else {
//       alert(res.error || "Failed to delete")
//     }
//     setLoading(false)
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">

//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">Products Dashboard</h1>

//         <button
//           onClick={openAddForm}
//           className="px-4 py-2 bg-blue-600 text-white rounded-xl flex gap-2 items-center"
//         >
//           <FiPlus /> Add Product
//         </button>
//       </div>

//       {error && <div className="text-red-600 mb-3">{error}</div>}

//       {/* FORM */}
//       {showForm && (
//         <form onSubmit={submitForm} className="bg-white p-5 rounded-xl shadow mb-6 space-y-4">

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm">Name</label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm">Price</label>
//               <input
//                 name="price"
//                 type="number"
//                 value={form.price}
//                 onChange={handleChange}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm">Rating</label>
//               <input
//                 name="rating"
//                 type="number"
//                 value={form.rating}
//                 onChange={handleChange}
//                 required
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm">Image</label>
//               <input ref={fileRef} type="file" accept="image/*" className="w-full" />
//             </div>
//           </div>

//           <div>
//             <label className="text-sm">Description</label>
//             <textarea
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//               rows={3}
//               required
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           <div className="flex gap-3">
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2"
//             >
//               {isEditing ? <><FiEdit /> Update</> : <><FiPlus /> Create</>}
//             </button>

//             <button
//               type="button"
//               onClick={() => setShowForm(false)}
//               className="px-4 py-2 border rounded-xl"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}

//       {/* PRODUCTS TABLE */}
//       <div className="bg-white rounded-xl shadow overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-3">Image</th>
//               <th className="p-3">Name</th>
//               <th className="p-3">Price</th>
//               <th className="p-3">Rating</th>
//               <th className="p-3">Description</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading && products.length === 0 && (
//               <tr><td colSpan="6" className="p-4">Loading...</td></tr>
//             )}

//             {!loading && products.length === 0 && (
//               <tr><td colSpan="6" className="p-4">No products found.</td></tr>
//             )}

//             {products.map(p => (
//               <tr key={p._id} className="border-t">
//                 <td className="p-3">
//                   {p.imgurl ? (
//                     <img src={p.imgurl} className="w-20 h-20 object-cover rounded" />
//                   ) : (
//                     <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs">
//                       No image
//                     </div>
//                   )}
//                 </td>

//                 <td className="p-3">{p.name}</td>
//                 <td className="p-3">₹{p.price}</td>
//                 <td className="p-3">{p.rating}</td>
//                 <td className="p-3 max-w-xs truncate">{p.description}</td>

//                 <td className="p-3">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => openEditForm(p)}
//                       className="px-3 py-1 border rounded flex items-center gap-2"
//                     >
//                       <FiEdit />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(p._id)}
//                       className="px-3 py-1 border rounded text-red-600 flex items-center gap-2"
//                     >
//                       <FiTrash2 />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}

//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }






import React, { useEffect, useState } from "react"
import AllApi from "../services/AllApi"
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi"

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // form
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentId, setCurrentId] = useState(null)
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    rating: "",
    imgurl: "" // <-- exact image URL
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    setError("")
    const res = await AllApi.listProducts()
    if (res.success) {
      setProducts(res.data || [])
    } else {
      setError(res.error || "Failed to load products")
    }
    setLoading(false)
  }

  function openAddForm() {
    setIsEditing(false)
    setCurrentId(null)
    setForm({ name: "", price: "", description: "", rating: "", imgurl: "" })
    setShowForm(true)
  }

  function openEditForm(p) {
    setIsEditing(true)
    setCurrentId(p._id)
    setForm({
      name: p.name ?? "",
      price: p.price ?? "",
      description: p.description ?? "",
      rating: p.rating ?? "",
      imgurl: p.imgurl ?? "" // populate with existing exact URL
    })
    setShowForm(true)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submitForm(e) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // build JSON payload (imgurl is a string exact URL)
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        rating: parseFloat(form.rating),
        imgurl: form.imgurl // exact URL string
      }

      let res
      if (isEditing && currentId) {
        // send JSON to edit endpoint
        res = await AllApi.editProduct(currentId, payload, { isForm: false })
      } else {
        res = await AllApi.addProduct(payload, { isForm: false })
      }

      if (res.success) {
        await fetchProducts()
        setShowForm(false)
      } else {
        setError(res.error || (res.data && res.data.message) || "Operation failed")
      }
    } catch (err) {
      setError(err.message || "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return
    setLoading(true)
    const res = await AllApi.deleteProduct(id)
    if (res.success) {
      setProducts(prev => prev.filter(p => p._id !== id))
    } else {
      alert(res.error || "Failed to delete")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products Dashboard</h1>

        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl flex gap-2 items-center"
        >
          <FiPlus /> Add Product
        </button>
      </div>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {/* FORM */}
      {showForm && (
        <form onSubmit={submitForm} className="bg-white p-5 rounded-xl shadow mb-6 space-y-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm">Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm">Rating</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            <div>
              <label className="text-sm">Image URL (exact)</label>
              <input
                name="imgurl"
                value={form.imgurl}
                onChange={handleChange}
                placeholder="https://example.com/path/to/image.jpg"
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-xl flex items-center gap-2"
            >
              {isEditing ? <><FiEdit /> Update</> : <><FiPlus /> Create</>}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Description</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && products.length === 0 && (
              <tr><td colSpan="6" className="p-4">Loading...</td></tr>
            )}

            {!loading && products.length === 0 && (
              <tr><td colSpan="6" className="p-4">No products found.</td></tr>
            )}

            {products.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">
                  {p.imgurl ? (
                    // using the exact image URL stored in imgurl
                    <img src={p.imgurl} alt={p.name} className="w-20 h-20 object-cover rounded" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-xs">
                      No image
                    </div>
                  )}
                </td>

                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.rating}</td>
                <td className="p-3 max-w-xs truncate">{p.description}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="px-3 py-1 border rounded flex items-center gap-2"
                    >
                      <FiEdit />
                    </button>

                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 border rounded text-red-600 flex items-center gap-2"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  )
}




