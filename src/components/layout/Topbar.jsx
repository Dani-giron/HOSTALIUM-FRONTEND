import { useState, useEffect, useRef } from 'react';
import { Menu, LogOut, Bell, User, X, Calendar, Users } from 'lucide-react';
import { clearToken } from '../../services/auth';
import { useNotifications } from '../../context/NotificationContext';

const Topbar = ({ sidebarOpen, onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const topbarRef = useRef(null);
  const notificationsRef = useRef(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, showModal } = useNotifications();

  // Cerrar los menús desplegables al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (topbarRef.current && !topbarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    if (isOpen || notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, notificationsOpen]);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    showModal(notification.reserva);
    setNotificationsOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  return (
    <div 
      ref={topbarRef}
      className="
        fixed top-0 left-0 right-0 h-16
        backdrop-blur-md
        bg-gradient-to-r from-[#0f0a1e]/80 via-[#0f0a1e]/70 to-[#1a0f3d]/80
        border-b border-white/10
        text-white
        shadow-lg
        z-40
      "
    >
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Botón de menú (solo visible cuando sidebar está cerrada) */}
        <button
          onClick={onToggleSidebar}
          className={`
            p-2 rounded-lg
            bg-gradient-to-br from-[#9b5cff] to-[#5fb4ff]
            text-white
            shadow-lg
            hover:opacity-90
            transition-all duration-300
            ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}
          `}
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        {/* Título/Logo (centro) */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] bg-clip-text text-transparent">
            HOSTALIUM
          </h1>
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notificaciones */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown de notificaciones */}
            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 max-h-96 overflow-y-auto backdrop-blur-md bg-gradient-to-b from-[#0f0a1e]/95 to-[#1a0f3d]/95 border border-white/10 rounded-lg shadow-2xl z-50">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Notificaciones</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Marcar todas como leídas
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    No hay notificaciones
                  </div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-purple-500/10' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                            !notification.read ? 'bg-purple-400' : 'bg-transparent'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar size={14} className="text-purple-400 flex-shrink-0" />
                              <span className="text-xs text-gray-400">
                                {formatDate(notification.createdAt)}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-white mb-1">
                              Nueva reserva: {notification.reserva.nombreCliente}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Users size={12} />
                                {notification.reserva.numPersonas} personas
                              </span>
                              {notification.reserva.mesa && (
                                <span>Mesa: {notification.reserva.mesa.nombre}</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="flex-shrink-0 p-1 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                            aria-label="Eliminar notificación"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menú de usuario */}
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              aria-label="Menú de usuario"
            >
              <User size={20} />
            </button>

            {/* Menú desplegable */}
            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 backdrop-blur-md bg-gradient-to-b from-[#0f0a1e]/90 to-[#1a0f3d]/90 border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;

