import { useState } from 'react'
import { login } from '../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      window.location.href = '/'
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row bg-[#0b0b12] overflow-hidden">
      {/* Degradado fluido entre secciones */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b12] via-[#15152b] to-[#1a1735]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(100,80,255,0.25),transparent_70%)]" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] h-full bg-gradient-to-r from-transparent via-[#9b5cff]/10 to-transparent blur-3xl opacity-50" />

      {/* Sección izquierda - Login */}
      <section className="flex-1 flex flex-col justify-center px-8 md:px-16 relative z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#9b5cff]/20 to-[#5fb4ff]/10 rounded-full blur-3xl opacity-60" />

        <div className="z-10 relative max-w-md w-full mx-auto text-white">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] bg-clip-text text-transparent mb-3">
            Hostalium
          </h1>
          <p className="text-gray-400 mb-10 text-[15px] tracking-wide">
            Accede a tu panel de gestión
          </p>

          <form onSubmit={onSubmit} className="space-y-6" autoComplete="on">
            {error && <div className="text-sm text-red-400">{error}</div>}

            <div>
              <label htmlFor="email" className="block mb-2 text-sm opacity-90">Email</label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-400"
                placeholder="tu@email.com"
                name="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm opacity-90">Contraseña</label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-indigo-400"
                placeholder="••••••••"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] hover:opacity-90 transition-all duration-300 font-medium disabled:opacity-60 shadow-[0_0_25px_rgba(155,92,255,0.25)]"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>

            <p className="text-sm text-gray-400 mt-4 text-center hover:text-gray-300 cursor-pointer transition-colors">
              ¿Has olvidado tu contraseña?
            </p>
          </form>
        </div>
      </section>

      {/* Sección derecha - Mockup */}
      <section className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden backdrop-blur-[1px]">
        {/* Brillo radial detrás del mockup */}
        <div className="absolute w-[900px] h-[900px] bg-gradient-to-tr from-[#9b5cff]/25 to-[#5fb4ff]/15 rounded-full blur-3xl opacity-60 translate-x-[-2rem]" />
        {/* “Suelo” de luz */}
        <div className="absolute bottom-8 w-[600px] h-[200px] bg-gradient-to-t from-[#000]/40 to-transparent blur-3xl opacity-70 rounded-full" />
        {/* Mockup de la app */}
        <img
          src="/mockup3.png"
          alt="Mockup Hostalium"
          width="720"
          height="900"
          className="relative w-[720px] translate-x-[-3rem] drop-shadow-[0_0_55px_rgba(155,92,255,0.35)]"
          loading="lazy"
        />
      </section>
    </main>
  )
}
