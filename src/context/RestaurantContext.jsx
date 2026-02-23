import { createContext, useContext, useState, useEffect } from 'react';

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [nombreRestaurante, setNombreRestaurante] = useState(() => {
    // Leer de localStorage si existe (para renderizado inmediato)
    return localStorage.getItem('restaurantName') || '';
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Si no hay token, limpiar el nombre
      setNombreRestaurante('');
      localStorage.removeItem('restaurantName');
      return;
    }

    // Si ya tenemos el nombre en localStorage, no hacer fetch inmediatamente
    // Pero sí hacerlo en background para actualizar si es necesario
    const base = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    
    // Usar requestIdleCallback si está disponible para no bloquear el render
    const fetchRestaurantName = () => {
      fetch(`${base}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        // Prioridad baja para no bloquear renderizado
        priority: 'low',
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('No autorizado'))))
        .then((data) => {
          const nombre =
            data?.data?.restaurante?.nombre ??
            data?.restaurante?.nombre ??
            data?.data?.nombre ??
            data?.nombre ??
            '';
          if (nombre) {
            setNombreRestaurante(nombre);
            localStorage.setItem('restaurantName', nombre);
          }
        })
        .catch(() => {
          // Si falla, mantener el nombre del localStorage si existe
        });
    };

    // Si no hay nombre en cache, hacer fetch inmediatamente pero de forma no bloqueante
    const cachedName = localStorage.getItem('restaurantName');
    if (!cachedName) {
      // Usar setTimeout para no bloquear el render inicial
      setTimeout(fetchRestaurantName, 0);
    } else {
      // Si hay cache, hacer fetch en background para actualizar
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(fetchRestaurantName, { timeout: 2000 });
      } else {
        setTimeout(fetchRestaurantName, 100);
      }
    }
  }, []);

  return (
    <RestaurantContext.Provider value={nombreRestaurante}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  return useContext(RestaurantContext) || '';
}

