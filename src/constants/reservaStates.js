// Estados de reserva basados en el schema Prisma
export const ESTADO_RESERVA = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADA: 'CONFIRMADA', 
  CANCELADA: 'CANCELADA',
  COMPLETADA: 'COMPLETADA'
};

// Mapeo a estados visuales de mesas
export const ESTADO_MESA_DE_RESERVA = {
  PENDIENTE: 'pending',      // En espera
  CONFIRMADA: 'pending',     // Reservada
  CANCELADA: 'available',    // Disponible (cancelaron)
  COMPLETADA: 'available'    // Disponible (se fue)
};

// Colores para cada estado
export const RESERVA_COLORS = {
  PENDIENTE: '#FF9800',    // Ámbar
  CONFIRMADA: '#2196F3',   // Azul  
  CANCELADA: '#9E9E9E',    // Gris
  COMPLETADA: '#4CAF50'     // Verde
};

// Textos en español
export const RESERVA_TEXTS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CANCELADA: 'Cancelada', 
  COMPLETADA: 'Completada'
};
