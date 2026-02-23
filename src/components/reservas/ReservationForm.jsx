// src/components/ReservationForm.jsx
import React, { useEffect, useState } from 'react'
import { User, Phone, Mail, Users, Calendar, Clock, FileText } from 'lucide-react'
import ReservaSuccess from './ReservaSuccess.jsx'
import WaitlistSuccess from '../waitlist/WaitlistSuccess.jsx'
import { useNotifications } from '../../context/NotificationContext'
import { crearReserva, obtenerReservas } from '../../services/reservas'
import { validarEmail, validarTelefono, validarContacto, validarFechaFutura } from '../../utils/validators'

const todayStr = new Date().toISOString().split('T')[0]
const nowTimeStr = new Date().toTimeString().slice(0,5) // HH:MM

export default function ReservationForm() {
  const { showToast } = useNotifications()
  const [form, setForm] = useState({
    nombreCliente: '',
    telefono: '',
    email: '',
    numPersonas: 1,
    fecha: todayStr,
    hora: nowTimeStr,
    notas: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(null)
  const [isWaitlist, setIsWaitlist] = useState(false)
  const [_reservas, setReservas] = useState([]) // listado (no se lee directamente, solo se actualiza)

  // Fetch inicial: traer reservas existentes
  useEffect(() => {
    let mounted = true
    async function fetchReservas() {
      try {
        const list = await obtenerReservas()
        if (mounted) setReservas([...list].reverse()) // newest first (opcional)
      } catch (err) {
        console.error(err)
      }
    }
    fetchReservas()
    return () => { mounted = false }
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'numPersonas' ? (value === '' ? '' : Number(value)) : value
    }))
  }

  function validate() {
    const e = {}
    if (!form.nombreCliente || form.nombreCliente.trim().length < 2) e.nombreCliente = 'Introduce un nombre válido.'
    if (!form.numPersonas || form.numPersonas < 1) e.numPersonas = 'Indica al menos 1 persona.'
    if (!form.fecha) e.fecha = 'Selecciona una fecha.'
    else if (form.fecha < todayStr) e.fecha = 'La fecha debe ser hoy o en el futuro.'
    if (!form.hora) e.hora = 'Selecciona una hora.'
    
    // Validar que la fecha y hora combinadas no sean en el pasado
    if (form.fecha && form.hora && !validarFechaFutura(form.fecha, form.hora)) {
      e.fecha = 'La fecha y hora de la reserva debe ser futura. No se pueden crear reservas en el pasado.'
    }
    
    if (form.telefono && !validarTelefono(form.telefono)) e.telefono = 'Introduce un teléfono válido.'
    if (form.email && !validarEmail(form.email)) e.email = 'Introduce un email válido.'
    
    // Validar que al menos uno de los dos (teléfono o email) esté presente
    if (!validarContacto(form.telefono, form.email)) {
      e.telefono = 'Debes proporcionar al menos un teléfono o un email válido.'
    }
    
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length > 0) {
      setConfirmed(null)
      return
    }

    setLoading(true)
    try {
      const created = await crearReserva(form)
      // Detectar si es waitlist: el backend devuelve waitlist: true en la respuesta
      const isWaitlistEntry = created?.waitlist === true
      const isModoManual = created?.modoManual === true
      const mesaSugerida = created?.mesaSugerida
      
      console.log('🔍 ReservationForm - Respuesta del backend:', created)
      console.log('🔍 ReservationForm - ¿Es waitlist?', isWaitlistEntry)
      console.log('🔍 ReservationForm - ¿Es modo manual?', isModoManual)
      console.log('🔍 ReservationForm - Mesa sugerida:', mesaSugerida)
      
      setConfirmed(created)
      setIsWaitlist(isWaitlistEntry)

      // Mostrar notificación toast según el tipo
      if (isWaitlistEntry) {
        showToast(
          `¡${created.nombreCliente} agregado a la lista de espera!`,
          'success',
          5000,
          created
        )
      } else if (isModoManual) {
        // Modo manual: notificación informativa con mesa sugerida si existe
        let mensaje = `Reserva creada para ${created.nombreCliente}. `;
        if (mesaSugerida) {
          mensaje += `Se recomienda la mesa ${mesaSugerida.nombre} (${mesaSugerida.capacidad} personas). Puedes asignarla manualmente.`;
        } else {
          mensaje += 'No hay mesas disponibles para este horario. Puedes asignar una mesa manualmente o agregar a la lista de espera.';
        }
        showToast(
          mensaje,
          'info',
          7000,
          created
        )
      } else {
        // Modo automático: reserva creada normalmente
        showToast(
          `¡Reserva creada para ${created.nombreCliente}!`,
          'success',
          5000,
          created
        )
      }

      // Actualizar UI localmente solo si es reserva (no waitlist)
      if (!isWaitlistEntry) {
        setReservas(prev => [created, ...prev])
      }

      // Limpia formulario (opcional)
      setForm({ nombreCliente: '', telefono: '', email: '', numPersonas: 1, fecha: todayStr, hora: nowTimeStr, notas: '' })
      setErrors({})
    } catch (err) {
      console.error('Error guardando reserva:', err)
      // Mostrar toast de error
      showToast(
        err.message || 'No se pudo crear la reserva',
        'error',
        7000
      )
    } finally {
      setLoading(false)
    }
  }

  if (confirmed) {
    const handleNueva = () => {
      setConfirmed(null)
      setIsWaitlist(false)
    }
    
    if (isWaitlist) {
      return (
        <div className="card-wrap">
          <WaitlistSuccess waitlistEntry={confirmed} onNueva={handleNueva} />
        </div>
      )
    }
    
    return (
      <div className="card-wrap">
        <ReservaSuccess 
          reserva={confirmed} 
          onNueva={handleNueva}
          mesaSugerida={confirmed?.mesaSugerida}
          modoManual={confirmed?.modoManual}
        />
      </div>
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Sección: Información del cliente */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Información del cliente</h2>
          
          {/* Nombre */}
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
              <User size={14} />
              Nombre del cliente
            </label>
            <input
              name="nombreCliente"
              value={form.nombreCliente}
              onChange={handleChange}
              placeholder="Nombre y apellidos"
              className={`
                w-full p-2.5 rounded-lg
                bg-white/10 border text-white
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                transition-colors
                ${errors.nombreCliente ? 'border-red-400/50' : 'border-white/10'}
              `}
              autoComplete="name"
              required
            />
            {errors.nombreCliente && (
              <small className="text-red-400 text-xs mt-1 block">{errors.nombreCliente}</small>
            )}
          </div>

          {/* Teléfono y Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
                <Phone size={14} />
                Teléfono
              </label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className={`
                  w-full p-2.5 rounded-lg
                  bg-white/10 border text-white
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                  transition-colors
                  ${errors.telefono ? 'border-red-400/50' : 'border-white/10'}
                `}
                autoComplete="tel"
              />
              {errors.telefono && (
                <small className="text-red-400 text-xs mt-1 block">{errors.telefono}</small>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
                <Mail size={14} />
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className={`
                  w-full p-2.5 rounded-lg
                  bg-white/10 border text-white
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                  transition-colors
                  ${errors.email ? 'border-red-400/50' : 'border-white/10'}
                `}
                autoComplete="email"
              />
              {errors.email && (
                <small className="text-red-400 text-xs mt-1 block">{errors.email}</small>
              )}
            </div>
          </div>
        </div>

        {/* Sección: Detalles de la reserva */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Detalles de la reserva</h2>
          
          {/* Personas, Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
                <Users size={14} />
                Personas
              </label>
              <input
                name="numPersonas"
                type="number"
                min="1"
                value={form.numPersonas}
                onChange={handleChange}
                className={`
                  w-full p-2.5 rounded-lg
                  bg-white/10 border text-white
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                  transition-colors
                  ${errors.numPersonas ? 'border-red-400/50' : 'border-white/10'}
                `}
                required
              />
              {errors.numPersonas && (
                <small className="text-red-400 text-xs mt-1 block">{errors.numPersonas}</small>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
                <Calendar size={14} />
                Fecha
              </label>
              <input
                name="fecha"
                type="date"
                value={form.fecha}
                onChange={handleChange}
                className={`
                  w-full p-2.5 rounded-lg
                  bg-white/10 border text-white
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                  transition-colors
                  ${errors.fecha ? 'border-red-400/50' : 'border-white/10'}
                `}
                required
              />
              {errors.fecha && (
                <small className="text-red-400 text-xs mt-1 block">{errors.fecha}</small>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
                <Clock size={14} />
                Hora
              </label>
              <input
                name="hora"
                type="time"
                value={form.hora}
                onChange={handleChange}
                className={`
                  w-full p-2.5 rounded-lg
                  bg-white/10 border text-white
                  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                  transition-colors
                  ${errors.hora ? 'border-red-400/50' : 'border-white/10'}
                `}
                required
              />
              {errors.hora && (
                <small className="text-red-400 text-xs mt-1 block">{errors.hora}</small>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/40 mb-2">
              <FileText size={14} />
              Notas
            </label>
            <textarea
              name="notas"
              value={form.notas}
              onChange={handleChange}
              placeholder="Notas adicionales (opcional)"
              rows={3}
              className="
                w-full p-2.5 rounded-lg
                bg-white/10 border border-white/10 text-white
                resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                transition-colors
              "
            />
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-lg
            bg-gradient-to-r from-indigo-500 to-purple-500 text-white
            font-semibold shadow-lg
            transition disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? 'Guardando' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  )
}
