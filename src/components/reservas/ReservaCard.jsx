import React, { memo } from "react";
import { extraerFechaHora, formatearFechaLocalizada } from "../../utils/dateFormatter";

const ReservaCard = memo(({ 
  reserva, 
  isNew = false,
  changingEstadoId, 
  onCambiarEstado, 
  onVer, 
  onEditar, 
  onEliminar 
}) => {
  // Normalización de fecha y hora usando UTC (sin conversión)
  const { fecha, hora } = extraerFechaHora(reserva.fecha);
  const fechaFormateada = formatearFechaLocalizada(reserva.fecha);

  return (
    <li className={`bg-white/5 border border-white/10 rounded-xl p-4 md:p-5 reservation-card ${isNew ? 'reservation-card-new' : ''}`}>
      {/* Header: Nombre y Estado */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-white truncate">
            {reserva.nombreCliente}
          </h3>
          <div className="text-white/60 text-sm mt-1">
            {fechaFormateada} · {reserva.numPersonas} pers
          </div>
          {reserva.telefono && (
            <p className="text-white/50 text-xs mt-1">Tel: {reserva.telefono}</p>
          )}
        </div>
        <span
          className={`
            px-2.5 py-1 rounded-lg text-xs font-medium uppercase flex-shrink-0
            ${reserva.estado === "CONFIRMADA" ? "bg-green-500/20 text-green-300" : ""}
            ${reserva.estado === "PENDIENTE" ? "bg-yellow-500/20 text-yellow-300" : ""}
            ${reserva.estado === "CANCELADA" ? "bg-red-500/20 text-red-300" : ""}
            ${reserva.estado === "COMPLETADA" ? "bg-indigo-500/20 text-indigo-200" : ""}
          `}
        >
          {reserva.estado ?? "—"}
        </span>
      </div>

      {/* Acciones - Centradas y cerca del estado */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between gap-3">
        {/* Selector de estados */}
        <select
          value={reserva.estado}
          onChange={(e) => onCambiarEstado(reserva, e.target.value)}
          disabled={changingEstadoId === reserva.id}
          className="
            w-full sm:w-auto sm:min-w-[140px] px-3 py-2 text-sm rounded-lg
            border border-indigo-400/30 bg-indigo-500/15 text-indigo-200
            transition disabled:opacity-60 disabled:cursor-not-allowed
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500
            estado-selector
          "
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADA">Confirmada</option>
          <option value="COMPLETADA">Completada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>

        {/* Botones de acción - Centrados */}
        <div className="flex gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => onVer({ ...reserva, fecha, hora, notas: reserva.notas ?? "" })}
            className="
              flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg
              border border-white/20 bg-white/5 text-white/80
              transition
            "
          >
            Ver
          </button>

          <button
            onClick={() => onEditar({ ...reserva, fecha, hora, notas: reserva.notas ?? "" })}
            className="
              flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg
              border border-indigo-400/40 bg-indigo-500/20 text-indigo-300
              transition
            "
          >
            Editar
          </button>

          <button
            onClick={() => onEliminar(reserva)}
            className="
              flex-1 sm:flex-none px-4 py-2 text-sm rounded-lg
              border border-red-400/40 bg-red-500/20 text-red-300
              transition
            "
          >
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
});

ReservaCard.displayName = 'ReservaCard';

export default ReservaCard;

