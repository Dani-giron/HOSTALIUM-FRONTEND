import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { getHorarios, addHorario, deleteHorario } from '../../services/horarios';

const DIAS_SEMANA = [
  'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'
];

const HorariosTab = () => {
  const [horarios, setHorarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    diaSemana: '',
    horaApertura: '',
    horaCierre: ''
  });

  useEffect(() => {
    loadHorarios();
  }, []);

  const loadHorarios = async () => {
    try {
      setIsLoading(true);
      const response = await getHorarios();
      
      if (response.success) {
        setHorarios(response.data || []);
      } else {
        showSnackbar('Error al cargar los horarios', 'error');
      }
    } catch (error) {
      console.error('Error loading horarios:', error);
      showSnackbar(error.message || 'Error al cargar los horarios', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddHorario = () => {
    setEditingHorario(null);
    setFormData({
      diaSemana: '',
      horaApertura: '',
      horaCierre: ''
    });
    setDialogOpen(true);
  };

  const handleEditHorario = (horario) => {
    setEditingHorario(horario);
    setFormData({
      diaSemana: horario.diaSemana,
      horaApertura: horario.horaApertura,
      horaCierre: horario.horaCierre
    });
    setDialogOpen(true);
  };

  const handleDeleteHorario = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este horario?')) {
      return;
    }

    try {
      setIsSaving(true);
      const response = await deleteHorario(id);
      
      if (response.success) {
        setHorarios(horarios.filter(h => h.id !== id));
        showSnackbar('Horario eliminado correctamente', 'success');
      } else {
        showSnackbar('Error al eliminar el horario', 'error');
      }
    } catch (error) {
      console.error('Error deleting horario:', error);
      showSnackbar(error.message || 'Error al eliminar el horario', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHorario = async () => {
    // Validaciones
    if (!formData.diaSemana || !formData.horaApertura || !formData.horaCierre) {
      showSnackbar('Todos los campos son obligatorios', 'error');
      return;
    }

    // Validar formato de horas
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.horaApertura) || !timeRegex.test(formData.horaCierre)) {
      showSnackbar('Las horas deben estar en formato HH:MM', 'error');
      return;
    }

    // Validar que cierre sea posterior a apertura
    const [aperturaH, aperturaM] = formData.horaApertura.split(':').map(Number);
    const [cierreH, cierreM] = formData.horaCierre.split(':').map(Number);
    const minutosApertura = aperturaH * 60 + aperturaM;
    const minutosCierre = cierreH * 60 + cierreM;

    if (minutosCierre <= minutosApertura) {
      showSnackbar('La hora de cierre debe ser posterior a la hora de apertura', 'error');
      return;
    }

    // Verificar solapamientos
    const solapamiento = horarios.some(h => {
      if (editingHorario && h.id === editingHorario.id) return false;
      if (h.diaSemana !== formData.diaSemana) return false;
      
      const [hAperturaH, hAperturaM] = h.horaApertura.split(':').map(Number);
      const [hCierreH, hCierreM] = h.horaCierre.split(':').map(Number);
      const hMinutosApertura = hAperturaH * 60 + hAperturaM;
      const hMinutosCierre = hCierreH * 60 + hCierreM;
      
      return (minutosApertura < hMinutosCierre && minutosCierre > hMinutosApertura);
    });

    if (solapamiento) {
      showSnackbar('El horario se solapa con otro existente para el mismo día', 'error');
      return;
    }

    try {
      setIsSaving(true);
      
      let nuevosHorarios;
      if (editingHorario) {
        // Actualizar horario existente
        nuevosHorarios = horarios.map(h => 
          h.id === editingHorario.id 
            ? { ...h, ...formData }
            : h
        );
      } else {
        // Añadir nuevo horario
        nuevosHorarios = [...horarios, formData];
      }

      const response = await addHorario(nuevosHorarios);
      
      if (response.success) {
        setHorarios(response.data || []);
        setDialogOpen(false);
        showSnackbar(editingHorario ? 'Horario actualizado correctamente' : 'Horario añadido correctamente', 'success');
      } else {
        showSnackbar('Error al guardar el horario', 'error');
      }
    } catch (error) {
      console.error('Error saving horario:', error);
      showSnackbar(error.message || 'Error al guardar el horario', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getHorariosPorDia = () => {
    const agrupados = {};
    DIAS_SEMANA.forEach(dia => {
      agrupados[dia] = horarios.filter(h => h.diaSemana === dia);
    });
    return agrupados;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const horariosPorDia = getHorariosPorDia();

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ScheduleIcon sx={{ mr: 2, color: '#9b5cff', fontSize: '2rem' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Horarios de Reserva
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddHorario}
          sx={{ minWidth: 150 }}
        >
          Añadir Horario
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Configura los días y horas en los que tu restaurante acepta reservas. 
        Los clientes solo podrán reservar dentro de estos rangos horarios.
      </Alert>

      <Grid container spacing={3}>
        {DIAS_SEMANA.map(dia => (
          <Grid item xs={12} md={6} lg={4} key={dia}>
            <Card sx={{ height: '100%', backgroundColor: 'rgba(15, 10, 30, 0.8)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: '#9b5cff', fontWeight: 'bold' }}>
                  {dia}
                </Typography>
                
                {horariosPorDia[dia].length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sin horarios configurados
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      El restaurante no acepta reservas este día
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    {horariosPorDia[dia].map((horario, index) => (
                      <Box key={horario.id || index} sx={{ mb: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1.5,
                          backgroundColor: 'rgba(155, 92, 255, 0.1)',
                          borderRadius: 1
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon sx={{ mr: 1, color: '#9b5cff', fontSize: '1.2rem' }} />
                            <Typography variant="body2">
                              {horario.horaApertura} - {horario.horaCierre}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton
                              size="small"
                              onClick={() => handleEditHorario(horario)}
                              sx={{ color: '#9b5cff' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteHorario(horario.id)}
                              sx={{ color: '#ef4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Diálogo para añadir/editar horario */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingHorario ? 'Editar Horario' : 'Añadir Nuevo Horario'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Día de la semana</InputLabel>
              <Select
                value={formData.diaSemana}
                onChange={handleInputChange('diaSemana')}
                label="Día de la semana"
              >
                {DIAS_SEMANA.map(dia => (
                  <MenuItem key={dia} value={dia}>{dia}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Hora de apertura"
              type="time"
              value={formData.horaApertura}
              onChange={handleInputChange('horaApertura')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 minutos
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Hora de cierre"
              type="time"
              value={formData.horaCierre}
              onChange={handleInputChange('horaCierre')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }} // 5 minutos
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveHorario} 
            variant="contained"
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default HorariosTab;
