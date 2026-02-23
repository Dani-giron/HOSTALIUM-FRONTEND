import React from 'react';
import { Group, Rect, Text, Circle, Transformer } from 'react-konva';

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
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected && isAdmin) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, isAdmin]);

  const getTableColor = () => {
    if (!shapeProps) return '#A5D8FF';

    const status = shapeProps.status ||
      (shapeProps.disponible === false ? 'unavailable' : 'available');

    switch (status) {
      case 'occupied':
      case 'ocupada':
        return '#FF6B6B';  // Rojo para ocupada
      case 'reserved':
      case 'reservada':
        return '#4ECDC4';  // Verde azulado para reservada
      case 'unavailable':
      case 'no disponible':
        return '#CCCCCC'; // Gris para no disponible
      default:
        return '#A5D8FF';  // Azul claro para disponible
    }
  };

  const renderTable = () => {
    if (!shapeProps) return null;

    const {
      x = 100,
      y = 100,
      width = 100,
      height = 50,
      type = 'rectangular',
      rotation = 0
    } = shapeProps;

    const isRound = type === 'round' || type === 'redonda';

    return (
      <Group
        x={x}
        y={y}
        rotation={rotation}
        onClick={onSelect}
        onTap={onSelect}
        draggable={isAdmin}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        ref={shapeRef}
      >
        {/* Mesa */}
        {isRound ? (
          <Circle
            x={0}
            y={0}
            radius={width / 2}
            fill={getTableColor()}
            stroke="#333"
            strokeWidth={1}
          />
        ) : (
          <Rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height}
            fill={getTableColor()}
            stroke="#333"
            strokeWidth={1}
            cornerRadius={10}
          />
        )}

        {/* Número de mesa */}
        {showNumbers && (
          <Text
            text={shapeProps.nombre || shapeProps.number || ''}
            fontSize={14}
            fontFamily="Arial"
            fill="#333"
            align="center"
            verticalAlign="middle"
            x={-width / 2}
            y={-10}
            width={width}
            height={20}
            wrap="char"
            ellipsis={true}
          />
        )}

        {/* Capacidad */}
        <Text
          text={`${shapeProps.ocupadaAhora ? 'Ocupada' : 'Libre'} • ${shapeProps.capacidad || 4} pers.`}
          fontSize={12}
          fontFamily="Arial"
          fill="#333"
          align="center"
          verticalAlign="middle"
          x={-width / 2}
          y={height / 2 - 20}
          width={width}
          height={20}
        />

        {/* Botón de edición (solo para administradores) */}
        {isAdmin && (
          <Group
            x={-width / 2 + 5}
            y={-height / 2 + 5}
            onClick={(e) => {
              e.cancelBubble = true; // Evitar que se active el evento de selección
              onEdit();
            }}
            onTap={(e) => {
              e.cancelBubble = true; // Evitar que se active el evento de selección
              onEdit();
            }}
          >
            <Rect width={20} height={20} fill="#fff" cornerRadius={10} />
            <Text
              text="✏️"
              fontSize={12}
              x={4}
              y={2}
              width={20}
              height={20}
            />
          </Group>
        )}
      </Group>
    );
  };

  return (
    <>
      {renderTable()}
      {isSelected && isAdmin && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          onTransformEnd={() => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            const rotation = node.rotation();
            
            // Reset scale
            node.scaleX(1);
            node.scaleY(1);
            
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(30, node.width() * scaleX),
              height: Math.max(30, node.height() * scaleY),
              rotation: rotation,
            });
          }}
          boundBoxFunc={(oldBox, newBox) => {
            // Limitar el tamaño mínimo
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default TableShape;