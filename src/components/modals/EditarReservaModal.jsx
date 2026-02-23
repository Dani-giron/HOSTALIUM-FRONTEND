import { useEffect, useRef, useState } from "react";
import Modal, { ModalButton, ModalField } from "../common/Modal";
import { useNotifications } from "../../context/NotificationContext";

export default function EditarReservaModal({
  reserva,
  setReserva,
  onClose,
  onSave,
  saving
}) {
  const { showToast } = useNotifications();
  const reservaOriginalRef = useRef(null);

  useEffect(() => {
    if (reserva) {
      if (reservaOriginalRef.current?.id !== reserva.id) {
        reservaOriginalRef.current = { ...reserva };
      }
    } else {
      reservaOriginalRef.current = null;
    }
  }, [reserva]);

  if (!reserva) return null;

  // Maneja el submit local y recibe el resultado del padre
  const handleSubmit = async (e) => {
    e.preventDefault();              // Previene el submit real del form

    // Validar que al menos teléfono o email esté presente
    const telefonoValido = reserva.telefono && String(reserva.telefono).trim().length >= 6;
    const emailValido = reserva.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reserva.email);
    
    if (!telefonoValido && !emailValido) {
      showToast('Debes proporcionar al menos un teléfono válido (mínimo 6 caracteres) o un email válido.', 'error', 5000);
      return;
    }

    const resultado = await onSave();

    if (resultado) {
      // Mostrar toast con el resultado
      showToast(resultado.mensaje, resultado.ok ? 'success' : 'error', resultado.ok ? 3000 : 6000);

      // En caso de éxito, cerrar el modal suavemente
      if (resultado.ok) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }
  };

  const handleCancel = () => {
    const original = reservaOriginalRef.current;
    if (original) {
      setReserva(original);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={!!reserva}
      onClose={onClose}
      title="Editar reserva"
      maxWidth="max-w-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        
        {/* Nombre */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Nombre</label>
          <input
            type="text"
            required
            value={reserva.nombreCliente}
            onChange={(e) =>
              setReserva({ ...reserva, nombreCliente: e.target.value })
            }
            className="
              w-full p-2.5 rounded-xl
              bg-white/10 border border-white/10 text-white
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
              transition-colors
            "
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Teléfono</label>
          <input
            type="text"
            value={reserva.telefono ?? ""}
            onChange={(e) =>
              setReserva({ ...reserva, telefono: e.target.value })
            }
            className="
              w-full p-2.5 rounded-xl
              bg-white/10 border border-white/10 text-white
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
              transition-colors
            "
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Email</label>
          <input
            type="email"
            value={reserva.email ?? ""}
            onChange={(e) =>
              setReserva({ ...reserva, email: e.target.value })
            }
            className="
              w-full p-2.5 rounded-xl
              bg-white/10 border border-white/10 text-white
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
              transition-colors
            "
          />
        </div>

        {/* Fecha + hora */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Fecha</label>
            <input
              type="date"
              required
              value={reserva.fecha}
              onChange={(e) =>
                setReserva({ ...reserva, fecha: e.target.value })
              }
              className="
                w-full p-2.5 rounded-xl
                bg-white/10 border border-white/10 text-white
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                transition-colors
              "
            />
          </div>

          <div className="flex-1">
            <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Hora</label>
            <input
              type="time"
              required
              value={reserva.hora}
              onChange={(e) =>
                setReserva({ ...reserva, hora: e.target.value })
              }
              className="
                w-full p-2.5 rounded-xl
                bg-white/10 border border-white/10 text-white
                focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
                transition-colors
              "
            />
          </div>
        </div>

        {/* Personas */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Nº Personas</label>
          <input
            type="number"
            required
            min={1}
            value={reserva.numPersonas}
            onChange={(e) =>
              setReserva({
                ...reserva,
                numPersonas: Number(e.target.value),
              })
            }
            className="
              w-full p-2.5 rounded-xl
              bg-white/10 border border-white/10 text-white
              focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
              transition-colors
            "
          />
        </div>

        {/* Notas */}
        <div>
          <label className="text-xs uppercase tracking-widest text-white/40 mb-1 block">Notas</label>
          <textarea
            value={reserva.notas ?? ""}
            onChange={(e) =>
              setReserva({ ...reserva, notas: e.target.value })
            }
            className="
              w-full p-2.5 h-20 rounded-xl
              bg-white/10 border border-white/10 text-white
              resize-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none text-sm
              transition-colors
            "
          />
        </div>

        {/* Información de mesa (solo lectura) */}
        {reserva.mesa && (
          <div className="pt-2 border-t border-white/10">
            <ModalField 
              label="Mesa asignada" 
              value={`${reserva.mesa.nombre} · Capacidad: ${reserva.mesa.capacidad} personas · ${reserva.mesa.ubicacion || 'N/A'}`} 
            />
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <ModalButton variant="secondary" onClick={handleCancel} type="button">
            Cancelar
          </ModalButton>
          <ModalButton variant="primary" type="submit" disabled={saving}>
            {saving ? "Guardando" : "Guardar"}
          </ModalButton>
        </div>
      </form>
    </Modal>
  );
}
