import { Calendar, Users } from "lucide-react";
import { formatearFechaLarga, formatearHora } from "../../utils/dateFormatter";

export default function NextReservation({ reserva }) {
  if (!reserva) {
    return (
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-xl p-4 opacity-80">
        <h3 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Próxima reserva</h3>
        <p className="text-white/30 text-xs">No hay reservas próximas</p>
      </div>
    );
  }

  const fechaHora = formatearFechaLarga(reserva);
  const hora = reserva.fecha ? formatearHora(reserva.fecha) : '';

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-blue-400/20 rounded-xl p-4 opacity-90">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-blue-400/60" />
        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider">Próxima reserva</h3>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
          <span>{hora}</span>
          <span className="text-white/40">•</span>
          <Users size={14} className="text-white/50" />
          <span className="text-white/60 text-xs">{reserva.numPersonas} pers</span>
        </div>
        <p className="text-white/90 text-sm font-semibold">{reserva.nombreCliente}</p>
      </div>
    </div>
  );
}
