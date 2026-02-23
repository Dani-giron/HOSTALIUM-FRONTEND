import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { ESTADO_RESERVA, RESERVA_COLORS, RESERVA_TEXTS } from '../../constants/reservaStates';

const ReservaStatusSelect = ({ value, onChange, label = 'Estado de Reserva', ...props }) => {
  return (
    <FormControl fullWidth {...props}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
      >
        {Object.entries(ESTADO_RESERVA).map(([key, estado]) => (
          <MenuItem key={key} value={estado}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: RESERVA_COLORS[estado]
                }}
              />
              <Typography variant="body2">
                {RESERVA_TEXTS[estado]}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ReservaStatusSelect;
