import React from 'react'
import { Link } from 'react-router-dom'
import { formatearFechaLocalizada } from '../../utils/dateFormatter'
import { Info } from 'lucide-react'

export default function ReservaSuccess({ reserva, onNueva, mesaSugerida, modoManual }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <h1 className="card-title">¡Reserva creada!</h1>
      <p style={{ marginTop: 8, color: 'rgba(255,255,255,0.85)' }}>
        <strong>{reserva.nombreCliente}</strong> — {reserva.numPersonas} personas
      </p>
      <p style={{ marginTop: 4, color: 'rgba(255,255,255,0.85)' }}>
        {formatearFechaLocalizada(reserva.fecha)}
      </p>
      {reserva.notas && (
        <p style={{ marginTop: 4, color: 'rgba(255,255,255,0.8)' }}>Notas: {reserva.notas}</p>
      )}
      
      {/* Información sobre mesa sugerida en modo manual */}
      {modoManual && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: 'rgba(99, 102, 241, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          textAlign: 'left'
        }}>
          <Info size={18} style={{ color: '#a5b4fc', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1 }}>
            {mesaSugerida ? (
              <>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: '14px' }}>
                  Mesa recomendada: <strong>{mesaSugerida.nombre}</strong>
                </p>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  Capacidad: {mesaSugerida.capacidad} personas • Ubicación: {mesaSugerida.ubicacion}
                </p>
                <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                  Puedes asignar esta mesa manualmente desde la lista de reservas.
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: '14px' }}>
                  Sin mesa asignada
                </p>
                <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '13px' }}>
                  No hay mesas disponibles para este horario. Puedes asignar una mesa manualmente o agregar a la lista de espera.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap: 12, justifyContent:'center', marginTop: 16 }}>
        <button className="btn-confirm" onClick={onNueva}>Nueva reserva</button>
        <Link to="/reservas" className="btn-secondary">Ver reservas</Link>
      </div>
    </div>
  )
}
