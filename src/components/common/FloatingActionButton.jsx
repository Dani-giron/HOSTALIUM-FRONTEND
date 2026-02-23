import { Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Botón flotante de acción rápida - Disponible en todas las páginas
 * Navega a crear reserva
 */
export default function FloatingActionButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ocultar en login y páginas públicas
  const hiddenPaths = ['/login', '/confirmar', '/cancelar'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <button
      onClick={() => navigate('/crear-reserva')}
      className="
        fixed bottom-6 right-6 md:bottom-8 md:right-8
        w-14 h-14 md:w-16 md:h-16
        bg-gradient-to-br from-indigo-500 to-purple-600
        rounded-full shadow-lg
        flex items-center justify-center
        hover:scale-110 hover:shadow-xl
        transition-all duration-300
        z-50
        group
      "
      aria-label="Nueva reserva"
    >
      <Plus 
        className="text-white group-hover:rotate-90 transition-transform duration-300" 
        size={28} 
      />
    </button>
  );
}
