export default function ServiceStatus() {
  // Esto sería calculado en base a las reservas y tiempos
  const tiempoEspera = "0-10 minutos";
  const riesgo = "bajo";
  
  return (
    <div className="
      bg-white/3 backdrop-blur-xl 
      border border-white/5 rounded-xl p-4
      opacity-80
    ">
      <h3 className="text-white/50 text-xs font-medium mb-3 uppercase tracking-wider">Estado del servicio</h3>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400/70 shadow-[0_0_4px_rgba(74,222,128,0.4)]"></div>
          <span className="text-white/40 text-xs">{tiempoEspera}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-400/70 shadow-[0_0_4px_rgba(251,146,60,0.4)]"></div>
          <span className="text-white/50 text-xs">Riesgo {riesgo}</span>
        </div>
      </div>
    </div>
  );
}
