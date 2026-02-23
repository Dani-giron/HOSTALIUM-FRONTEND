import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Chair as ChairIcon,
  TableRestaurant as TableIcon,
  GridView as GridViewIcon,
  TableRows as TableRowsIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ContentCopy as DuplicateIcon,
  Layers as LayersIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

// Sample table types
const TABLE_TYPES = [
  { id: 'square-2', name: 'Cuadrada 2P', seats: 2, shape: 'square', width: 80, height: 80 },
  { id: 'square-4', name: 'Cuadrada 4P', seats: 4, shape: 'square', width: 100, height: 100 },
  { id: 'round-2', name: 'Redonda 2P', seats: 2, shape: 'round', width: 80, height: 80 },
  { id: 'round-4', name: 'Redonda 4P', seats: 4, shape: 'round', width: 100, height: 100 },
  { id: 'rectangle-6', name: 'Rectangular 6P', seats: 6, shape: 'rectangle', width: 120, height: 80 },
  { id: 'rectangle-8', name: 'Rectangular 8P', seats: 8, shape: 'rectangle', width: 160, height: 80 },
  { id: 'bar-4', name: 'Barra 4P', seats: 4, shape: 'bar', width: 120, height: 40 },
  { id: 'booth-4', name: 'Cabina 4P', seats: 4, shape: 'booth', width: 100, height: 120 },
];

// Sample floor plan data structure
const initialFloorPlan = {
  id: 'floor-1',
  name: 'Planta Baja',
  width: 1000,  // in pixels
  height: 800,  // in pixels
  backgroundImage: null,
  tables: [],
  walls: [],
  zones: []
};

