import { API_URL } from '../config/api.js';

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
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
