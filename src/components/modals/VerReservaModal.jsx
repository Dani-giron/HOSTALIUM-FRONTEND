import { useState, useEffect } from 'react';
import { formatearFechaLarga } from '../../utils/dateFormatter';
import { obtenerReservaPorId, asignarMesaAReserva } from '../../services/reservas';
import { useNotifications } from '../../context/NotificationContext';
import Modal, { ModalField, ModalAlert, ModalButton } from '../common/Modal';
import { Info, Check, User, Phone, Mail, Calendar, Users, FileText } from 'lucide-react';

export default function VerReservaModal({
  reserva,
  onClose,
  onEditar,
}) {
  const { showToast } = useNotifications();
  // Mostrar inmediatamente con los datos que tenemos (como EditarReservaModal)
  const [reservaCompleta, setReservaCompleta] = useState(reserva);
  const [asignando, setAsignando] = useState(false);

  // Sincronizar reservaCompleta cuando cambia reserva
  useEffect(() => {
    setReservaCompleta(reserva);
  }, [reserva]);

  // Cargar datos adicionales en segundo plano (sin bloquear la visualización)
  useEffect(() => {
    if (reserva && reserva.id && !reserva.mesaId) {
      // Cargar en segundo plano, sin bloquear
      obtenerReservaPorId(reserva.id)
        .then(data => {
          setReservaCompleta(data);
        })
        .catch(err => {
          console.error('Error obteniendo reserva completa:', err);
          // Mantener la reserva original si hay error
        });
    }
  }, [reserva]);

  // Renderizar inmediatamente con los datos disponibles (como EditarReservaModal)
  if (!reserva) return null;

  // Usar reservaCompleta si existe, sino usar reserva directamente
  const reservaParaMostrar = reservaCompleta || reserva;
  const fechaLegible = formatearFechaLarga(reservaParaMostrar);
  const mesaSugerida = reservaParaMostrar.mesaSugerida;
  const modoManual = reservaParaMostrar.modoManual;

  const handleAsignarMesaSugerida = async () => {
    if (!mesaSugerida || !reservaCompleta.id) return;
    
    setAsignando(true);
    try {
      await asignarMesaAReserva(reservaCompleta.id, mesaSugerida.id);
      showToast(
        `Mesa ${mesaSugerida.nombre} asignada a la reserva de ${reservaCompleta.nombreCliente}`,
        'success',
        5000
      );
      // Actualizar la reserva localmente
      setReservaCompleta(prev => ({
        ...prev,
        mesaId: mesaSugerida.id,
        mesa: mesaSugerida,
        mesaSugerida: null
      }));
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

  const getEstadoBadge = (estado) => {
    const estados = {
      CONFIRMADA: "bg-green-500/20 text-green-300",
      PENDIENTE: "bg-yellow-500/20 text-yellow-300",
      CANCELADA: "bg-red-500/20 text-red-300",
      COMPLETADA: "bg-indigo-500/20 text-indigo-200"
    };
    return estados[estado] || "bg-white/10 text-white/60";
  };

  return (
    <Modal
      isOpen={!!reserva}
      onClose={onClose}
      title={reservaParaMostrar.nombreCliente}
      subtitle="Detalle de reserva"
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-3">
          <ModalButton variant="secondary" onClick={onClose}>
            Cerrar
          </ModalButton>
          <ModalButton variant="primary" onClick={onEditar}>
            Editar
          </ModalButton>
        </div>
      }
    >
      {/* Badge de estado en el header */}
      <div className="flex items-center justify-end mb-4 -mt-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getEstadoBadge(reservaParaMostrar.estado)}`}
        >
          {reservaParaMostrar.estado ?? "—"}
        </span>
      </div>

      <div className="space-y-3">
        <ModalField label="Nombre" value={reservaParaMostrar.nombreCliente} icon={User} />
        <ModalField label="Teléfono" value={reservaParaMostrar.telefono} icon={Phone} />
        <ModalField label="Email" value={reservaParaMostrar.email} icon={Mail} />
        <ModalField label="Fecha y hora" value={fechaLegible} icon={Calendar} />
        <ModalField label="Personas" value={`${reservaParaMostrar.numPersonas} pers`} icon={Users} />
        <ModalField 
          label="Mesa" 
          value={
            reservaParaMostrar.mesa 
              ? `${reservaParaMostrar.mesa.nombre} · Capacidad: ${reservaParaMostrar.mesa.capacidad} personas · ${reservaParaMostrar.mesa.ubicacion || 'N/A'}`
              : "Sin asignar"
          } 
        />
        <ModalField label="Notas" value={reservaParaMostrar.notas || "Sin notas"} icon={FileText} />
        <ModalField label="Estado" value={reservaParaMostrar.estado || "—"} />

        {/* Información sobre mesa sugerida en modo manual - solo si ya está cargada */}
        {modoManual && mesaSugerida && !reservaParaMostrar.mesaId && (
          <ModalAlert
            type="info"
            icon={Info}
            title="Mesa recomendada"
            message={`${mesaSugerida.nombre} (Capacidad: ${mesaSugerida.capacidad} personas • ${mesaSugerida.ubicacion})`}
          >
            {reservaParaMostrar.id && (
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
      </div>
    </Modal>
  );
}

