import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { obtenerReservas } from '../services/reservas';

const ReservasContext = createContext();

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastReservaId, setLastReservaId] = useState(null);

  // Función estable para cargar reservas (sin dependencias que cambien)
  const cargarReservas = useCallback(async () => {
    try {
      const hoy = new Date().toISOString().split('T')[0];
      const data = await obtenerReservas({ fecha: hoy });
      setReservas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setLoading(false);
    }
  }, []); // Sin dependencias - función estable

  // Detección de nuevas reservas separada (ajuste 3)
  useEffect(() => {
    if (reservas.length > 0) {
      const maxId = Math.max(...reservas.map(r => r.id));
      
      // Inicializar lastReservaId en primera carga
      if (lastReservaId === null) {
        setLastReservaId(maxId);
      }
      // Nota: La detección de nuevas reservas se hace en NotificationContext
      // para mantener separación de responsabilidades
    }
  }, [reservas, lastReservaId]);

  // Polling unificado SOLO para reservas (10s) - TIEMPO REAL
  useEffect(() => {
    // Carga inicial
    cargarReservas();

    let intervalId = null;
    
    const startPolling = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          cargarReservas();
        }
      }, 10000); // 10 segundos - tiempo real
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
        cargarReservas(); // Recargar inmediatamente al volver
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
  }, [cargarReservas]);

  return (
    <ReservasContext.Provider value={{ reservas, loading, recargar: cargarReservas }}>
      {children}
    </ReservasContext.Provider>
  );
}

export const useReservas = () => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error('useReservas debe usarse dentro de ReservasProvider');
  }
  return context;
};
