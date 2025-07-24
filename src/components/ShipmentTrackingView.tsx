import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shipment, TimelineEvent, AlternativeRoute } from '../types';

interface ShipmentTrackingViewProps {
  shipment: Shipment;
  onBack: () => void;
  onStatusUpdate: (shipmentId: string, newStatus: Shipment['status']) => void;
}

const ShipmentTrackingView: React.FC<ShipmentTrackingViewProps> = ({
  shipment,
  onBack,
  onStatusUpdate
}) => {
  const [timeline, setTimeline] = useState<TimelineEvent[]>(shipment.timeline);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  const alternativeRoutes: AlternativeRoute[] = [
    {
      id: 'alt-1',
      description: 'Alternate highway via I-75 South',
      costImpact: '+$2,400',
      timeImpact: '+3.5 hours',
      riskLevel: 'low'
    },
    {
      id: 'alt-2',
      description: 'Air freight expedited delivery',
      costImpact: '+$15,800',
      timeImpact: '-8 hours',
      riskLevel: 'medium'
    },
    {
      id: 'alt-3',
      description: 'Rail transport with transfer',
      costImpact: '-$1,200',
      timeImpact: '+12 hours',
      riskLevel: 'low'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (Math.random() < 0.4) {
        const newEvent: TimelineEvent = {
          timestamp: new Date().toISOString(),
          event: getRandomStatusUpdate(),
          location: shipment.currentLocation?.name
        };
        
        setTimeline(prev => [newEvent, ...prev]);
      }
    }, 8000);

    return () => clearInterval(updateInterval);
  }, [shipment.currentLocation]);

  const getRandomStatusUpdate = () => {
    const updates = [
      'GPS location updated',
      'Driver check-in completed',
      'Cargo temperature monitored - Normal',
      'Security checkpoint passed',
      'Route optimization applied',
      'Estimated arrival time updated'
    ];
    return updates[Math.floor(Math.random() * updates.length)];
  };

  const handleContactCarrier = () => {
    setShowContactModal(true);
  };

  const handleReportIssue = () => {
    setShowIssueModal(true);
  };

  const handleApproveRecommendedAction = async () => {
    setIsProcessingAction(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status and add timeline event
    const newEvent: TimelineEvent = {
      timestamp: new Date().toISOString(),
      event: 'Recommended route approved - Switching to alternate path',
      location: 'Command Center'
    };
    
    setTimeline(prev => [newEvent, ...prev]);
    onStatusUpdate(shipment.id, 'in_transit');
    setIsProcessingAction(false);
  };

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'loading': return '#ffa500';
      case 'in_transit': return '#00ff00';
      case 'delayed': return '#ff6b6b';
      case 'delivered': return '#4caf50';
      case 'exception': return '#f44336';
      default: return '#666';
    }
  };

  return (
    <motion.div
      className="shipment-tracking-view"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h2>Shipment Tracking: {shipment.id}</h2>
        <div className="header-actions">
          <span className={`status-badge status-${shipment.status}`}>
            {shipment.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="shipment-detail">
        <div className="shipment-overview">
          <div className="shipment-summary">
            <h3>Shipment Overview</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="label">Origin:</span>
                <span className="value">{shipment.origin}</span>
              </div>
              <div className="stat">
                <span className="label">Destination:</span>
                <span className="value">{shipment.destination}</span>
              </div>
              <div className="stat">
                <span className="label">Current Location:</span>
                <span className="value highlight">
                   {shipment.currentLocation?.name || 'Unknown'}
                </span>
              </div>
              <div className="stat">
                <span className="label">Logistics Partner:</span>
                <span className="value">{shipment.logisticsPartner}</span>
              </div>
              <div className="stat">
                <span className="label">ETA:</span>
                <span className="value">
                  {new Date(shipment.estimatedArrival).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mini-map-container">
            <h4> Current Position</h4>
            <div className="mini-map">
              <div className="map-placeholder">
                <div className="route-line"></div>
                <div className="origin-marker"></div>
                <div className="current-marker"></div>
                <div className="destination-marker"></div>
                <div className="coordinates">
                  <div>Origin: {shipment.origin}</div>
                  <div>Current: {shipment.currentLocation?.name}</div>
                  <div>Destination: {shipment.destination}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons-panel">
          <h4> Quick Actions</h4>
          <div className="action-buttons">
            <motion.button
              onClick={handleContactCarrier}
              className="action-button contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
               Contact Carrier
            </motion.button>
            
            <motion.button
              onClick={handleReportIssue}
              className="action-button report"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
               Report Issue
            </motion.button>
            
            <motion.button
              onClick={handleApproveRecommendedAction}
              disabled={isProcessingAction}
              className="action-button approve primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessingAction ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                ' Approve Recommended Action'
              )}
            </motion.button>
            
            <motion.button
              onClick={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
              className="action-button routes"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
               View Alternative Routes
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {showAlternativeRoutes && (
            <motion.div
              className="alternative-routes"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4> Alternative Route Options</h4>
              <div className="routes-list">
                {alternativeRoutes.map(route => (
                  <div key={route.id} className="route-option">
                    <div className="route-info">
                      <div className="route-description">{route.description}</div>
                      <div className="route-impacts">
                        <span className={`impact cost ${route.costImpact.includes('+') ? 'negative' : 'positive'}`}>
                          {route.costImpact}
                        </span>
                        <span className={`impact time ${route.timeImpact.includes('+') ? 'negative' : 'positive'}`}>
                          {route.timeImpact}
                        </span>
                        <span className={`risk risk-${route.riskLevel}`}>
                          Risk: {route.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button className="select-route-btn">Select Route</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="manifest-section">
          <h4> Shipment Manifest</h4>
          <div className="manifest-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Corporate Donor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {shipment.manifest.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{item.quantity.toLocaleString()}</td>
                    <td>{item.unit}</td>
                    <td>{item.corporateDonor}</td>
                    <td>
                      <span className="manifest-status loaded"> Loaded</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="timeline-section">
          <h4> Real-Time Event Log</h4>
          <div className="timeline-container">
            <AnimatePresence>
              {timeline.map((event, index) => (
                <motion.div
                  key={`${event.timestamp}-${index}`}
                  className="timeline-event"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="timeline-time">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                  <div className="timeline-content">
                    <div className="event-text">{event.event}</div>
                    {event.location && (
                      <div className="event-location"> {event.location}</div>
                    )}
                  </div>
                  {index === 0 && (
                    <div className="timeline-indicator new">NEW</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Contact Carrier Modal */}
      <AnimatePresence>
        {showContactModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContactModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Contact Carrier</h3>
              <div className="contact-options">
                <button className="contact-option">
                   Send Email to {shipment.logisticsPartner}
                </button>
                <button className="contact-option">
                   Call Driver: +1 (555) 123-4567
                </button>
                <button className="contact-option">
                   SMS Update Request
                </button>
                <button className="contact-option">
                   Voice Message
                </button>
              </div>
              <button onClick={() => setShowContactModal(false)} className="close-modal">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowIssueModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Report Issue</h3>
              <div className="issue-form">
                <div className="form-group">
                  <label>Issue Type:</label>
                  <select>
                    <option>Delivery Delay</option>
                    <option>Route Deviation</option>
                    <option>Cargo Issue</option>
                    <option>Communication Problem</option>
                    <option>Weather Related</option>
                    <option>Vehicle Breakdown</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Severity:</label>
                  <select>
                    <option>Low - Information Only</option>
                    <option>Medium - Needs Attention</option>
                    <option>High - Urgent Action Required</option>
                    <option>Critical - Immediate Response</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description:</label>
                  <textarea placeholder="Please describe the issue in detail..."></textarea>
                </div>
                <div className="form-actions">
                  <button className="submit-issue">Submit Issue Report</button>
                  <button onClick={() => setShowIssueModal(false)} className="cancel">
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ShipmentTrackingView;