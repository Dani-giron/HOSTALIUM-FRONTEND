import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Paper,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const notificationTypes = [
  { id: 'newOrder', label: 'Nuevo Pedido', defaultSound: 'ding.mp3' },
  { id: 'orderReady', label: 'Pedido Listo', defaultSound: 'bell.mp3' },
  { id: 'waiterCall', label: 'Llamada de Camarero', defaultSound: 'chime.mp3' },
  { id: 'tableReady', label: 'Mesa Preparada', defaultSound: 'notification.mp3' },
  { id: 'paymentRequest', label: 'Solicitud de Cuenta', defaultSound: 'cash_register.mp3' },
  { id: 'kitchenAlert', label: 'Alerta de Cocina', defaultSound: 'alert.mp3' },
  { id: 'reservation', label: 'Nueva Reserva', defaultSound: 'chime.mp3' },
  { id: 'lowStock', label: 'Stock Bajo', defaultSound: 'alert.mp3' },
];

const soundOptions = [
  { value: 'ding.mp3', label: 'Timbre' },
  { value: 'bell.mp3', label: 'Campana' },
  { value: 'chime.mp3', label: 'Campanilla' },
  { value: 'notification.mp3', label: 'Notificación' },
  { value: 'cash_register.mp3', label: 'Caja Registradora' },
  { value: 'alert.mp3', label: 'Alerta' },
];

const NotificationsTab = () => {
  const [settings, setSettings] = useState({
    globalVolume: 70,
    notifications: notificationTypes.reduce((acc, type) => ({
      ...acc,
      [type.id]: {
        enabled: true,
        sound: type.defaultSound,
        volume: 70,
        mobilePush: true,
        desktopNotifications: true,
        soundEnabled: true
      }
    }), {})
  });

  const handleGlobalVolumeChange = (event, newValue) => {
    setSettings(prev => ({
      ...prev,
      globalVolume: newValue
    }));
  };

  const handleNotificationToggle = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [id]: {
          ...prev.notifications[id],
          [field]: value
        }
      }
    }));
  };

  const handleSoundChange = (id, sound) => {
    handleNotificationToggle(id, 'sound', sound);
  };

  const handleVolumeChange = (id, volume) => {
    handleNotificationToggle(id, 'volume', volume);
  };

  const playSound = (soundFile) => {
    // In a real app, you would play the actual sound file
    console.log('Playing sound:', soundFile);
    // Example: new Audio(`/sounds/${soundFile}`).play();
  };

  const saveSettings = () => {
    console.log('Saving notification settings:', settings);
    // Here you would typically make an API call to save the settings
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Configuración de Notificaciones</Typography>
      
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <VolumeUpIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Volumen Global</Typography>
        </Box>
        <Box display="flex" alignItems="center" width="100%" px={2}>
          <VolumeOffIcon sx={{ mr: 2 }} />
          <Slider
            value={settings.globalVolume}
            onChange={handleGlobalVolumeChange}
            aria-labelledby="global-volume-slider"
            sx={{ flexGrow: 1, mx: 2 }}
          />
          <VolumeUpIcon sx={{ ml: 2 }} />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Tipos de Notificaciones</Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Configura qué notificaciones quieres recibir y cómo quieres recibirlas.
      </Typography>

      <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
        {notificationTypes.map((type) => (
          <Paper key={type.id} elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.notifications[type.id].enabled}
                      onChange={(e) => handleNotificationToggle(type.id, 'enabled', e.target.checked)}
                      color="primary"
                    />
                  }
                  label={type.label}
                  labelPlacement="end"
                />
              </Grid>
              
              <Grid item xs={12} sm={9}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small" disabled={!settings.notifications[type.id].enabled}>
                      <InputLabel>Sonido</InputLabel>
                      <Select
                        value={settings.notifications[type.id].sound}
                        onChange={(e) => handleSoundChange(type.id, e.target.value)}
                        label="Sonido"
                      >
                        {soundOptions.map((sound) => (
                          <MenuItem key={sound.value} value={sound.value}>
                            {sound.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={8} sm={4}>
                    <Box display="flex" alignItems="center">
                      <VolumeUpIcon sx={{ mr: 1, color: 'action.active' }} />
                      <Slider
                        value={settings.notifications[type.id].volume}
                        onChange={(e, value) => handleVolumeChange(type.id, value)}
                        aria-labelledby={`${type.id}-volume-slider`}
                        disabled={!settings.notifications[type.id].enabled}
                        sx={{ flexGrow: 1 }}
                      />
                      <Tooltip title="Probar sonido">
                        <IconButton 
                          onClick={() => playSound(settings.notifications[type.id].sound)}
                          disabled={!settings.notifications[type.id].enabled}
                          size="small"
                          sx={{ ml: 1 }}
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={4} sm={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications[type.id].mobilePush}
                          onChange={(e) => handleNotificationToggle(type.id, 'mobilePush', e.target.checked)}
                          color="primary"
                          disabled={!settings.notifications[type.id].enabled}
                          size="small"
                        />
                      }
                      label="Móvil"
                      labelPlacement="start"
                      sx={{ m: 0 }}
                    />
                  </Grid>
                  
                  <Grid item xs={4} sm={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications[type.id].desktopNotifications}
                          onChange={(e) => handleNotificationToggle(type.id, 'desktopNotifications', e.target.checked)}
                          color="primary"
                          disabled={!settings.notifications[type.id].enabled}
                          size="small"
                        />
                      }
                      label="Escritorio"
                      labelPlacement="start"
                      sx={{ m: 0 }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary"
          onClick={saveSettings}
        >
          Guardar Configuración
        </Button>
      </Box>
    </Paper>
  );
};

export default NotificationsTab;
