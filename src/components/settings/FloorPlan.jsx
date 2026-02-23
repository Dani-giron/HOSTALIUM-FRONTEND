import React, { useRef, useState } from 'react';
import { Stage, Layer, Group, Line } from 'react-konva';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Divider,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GridOn as GridOnIcon,
  GridOff as GridOffIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Save as SaveIcon,
  Restaurant as TableIcon,
  Circle as CircleIcon,
  Filter1 as NumbersIcon,
  Filter1Outlined as NumbersOffIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  CheckCircle as AvailableIcon,
  AccessTime as PendingIcon,
  People as OccupiedIcon,
  Block as UnavailableIcon
} from '@mui/icons-material';
import TableShape from './TableShape';
import { updateTableStatus } from '../../services/tableService';

const FloorPlan = ({
  tables = [],
  onTableAdd,
  onTableUpdate,
  onTableDelete,
  onTableDuplicate,
  onTableEdit,
  onSave,
  isAdmin = true,
  width = 1000,
  height = 800,
}) => {
  const stageRef = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);
  const [newTableType, setNewTableType] = useState('rect');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [tableFilters, setTableFilters] = useState({
    type: 'all', // all, white, square, rounds, black, wooden
    seats: 'all', // all, 2x, 4x, 6x
    chairs: 'all' // all, white, black, wooden
  });
  const [contextMenu, setContextMenu] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const selectedTable = tables.find((t) => t.id === selectedId);

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }

    const clickedOnTable = tables.find((table) => table.id === e.target.parent.attrs.id);
    if (clickedOnTable) {
      setSelectedId(clickedOnTable.id);
    }
  };

  const handleStageDblClick = (e) => {
    if (!isAdmin || !isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    const newTable = {
      id: `table-${Date.now()}`,
      type: newTableType,
      number: (tables.length + 1).toString(),
      x: point.x / zoom,
      y: point.y / zoom,
      width: newTableType === 'round' ? 80 : 100,
      height: newTableType === 'round' ? 80 : 60,
      rotation: 0,
      status: 'available',
      capacity: newTableType === 'round' ? 6 : 4,
      occupancy: 0,
    };

    onTableAdd(newTable);
    setSelectedId(newTable.id);
  };

  const handleTableChange = (newAttrs) => {
    onTableUpdate(newAttrs);
  };

  const handleDeleteTable = () => {
    if (selectedId && onTableDelete) {
      onTableDelete(selectedId);
      setSelectedId(null);
    }
  };

  const handleDuplicateTable = () => {
    if (selectedTable && onTableDuplicate) {
      onTableDuplicate(selectedTable);
    }
  };

  const handleRotateTable = (direction) => {
    if (!selectedTable) return;
    const rotation = direction === 'left' ? selectedTable.rotation - 15 : selectedTable.rotation + 15;
    onTableUpdate({ ...selectedTable, rotation });
  };

  const handleTableTypeChange = (type) => {
    setNewTableType(type);
    setIsDrawing(true);
  };

  // Manejar cambio de estado de mesa
  const handleStatusChange = async (tableId, newStatus, additionalData = {}) => {
    try {
      // Actualizar en el backend
      await updateTableStatus(tableId, newStatus, additionalData);
      
      // Actualizar estado local
      const updatedTable = tables.find(t => t.id === tableId);
      if (updatedTable) {
        onTableUpdate({
          ...updatedTable,
          status: newStatus,
          ...additionalData
        });
      }

      // Mostrar notificación
      setNotification({
        open: true,
        message: `Estado de mesa actualizado a ${getStatusText(newStatus)}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating table status:', error);
      setNotification({
        open: true,
        message: 'Error al actualizar el estado de la mesa',
        severity: 'error'
      });
    }
  };

  // Obtener texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case 'available':
      case 'disponible':
        return 'Disponible';
      case 'occupied':
      case 'ocupada':
        return 'Ocupada';
      case 'pending':
      case 'reserved':
      case 'reservada':
      case 'en espera':
        return 'En Espera';
      case 'unavailable':
      case 'no disponible':
        return 'No Disponible';
      default:
        return 'Desconocido';
    }
  };

  // Manejar menú contextual
  const handleTableRightClick = (e, table) => {
    e.evt.preventDefault();
    setContextMenu({
      mouseX: e.evt.clientX,
      mouseY: e.evt.clientY,
      table: table
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleStatusMenuItemClick = (status) => {
    if (contextMenu?.table) {
      handleStatusChange(contextMenu.table.id, status);
    }
    handleContextMenuClose();
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridSize = 20 * zoom;
    const gridWidth = width / zoom;
    const gridHeight = height / zoom;
    const lines = [];

    for (let i = 0; i <= gridWidth; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, gridHeight]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }

    for (let i = 0; i <= gridHeight; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, gridWidth, i]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }

    return <Group>{lines}</Group>;
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid #e0e0e0',
        px: 2,
        py: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button 
              startIcon={<ArrowBackIcon />}
              sx={{ textTransform: 'none', color: '#666' }}
            >
              Tables
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
              Arrange Tables
            </Typography>
          </Box>

          {/* Floor Tabs */}
          <Tabs 
            value={selectedFloor} 
            onChange={(e, newValue) => setSelectedFloor(newValue)}
            sx={{ minHeight: 48 }}
          >
            <Tab label="1st Floor" />
            <Tab label="2d Floor" />
            <Tab label="3d Floor" />
          </Tabs>

          {/* Right Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Undo">
              <IconButton size="small">
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Redo">
              <IconButton size="small">
                <RedoIcon />
              </IconButton>
            </Tooltip>
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={onSave}
              sx={{ ml: 1 }}
            >
              Save Changes
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Floor Plan Area */}
        <Box sx={{ flex: 1, position: 'relative', bgcolor: '#fafafa' }}>
          {/* Toolbar */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              display: 'flex',
              gap: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: 1,
              borderRadius: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <Tooltip title="Editar mesa seleccionada">
              <span>
                <IconButton 
                  onClick={() => selectedTable && onTableEdit && onTableEdit(selectedTable)}
                  disabled={!selectedId}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Eliminar mesa seleccionada">
              <span>
                <IconButton 
                  onClick={handleDeleteTable} 
                  disabled={!selectedId}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Duplicar mesa seleccionada">
              <span>
                <IconButton 
                  onClick={handleDuplicateTable} 
                  disabled={!selectedId}
                  size="small"
                >
                  <DuplicateIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Rotar a la izquierda">
              <span>
                <IconButton 
                  onClick={() => handleRotateTable('left')} 
                  disabled={!selectedId}
                  size="small"
                >
                  <RotateLeftIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Rotar a la derecha">
              <span>
                <IconButton 
                  onClick={() => handleRotateTable('right')} 
                  disabled={!selectedId}
                  size="small"
                >
                  <RotateRightIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title={showGrid ? 'Ocultar cuadrícula' : 'Mostrar cuadrícula'}>
              <IconButton onClick={() => setShowGrid(!showGrid)} size="small">
                {showGrid ? <GridOnIcon /> : <GridOffIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={showNumbers ? 'Ocultar números' : 'Mostrar números'}>
              <IconButton onClick={() => setShowNumbers(!showNumbers)} size="small">
                {showNumbers ? <NumbersIcon /> : <NumbersOffIcon />}
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Acercar">
              <IconButton onClick={() => setZoom(Math.min(2, zoom + 0.1))} size="small">
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Alejar">
              <IconButton onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} size="small">
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Stage */}
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <Stage
              width={width}
              height={height}
              ref={stageRef}
              onClick={handleStageClick}
              onDblClick={handleStageDblClick}
              scaleX={zoom}
              scaleY={zoom}
              style={{ 
                backgroundColor: '#ffffff', 
                cursor: isDrawing ? 'crosshair' : 'default',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px'
              }}
            >
              <Layer>
                {renderGrid()}
                {tables.map((table) => (
                  <TableShape
                    key={table.id}
                    shapeProps={table}
                    isSelected={table.id === selectedId}
                    onSelect={() => setSelectedId(table.id)}
                    onChange={handleTableChange}
                    onEdit={() => {
                      if (onTableEdit) {
                        onTableEdit(table);
                      }
                    }}
                    onRightClick={handleTableRightClick}
                    isAdmin={isAdmin}
                    showNumbers={showNumbers}
                  />
                ))}
              </Layer>
            </Stage>

            {/* Status Legend */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                bgcolor: 'rgba(255, 255, 255, 0.95)',
                padding: 2,
                borderRadius: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                zIndex: 10
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Estado de Mesas
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#4CAF50', borderRadius: 0.5 }} />
                  <Typography variant="caption">Disponible</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#FF9800', borderRadius: 0.5 }} />
                  <Typography variant="caption">En Espera / Reservada</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#F44336', borderRadius: 0.5 }} />
                  <Typography variant="caption">Ocupada</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 16, height: 16, bgcolor: '#9E9E9E', borderRadius: 0.5 }} />
                  <Typography variant="caption">No Disponible</Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Table Library Sidebar */}
        <Box sx={{ 
          width: 320, 
          bgcolor: 'white', 
          borderLeft: '1px solid #e0e0e0',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Table Library
            </Typography>
            
            {/* Table Type Filters */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Table Type</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {[
                  { id: 'white', label: 'White Table', active: tableFilters.type === 'white' },
                  { id: 'square', label: 'Square', active: tableFilters.type === 'square' },
                  { id: 'rounds', label: 'Rounds', active: tableFilters.type === 'rounds' },
                  { id: 'black', label: 'Black', active: tableFilters.type === 'black' },
                  { id: 'wooden', label: 'Wooden Table', active: tableFilters.type === 'wooden' }
                ].map((filter) => (
                  <Chip
                    key={filter.id}
                    label={filter.label}
                    onClick={() => setTableFilters(prev => ({ ...prev, type: filter.id }))}
                    color={filter.active ? 'primary' : 'default'}
                    size="small"
                    clickable
                  />
                ))}
              </Box>
            </Stack>

            {/* Seating Capacity Filters */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Seating Capacity</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {[
                  { id: '2x', label: '2x Seats', active: tableFilters.seats === '2x' },
                  { id: '4x', label: '4x Seats', active: tableFilters.seats === '4x' }
                ].map((filter) => (
                  <Chip
                    key={filter.id}
                    label={filter.label}
                    onClick={() => setTableFilters(prev => ({ ...prev, seats: filter.id }))}
                    color={filter.active ? 'primary' : 'default'}
                    size="small"
                    clickable
                  />
                ))}
              </Box>
            </Stack>

            {/* Chair Type Filter */}
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Chair Type</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip
                  label="White Chairs"
                  onClick={() => setTableFilters(prev => ({ ...prev, chairs: 'white' }))}
                  color={tableFilters.chairs === 'white' ? 'primary' : 'default'}
                  size="small"
                  clickable
                />
              </Box>
            </Stack>
          </Box>

          {/* Table Previews */}
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
              Available Tables
            </Typography>
            <Stack spacing={2}>
              {/* 2-Seater Table */}
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: newTableType === 'rect' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 2 }
                }}
                onClick={() => setNewTableType('rect')}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 40, 
                    bgcolor: '#f5f5f5', 
                    border: '2px solid #333',
                    borderRadius: 1,
                    mx: 'auto',
                    mb: 1
                  }} />
                  <Typography variant="caption">2-Seater Square Table</Typography>
                </CardContent>
              </Card>

              {/* 4-Seater Table */}
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: newTableType === 'rect-4' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 2 }
                }}
                onClick={() => setNewTableType('rect-4')}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 50, 
                    bgcolor: '#f5f5f5', 
                    border: '2px solid #333',
                    borderRadius: 1,
                    mx: 'auto',
                    mb: 1
                  }} />
                  <Typography variant="caption">4-Seater Square Table</Typography>
                </CardContent>
              </Card>

              {/* 6-Seater Table */}
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: newTableType === 'round' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  '&:hover': { boxShadow: 2 }
                }}
                onClick={() => setNewTableType('round')}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Box sx={{ 
                    width: 70, 
                    height: 70, 
                    bgcolor: '#f5f5f5', 
                    border: '2px solid #333',
                    borderRadius: '50%',
                    mx: 'auto',
                    mb: 1
                  }} />
                  <Typography variant="caption">6-Seater Round Table</Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>

          {/* Add Table Button */}
          <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsDrawing(!isDrawing)}
              color={isDrawing ? 'error' : 'primary'}
            >
              {isDrawing ? 'Cancel Adding' : 'Add Table'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => handleStatusMenuItemClick('available')}>
          <ListItemIcon>
            <AvailableIcon fontSize="small" sx={{ color: '#4CAF50' }} />
          </ListItemIcon>
          <ListItemText>Marcar como Disponible</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusMenuItemClick('pending')}>
          <ListItemIcon>
            <PendingIcon fontSize="small" sx={{ color: '#FF9800' }} />
          </ListItemIcon>
          <ListItemText>Marcar como En Espera</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusMenuItemClick('occupied')}>
          <ListItemIcon>
            <OccupiedIcon fontSize="small" sx={{ color: '#F44336' }} />
          </ListItemIcon>
          <ListItemText>Marcar como Ocupada</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleStatusMenuItemClick('unavailable')}>
          <ListItemIcon>
            <UnavailableIcon fontSize="small" sx={{ color: '#9E9E9E' }} />
          </ListItemIcon>
          <ListItemText>Marcar como No Disponible</ListItemText>
        </MenuItem>
      </Menu>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FloorPlan;
