import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  Box
} from '@mui/material';

const TableForm = ({ open, onClose, onSave, table = null, isSaving = false }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    capacidad: 4,
    tipo: 'rectangular',
    disponible: true,
    width: 100,
    height: 60,
    x: 100,
    y: 100,
    rotation: 0,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (table) {
      setFormData({
        nombre: table.nombre || '',
        capacidad: table.capacidad || 4,
        tipo: table.tipo || 'rectangular',
        disponible: table.disponible !== false, // Default to true if not set
        width: table.width || 100,
        height: table.height || (table.tipo === 'round' ? 100 : 60),
        x: table.x || 100,
        y: table.y || 100,
        rotation: table.rotation || 0,
      });
    } else {
      setFormData({
        nombre: '',
        capacidad: 4,
        tipo: 'rectangular',
        disponible: true,
        width: 100,
        height: 60,
        x: 100,
        y: 100,
        rotation: 0,
      });
    }
    setErrors({});
  }, [table, open]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la mesa es requerido';
    }
    if (!formData.capacidad || formData.capacidad < 1) {
      newErrors.capacidad = 'La capacidad debe ser al menos 1';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        // Ensure we don't send empty strings for numeric values
        capacidad: Number(formData.capacidad),
        width: Number(formData.width),
        height: Number(formData.height),
        x: Number(formData.x),
        y: Number(formData.y),
        rotation: Number(formData.rotation),
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{table ? 'Editar Mesa' : 'Nueva Mesa'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Nombre de la mesa"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                label="Capacidad"
                name="capacidad"
                type="number"
                inputProps={{ min: 1 }}
                value={formData.capacidad}
                onChange={handleChange}
                error={!!errors.capacidad}
                helperText={errors.capacidad}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="table-type-label">Tipo de mesa</InputLabel>
                <Select
                  labelId="table-type-label"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo de mesa"
                >
                  <MenuItem value="rectangular">Rectangular</MenuItem>
                  <MenuItem value="round">Redonda</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Estado:
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.disponible}
                      onChange={(e) => 
                        setFormData(prev => ({
                          ...prev,
                          disponible: e.target.checked
                        }))
                      }
                      name="disponible"
                      color="primary"
                    />
                  }
                  label={formData.disponible ? 'Disponible' : 'Ocupada'}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ mt: 1 }}>
                * La posición y rotación se pueden ajustar directamente en el plano arrastrando y rotando la mesa.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TableForm;
