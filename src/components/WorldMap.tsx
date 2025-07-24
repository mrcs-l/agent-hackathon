import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Disaster, OperationalCenter, Shipment, Route } from '../types';

interface WorldMapProps {
  disasters: Disaster[];
  operationalCenters: OperationalCenter[];
  shipments: Shipment[];
  routes: Route[];
  onDisasterClick: (disaster: Disaster) => void;
  onCenterClick: (center: OperationalCenter) => void;
  onShipmentClick: (shipment: Shipment) => void;
  onRouteClick: (route: Route) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  disasters,
  operationalCenters,
  shipments,
  routes,
  onDisasterClick,
  onCenterClick,
  onShipmentClick,
  onRouteClick
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#991b1b';
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

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker | L.CircleMarker }>({});

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 6);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Removed example marker
    // const exampleMarker = L.marker([51.5, -0.09]).addTo(map)
    //   .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    //   .openPopup();

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!leafletMapRef.current) return;

    Object.values(markersRef.current).forEach(marker => {
      if (leafletMapRef.current && leafletMapRef.current.hasLayer(marker)) {
        leafletMapRef.current.removeLayer(marker);
      }
    });
    markersRef.current = {};

    // Create disaster markers as glowing, pulsating dots
    disasters.forEach((disaster) => {
      const severityColor = getSeverityColor(disaster.severity);
      
      // Create custom icon for disaster
      const disasterIcon = L.divIcon({
        className: 'disaster-marker',
        html: `<div class="disaster-dot" style="background-color: ${severityColor};"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const marker = L.marker([disaster.location.lat, disaster.location.lng], {
        icon: disasterIcon
      })
        .bindPopup(`
          <div>
            <h3>${disaster.name}</h3>
            <p><strong>Type:</strong> ${disaster.type}</p>
            <p><strong>Severity:</strong> ${disaster.severity}</p>
            <p><strong>Location:</strong> ${disaster.location.name}</p>
          </div>
        `)
        .on('click', () => onDisasterClick(disaster));

      if (leafletMapRef.current) {
        marker.addTo(leafletMapRef.current);
        markersRef.current[`disaster-${disaster.id}`] = marker;
      }
    });

    // Create operational center markers as green squares
    operationalCenters.forEach((center) => {
      // Create custom icon for operational center
      const centerIcon = L.divIcon({
        className: 'center-marker',
        html: `<div class="center-square"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([center.location.lat, center.location.lng], {
        icon: centerIcon
      })
        .bindPopup(`
          <div>
            <h3>${center.name}</h3>
            <p><strong>Inventory Status:</strong> ${center.inventoryStatus}</p>
            <p><strong>Location:</strong> ${center.location.name}</p>
          </div>
        `)
        .on('click', () => onCenterClick(center));

      if (leafletMapRef.current) {
        marker.addTo(leafletMapRef.current);
        markersRef.current[`center-${center.id}`] = marker;
      }
    });

    // Render blue routes with dotted/solid lines based on confirmation status
    routes.forEach((route) => {
      if (leafletMapRef.current) {
        const polyline = L.polyline(
          [
            [route.origin.lat, route.origin.lng],
            [route.destination.lat, route.destination.lng]
          ],
          {
            color: '#3b82f6', // Blue color
            weight: 1,
            opacity: 0.8,
            dashArray: route.confirmed ? undefined : '10, 10' // Solid if confirmed, dotted if not
          }
        )
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937;">Route ${route.id}</h3>
              <p style="margin: 4px 0;"><strong>From:</strong> ${route.origin.name}</p>
              <p style="margin: 4px 0;"><strong>To:</strong> ${route.destination.name}</p>
              <p style="margin: 4px 0;"><strong>Status:</strong> ${route.confirmed ? 'Confirmed' : 'Pending'}</p>
              <p style="margin: 4px 0;"><strong>Duration:</strong> ${route.estimatedDuration}</p>
              <p style="margin: 4px 0;"><strong>Priority:</strong> ${route.priority}</p>
              <div style="margin-top: 8px;">
                <strong>Resources:</strong>
                <ul style="margin: 4px 0; padding-left: 16px;">
                  ${route.resources.map(resource => 
                    `<li>${resource.quantity.toLocaleString()} ${resource.unit} of ${resource.type}</li>`
                  ).join('')}
                </ul>
              </div>
            </div>
          `)
          .on('click', () => onRouteClick(route));

        polyline.addTo(leafletMapRef.current);
        markersRef.current[`route-${route.id}`] = polyline as any;
      }
    });
  }, [disasters, operationalCenters, shipments, routes, onDisasterClick, onCenterClick, onShipmentClick, onRouteClick]);

  return (
    <div className="world-map">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default WorldMap;