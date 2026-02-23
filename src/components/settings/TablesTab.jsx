import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import FloorPlan from './FloorPlan';
import TableForm from './TableForm';
import { getTables, createTable, updateTable, deleteTable } from '../../services/tableService';

const TablesTab = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // State for floors and tables
  const [floors, setFloors] = useState([
    { 
      id: 'INTERIOR', 
      name: 'Interior',
      tables: []
    }
  ]);
  
  const [currentFloorId, setCurrentFloorId] = useState('INTERIOR');
  const [isTableFormOpen, setIsTableFormOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);

  // Get current floor
  const currentFloor = floors.find(floor => floor.id === currentFloorId) || floors[0];
  const selectedTable = currentFloor?.tables?.find(t => t.id === selectedTableId);

  // Load tables when component mounts
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setIsLoading(true);
        const tables = await getTables();
        
        const updatedFloors = floors.map(floor => {
          const floorTables = Array.isArray(tables) ? tables : [];
          
          return {
            ...floor,
            tables: floorTables
              .filter(table => table && table.ubicacion === floor.id)
              .map(table => ({
                ...table,
                id: table.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                x: table.x || 100,
                y: table.y || 100,
                width: table.width || (table.tipo === 'round' ? 80 : 100),
                height: table.height || (table.tipo === 'round' ? 80 : 50),
                rotation: table.rotation || 0,
                capacidad: table.capacidad || 4,
                nombre: table.nombre || `Mesa ${table.id || ''}`.trim(),
                disponible: table.disponible !== false,
                tipo: table.tipo || 'rectangular'
              }))
          };
        });
        
        setFloors(updatedFloors);
      } catch (err) {
        setError('Error al cargar las mesas');
        console.error('Error fetching tables:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, []);

  // Table event handlers
  const handleAddTable = async (tableData) => {
    try {
      setIsSaving(true);
      const newTable = {
        ...tableData,
        ubicacion: currentFloorId,
        disponible: tableData.disponible !== false,
        x: tableData.x || 100,
        y: tableData.y || 100,
        width: tableData.width || (tableData.tipo === 'round' ? 80 : 100),
        height: tableData.height || (tableData.tipo === 'round' ? 80 : 50),
        rotation: tableData.rotation || 0
      };

      const createdTable = await createTable(newTable);
      
      setFloors(prevFloors => 
        prevFloors.map(floor => 
          floor.id === currentFloorId
            ? {
                ...floor,
                tables: [...floor.tables, {
                  ...newTable,
                  id: createdTable.id || `temp-${Date.now()}`,
                  ...createdTable
                }]
              }
            : floor
        )
      );
      
      showSnackbar('Mesa creada correctamente', 'success');
      return createdTable;
    } catch (err) {
      console.error('Error creating table:', err);
      showSnackbar('Error al crear la mesa', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTable = async (tableData) => {
    try {
      setIsSaving(true);
      const updatedTable = await updateTable(tableData.id, tableData);
      
      setFloors(prevFloors => 
        prevFloors.map(floor => 
          floor.id === currentFloorId
            ? {
                ...floor,
                tables: floor.tables.map(table => 
                  table.id === tableData.id ? { ...table, ...updatedTable } : table
                )
              }
            : floor
        )
      );
      
      showSnackbar('Mesa actualizada correctamente', 'success');
      return updatedTable;
    } catch (err) {
      console.error('Error updating table:', err);
      showSnackbar('Error al actualizar la mesa', 'error');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTable = async (tableId) => {
    console.log('TablesTab handleDeleteTable called with:', tableId);
    if (!tableId) return;
    
    try {
      setIsSaving(true);
      console.log('Calling deleteTable API with:', tableId);
      await deleteTable(tableId);
      console.log('deleteTable API successful');
      
      setFloors(prevFloors => 
        prevFloors.map(floor => 
          floor.id === currentFloorId
            ? {
                ...floor,
                tables: floor.tables.filter(table => table.id !== tableId)
              }
            : floor
        )
      );
      
      if (selectedTableId === tableId) {
        setSelectedTableId(null);
      }
      
      showSnackbar('Mesa eliminada correctamente', 'success');
    } catch (err) {
      console.error('Error deleting table:', err);
      showSnackbar('Error al eliminar la mesa', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicateTable = (table) => {
    if (!table) return;
    
    const newTable = {
      ...table,
      id: `temp-${Date.now()}`,
      x: (table.x || 100) + 50,
      y: (table.y || 100) + 50,
      nombre: `${table.nombre} (copia)`
    };
    
    handleAddTable(newTable);
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setIsTableFormOpen(true);
  };

  const handleRotateTable = (direction) => {
    if (!selectedTable) return;
    
    const rotation = direction === 'left' 
      ? (selectedTable.rotation - 15) % 360
      : (selectedTable.rotation + 15) % 360;
    
    handleUpdateTable({
      ...selectedTable,
      rotation
    });
  };

  const handleTableSelect = (tableId) => {
    setSelectedTableId(tableId);
  };

  const handleTableUpdate = (updatedTable) => {
    handleUpdateTable(updatedTable);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Toolbar actions
  const renderToolbarActions = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          setEditingTable(null);
          setIsTableFormOpen(true);
        }}
        disabled={isSaving}
      >
        Añadir Mesa
      </Button>

      {selectedTable && (
        <>
          <Tooltip title="Editar mesa">
            <IconButton
              color="primary"
              onClick={() => {
                setEditingTable(selectedTable);
                setIsTableFormOpen(true);
              }}
              disabled={isSaving}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar mesa">
            <IconButton
              color="error"
              onClick={() => handleDeleteTable(selectedTable.id)}
              disabled={isSaving}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Duplicar mesa">
            <IconButton
              color="primary"
              onClick={() => handleDuplicateTable(selectedTable)}
              disabled={isSaving}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rotar izquierda">
            <IconButton
              color="primary"
              onClick={() => handleRotateTable('left')}
              disabled={isSaving}
            >
              <RotateLeftIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Rotar derecha">
            <IconButton
              color="primary"
              onClick={() => handleRotateTable('right')}
              disabled={isSaving}
            >
              <RotateRightIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: isMobile ? 1 : 3 }}>
      <Typography variant="h4" gutterBottom>
        Configuración de Mesas
      </Typography>

      <Tabs
        value={currentFloorId}
        onChange={(e, newValue) => setCurrentFloorId(newValue)}
        sx={{ mb: 2 }}
      >
        {floors.map(floor => (
          <Tab 
            key={floor.id} 
            label={floor.name} 
            value={floor.id} 
            disabled={isSaving}
          />
        ))}
      </Tabs>

      {renderToolbarActions()}

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          overflow: 'hidden',
          height: '70vh',
          position: 'relative'
        }}>
          <FloorPlan
            tables={currentFloor?.tables || []}
            selectedId={selectedTableId}
            onTableSelect={handleTableSelect}
            onTableUpdate={handleTableUpdate}
            onTableDelete={handleDeleteTable}
            onTableDuplicate={handleDuplicateTable}
            onTableEdit={handleEditTable}
            isAdmin={true}
            showNumbers={true}
          />
        </Box>
      )}

      <TableForm
        open={isTableFormOpen}
        onClose={() => setIsTableFormOpen(false)}
        onSave={async (tableData) => {
          try {
            if (editingTable) {
              await handleUpdateTable({
                ...editingTable,
                ...tableData
              });
            } else {
              await handleAddTable(tableData);
            }
            setIsTableFormOpen(false);
          } catch (error) {
            console.error('Error saving table:', error);
          }
        }}
        table={editingTable}
        isSaving={isSaving}
      />

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

export default TablesTab;