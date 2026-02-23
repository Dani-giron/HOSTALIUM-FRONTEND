import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 5000, reserva = null, onClick }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClick = () => {
    if (onClick && reserva) {
      onClick();
    }
  };

  // Icono según el tipo
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="toast-icon" size={20} />;
      case 'warning':
        return <AlertTriangle className="toast-icon" size={20} />;
      case 'info':
        return <Info className="toast-icon" size={20} />;
      default:
        return <CheckCircle className="toast-icon" size={20} />;
    }
  };

  return (
    <div 
      className={`toast-notification toast-${type} ${reserva ? 'toast-clickable' : ''}`}
      onClick={handleClick}
    >
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
        {reserva && (
          <span className="toast-hint">(Haz clic para ver detalles)</span>
        )}
      </div>
      <button 
        className="toast-close" 
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }} 
        aria-label="Cerrar"
      >
        <X size={16} />
      </button>
    </div>
  );
}

