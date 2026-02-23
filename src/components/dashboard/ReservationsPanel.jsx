import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, User, Plus } from "lucide-react";
import { useReservas } from "../../context/ReservasContext";
import { obtenerReservas } from "../../services/reservas";
import { useNavigate } from "react-router-dom";
import { formatearHora } from "../../utils/dateFormatter";

export default function ReservationsPanel({ onReservaClick }) {
  const navigate = useNavigate();
  const { reservas: reservasContext, loading: loadingContext } = useReservas();
  const [todasReservas, setTodasReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [tabActiva, setTabActiva] = useState("reservadas");
  const [loading, setLoading] = useState(false);

  // Determinar si la fecha seleccionada es hoy
  const esHoy = useMemo(() => {
    const hoy = new Date();
    const seleccionada = new Date(fechaSeleccionada);
    return hoy.toDateString() === seleccionada.toDateString();
  }, [fechaSeleccionada]);

  // Usar context si es hoy, sino cargar desde API
  useEffect(() => {
    if (esHoy) {
      // Usar reservas del context (polling unificado)
      setTodasReservas(reservasContext);
      setLoading(loadingContext);
    } else {
      // Cargar desde API para fechas diferentes
      const cargarReservas = async () => {
        try {
          setLoading(true);
          const fechaStr = fechaSeleccionada.toISOString().split('T')[0];
          const datos = await obtenerReservas({ fecha: fechaStr });
          setTodasReservas(datos || []);
        } catch (error) {
          console.error('Error cargando reservas:', error);
          setTodasReservas([]);
        } finally {
          setLoading(false);
        }
      };
      cargarReservas();
    }
  }, [fechaSeleccionada, esHoy, reservasContext, loadingContext]);

  // Filtrar reservas según el tab activo
  const reservadas = todasReservas.filter(r => r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE');
  const solicitadas = todasReservas.filter(r => r.estado === 'PENDIENTE');
  const reservasMostradas = tabActiva === 'reservadas' ? reservadas : solicitadas;

  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // formatearHora ahora se importa de dateFormatter.js para usar UTC

  const cambiarFecha = (direccion) => {
    const nuevaFecha = new Date(fechaSeleccionada);
    nuevaFecha.setDate(nuevaFecha.getDate() + (direccion === 'next' ? 1 : -1));
    setFechaSeleccionada(nuevaFecha);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      {/* Título del módulo */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-semibold text-lg">Reservas</h2>
        <button
          onClick={() => navigate("/reservas")}
          className="text-white/50 hover:text-white/80 transition-colors p-1"
          aria-label="Ver todas las reservas"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Selector de fecha */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
        <button
          onClick={() => cambiarFecha('prev')}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Fecha anterior"
        >
          <ChevronLeft className="text-white/60" size={18} />
        </button>
        <span className="text-white/80 font-medium text-sm">
          {formatearFecha(fechaSeleccionada)}
        </span>
        <button
          onClick={() => cambiarFecha('next')}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Fecha siguiente"
        >
          <ChevronRight className="text-white/60" size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-white/10">
        <button
          onClick={() => setTabActiva('reservadas')}
          className={`
            pb-2 px-3 text-sm font-medium transition-colors relative
            ${tabActiva === 'reservadas' 
              ? 'text-white' 
              : 'text-white/60 hover:text-white/80'
            }
          `}
        >
          Reservadas ({reservadas.length})
          {tabActiva === 'reservadas' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"></div>
          )}
        </button>
        <button
          onClick={() => setTabActiva('solicitadas')}
          className={`
            pb-2 px-3 text-sm font-medium transition-colors relative
            ${tabActiva === 'solicitadas' 
              ? 'text-white' 
              : 'text-white/60 hover:text-white/80'
            }
          `}
        >
          Solicitadas ({solicitadas.length})
          {tabActiva === 'solicitadas' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400"></div>
          )}
        </button>
      </div>

      {/* Lista de reservas */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {loading ? (
          <div className="text-white/40 text-sm text-center py-8">Cargando...</div>
        ) : reservasMostradas.length === 0 ? (
          <div className="text-white/40 text-sm text-center py-8">No hay reservas</div>
        ) : (
          reservasMostradas.map((reserva) => (
            <div
              key={reserva.id}
              onClick={() => {
                // Solo abrir modal si está en el tab "reservadas" (Reserved)
                if (tabActiva === 'reservadas' && onReservaClick) {
                  onReservaClick(reserva);
                } else {
                  // Si está en "solicitadas", navegar a la página de reservas
                  navigate('/reservas');
                }
              }}
              className="
                bg-white/5 border border-white/10 rounded-lg p-3
                hover:border-indigo-400/40 hover:bg-white/10
                cursor-pointer transition-all duration-200
                flex items-center gap-3
              "
            >
              <div className="bg-indigo-500/20 p-2 rounded-lg">
                <User className="text-indigo-400" size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {reserva.nombreCliente}
                </p>
                <div className="flex items-center gap-2 text-white/60 text-xs mt-1">
                  <span>{formatearHora(reserva.fecha)}</span>
                  {reserva.numPersonas && (
                    <>
                      <span>•</span>
                      <span>{reserva.numPersonas} pers</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botón Nueva reserva */}
      <button
        onClick={() => navigate("/crear-reserva")}
        className="
          mt-4 w-full
          bg-gradient-to-r from-indigo-500 to-purple-600
          border border-indigo-400/30
          rounded-lg p-3
          text-white font-medium text-sm
          hover:from-indigo-600 hover:to-purple-700
          hover:border-indigo-400/50
          hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]
          transition-all duration-300
          flex items-center justify-center gap-2
        "
      >
        <Plus size={18} />
        Nueva reserva
      </button>
    </div>
  );
}
