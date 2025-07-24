import React, { useEffect, useRef } from 'react';
import { Disaster, OperationalCenter, Shipment, Route } from '../types';
import { Viewer, Cartesian3, Color, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType, CallbackProperty, PolylineGlowMaterialProperty, Math as CesiumMath, Cartesian2, ConstantProperty, ConstantPositionProperty } from 'cesium';
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
  onRouteClick
}) => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

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
            text: `📦 ${shipment.id}`,
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
      viewer.entities.add({
        id: `route-${route.id}`,
        polyline: {
          positions,
          width: 3,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.2,
            color: Color.BLUE.withAlpha(0.7)
          }),
          clampToGround: false
        },
        properties: {
          type: new ConstantProperty('route'),
          route: new ConstantProperty(route)
        }
      });
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
            markerEntity.label.text = new ConstantProperty(`📦 ${shipment.id} (${shipment.status.replace('_', ' ').toUpperCase()})`);
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
      console.log('Map clicked!', picked); // Debug log
      
      if (picked && picked.id) {
        console.log('Entity picked:', picked.id); // Debug log
        console.log('Entity properties:', picked.id.properties); // Debug log
        
        // Access properties through getValue() method for Cesium entities
        if (picked.id.properties && picked.id.properties.type) {
          const entityType = picked.id.properties.type.getValue();
          console.log('Entity type:', entityType); // Debug log
          
          if (entityType === 'disaster' && picked.id.properties.disaster) {
            const disaster = picked.id.properties.disaster.getValue();
            console.log('Disaster clicked:', disaster); // Debug log
            onDisasterClick(disaster);
          } else if (entityType === 'center' && picked.id.properties.center) {
            const center = picked.id.properties.center.getValue();
            console.log('Center clicked:', center); // Debug log
            onCenterClick(center);
          } else if (entityType === 'shipment' && picked.id.properties.shipment) {
            const shipment = picked.id.properties.shipment.getValue();
            console.log('Shipment clicked:', shipment); // Debug log
            onShipmentClick(shipment);
          } else if (entityType === 'route' && picked.id.properties.route) {
            const route = picked.id.properties.route.getValue();
            console.log('Route clicked:', route); // Debug log
            onRouteClick(route);
          }
        }
      } else {
        console.log('No entity picked'); // Debug log
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    
    return () => handler.destroy();
  }, [onDisasterClick, onCenterClick, onShipmentClick, onRouteClick]);

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
    </div>
  );
};

export default WorldMap;