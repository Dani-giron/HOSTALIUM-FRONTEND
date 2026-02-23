import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRestaurant } from "../context/RestaurantContext";
import { useReservas } from "../context/ReservasContext";
import { obtenerMetricasDashboard } from "../services/dashboard";
import DashboardMetrics from "../components/dashboard/DashboardMetrics";
import QuickActions from "../components/dashboard/QuickActions";
import NextReservation from "../components/dashboard/NextReservation";
import ServiceStatus from "../components/dashboard/ServiceStatus";
import ReservationsPanel from "../components/dashboard/ReservationsPanel";
import VerReservaModal from "../components/modals/VerReservaModal";

export default function Home() {
  const navigate = useNavigate();
  const nombreRestaurante = useRestaurant();
  const { reservas } = useReservas(); // Reservas del context (polling 10s)
  const [proximaReserva, setProximaReserva] = useState(null);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [metricas, setMetricas] = useState({
    ocupacion: 0,
    reservasHoy: 0,
    proximasReservas: 0,
    variacionOcupacion: 0,
  });

  // Obtener fecha y hora actual
  const ahora = new Date();
  const diaSemana = ahora.toLocaleDateString('es-ES', { weekday: 'long' });
  const hora = ahora.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const fechaHora = `Hoy · ${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} · ${hora}`;
  const saludo = obtenerSaludo(ahora.getHours());

  // Calcular próxima reserva desde reservas del context
  useEffect(() => {
    const ahora = new Date();
    const proximas = reservas
      .filter(r => {
        if (!r.fecha) return false;
        const fechaReserva = new Date(r.fecha);
        return fechaReserva > ahora && (r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE');
      })
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    setProximaReserva(proximas[0] || null);
  }, [reservas]);

  // Métricas: Ajuste 1 - solo on mount + visibilitychange (o 60s si prefieres)
  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        const metricasData = await obtenerMetricasDashboard();
        if (metricasData) {
          setMetricas(metricasData);
        }
      } catch (error) {
        console.error('Error cargando métricas:', error);
      }
    };

    // Carga inicial
    cargarMetricas();

    // Polling de métricas cada 60s (solo si Home está montada y visible)
    let intervalId = null;
    
    const startPolling = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          cargarMetricas();
        }
      }, 60000); // 60 segundos
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    if (document.visibilityState === 'visible') {
      startPolling();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        cargarMetricas(); // Recargar inmediatamente al volver
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="app-bg text-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px]">
        {/* Saludo y fecha/hora */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {saludo}, {nombreRestaurante || "Restaurante"}
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            {fechaHora}
          </p>
        </div>

        {/* Layout principal: izquierda (métricas y acciones) y derecha (panel de reservas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Métricas y acciones */}
          <div className="lg:col-span-2 space-y-6">
            {/* Métricas */}
            <DashboardMetrics
              ocupacion={metricas.ocupacion}
              reservasHoy={metricas.reservasHoy}
              proximasReservas={metricas.proximasReservas}
              variacionOcupacion={metricas.variacionOcupacion}
            />

            {/* Acciones rápidas */}
            <QuickActions />

            {/* Próxima reserva y Estado del servicio en grid - Nivel 3: Contexto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NextReservation reserva={proximaReserva} />
              <ServiceStatus />
            </div>
          </div>

          {/* Columna derecha - Panel de reservas */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ReservationsPanel 
                onReservaClick={(reserva) => setReservaSeleccionada(reserva)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de ver reserva - renderizado a nivel de página para posicionamiento correcto */}
      <VerReservaModal
        reserva={reservaSeleccionada}
        onClose={() => setReservaSeleccionada(null)}
        onEditar={() => {
          setReservaSeleccionada(null);
          navigate('/reservas');
        }}
      />
    </div>
  );
}

function obtenerSaludo(hora) {
  if (hora >= 6 && hora < 12) return "Buenos días";
  if (hora >= 12 && hora < 20) return "Buenas tardes";
  return "Buenas noches";
}
