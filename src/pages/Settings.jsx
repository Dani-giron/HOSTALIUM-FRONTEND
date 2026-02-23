import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';
import { Settings as SettingsIcon, Notifications, TableChart, Restaurant, Schedule } from '@mui/icons-material';
import NotificationsTab from '../components/settings/NotificationsTab';
import TablesTab from '../components/settings/TablesTab';
import RestaurantTab from '../components/settings/RestaurantTab';
import HorariosTab from '../components/settings/HorariosTab';

// Custom styled tab component
const StyledTab = (props) => (
  <Tab
    {...props}
    sx={{
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      color: '#a0aec0',
      '&.Mui-selected': {
        color: '#9b5cff',
      },
      '&:hover': {
        color: '#9b5cff',
        opacity: 0.8,
      },
    }}
  />
);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      className="w-full"
      {...other}
    >
      {value === index && (
        <Box className="w-full">
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box className="p-4 md:p-6 max-w-7xl mx-auto">
      <Box className="flex items-center mb-6">
        <SettingsIcon className="text-[#9b5cff] mr-3" style={{ fontSize: '2rem' }} />
        <Typography variant="h4" className="font-bold bg-gradient-to-r from-[#9b5cff] to-[#5fb4ff] bg-clip-text text-transparent">
          Configuración del Sistema
        </Typography>
      </Box>
      
      <Paper className="bg-gradient-to-br from-[#0f0a1e] to-[#1a0f3d] p-1 rounded-xl mb-6 shadow-lg">
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#9b5cff',
              height: '3px',
              borderRadius: '4px 4px 0 0',
            },
          }}
        >
          <StyledTab 
            icon={<Restaurant />} 
            iconPosition="start"
            label="Restaurante" 
            {...a11yProps(0)} 
          />
          <StyledTab 
            icon={<Schedule />} 
            iconPosition="start"
            label="Horarios" 
            {...a11yProps(1)} 
          />
          <StyledTab 
            icon={<Notifications />} 
            iconPosition="start"
            label="Notificaciones" 
            {...a11yProps(2)} 
          />
          <StyledTab 
            icon={<TableChart />} 
            iconPosition="start"
            label="Gestión de Mesas" 
            {...a11yProps(3)} 
          />
        </Tabs>
      </Paper>

      <Box className="bg-[#0f0a1e] bg-opacity-70 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/10">
        <TabPanel value={tabValue} index={0}>
          <RestaurantTab />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <HorariosTab />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <NotificationsTab />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <TablesTab />
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Settings;