const TablesTab = () => {
  console.log('Renderizando TablesTab'); // Depuración
  
  // Estado mínimo necesario
  const [tables, setTables] = useState([
    { id: 1, number: '1', type: 'square-4', x: 100, y: 100, status: 'available' },
    { id: 2, number: '2', type: 'round-4', x: 250, y: 150, status: 'available' }
  ]);
  
  // Tipos de mesa simplificados
  const tableTypes = [
    { id: 'square-4', name: 'Cuadrada 4P', seats: 4, shape: 'square', width: 100, height: 100 },
    { id: 'round-4', name: 'Redonda 4P', seats: 4, shape: 'round', width: 100, height: 100 }
  ];
  
  // Función para obtener el color según el estado
  const getTableColor = (status) => {
    switch (status) {
      case 'occupied': return '#ffcdd2';
      case 'reserved': return '#fff9c4';
      case 'cleaning': return '#bbdefb';
      case 'available':
      default: return '#c8e6c9';
    }
  };
  
  // Renderizar una mesa
  const renderTable = (table) => {
    const tableType = tableTypes.find(t => t.id === table.type) || tableTypes[0];
    
    return (
      <div
        key={table.id}
        style={{
          position: 'absolute',
          left: `${table.x}px`,
          top: `${table.y}px`,
          width: `${tableType.width}px`,
          height: `${tableType.height}px`,
          backgroundColor: getTableColor(table.status),
          border: '1px solid #666',
          borderRadius: tableType.shape === 'round' ? '50%' : '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>Mesa {table.number}</span>
      </div>
    );
  };
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    // Actualizar el tamaño cuando el componente se monte y cuando cambie el tamaño de la ventana
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: Math.max(600, window.innerHeight - 300) // Altura mínima de 600px o el alto de la ventana menos 300px
        });
      }
    };

    // Actualizar el tamaño inicial
    updateSize();

    // Agregar listener para cambios de tamaño de la ventana
    window.addEventListener('resize', updateSize);

    // Limpiar el listener al desmontar el componente
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for the floor plan
  const [floorPlan, setFloorPlan] = useState(initialFloorPlan);
  const [floors, setFloors] = [
    { id: 'floor-1', name: 'Planta Baja' },
    { id: 'floor-2', name: 'Primera Planta' },
    { id: 'floor-3', name: 'Terraza' }
  ];
  const [currentFloor, setCurrentFloor] = useState('floor-1');
  
  // UI State
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedTable, setSelectedTable] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showTableNumbers, setShowTableNumbers] = useState(true);
  const [showTableTypes, setShowTableTypes] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tableDialogMode, setTableDialogMode] = useState('add'); // 'add' or 'edit'
  
  // Table form state
  const [tableForm, setTableForm] = useState({
    id: '',
    type: 'square-4',
    number: '',
    name: '',
    x: 0,
    y: 0,
    rotation: 0,
    status: 'available',
    minCapacity: 2,
    maxCapacity: 4,
    isSmoking: false,
    isOutdoor: false,
    isReserved: false,
    notes: ''
  });
  
  // Refs
  const floorPlanRef = useRef(null);
  
  // Handle adding a new table
  const handleAddTable = (tableTypeId, x, y) => {
    const tableType = TABLE_TYPES.find(t => t.id === tableTypeId);
    if (!tableType) return;
    
    // Generate a unique ID for the table
    const tableId = `table-${Date.now()}`;
    
    // Find the next available table number
    const tableNumbers = floorPlan.tables.map(t => parseInt(t.number) || 0);
    const nextTableNumber = tableNumbers.length > 0 ? Math.max(...tableNumbers) + 1 : 1;
    
    const newTable = {
      id: tableId,
      type: tableTypeId,
      number: nextTableNumber.toString(),
      name: `Mesa ${nextTableNumber}`,
      x: x - tableType.width / 2, // Center the table at the click position
      y: y - tableType.height / 2,
      rotation: 0,
      status: 'available',
      minCapacity: tableType.seats,
      maxCapacity: tableType.seats,
      isSmoking: false,
      isOutdoor: false,
      isReserved: false,
      notes: ''
    };
    
    setFloorPlan(prev => ({
      ...prev,
      tables: [...prev.tables, newTable]
    }));
    
    setSelectedTable(newTable);
    setTableForm(newTable);
    setTableDialogMode('edit');
    setDialogOpen(true);
  };
  
  // Handle editing a table
  const handleEditTable = (table) => {
    setSelectedTable(table);
    setTableForm(table);
    setTableDialogMode('edit');
    setDialogOpen(true);
  };
  
  // Handle deleting a table
  const handleDeleteTable = (tableId) => {
    setFloorPlan(prev => ({
      ...prev,
      tables: prev.tables.filter(t => t.id !== tableId)
    }));
    
    if (selectedTable && selectedTable.id === tableId) {
      setSelectedTable(null);
    }
  };
  
  // Handle saving table changes
  const handleSaveTable = () => {
    if (tableDialogMode === 'add') {
      // This should never happen as we're always in edit mode after adding
      console.error('Unexpected table dialog mode:', tableDialogMode);
      return;
    }
    
    // Update the table in the floor plan
    setFloorPlan(prev => ({
      ...prev,
      tables: prev.tables.map(t => 
        t.id === tableForm.id ? { ...t, ...tableForm } : t
      )
    }));
    
    // Update the selected table reference
    setSelectedTable(tableForm);
    
    // Close the dialog
    setDialogOpen(false);
  };
  
  // Handle floor plan click
  const handleFloorPlanClick = (e) => {
    if (selectedTool === 'table' && e.target === floorPlanRef.current) {
      const rect = floorPlanRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;
      
      // Add a new table at the clicked position
      handleAddTable(tableForm.type || 'square-4', x, y);
    } else if (selectedTool === 'select') {
      // Deselect table if clicking on empty space
      setSelectedTable(null);
    }
  };
  
  // Handle table click
  const handleTableClick = (table, e) => {
    e.stopPropagation();
    
    if (selectedTool === 'select') {
      setSelectedTable(table);
    } else if (selectedTool === 'delete') {
      handleDeleteTable(table.id);
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete key to delete selected table
      if (e.key === 'Delete' && selectedTable) {
        handleDeleteTable(selectedTable.id);
      }
      
      // Escape key to deselect
      if (e.key === 'Escape') {
        setSelectedTool('select');
        setSelectedTable(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTable]);
  
  // Render a table
  const renderTable = (table) => {
    const tableType = TABLE_TYPES.find(t => t.id === table.type) || TABLE_TYPES[0];
    const isSelected = selectedTable && selectedTable.id === table.id;
    
    // Table style based on status
    const tableStyles = {
      position: 'absolute',
      left: `${table.x}px`,
      top: `${table.y}px`,
      width: `${tableType.width}px`,
      height: `${tableType.height}px`,
      backgroundColor: getTableColor(table.status),
      border: isSelected ? '2px solid #1976d2' : '1px solid #666',
      borderRadius: tableType.shape === 'round' ? '50%' : '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transform: `rotate(${table.rotation}deg)`,
      transformOrigin: 'center',
      transition: 'all 0.2s ease',
      zIndex: isSelected ? 10 : 1,
      boxShadow: isSelected ? '0 0 10px rgba(25, 118, 210, 0.5)' : 'none',
      overflow: 'hidden',
      '&:hover': {
        boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)'
      }
    };
    
    return (
      <Box
        key={table.id}
        sx={tableStyles}
        onClick={(e) => handleTableClick(table, e)}
        onDoubleClick={() => handleEditTable(table)}
      >
        {showTableNumbers && (
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 'bold',
              color: isSelected ? '#1976d2' : 'inherit',
              textAlign: 'center',
              lineHeight: 1,
              transform: `rotate(${-table.rotation}deg)`,
              textShadow: '0 0 2px white',
              pointerEvents: 'none'
            }}
          >
            {table.number}
          </Typography>
        )}
        
        {showTableTypes && (
          <Typography 
            variant="caption" 
            sx={{ 
              fontSize: '0.6rem',
              color: isSelected ? '#1976d2' : '#666',
              textAlign: 'center',
              transform: `rotate(${-table.rotation}deg)`,
              pointerEvents: 'none'
            }}
          >
            {tableType.name}
          </Typography>
        )}
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `rotate(${-table.rotation}deg)`,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: tableType.seats }).map((_, i) => (
            <ChairIcon 
              key={i} 
              sx={{ 
                fontSize: '0.8rem',
                color: isSelected ? '#1976d2' : '#666',
                m: 0.2 
              }} 
            />
          ))}
        </Box>
      </Box>
    );
  };
  
  // Get table color based on status
  const getTableColor = (status) => {
    switch (status) {
      case 'occupied':
        return '#ffcdd2'; // Light red
      case 'reserved':
        return '#fff9c4'; // Light yellow
      case 'cleaning':
        return '#bbdefb'; // Light blue
      case 'available':
      default:
        return '#c8e6c9'; // Light green
    }
  };
  
  // Render the floor plan grid
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const gridSize = 20; // pixels
    const gridColor = 'rgba(0, 0, 0, 0.1)';
    
    const horizontalLines = [];
    const verticalLines = [];
    
    // Add horizontal grid lines
    for (let y = 0; y <= floorPlan.height; y += gridSize) {
      horizontalLines.push(
        <line
          key={`h${y}`}
          x1={0}
          y1={y}
          x2={floorPlan.width}
          y2={y}
          stroke={gridColor}
          strokeWidth={1}
        />
      );
    }
    
    // Add vertical grid lines
    for (let x = 0; x <= floorPlan.width; x += gridSize) {
      verticalLines.push(
        <line
          key={`v${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={floorPlan.height}
          stroke={gridColor}
          strokeWidth={1}
        />
      );
    }
    
    return (
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        {horizontalLines}
        {verticalLines}
      </svg>
    );
  };
  
  // Render the floor plan background
  const renderBackground = () => {
    if (!floorPlan.backgroundImage) {
      return (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f5f5f5',
            zIndex: 0
          }}
        />
      );
    }
    
    return (
      <Box
        component="img"
        src={floorPlan.backgroundImage}
        alt="Floor plan background"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          zIndex: 0,
          opacity: 0.7
        }}
      />
    );
  };
  
  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '500px',
      position: 'relative',
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <h2>Gestión de Mesas</h2>
      <div style={{ 
        position: 'relative',
        width: '100%',
        height: '600px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        overflow: 'auto',
        marginTop: '10px'
      }}>
      {/* Toolbar */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 1, 
          mb: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <ToggleButtonGroup
          value={selectedTool}
          exclusive
          onChange={(e, newTool) => setSelectedTool(newTool)}
          aria-label="tool selection"
          size="small"
        >
          <ToggleButton value="select" aria-label="select">
            <Tooltip title="Seleccionar (S)">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M13,3A1,1 0 0,0 11.21,4.71L4.71,11.2C4.5,11.39 4.42,11.68 4.47,11.96L4.47,11.97L6,19.94C6.04,20.15 6.16,20.34 6.33,20.46C6.5,20.58 6.71,20.62 6.9,20.58L14.77,18.77C14.95,18.72 15.1,18.61 15.19,18.45L20.67,8.38C20.89,7.98 20.75,7.48 20.35,7.26C20.25,7.21 20.15,7.18 20.04,7.18L12.28,7.2L14.3,5.25C14.69,4.84 14.66,4.19 14.23,3.81C13.84,3.46 13.26,3.48 12.9,3.87L10.44,6.5L9.06,5.13L11.28,2.8C11.67,2.39 11.66,1.76 11.25,1.36C10.83,0.96 10.2,0.96 9.79,1.36L4.47,6.68C4.18,6.97 4.18,7.45 4.47,7.74L6.6,9.87L5.14,11.33L3.5,9.69C3.11,9.3 2.48,9.3 2.09,9.69C1.7,10.08 1.7,10.71 2.09,11.1L4.71,13.73L4.7,13.74L4.71,13.73L13,3Z" />
                </svg>
              </Box>
            </Tooltip>
          </ToggleButton>
          
          <ToggleButton value="table" aria-label="add table">
            <Tooltip title="Añadir Mesa (T)">
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TableIcon fontSize="small" />
                <AddIcon fontSize="small" sx={{ fontSize: '0.7rem', mt: -1 }} />
              </Box>
            </Tooltip>
          </ToggleButton>
          
          <ToggleButton value="delete" aria-label="delete">
            <Tooltip title="Eliminar (Supr)">
              <DeleteIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Table type selector */}
        {selectedTool === 'table' && (
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel>Tipo de Mesa</InputLabel>
            <Select
              value={tableForm.type}
              onChange={(e) => setTableForm(prev => ({ ...prev, type: e.target.value }))}
              label="Tipo de Mesa"
            >
              {TABLE_TYPES.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name} ({type.seats}P)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* View options */}
        <Tooltip title="Mostrar/Ocultar Cuadrícula">
          <IconButton 
            size="small" 
            onClick={() => setShowGrid(!showGrid)}
            color={showGrid ? 'primary' : 'default'}
          >
            <GridViewIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Mostrar/Ocultar Números">
          <IconButton 
            size="small" 
            onClick={() => setShowTableNumbers(!showTableNumbers)}
            color={showTableNumbers ? 'primary' : 'default'}
          >
            {showTableNumbers ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Mostrar/Ocultar Tipos">
          <IconButton 
            size="small" 
            onClick={() => setShowTableTypes(!showTableTypes)}
            color={showTableTypes ? 'primary' : 'default'}
          >
            <LayersIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        {/* Zoom controls */}
        <Box display="flex" alignItems="center" ml={1}>
          <Tooltip title="Alejar">
            <span>
              <IconButton 
                size="small" 
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                disabled={zoom <= 0.5}
              >
                <ZoomOutIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          <Typography variant="body2" sx={{ mx: 1, minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </Typography>
          
          <Tooltip title="Acercar">
            <span>
              <IconButton 
                size="small" 
                onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                disabled={zoom >= 2}
              >
                <ZoomInIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
        
        <Box flexGrow={1} />
        
        {/* Action buttons */}
        <Button 
          variant="outlined" 
          size="small" 
          startIcon={<SaveIcon />}
          sx={{ ml: 'auto' }}
        >
          Guardar
        </Button>
        
        <Button 
          variant="contained" 
          size="small" 
          color="primary"
          startIcon={<SaveIcon />}
        >
          Publicar Cambios
        </Button>
      </Paper>
      
      {/* Floor selector */}
      <Box sx={{ mb: 2, display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
        {floors.map((floor) => (
          <Button
            key={floor.id}
            variant={currentFloor === floor.id ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setCurrentFloor(floor.id)}
            startIcon={<LayersIcon />}
          >
            {floor.name}
          </Button>
        ))}
        
        <Button
          variant="text"
          size="small"
          startIcon={<AddIcon />}
        >
          Añadir Planta
        </Button>
      </Box>
      
      {/* Floor plan container */}
      <Paper 
        elevation={2} 
        sx={{ 
          flexGrow: 1, 
          position: 'relative', 
          overflow: 'hidden',
          backgroundColor: '#fff',
          minHeight: '400px'
        }}
      >
        <Box
          ref={floorPlanRef}
          onClick={handleFloorPlanClick}
          sx={{
            flex: 1,
            position: 'relative',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 2
          }}
        >
          <Box
            sx={{
              position: 'relative',
              backgroundColor: '#fff',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: `${floorPlan.width}px`,
              height: `${floorPlan.height}px`,
              minWidth: `${floorPlan.width}px`,
              minHeight: `${floorPlan.height}px`,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}
          >
            {renderBackground()}
            {renderGrid()}
            {floorPlan.tables.map(renderTable)}
          </Box>
          {selectedTable && (
            <Box
              sx={{
                position: 'absolute',
                border: '2px dashed #1976d2',
                pointerEvents: 'none',
                zIndex: 5,
                ...(selectedTable && {
                  left: `${selectedTable.x - 5}px`,
                  top: `${selectedTable.y - 5}px`,
                  width: `${(TABLE_TYPES.find(t => t.id === selectedTable.type)?.width || 100) + 10}px`,
                  height: `${(TABLE_TYPES.find(t => t.id === selectedTable.type)?.height || 100) + 10}px`,
                  borderRadius: TABLE_TYPES.find(t => t.id === selectedTable.type)?.shape === 'round' ? '50%' : '4px',
                  transform: `rotate(${selectedTable.rotation}deg)`,
                  transformOrigin: 'center',
                })
              }}
            />
          )}
        </Box>
        
        {/* Status bar */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            p: 1,
            display: 'flex',
            justifyContent: 'space-between',
            zIndex: 10
          }}
        >
          <Typography variant="caption">
            {selectedTable 
              ? `Mesa ${selectedTable.number} seleccionada` 
              : selectedTool === 'table' 
                ? 'Haz clic en el plano para colocar una mesa' 
                : 'Selecciona una herramienta para comenzar'}
          </Typography>
          
          <Box display="flex" gap={2}>
            <Typography variant="caption">
              {floorPlan.tables.length} mesas
            </Typography>
            
            <Box display="flex" gap={1}>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 12, height: 12, bgcolor: '#c8e6c9', mr: 0.5, borderRadius: '2px' }} />
                <Typography variant="caption">Disponible</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 12, height: 12, bgcolor: '#ffcdd2', mr: 0.5, borderRadius: '2px' }} />
                <Typography variant="caption">Ocupada</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Box sx={{ width: 12, height: 12, bgcolor: '#fff9c4', mr: 0.5, borderRadius: '2px' }} />
                <Typography variant="caption">Reservada</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Table properties dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {tableDialogMode === 'add' ? 'Añadir Nueva Mesa' : `Editar Mesa ${tableForm.number}`}
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Número de Mesa"
                value={tableForm.number}
                onChange={(e) => setTableForm(prev => ({ ...prev, number: e.target.value }))}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Tipo de Mesa</InputLabel>
                <Select
                  value={tableForm.type}
                  onChange={(e) => setTableForm(prev => ({ ...prev, type: e.target.value }))}
                  label="Tipo de Mesa"
                >
                  {TABLE_TYPES.map((type) => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.name} ({type.seats} personas)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre o Identificador"
                value={tableForm.name}
                onChange={(e) => setTableForm(prev => ({ ...prev, name: e.target.value }))}
                margin="normal"
                helperText="Ej: Ventana, Terraza, VIP..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Estado</InputLabel>
                <Select
                  value={tableForm.status}
                  onChange={(e) => setTableForm(prev => ({ ...prev, status: e.target.value }))}
                  label="Estado"
                >
                  <MenuItem value="available">Disponible</MenuItem>
                  <MenuItem value="occupied">Ocupada</MenuItem>
                  <MenuItem value="reserved">Reservada</MenuItem>
                  <MenuItem value="cleaning">Limpieza</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacidad Mínima"
                type="number"
                value={tableForm.minCapacity}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  minCapacity: parseInt(e.target.value) || 0 
                }))}
                margin="normal"
                inputProps={{ min: 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capacidad Máxima"
                type="number"
                value={tableForm.maxCapacity}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  maxCapacity: parseInt(e.target.value) || 0 
                }))}
                margin="normal"
                inputProps={{ min: tableForm.minCapacity || 1 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Posición X"
                type="number"
                value={tableForm.x}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  x: parseInt(e.target.value) || 0 
                }))}
                margin="normal"
                disabled
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Posición Y"
                type="number"
                value={tableForm.y}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  y: parseInt(e.target.value) || 0 
                }))}
                margin="normal"
                disabled
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rotación (grados)"
                type="number"
                value={tableForm.rotation}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  rotation: parseInt(e.target.value) || 0 
                }))}
                margin="normal"
                inputProps={{ min: 0, max: 360, step: 15 }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={tableForm.isSmoking}
                      onChange={(e) => setTableForm(prev => ({ 
                        ...prev, 
                        isSmoking: e.target.checked 
                      }))}
                      color="primary"
                    />
                  }
                  label="Zona de Fumadores"
                />
                
                <FormControlLabel
                  control={
                    <Switch
                      checked={tableForm.isOutdoor}
                      onChange={(e) => setTableForm(prev => ({ 
                        ...prev, 
                        isOutdoor: e.target.checked 
                      }))}
                      color="primary"
                    />
                  }
                  label="Terraza"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas"
                value={tableForm.notes}
                onChange={(e) => setTableForm(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
                margin="normal"
                multiline
                rows={3}
                placeholder="Notas adicionales sobre esta mesa..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)}
            color="inherit"
          >
            Cancelar
          </Button>
          
          <Button 
            onClick={handleSaveTable}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablesTab;
