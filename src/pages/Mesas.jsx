import { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { getTables } from '../services/tableService';
import { obtenerReservas } from '../services/reservas';
import FloorPlan from '../components/settings/FloorPlan';
import TableDetailsPanel from '../components/floorPlan/TableDetailsPanel';
import ReservationsList from '../components/floorPlan/ReservationsList';
import MetricsPanel from '../components/floorPlan/MetricsPanel';
import { ESTADO_RESERVA, ESTADO_MESA_DE_RESERVA } from '../constants/reservaStates';

export default function Mesas() {
  console.log('🔍 Mesas.jsx - Renderizando componente Mesas...');
  
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    totalSeats: 0,
    occupiedSeats: 0,
    guests: 0
  });

  console.log('🔍 Mesas.jsx - Estado actual:', { tables, selectedTable, reservations, isLoading, metrics });

  // Cargar datos iniciales
  const loadData = async () => {
    try {
      console.log('🔍 Mesas.jsx - Iniciando carga de datos...');
      setIsLoading(true);
      
      // Cargar mesas
      console.log('🔍 Mesas.jsx - Cargando mesas...');
      const tablesData = await getTables();
      console.log('🔍 Mesas.jsx - Mesas obtenidas:', tablesData);
      
      const interiorTables = tablesData.filter(table => table.ubicacion === 'INTERIOR');
      console.log('🔍 Mesas.jsx - Mesas interiores:', interiorTables);
      
      // Cargar reservas de hoy primero
      console.log('🔍 Mesas.jsx - Cargando reservas de hoy...');
      const today = new Date().toISOString().split('T')[0];
      const reservationsData = await obtenerReservas({ fecha: today });
      console.log('🔍 Mesas.jsx - Reservas de hoy:', reservationsData);

      // Calcular estado de las mesas
      const processedTables = interiorTables.map(table => {
        let status = 'available';
        
        // Verificar si está ocupada ahora (necesitaríamos un campo específico o lógica de tiempo real)
        if (table.ocupadaAhora) {
          status = 'occupied';
        } 
        // Verificar si tiene reservas confirmadas para hoy
        else {
          const hasReservationsToday = reservationsData.some(reserva => 
            reserva.mesaId === table.id && 
            reserva.estado === ESTADO_RESERVA.CONFIRMADA
          );
          
          if (hasReservationsToday) {
            status = ESTADO_MESA_DE_RESERVA.CONFIRMADA;
          }
          // Verificar si no está disponible
          else if (!table.disponible) {
            status = 'unavailable';
          }
        }

        return {
          ...table,
          id: table.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
          x: table.x || 100,
          y: table.y || 100,
          width: table.width || (table.tipo === 'round' ? 80 : 100),
          height: table.height || (table.tipo === 'round' ? 80 : 50),
          rotation: table.rotation || 0,
          capacity: table.capacidad || 4,
          nombre: table.nombre || `Mesa ${table.id || ''}`.trim(),
          disponible: table.disponible !== false,
          tipo: table.tipo || 'rectangular',
          type: table.tipo === 'round' ? 'round' : 'rect',
          status: status
        };
      });

      // Calcular métricas
      const totalTables = processedTables.length;
      const availableTables = processedTables.filter(t => t.status === 'available').length;
      const occupiedTables = processedTables.filter(t => t.status === 'occupied').length;
      const totalSeats = processedTables.reduce((sum, table) => sum + (table.capacity || 4), 0);
      const occupiedSeats = processedTables
        .filter(t => t.status === 'occupied')
        .reduce((sum, table) => sum + (table.capacity || 4), 0);
      const guests = reservationsData.filter(r => r.estado === ESTADO_RESERVA.CONFIRMADA).length;

      console.log('🔍 Mesas.jsx - Métricas calculadas:', {
        totalTables,
        availableTables,
        occupiedTables,
        totalSeats,
        occupiedSeats,
        guests
      });

      setTables(processedTables);
      setReservations(reservationsData);
      setMetrics({
        totalTables,
        availableTables,
        occupiedTables,
        totalSeats,
        occupiedSeats,
        guests
      });
      
      console.log('🔍 Mesas.jsx - Estados actualizados correctamente');
    } catch (error) {
      console.error('🔍 Mesas.jsx - Error loading data:', error);
    } finally {
      setIsLoading(false);
      console.log('🔍 Mesas.jsx - Carga finalizada, isLoading:', false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Manejar selección de mesa
  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  // Manejar actualización de mesa
  const handleTableUpdate = async (updatedTable) => {
    try {
      // Actualizar estado local inmediatamente
      setTables(prevTables =>
        prevTables.map(table =>
          table.id === updatedTable.id ? { ...table, ...updatedTable } : table
        )
      );

      // Recargar métricas
      const availableTables = tables.filter(t => 
        t.id === updatedTable.id ? updatedTable.status === 'available' : t.status === 'available'
      ).length;
      
      const occupiedTables = tables.filter(t => 
        t.id === updatedTable.id ? updatedTable.status === 'occupied' : t.status === 'occupied'
      ).length;

      setMetrics(prev => ({
        ...prev,
        availableTables,
        occupiedTables
      }));
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  // Manejar adición de mesa
  const handleTableAdd = (newTable) => {
    setTables(prev => [...prev, newTable]);
  };

  // Manejar eliminación de mesa
  const handleTableDelete = (tableId) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
  };

  // Manejar duplicación de mesa
  const handleTableDuplicate = (tableToDuplicate) => {
    const duplicatedTable = {
      ...tableToDuplicate,
      id: `table-${Date.now()}`,
      x: tableToDuplicate.x + 20,
      y: tableToDuplicate.y + 20,
      nombre: `${tableToDuplicate.nombre} (copia)`
    };
    setTables(prev => [...prev, duplicatedTable]);
  };

  // Manejar edición de mesa
  const handleTableEdit = (table) => {
    setSelectedTable(table);
  };

  // Manejar guardado
  const handleSave = () => {
    console.log('Guardando cambios en las mesas...');
    // Aquí iría la lógica para guardar en el backend
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#0a0a0a' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
          Plano de Mesas
        </Typography>
        <Tooltip title="Actualizar">
          <IconButton onClick={loadData} sx={{ color: 'white' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Panel - Floor Plan */}
        <Box sx={{ flex: 1, p: 2 }}>
          <Paper sx={{ 
            height: '100%', 
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <FloorPlan
              tables={tables}
              onTableAdd={handleTableAdd}
              onTableUpdate={handleTableUpdate}
              onTableDelete={handleTableDelete}
              onTableDuplicate={handleTableDuplicate}
              onTableEdit={handleTableEdit}
              onSave={handleSave}
              isAdmin={true}
              width={800}
              height={600}
            />
          </Paper>
        </Box>

        {/* Right Panel */}
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          {/* Metrics Panel */}
          <MetricsPanel metrics={metrics} />

          {/* Table Details */}
          {selectedTable && (
            <TableDetailsPanel
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
            />
          )}

          {/* Reservations List */}
          <Box sx={{ flex: 1, minHeight: 0 }}>
            <Paper sx={{ 
              height: '100%', 
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              p: 2
            }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Reservas de Hoy
              </Typography>
              <ReservationsList
                reservations={reservations}
                onTableSelect={handleTableSelect}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
