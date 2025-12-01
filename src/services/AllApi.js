





// src/api/AllApi.js
import baseurl from "./baseURL"
import axios from "axios"

/**
 * AllApi.js
 * - Matches backend routes you provided
 * - Automatically sends Authorization: Bearer <token> when localStorage.raynott_token exists
 * - Normalizes responses to { success, data, error, status }
 *
 * Backend routes used:
 * POST   /login
 * POST   /reg
 *
 * POST   /addproduct            (jwtprotected)   -> supports multipart/form-data (image)
 * GET    /listproducts
 * GET    /getproduct/:id
 * DELETE /deleteproduct/:id     (jwtprotected)
 * PUT    /editproduct/:id       (jwtprotected)   -> supports multipart/form-data or JSON
 *
 * POST   /createbooking
 * DELETE /cancelbooking/:id
 * GET    /getbooking
 * GET    /getbooking/:id
 *
 * NOTE: If your router is mounted under a prefix (e.g. /api), ensure baseURL includes that prefix.
 */

// axios instance
const api = axios.create({
  baseURL: baseurl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

// attach token if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("raynott_token")
    if (token) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore
  }
  return config
}, (err) => Promise.reject(err))

// helper to normalize responses/errors
async function safe(call) {
  try {
    const res = await call()
    return { success: true, data: res.data, status: res.status }
  } catch (err) {
    let error = "Network error"
    if (err.response && err.response.data) {
      if (typeof err.response.data === "string") error = err.response.data
      else error = err.response.data.message || err.response.data.error || JSON.stringify(err.response.data)
    } else if (err.message) {
      error = err.message
    }
    return { success: false, error, status: err.response?.status || null }
  }
}

/* ---------------------------
   Auth
   --------------------------- */

export async function login(payload) {
  return safe(() => api.post("/login", payload))
}

export async function register(payload) {
  return safe(() => api.post("/reg", payload))
}

/* ---------------------------
   Product endpoints
   --------------------------- */

export async function addProduct(data, options = { isForm: false }) {
  if (options.isForm) {
    // If sending FormData, let axios/browser set Content-Type (with boundary).
    return safe(() => api.post("/addproduct", data))
  }
  return safe(() => api.post("/addproduct", data))
}

export async function listProducts() {
  return safe(() => api.get("/listproducts"))
}

export async function getProduct(id) {
  return safe(() => api.get(`/getproduct/${encodeURIComponent(id)}`))
}

export async function deleteProduct(id) {
  return safe(() => api.delete(`/deleteproduct/${encodeURIComponent(id)}`))
}

export async function editProduct(id, data, options = { isForm: false }) {
  if (options.isForm) {
    return safe(() => api.put(`/editproduct/${encodeURIComponent(id)}`, data))
  }
  return safe(() => api.put(`/editproduct/${encodeURIComponent(id)}`, data))
}

/* ---------------------------
   Booking endpoints
   --------------------------- */

/**
 * POST /createbooking
 * payload: { productId, qty, userInfo, ... }  (shape according to your backend)
 */
export async function createBooking(payload) {
  return safe(() => api.post("/createbooking", payload))
}

/**
 * DELETE /cancelbooking/:id
 */
export async function cancelBooking(id) {
  return safe(() => api.delete(`/cancelbooking/${encodeURIComponent(id)}`))
}

/**
 * GET /getbooking
 * - get all bookings
 */
export async function getAllBookings() {
  return safe(() => api.get("/getbooking"))
}

/**
 * Alias for compatibility with existing code (MyBookings.jsx calls listBookings)
 */
export async function listBookings() {
  return getAllBookings()
}

/**
 * GET /getbooking/:id
 * - get a single booking by id
 */
export async function getBookingById(id) {
  return safe(() => api.get(`/getbooking/${encodeURIComponent(id)}`))
}

/* ---------------------------
   Helpers
   --------------------------- */

export function saveToken(token) {
  try {
    localStorage.setItem("raynott_token", token)
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } catch (e) { /* ignore */ }
}

export function clearToken() {
  try {
    localStorage.removeItem("raynott_token")
    delete api.defaults.headers.common["Authorization"]
  } catch (e) { /* ignore */ }
}

/* ---------------------------
   Export default grouped object
   --------------------------- */
const AllApi = {
  // auth
  login,
  register,
  saveToken,
  clearToken,

  // products
  addProduct,
  listProducts,
  getProduct,
  deleteProduct,
  editProduct,

  // bookings
  createBooking,
  cancelBooking,
  getAllBookings,
  listBookings,
  getBookingById,
}

export default AllApi
