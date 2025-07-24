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
  onViewNeedsAssessment?: (disasterId: string) => void;
  onViewActiveShipments?: (disasterId?: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({
  disasters,
  operationalCenters,
  shipments,
  routes,
  onDisasterClick,
  onCenterClick,
  onShipmentClick,
  onRouteClick,
  onViewNeedsAssessment,
  onViewActiveShipments
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Function to create realistic great circle flight paths
  const createGreatCircleRoute = (origin: { lat: number, lng: number }, destination: { lat: number, lng: number }): [number, number][] => {
    const lat1 = origin.lat * Math.PI / 180; // Convert to radians
    const lng1 = origin.lng * Math.PI / 180;
    const lat2 = destination.lat * Math.PI / 180;
    const lng2 = destination.lng * Math.PI / 180;
    
    const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat2 - lat1) / 2), 2) + 
                                    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lng2 - lng1) / 2), 2)));
    
    // Create multiple points along the great circle
    const points: [number, number][] = [];
    const numPoints = Math.max(20, Math.floor(d * 180 / Math.PI)); // More points for longer distances
    
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      
      const A = Math.sin((1 - fraction) * d) / Math.sin(d);
      const B = Math.sin(fraction * d) / Math.sin(d);
      
      const x = A * Math.cos(lat1) * Math.cos(lng1) + B * Math.cos(lat2) * Math.cos(lng2);
      const y = A * Math.cos(lat1) * Math.sin(lng1) + B * Math.cos(lat2) * Math.sin(lng2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);
      
      const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
      const lng = Math.atan2(y, x) * 180 / Math.PI;
      
      points.push([lat, lng]);
    }
    
    return points;
  };

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

      // Enhanced popup with action buttons
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="min-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="margin-bottom: 12px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              ${getDisasterIcon(disaster.type)} ${disaster.name}
            </h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
              <p style="margin: 0;"><strong>Type:</strong> ${disaster.type}</p>
              <p style="margin: 0;"><strong>Severity:</strong> <span style="color: ${getSeverityColor(disaster.severity)}; font-weight: 600;">${disaster.severity.toUpperCase()}</span></p>
              <p style="margin: 0; grid-column: 1 / -1;"><strong>Location:</strong> ${disaster.location.name}</p>
              <p style="margin: 0; grid-column: 1 / -1;"><strong>Affected:</strong> ${disaster.affectedPopulation.toLocaleString()} people</p>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button id="view-needs-${disaster.id}" style="
              flex: 1;
              padding: 8px 12px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            ">📊 View Needs Assessment</button>
            <button id="view-shipments-${disaster.id}" style="
              flex: 1;
              padding: 8px 12px;
              background: #10b981;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            ">📦 View Active Shipments</button>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 11px; color: #6b7280;">
              Last updated: ${new Date(disaster.dateTime).toLocaleString()}
            </div>
          </div>
        </div>
      `;

      // Add event listeners to buttons
      const needsButton = popupContent.querySelector(`#view-needs-${disaster.id}`);
      const shipmentsButton = popupContent.querySelector(`#view-shipments-${disaster.id}`);
      
      if (needsButton) {
        needsButton.addEventListener('click', (e) => {
          e.stopPropagation();
          onViewNeedsAssessment?.(disaster.id) || onDisasterClick(disaster);
        });
      }
      
      if (shipmentsButton) {
        shipmentsButton.addEventListener('click', (e) => {
          e.stopPropagation();
          onViewActiveShipments?.(disaster.id);
        });
      }

      const marker = L.marker([disaster.location.lat, disaster.location.lng], {
        icon: disasterIcon
      })
        .bindPopup(popupContent)
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

    // Create dynamic shipment lines with status colors
    shipments.forEach((shipment) => {
      if (leafletMapRef.current && shipment.currentLocation) {
        // Find origin and destination coordinates
        const originCenter = operationalCenters.find(center => center.name === shipment.origin);
        const destinationCoords = disasters.find(d => d.location.name.includes(shipment.destination.split(',')[0]));
        
        if (originCenter && destinationCoords) {
          // Create path from origin to current location
          const currentPath = createGreatCircleRoute(
            originCenter.location, 
            shipment.currentLocation
          );
          
          // Create path from current location to destination
          const remainingPath = createGreatCircleRoute(
            shipment.currentLocation,
            destinationCoords.location
          );
          
          // Completed route (solid line)
          const completedLine = L.polyline(
            currentPath as L.LatLngExpression[],
            {
              color: getShipmentStatusColor(shipment.status),
              weight: 4,
              opacity: 0.8
            }
          ).bindPopup(`
            <div style="min-width: 250px;">
              <h3 style="margin: 0 0 8px 0;">🚛 Shipment ${shipment.id}</h3>
              <p><strong>Status:</strong> <span style="color: ${getShipmentStatusColor(shipment.status)}; font-weight: bold;">${shipment.status.replace('_', ' ').toUpperCase()}</span></p>
              <p><strong>From:</strong> ${shipment.origin}</p>
              <p><strong>To:</strong> ${shipment.destination}</p>
              <p><strong>Current:</strong> ${shipment.currentLocation.name}</p>
              <p><strong>ETA:</strong> ${new Date(shipment.estimatedArrival).toLocaleDateString()}</p>
              <button onclick="window.shipmentClickHandler('${shipment.id}')" style="
                padding: 6px 12px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 8px;
              ">View Details</button>
            </div>
          `).on('click', () => onShipmentClick(shipment));
          
          // Remaining route (dashed line)
          const remainingLine = L.polyline(
            remainingPath as L.LatLngExpression[],
            {
              color: getShipmentStatusColor(shipment.status),
              weight: 2,
              opacity: 0.5,
              dashArray: '10, 10'
            }
          );
          
          // Current location marker
          const currentLocationIcon = L.divIcon({
            className: 'shipment-current-marker',
            html: `<div class="shipment-dot" style="background-color: ${getShipmentStatusColor(shipment.status)};"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          });
          
          const currentMarker = L.marker([shipment.currentLocation.lat, shipment.currentLocation.lng], {
            icon: currentLocationIcon
          }).bindPopup(`
            <div>
              <h3>📍 ${shipment.id} Current Position</h3>
              <p><strong>Location:</strong> ${shipment.currentLocation.name}</p>
              <p><strong>Status:</strong> ${shipment.status.replace('_', ' ').toUpperCase()}</p>
            </div>
          `);
          
          completedLine.addTo(leafletMapRef.current);
          remainingLine.addTo(leafletMapRef.current);
          currentMarker.addTo(leafletMapRef.current);
          
          markersRef.current[`shipment-completed-${shipment.id}`] = completedLine as any;
          markersRef.current[`shipment-remaining-${shipment.id}`] = remainingLine as any;
          markersRef.current[`shipment-current-${shipment.id}`] = currentMarker;
        }
      }
    });

    // Render blue routes with realistic great circle flight paths
    routes.forEach((route) => {
      if (leafletMapRef.current) {
        const routePath = createGreatCircleRoute(route.origin, route.destination);
        
        const polyline = L.polyline(
          routePath as L.LatLngExpression[],
          {
            color: '#3b82f6', // Blue color
            weight: 3, // Make lines thicker for easier clicking
            opacity: 0.9, // Make them more visible
            dashArray: route.confirmed ? undefined : '10, 10', // Solid if confirmed, dotted if not
            interactive: true, // Ensure the polyline is clickable
            bubblingMouseEvents: false // Prevent event bubbling
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
          .on('click', (e) => {
            console.log('Route clicked:', route.id); // Debug log
            e.originalEvent.stopPropagation(); // Prevent event bubbling
            onRouteClick(route);
          })
          .on('mouseover', () => {
            polyline.setStyle({ weight: 5, opacity: 1 }); // Highlight on hover
          })
          .on('mouseout', () => {
            polyline.setStyle({ weight: 3, opacity: 0.9 }); // Reset on mouse out
          });

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