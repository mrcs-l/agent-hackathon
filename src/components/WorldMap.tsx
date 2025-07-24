import React, { useEffect, useRef } from 'react';
import { Disaster, OperationalCenter, Shipment, Route } from '../types';
import { Viewer, Cartesian3, Color, Entity, ScreenSpaceEventHandler, ScreenSpaceEventType, CallbackProperty, PolylineGlowMaterialProperty, Math as CesiumMath, Cartesian2 } from 'cesium';
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

  // Add entities for disasters, centers, and routes
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
        properties: { type: 'disaster', disaster }
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
        properties: { type: 'center', center }
      });
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
        properties: { type: 'route', route }
      });
    });
  }, [disasters, operationalCenters, routes]);

  // Click handler for entities
  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;
    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement: any) => {
      const picked = viewer.scene.pick(movement.position);
      if (picked && picked.id && picked.id.properties) {
        const props = picked.id.properties;
        if (props.type === 'disaster' && props.disaster) {
          onDisasterClick(props.disaster);
        } else if (props.type === 'center' && props.center) {
          onCenterClick(props.center);
        } else if (props.type === 'route' && props.route) {
          onRouteClick(props.route);
        }
      }
    }, ScreenSpaceEventType.LEFT_CLICK);
    return () => handler.destroy();
  }, [onDisasterClick, onCenterClick, onRouteClick]);

  return (
    <div className="world-map" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <div ref={cesiumContainerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default WorldMap;