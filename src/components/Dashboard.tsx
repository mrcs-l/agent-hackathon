import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from './WorldMap';
import Sidebar from './Sidebar';
import AlertsPanel from './AlertsPanel';
import DisasterNeedsView from './DisasterNeedsView';
import ShipmentTrackingView from './ShipmentTrackingView';
import InventoryView from './InventoryView';
import RouteDetailsView from './RouteDetailsView';
import { Disaster, OperationalCenter, Shipment, Route, Alert, ImpactMetrics, NotificationPopup, InventoryItem } from '../types';
import { mockDisasters, mockOperationalCenters, mockShipments, mockAlerts, mockRoutes } from '../data/mockData';

type ViewMode = 'dashboard' | 'disaster-detail' | 'center-detail' | 'shipment-detail' | 'route-detail';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [selectedCenter, setSelectedCenter] = useState<OperationalCenter | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [alertsPanelCollapsed, setAlertsPanelCollapsed] = useState(false);
  
  // Real-time data states
  const [disasters, setDisasters] = useState<Disaster[]>(mockDisasters);
  const [operationalCenters, setOperationalCenters] = useState<OperationalCenter[]>(mockOperationalCenters);
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  
  // UI states
  const [impactMetrics, setImpactMetrics] = useState<ImpactMetrics>({
    peopleHelped: 15200000,
    wastePrevented: 2400000,
    costSaved: 45000000,
    disastersResponded: 8
  });
  const [notifications, setNotifications] = useState<NotificationPopup[]>([]);
  
  // Demo simulation state
  const [simulationActive] = useState(true);
  
  // New demo workflow state
  const [demoDisasterCounter, setDemoDisasterCounter] = useState(0);
  const [pendingRoutes, setPendingRoutes] = useState<Route[]>([]);
  const [showRouteSelectionModal, setShowRouteSelectionModal] = useState(false);
  const [currentRouteOptions, setCurrentRouteOptions] = useState<Route[]>([]);

  const handleDisasterClick = (disaster: Disaster) => {
    setSelectedDisaster(disaster);
    setViewMode('disaster-detail');
  };

  const handleCenterClick = (center: OperationalCenter) => {
    setSelectedCenter(center);
    setViewMode('center-detail');
  };

  const handleShipmentClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setViewMode('shipment-detail');
  };

  const handleRouteClick = (route: Route) => {
    console.log('Route clicked in Dashboard:', route.id); // Debug log
    setSelectedRoute(route);
    setViewMode('route-detail');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedDisaster(null);
    setSelectedCenter(null);
    setSelectedShipment(null);
    setSelectedRoute(null);
  };

  const handleAlertClick = (alert: Alert) => {
    if (alert.relatedType === 'disaster' && alert.relatedId) {
      const disaster = disasters.find(d => d.id === alert.relatedId);
      if (disaster) {
        handleDisasterClick(disaster);
      }
    } else if (alert.relatedType === 'shipment' && alert.relatedId) {
      const shipment = shipments.find(s => s.id === alert.relatedId);
      if (shipment) {
        handleShipmentClick(shipment);
      }
    }
  };

  const handleAlertAction = (alertId: string, actionType: string, actionId?: string) => {
    const alert = alerts.find(a => a.id === alertId);
    
    
    // Update alert status
    setAlerts(prev => prev.map(alertItem => 
      alertItem.id === alertId 
        ? { ...alertItem, status: actionType === 'approve' ? 'resolved' as const : 'awaiting_resolution' as const }
        : alertItem
    ));

    // Create appropriate notification
    const actionMessages = {
      approve: `${alert?.recommendations?.[0]?.title || 'Action'} has been approved and is now in progress.`,
      view_route: 'Route details have been accessed. Check the map for updated information.',
      contact: 'Contact request has been initiated. Response teams will be notified.',
      report_issue: 'Issue has been reported to the appropriate teams for investigation.'
    };
    
    const notification: NotificationPopup = {
      id: `notif-${Date.now()}`,
      title: actionType === 'approve' ? 'Action Approved' : 'Action Processed',
      message: actionMessages[actionType as keyof typeof actionMessages] || `${actionType} action completed.`,
      type: actionType === 'approve' ? 'agentforce' : 'alert',
      autoClose: true
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-close notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, actionType === 'approve' ? 8000 : 5000);
  };

  const handleShipmentStatusUpdate = (shipmentId: string, newStatus: Shipment['status']) => {
    setShipments(prev => prev.map(shipment =>
      shipment.id === shipmentId
        ? { ...shipment, status: newStatus }
        : shipment
    ));

    // Update impact metrics
    setImpactMetrics(prev => ({
      ...prev,
      peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 5000),
      costSaved: prev.costSaved + Math.floor(Math.random() * 10000)
    }));
  };

  const handleViewActiveShipments = (disasterId?: string) => {
    let targetShipments = shipments;
    
    // If a disaster ID is provided, filter shipments related to that disaster
    if (disasterId) {
      const disaster = disasters.find(d => d.id === disasterId);
      
      if (disaster) {
        // Extract location components for matching
        const disasterLocation = disaster.location.name.toLowerCase();
        const locationParts = disasterLocation.split(',').map(part => part.trim());
        
        // Filter shipments going to or near the disaster location
        const relatedShipments = shipments.filter(shipment => {
          const destination = shipment.destination.toLowerCase();
          const matches = locationParts.some(part => 
            destination.includes(part) || 
            part.includes(destination.split(',')[0].trim())
          );
          return matches;
        });
        
        // If we found disaster-related shipments, use those; otherwise fall back to all shipments
        if (relatedShipments.length > 0) {
          targetShipments = relatedShipments;
        }
      }
    }
    
    // Find the most relevant active shipment (prioritize in_transit, then delayed, then loading)
    const activeShipment = targetShipments.find(s => s.status === 'in_transit') ||
                          targetShipments.find(s => s.status === 'delayed') ||
                          targetShipments.find(s => s.status === 'loading') ||
                          shipments.find(s => s.status === 'in_transit' || s.status === 'delayed');
    
    if (activeShipment) {
      handleShipmentClick(activeShipment);
    }
  };

  // Auto-rerouting logic: check for low inventory centers
  const checkAndTriggerAutoRerouting = () => {
    operationalCenters.forEach(center => {
      const totalCurrentInventory = center.inventory.reduce((sum, item) => sum + item.quantity, 0);
      const inventoryRatio = center.totalItems > 0 ? totalCurrentInventory / center.totalItems : 1;
      
      // If center is low on inventory and no active resupply route exists
      if (inventoryRatio < 0.3 && !routes.some(route => 
        route.destination.name === center.name && 
        route.id.includes('resupply') && 
        route.confirmed
      )) {
        
        // Find nearest center with ample supplies
        const supplierCenter = operationalCenters.find(c => 
          c.id !== center.id && 
          c.inventory.reduce((sum, item) => sum + item.quantity, 0) > c.totalItems * 0.7 &&
          !c.name.toLowerCase().includes('seattle') // Don't use Seattle as supplier if it's in crisis
        );
        
        if (supplierCenter) {
          triggerAutoResupply(center, supplierCenter);
        }
      }
    });
  };

  const triggerAutoResupply = (targetCenter: OperationalCenter, supplierCenter: OperationalCenter) => {
    const resupplyRoute: Route = {
      id: `auto-resupply-${Date.now()}`,
      origin: supplierCenter.location,
      destination: targetCenter.location,
      confirmed: true,
      resources: [
        { type: 'Emergency Supplies', quantity: 20000, unit: 'units' },
        { type: 'Water Bottles', quantity: 15000, unit: 'bottles' },
        { type: 'Medical Kits', quantity: 8000, unit: 'kits' }
      ],
      estimatedDuration: '4 hours',
      priority: 'high'
    };
    
    setRoutes(prev => [...prev, resupplyRoute]);
    
    // Create corresponding shipment
    const resupplyShipment: Shipment = {
      id: `AUTO-RESUPPLY-${Date.now()}`,
      origin: supplierCenter.name,
      destination: targetCenter.name,
      status: 'loading',
      estimatedArrival: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      logisticsPartner: 'Auto-Routing System',
      manifest: resupplyRoute.resources.map(resource => ({
        item: resource.type,
        quantity: resource.quantity,
        unit: resource.unit,
        corporateDonor: 'Inter-Hub Auto-Transfer'
      })),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          event: `Auto-rerouting initiated: ${supplierCenter.name} → ${targetCenter.name}`,
          location: supplierCenter.name
        }
      ]
    };
    
    setShipments(prev => [...prev, resupplyShipment]);
    
    // Auto-routing alert
    const autoRoutingAlert: Alert = {
      id: `auto-routing-${Date.now()}`,
      type: 'info',
      message: `🤖 Auto-routing: ${supplierCenter.name} → ${targetCenter.name} (Low inventory detected)`,
      timestamp: new Date().toISOString(),
      relatedId: targetCenter.id,
      relatedType: 'inventory',
      status: 'active',
      recommendations: []
    };
    
    setAlerts(prev => [autoRoutingAlert, ...prev]);
    
    // Success notification
    const autoNotification: NotificationPopup = {
      id: `auto-routing-notif-${Date.now()}`,
      type: 'agentforce',
      title: 'Auto-Routing Activated',
      message: `Resources automatically rerouted from ${supplierCenter.name} to ${targetCenter.name}`,
      autoClose: true
    };
    setNotifications(prev => [autoNotification, ...prev]);
    
        // Update impact metrics
        setImpactMetrics(prev => ({
      ...prev,
      costSaved: prev.costSaved + Math.floor(Math.random() * 25000) + 15000,
      peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 8000) + 2000
    }));
  };

  // Enhanced real-time simulation engine
  useEffect(() => {
    if (!simulationActive) return;
    
    const simulationInterval = setInterval(() => {
      
      // Progressive needs matching for all disasters
      setDisasters(prev => prev.map(disaster => ({
        ...disaster,
        needs: disaster.needs.map(need => {
          const currentMatched = need.quantityMatched;
          const requested = need.quantityRequested;
          const maxIncrease = Math.min(requested * 0.02, 5000); // Max 2% increase or 5000 units
          const increase = Math.floor(Math.random() * maxIncrease);
          
          return {
            ...need,
            quantityMatched: Math.min(currentMatched + increase, requested)
          };
        })
      })));
      
      // Update shipment statuses with realistic progression
      setShipments(prev => prev.map(shipment => {
        if (Math.random() < 0.15) { // 15% chance of status update
          const statusProgression = {
            'loading': 'in_transit',
            'in_transit': Math.random() < 0.9 ? 'in_transit' : 'delivered',
            'delayed': Math.random() < 0.7 ? 'delayed' : 'in_transit',
            'delivered': 'delivered',
            'exception': 'exception'
          };
          
          const newStatus = statusProgression[shipment.status] as Shipment['status'];
          if (newStatus !== shipment.status) {
            // Update impact metrics when shipments are delivered
            if (newStatus === 'delivered') {
              setImpactMetrics(prev => ({
                ...prev,
                peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 8000) + 2000,
                wastePrevented: prev.wastePrevented + Math.floor(Math.random() * 3000) + 1000,
                costSaved: prev.costSaved + Math.floor(Math.random() * 25000) + 10000
              }));
            }
            
            return { ...shipment, status: newStatus };
          }
        }
        return shipment;
      }));
      
      // Progressive impact metrics updates
      if (Math.random() < 0.6) {
        setImpactMetrics(prev => ({
          peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 2000) + 500,
          wastePrevented: prev.wastePrevented + Math.floor(Math.random() * 800) + 200,
          costSaved: prev.costSaved + Math.floor(Math.random() * 8000) + 2000,
          disastersResponded: prev.disastersResponded
        }));
      }

      // Resolve some alerts gradually
      if (Math.random() < 0.1) {
        setAlerts(prev => prev.map(alert => {
          if (alert.status === 'awaiting_resolution' && Math.random() < 0.3) {
            return { ...alert, status: 'resolved' as const };
          }
          return alert;
        }));
      }
      
      // Occasional Agentforce notifications
      if (Math.random() < 0.15) {
        const agentforceMessages = [
          'Auto-matching algorithm found new resource matches',
          'Route optimization completed - 12% efficiency improvement',
          'Corporate donation batch processed from 3 partners',
          'Predictive analysis identified potential supply shortage',
          'Alternative logistics route activated automatically',
          'Resource allocation rebalanced across 5 centers',
          'Emergency procurement recommendations generated'
        ];
        
        const message = agentforceMessages[Math.floor(Math.random() * agentforceMessages.length)];
        const notification: NotificationPopup = {
          id: `auto-${Date.now()}`,
          title: 'System Update',
          message,
          type: 'agentforce',
          autoClose: true
        };

        setNotifications(prev => [...prev, notification]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 6000);
      }
      
    }, 3000); // Update every 3 seconds for smooth progression

    return () => clearInterval(simulationInterval);
  }, [simulationActive]);
  
  // Generate San Francisco location for new disaster
  const generateDisasterLocation = () => {
    return { lat: 37.7749, lng: -122.4194, name: 'San Francisco, California, USA' };
  };
  
  // Calculate distance between two locations
  const calculateDistance = (loc1: { lat: number; lng: number }, loc2: { lat: number; lng: number }) => {
    return Math.sqrt(
      Math.pow(loc1.lat - loc2.lat, 2) + 
      Math.pow(loc1.lng - loc2.lng, 2)
    );
  };
  
  // Generate multiple route options for a disaster location
  const generateRouteOptions = (disasterLocation: { lat: number; lng: number; name: string }, disasterCounter: number) => {
    // Calculate distances to all centers
    const centersWithDistances = operationalCenters.map(center => ({
      center,
      distance: calculateDistance(center.location, disasterLocation)
    })).sort((a, b) => a.distance - b.distance);
    
    const routes: Route[] = [];
    
    // Primary route - nearest center (AI recommended)
    const primaryCenter = centersWithDistances[0].center;
    routes.push({
      id: `demo-route-${disasterCounter}-primary`,
      origin: primaryCenter.location,
      destination: disasterLocation,
      confirmed: false,
      resources: [
        { type: 'Emergency Water Supply', quantity: 50000, unit: 'liters' },
        { type: 'Medical Supplies', quantity: 25000, unit: 'kits' },
        { type: 'Emergency Food Rations', quantity: 40000, unit: 'packages' }
      ],
      estimatedDuration: '18 hours',
      priority: 'critical',
      routeType: 'primary',
      costEstimate: '$125,000',
      aiConfidence: 92,
      advantages: ['Shortest distance', 'Ample inventory', 'Fastest deployment'],
      risks: ['High demand center']
    });
    
    // Alternative route 1 - second nearest center
    if (centersWithDistances.length > 1) {
      const altCenter1 = centersWithDistances[1].center;
      routes.push({
        id: `demo-route-${disasterCounter}-alt1`,
        origin: altCenter1.location,
        destination: disasterLocation,
        confirmed: false,
        resources: [
          { type: 'Emergency Water Supply', quantity: 45000, unit: 'liters' },
          { type: 'Medical Supplies', quantity: 30000, unit: 'kits' },
          { type: 'Emergency Food Rations', quantity: 35000, unit: 'packages' }
        ],
        estimatedDuration: '24 hours',
        priority: 'high',
        routeType: 'alternative',
        costEstimate: '$148,000',
        aiConfidence: 78,
        advantages: ['Lower congestion', 'Better medical supplies', 'Backup capacity'],
        risks: ['Longer transit time', 'Higher cost']
      });
    }
    
    // Alternative route 2 - third option with different characteristics
    if (centersWithDistances.length > 2) {
      const altCenter2 = centersWithDistances[2].center;
      routes.push({
        id: `demo-route-${disasterCounter}-alt2`,
        origin: altCenter2.location,
        destination: disasterLocation,
        confirmed: false,
        resources: [
          { type: 'Emergency Water Supply', quantity: 60000, unit: 'liters' },
          { type: 'Medical Supplies', quantity: 20000, unit: 'kits' },
          { type: 'Emergency Food Rations', quantity: 50000, unit: 'packages' }
        ],
        estimatedDuration: '36 hours',
        priority: 'medium',
        routeType: 'alternative',
        costEstimate: '$95,000',
        aiConfidence: 65,
        advantages: ['Most water supply', 'Cost effective', 'Large capacity'],
        risks: ['Longest transit time', 'Lower medical supplies']
      });
    }
    
    return routes;
  };
  
  // NEW: Trigger resource center crisis simulation with route selection
  const triggerResourceCrisis = () => {
    // Find Seattle center (or create one if not exists)
    let seattleCenter = operationalCenters.find(center => 
      center.name.toLowerCase().includes('seattle') || 
      center.location.name.toLowerCase().includes('seattle')
    );
    
    if (!seattleCenter) {
      // Create Seattle center if it doesn't exist
      seattleCenter = {
        id: 'seattle-demo',
        name: 'Seattle Emergency Hub',
        location: { lat: 47.6062, lng: -122.3321, name: 'Seattle, WA' },
        inventoryStatus: 'critical',
        totalItems: 100000,
        totalCategories: 5,
        inventoryValue: 2500000,
        inventory: [
          { id: 'seattle-1', productType: 'Medical', specificItem: 'Emergency Kits', quantity: 500, corporatePartner: 'Local Reserve', dateReceived: '2024-01-01', location: 'Bay A', condition: 'new' },
          { id: 'seattle-2', productType: 'Water', specificItem: 'Water Bottles', quantity: 2000, corporatePartner: 'Local Reserve', dateReceived: '2024-01-01', location: 'Bay B', condition: 'new' }
        ]
      };
      setOperationalCenters(prev => [...prev, seattleCenter!]);
    } else {
      // Drastically reduce Seattle's inventory to trigger crisis
      setOperationalCenters(prev => prev.map(center => 
        center.id === seattleCenter!.id 
          ? { 
              ...center, 
              inventoryStatus: 'critical',
              inventory: center.inventory.map(item => ({ 
                ...item, 
                quantity: Math.floor(item.quantity * 0.05) // Reduce to 5% of original
              }))
            }
          : center
      ));
    }
    
    // Generate AI route suggestions for Seattle resupply
    const routeOptions = generateSeattleResupplyRoutes(seattleCenter);
    console.log('Generated route options for Seattle:', routeOptions.length);
    
    // Show notification with route selection
    const notification: NotificationPopup = {
      id: `seattle-resource-crisis-${Date.now()}`,
      type: 'alert',
      title: '🚨 Resource Center Crisis',
      message: `Seattle Hub inventory critically low. Agentforce has identified ${routeOptions.length} potential resupply routes. Select optimal route for emergency deployment.`,
      autoClose: false,
      actions: [
        { id: 'select-route', label: 'Select Route', type: 'approve', primary: true },
        { id: 'view-alternatives', label: 'View All Options', type: 'view_route' }
      ],
      routeOptions: routeOptions,
      disasterId: seattleCenter.id
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Update impact metrics
    setImpactMetrics(prev => ({
      ...prev,
      disastersResponded: prev.disastersResponded + 1
    }));
  };

  // Generate resupply route options for Seattle
  const generateSeattleResupplyRoutes = (targetCenter: OperationalCenter) => {
    // Find potential supplier centers (exclude Seattle and prioritize by inventory status and distance)
    const supplierCenters = operationalCenters.filter(center => 
      center.id !== targetCenter.id && 
      !center.name.toLowerCase().includes('seattle')
    );

    // Calculate distances and sort by best candidates
    const centersWithDistances = supplierCenters.map(center => ({
      center,
      distance: calculateDistance(center.location, targetCenter.location),
      inventoryScore: center.inventoryStatus === 'ample' ? 3 : 
                     center.inventoryStatus === 'moderate' ? 2 : 1
    })).sort((a, b) => {
      // Sort by inventory score first, then by distance
      if (a.inventoryScore !== b.inventoryScore) {
        return b.inventoryScore - a.inventoryScore;
      }
      return a.distance - b.distance;
    });

    const routes: Route[] = [];

    // Route 1: Best available center (Primary AI Recommendation)
    if (centersWithDistances.length > 0) {
      const primaryCenter = centersWithDistances[0];
      const estimatedHours = Math.max(4, Math.floor(primaryCenter.distance * 100)); // Rough hour calculation
      
      routes.push({
        id: `seattle-resupply-primary-${Date.now()}`,
        origin: primaryCenter.center.location,
        destination: targetCenter.location,
        confirmed: false,
        resources: [
          { type: 'Emergency Kits', quantity: 15000, unit: 'kits' },
          { type: 'Water Bottles', quantity: 25000, unit: 'bottles' },
          { type: 'Food Rations', quantity: 20000, unit: 'packages' }
        ],
        estimatedDuration: `${estimatedHours} hours`,
        priority: 'critical',
        routeType: 'primary',
        costEstimate: '$125,000',
        aiConfidence: 94,
        advantages: ['Best inventory status', 'Optimal distance', 'High reliability'],
        risks: ['Primary route congestion']
      });
    }

    // Route 2: Second best center (Alternative)
    if (centersWithDistances.length > 1) {
      const altCenter = centersWithDistances[1];
      const estimatedHours = Math.max(4, Math.floor(altCenter.distance * 100));
      
      routes.push({
        id: `seattle-resupply-alt1-${Date.now()}`,
        origin: altCenter.center.location,
        destination: targetCenter.location,
        confirmed: false,
        resources: [
          { type: 'Emergency Kits', quantity: 12000, unit: 'kits' },
          { type: 'Water Bottles', quantity: 30000, unit: 'bottles' },
          { type: 'Food Rations', quantity: 18000, unit: 'packages' }
        ],
        estimatedDuration: `${estimatedHours} hours`,
        priority: 'high',
        routeType: 'alternative',
        costEstimate: '$156,000',
        aiConfidence: 78,
        advantages: ['Backup capacity', 'Alternative supply chain', 'Diverse inventory'],
        risks: ['Longer transit time', 'Higher cost']
      });
    }

    // Route 3: Third option (Emergency backup)
    if (centersWithDistances.length > 2) {
      const backupCenter = centersWithDistances[2];
      const estimatedHours = Math.max(6, Math.floor(backupCenter.distance * 100));
      
      routes.push({
        id: `seattle-resupply-alt2-${Date.now()}`,
        origin: backupCenter.center.location,
        destination: targetCenter.location,
        confirmed: false,
        resources: [
          { type: 'Emergency Kits', quantity: 10000, unit: 'kits' },
          { type: 'Water Bottles', quantity: 20000, unit: 'bottles' },
          { type: 'Food Rations', quantity: 25000, unit: 'packages' }
        ],
        estimatedDuration: `${estimatedHours} hours`,
        priority: 'medium',
        routeType: 'alternative',
        costEstimate: '$95,000',
        aiConfidence: 68,
        advantages: ['Cost effective', 'Emergency backup', 'Large capacity'],
        risks: ['Longest transit time', 'Lower priority']
      });
    }

    console.log(`Generated ${routes.length} route options for Seattle resupply`); // Debug log
    return routes;
  };

  const createResupplyRoute = (targetCenter: OperationalCenter) => {
    // Find Portland center as the supplier
    const portlandCenter = operationalCenters.find(center => 
      center.name.toLowerCase().includes('portland') ||
      center.location.name.toLowerCase().includes('portland')
    ) || operationalCenters.find(center => 
      center.name.toLowerCase().includes('san francisco') ||
      center.location.name.toLowerCase().includes('san francisco')
    );
    
    if (portlandCenter) {
      const resupplyRoute: Route = {
        id: `resupply-${Date.now()}`,
        origin: portlandCenter.location,
        destination: targetCenter.location,
        confirmed: true,
        resources: [
          { type: 'Emergency Kits', quantity: 15000, unit: 'kits' },
          { type: 'Water Bottles', quantity: 25000, unit: 'bottles' },
          { type: 'Food Rations', quantity: 20000, unit: 'packages' }
        ],
        estimatedDuration: '6 hours',
        priority: 'critical'
      };
      
      setRoutes(prev => [...prev, resupplyRoute]);
      
      // Create corresponding shipment
      const resupplyShipment: Shipment = {
        id: `RESUPPLY-${Date.now()}`,
        origin: portlandCenter.name,
        destination: targetCenter.name,
        status: 'loading',
        estimatedArrival: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        logisticsPartner: 'Emergency Response Network',
        manifest: resupplyRoute.resources.map(resource => ({
          item: resource.type,
          quantity: resource.quantity,
          unit: resource.unit,
          corporateDonor: 'Inter-Hub Transfer'
        })),
        timeline: [
          {
            timestamp: new Date().toISOString(),
            event: 'Emergency resupply initiated - Loading in progress',
            location: portlandCenter.name
          }
        ]
      };
      
      setShipments(prev => [...prev, resupplyShipment]);
      
      // Success notification
      const successNotif: NotificationPopup = {
        id: `resupply-success-${Date.now()}`,
        type: 'agentforce',
        title: 'Auto-Rerouting Successful',
        message: `Resources being transferred from ${portlandCenter.name} to ${targetCenter.name}`,
        autoClose: true
      };
      setNotifications(prev => [successNotif, ...prev]);
    }
  };

  // Create new disaster with route recommendations
  const createNewDisaster = () => {
    const disasterCounter = demoDisasterCounter + 1;
    setDemoDisasterCounter(disasterCounter);
    
    const location = generateDisasterLocation();
    const routeOptions = generateRouteOptions(location, disasterCounter);
    
    const disasterTypes = ['hurricane', 'earthquake', 'flood', 'wildfire', 'tornado'] as const;
    
    const newDisaster: Disaster = {
      id: `demo-disaster-${disasterCounter}`,
      name: `San Francisco Emergency ${disasterCounter}`,
      type: disasterTypes[Math.floor(Math.random() * disasterTypes.length)],
      severity: 'critical', // Always critical for red urgency indicator
      location,
      affectedPopulation: Math.floor(Math.random() * 500000) + 50000,
        dateTime: new Date().toISOString(),
        needs: [
          {
          id: `demo-need-${disasterCounter}-1`,
            category: 'Water',
            specificItem: 'Emergency Water Supply',
          quantityRequested: Math.floor(Math.random() * 100000) + 10000,
            quantityMatched: 0,
            priority: 'high',
          source: 'Local Authorities'
        },
        {
          id: `demo-need-${disasterCounter}-2`,
          category: 'Medical',
          specificItem: 'Medical Supplies',
          quantityRequested: Math.floor(Math.random() * 50000) + 5000,
            quantityMatched: 0,
            priority: 'high',
          source: 'Emergency Services'
          },
          {
          id: `demo-need-${disasterCounter}-3`,
            category: 'Food',
            specificItem: 'Emergency Food Rations',
          quantityRequested: Math.floor(Math.random() * 75000) + 8000,
            quantityMatched: 0,
          priority: 'medium',
          source: 'Relief Organizations'
        }
      ]
    };
    
    // Add disaster
    setDisasters(prev => [...prev, newDisaster]);
    
    // Add route options to pending routes
    setPendingRoutes(prev => [...prev, ...routeOptions]);
    
    // Show notification with route recommendation
      const notification: NotificationPopup = {
      id: `disaster-notification-${newDisaster.id}`,
      title: 'New Disaster Detected',
      message: `${newDisaster.name} in ${location.name}. ${newDisaster.affectedPopulation.toLocaleString()} people affected. Multiple route options available.`,
        type: 'alert',
        autoClose: false,
        actions: [
        { id: 'select-route', label: 'Select Route', type: 'approve', primary: true },
        { id: 'view-disaster', label: 'View Disaster Details', type: 'view_route' }
      ],
      routeOptions: routeOptions,
      disasterId: newDisaster.id
      };

      setNotifications(prev => [...prev, notification]);
    
    // Update impact metrics
    setImpactMetrics(prev => ({
      ...prev,
      disastersResponded: prev.disastersResponded + 1
    }));
  };
  
  // Handle route approval from notification
  const handleRouteApproval = (routeId: string) => {
    // Check if it's a pending route (disaster response) or a current route option (Seattle resupply)
    let route = pendingRoutes.find(r => r.id === routeId);
    let isSeattleResupply = false;
    
    // If not in pending routes, check current route options (for Seattle resupply)
    if (!route) {
      route = currentRouteOptions.find(r => r.id === routeId);
      isSeattleResupply = true;
    }
    
    if (route) {
      // Confirm the route and add it to active routes
      const confirmedRoute = { ...route, confirmed: true };
      setRoutes(prev => [...prev, confirmedRoute]);
      
      if (isSeattleResupply) {
        // Handle Seattle resupply route
        const newShipment: Shipment = {
          id: `SEATTLE-RESUPPLY-${Date.now()}`,
          origin: route.origin.name,
          destination: route.destination.name,
          status: 'loading',
          estimatedArrival: new Date(Date.now() + parseInt(route.estimatedDuration) * 60 * 60 * 1000).toISOString(),
          logisticsPartner: 'Emergency Resource Network',
          manifest: route.resources.map(resource => ({
            item: resource.type,
            quantity: resource.quantity,
            unit: resource.unit,
            corporateDonor: 'Inter-Hub Transfer'
          })),
          timeline: [
            {
              timestamp: new Date().toISOString(),
              event: `Seattle resupply route approved - Emergency transfer initiated`,
              location: route.origin.name
            }
          ]
        };
        
        setShipments(prev => [...prev, newShipment]);
        
        // Clear current route options
        setCurrentRouteOptions([]);
        
        // Show success notification
        const successNotification: NotificationPopup = {
          id: `seattle-resupply-approved-${Date.now()}`,
          title: '✅ Seattle Resupply Route Activated',
          message: `Emergency resupply from ${route.origin.name} to Seattle approved. Estimated delivery: ${route.estimatedDuration}. Route visible on map.`,
          type: 'agentforce',
          autoClose: true
        };
        
        setNotifications(prev => [...prev, successNotification]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== successNotification.id));
        }, 6000);
        
      } else {
        // Handle regular disaster response route
        // Extract disaster counter from route ID to remove all related routes
        const disasterCounter = routeId.split('-')[2]; // e.g., "demo-route-1-primary" -> "1"
        
        // Remove all pending routes for this disaster (primary + alternatives)
        setPendingRoutes(prev => prev.filter(r => !r.id.includes(`demo-route-${disasterCounter}`)));
        
        // Create a shipment for this route
        const newShipment: Shipment = {
          id: `DEMO-${Date.now()}`,
          origin: route.origin.name,
          destination: route.destination.name,
          status: 'loading',
          estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          logisticsPartner: 'Emergency Response Team',
          manifest: route.resources.map(resource => ({
            item: resource.type,
            quantity: resource.quantity,
            unit: resource.unit,
            corporateDonor: 'Emergency Reserve'
          })),
          timeline: [
            {
              timestamp: new Date().toISOString(),
              event: 'Route approved - Emergency deployment initiated',
              location: route.origin.name
            }
          ]
        };
        
        setShipments(prev => [...prev, newShipment]);
        
        // Show success notification
        const successNotification: NotificationPopup = {
          id: `route-approved-${Date.now()}`,
          title: 'Route Approved',
          message: `Emergency route from ${route.origin.name} to ${route.destination.name} has been activated. Resources are being deployed.`,
          type: 'agentforce',
          autoClose: true
        };
        
        setNotifications(prev => [...prev, successNotification]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== successNotification.id));
        }, 5000);
      }
      
      // Update impact metrics
      setImpactMetrics(prev => ({
        ...prev,
        peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 20000) + 10000,
        costSaved: prev.costSaved + Math.floor(Math.random() * 50000) + 25000
      }));
    }
  };
  
  // Keyboard event listener for 'D' and 'R' keys
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
        
        if (event.key.toLowerCase() === 'd' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          createNewDisaster();
        }
        
        // NEW: 'R' trigger for resource center crisis and rerouting
        if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          triggerResourceCrisis();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [demoDisasterCounter, operationalCenters]);


  const handleAddInventory = (centerId: string, item: Partial<InventoryItem>) => {
    setOperationalCenters(prev => prev.map(center => 
      center.id === centerId 
        ? { 
            ...center, 
            inventory: [...center.inventory, item as InventoryItem],
            totalItems: center.totalItems + (item.quantity || 0)
          }
        : center
    ));
  };

  const handleInitiateShipment = (centerId: string, items: InventoryItem[]) => {
    // Create new shipment
    const newShipment: Shipment = {
      id: `SHP-${Date.now()}`,
      origin: operationalCenters.find(c => c.id === centerId)?.name || 'Unknown',
      destination: 'Emergency Zone',
      status: 'loading',
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      logisticsPartner: 'Emergency Response',
      manifest: items.map(item => ({
        item: item.specificItem,
        quantity: item.quantity,
        unit: 'units',
        corporateDonor: item.corporatePartner
      })),
      timeline: [
        {
          timestamp: new Date().toISOString(),
          event: 'Shipment initiated from inventory',
          location: operationalCenters.find(c => c.id === centerId)?.name
        }
      ]
    };

    setShipments(prev => [...prev, newShipment]);

    // Update inventory quantities
    setOperationalCenters(prev => prev.map(center => 
      center.id === centerId 
        ? { 
            ...center, 
            inventory: center.inventory.filter(invItem => 
              !items.find(selectedItem => selectedItem.id === invItem.id)
            ),
            totalItems: center.totalItems - items.reduce((sum, item) => sum + item.quantity, 0)
          }
        : center
    ));
  };

  const handleSidebarFilterChange = (filters: any) => {
    // Apply filters to displayed data (this would filter the map markers, etc.)
    console.log('Sidebar filters changed:', filters);
  };

  const handleAddDonation = (donation: Partial<InventoryItem>) => {
    // Add to a random center's inventory
    const randomCenter = operationalCenters[Math.floor(Math.random() * operationalCenters.length)];
    handleAddInventory(randomCenter.id, donation);

    // Show notification
    const notification: NotificationPopup = {
      id: `donation-${Date.now()}`,
      title: ' Donation Added',
      message: `${donation.quantity} ${donation.specificItem} from ${donation.corporatePartner} has been added to inventory.`,
      type: 'agentforce',
      autoClose: true
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const handleManualAllocation = (request: any) => {
    // Process manual allocation request
    const notification: NotificationPopup = {
      id: `allocation-${Date.now()}`,
      title: ' Allocation Request Submitted',
      message: `Manual allocation request for ${request.quantity} ${request.resourceType} has been submitted for review.`,
      type: 'alert',
      autoClose: true
    };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const activeDisastersCount = disasters.length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>
            Triageforce
          </h1>
          <div className="live-impact-metrics">
            <div className="metric-item">
              <motion.div 
                className="metric-value"
                key={impactMetrics.peopleHelped}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}  
              >
                {impactMetrics.peopleHelped.toLocaleString()}
              </motion.div>
              <div className="metric-label">People Helped</div>
            </div>
            <div className="metric-item">
              <motion.div 
                className="metric-value"
                key={impactMetrics.wastePrevented}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {impactMetrics.wastePrevented.toLocaleString()}
              </motion.div>
              <div className="metric-label">Tons Waste Prevented</div>
            </div>
            <div className="metric-item">
              <motion.div 
                className="metric-value"
                key={impactMetrics.costSaved}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                ${Math.floor(impactMetrics.costSaved / 1000000)}M
              </motion.div>
              <div className="metric-label">Cost Saved</div>
            </div>
            <div className="metric-item">
              <div className="metric-value active-disasters">{activeDisastersCount}</div>
              <div className="metric-label">Active Disasters</div>
            </div>
          </div>
          <div className="status-indicators">
            <span className="status-item">
              <span className="status-dot active"></span>
              Agentforce Active
            </span>
            <span className="status-item">
              <span className="status-dot active"></span>
              Real-time Sync
            </span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <motion.div
          className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
          initial={false}
          animate={{ width: sidebarCollapsed ? 60 : 300 }}
        >
          <Sidebar
            disasters={disasters}
            operationalCenters={operationalCenters}
            shipments={shipments}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onFilterChange={handleSidebarFilterChange}
            onAddDonation={handleAddDonation}
            onManualAllocation={handleManualAllocation}
            liveMetrics={impactMetrics}
          />
        </motion.div>

        <div className="main-content">
          {viewMode === 'dashboard' && (
            <motion.div
              className="map-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <WorldMap
                disasters={disasters}
                operationalCenters={operationalCenters}
                shipments={shipments}
                routes={routes}
                onDisasterClick={handleDisasterClick}
                onCenterClick={handleCenterClick}
                onShipmentClick={handleShipmentClick}
                onRouteClick={handleRouteClick}
                onViewNeedsAssessment={(disasterId) => {
                  const disaster = disasters.find(d => d.id === disasterId);
                  if (disaster) handleDisasterClick(disaster);
                }}
                onViewActiveShipments={(disasterId) => handleViewActiveShipments(disasterId)}
              />
            </motion.div>
          )}

          {viewMode === 'disaster-detail' && selectedDisaster && (
            <DisasterNeedsView
              disaster={selectedDisaster}
              onBack={handleBackToDashboard}
              onViewActiveShipments={handleViewActiveShipments}
            />
          )}

          {viewMode === 'center-detail' && selectedCenter && (
            <InventoryView
              center={selectedCenter}
              onBack={handleBackToDashboard}
              onAddInventory={handleAddInventory}
              onInitiateShipment={handleInitiateShipment}
            />
          )}

          {viewMode === 'shipment-detail' && selectedShipment && (
            <ShipmentTrackingView
              shipment={selectedShipment}
              onBack={handleBackToDashboard}
              onStatusUpdate={handleShipmentStatusUpdate}
            />
          )}

          {viewMode === 'route-detail' && selectedRoute && (
            <RouteDetailsView
              route={selectedRoute}
              onBack={handleBackToDashboard}
              onConfirmRoute={(routeId) => {
                setRoutes(prev => prev.map(route => 
                  route.id === routeId ? { ...route, confirmed: true } : route
                ));
                // Add success notification
                const notification: NotificationPopup = {
                  id: `route-confirmed-${Date.now()}`,
                  type: 'agentforce',
                  title: 'Route Confirmed',
                  message: `Route ${routeId} has been successfully confirmed and activated`,
                  autoClose: true
                };
                setNotifications(prev => [notification, ...prev]);
              }}
              onModifyRoute={(routeId) => {
                console.log('Modify route:', routeId);
                // TODO: Implement route modification logic
              }}
            />
          )}
        </div>

        <motion.div
          className={`alerts-panel ${alertsPanelCollapsed ? 'collapsed' : ''}`}
          initial={false}
          animate={{ width: alertsPanelCollapsed ? 60 : 350 }}
        >
          <AlertsPanel
            alerts={alerts}
            collapsed={alertsPanelCollapsed}
            onToggleCollapse={() => setAlertsPanelCollapsed(!alertsPanelCollapsed)}
            onAlertClick={handleAlertClick}
            onAlertAction={handleAlertAction}
          />
        </motion.div>
      </div>

      {/* Notification Popup System */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            className={`notification-popup ${notification.type}`}
            initial={{ opacity: 0, y: -100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="notification-content">
              <div className="notification-header">
                <h4>{notification.title}</h4>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  className="notification-close"
                >
                  ×
                </button>
              </div>
              <p>{notification.message}</p>
              {notification.actions && (
                <div className="notification-actions">
                  {notification.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (action.type === 'approve') {
                          // Handle specific actions
                          // Handle notification-specific actions
                          if (notification.id.startsWith('disaster-notification-')) {
                            if (action.id === 'select-route') {
                              const disasterId = notification.id.replace('disaster-notification-', '');
                              if (notification.routeOptions) {
                                setCurrentRouteOptions(notification.routeOptions);
                                // setSelectedDisasterId(disasterId); // Reserved for future use
                                setShowRouteSelectionModal(true);
                                // Close the notification
                                setNotifications(prev => prev.filter(n => n.id !== notification.id));
                              }
                            } else if (action.id === 'view-disaster') {
                              const disasterId = notification.id.replace('disaster-notification-', '');
                              const disaster = disasters.find(d => d.id === disasterId);
                              if (disaster) {
                                handleDisasterClick(disaster);
                              }
                            }
                          }
                          // Handle Seattle resource crisis route selection
                          else if (notification.id.startsWith('seattle-resource-crisis-')) {
                            console.log('Seattle resource crisis notification clicked:', action.id, notification.routeOptions?.length);
                            if (action.id === 'select-route') {
                              if (notification.routeOptions) {
                                setCurrentRouteOptions(notification.routeOptions);
                                setShowRouteSelectionModal(true);
                                // Close the notification
                                setNotifications(prev => prev.filter(n => n.id !== notification.id));
                              }
                            } else if (action.id === 'view-alternatives') {
                              if (notification.routeOptions) {
                                setCurrentRouteOptions(notification.routeOptions);
                                setShowRouteSelectionModal(true);
                                // Close the notification
                                setNotifications(prev => prev.filter(n => n.id !== notification.id));
                              }
                            }
                          }
                        }
                        setNotifications(prev => prev.filter(n => n.id !== notification.id));
                      }}
                      className={`notification-btn ${action.primary ? 'primary' : 'secondary'}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {/* Route Selection Modal - Minimal Design */}
      <AnimatePresence>
        {showRouteSelectionModal && currentRouteOptions.length > 0 && (
          <motion.div
            className="route-selection-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRouteSelectionModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: '20px'
            }}
          >
            <motion.div
              className="route-selection-modal"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '4px',
                border: '1px solid #334155',
                maxWidth: '1200px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Header */}
              <div style={{
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #334155',
                position: 'relative'
              }}>
                <button 
                  onClick={() => setShowRouteSelectionModal(false)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
                
                <h2 style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#e2e8f0',
                  letterSpacing: '-0.025em'
                }}>Route Selection</h2>
                <p style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.875rem',
                  color: '#94a3b8',
                  fontWeight: '400'
                }}>Choose deployment route for emergency response</p>
              </div>

              {/* Content */}
              <div style={{
                padding: '1.5rem',
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 100px)',
                backgroundColor: '#1e293b'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '1rem',
                  gridTemplateColumns: currentRouteOptions.length === 1 ? '1fr' : 
                                     currentRouteOptions.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr'
                }}>
                  {currentRouteOptions.map((route, index) => {
                    const isPrimary = route.routeType === 'primary';
                    return (
                      <div
                        key={route.id}
                        style={{
                          background: '#0f172a',
                          border: isPrimary 
                            ? '1px solid #3b82f6'
                            : '1px solid #334155',
                          borderRadius: '4px',
                          padding: '1rem',
                          position: 'relative'
                        }}
                      >
                        {/* Route Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: isPrimary ? '#3b82f6' : '#475569',
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '2px',
                          fontSize: '0.625rem',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {isPrimary ? 'PRIMARY' : 'ALT'}
                        </div>

                        {/* Route Info */}
                        <div style={{ marginBottom: '1rem', paddingRight: '3rem' }}>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#e2e8f0',
                            marginBottom: '0.25rem'
                          }}>
                            Route {index + 1}
                          </div>
                          
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginBottom: '0.75rem'
                          }}>
                            Confidence: {route.aiConfidence || 0}%
                          </div>
                          
                          <div style={{
                            width: '100%',
                            height: '2px',
                            backgroundColor: '#374151',
                            borderRadius: '1px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${route.aiConfidence || 0}%`,
                              height: '100%',
                              backgroundColor: isPrimary ? '#3b82f6' : '#64748b'
                            }}></div>
                          </div>
                        </div>

                        {/* Route Path */}
                        <div style={{
                          marginBottom: '1rem',
                          padding: '0.75rem',
                          backgroundColor: '#1e293b',
                          borderRadius: '4px',
                          border: '1px solid #334155'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <div>
                              <div style={{
                                fontSize: '0.625rem',
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                marginBottom: '0.25rem'
                              }}>FROM</div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#e2e8f0'
                              }}>
                                {/* Find the actual supplier center name */}
                                {operationalCenters.find(c => 
                                  c.location.lat === route.origin.lat && 
                                  c.location.lng === route.origin.lng
                                )?.name || route.origin.name}
                              </div>
                            </div>
                            <div style={{
                              color: '#64748b',
                              fontSize: '0.875rem'
                            }}>→</div>
                            <div>
                              <div style={{
                                fontSize: '0.625rem',
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                marginBottom: '0.25rem'
                              }}>TO</div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: '#e2e8f0'
                              }}>{route.destination.name}</div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          gap: '0.5rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: '#1e293b',
                            borderRadius: '4px',
                            border: '1px solid #334155'
                          }}>
                            <div style={{
                              fontSize: '0.625rem',
                              color: '#94a3b8',
                              textTransform: 'uppercase',
                              marginBottom: '0.25rem'
                            }}>TIME</div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#e2e8f0'
                            }}>{route.estimatedDuration}</div>
                          </div>
                          
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: '#1e293b',
                            borderRadius: '4px',
                            border: '1px solid #334155'
                          }}>
                            <div style={{
                              fontSize: '0.625rem',
                              color: '#94a3b8',
                              textTransform: 'uppercase',
                              marginBottom: '0.25rem'
                            }}>COST</div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#e2e8f0'
                            }}>{route.costEstimate}</div>
                          </div>
                          
                          <div style={{
                            padding: '0.5rem',
                            backgroundColor: '#1e293b',
                            borderRadius: '4px',
                            border: '1px solid #334155'
                          }}>
                            <div style={{
                              fontSize: '0.625rem',
                              color: '#94a3b8',
                              textTransform: 'uppercase',
                              marginBottom: '0.25rem'
                            }}>PRIORITY</div>
                            <div style={{
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: route.priority === 'critical' ? '#dc2626' : 
                                     route.priority === 'high' ? '#ea580c' :
                                     route.priority === 'medium' ? '#d97706' : '#65a30d'
                            }}>{route.priority.toUpperCase()}</div>
                          </div>
                        </div>

                        {/* Resources */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{
                            fontSize: '0.625rem',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem',
                            letterSpacing: '0.05em'
                          }}>RESOURCES</div>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem'
                          }}>
                            {route.resources.map((resource, idx) => (
                              <div key={idx} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.25rem 0',
                                fontSize: '0.75rem'
                              }}>
                                <span style={{ color: '#94a3b8' }}>{resource.type}</span>
                                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>
                                  {resource.quantity.toLocaleString()} {resource.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pros and Cons */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '0.625rem',
                              color: '#10b981',
                              textTransform: 'uppercase',
                              marginBottom: '0.5rem',
                              letterSpacing: '0.05em'
                            }}>ADVANTAGES</div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#cbd5e1',
                              lineHeight: '1.4'
                            }}>
                              {route.advantages?.map((advantage, idx) => (
                                <div key={idx} style={{ marginBottom: '0.25rem' }}>
                                  • {advantage}
                                </div>
                              )) || []}
                            </div>
                          </div>
                          
                          <div>
                            <div style={{
                              fontSize: '0.625rem',
                              color: '#dc2626',
                              textTransform: 'uppercase',
                              marginBottom: '0.5rem',
                              letterSpacing: '0.05em'
                            }}>CONSIDERATIONS</div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#cbd5e1',
                              lineHeight: '1.4'
                            }}>
                              {route.risks?.map((risk, idx) => (
                                <div key={idx} style={{ marginBottom: '0.25rem' }}>
                                  • {risk}
                                </div>
                              )) || []}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => {
                            handleRouteApproval(route.id);
                            setShowRouteSelectionModal(false);
                          }}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            border: isPrimary ? '1px solid #3b82f6' : '1px solid #334155',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            backgroundColor: isPrimary ? '#3b82f6' : 'transparent',
                            color: isPrimary ? '#ffffff' : '#e2e8f0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (isPrimary) {
                              e.currentTarget.style.backgroundColor = '#2563eb';
                            } else {
                              e.currentTarget.style.backgroundColor = '#334155';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isPrimary) {
                              e.currentTarget.style.backgroundColor = '#3b82f6';
                            } else {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          Select Route
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;