

// // src/pages/Auth.jsx
// import React, { useState, useMemo } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { FiEye, FiEyeOff, FiCheckCircle, FiUser, FiMail, FiLock } from 'react-icons/fi'
// import AllApi from "../services/AllApi"

// const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// function getPwStrength(pw) {
//   let s = 0
//   if (pw.length >= 8) s++
//   if (/[A-Z]/.test(pw)) s++
//   if (/[0-9]/.test(pw)) s++
//   if (/[^A-Za-z0-9]/.test(pw)) s++
//   return s
// }

// export default function Auth() {
//   const navigate = useNavigate()
//   const [isRegister, setIsRegister] = useState(false)
//   const [form, setForm] = useState({ name: '', email: '', password: '' }) // UI field "name" maps to backend "username"
//   const [showPw, setShowPw] = useState(false)
//   const [msg, setMsg] = useState({ type: '', text: '' }) // type: error | success | info
//   const [loading, setLoading] = useState(false)

//   const pwScore = useMemo(() => getPwStrength(form.password), [form.password])
//   const pwLabels = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent']
//   const pwPercent = (pwScore / 4) * 100

//   // set session in a shape your frontend expects (username + email)
//   const setSession = (user) => {
//     try {
//       const session = { username: user.username || user.name || user.username, email: user.email }
//       localStorage.setItem('raynott_session', JSON.stringify(session))
//       console.log('Session stored:', session)
//     } catch (e) {
//       console.error('Failed to set session', e)
//     }
//   }

//   // local fallback store used earlier (keeps demo behavior)
//   const saveUserLocal = (u) => {
//     try {
//       localStorage.setItem('raynott_user', JSON.stringify(u))
//     } catch (e) { /* ignore */ }
//   }
//   const getUserLocal = () => {
//     try { return JSON.parse(localStorage.getItem('raynott_user') || 'null') } catch { return null }
//   }

//   function update(e) {
//     setForm({ ...form, [e.target.name]: e.target.value })
//     if (msg.type) setMsg({ type: '', text: '' })
//   }

//   function validate() {
//     if (isRegister && !form.name.trim()) return 'Full name is required.'
//     if (!EMAIL_RE.test(form.email)) return 'Enter a valid email.'
//     if (form.password.length < 6) return 'Password must be at least 6 characters.'
//     return ''
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()
//     const v = validate()
//     if (v) {
//       setMsg({ type: 'error', text: v })
//       return
//     }

//     setLoading(true)
//     setMsg({ type: '', text: '' })

//     // IMPORTANT: backend expects `username` field (per your userModel)
//     const payloadForRegister = {
//       username: form.name.trim(),
//       email: form.email.trim().toLowerCase(),
//       password: form.password
//     }

//     const payloadForLogin = {
//       email: form.email.trim().toLowerCase(),
//       password: form.password
//     }

//     try {
//       if (isRegister) {
//         console.log('Register request payload:', payloadForRegister)
//         const resp = await AllApi.register(payloadForRegister)
//         console.log('Register response:', resp)

//         if (!resp.success) {
//           // show backend error when available
//           setMsg({ type: 'error', text: resp.error || 'Registration failed' })
//           setLoading(false)
//           return
//         }

//         // If backend returns data, inspect it and save token if present
//         const returned = resp.data || resp.data?.data || null
//         const backendUser = (returned && (returned.user || returned.data || returned)) || null
//         const token = resp.data?.token || (returned && returned.token) || null

//         if (token && AllApi.saveToken) {
//           AllApi.saveToken(token)
//           console.log('Token saved on register:', token)
//         }

//         const finalUser = backendUser && backendUser.email
//           ? backendUser
//           : { username: payloadForRegister.username, email: payloadForRegister.email }

//         // store session and local fallback
//         setSession(finalUser)
//         try { saveUserLocal({ username: finalUser.username, email: finalUser.email, password: form.password }) } catch (e) { console.error(e) }

