import { useNavigate } from "react-router-dom";
import { Table, CalendarDays, Clock } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Abrir plano de mesas",
      icon: <Table className="text-blue-300" size={28} />,
      onClick: () => navigate("/mesas"),
      type: "primary", // Azul - acción reina
      color: "blue",
    },
    {
      title: "Ver reservas",
      icon: <CalendarDays className="text-purple-300" size={28} />,
      onClick: () => navigate("/reservas"),
      type: "secondary", // Morado - secundaria
      color: "purple",
    },
    {
      title: "Lista de espera",
      icon: <Clock className="text-yellow-300" size={28} />,
      onClick: () => navigate("/waitlist"),
      type: "tertiary", // Amarillo - gestión
      color: "yellow",
    },
  ];

  const getButtonStyles = (type, color) => {
    const baseStyles = "bg-white/5 backdrop-blur-xl rounded-xl p-5 flex flex-col items-center gap-4 transition-all duration-300";
    
    const colorStyles = {
      blue: `
        border border-blue-400/40 shadow-[0_0_20px_rgba(96,165,250,0.2)]
      `,
      purple: `
        border border-purple-400/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]
      `,
      yellow: `
        border border-yellow-400/30 shadow-[0_0_15px_rgba(251,191,36,0.15)]
      `,
    };

    const iconBgStyles = {
      blue: "bg-blue-500/30 shadow-lg shadow-blue-500/30",
      purple: "bg-purple-500/25 shadow-lg shadow-purple-500/25",
      yellow: "bg-yellow-500/25 shadow-lg shadow-yellow-500/25",
    };

    return {
      button: `${baseStyles} ${colorStyles[color]}`,
      iconBg: iconBgStyles[color],
    };
  };

  return (
    <div className="mb-6">
      <h3 className="text-white/70 text-sm font-medium mb-4 uppercase tracking-wider">Acciones rápidas</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const styles = getButtonStyles(action.type, action.color);
          return (
            <button
              key={index}
              onClick={action.onClick}
              className={styles.button}
            >
              <div className={`p-4 rounded-xl ${styles.iconBg} transition-transform duration-300`}>
                {action.icon}
              </div>
              <span className="text-white/90 text-sm font-semibold text-center leading-tight">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
