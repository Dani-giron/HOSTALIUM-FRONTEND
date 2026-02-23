import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useReservas } from './ReservasContext';
import Toast from '../components/common/Toast';
import ReservaModal from '../components/modals/ReservaModal';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { reservas } = useReservas(); // Usa reservas del context (sin polling propio)
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);
  const [lastReservaId, setLastReservaId] = useState(null);
  const [notifications, setNotifications] = useState([]); // Array de notificaciones guardadas

  // Función para mostrar toast
  const showToast = useCallback((message, type = 'success', duration = 5000, reserva = null) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration, reserva }]);
    return id;
  }, []);

  // Función para mostrar modal
  const showModal = useCallback((reserva) => {
    setModal(reserva);
  }, []);

  // Función para cerrar toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Función para cerrar modal
  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  // Función para agregar notificación guardada
  const addNotification = useCallback((reserva) => {
    const notification = {
      id: Date.now(),
      reservaId: reserva.id,
      reserva,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notification, ...prev]);
    return notification.id;
  }, []);

  // Función para marcar notificación como leída
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  // Función para marcar todas como leídas
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Función para eliminar notificación
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);

  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  // Detectar nuevas reservas reactivamente (sin polling propio)
  // Reacciona a cambios en reservas del ReservasContext
  useEffect(() => {
    if (reservas.length > 0) {
      const maxId = Math.max(...reservas.map(r => r.id));
      
      // Inicializar lastReservaId en primera carga
      if (lastReservaId === null) {
        setLastReservaId(maxId);
        return;
      }
      
      // Detectar nuevas reservas
      if (maxId > lastReservaId) {
        const nuevasReservas = reservas.filter(r => r.id > lastReservaId);
        
        // Procesar cada nueva reserva
        nuevasReservas.forEach(reserva => {
          addNotification(reserva);
        });
        
        // Mostrar notificación solo para la más reciente
        if (nuevasReservas.length > 0) {
          const masReciente = nuevasReservas[0];
          showToast('¡Nueva reserva recibida!', 'success', 5000, masReciente);
        }
        
        setLastReservaId(maxId);
      }
    }
  }, [reservas, lastReservaId, showToast, addNotification]);

  const value = {
    showToast,
    showModal,
    closeModal,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Renderizar toasts */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            reserva={toast.reserva}
            onClose={() => removeToast(toast.id)}
            onClick={() => {
              if (toast.reserva) {
                showModal(toast.reserva);
              }
            }}
          />
        ))}
      </div>

      {/* Renderizar modal */}
      {modal && (
        <ReservaModal
          reserva={modal}
          onClose={closeModal}
          onNueva={closeModal}
        />
      )}
    </NotificationContext.Provider>
  );
};

