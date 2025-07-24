import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WorldMap from './WorldMap';
import Sidebar from './Sidebar';
import AlertsPanel from './AlertsPanel';
import { Disaster, OperationalCenter, Shipment, Route } from '../types';
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>AidBridge Connect Command Center</h1>
          <div className="status-indicators">
            <span className="status-item">
              <span className="status-dot active"></span>
              Agentforce Active
            </span>
            <span className="status-item">
              <span className="status-dot"></span>
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
            disasters={mockDisasters}
            operationalCenters={mockOperationalCenters}
            shipments={mockShipments}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
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
                disasters={mockDisasters}
                operationalCenters={mockOperationalCenters}
                shipments={mockShipments}
                routes={mockRoutes}
                onDisasterClick={handleDisasterClick}
                onCenterClick={handleCenterClick}
                onShipmentClick={handleShipmentClick}
                onRouteClick={handleRouteClick}
              />
            </motion.div>
          )}

          {viewMode === 'disaster-detail' && selectedDisaster && (
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
                <h2>Disaster Needs Assessment</h2>
              </div>
              <div className="disaster-detail">
                <div className="disaster-summary">
                  <h3>{selectedDisaster.name} - {selectedDisaster.location.name}</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="label">Affected Population:</span>
                      <span className="value">{selectedDisaster.affectedPopulation.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Urgency Level:</span>
                      <span className={`value severity-${selectedDisaster.severity}`}>
                        {selectedDisaster.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="needs-table">
                  <h4>Needs Assessment</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Item</th>
                        <th>Requested</th>
                        <th>Matched</th>
                        <th>Remaining</th>
                        <th>Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedDisaster.needs.map((need) => (
                        <tr key={need.id}>
                          <td>{need.category}</td>
                          <td>{need.specificItem}</td>
                          <td>{need.quantityRequested.toLocaleString()}</td>
                          <td>{need.quantityMatched.toLocaleString()}</td>
                          <td>{(need.quantityRequested - need.quantityMatched).toLocaleString()}</td>
                          <td>
                            <span className={`priority priority-${need.priority}`}>
                              {need.priority.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'center-detail' && selectedCenter && (
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
                <h2>Operational Center Inventory</h2>
              </div>
              <div className="center-detail">
                <div className="center-summary">
                  <h3>{selectedCenter.name} - {selectedCenter.location.name}</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="label">Total Items:</span>
                      <span className="value">{selectedCenter.totalItems.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Categories:</span>
                      <span className="value">{selectedCenter.totalCategories}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Inventory Value:</span>
                      <span className="value">${selectedCenter.inventoryValue.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Status:</span>
                      <span className={`value status-${selectedCenter.inventoryStatus}`}>
                        {selectedCenter.inventoryStatus.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === 'shipment-detail' && selectedShipment && (
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
                <h2>Shipment Tracking</h2>
              </div>
              <div className="shipment-detail">
                <div className="shipment-summary">
                  <h3>Shipment {selectedShipment.id}</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="label">Origin:</span>
                      <span className="value">{selectedShipment.origin}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Destination:</span>
                      <span className="value">{selectedShipment.destination}</span>
                    </div>
                    <div className="stat">
                      <span className="label">Status:</span>
                      <span className={`value status-${selectedShipment.status}`}>
                        {selectedShipment.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="label">ETA:</span>
                      <span className="value">
                        {new Date(selectedShipment.estimatedArrival).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="timeline">
                  <h4>Timeline</h4>
                  {selectedShipment.timeline.map((event, index) => (
                    <div key={index} className="timeline-event">
                      <div className="timeline-time">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="timeline-content">
                        <div className="event-text">{event.event}</div>
                        {event.location && (
                          <div className="event-location">{event.location}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
                        {selectedRoute.confirmed ? '✓' : '⏳'}
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
                        {selectedRoute.priority === 'critical' ? '🚨' : 
                         selectedRoute.priority === 'high' ? '⚠️' : 'ℹ️'}
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
            alerts={mockAlerts}
            collapsed={alertsPanelCollapsed}
            onToggleCollapse={() => setAlertsPanelCollapsed(!alertsPanelCollapsed)}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;