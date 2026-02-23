import { useState, useEffect, useRef } from 'react';

/**
 * Hook reutilizable para manejar animaciones de cierre en modales
 * Resetea automáticamente el estado cuando el modal se abre de nuevo
 * @param {Function} onClose - Función a llamar cuando el modal se cierra
 * @param {boolean} isOpen - Si el modal está abierto (para resetear estado)
 * @param {number} closeDelay - Delay en ms antes de cerrar (default: 250)
 * @returns {Object} { isClosing, handleClose }
 */
export const useModalAnimation = (onClose, isOpen = true, closeDelay = 250) => {
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Resetear estado cuando el modal se abre de nuevo
  useEffect(() => {
    isMountedRef.current = true;
    
    // Si el modal se abre, resetear siempre el estado de cierre
    if (isOpen) {
      setIsClosing(false);
      // Limpiar timeout si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    // Limpiar al desmontar
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isOpen]);

  const handleClose = () => {
    // Evitar múltiples cierres
    if (isClosing || !isMountedRef.current) return;
    
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        onClose();
      }
      timeoutRef.current = null;
    }, closeDelay);
  };

  return { isClosing, handleClose };
};
