import React from 'react'
import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { formatearHora, extraerFechaHora } from '../../utils/dateFormatter'

export default function WaitlistSuccess({ waitlistEntry, onNueva }) {
  const fechaDeseada = new Date(waitlistEntry.fechaDeseada)
  const { fecha: fechaStr } = extraerFechaHora(waitlistEntry.fechaDeseada)
  const [year, month, day] = fechaStr.split('-')
  const fechaFormateada = `${day}/${month}/${year}`
  const horaFormateada = formatearHora(waitlistEntry.fechaDeseada)
  const horaLlegadaFormateada = formatearHora(waitlistEntry.horaLlegada)

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(249, 115, 22, 0.2))',
          border: '2px solid rgba(251, 191, 36, 0.4)',
          marginBottom: '16px'
        }}>
          <Clock className="text-yellow-400" size={32} />
        </div>
      </div>
      
      <h1 className="card-title" style={{ 
        background: 'linear-gradient(135deg, #fbbf24, #f97316)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ¡Agregado a la Lista de Espera!
      </h1>
      
      <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.9)', fontSize: '18px', fontWeight: 500 }}>
        <strong>{waitlistEntry.nombreCliente}</strong> — {waitlistEntry.numPersonas} {waitlistEntry.numPersonas === 1 ? 'persona' : 'personas'}
      </p>
      
      <div style={{ 
        marginTop: 16, 
        padding: '12px 20px',
        background: 'rgba(251, 191, 36, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        display: 'inline-block'
      }}>
        <p style={{ margin: '4px 0', color: 'rgba(255,255,255,0.85)' }}>
          <strong>Fecha deseada:</strong> {fechaFormateada} a las {horaFormateada}
        </p>
        <p style={{ margin: '4px 0', color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>
          <strong>Hora de llegada:</strong> {horaLlegadaFormateada}
        </p>
      </div>
      
      {waitlistEntry.preferencias && (
        <p style={{ marginTop: 12, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
          "{waitlistEntry.preferencias}"
        </p>
      )}


      <p style={{ 
        marginTop: 20, 
        color: 'rgba(251, 191, 36, 0.9)', 
        fontSize: '14px',
        fontWeight: 500
      }}>
        El cliente será asignado automáticamente cuando haya una mesa disponible
      </p>

      <div style={{ display:'flex', gap: 12, justifyContent:'center', marginTop: 24 }}>
        <button className="btn-confirm" onClick={onNueva}>Nueva reserva</button>
        <Link to="/waitlist" className="btn-secondary">Ver lista de espera</Link>
      </div>
    </div>
  )
}

