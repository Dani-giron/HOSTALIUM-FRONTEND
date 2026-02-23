import ReservationForm from "../components/reservas/ReservationForm";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CrearReserva() {
  const navigate = useNavigate();

  return (
    <div className="app-bg text-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px]">
        {/* Layout centrado y equilibrado */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            {/* Header minimalista integrado */}
            <div className="mb-8 text-center md:text-left">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-white/60 transition-colors mb-6 md:mb-4"
              >
                <ArrowLeft size={18} />
                <span className="text-sm">Volver</span>
              </button>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Nueva Reserva
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                Completa los datos para crear una nueva reserva
              </p>
            </div>

            {/* Formulario centrado */}
            <ReservationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
