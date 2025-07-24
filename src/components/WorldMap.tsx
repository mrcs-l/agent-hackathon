import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disaster, OperationalCenter, Shipment } from '../types';

interface WorldMapProps {
  disasters: Disaster[];
  operationalCenters: OperationalCenter[];
  shipments: Shipment[];
  onDisasterClick: (disaster: Disaster) => void;
  onCenterClick: (center: OperationalCenter) => void;
  onShipmentClick: (shipment: Shipment) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  disasters,
  operationalCenters,
  shipments,
  onDisasterClick,
  onCenterClick,
  onShipmentClick
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#d97706';
      case 'low': return '#65a30d';
      default: return '#6b7280';
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'ample': return '#16a34a';
      case 'moderate': return '#eab308';
      case 'low': return '#ea580c';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getShipmentStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#16a34a';
      case 'in_transit': return '#3b82f6';
      case 'delayed': return '#eab308';
      case 'exception': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (type) {
      case 'hurricane': return '🌀';
      case 'earthquake': return '🏔️';
      case 'flood': return '🌊';
      case 'wildfire': return '🔥';
      case 'tornado': return '🌪️';
      default: return '⚠️';
    }
  };

  const convertToMapCoordinates = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 800 + 50;
    const y = ((90 - lat) / 180) * 400 + 50;
    return { x, y };
  };

  return (
    <div className="world-map">
      <svg viewBox="0 0 900 500" className="map-svg">
        <rect x="0" y="0" width="900" height="500" fill="#0f172a" />
        
        <g className="continents">
          <path
            d="M 150 150 Q 200 100 300 120 Q 400 130 450 160 Q 500 180 400 220 Q 300 240 200 220 Q 150 200 150 150 Z"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
          <path
            d="M 500 200 Q 600 180 700 200 Q 750 220 720 280 Q 680 320 600 300 Q 520 280 500 200 Z"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
          <path
            d="M 100 300 Q 200 280 300 300 Q 400 320 350 380 Q 300 400 200 380 Q 100 360 100 300 Z"
            fill="#334155"
            stroke="#475569"
            strokeWidth="1"
          />
        </g>

        {shipments.map((shipment) => {
          const origin = operationalCenters.find(oc => oc.name === shipment.origin);
          const disaster = disasters.find(d => d.location.name === shipment.destination);
          
          if (!origin || !disaster) return null;
          
          const originCoords = convertToMapCoordinates(origin.location.lat, origin.location.lng);
          const destCoords = convertToMapCoordinates(disaster.location.lat, disaster.location.lng);
          
          return (
            <motion.line
              key={shipment.id}
              x1={originCoords.x}
              y1={originCoords.y}
              x2={destCoords.x}
              y2={destCoords.y}
              stroke={getShipmentStatusColor(shipment.status)}
              strokeWidth="3"
              strokeDasharray={shipment.status === 'delayed' ? '5,5' : '0'}
              className="shipment-line"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2 }}
              onMouseEnter={() => setHoveredItem(`shipment-${shipment.id}`)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onShipmentClick(shipment)}
              style={{ cursor: 'pointer' }}
            />
          );
        })}

        {disasters.map((disaster) => {
          const coords = convertToMapCoordinates(disaster.location.lat, disaster.location.lng);
          return (
            <motion.g
              key={disaster.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              onMouseEnter={() => setHoveredItem(`disaster-${disaster.id}`)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onDisasterClick(disaster)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={coords.x}
                cy={coords.y}
                r="20"
                fill={getSeverityColor(disaster.severity)}
                opacity="0.3"
                className="disaster-pulse"
              />
              <circle
                cx={coords.x}
                cy={coords.y}
                r="12"
                fill={getSeverityColor(disaster.severity)}
              />
              <text
                x={coords.x}
                y={coords.y + 5}
                textAnchor="middle"
                fontSize="16"
                fill="white"
              >
                {getDisasterIcon(disaster.type)}
              </text>
            </motion.g>
          );
        })}

        {operationalCenters.map((center) => {
          const coords = convertToMapCoordinates(center.location.lat, center.location.lng);
          return (
            <motion.g
              key={center.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onMouseEnter={() => setHoveredItem(`center-${center.id}`)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => onCenterClick(center)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={coords.x - 8}
                y={coords.y - 8}
                width="16"
                height="16"
                fill={getInventoryStatusColor(center.inventoryStatus)}
                rx="2"
              />
              <text
                x={coords.x}
                y={coords.y + 3}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
              >
                🏪
              </text>
            </motion.g>
          );
        })}
      </svg>

      {hoveredItem && (
        <motion.div
          className="tooltip"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {hoveredItem.startsWith('disaster-') && (
            <div>
              {disasters.find(d => `disaster-${d.id}` === hoveredItem)?.name}
            </div>
          )}
          {hoveredItem.startsWith('center-') && (
            <div>
              {operationalCenters.find(c => `center-${c.id}` === hoveredItem)?.name}
            </div>
          )}
          {hoveredItem.startsWith('shipment-') && (
            <div>
              Shipment {shipments.find(s => `shipment-${s.id}` === hoveredItem)?.id}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default WorldMap;