//         // IMPORTANT: go to login page (do not auto-login)
//         setMsg({ type: 'success', text: 'Account created — please sign in.' })
//         setLoading(false)
//         // switch to login view
//         setIsRegister(false)
//         // clear password for safety
//         setForm(prev => ({ ...prev, password: '' }))
//         // keep email filled so user can login quickly
//         // ensure console shows confirmation
//         console.log('Registration successful, redirecting to login view')
//         return
//       } else {
//         // LOGIN
//         console.log('Login request payload:', payloadForLogin)
//         const resp = await AllApi.login(payloadForLogin)
//         console.log('Login response:', resp)

//         if (!resp.success) {
//           // fallback to local demo user if backend doesn't exist or rejects
//           const local = getUserLocal()
//           if (local && local.email === payloadForLogin.email && local.password === payloadForLogin.password) {
//             setSession(local)
//             setMsg({ type: 'success', text: 'Logged in (local demo) successfully!' })
//             setLoading(false)
//             console.log('Local demo login successful:', local)
//             setTimeout(() => navigate('/dashboard'), 700)
//             return
//           }

//           setMsg({ type: 'error', text: resp.error || 'Login failed' })
//           setLoading(false)
//           return
//         }

//         // success from backend
//         const returned = resp.data || resp.data?.data || null
//         const backendUser = (returned && (returned.user || returned.data || returned)) || null
//         const token = resp.data?.token || (returned && returned.token) || null

//         if (token && AllApi.saveToken) {
//           AllApi.saveToken(token)
//           console.log('Token saved on login:', token)
//         }

//         const finalUser = backendUser && backendUser.email
//           ? backendUser
//           : (getUserLocal() || { username: backendUser?.username || '', email: payloadForLogin.email })

//         setSession(finalUser)
//         setMsg({ type: 'success', text: 'Logged in successfully!' })
//         setLoading(false)
//         console.log('Login successful, navigating to /dashboard. user:', finalUser)
//         setTimeout(() => navigate('/dashboard'), 700)
//         return
//       }
//     } catch (err) {
//       console.error('Unexpected error:', err)
//       setMsg({ type: 'error', text: (err && err.message) || 'Unexpected error' })
//       setLoading(false)
//     }
//   }

//   return (
//     <main className="min-h-[80vh] flex items-center justify-center px-4 py-10">
//       <div className="w-full max-w-md bg-white shadow-xl border rounded-2xl p-8">
//         <h1 className="text-2xl font-bold mb-1">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
//         <p className="text-gray-500 text-sm mb-6">
//           {isRegister ? 'Join Raynott to track orders & save bookings.' : 'Sign in to continue.'}
//         </p>

//         <form className="space-y-4" onSubmit={handleSubmit} noValidate>
//           {isRegister && (
//             <div>
//               <label className="text-sm font-medium mb-1 flex items-center gap-2">
//                 <FiUser className="text-indigo-500" /> Full Name
//               </label>
//               <input
//                 name="name"
//                 value={form.name}
//                 onChange={update}
//                 placeholder="Your full name"
//                 className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200"
//               />
//             </div>
//           )}

//           <div>
//             <label className="text-sm font-medium mb-1 flex items-center gap-2">
//               <FiMail className="text-indigo-500" /> Email
//             </label>
//             <input
//               name="email"
//               value={form.email}
//               onChange={update}
//               placeholder="you@example.com"
//               inputMode="email"
//               className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200"
//             />
//           </div>

//           <div className="relative">
//             <label className="text-sm font-medium mb-1 flex items-center gap-2">
//               <FiLock className="text-indigo-500" /> Password
//             </label>
//             <input
//               name="password"
//               type={showPw ? 'text' : 'password'}
//               value={form.password}
//               onChange={update}
//               placeholder="Minimum 6 characters"
//               className="w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-indigo-200"
//             />
//             <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-10 text-gray-500">
//               {showPw ? <FiEyeOff /> : <FiEye />}
//             </button>

//             {form.password.length > 0 && (
//               <div className="mt-2">
//                 <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//                   <div className={`h-full transition-all ${pwColor(pwScore)}`} style={{ width: pwPercent + '%' }} />
//                 </div>
//                 <p className="text-xs text-gray-500 mt-1">{pwLabels[pwScore]}</p>
//               </div>
//             )}
//           </div>

//           {msg.text && (
//             <div className={`text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600 flex items-center gap-2'}`}>
//               {msg.type === 'success' && <FiCheckCircle />}
//               {msg.text}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:brightness-95 disabled:opacity-50 transition"
//           >
//             {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
//           </button>

