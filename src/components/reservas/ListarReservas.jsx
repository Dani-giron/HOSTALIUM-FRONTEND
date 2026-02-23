import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import EditarReservaModal from "../modals/EditarReservaModal.jsx";
import VerReservaModal from "../modals/VerReservaModal.jsx";
import ReservasFiltroBar from "./ReservasFiltroBar.jsx";
import ReservasMetricas from "./ReservasMetricas.jsx";
import ReservaCard from "./ReservaCard.jsx";
import { useReservas } from "../../context/ReservasContext";
import { useNotifications } from "../../context/NotificationContext";
import { obtenerReservas, cambiarEstadoReserva, actualizarReserva, eliminarReserva } from "../../services/reservas";
import { extraerFechaHora } from "../../utils/dateFormatter";

export default function ListarReservas() {
  // Usar reservas del context (polling unificado 10s)
  const { reservas: reservasContext, loading: loadingContext, recargar } = useReservas();
  const { showToast } = useNotifications();
  
  // Reservas filtradas localmente (cuando hay filtros específicos)
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [loadingFiltradas, setLoadingFiltradas] = useState(false);
  
  // Rastrear IDs de reservas previas para detectar nuevas
  const prevReservaIdsRef = useRef(new Set());
  // IDs de reservas nuevas para animación
  const [newReservaIds, setNewReservaIds] = useState(new Set());

  // Flags de estado general
  const [error, setError] = useState(null);

  // Estados para modal ver y editar
  const [editReserva, setEditReserva] = useState(null);
  const [viewReserva, setViewReserva] = useState(null);

  // Estado para cambiar estado de reserva
  const [changingEstadoId, setChangingEstadoId] = useState(null);

  // Flag para indicar si se está ejecutando un PUT
  const [saving, setSaving] = useState(false);

  // Estado para modal de confirmación de eliminación
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Filtros aplicados efectivamente al backend
  const hoy = new Date().toISOString().split('T')[0];
  const [filtros, setFiltros] = useState({ nombre: "", fecha: hoy, estado: "" });

  // Determinar si hay filtros activos que requieren llamada al backend
  const tieneFiltrosEspecificos = useMemo(() => {
    return filtros.nombre !== "" || 
           filtros.fecha !== hoy || 
           filtros.estado !== "";
  }, [filtros, hoy]);

  // Reservas finales: usar context si no hay filtros, o filtradas si hay filtros
  const reservas = useMemo(() => {
    if (tieneFiltrosEspecificos) {
      return reservasFiltradas;
    }
    return reservasContext;
  }, [tieneFiltrosEspecificos, reservasFiltradas, reservasContext]);

  const loading = tieneFiltrosEspecificos ? loadingFiltradas : loadingContext;

  // Aplicar filtros localmente cuando es posible (nombre, estado) desde context
  // O hacer llamada al backend cuando hay filtros de fecha diferente
  useEffect(() => {
    if (!tieneFiltrosEspecificos) {
      // Sin filtros: usar context directamente, solo aplicar filtros locales si existen
      setReservasFiltradas([]);
      return;
    }

    // Con filtros: hacer llamada al backend
    let mounted = true;
    let abortCtrl = new AbortController();

    const fetchFiltradas = async () => {
      setLoadingFiltradas(true);
      try {
        const list = await obtenerReservas(filtros);
        
        if (mounted) {
          // Detectar nuevas reservas para animación
          const currentIds = new Set(list.map(r => r.id));
          const newIds = new Set();
          
          if (prevReservaIdsRef.current.size > 0) {
            list.forEach(reserva => {
              if (!prevReservaIdsRef.current.has(reserva.id)) {
                newIds.add(reserva.id);
              }
            });
            
            if (newIds.size > 0) {
              setNewReservaIds(newIds);
              setTimeout(() => {
                setNewReservaIds(prev => {
                  const updated = new Set(prev);
                  newIds.forEach(id => updated.delete(id));
                  return updated;
                });
              }, 600);
            }
          }
          
          // Ordenar reservas
          const sortedList = [...list].sort((a, b) => {
            const dateA = new Date(a.fecha || a.createdAt);
            const dateB = new Date(b.fecha || b.createdAt);
            if (dateB.getTime() !== dateA.getTime()) {
              return dateB.getTime() - dateA.getTime();
            }
            return (b.id || 0) - (a.id || 0);
          });
          
          setReservasFiltradas(sortedList);
          prevReservaIdsRef.current = currentIds;
          setLoadingFiltradas(false);
        }
      } catch {
        if (mounted) {
          setError("No se pudieron cargar las reservas");
          setLoadingFiltradas(false);
        }
      }
    };

    fetchFiltradas();

    return () => {
      mounted = false;
      abortCtrl.abort();
    };
  }, [filtros, tieneFiltrosEspecificos]);

  // Detectar nuevas reservas desde context (cuando no hay filtros)
  useEffect(() => {
    if (tieneFiltrosEspecificos) return; // Solo si no hay filtros

    const currentIds = new Set(reservasContext.map(r => r.id));
    const newIds = new Set();
    
    if (prevReservaIdsRef.current.size > 0) {
      reservasContext.forEach(reserva => {
        if (!prevReservaIdsRef.current.has(reserva.id)) {
          newIds.add(reserva.id);
        }
      });
      
      if (newIds.size > 0) {
        setNewReservaIds(newIds);
        setTimeout(() => {
          setNewReservaIds(prev => {
            const updated = new Set(prev);
            newIds.forEach(id => updated.delete(id));
            return updated;
          });
        }, 600);
      }
    }
    
    prevReservaIdsRef.current = currentIds;
  }, [reservasContext, tieneFiltrosEspecificos]);


  /* ============================================================
     MANEJO DE FILTROS DESDE EL COMPONENTE EXTERNO
     ============================================================ */

  // Se ejecuta al pulsar "Buscar" en el componente de filtros
  const handleBuscar = useCallback((nuevoFiltro) => {
    setFiltros(nuevoFiltro);
    setLoading(true); // Muestra estado de carga mientras llega el nuevo fetch
  }, []);

  // Restaura filtros vacíos
  const handleLimpiar = useCallback(() => {
    setFiltros({ nombre: "", fecha: hoy, estado: "" });
    setLoading(true);
  }, [hoy]);

  const handleCambiarEstado = useCallback(async (reserva, nuevoEstado) => {
    if (!reserva) return;

    setChangingEstadoId(reserva.id);
    try {
      const actualizada = await cambiarEstadoReserva(reserva.id, nuevoEstado);
      
      if (actualizada) {
        const { fecha: fechaNormalizada, hora: horaNormalizada } = extraerFechaHora(actualizada.fecha);

        // Actualizar según si hay filtros o no
        if (tieneFiltrosEspecificos) {
          setReservasFiltradas((prev) =>
            prev.map((r) => (r.id === actualizada.id ? { ...r, ...actualizada } : r))
          );
        } else {
          // Sin filtros: recargar del contexto (el polling lo actualizará automáticamente)
          recargar();
        }
        
        setViewReserva((prev) =>
          prev?.id === actualizada.id ? { ...prev, ...actualizada } : prev
        );
        setEditReserva((prev) =>
          prev?.id === actualizada.id
            ? {
                ...prev,
                ...actualizada,
                fecha: fechaNormalizada,
                hora: horaNormalizada,
                notas: actualizada.notas ?? "",
              }
            : prev
        );
      }
    } catch (err) {
      console.error("Error cambiando estado de reserva:", err);
      alert(err.message || "Error al cambiar el estado de la reserva");
    } finally {
      setChangingEstadoId(null);
    }
  }, [tieneFiltrosEspecificos, recargar]);

  /* ============================================================
     ELIMINACIÓN DE RESERVA
     ============================================================ */
  const handleDeleteReserva = useCallback(async () => {
    if (!reservaAEliminar) return;

    setDeleting(true);
    try {
      await eliminarReserva(reservaAEliminar.id);

      // Actualizar según si hay filtros o no
      if (tieneFiltrosEspecificos) {
        setReservasFiltradas((prev) => prev.filter((r) => r.id !== reservaAEliminar.id));
      } else {
        // Sin filtros: recargar del contexto (el polling lo actualizará automáticamente)
        recargar();
      }
      
      // Cerrar modales si estaban abiertos
      if (viewReserva?.id === reservaAEliminar.id) {
        setViewReserva(null);
      }
      if (editReserva?.id === reservaAEliminar.id) {
        setEditReserva(null);
      }

      // Cerrar modal de confirmación
      setReservaAEliminar(null);
    } catch (err) {
      console.error("Error eliminando reserva:", err);
      alert(err.message || "Error al eliminar la reserva");
    } finally {
      setDeleting(false);
    }
  }, [reservaAEliminar, viewReserva?.id, editReserva?.id, tieneFiltrosEspecificos, recargar]);

  /* ============================================================
     GUARDADO (PUT) EN EL BACKEND
     ============================================================ */
  const handleSave = useCallback(async () => {
    if (!editReserva) {
      return { ok: false, mensaje: "No hay ninguna reserva seleccionada" };
    }

    setSaving(true);

    try {
      const actualizada = await actualizarReserva(editReserva.id, editReserva);

      // Actualizar la lista según si hay filtros o no
      if (tieneFiltrosEspecificos) {
        // Con filtros: actualizar lista filtrada
        setReservasFiltradas((prev) =>
          prev.map((r) => (r.id === actualizada.id ? { ...r, ...actualizada } : r))
        );
      } else {
        // Sin filtros: recargar del contexto (el polling lo actualizará automáticamente)
        recargar();
      }

      // Actualizar modales si están abiertos
      setViewReserva((prev) =>
        prev?.id === actualizada.id ? { ...prev, ...actualizada } : prev
      );

      // Cierre del modal tras el guardado exitoso
      setEditReserva(null);

      return {
        ok: true,
        mensaje: "Reserva actualizada correctamente"
      };
    } catch (err) {
      // Extraer mensaje de error (puede venir de validaciones del backend)
      const errorMessage = err.message || "No se pudo actualizar la reserva";
      return {
        ok: false,
        mensaje: errorMessage,
      };
    } finally {
      setSaving(false);
    }
  }, [editReserva, tieneFiltrosEspecificos, recargar]);


  /* ============================================================
     RENDERS DE ESTADO DE CARGA O ERROR
     ============================================================ */
  if (error) return <p className="text-red-400">{error}</p>;
  
  // Skeleton loading optimizado para evitar CLS
  const SkeletonCard = () => (
    <li className="bg-white/5 p-3 md:p-4 rounded-lg md:rounded-xl border border-white/10 animate-pulse">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="h-5 bg-white/10 rounded w-32"></div>
        <div className="h-5 bg-white/10 rounded w-20"></div>
      </div>
      <div className="h-4 bg-white/10 rounded w-48 mb-2"></div>
      <div className="h-4 bg-white/10 rounded w-32 mb-3"></div>
      <div className="flex gap-2">
        <div className="h-9 bg-white/10 rounded flex-1"></div>
        <div className="h-9 bg-white/10 rounded w-20"></div>
        <div className="h-9 bg-white/10 rounded w-20"></div>
      </div>
    </li>
  );


  /* ============================================================
     RENDER PRINCIPAL DEL LISTADO
     ============================================================ */
  return (
    <div className="w-full relative">
      {/* Barra de búsqueda externa */}
      <ReservasFiltroBar
        onBuscar={handleBuscar}
        onLimpiar={handleLimpiar}
        filtrosAplicados={filtros}
      />

      {/* Métricas - siempre visible para evitar CLS */}
      <div className="relative">
        <ReservasMetricas reservas={loading ? [] : reservas} fechaFiltro={filtros.fecha} />
      </div>

      {/* Lista de reservas */}
      {loading ? (
        <ul className="space-y-3 md:space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
      ) : reservas.length === 0 ? (
        <div className="text-center py-16 pb-24">
          <p className="text-white/60 text-sm md:text-base">
            No se encontraron reservas con los filtros aplicados
          </p>
        </div>
      ) : (
        <ul className="space-y-3 pb-24">
          {reservas.map((r) => (
            <ReservaCard
              key={r.id}
              reserva={r}
              isNew={newReservaIds.has(r.id)}
              changingEstadoId={changingEstadoId}
              onCambiarEstado={handleCambiarEstado}
              onVer={setViewReserva}
              onEditar={setEditReserva}
              onEliminar={setReservaAEliminar}
            />
          ))}
        </ul>
      )}

      {/* Modal ver */}
      <VerReservaModal
        reserva={viewReserva}
        onClose={() => setViewReserva(null)}
        onEditar={() => {
          if (!viewReserva) return;
          setEditReserva(viewReserva);
          setViewReserva(null);
        }}
      />

      {/* Modal de edición */}
      <EditarReservaModal
        reserva={editReserva}
        setReserva={setEditReserva}
        onClose={() => setEditReserva(null)}
        onSave={handleSave}
        saving={saving}
      />

      {/* Modal de confirmación de eliminación */}
      {reservaAEliminar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-4 md:p-6 max-w-md w-full border border-white/10">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
              Confirmar Eliminación
            </h3>
            
            <p className="text-white/80 text-sm md:text-base mb-2">
              ¿Estás seguro de que deseas eliminar la reserva de{" "}
              <span className="font-semibold text-white">
                {reservaAEliminar.nombreCliente}
              </span>?
            </p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 md:p-3 mb-4">
              <p className="text-red-300 text-xs md:text-sm font-semibold mb-1">
                ⚠️ Esta acción no se puede deshacer
              </p>
              <p className="text-red-200/80 text-[10px] md:text-xs">
                La reserva será eliminada permanentemente del sistema.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <button
                onClick={() => setReservaAEliminar(null)}
                disabled={deleting}
                className="
                  flex-1 px-4 py-2 rounded-lg
                  border border-white/20 bg-white/5 text-white/80
                  hover:bg-white/10 transition text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteReserva}
                disabled={deleting}
                className="
                  flex-1 px-4 py-2 rounded-lg
                  border border-red-400/40 bg-red-500/20 text-red-300
                  hover:bg-red-500/30 transition font-semibold text-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {deleting ? "Eliminando..." : "Sí, Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
