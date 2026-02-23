import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Save, Restaurant, People, AssignmentTurnedIn } from '@mui/icons-material';
import { getConfig, updateConfig } from '../../services/config';

const RestaurantTab = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [settings, setSettings] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    aforoTotal: null,
    maxPersonasReserva: null,
    duracionReserva: 90,
    autoAsignacion: false
  });

  const [tempSettings, setTempSettings] = useState({ ...settings });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await getConfig();
      
      if (response.success) {
        const configData = {
          nombre: response.data.nombre || '',
          direccion: response.data.direccion || '',
          telefono: response.data.telefono || '',
          email: response.data.email || '',
          aforoTotal: response.data.aforoTotal,
          maxPersonasReserva: response.data.maxPersonasReserva,
          duracionReserva: response.data.duracionReserva || 90,
          autoAsignacion: response.data.autoAsignacion || false
        };
        
        setSettings(configData);
        setTempSettings(configData);
      } else {
        showSnackbar('Error al cargar la configuración', 'error');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      showSnackbar(error.message || 'Error al cargar la configuración', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);
      
      // Validaciones
      if (tempSettings.aforoTotal && (tempSettings.aforoTotal < 1 || tempSettings.aforoTotal > 1000)) {
        showSnackbar('El aforo máximo debe estar entre 1 y 1000', 'error');
        return;
      }
      
      if (tempSettings.maxPersonasReserva && (tempSettings.maxPersonasReserva < 1 || tempSettings.maxPersonasReserva > 100)) {
        showSnackbar('El máximo de personas por reserva debe estar entre 1 y 100', 'error');
        return;
      }
      
      if (tempSettings.duracionReserva && (tempSettings.duracionReserva < 15 || tempSettings.duracionReserva > 480)) {
        showSnackbar('La duración de reserva debe estar entre 15 y 480 minutos', 'error');
        return;
      }
      
      if (tempSettings.aforoTotal && tempSettings.maxPersonasReserva && tempSettings.maxPersonasReserva > tempSettings.aforoTotal) {
        showSnackbar('El máximo de personas por reserva no puede ser mayor al aforo máximo', 'error');
        return;
      }

      if (tempSettings.email && tempSettings.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(tempSettings.email)) {
          showSnackbar('El email debe tener un formato válido', 'error');
          return;
        }
      }

      // Preparar datos para enviar (solo campos modificados)
      const updateData = {};
      
      if (tempSettings.nombre !== settings.nombre) {
        updateData.nombre = tempSettings.nombre || null;
      }
      if (tempSettings.direccion !== settings.direccion) {
        updateData.direccion = tempSettings.direccion || null;
      }
      if (tempSettings.telefono !== settings.telefono) {
        updateData.telefono = tempSettings.telefono || null;
      }
      if (tempSettings.email !== settings.email) {
        updateData.email = tempSettings.email || null;
      }
      if (tempSettings.aforoTotal !== settings.aforoTotal) {
        updateData.aforoTotal = tempSettings.aforoTotal;
      }
      if (tempSettings.maxPersonasReserva !== settings.maxPersonasReserva) {
        updateData.maxPersonasReserva = tempSettings.maxPersonasReserva;
      }
      if (tempSettings.duracionReserva !== settings.duracionReserva) {
        updateData.duracionReserva = tempSettings.duracionReserva;
      }
      if (tempSettings.autoAsignacion !== settings.autoAsignacion) {
        updateData.autoAsignacion = tempSettings.autoAsignacion;
      }

      const response = await updateConfig(updateData);
      
      if (response.success) {
        setSettings(tempSettings);
        showSnackbar('Configuración guardada correctamente', 'success');
      } else {
        showSnackbar('Error al guardar la configuración', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showSnackbar(error.message || 'Error al guardar la configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    let value;
    
    if (field === 'autoAsignacion') {
      value = event.target.checked;
    } else if (['nombre', 'direccion', 'telefono', 'email'].includes(field)) {
      value = event.target.value;
    } else {
      value = parseInt(event.target.value) || null;
    }
    
    setTempSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    setTempSettings({
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      aforoTotal: null,
      maxPersonasReserva: null,
      duracionReserva: 90,
      autoAsignacion: false
    });
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(tempSettings);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Configuración del Restaurante
      </Typography>

      <Grid container spacing={3}>
        {/* Información del Negocio */}
        <Grid xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Información del Negocio
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Restaurante"
                    value={tempSettings.nombre}
                    onChange={handleInputChange('nombre')}
                    sx={{ mb: 2 }}
                    helperText="Nombre comercial del restaurante"
                  />
                </Grid>
                
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email de Contacto"
                    type="email"
                    value={tempSettings.email}
                    onChange={handleInputChange('email')}
                    sx={{ mb: 2 }}
                    helperText="Email para notificaciones y contacto"
                  />
                </Grid>
                
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    value={tempSettings.telefono}
                    onChange={handleInputChange('telefono')}
                    sx={{ mb: 2 }}
                    helperText="Teléfono de contacto del restaurante"
                  />
                </Grid>
                
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    value={tempSettings.direccion}
                    onChange={handleInputChange('direccion')}
                    sx={{ mb: 2 }}
                    helperText="Dirección física del restaurante"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* Configuración de Aforo */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 2, color: '#9b5cff' }} />
                <Typography variant="h6">Aforo Máximo</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Aforo máximo de personas"
                type="number"
                value={tempSettings.aforoTotal || ''}
                onChange={handleInputChange('aforoTotal')}
                inputProps={{ min: 1, max: 1000 }}
                sx={{ mb: 2 }}
                helperText="Número máximo de personas permitidas en el restaurante"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Reservas */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentTurnedIn sx={{ mr: 2, color: '#9b5cff' }} />
                <Typography variant="h6">Configuración de Reservas</Typography>
              </Box>
              
              <TextField
                fullWidth
                label="Máximo de personas por reserva"
                type="number"
                value={tempSettings.maxPersonasReserva || ''}
                onChange={handleInputChange('maxPersonasReserva')}
                inputProps={{ min: 1, max: 100 }}
                sx={{ mb: 2 }}
                helperText="Número máximo de personas permitidas en una sola reserva"
              />
              
              <TextField
                fullWidth
                label="Duración estándar de reserva (minutos)"
                type="number"
                value={tempSettings.duracionReserva}
                onChange={handleInputChange('duracionReserva')}
                inputProps={{ min: 15, max: 480 }}
                sx={{ mb: 2 }}
                helperText="Tiempo estándar para cada reserva (15-480 minutos)"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Configuración de Autoasignador */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Restaurant sx={{ mr: 2, color: '#9b5cff' }} />
                <Typography variant="h6">Autoasignador</Typography>
              </Box>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={tempSettings.autoAsignacion}
                    onChange={handleInputChange('autoAsignacion')}
                    color="primary"
                  />
                }
                label="Activar autoasignador de mesas"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary">
                El autoasignador asignará automáticamente las mesas a las reservas según la disponibilidad y capacidad.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen de Configuración */}
        <Grid xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Configuración
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nombre: <strong>{tempSettings.nombre || 'No configurado'}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email: <strong>{tempSettings.email || 'No configurado'}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: <strong>{tempSettings.telefono || 'No configurado'}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Aforo máximo: <strong>{tempSettings.aforoTotal ? `${tempSettings.aforoTotal} personas` : 'No configurado'}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Máximo por reserva: <strong>{tempSettings.maxPersonasReserva ? `${tempSettings.maxPersonasReserva} personas` : 'No configurado'}</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Duración de reserva: <strong>{tempSettings.duracionReserva} minutos</strong>
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Autoasignador: <strong>{tempSettings.autoAsignacion ? 'Activado' : 'Desactivado'}</strong>
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {tempSettings.aforoTotal && tempSettings.maxPersonasReserva && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Reservas simultáneas máximas: <strong>{Math.floor(tempSettings.aforoTotal / tempSettings.maxPersonasReserva)}</strong>
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botones de Acción */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={resetToDefaults}
          disabled={isSaving}
        >
          Restablecer Valores por Defecto
        </Button>
        
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={saveSettings}
          disabled={!hasChanges || isSaving}
          sx={{ minWidth: 120 }}
        >
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RestaurantTab;
