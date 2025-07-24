import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WorldMap from './WorldMap';
import Sidebar from './Sidebar';
import AlertsPanel from './AlertsPanel';
import DisasterNeedsView from './DisasterNeedsView';
import ShipmentTrackingView from './ShipmentTrackingView';
import InventoryView from './InventoryView';
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
  const [showNotification, setShowNotification] = useState(false);

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

  const handleAlertAction = (alertId: string, actionType: string) => {
    // Update alert status
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'awaiting_resolution' as const }
        : alert
    ));

    // Create notification popup
    const notification: NotificationPopup = {
      id: `notif-${Date.now()}`,
      title: 'Action Processed',
      message: `${actionType} action has been initiated. Status updated.`,
      type: 'agentforce',
      autoClose: true
    };

    setNotifications(prev => [...prev, notification]);
    setShowNotification(true);

    // Auto-close notification
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 4000);
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

  const handleViewActiveShipments = () => {
    // Navigate to first available shipment
    const activeShipment = shipments.find(s => s.status === 'in_transit' || s.status === 'delayed');
    if (activeShipment) {
      handleShipmentClick(activeShipment);
    }
  };

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random updates
      if (Math.random() < 0.4) {
        // Update impact metrics
        setImpactMetrics(prev => ({
          peopleHelped: prev.peopleHelped + Math.floor(Math.random() * 1000),
          wastePrevented: prev.wastePrevented + Math.floor(Math.random() * 500),
          costSaved: prev.costSaved + Math.floor(Math.random() * 5000),
          disastersResponded: prev.disastersResponded
        }));
      }

      // Occasionally add new notifications
      if (Math.random() < 0.2) {
        const agentforceMessages = [
          'New resource match found automatically',
          'Route optimization completed',
          'Inventory level warning threshold reached',
          'Corporate donation processed successfully',
          'Alternative supplier identified'
        ];
        
        const message = agentforceMessages[Math.floor(Math.random() * agentforceMessages.length)];
        const notification: NotificationPopup = {
          id: `auto-${Date.now()}`,
          title: ' Agentforce Update',
          message,
          type: 'agentforce',
          autoClose: true
        };

        setNotifications(prev => [...prev, notification]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Typhoon Genesis simulation
  useEffect(() => {
    const typhoonTimeout = setTimeout(() => {
      const typhoonDisaster: Disaster = {
        id: 'disaster-typhoon-genesis',
        name: 'Typhoon Genesis',
        type: 'hurricane',
        severity: 'critical',
        location: {
          lat: 14.5995,
          lng: 120.9842,
          name: 'Manila, Philippines'
        },
        affectedPopulation: 2300000,
        dateTime: new Date().toISOString(),
        needs: [
          {
            id: 'typhoon-need-1',
            category: 'Water',
            specificItem: 'Emergency Water Supply',
            quantityRequested: 1000000,
            quantityMatched: 0,
            priority: 'high',
            source: 'NDRRMC Philippines'
          },
          {
            id: 'typhoon-need-2',
            category: 'Shelter',
            specificItem: 'Emergency Evacuation Centers',
            quantityRequested: 500,
            quantityMatched: 0,
            priority: 'high',
            source: 'Red Cross Philippines'
          },
          {
            id: 'typhoon-need-3',
            category: 'Food',
            specificItem: 'Emergency Food Rations',
            quantityRequested: 750000,
            quantityMatched: 0,
            priority: 'high',
            source: 'UN WFP'
          }
        ]
      };

      setDisasters(prev => [...prev, typhoonDisaster]);

      // Add corresponding alert
      const typhoonAlert: Alert = {
        id: 'alert-typhoon-genesis',
        type: 'urgent',
        message: 'BREAKING: Typhoon Genesis makes landfall in Philippines - 2.3M people affected',
        timestamp: new Date().toISOString(),
        relatedId: 'disaster-typhoon-genesis',
        relatedType: 'disaster',
        status: 'active',
        recommendations: [
          {
            id: 'typhoon-rec-1',
            title: 'Immediate Response Deployment',
            description: 'Deploy emergency response teams and pre-positioned supplies from Singapore and Tokyo hubs immediately.',
            costImpact: '+$125,000',
            timeImpact: '6 hours to deployment',
            actions: [
              { id: 'typhoon-act-1', label: 'Deploy Now', type: 'approve', primary: true },
              { id: 'typhoon-act-2', label: 'View Routes', type: 'view_route' },
              { id: 'typhoon-act-3', label: 'Contact Hubs', type: 'contact' }
            ]
          }
        ]
      };

      setAlerts(prev => [typhoonAlert, ...prev]);

      // Show notification
      const notification: NotificationPopup = {
        id: 'typhoon-notification',
        title: ' Critical Alert',
        message: 'Typhoon Genesis has been detected. Immediate action required.',
        type: 'alert',
        autoClose: false,
        actions: [
          { id: 'view-disaster', label: 'View Disaster', type: 'approve', primary: true }
        ]
      };

      setNotifications(prev => [...prev, notification]);
    }, 30000); // Trigger after 30 seconds

    return () => clearTimeout(typhoonTimeout);
  }, []);

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
          <h1>Triageforce <span className="command-text">COMMAND</span></h1>
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
                onViewActiveShipments={handleViewActiveShipments}
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
            <motion.div
              className="detail-view"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="detail-header">
                <button onClick={handleBackToDashboard} className="back-button">
                  ← Back to Dashboard
                </button>
                <h2>Route Details: {selectedRoute.id}</h2>
              </div>

              <div className="route-detail">
                <div className="route-summary">
                  <h3>Route Summary</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="label">Origin:</span>
                      <span className="value">{selectedRoute.origin.name}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Destination:</span>
                      <span className="value">{selectedRoute.destination.name}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Status:</span>
                      <span className={`value status-${selectedRoute.confirmed ? 'confirmed' : 'pending'}`}>
                        {selectedRoute.confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">Priority:</span>
                      <span className={`value priority-${selectedRoute.priority}`}>
                        {selectedRoute.priority.charAt(0).toUpperCase() + selectedRoute.priority.slice(1)}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">Estimated Duration:</span>
                      <span className="value">{selectedRoute.estimatedDuration}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Total Resources:</span>
                      <span className="value">
                        {selectedRoute.resources.reduce((total, resource) => total + resource.quantity, 0).toLocaleString()} units
                      </span>
                    </div>
                  </div>
                </div>

                <div className="route-resources">
                  <h4>Resources Being Transported</h4>
                  <table className="needs-table">
                    <thead>
                      <tr>
                        <th>Resource Type</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRoute.resources.map((resource, index) => (
                        <tr key={index}>
                          <td>{resource.type}</td>
                          <td>{resource.quantity.toLocaleString()}</td>
                          <td>{resource.unit}</td>
                          <td>
                            <span className={`priority priority-${selectedRoute.priority}`}>
                              {selectedRoute.priority.charAt(0).toUpperCase() + selectedRoute.priority.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="route-coordinates">
                  <h4>Route Coordinates</h4>
                  <div className="coordinates-grid">
                    <div className="coordinate-section">
                      <h5>Origin</h5>
                      <div className="coordinate-details">
                        <p><strong>Location:</strong> {selectedRoute.origin.name}</p>
                        <p><strong>Latitude:</strong> {selectedRoute.origin.lat.toFixed(4)}°</p>
                        <p><strong>Longitude:</strong> {selectedRoute.origin.lng.toFixed(4)}°</p>
                      </div>
                    </div>
                    <div className="coordinate-section">
                      <h5>Destination</h5>
                      <div className="coordinate-details">
                        <p><strong>Location:</strong> {selectedRoute.destination.name}</p>
                        <p><strong>Latitude:</strong> {selectedRoute.destination.lat.toFixed(4)}°</p>
                        <p><strong>Longitude:</strong> {selectedRoute.destination.lng.toFixed(4)}°</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="route-status">
                  <h4>Route Status</h4>
                  <div className="status-indicators">
                    <div className={`status-indicator ${selectedRoute.confirmed ? 'confirmed' : 'pending'}`}>
                      <div className="status-icon">
                        {selectedRoute.confirmed ? '✓' : ''}
                      </div>
                      <div className="status-info">
                        <h5>{selectedRoute.confirmed ? 'Route Confirmed' : 'Route Pending'}</h5>
                        <p>
                          {selectedRoute.confirmed 
                            ? 'This route has been confirmed and is actively being used for resource transportation.'
                            : 'This route is pending confirmation and may be subject to changes.'
                          }
                        </p>
                      </div>
                    </div>
                    <div className={`status-indicator priority-${selectedRoute.priority}`}>
                      <div className="status-icon">
                        {selectedRoute.priority === 'critical' ? '' : 
                         selectedRoute.priority === 'high' ? '' : ''}
                      </div>
                      <div className="status-info">
                        <h5>Priority Level: {selectedRoute.priority.charAt(0).toUpperCase() + selectedRoute.priority.slice(1)}</h5>
                        <p>
                          {selectedRoute.priority === 'critical' ? 'This route is critical for emergency response operations.' :
                           selectedRoute.priority === 'high' ? 'This route is high priority and should be expedited.' :
                           'This route is standard priority for regular operations.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="route-timeline">
                  <h4>Route Timeline</h4>
                  <div className="timeline-events">
                    <div className="timeline-event">
                      <div className="timeline-time">Route Created</div>
                      <div className="timeline-content">
                        <div className="event-text">Route {selectedRoute.id} was created</div>
                        <div className="event-location">Origin: {selectedRoute.origin.name}</div>
                      </div>
                    </div>
                    <div className="timeline-event">
                      <div className="timeline-time">Status Update</div>
                      <div className="timeline-content">
                        <div className="event-text">
                          Route {selectedRoute.confirmed ? 'confirmed' : 'pending confirmation'}
                        </div>
                        <div className="event-location">Priority: {selectedRoute.priority}</div>
                      </div>
                    </div>
                    <div className="timeline-event">
                      <div className="timeline-time">Resource Loading</div>
                      <div className="timeline-content">
                        <div className="event-text">
                          {selectedRoute.resources.reduce((total, resource) => total + resource.quantity, 0).toLocaleString()} units loaded
                        </div>
                        <div className="event-location">Origin: {selectedRoute.origin.name}</div>
                      </div>
                    </div>
                    <div className="timeline-event">
                      <div className="timeline-time">Estimated Arrival</div>
                      <div className="timeline-content">
                        <div className="event-text">Route completion expected</div>
                        <div className="event-location">Destination: {selectedRoute.destination.name}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
                          if (notification.id === 'typhoon-notification') {
                            const typhoonDisaster = disasters.find(d => d.id === 'disaster-typhoon-genesis');
                            if (typhoonDisaster) {
                              handleDisasterClick(typhoonDisaster);
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
    </div>
  );
};

export default Dashboard;