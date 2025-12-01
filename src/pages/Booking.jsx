




// // src/pages/Booking.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useLocation, useNavigate } from "react-router-dom";
// import AllApi from "../services/AllApi";

// export default function Booking() {
//   const { productid } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   // product may be passed from ProductCard "Buy Now"
//   const [product, setProduct] = useState(location.state?.product || null);

//   const [loadingProduct, setLoadingProduct] = useState(!product);
//   const [errorProduct, setErrorProduct] = useState("");

//   // Booking form
//   const [form, setForm] = useState({
//     fullname: "",
//     countryRegion: "",
//     contactnumber: "",
//     address: ""
//   });

//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState({ type: "", text: "" });

//   // Toast notification state
//   const [toast, setToast] = useState({ visible: false, text: "" });
//   const toastTimerRef = useRef(null);

//   // --- Helpers: sanitize name + show/hide toast ---
//   function sanitizeName(name, max = 30) {
//     if (!name) return "";
//     // remove control characters, collapse whitespace, trim
//     const cleaned = String(name).replace(/[\x00-\x1F\x7F]/g, "").replace(/\s+/g, " ").trim();
//     if (!cleaned) return "";
//     return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
//   }

//   function showToast(text = "Booked successfully", productName) {
//     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

//     const name = sanitizeName(productName);
//     const finalText = name ? `${text} — ${name}` : text;

//     setToast({ visible: true, text: finalText });
//     toastTimerRef.current = setTimeout(() => {
//       setToast({ visible: false, text: "" });
//     }, 3000);
//   }

//   function hideToast() {
//     if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     setToast({ visible: false, text: "" });
//   }

//   // Fetch product if not passed
//   useEffect(() => {
//     let mounted = true;
//     if (product) {
//       setLoadingProduct(false);
//       return;
//     }

//     async function loadProduct() {
//       setLoadingProduct(true);
//       setErrorProduct("");
//       try {
//         const res = await AllApi.getProduct(productid);
//         console.log("getProduct response:", res);
//         if (res && res.success) {
//           // handle payload shape (res.data or res.data.data or direct)
//           const raw = res.data || res.data?.data || res;
//           if (mounted) setProduct(raw);
//         } else {
//           if (mounted) setErrorProduct(res?.error || "Unable to load product.");
//         }
//       } catch (err) {
//         console.error("Error loading product:", err);
//         if (mounted) setErrorProduct("Unexpected error loading product.");
//       } finally {
//         if (mounted) setLoadingProduct(false);
//       }
//     }

//     loadProduct();

//     return () => {
//       mounted = false;
//       if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
//     };
//   }, [product, productid]);

//   function updateField(e) {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   }

//   function validate() {
//     if (!form.fullname.trim()) return "Full name required.";
//     if (!form.countryRegion.trim()) return "Country/Region required.";
//     if (!String(form.contactnumber).trim()) return "Contact number required.";
//     if (!form.address.trim()) return "Address required.";
//     return "";
//   }

//   async function handleBooking(e) {
//     e.preventDefault();

//     const v = validate();
//     if (v) {
//       setMsg({ type: "error", text: v });
//       return;
//     }

//     setBusy(true);
//     setMsg({ type: "", text: "" });

//     const payload = {
//       fullname: form.fullname,
//       countryRegion: form.countryRegion,
//       contactnumber: form.contactnumber,
//       address: form.address,
//       // include productId for backend reference (your controller should accept it)
//       productId: product?._id || productid
//     };

//     console.log("Booking payload:", payload);

//     try {
//       const res = await AllApi.createBooking(payload);
//       console.log("Booking response:", res);

//       if (res && res.success) {
//         // Use sanitized product name in toast
//         const prodName = product?.name || product?.title || "";
//         showToast("Booking successful", prodName);

//         setMsg({ type: "success", text: "Booking created successfully!" });

//         // clear form (optional)
//         setForm({ fullname: "", countryRegion: "", contactnumber: "", address: "" });

