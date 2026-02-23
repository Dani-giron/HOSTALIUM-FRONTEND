import React from 'react';
import { Group, Rect, Text, Circle, Line } from 'react-konva';

const TableShape = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onEdit,
  isAdmin = true,
  showNumbers = true,
}) => {
  const shapeRef = React.useRef();

  const getTableColor = () => {
    if (!shapeProps) return '#4ade80';

    const status = shapeProps.status || 'available';

    switch (status) {
      case 'occupied':
        return '#ef4444';  // Rojo para ocupada
      case 'pending':
        return '#f59e0b';  // Amarillo para pendiente
      case 'unavailable':
        return '#6b7280'; // Gris para no disponible
      case 'available':
      default:
        return '#4ade80';  // Verde para disponible
    }
  };

  const renderTable = () => {
    if (!shapeProps) return null;

    const {
      x = 100,
      y = 100,
      width = 100,
      height = 50,
      tipo = 'rectangular',
      rotation = 0,
      nombre,
      capacidad = 4,
      status
    } = shapeProps;

    const isRound = tipo === 'round' || tipo === 'redonda';
    const tableColor = getTableColor();

    return (
      <Group
        x={x}
        y={y}
        rotation={rotation}
        onClick={onSelect}
        onTap={onSelect}
        draggable={isAdmin}
        onDragEnd={(e) => {
          if (onChange) {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }
        }}
        ref={shapeRef}
      >
        {/* Selection indicator */}
        {isSelected && (
          <Line
            points={isRound ? 
              [0, -width/2 - 5, 0, width/2 + 5, 0, -width/2 - 5] :
              [-width/2 - 5, -height/2 - 5, width/2 + 5, -height/2 - 5, 
               width/2 + 5, height/2 + 5, -width/2 - 5, height/2 + 5, 
               -width/2 - 5, -height/2 - 5]
            }
            stroke="#3b82f6"
            strokeWidth={3}
            dash={[10, 5]}
            closed={!isRound}
          />
        )}

        {/* Table shape */}
        {isRound ? (
          <Circle
            x={0}
            y={0}
            radius={width / 2}
            fill={tableColor}
            stroke="#1f2937"
            strokeWidth={2}
            opacity={0.9}
          />
        ) : (
          <Rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            fill={tableColor}
            stroke="#1f2937"
            strokeWidth={2}
            cornerRadius={8}
            opacity={0.9}
          />
        )}

        {/* Table number/name */}
        {showNumbers && (
          <Text
            text={nombre || ''}
            fontSize={16}
            fontFamily="Arial, sans-serif"
            fill="white"
            fontWeight="bold"
            align="center"
            verticalAlign="middle"
            x={-width / 2}
            y={-height / 3}
            width={width}
            height={20}
          />
        )}

        {/* Capacity */}
        <Text
          text={`${capacidad} pers.`}
          fontSize={12}
          fontFamily="Arial, sans-serif"
          fill="white"
          align="center"
          verticalAlign="middle"
          x={-width / 2}
          y={height / 3 - 10}
          width={width}
          height={15}
        />

        {/* Status indicator */}
        <Text
          text={status === 'occupied' ? 'Ocupada' : status === 'pending' ? 'Pendiente' : 'Libre'}
          fontSize={10}
          fontFamily="Arial, sans-serif"
          fill="white"
          align="center"
            verticalAlign="middle"
          x={-width / 2}
          y={height / 2 - 15}
          width={width}
          height={12}
        />

        {/* Edit button for admin */}
        {isAdmin && (
          <Group
            x={-width / 2 + 8}
            y={-height / 2 + 8}
            onClick={(e) => {
              e.cancelBubble = true;
              if (onEdit) onEdit();
            }}
            onTap={(e) => {
              e.cancelBubble = true;
              if (onEdit) onEdit();
            }}
          >
            <Circle radius={10} fill="rgba(255,255,255,0.9)" />
            <Text
              text="✏️"
              fontSize={12}
              x={-6}
              y={-6}
              width={20}
              height={20}
            />
          </Group>
        )}
      </Group>
    );
  };

  return renderTable();
};

export default TableShape;