//           <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
//             <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
//             <button
//               type="button"
//               className="text-indigo-600 underline"
//               onClick={() => {
//                 setIsRegister(v => !v)
//                 setForm({ name: '', email: '', password: '' })
//                 setMsg({ type: '', text: '' })
//               }}
//             >
//               {isRegister ? 'Sign In' : 'Register'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   )
// }

// function pwColor(score) {
//   if (score <= 1) return 'bg-red-400'
//   if (score === 2) return 'bg-yellow-400'
//   if (score === 3) return 'bg-green-400'
//   return 'bg-green-600'
// }




// src/pages/Auth.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiCheckCircle, FiUser, FiMail, FiLock } from 'react-icons/fi'
import AllApi from "../services/AllApi"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getPwStrength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

export default function Auth() {
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' }) // UI field "name" maps to backend "username"
  const [showPw, setShowPw] = useState(false)
  const [msg, setMsg] = useState({ type: '', text: '' }) // type: error | success | info
  const [loading, setLoading] = useState(false)

  // Toast state
  const [toast, setToast] = useState({ visible: false, text: '' })
  const toastTimerRef = useRef(null)
  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current) }, [])

  const pwScore = useMemo(() => getPwStrength(form.password), [form.password])
  const pwLabels = ['Too short', 'Weak', 'Okay', 'Strong', 'Excellent']
  const pwPercent = (pwScore / 4) * 100

  // set session in a shape your frontend expects (username + email)
  const setSession = (user) => {
    try {
      const session = { username: user.username || user.name || user.username, email: user.email }
      localStorage.setItem('raynott_session', JSON.stringify(session))
      console.log('Session stored:', session)
    } catch (e) {
      console.error('Failed to set session', e)
    }
  }

  // local fallback store used earlier (keeps demo behavior)
  const saveUserLocal = (u) => {
    try {
      localStorage.setItem('raynott_user', JSON.stringify(u))
    } catch (e) { /* ignore */ }
  }
  const getUserLocal = () => {
    try { return JSON.parse(localStorage.getItem('raynott_user') || 'null') } catch { return null }
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (msg.type) setMsg({ type: '', text: '' })
  }

  function validate() {
    if (isRegister && !form.name.trim()) return 'Full name is required.'
    if (!EMAIL_RE.test(form.email)) return 'Enter a valid email.'
    if (form.password.length < 6) return 'Password must be at least 6 characters.'
    return ''
  }

  // Toast helpers
  function showToast(text = '') {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ visible: true, text })
    toastTimerRef.current = setTimeout(() => setToast({ visible: false, text: '' }), 3000)
  }
  function hideToast() {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ visible: false, text: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const v = validate()
    if (v) {
      setMsg({ type: 'error', text: v })
      return
    }

    setLoading(true)
    setMsg({ type: '', text: '' })

    // IMPORTANT: backend expects `username` field (per your userModel)
    const payloadForRegister = {
      username: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password
    }

    const payloadForLogin = {
      email: form.email.trim().toLowerCase(),
      password: form.password
    }

    try {
      if (isRegister) {
        console.log('Register request payload:', payloadForRegister)
        const resp = await AllApi.register(payloadForRegister)
        console.log('Register response:', resp)

        if (!resp.success) {
          // show backend error when available
          setMsg({ type: 'error', text: resp.error || 'Registration failed' })
          setLoading(false)
          return
        }

        // If backend returns data, inspect it and save token if present
        const returned = resp.data || resp.data?.data || null
        const backendUser = (returned && (returned.user || returned.data || returned)) || null
        const token = resp.data?.token || (returned && returned.token) || null

        if (token && AllApi.saveToken) {
          AllApi.saveToken(token)
          console.log('Token saved on register:', token)
        }

        const finalUser = backendUser && backendUser.email
          ? backendUser
          : { username: payloadForRegister.username, email: payloadForRegister.email }

        // store session and local fallback
        setSession(finalUser)
        try { saveUserLocal({ username: finalUser.username, email: finalUser.email, password: form.password }) } catch (e) { console.error(e) }

        // IMPORTANT: go to login page (do not auto-login)
        setMsg({ type: 'success', text: 'Account created — please sign in.' })
        setLoading(false)
        // switch to login view
        setIsRegister(false)
        // clear password for safety
        setForm(prev => ({ ...prev, password: '' }))

        // show toast confirmation
        showToast('Account created — please sign in')
        console.log('Registration successful, switched to login view')
        return
      } else {
        // LOGIN
        console.log('Login request payload:', payloadForLogin)
        const resp = await AllApi.login(payloadForLogin)
        console.log('Login response:', resp)

        if (!resp.success) {
          // fallback to local demo user if backend doesn't exist or rejects
          const local = getUserLocal()
          if (local && local.email === payloadForLogin.email && local.password === payloadForLogin.password) {
            setSession(local)
            setMsg({ type: 'success', text: 'Logged in (local demo) successfully!' })
            setLoading(false)
            console.log('Local demo login successful:', local)
            showToast('Logged in (demo) successfully')
            setTimeout(() => navigate('/dashboard'), 700)
            return
          }

          setMsg({ type: 'error', text: resp.error || 'Login failed' })
          setLoading(false)
          // show toast for error
          showToast(resp.error || 'Login failed')
          return
        }

        // success from backend
        const returned = resp.data || resp.data?.data || null
        const backendUser = (returned && (returned.user || returned.data || returned)) || null
        const token = resp.data?.token || (returned && returned.token) || null

        if (token && AllApi.saveToken) {
          AllApi.saveToken(token)
          console.log('Token saved on login:', token)
        }

        const finalUser = backendUser && backendUser.email
          ? backendUser
          : (getUserLocal() || { username: backendUser?.username || '', email: payloadForLogin.email })

        setSession(finalUser)
        setMsg({ type: 'success', text: 'Logged in successfully!' })
        setLoading(false)
        console.log('Login successful, navigating to /dashboard. user:', finalUser)

        // show toast and navigate
        showToast('Logged in successfully')
        setTimeout(() => navigate('/dashboard'), 700)
        return
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setMsg({ type: 'error', text: (err && err.message) || 'Unexpected error' })
      setLoading(false)
      showToast((err && err.message) || 'Unexpected error')
    }
  }

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      {/* Toast (top-right) */}
      {toast.visible && (
        <div role="status" aria-live="polite" className="fixed top-6 right-6 z-50 w-full max-w-xs">
          <div className="bg-indigo-600 text-white rounded-lg shadow-lg p-3 flex items-start gap-3">
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

      <div className="w-full max-w-md bg-white shadow-xl border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-1">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {isRegister ? 'Join Raynott to track orders & save bookings.' : 'Sign in to continue.'}
        </p>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <div>
              <label className="text-sm font-medium mb-1 flex items-center gap-2">
                <FiUser className="text-indigo-500" /> Full Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={update}
                placeholder="Your full name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1 flex items-center gap-2">
              <FiMail className="text-indigo-500" /> Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={update}
              placeholder="you@example.com"
              inputMode="email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium mb-1 flex items-center gap-2">
              <FiLock className="text-indigo-500" /> Password
            </label>
            <input
              name="password"
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={update}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border rounded-lg pr-12 focus:ring-2 focus:ring-indigo-200"
            />
            <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-10 text-gray-500">
              {showPw ? <FiEyeOff /> : <FiEye />}
            </button>

            {form.password.length > 0 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${pwColor(pwScore)}`} style={{ width: pwPercent + '%' }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{pwLabels[pwScore]}</p>
              </div>
            )}
          </div>

          {msg.text && (
            <div className={`text-sm ${msg.type === 'error' ? 'text-red-600' : 'text-green-600 flex items-center gap-2'}`}>
              {msg.type === 'success' && <FiCheckCircle />}
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:brightness-95 disabled:opacity-50 transition"
          >
            {loading ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
          </button>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              className="text-indigo-600 underline"
              onClick={() => {
                setIsRegister(v => !v)
                setForm({ name: '', email: '', password: '' })
                setMsg({ type: '', text: '' })
              }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

function pwColor(score) {
  if (score <= 1) return 'bg-red-400'
  if (score === 2) return 'bg-yellow-400'
  if (score === 3) return 'bg-green-400'
  return 'bg-green-600'
}