//         // navigate to mybookings after short delay so user sees toast
//         setTimeout(() => navigate("/mybookings"), 1200);
//       } else {
//         setMsg({ type: "error", text: res?.error || "Booking failed." });
//       }
//     } catch (err) {
//       console.error("Booking error:", err);
//       setMsg({ type: "error", text: "Unexpected server error." });
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <main className="max-w-4xl mx-auto p-6">
//       {/* Toast (top-right) */}
//       {toast.visible && (
//         <div role="status" aria-live="polite" className="fixed top-6 right-6 z-50 w-full max-w-xs">
//           <div className="bg-green-600 text-white rounded-lg shadow-lg p-3 flex items-start gap-3">
//             <div className="flex-1 text-sm">{toast.text}</div>
//             <button
//               onClick={hideToast}
//               className="text-white opacity-90 hover:opacity-100 px-2 py-1"
//               aria-label="Close notification"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Product Preview */}
//         <div className="rounded-xl p-4 bg-white shadow border">
//           {loadingProduct ? (
//             <p>Loading product...</p>
//           ) : errorProduct ? (
//             <p className="text-red-600">{errorProduct}</p>
//           ) : product ? (
//             <>
//               <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded mb-4 overflow-hidden">
//                 <img
//                   src={
//                     product.imgurl ||
//                     product.image ||
//                     product.img ||
//                     `https://picsum.photos/seed/${encodeURIComponent(product.name || product.title || "prod")}/600/400`
//                   }
//                   alt={product.name || product.title}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </div>

//               <h2 className="text-2xl font-semibold">{product.name || product.title}</h2>
//               <p className="text-gray-600 mt-2">{product.description}</p>

//               <div className="mt-3 text-indigo-600 font-bold text-xl">
//                 ₹ {product.price ?? "—"}
//               </div>
//             </>
//           ) : (
//             <p>No product found</p>
//           )}
//         </div>

//         {/* Booking Form */}
//         <div className="rounded-xl p-6 bg-white shadow border">
//           <h3 className="text-xl font-semibold mb-3">Complete Your Booking</h3>

//           <form onSubmit={handleBooking} className="space-y-3">
//             <div>
//               <label className="text-sm block">Full Name</label>
//               <input
//                 name="fullname"
//                 value={form.fullname}
//                 onChange={updateField}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm block">Country / Region</label>
//               <input
//                 name="countryRegion"
//                 value={form.countryRegion}
//                 onChange={updateField}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm block">Contact Number</label>
//               <input
//                 name="contactnumber"
//                 type="text"
//                 value={form.contactnumber}
//                 onChange={updateField}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             <div>
//               <label className="text-sm block">Address</label>
//               <textarea
//                 name="address"
//                 value={form.address}
//                 onChange={updateField}
//                 className="w-full p-2 border rounded"
//               />
//             </div>

//             {msg.text && (
//               <p className={msg.type === "error" ? "text-red-600" : "text-green-600"}>
//                 {msg.text}
//               </p>
//             )}

//             <div className="flex gap-3 mt-2">
//               <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
//                 Back
//               </button>

//               <button
//                 type="submit"
//                 disabled={busy}
//                 className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
//               >
//                 {busy ? "Booking..." : "Create Booking"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }








// src/pages/Booking.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import AllApi from "../services/AllApi";

