import React from 'react';
import { Group, Rect, Text, Circle, Transformer } from 'react-konva';

const TableShape = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  onEdit,
  onRightClick,
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
    if (!shapeProps) return '#4CAF50'; // Verde por defecto para disponible

    const status = shapeProps.status ||
      (shapeProps.disponible === false ? 'unavailable' : 'available');

    switch (status) {
      case 'occupied':
      case 'ocupada':
        return '#F44336';  // Rojo Material Design para ocupada
      case 'pending':
      case 'reserved':
      case 'reservada':
      case 'en espera':
        return '#FF9800';  // Ámbar Material Design para en espera/reservada
      case 'unavailable':
      case 'no disponible':
        return '#9E9E9E'; // Gris Material Design para no disponible
      case 'available':
      case 'disponible':
      default:
        return '#4CAF50';  // Verde Material Design para disponible
    }
  };

  const getStatusText = () => {
    const status = shapeProps.status ||
      (shapeProps.disponible === false ? 'unavailable' : 'available');

    switch (status) {
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
        return 'No Disp.';
      case 'available':
      case 'disponible':
      default:
        return 'Disponible';
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
        onContextMenu={(e) => {
          e.evt.preventDefault();
          if (onRightClick) {
            onRightClick(e, shapeProps);
          }
        }}
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

        {/* Información de estado y capacidad */}
        <Text
          text={`${getStatusText()} • ${shapeProps.capacidad || 4} pers.`}
          fontSize={11}
          fontFamily="Arial, sans-serif"
          fill="#333"
          align="center"
          verticalAlign="middle"
          x={-width / 2}
          y={height / 2 - 20}
          width={width}
          height={20}
        />

        {/* Información adicional si está ocupada */}
        {(shapeProps.ocupadaAhora || shapeProps.status === 'occupied') && (
          <Text
            text={`${shapeProps.ocupantes || 0}/${shapeProps.capacidad || 4}`}
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fill="white"
            align="center"
            verticalAlign="middle"
            x={-width / 2}
            y={-height / 2 + 5}
            width={width}
            height={15}
            style={{ fontWeight: 'bold' }}
          />
        )}

        {/* Información de reserva si está reservada */}
        {(shapeProps.status === 'pending' || shapeProps.status === 'reserved') && (
          <Text
            text="⏰ Reservada"
            fontSize={10}
            fontFamily="Arial, sans-serif"
            fill="white"
            align="center"
            verticalAlign="middle"
            x={-width / 2}
            y={-height / 2 + 5}
            width={width}
            height={15}
            style={{ fontWeight: 'bold' }}
          />
        )}

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