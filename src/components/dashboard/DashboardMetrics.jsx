import { TrendingUp, Calendar } from "lucide-react";

export default function DashboardMetrics({ ocupacion, reservasHoy, proximasReservas, variacionOcupacion = 0 }) {
  const ocupacionPorcentaje = ocupacion || 0;
  const reservasTotal = reservasHoy || 0;
  const proximas = proximasReservas || 0;
  
  const variacion = variacionOcupacion || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Métrica de Ocupación - Nivel 1: CRÍTICO */}
      <div className="
        bg-white/5 backdrop-blur-xl 
        border border-green-400/30 rounded-2xl p-6 
        hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]
        transition-all duration-300
        shadow-[0_0_15px_rgba(74,222,128,0.1)]
      ">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">Ocupación</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-extrabold text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
                {ocupacionPorcentaje}%
              </span>
            </div>
          </div>
          <div className="bg-green-500/30 p-3 rounded-xl shadow-lg shadow-green-500/20">
            <TrendingUp className="text-green-300" size={24} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-300 text-sm font-medium">
          <TrendingUp size={18} />
          <span>
            {variacion > 0 ? '+' : ''}{variacion}%
          </span>
          <span className="text-white/40 text-xs">respecto ayer</span>
        </div>
      </div>

      {/* Métrica de Reservas Hoy - Nivel 1: CRÍTICO */}
      <div className="
        bg-white/5 backdrop-blur-xl 
        border border-purple-400/30 rounded-2xl p-6 
        hover:border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
        transition-all duration-300
        shadow-[0_0_15px_rgba(168,85,247,0.1)]
      ">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-white/50 text-xs mb-2 uppercase tracking-wider">Reservas hoy</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                {reservasTotal}
              </span>
            </div>
          </div>
          <div className="bg-purple-500/30 p-3 rounded-xl shadow-lg shadow-purple-500/20">
            <Calendar className="text-purple-300" size={24} />
          </div>
        </div>
        <div className="text-white/60 text-sm font-medium">
          {proximas} próximas
        </div>
      </div>
    </div>
  );
}
