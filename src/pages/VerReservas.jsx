import ListarReservas from "../components/reservas/ListarReservas.jsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function VerReservas() {
  const navigate = useNavigate();

  return (
    <div className="app-bg text-white">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px]">
        {/* Header minimalista */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/60 transition-colors mb-4"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Volver</span>
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Reservas
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Gestiona y visualiza todas tus reservas
          </p>
        </div>

        {/* Listado de reservas */}
        <ListarReservas />
      </div>
    </div>
  );
}
