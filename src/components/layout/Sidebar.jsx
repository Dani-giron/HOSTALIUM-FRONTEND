import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Home, Calendar, List, Settings, LogOut, Clock, Utensils } from 'lucide-react';
import { clearToken } from '../../services/auth';

const Sidebar = ({ isOpen: isOpenProp, onToggle }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');
  const sidebarRef = useRef(null);

  // Usar prop si está disponible, sino usar estado interno
  const isOpen = isOpenProp !== undefined ? isOpenProp : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  // Cerrar el sidebar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // Verificar si el clic no fue en el botón del menú
        const menuButton = document.querySelector('.menu-button');
        if (menuButton && !menuButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    // Agregar el event listener cuando el sidebar está abierto
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpiar el event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Establecer el ítem activo basado en la ruta actual
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveItem('inicio');
    else if (path === '/crear-reserva') setActiveItem('crear-reserva');
    else if (path === '/reservas') setActiveItem('reservas');
    else if (path === '/waitlist') setActiveItem('waitlist');
    else if (path === '/mesas') setActiveItem('mesas');
  }, [location]);

  const menuItems = [
    { id: 'inicio', icon: <Home size={24} />, text: 'Inicio', path: '/' },
    { id: 'crear-reserva', icon: <Calendar size={24} />, text: 'Crear Reserva', path: '/crear-reserva' },
    { id: 'reservas', icon: <List size={24} />, text: 'Ver Reservas', path: '/reservas' },
    { id: 'waitlist', icon: <Clock size={24} />, text: 'Lista de Espera', path: '/waitlist' },
    { id: 'mesas', icon: <Utensils size={24} />, text: 'Mesas', path: '/mesas' },
  ];

  const handleLogout = () => {
    clearToken();
    window.location.href = "/login";
  };

  const bottomMenuItems = [
    { id: 'configuracion', icon: <Settings size={24} />, text: 'Configuración', path: '/configuracion' },
    { id: 'cerrar-sesion', icon: <LogOut size={24} />, text: 'Cerrar Sesión', onClick: handleLogout },
  ];

  return (
    <>
      {/* Botón de menú flotante - solo si no hay prop onToggle */}
      {!onToggle && (
        <button 
          onClick={() => setIsOpen(true)}
          className={`fixed top-4 left-4 z-50 p-3 rounded-full bg-gradient-to-br from-[#9b5cff] to-[#5fb4ff] text-white shadow-lg transition-all duration-300 menu-button ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          style={{ transition: 'opacity 0.3s' }}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Capa de superposición */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#0f0a1e] to-[#1a0f3d] text-white transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
        style={{ width: '280px' }}
      >
        <div className="flex flex-col h-full">
          {/* Encabezado del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] bg-clip-text text-transparent">HOSTALIUM</h1>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-white transition-colors"
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menú principal */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      activeItem === item.id 
                        ? 'bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] text-white shadow-[0_0_15px_rgba(155,92,255,0.3)]' 
                        : 'text-gray-200'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="ml-3">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Menú inferior */}
          <div className="border-t border-white/10 p-4">
            <ul className="space-y-2">
              {bottomMenuItems.map((item) => (
                <li key={item.id}>
                  <div
                    className="flex items-center p-3 rounded-lg text-gray-300 transition-colors cursor-pointer"
                    onClick={() => {
                      setIsOpen(false);
                      if (item.onClick) item.onClick();
                      else window.location.href = item.path;
                    }}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className="ml-3">{item.text}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;