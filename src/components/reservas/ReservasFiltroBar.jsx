import { useEffect, useMemo, useState, useCallback } from "react";
import { Calendar, X } from "lucide-react";

export default function ReservasFiltroBar({
  onBuscar,
  onLimpiar,
  filtrosAplicados = {},
}) {
  // Inicializar fecha con hoy por defecto
  const hoy = new Date().toISOString().split('T')[0];
  
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(filtrosAplicados.fecha || hoy);
  const [estado, setEstado] = useState(filtrosAplicados.estado || "");

  const handleBuscar = useCallback(() => {
    onBuscar({
      nombre: nombre.trim(),
      fecha: fecha || hoy,
      estado: estado || ""
    });
  }, [nombre, fecha, estado, hoy, onBuscar]);

  const handleLimpiar = useCallback(() => {
    setNombre("");
    setFecha(hoy); // Mantener hoy al limpiar
    setEstado("");
    onLimpiar();
  }, [hoy, onLimpiar]);

  // Botones de estado rápido - memoizado para evitar recreación
  const estados = useMemo(() => [
    { valor: "", label: "Todas", color: "bg-white/10 border-white/20" },
    { valor: "PENDIENTE", label: "Pendientes", color: "bg-yellow-500/20 border-yellow-500/40" },
    { valor: "CONFIRMADA", label: "Confirmadas", color: "bg-green-500/20 border-green-500/40" },
    { valor: "COMPLETADA", label: "Completadas", color: "bg-indigo-500/20 border-indigo-500/40" },
    { valor: "CANCELADA", label: "Canceladas", color: "bg-red-500/20 border-red-500/40" },
  ], []);

  const handleEstadoClick = useCallback((valorEstado) => {
    const nuevoEstado = estado === valorEstado ? "" : valorEstado;
    setEstado(nuevoEstado);
    onBuscar({
      nombre: nombre.trim(),
      fecha: fecha || hoy,
      estado: nuevoEstado
    });
  }, [estado, nombre, fecha, hoy, onBuscar]);

  useEffect(() => {
    if (typeof filtrosAplicados.nombre === "string") {
      setNombre(filtrosAplicados.nombre);
    } else if (filtrosAplicados.nombre === undefined) {
      setNombre("");
    }
  }, [filtrosAplicados.nombre]);

  useEffect(() => {
    if (typeof filtrosAplicados.fecha === "string") {
      setFecha(filtrosAplicados.fecha);
    } else if (filtrosAplicados.fecha === undefined) {
      const hoyDefault = new Date().toISOString().split('T')[0];
      setFecha(hoyDefault);
    }
  }, [filtrosAplicados.fecha]);

  useEffect(() => {
    if (typeof filtrosAplicados.estado === "string") {
      setEstado(filtrosAplicados.estado);
    } else if (filtrosAplicados.estado === undefined) {
      setEstado("");
    }
  }, [filtrosAplicados.estado]);

  const filtrosVisibles = useMemo(() => {
    const chips = [];
    if (filtrosAplicados.nombre) {
      chips.push({ etiqueta: "Nombre", valor: filtrosAplicados.nombre });
    }
    if (filtrosAplicados.fecha) {
      chips.push({
        etiqueta: "Fecha",
        valor: new Date(filtrosAplicados.fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      });
    }
    if (filtrosAplicados.estado) {
      chips.push({ etiqueta: "Estado", valor: filtrosAplicados.estado });
    }
    return chips;
  }, [filtrosAplicados.nombre, filtrosAplicados.fecha, filtrosAplicados.estado]);

  return (
    <div
      className="
        mb-4 md:mb-6 p-3 md:p-5
        rounded-2xl md:rounded-3xl
        bg-gradient-to-br from-[#151728] to-[#0f101b]
        border border-white/10
        shadow-[0_15px_45px_rgba(5,6,15,0.55)]
        space-y-3 md:space-y-4
      "
    >
      {/* Botones de estado rápido */}
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {estados.map((est) => (
          <button
            key={est.valor}
            onClick={() => handleEstadoClick(est.valor)}
            className={`
              px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl 
              text-xs md:text-sm font-semibold transition-all
              border ${est.color} text-white
              flex-1 min-w-[calc(50%-0.375rem)] md:flex-none md:min-w-0
              ${estado === est.valor 
                ? "ring-2 ring-indigo-400 scale-105" 
                : "hover:opacity-80"
              }
            `}
          >
            {est.label}
          </button>
        ))}
      </div>

      {/* Input nombre + botón buscar */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        <div
          className="
            flex-1
            rounded-xl md:rounded-2xl
            bg-[#1d2032]
            border border-[#2b2f45]
            px-3 md:px-5 py-2.5 md:py-3
            text-white/80 text-sm
            focus-within:border-indigo-400
            transition-colors
          "
        >
          <div className="text-[10px] md:text-xs uppercase tracking-widest text-white/30 mb-1">
            Nombre
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="
              w-full bg-transparent
              text-sm md:text-base text-white
              placeholder-white/30
              focus:outline-none
            "
          />
        </div>

        <button
          onClick={handleBuscar}
          className="
            px-4 md:px-6 py-2.5 md:py-3
            rounded-xl md:rounded-2xl
            bg-gradient-to-r from-[#6d6dfc] to-[#a367ff]
            text-white font-semibold text-xs md:text-sm
            shadow-[0_10px_25px_rgba(109,109,252,0.35)]
            hover:opacity-90 transition
            w-full sm:w-auto sm:self-end
          "
        >
          Buscar
        </button>
      </div>

      {/* Fila: Fecha + botón limpiar */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        {/* Fecha */}
        <div
          className="
            flex items-center gap-2 md:gap-3
            flex-1 px-3 md:px-5 py-2.5 md:py-3
            rounded-xl md:rounded-2xl
            bg-[#1d2032]
            border border-[#2b2f45]
            text-white/80 text-sm
          "
        >
          <Calendar size={16} className="text-white/50 md:w-[18px] md:h-[18px] flex-shrink-0" />
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="
              flex-1 bg-transparent
              focus:outline-none
              text-sm md:text-base text-white
              placeholder-white/30
              uppercase tracking-wide
            "
          />
        </div>

        {/* Limpiar */}
        <button
          onClick={handleLimpiar}
          className="
            px-4 md:px-6 py-2.5 md:py-3
            rounded-xl md:rounded-2xl
            bg-transparent
            border border-white/10
            text-white/70 text-xs md:text-sm
            hover:bg-white/5 transition
            flex items-center justify-center gap-2
            w-full sm:w-auto
          "
        >
          <X size={14} className="md:w-4 md:h-4" />
          <span>Limpiar</span>
        </button>
      </div>

      {filtrosVisibles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 md:gap-2 pt-2">
          {filtrosVisibles.map((chip) => (
            <span
              key={`${chip.etiqueta}-${chip.valor}`}
              className="
                px-2 md:px-3 py-1
                rounded-full
                bg-white/5
                border border-white/10
                text-[10px] md:text-xs text-white/70
              "
            >
              <span className="uppercase tracking-wide text-white/40 mr-1">
                {chip.etiqueta}:
              </span>
              <span className="font-semibold text-white">{chip.valor}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
