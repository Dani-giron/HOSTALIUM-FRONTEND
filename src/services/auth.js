const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

export async function login(email, password) {
  const res = await fetch(`${BASE.replace(/\/$/, '')}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const json = await res.json()
  if (!res.ok || !json?.success) {
    throw new Error(json?.error || 'Login fallido')
  }
  setToken(json.data.token)
  return json.data
}
