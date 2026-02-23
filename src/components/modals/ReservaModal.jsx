import React, { useState } from 'react';
import { Calendar, Users, User, Phone, Mail, FileText, CheckCircle, Info, Check } from 'lucide-react';
import { formatearFechaCorta, formatearFechaLarga } from '../../utils/dateFormatter';
import { asignarMesaAReserva } from '../../services/reservas';
import { useNotifications } from '../../context/NotificationContext';
import Modal, { ModalField, ModalAlert, ModalButton } from '../common/Modal';

export default function ReservaModal({ reserva, onClose, onNueva }) {
  const { showToast } = useNotifications();
  const [asignando, setAsignando] = useState(false);
  
  if (!reserva) return null;

  // La mesa sugerida puede venir directamente en el objeto reserva (desde el toast)
  const mesaSugerida = reserva.mesaSugerida;
  const modoManual = reserva.modoManual;

  // Formatear la fecha - extraer la fecha del objeto reserva (puede venir como reserva.fecha)
  // Si formatearFechaLarga funciona con el objeto completo, extraer la fecha de ahí
  let fechaParaFormatear = reserva?.fecha;
  
  // Si no hay fecha directa, intentar obtenerla del objeto usando formatearFechaLarga
  // pero solo para validar que existe, luego usar formatearFechaCorta
  if (!fechaParaFormatear && reserva) {
    // El objeto reserva puede tener la fecha en diferentes lugares
    // Intentar con formatearFechaLarga primero para validar
    const fechaLarga = formatearFechaLarga(reserva);
    if (fechaLarga !== '—' && reserva.fecha) {
      fechaParaFormatear = reserva.fecha;
    }
  }
  
  // Usar formatearFechaCorta con la fecha extraída
  const fechaFormateada = formatearFechaCorta(fechaParaFormatear);

  const handleAsignarMesaSugerida = async () => {
    if (!mesaSugerida || !reserva.id) return;
    
    setAsignando(true);
    try {
      await asignarMesaAReserva(reserva.id, mesaSugerida.id);
      showToast(
        `Mesa ${mesaSugerida.nombre} asignada a la reserva de ${reserva.nombreCliente}`,
        'success',
        5000
      );
      // Cerrar el modal después de asignar
      setTimeout(() => {
        onClose();
        // Recargar la página para actualizar la lista de reservas
        if (window.location.pathname === '/reservas') {
          window.location.reload();
        }
      }, 1000);
    } catch (err) {
      console.error('Error asignando mesa:', err);
      showToast(
        err.message || 'Error al asignar la mesa',
        'error',
        5000
      );
    } finally {
      setAsignando(false);
    }
  };

  return (
    <Modal
      isOpen={!!reserva}
      onClose={onClose}
      title="Nueva Reserva"
      subtitle="Notificación"
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-3">
          <ModalButton variant="secondary" onClick={onClose}>
            Cerrar
          </ModalButton>
          <ModalButton variant="primary" onClick={onNueva}>
            Ver detalles
          </ModalButton>
        </div>
      }
    >
      <div className="flex items-center gap-3 mb-4 -mt-2">
        <CheckCircle className="text-green-400" size={24} />
      </div>

      <div className="space-y-3">
        <ModalField label="Cliente" value={reserva.nombreCliente} icon={User} />
        <ModalField label="Personas" value={reserva.numPersonas} icon={Users} />
        <ModalField label="Fecha y hora" value={fechaFormateada} icon={Calendar} />

        {reserva.mesa && (
          <ModalField 
            label="Mesa" 
            value={`${reserva.mesa.nombre} · Capacidad: ${reserva.mesa.capacidad} personas · ${reserva.mesa.ubicacion || 'N/A'}`} 
          />
        )}

        {/* Información sobre mesa sugerida en modo manual */}
        {modoManual && mesaSugerida && !reserva.mesa && (
          <ModalAlert
            type="info"
            icon={Info}
            title="Mesa recomendada"
            message={`${mesaSugerida.nombre} (Capacidad: ${mesaSugerida.capacidad} personas • ${mesaSugerida.ubicacion})`}
          >
            {reserva.id && (
              <button
                onClick={handleAsignarMesaSugerida}
                disabled={asignando}
                className="
                  w-full py-2 px-3 rounded-lg text-xs font-semibold
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  text-white
                  hover:opacity-90 transition
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 mt-2
                "
              >
                <Check size={14} />
                {asignando ? 'Asignando...' : 'Asignar mesa sugerida'}
              </button>
            )}
          </ModalAlert>
        )}

        {modoManual && !mesaSugerida && !reserva.mesa && (
          <ModalAlert
            type="warning"
            icon={Info}
            title="Sin mesa asignada"
            message="No hay mesas disponibles para este horario."
          >
            <span className="text-xs text-white/60 italic block mt-2">
              Puedes asignar una mesa manualmente o agregar a la lista de espera.
            </span>
          </ModalAlert>
        )}

        {reserva.telefono && (
          <ModalField label="Teléfono" value={reserva.telefono} icon={Phone} />
        )}

        {reserva.email && (
          <ModalField label="Email" value={reserva.email} icon={Mail} />
        )}

        {reserva.notas && (
          <ModalField label="Notas" value={reserva.notas} icon={FileText} />
        )}
      </div>
    </Modal>
  );
}

