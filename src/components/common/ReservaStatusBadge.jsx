import React from 'react';
import { Chip } from '@mui/material';
import { ESTADO_RESERVA, RESERVA_COLORS, RESERVA_TEXTS } from '../../constants/reservaStates';

const ReservaStatusBadge = ({ estado, size = 'small' }) => {
  const getStatusConfig = () => {
    switch (estado) {
      case ESTADO_RESERVA.PENDIENTE:
        return {
          color: 'warning',
          bgcolor: '#FFF3E0',
          textcolor: '#E65100',
          icon: '⏳'
        };
      case ESTADO_RESERVA.CONFIRMADA:
        return {
          color: 'primary',
          bgcolor: '#E3F2FD',
          textcolor: '#1565C0',
          icon: '✅'
        };
      case ESTADO_RESERVA.CANCELADA:
        return {
          color: 'default',
          bgcolor: '#F5F5F5',
          textcolor: '#616161',
          icon: '❌'
        };
      case ESTADO_RESERVA.COMPLETADA:
        return {
          color: 'success',
          bgcolor: '#E8F5E8',
          textcolor: '#2E7D32',
          icon: '✓'
        };
      default:
        return {
          color: 'default',
          bgcolor: '#F5F5F5',
          textcolor: '#616161',
          icon: '?'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Chip
      size={size}
      label={`${config.icon} ${RESERVA_TEXTS[estado] || 'Desconocido'}`}
      sx={{
        backgroundColor: config.bgcolor,
        color: config.textcolor,
        fontWeight: 500,
        '& .MuiChip-label': {
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }
      }}
    />
  );
};

export default ReservaStatusBadge;
