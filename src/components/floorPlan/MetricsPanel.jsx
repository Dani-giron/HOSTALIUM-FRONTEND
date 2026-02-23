import { Box, Typography, Grid } from '@mui/material';
import { 
  Utensils as TableIcon,
  Users as UsersIcon,
  CheckCircle as AvailableIcon,
  XCircle as OccupiedIcon
} from 'lucide-react';

export default function MetricsPanel({ metrics }) {
  const {
    totalTables,
    availableTables,
    occupiedTables,
    totalSeats,
    occupiedSeats,
    guests
  } = metrics;

  return (
    <Box sx={{ 
      bgcolor: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 2,
      p: 2
    }}>
      <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
        Disponibilidad
      </Typography>
      
      <Grid container spacing={2}>
        {/* Tables Available */}
        <Grid item xs={6}>
          <Box sx={{ 
            bgcolor: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: 1.5,
            p: 2,
            textAlign: 'center'
          }}>
            <AvailableIcon size={24} className="text-green-400 mb-1" />
            <Typography variant="h4" sx={{ color: '#4ade80', fontWeight: 'bold' }}>
              {availableTables}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
              Mesas Libres
            </Typography>
          </Box>
        </Grid>

        {/* Tables Occupied */}
        <Grid item xs={6}>
          <Box sx={{ 
            bgcolor: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 1.5,
            p: 2,
            textAlign: 'center'
          }}>
            <OccupiedIcon size={24} className="text-red-400 mb-1" />
            <Typography variant="h4" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
              {occupiedTables}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
              Mesas Ocupadas
            </Typography>
          </Box>
        </Grid>

        {/* Total Tables */}
        <Grid item xs={6}>
          <Box sx={{ 
            bgcolor: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.3)',
            borderRadius: 1.5,
            p: 2,
            textAlign: 'center'
          }}>
            <TableIcon size={24} className="text-blue-400 mb-1" />
            <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
              {totalTables}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
              Total Mesas
            </Typography>
          </Box>
        </Grid>

        {/* Guests */}
        <Grid item xs={6}>
          <Box sx={{ 
            bgcolor: 'rgba(168,85,247,0.1)',
            border: '1px solid rgba(168,85,247,0.3)',
            borderRadius: 1.5,
            p: 2,
            textAlign: 'center'
          }}>
            <UsersIcon size={24} className="text-purple-400 mb-1" />
            <Typography variant="h4" sx={{ color: '#a855f7', fontWeight: 'bold' }}>
              {guests}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
              Clientes
            </Typography>
          </Box>
        </Grid>

        {/* Seats Info */}
        <Grid item xs={12}>
          <Box sx={{ 
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 1,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Capacidad Total
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                {totalSeats} asientos
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Ocupados
              </Typography>
              <Typography variant="h6" sx={{ color: '#ef4444', fontWeight: 'bold' }}>
                {occupiedSeats} asientos
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
