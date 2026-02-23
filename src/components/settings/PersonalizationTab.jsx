import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Avatar, 
  Typography, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  PhotoCamera, 
  Business, 
  LocationOn, 
  Phone, 
  Email, 
  MeetingRoom, 
  Stairs, 
  LocalBar,
  Schedule,
  TableChart
} from '@mui/icons-material';

// Custom styled input field
const StyledTextField = ({ icon: Icon, ...props }) => (
  <TextField
    variant="outlined"
    fullWidth
    size="small"
    InputProps={{
      startAdornment: Icon && (
        <InputAdornment position="start">
          <Icon className="text-[#9b5cff]" />
        </InputAdornment>
      ),
      sx: {
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: '#9b5cff',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#9b5cff',
          },
        },
        '& .MuiInputBase-input': {
          color: 'white',
        },
        '& .MuiInputLabel-root': {
          color: '#a0aec0',
        },
      },
    }}
    InputLabelProps={{
      style: { color: '#a0aec0' },
    }}
    {...props}
  />
);

const PersonalizationTab = () => {
  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessPhoto: null,
    photoPreview: '',
    tables: 0,
    floors: 1,
    hasBar: false,
    barLocation: '',
    address: '',
    phone: '',
    email: '',
    businessHours: {
      monday: { open: '09:00', close: '23:00' },
      tuesday: { open: '09:00', close: '23:00' },
      wednesday: { open: '09:00', close: '23:00' },
      thursday: { open: '09:00', close: '23:00' },
      friday: { open: '09:00', close: '00:00' },
      saturday: { open: '10:00', close: '00:00' },
      sunday: { open: '10:00', close: '22:00' },
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBusinessData(prev => ({
          ...prev,
          businessPhoto: file,
          photoPreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Business data submitted:', businessData);
  };

  return (
    <Box className="w-full">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Business Photo */}
          <Grid item xs={12} className="mb-6">
            <Box className="flex flex-col md:flex-row items-center md:items-start p-6 rounded-xl bg-gradient-to-br from-[#0f0a1e] to-[#1a0f3d] border border-white/10">
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="business-photo-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="business-photo-upload" className="cursor-pointer">
                <Box className="relative group">
                  <Avatar
                    src={businessData.photoPreview}
                    className="w-32 h-32 md:w-40 md:h-40 border-2 border-[#9b5cff] bg-[#1a1a2e] transition-all duration-300 group-hover:opacity-80"
                  >
                    {!businessData.photoPreview && (
                      <PhotoCamera className="text-[#9b5cff] text-3xl" />
                    )}
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <PhotoCamera className="text-white text-2xl" />
                  </div>
                </Box>
              </label>
              <Box className="mt-4 md:mt-0 md:ml-8 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Foto del Negocio</h3>
                <p className="text-gray-300 mb-3 max-w-md">
                  Sube una imagen que represente tu negocio. Esta se mostrará en la aplicación y en los correos electrónicos.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    className="bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] hover:opacity-90 transition-all"
                  >
                    Cambiar Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {businessData.photoPreview && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setBusinessData(prev => ({
                          ...prev,
                          photoPreview: '',
                          businessPhoto: null
                        }));
                      }}
                      className="border-red-500 text-red-500 hover:bg-red-500/10"
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Formatos: JPG, PNG. Tamaño máximo: 5MB. Dimensión recomendada: 500x500px
                </p>
              </Box>
            </Box>
          </Grid>

          {/* Business Information */}
          <Grid item xs={12} className="mt-6">
            <Box className="flex items-center mb-4">
              <Business className="text-[#9b5cff] mr-2" />
              <Typography variant="h6" className="text-white font-semibold">
                Información del Negocio
              </Typography>
            </Box>
            
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Nombre del Negocio"
                  name="businessName"
                  value={businessData.businessName}
                  onChange={handleChange}
                  required
                  icon={Business}
                  placeholder="Ej: Mi Restaurante"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Dirección"
                  name="address"
                  value={businessData.address}
                  onChange={handleChange}
                  required
                  icon={LocationOn}
                  placeholder="Dirección completa del local"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Teléfono"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleChange}
                  required
                  icon={Phone}
                  placeholder="+34 123 456 789"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="Email de contacto"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleChange}
                  required
                  icon={Email}
                  placeholder="contacto@negocio.com"
                />
              </Grid>
            </Grid>

          </Grid>

          {/* Restaurant Configuration */}
          <Grid item xs={12} className="mt-6">
            <Box className="flex items-center mb-4">
              <MeetingRoom className="text-[#9b5cff] mr-2" />
              <Typography variant="h6" className="text-white font-semibold">
                Configuración del Local
              </Typography>
            </Box>
            
            <Grid container spacing={3} className="mb-6">
              <Grid item xs={12} md={4}>
                <StyledTextField
                  label="Número de Mesas"
                  name="tables"
                  type="number"
                  value={businessData.tables}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  icon={TableChart}
                  placeholder="Ej: 15"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <StyledTextField
                  label="Número de Plantas"
                  name="floors"
                  type="number"
                  value={businessData.floors}
                  onChange={handleChange}
                  inputProps={{ min: 1 }}
                  icon={Stairs}
                  placeholder="Ej: 2"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth variant="outlined" size="small" className="mt-1">
                  <InputLabel className="text-gray-400">¿Tiene barra?</InputLabel>
                  <Select
                    name="hasBar"
                    value={businessData.hasBar}
                    onChange={handleChange}
                    label="¿Tiene barra?"
                    className="text-white"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9b5cff',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9b5cff',
                      },
                    }}
                    startAdornment={
                      <InputAdornment position="start">
                        <LocalBar className="text-[#9b5cff]" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={false}>
                      <Box className="flex items-center">
                        <span className="text-gray-300">No</span>
                      </Box>
                    </MenuItem>
                    <MenuItem value={true}>
                      <Box className="flex items-center">
                        <span className="text-gray-300">Sí</span>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {businessData.hasBar && (
                <Grid item xs={12}>
                  <StyledTextField
                    label="Ubicación de la Barra"
                    name="barLocation"
                    value={businessData.barLocation}
                    onChange={handleChange}
                    placeholder="Ej: Planta Baja, junto a la entrada"
                    icon={LocalBar}
                    fullWidth
                  />
                </Grid>
              )}
            </Grid>

            {/* Business Hours Section */}
            <Box className="mt-8">
              <Box className="flex items-center mb-4">
                <Schedule className="text-[#9b5cff] mr-2" />
                <Typography variant="h6" className="text-white font-semibold">
                  Horario de Atención
                </Typography>
              </Box>
              
              <Box className="bg-[#0f0a1e] p-4 rounded-lg border border-white/10">
                {Object.entries(businessData.businessHours).map(([day, hours]) => (
                  <Box key={day} className="flex items-center mb-3 last:mb-0">
                    <span className="w-24 text-gray-300 capitalize">
                      {day === 'monday' ? 'Lunes' :
                       day === 'tuesday' ? 'Martes' :
                       day === 'wednesday' ? 'Miércoles' :
                       day === 'thursday' ? 'Jueves' :
                       day === 'friday' ? 'Viernes' :
                       day === 'saturday' ? 'Sábado' : 'Domingo'}
                    </span>
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                      className="bg-[#1a1a2e] text-white border border-gray-700 rounded px-3 py-1.5 mr-2 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                    />
                    <span className="mx-2 text-gray-400">a</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                      className="bg-[#1a1a2e] text-white border border-gray-700 rounded px-3 py-1.5 mr-4 focus:outline-none focus:ring-2 focus:ring-[#9b5cff]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newHours = { ...businessData.businessHours };
                        newHours[day] = { open: '00:00', close: '00:00' };
                        setBusinessData(prev => ({
                          ...prev,
                          businessHours: newHours
                        }));
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Cerrar
                    </button>
                  </Box>
                ))}
              </Box>
              
              <Box className="flex justify-end mt-4 space-x-2">
                <Button
                  variant="outlined"
                  className="border-gray-600 text-gray-300 hover:border-[#9b5cff] hover:text-[#9b5cff]"
                  onClick={() => {
                    // Copy current hours to all days
                    const newHours = { ...businessData.businessHours };
                    const firstDayHours = { ...newHours.monday };
                    Object.keys(newHours).forEach(day => {
                      newHours[day] = firstDayHours;
                    });
                    setBusinessData(prev => ({
                      ...prev,
                      businessHours: newHours
                    }));
                  }}
                >
                  Copiar a todos los días
                </Button>
                <Button
                  variant="outlined"
                  className="border-gray-600 text-gray-300 hover:border-[#9b5cff] hover:text-[#9b5cff]"
                  onClick={() => {
                    // Set default hours
                    setBusinessData(prev => ({
                      ...prev,
                      businessHours: {
                        monday: { open: '09:00', close: '23:00' },
                        tuesday: { open: '09:00', close: '23:00' },
                        wednesday: { open: '09:00', close: '23:00' },
                        thursday: { open: '09:00', close: '23:00' },
                        friday: { open: '09:00', close: '00:00' },
                        saturday: { open: '10:00', close: '00:00' },
                        sunday: { open: '10:00', close: '22:00' },
                      }
                    }));
                  }}
                >
                  Establecer horario por defecto
                </Button>
              </Box>
            </Box>

            {/* Form Actions */}
            <Box className="mt-8 flex justify-end space-x-3">
              <Button
                variant="outlined"
                className="border-gray-600 text-gray-300 hover:border-[#9b5cff] hover:text-[#9b5cff]"
                onClick={() => {
                  // Reset form logic here
                }}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                className="bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] hover:from-[#8a4dff] hover:to-[#4ea3ff] text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Guardar Cambios
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default PersonalizationTab;
