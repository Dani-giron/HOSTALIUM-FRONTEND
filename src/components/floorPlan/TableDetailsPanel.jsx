import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Chip,
  Divider,
  Grid
} from '@mui/material';
import { 
  X as CloseIcon,
  Edit as EditIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  CheckCircle as CheckIcon
} from 'lucide-react';

export default function TableDetailsPanel({ table, onClose }) {
  if (!table) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'error';
      case 'pending': return 'warning';
      case 'unavailable': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Libre';
      case 'occupied': return 'Ocupada';
      case 'pending': return 'Pendiente';
      case 'unavailable': return 'No disponible';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckIcon size={16} />;
      case 'occupied': return <XIcon size={16} />;
      case 'pending': return <ClockIcon size={16} />;
      case 'unavailable': return <XIcon size={16} />;
      default: return null;
    }
  };

  return (
    <Box sx={{ 
      bgcolor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 2,
      p: 2,
      position: 'relative'
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Detalles de Mesa
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)' }}>
          <CloseIcon size={20} />
        </IconButton>
      </Box>

      {/* Table Info */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          {table.nombre}
        </Typography>
        
        <Chip
          icon={getStatusIcon(table.status)}
          label={getStatusText(table.status)}
          color={getStatusColor(table.status)}
          variant="filled"
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <UsersIcon size={24} className="text-blue-400 mb-1" />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {table.capacidad || 4}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Capacidad
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: table.tipo === 'round' ? '50%' : '4px',
                bgcolor: table.tipo === 'round' ? '#3b82f6' : '#10b981',
                mx: 'auto',
                mb: 1
              }} />
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {table.tipo === 'round' ? 'Redonda' : 'Rectangular'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Tipo
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 2 }} />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
        {table.status === 'available' && (
          <Button
            variant="contained"
            startIcon={<CheckIcon size={18} />}
            sx={{ 
              bgcolor: '#4ade80',
              '&:hover': { bgcolor: '#22c55e' },
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            Marcar como Ocupada
          </Button>
        )}

        {table.status === 'occupied' && (
          <Button
            variant="contained"
            startIcon={<XIcon size={18} />}
            sx={{ 
              bgcolor: '#ef4444',
              '&:hover': { bgcolor: '#dc2626' },
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            Liberar Mesa
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<EditIcon size={18} />}
          sx={{ 
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'rgba(255,255,255,0.8)',
            '&:hover': { 
              borderColor: 'rgba(255,255,255,0.5)',
              bgcolor: 'rgba(255,255,255,0.05)'
            }
          }}
        >
          Editar Mesa
        </Button>
      </Box>

      {/* Additional Info */}
      {table.ubicacion && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            Ubicación: {table.ubicacion}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
