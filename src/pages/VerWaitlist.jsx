import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListarWaitlist from "../components/waitlist/ListarWaitlist.jsx";
import ReservationsPanel from "../components/dashboard/ReservationsPanel.jsx";
import VerReservaModal from "../components/modals/VerReservaModal.jsx";

export default function VerWaitlist() {
  const navigate = useNavigate();
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  return (
    <main className="app-bg min-h-screen text-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px]">
        {/* Layout principal: izquierda (waitlist) y derecha (reservas) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Waitlist */}
          <div className="lg:col-span-2">
            <ListarWaitlist />
          </div>

          {/* Columna derecha - Panel de reservas (reutilizado de Home) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <ReservationsPanel 
                onReservaClick={(reserva) => setReservaSeleccionada(reserva)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de ver reserva - reutilizado de Home */}
      <VerReservaModal
        reserva={reservaSeleccionada}
        onClose={() => setReservaSeleccionada(null)}
        onEditar={() => {
          setReservaSeleccionada(null);
          navigate('/reservas');
        }}
      />
    </main>
  );
}

