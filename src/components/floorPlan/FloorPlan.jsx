import React, { useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  GridOn as GridOnIcon,
  GridOff as GridOffIcon,
  Filter1 as NumbersIcon,
  Filter1Outlined as NumbersOffIcon,
} from '@mui/icons-material';
import TableShape from './TableShape';

const FloorPlan = ({
  tables = [],
  selectedTable = null,
  onTableSelect,
  onTableUpdate,
  isAdmin = true,
  isLoading = false
}) => {
  const stageRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [showNumbers, setShowNumbers] = useState(true);

  console.log('🔍 FloorPlan.jsx - Renderizando con tables:', tables);
  console.log('🔍 FloorPlan.jsx - isLoading:', isLoading);
  console.log('🔍 FloorPlan.jsx - selectedTable:', selectedTable);

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridSize = 20 * zoom;
    const gridWidth = 1000 / zoom;
    const gridHeight = 800 / zoom;
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

    return <>{lines}</>;
  };

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      onTableSelect(null);
      return;
    }

    const clickedOnTable = tables.find((table) => table.id === e.target.parent?.attrs?.id);
    if (clickedOnTable) {
      onTableSelect(clickedOnTable);
    }
  };

  const handleTableChange = (newAttrs) => {
    if (onTableUpdate) {
      onTableUpdate(newAttrs);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.6)'
      }}>
        Cargando plano de mesas...
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Controls */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
          display: 'flex',
          gap: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 1,
          borderRadius: 1,
          boxShadow: 2,
        }}
      >
        <Tooltip title={showGrid ? 'Ocultar cuadrícula' : 'Mostrar cuadrícula'}>
          <IconButton 
            onClick={() => setShowGrid(!showGrid)}
            sx={{ color: 'white' }}
          >
            {showGrid ? <GridOnIcon /> : <GridOffIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title={showNumbers ? 'Ocultar números' : 'Mostrar números'}>
          <IconButton 
            onClick={() => setShowNumbers(!showNumbers)}
            sx={{ color: 'white' }}
          >
            {showNumbers ? <NumbersIcon /> : <NumbersOffIcon />}
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Acercar">
          <IconButton 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            sx={{ color: 'white' }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Alejar">
          <IconButton 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            sx={{ color: 'white' }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stage */}
      <Stage
        width={1000}
        height={800}
        ref={stageRef}
        onClick={handleStageClick}
        scaleX={zoom}
        scaleY={zoom}
        style={{ 
          backgroundColor: '#1a1a1a', 
          cursor: 'pointer',
          width: '100%',
          height: '100%'
        }}
      >
        <Layer>
          {renderGrid()}
          {tables.map((table) => (
            <TableShape
              key={table.id}
              shapeProps={table}
              isSelected={selectedTable?.id === table.id}
              onSelect={() => onTableSelect(table)}
              onChange={handleTableChange}
              onEdit={() => {}} // No editing in view mode
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
