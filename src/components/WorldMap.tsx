import React, { useEffect, useRef, useState } from 'react';
import { Disaster, OperationalCenter, Shipment, Route } from '../types';
import { Viewer, Cartesian3, Color, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType, CallbackProperty, PolylineGlowMaterialProperty, Math as CesiumMath, Cartesian2, ConstantProperty, ConstantPositionProperty } from 'cesium';
import { motion, AnimatePresence } from 'framer-motion';
import 'cesium/Build/Cesium/Widgets/widgets.css';

(window as any).CESIUM_BASE_URL = '/cesium';

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

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return Color.RED;
    case 'high': return Color.ORANGE;
    case 'medium': return Color.YELLOW;
    case 'low': return Color.LIME;
    default: return Color.WHITE;
  }
};

// RESTORED: Shipment status color coding
const getShipmentColor = (status: string) => {
  switch (status) {
    case 'loading': return Color.ORANGE;
    case 'in_transit': return Color.LIME;
    case 'delayed': return Color.YELLOW;
    case 'delivered': return Color.GREEN;
    case 'exception': return Color.RED;
    default: return Color.WHITE;
  }
};

// Helper to calculate interpolated position along route
const calculateShipmentPosition = (shipment: Shipment, originLocation: { lat: number, lng: number }, destinationLocation: { lat: number, lng: number }) => {
  if (shipment.currentLocation) {
    return shipment.currentLocation;
  }
  
  // Calculate progress based on shipment status and estimated arrival
  let progress = 0.3; // Default to 30% along route
  
  switch (shipment.status) {
    case 'loading':
      progress = 0.1;
      break;
    case 'in_transit':
      progress = 0.5;
      break;
    case 'delayed':
      progress = 0.4;
      break;
    case 'delivered':
      progress = 1.0;
      break;
    case 'exception':
      progress = 0.3;
      break;
  }
  
  // Add some randomness to make it feel more realistic
  progress += (Math.random() - 0.5) * 0.2;
  progress = Math.max(0.1, Math.min(0.9, progress));
  
  return {
    lat: originLocation.lat + (destinationLocation.lat - originLocation.lat) * progress,
    lng: originLocation.lng + (destinationLocation.lng - originLocation.lng) * progress,
    name: `En route (${Math.round(progress * 100)}%)`
  };
};

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
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  
  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [popupType, setPopupType] = useState<'disaster' | 'center' | 'shipment' | 'route'>('disaster');

  // Helper to convert lat/lng to Cesium Cartesian3
  const toCartesian = (lat: number, lng: number, height = 0) =>
    Cartesian3.fromDegrees(lng, lat, height);

  // Helper to create great circle points between two lat/lngs
  const createGreatCircle = (origin: { lat: number, lng: number }, dest: { lat: number, lng: number }, numPoints = 64) => {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints;
      const lat = origin.lat + (dest.lat - origin.lat) * f;
      const lng = origin.lng + (dest.lng - origin.lng) * f;
      points.push(toCartesian(lat, lng, 20000));
    }
    return points;
  };

  useEffect(() => {
    if (cesiumContainerRef.current && !viewerRef.current) {
      viewerRef.current = new Viewer(cesiumContainerRef.current, {
        shouldAnimate: true,
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
        selectionIndicator: false,
      });
    }
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  // Add entities for disasters, centers, routes, AND SHIPMENTS
  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    viewer.entities.removeAll();

    // Disasters
    disasters.forEach(disaster => {
      viewer.entities.add({
        id: `disaster-${disaster.id}`,
        position: toCartesian(disaster.location.lat, disaster.location.lng, 30000),
        point: {
          pixelSize: 18,
          color: getSeverityColor(disaster.severity).withAlpha(0.85),
          outlineColor: Color.WHITE,
          outlineWidth: 3
        },
        label: {
          text: disaster.name,
          font: '16px sans-serif',
          fillColor: Color.WHITE,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 1,
          pixelOffset: new Cartesian2(0, -30)
        },
        properties: {
          type: new ConstantProperty('disaster'),
          disaster: new ConstantProperty(disaster)
        }
      });
    });

    // Operational Centers
    operationalCenters.forEach(center => {
      viewer.entities.add({
        id: `center-${center.id}`,
        position: toCartesian(center.location.lat, center.location.lng, 30000),
        point: {
          pixelSize: 14,
          color: Color.LIME.withAlpha(0.85),
          outlineColor: Color.DARKGREEN,
          outlineWidth: 3
        },
        label: {
          text: center.name,
          font: '14px sans-serif',
          fillColor: Color.LIME,
          outlineColor: Color.BLACK,
          outlineWidth: 2,
          style: 1,
          pixelOffset: new Cartesian2(0, -24)
        },
        properties: {
          type: new ConstantProperty('center'),
          center: new ConstantProperty(center)
        }
      });
    });

    // RESTORED: Shipments (route lines and moving markers)
    shipments.forEach(shipment => {
      // Find origin and destination coordinates
      const originCenter = operationalCenters.find(c => c.name === shipment.origin);
      let destinationLocation = null;
      
      // Check if destination is a disaster location
      const destinationDisaster = disasters.find(d => d.location.name === shipment.destination || d.name === shipment.destination);
      if (destinationDisaster) {
        destinationLocation = destinationDisaster.location;
      } else {
        // Check if destination is another operational center
        const destinationCenter = operationalCenters.find(c => c.name === shipment.destination);
        if (destinationCenter) {
          destinationLocation = destinationCenter.location;
        }
      }
      
      if (originCenter && destinationLocation) {
        // Create shipment route line with status-based coloring
        const positions = createGreatCircle(originCenter.location, destinationLocation, 96);
        viewer.entities.add({
          id: `shipment-route-${shipment.id}`,
          polyline: {
            positions,
            width: 4,
            material: new PolylineGlowMaterialProperty({
              glowPower: 0.3,
              color: getShipmentColor(shipment.status).withAlpha(0.8)
            }),
            clampToGround: false
          },
          properties: {
            type: new ConstantProperty('shipment'),
            shipment: new ConstantProperty(shipment)
          }
        });

        // Calculate or use current shipment position
        const currentPosition = calculateShipmentPosition(shipment, originCenter.location, destinationLocation);
        
        // Add moving shipment marker (current position)
        viewer.entities.add({
          id: `shipment-marker-${shipment.id}`,
          position: toCartesian(currentPosition.lat, currentPosition.lng, 35000),
          point: {
            pixelSize: 12,
            color: getShipmentColor(shipment.status).withAlpha(0.9),
            outlineColor: Color.WHITE,
            outlineWidth: 2
          },
          label: {
            text: `${shipment.id}`,
            font: '12px sans-serif',
            fillColor: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: 1,
            pixelOffset: new Cartesian2(0, -20)
          },
          properties: {
            type: new ConstantProperty('shipment'),
            shipment: new ConstantProperty(shipment)
          }
        });
      }
    });

    // Routes (great circle)
    routes.forEach(route => {
      const positions = createGreatCircle(route.origin, route.destination, 96);
      const routeColor = route.confirmed ? Color.BLUE : Color.ORANGE;
      const routeWidth = route.confirmed ? 4 : 3;
      const routeAlpha = route.confirmed ? 0.9 : 0.6;
      
      viewer.entities.add({
        id: `route-${route.id}`,
        polyline: {
          positions,
          width: routeWidth,
          material: new PolylineGlowMaterialProperty({
            glowPower: route.confirmed ? 0.3 : 0.2,
            color: routeColor.withAlpha(routeAlpha)
          }),
          clampToGround: false
        },
        properties: {
          type: new ConstantProperty('route'),
          route: new ConstantProperty(route)
        }
      });
      
      // Add route markers at origin and destination for confirmed routes
      if (route.confirmed) {
        // Origin marker
        viewer.entities.add({
          id: `route-origin-${route.id}`,
          position: toCartesian(route.origin.lat, route.origin.lng, 25000),
          point: {
            pixelSize: 8,
            color: Color.BLUE.withAlpha(0.8),
            outlineColor: Color.WHITE,
            outlineWidth: 2
          }
        });
        
        // Destination marker
        viewer.entities.add({
          id: `route-destination-${route.id}`,
          position: toCartesian(route.destination.lat, route.destination.lng, 25000),
          point: {
            pixelSize: 8,
            color: Color.BLUE.withAlpha(0.8),
            outlineColor: Color.WHITE,
            outlineWidth: 2
          }
        });
      }
    });
  }, [disasters, operationalCenters, shipments, routes]);

  // RESTORED: Real-time shipment status updates with animated position changes
  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    
    // Set up interval for smooth position animation
    const animationInterval = setInterval(() => {
      shipments.forEach(shipment => {
        const markerEntity = viewer.entities.getById(`shipment-marker-${shipment.id}`);
        
        if (markerEntity && shipment.status === 'in_transit') {
          // Animate position slightly forward along route for in-transit shipments
          const originCenter = operationalCenters.find(c => c.name === shipment.origin);
          let destinationLocation = null;
          
          const destinationDisaster = disasters.find(d => d.location.name === shipment.destination || d.name === shipment.destination);
          if (destinationDisaster) {
            destinationLocation = destinationDisaster.location;
          } else {
            const destinationCenter = operationalCenters.find(c => c.name === shipment.destination);
            if (destinationCenter) {
              destinationLocation = destinationCenter.location;
            }
          }
          
          if (originCenter && destinationLocation) {
            const newPosition = calculateShipmentPosition(shipment, originCenter.location, destinationLocation);
            markerEntity.position = new ConstantPositionProperty(toCartesian(newPosition.lat, newPosition.lng, 35000));
          }
        }
      });
    }, 5000); // Update every 5 seconds for smooth movement
    
    // Update existing shipment entities when status changes
    shipments.forEach(shipment => {
      const routeEntity = viewer.entities.getById(`shipment-route-${shipment.id}`);
      const markerEntity = viewer.entities.getById(`shipment-marker-${shipment.id}`);
      
      if (routeEntity && routeEntity.polyline) {
        // Update route color based on current status
        routeEntity.polyline.material = new PolylineGlowMaterialProperty({
          glowPower: 0.3,
          color: getShipmentColor(shipment.status).withAlpha(0.8)
        });
      }
      
      if (markerEntity && markerEntity.point) {
        // Update marker color based on current status using ConstantProperty
        markerEntity.point.color = new ConstantProperty(getShipmentColor(shipment.status).withAlpha(0.9));
        
        // Update position if shipment has moved
        const originCenter = operationalCenters.find(c => c.name === shipment.origin);
        let destinationLocation = null;
        
        const destinationDisaster = disasters.find(d => d.location.name === shipment.destination || d.name === shipment.destination);
        if (destinationDisaster) {
          destinationLocation = destinationDisaster.location;
        } else {
          const destinationCenter = operationalCenters.find(c => c.name === shipment.destination);
          if (destinationCenter) {
            destinationLocation = destinationCenter.location;
          }
        }
        
        if (originCenter && destinationLocation) {
          const currentPosition = calculateShipmentPosition(shipment, originCenter.location, destinationLocation);
          // Use ConstantPositionProperty for position updates
          markerEntity.position = new ConstantPositionProperty(toCartesian(currentPosition.lat, currentPosition.lng, 35000));
          
          // Update label to show current status using ConstantProperty
          if (markerEntity.label) {
            markerEntity.label.text = new ConstantProperty(`${shipment.id} (${shipment.status.replace('_', ' ').toUpperCase()})`);
          }
        }
      }
    });

    return () => clearInterval(animationInterval);
  }, [shipments, operationalCenters, disasters]);

  // RESTORED: Complete click handler for all entities including shipments with debugging
  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    
    handler.setInputAction((movement: any) => {
      const picked = viewer.scene.pick(movement.position);
      
      if (picked && picked.id) {
        // Access properties through getValue() method for Cesium entities
        if (picked.id.properties && picked.id.properties.type) {
          const entityType = picked.id.properties.type.getValue();
          
          // Set popup position based on click location
          const clickPosition = {
            x: movement.position.x,
            y: movement.position.y
          };
          
          if (entityType === 'disaster' && picked.id.properties.disaster) {
            const disaster = picked.id.properties.disaster.getValue();
            setPopupData(disaster);
            setPopupType('disaster');
            setPopupPosition(clickPosition);
            setShowPopup(true);
          } else if (entityType === 'center' && picked.id.properties.center) {
            const center = picked.id.properties.center.getValue();
            setPopupData(center);
            setPopupType('center');
            setPopupPosition(clickPosition);
            setShowPopup(true);
          } else if (entityType === 'shipment' && picked.id.properties.shipment) {
            const shipment = picked.id.properties.shipment.getValue();
            setPopupData(shipment);
            setPopupType('shipment');
            setPopupPosition(clickPosition);
            setShowPopup(true);
          } else if (entityType === 'route' && picked.id.properties.route) {
            const route = picked.id.properties.route.getValue();
            setPopupData(route);
            setPopupType('route');
            setPopupPosition(clickPosition);
            setShowPopup(true);
          }
        }
      } else {
        // Click on empty space - close popup
        setShowPopup(false);
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    
    return () => handler.destroy();
  }, [onDisasterClick, onCenterClick, onShipmentClick, onRouteClick, onViewNeedsAssessment, onViewActiveShipments]);

  const renderPopupContent = () => {
    if (!popupData) return null;
    
    switch (popupType) {
      case 'disaster':
        const disaster = popupData as Disaster;
        const totalNeeded = disaster.needs.reduce((sum, need) => sum + need.quantityRequested, 0);
        const totalMatched = disaster.needs.reduce((sum, need) => sum + need.quantityMatched, 0);
        const matchPercentage = totalNeeded > 0 ? ((totalMatched / totalNeeded) * 100).toFixed(1) : '0';
        
        return (
          <div className="map-popup disaster-popup">
            <div className="popup-header">
              <h4>{disaster.name}</h4>
              <span className={`severity-badge ${disaster.severity}`}>{disaster.severity.toUpperCase()}</span>
            </div>
            <div className="popup-content">
              <div className="popup-stat">
                <span className="stat-label">Location:</span>
                <span className="stat-value">{disaster.location.name}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Affected Population:</span>
                <span className="stat-value">{disaster.affectedPopulation.toLocaleString()}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Needs Matched:</span>
                <span className="stat-value">{matchPercentage}%</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Critical Needs:</span>
                <span className="stat-value">{disaster.needs.filter(n => n.priority === 'high').length}</span>
              </div>
            </div>
            <div className="popup-actions">
              <button 
                className="popup-btn primary"
                onClick={() => {
                  onViewNeedsAssessment?.(disaster.id);
                  setShowPopup(false);
                }}
              >
                View Needs Assessment
              </button>
              <button 
                className="popup-btn secondary"
                onClick={() => {
                  onViewActiveShipments?.(disaster.id);
                  setShowPopup(false);
                }}
              >
                View Active Shipments
              </button>
            </div>
          </div>
        );
        
      case 'center':
        const center = popupData as OperationalCenter;
        return (
          <div className="map-popup center-popup">
            <div className="popup-header">
              <h4>{center.name}</h4>
              <span className={`status-badge ${center.inventoryStatus}`}>{center.inventoryStatus.toUpperCase()}</span>
            </div>
            <div className="popup-content">
              <div className="popup-stat">
                <span className="stat-label">Location:</span>
                <span className="stat-value">{center.location.name}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Total Items:</span>
                <span className="stat-value">{center.totalItems.toLocaleString()}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Categories:</span>
                <span className="stat-value">{center.totalCategories}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Inventory Value:</span>
                <span className="stat-value">${(center.inventoryValue / 1000000).toFixed(1)}M</span>
              </div>
            </div>
            <div className="popup-actions">
              <button 
                className="popup-btn primary"
                onClick={() => {
                  onCenterClick(center);
                  setShowPopup(false);
                }}
              >
                View Inventory Details
              </button>
            </div>
          </div>
        );
        
      case 'shipment':
        const shipment = popupData as Shipment;
        const statusColors = {
          loading: '#ff9500',
          in_transit: '#00ff00',
          delayed: '#ffff00',
          delivered: '#00cc00',
          exception: '#ff0000'
        };
        
        return (
          <div className="map-popup shipment-popup">
            <div className="popup-header">
              <h4>Shipment {shipment.id}</h4>
              <span 
                className="status-badge"
                style={{ backgroundColor: statusColors[shipment.status], color: '#000' }}
              >
                {shipment.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="popup-content">
              <div className="popup-stat">
                <span className="stat-label">Origin:</span>
                <span className="stat-value">{shipment.origin}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Destination:</span>
                <span className="stat-value">{shipment.destination}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Items:</span>
                <span className="stat-value">{shipment.manifest.length} types</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Partner:</span>
                <span className="stat-value">{shipment.logisticsPartner}</span>
              </div>
            </div>
            <div className="popup-actions">
              <button 
                className="popup-btn primary"
                onClick={() => {
                  onShipmentClick(shipment);
                  setShowPopup(false);
                }}
              >
                📍 Track Shipment Details
              </button>
            </div>
          </div>
        );
        
      case 'route':
        const route = popupData as Route;
        const totalResources = route.resources.reduce((sum, resource) => sum + resource.quantity, 0);
        
        return (
          <div className="map-popup route-popup">
            <div className="popup-header">
              <h4>Route {route.id}</h4>
              <span className={`priority-badge ${route.priority}`}>{route.priority.toUpperCase()}</span>
            </div>
            <div className="popup-content">
              <div className="popup-stat">
                <span className="stat-label">Origin:</span>
                <span className="stat-value">{route.origin.name}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Destination:</span>
                <span className="stat-value">{route.destination.name}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Status:</span>
                <span className="stat-value">{route.confirmed ? 'Confirmed' : 'Pending'}</span>
              </div>
              <div className="popup-stat">
                <span className="stat-label">Resources:</span>
                <span className="stat-value">{totalResources.toLocaleString()} units</span>
              </div>
            </div>
            <div className="popup-actions">
              <button 
                className="popup-btn primary"
                onClick={() => {
                  onRouteClick(route);
                  setShowPopup(false);
                }}
              >
                View Route Details
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div
      className="world-map-cropped"
      style={{
        height: 'calc(100% - 60px)', // crop 60px from the bottom
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px'
      }}
    >
      <div
        ref={cesiumContainerRef}
        style={{
          height: 'calc(100% + 60px)', // make globe slightly taller so bottom is cropped
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      />
      
      {/* Interactive Popup System */}
      <AnimatePresence>
        {showPopup && popupData && (
          <motion.div
            className="map-popup-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              left: Math.min(popupPosition.x + 10, window.innerWidth - 350),
              top: Math.max(popupPosition.y - 10, 10),
              zIndex: 1000,
              pointerEvents: 'auto'
            }}
          >
            {renderPopupContent()}
            <button 
              className="popup-close"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorldMap;