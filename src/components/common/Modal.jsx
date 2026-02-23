import { X } from 'lucide-react';
import { useModalAnimation } from '../../hooks/useModalAnimation';

/**
 * Componente Modal base unificado - Versión ligera y escalable
 * Diseño minimalista con estética Hostalium
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-sm',
  showCloseButton = true,
  className = '',
}) {
  const { isClosing, handleClose } = useModalAnimation(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-3 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-[#1b1923] w-full ${maxWidth} rounded-xl border border-white/10 shadow-xl text-white transition-all duration-200 ${
          isClosing ? 'opacity-0 scale-95 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
        } ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Solo si hay título o botón cerrar */}
        {(title || subtitle || showCloseButton) && (
          <div className="flex items-start justify-between p-4 border-b border-white/10">
            <div className="flex-1 pr-3">
              {subtitle && (
                <p className="text-xs uppercase tracking-wider text-white/40 mb-1">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="text-xl font-semibold text-white">{title}</h2>
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-white/50 transition-colors"
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 pt-3 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Campo de información dentro del modal
 */
export function ModalField({ label, value, icon: Icon, className = '' }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-lg p-3 ${className}`}>
      {Icon ? (
        <div className="flex items-start gap-2.5">
          <Icon size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
              {label}
            </div>
            <div className="text-sm text-white break-words">{value || '—'}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-xs uppercase tracking-wider text-white/40 mb-1">
            {label}
          </div>
          <div className="text-sm text-white break-words">{value || '—'}</div>
        </>
      )}
    </div>
  );
}

/**
 * Alerta dentro del modal
 */
export function ModalAlert({ 
  type = 'info', 
  icon: Icon, 
  title, 
  message, 
  children,
  className = '' 
}) {
  const styles = {
    info: {
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/30',
      text: 'text-indigo-400',
      iconColor: 'text-indigo-400'
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      iconColor: 'text-green-400'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      iconColor: 'text-yellow-400'
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      iconColor: 'text-red-400'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-2.5">
        {Icon && (
          <Icon size={16} className={`${style.iconColor} flex-shrink-0 mt-0.5`} />
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <div className={`text-xs uppercase tracking-wider ${style.text} mb-1 font-semibold`}>
              {title}
            </div>
          )}
          {message && (
            <div className="text-sm text-white mb-2 break-words">{message}</div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Botón del footer del modal
 */
export function ModalButton({ 
  variant = 'primary', 
  children, 
  onClick, 
  disabled = false,
  className = '',
  type = 'button',
  ...props 
}) {
  const baseClasses = 'flex-1 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg',
    secondary: 'bg-white/10 border border-white/20 text-white/80',
    danger: 'bg-red-500/20 border border-red-500/30 text-red-300'
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
