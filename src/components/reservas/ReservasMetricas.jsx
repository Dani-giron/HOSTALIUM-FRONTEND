import React, { useMemo } from "react";
import { Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";

export default function ReservasMetricas({ reservas, fechaFiltro }) {
  const hoy = fechaFiltro || new Date().toISOString().split('T')[0];
  
  const metricas = useMemo(() => {
    const ahora = new Date();
    const inicioDia = new Date(`${hoy}T00:00:00.000Z`);
    const finDia = new Date(`${hoy}T23:59:59.999Z`);
    
    const reservasHoy = reservas.filter(r => {
      const fechaReserva = new Date(r.fecha);
      return fechaReserva >= inicioDia && fechaReserva <= finDia;
    });

    const pendientes = reservasHoy.filter(r => r.estado === 'PENDIENTE').length;
    const confirmadas = reservasHoy.filter(r => r.estado === 'CONFIRMADA').length;
    const total = reservasHoy.length;
    
    // Próximas reservas (en las próximas 2 horas)
    const en2Horas = new Date(ahora.getTime() + 2 * 60 * 60 * 1000);
    const proximas = reservasHoy.filter(r => {
      const fechaReserva = new Date(r.fecha);
      return fechaReserva > ahora && fechaReserva <= en2Horas && 
             (r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA');
    }).length;

    return { pendientes, confirmadas, total, proximas };
  }, [reservas, hoy]);

  const cards = useMemo(() => [
    {
      label: "Pendientes",
      valor: metricas.pendientes,
      icon: <AlertCircle size={14} />,
      textColor: "text-yellow-400"
    },
    {
      label: "Confirmadas",
      valor: metricas.confirmadas,
      icon: <CheckCircle size={14} />,
      textColor: "text-green-400"
    },
    {
      label: "Total",
      valor: metricas.total,
      icon: <Calendar size={14} />,
      textColor: "text-indigo-400"
    },
    {
      label: "Próximas 2h",
      valor: metricas.proximas,
      icon: <Clock size={14} />,
      textColor: "text-purple-400"
    }
  ], [metricas]);

  return (
    <div className="mb-4 md:mb-6 py-2 md:py-3 border-b border-white/5 min-h-[60px]">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-white/70 min-w-[100px]"
          >
            <div className={card.textColor} style={{ minWidth: '14px', minHeight: '14px' }}>
              {card.icon}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base md:text-lg font-semibold text-white tabular-nums" style={{ minWidth: '24px', display: 'inline-block', textAlign: 'right' }}>
                {card.valor}
              </span>
              <span className="text-xs md:text-sm text-white/50 whitespace-nowrap">
                {card.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