export default function Booking() {
  const { productid } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // product may be passed from ProductCard "Buy Now"
  const [product, setProduct] = useState(location.state?.product || null);

  const [loadingProduct, setLoadingProduct] = useState(!product);
  const [errorProduct, setErrorProduct] = useState("");

  // Booking form
  const [form, setForm] = useState({
    fullname: "",
    countryRegion: "",
    contactnumber: "",
    address: ""
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Toast notification state
  const [toast, setToast] = useState({ visible: false, text: "" });
  const toastTimerRef = useRef(null);

  // --- Helpers: sanitize name + show/hide toast ---
  function sanitizeName(name, max = 30) {
    if (!name) return "";
    // remove control characters, collapse whitespace, trim
    const cleaned = String(name).replace(/[\x00-\x1F\x7F]/g, "").replace(/\s+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned.length > max ? cleaned.slice(0, max - 1) + "…" : cleaned;
  }

  function showToast(text = "Booked successfully", productName) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);

    const name = sanitizeName(productName);
    const finalText = name ? `${text} — ${name}` : text;

    setToast({ visible: true, text: finalText });
    toastTimerRef.current = setTimeout(() => {
      setToast({ visible: false, text: "" });
    }, 3000);
  }

  function hideToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ visible: false, text: "" });
  }

  // Fetch product if not passed
  useEffect(() => {
    let mounted = true;
    if (product) {
      setLoadingProduct(false);
      return;
    }

    async function loadProduct() {
      setLoadingProduct(true);
      setErrorProduct("");
      try {
        const res = await AllApi.getProduct(productid);
        console.log("getProduct response:", res);
        if (res && res.success) {
          // handle payload shape (res.data or res.data.data or direct)
          const raw = res.data || (res.data && res.data.data) || res;
          if (mounted) setProduct(raw);
        } else {
          if (mounted) setErrorProduct(res?.error || "Unable to load product.");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        if (mounted) setErrorProduct("Unexpected error loading product.");
      } finally {
        if (mounted) setLoadingProduct(false);
      }
    }

    loadProduct();

    return () => {
      mounted = false;
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [product, productid]);

  function updateField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    if (!form.fullname.trim()) return "Full name required.";
    if (!form.countryRegion.trim()) return "Country/Region required.";
    if (!String(form.contactnumber).trim()) return "Contact number required.";
    if (!form.address.trim()) return "Address required.";
    return "";
  }

  async function handleBooking(e) {
    e.preventDefault();

    const v = validate();
    if (v) {
      setMsg({ type: "error", text: v });
      return;
    }

    setBusy(true);
    setMsg({ type: "", text: "" });

    const payload = {
      fullname: form.fullname,
      countryRegion: form.countryRegion,
      contactnumber: form.contactnumber,
      address: form.address,
      // include productId for backend reference (your controller should accept it)
      productId: product?._id || productid
    };

    console.log("Booking payload:", payload);

    try {
      const res = await AllApi.createBooking(payload);
      console.log("Booking response:", res);

      if (res && res.success) {
        // Extract created booking from common shapes: res.data.booking or res.data
        const created = (res.data && (res.data.booking || res.data)) || null;

        // Use sanitized product name in toast
        const prodName = product?.name || product?.title || "";
        showToast("Booking successful", prodName);

        setMsg({ type: "success", text: "Booking created successfully!" });

        // clear form (optional)
        setForm({ fullname: "", countryRegion: "", contactnumber: "", address: "" });

        // navigate to mybookings and pass created booking so that page can update instantly
        navigate("/mybookings", {
          state: { refresh: true, createdBooking: created },
        });

        // done — don't continue to old setTimeout flow
        return;
      } else {
        setMsg({ type: "error", text: res?.error || "Booking failed." });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setMsg({ type: "error", text: "Unexpected server error." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Toast (top-right) */}
      {toast.visible && (
        <div role="status" aria-live="polite" className="fixed top-6 right-6 z-50 w-full max-w-xs">
          <div className="bg-green-600 text-white rounded-lg shadow-lg p-3 flex items-start gap-3">
            <div className="flex-1 text-sm">{toast.text}</div>
            <button
              onClick={hideToast}
              className="text-white opacity-90 hover:opacity-100 px-2 py-1"
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Preview */}
        <div className="rounded-xl p-4 bg-white shadow border">
          {loadingProduct ? (
            <p>Loading product...</p>
          ) : errorProduct ? (
            <p className="text-red-600">{errorProduct}</p>
          ) : product ? (
            <>
              <div className="w-full h-72 flex items-center justify-center bg-gray-100 rounded mb-4 overflow-hidden">
                <img
                  src={
                    product.imgurl ||
                    product.image ||
                    product.img ||
                    `https://picsum.photos/seed/${encodeURIComponent(product.name || product.title || "prod")}/600/400`
                  }
                  alt={product.name || product.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <h2 className="text-2xl font-semibold">{product.name || product.title}</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>

              <div className="mt-3 text-indigo-600 font-bold text-xl">
                ₹ {product.price ?? "—"}
              </div>
            </>
          ) : (
            <p>No product found</p>
          )}
        </div>

        {/* Booking Form */}
        <div className="rounded-xl p-6 bg-white shadow border">
          <h3 className="text-xl font-semibold mb-3">Complete Your Booking</h3>

          <form onSubmit={handleBooking} className="space-y-3">
            <div>
              <label className="text-sm block">Full Name</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm block">Country / Region</label>
              <input
                name="countryRegion"
                value={form.countryRegion}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm block">Contact Number</label>
              <input
                name="contactnumber"
                type="text"
                value={form.contactnumber}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="text-sm block">Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={updateField}
                className="w-full p-2 border rounded"
              />
            </div>

            {msg.text && (
              <p className={msg.type === "error" ? "text-red-600" : "text-green-600"}>
                {msg.text}
              </p>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
                Back
              </button>

              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {busy ? "Booking..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
