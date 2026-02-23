import React, { useRef, useState } from 'react';
import { Stage, Layer, Group, Line } from 'react-konva';
import { Box, IconButton, Tooltip, Divider } from '@mui/material';
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
  TableRestaurant as TableIcon,
  Circle as CircleIcon,
  Filter1 as NumbersIcon,
  Filter1Outlined as NumbersOffIcon,
} from '@mui/icons-material';
import TableShape from './TableShape';

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
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: 1,
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Tooltip title="Editar mesa seleccionada">
          <span>
            <IconButton 
              onClick={() => selectedTable && onTableEdit && onTableEdit(selectedTable)}
              disabled={!selectedId}
              color="primary"
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
            >
              <RotateRightIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title={showGrid ? 'Ocultar cuadrícula' : 'Mostrar cuadrícula'}>
          <IconButton onClick={() => setShowGrid(!showGrid)}>
            {showGrid ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={showNumbers ? 'Ocultar números' : 'Mostrar números'}>
          <IconButton onClick={() => setShowNumbers(!showNumbers)}>
            {showNumbers ? <NumbersIcon /> : <NumbersOffIcon />}
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Acercar">
          <IconButton onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Alejar">
          <IconButton onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem />
        <Tooltip title="Guardar cambios">
          <IconButton onClick={onSave} color="primary">
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Stage
        width={width}
        height={height}
        ref={stageRef}
        onClick={handleStageClick}
        onDblClick={handleStageDblClick}
        scaleX={zoom}
        scaleY={zoom}
        style={{ backgroundColor: '#f9f9f9', cursor: isDrawing ? 'crosshair' : 'default' }}
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
              isAdmin={isAdmin}
              showNumbers={showNumbers}
            />
          ))}
        </Layer>
      </Stage>
    </Box>
  );
};

export default FloorPlan;
