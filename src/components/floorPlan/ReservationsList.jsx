import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Phone as PhoneIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  CheckCircle as CheckIcon
} from 'lucide-react';

export default function ReservationsList({ reservations, onTableSelect }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'CONFIRMADA': return 'Confirmada';
      case 'PENDIENTE': return 'Pendiente';
      case 'CANCELADA': return 'Cancelada';
      default: return estado;
    }
  };

  // Ordenar reservas por hora
  const sortedReservations = [...reservations].sort((a, b) => 
    new Date(a.fecha) - new Date(b.fecha)
  );

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {sortedReservations.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            color: 'rgba(255,255,255,0.4)'
          }}>
            <Typography variant="body2">
              No hay reservas para hoy
            </Typography>
          </Box>
        ) : (
          <List dense sx={{ p: 0 }}>
            {sortedReservations.map((reservation, index) => (
              <ListItem
                key={reservation.id || index}
                sx={{ 
                  mb: 1,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)'
                  },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => {
                  // Si tiene mesa asignada, seleccionar la mesa
                  if (reservation.mesaId && onTableSelect) {
                    onTableSelect({ id: reservation.mesaId });
                  }
                }}
              >
                <Box sx={{ width: '100%' }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {formatTime(reservation.fecha)}
                      </Typography>
                      {reservation.telefono && (
                        <Tooltip title="Reserva telefónica">
                          <PhoneIcon size={16} className="text-blue-400" />
                        </Tooltip>
                      )}
                    </Box>
                    <Chip
                      label={getStatusText(reservation.estado)}
                      color={getStatusColor(reservation.estado)}
                      size="small"
                      variant="filled"
                    />
                  </Box>

                  {/* Customer Info */}
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                      {reservation.nombreCliente}
                    </Typography>
                  </Box>

                  {/* Details */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'rgba(255,255,255,0.6)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <UsersIcon size={16} />
                      <Typography variant="caption">
                        {reservation.numeroPersonas} {reservation.numeroPersonas === 1 ? 'persona' : 'personas'}
                      </Typography>
                    </Box>
                    
                    {reservation.mesaId && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckIcon size={16} />
                        <Typography variant="caption">
                          Mesa {reservation.mesaId}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Notes */}
                  {reservation.notas && (
                    <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {reservation.notas}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
