import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertRecommendation } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onAlertClick?: (alert: Alert) => void;
  onAlertAction?: (alertId: string, actionType: string) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  collapsed,
  onToggleCollapse,
  onAlertClick,
  onAlertAction
}) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const urgentAlerts = alerts.filter(alert => alert.type === 'urgent');
  const infoAlerts = alerts.filter(alert => alert.type === 'info');
  
  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    if (alert.recommendations && alert.recommendations.length > 0) {
      setShowRecommendations(true);
    }
    onAlertClick?.(alert);
  };
  
  const handleAlertAction = (actionType: string) => {
    if (selectedAlert) {
      onAlertAction?.(selectedAlert.id, actionType);
      setShowRecommendations(false);
      setSelectedAlert(null);
    }
  };
  
  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'resolved': return '✅';
      case 'awaiting_resolution': return '⏳';
      case 'active': 
      default: return '🔥';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (collapsed) {
    return (
      <div className="alerts-panel-collapsed">
        <button onClick={onToggleCollapse} className="collapse-toggle">
          ←
        </button>
        <div className="collapsed-alerts">
          <div className="alert-count urgent">{urgentAlerts.length}</div>
          <div className="alert-count info">{infoAlerts.length}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="alerts-panel-expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="alerts-header">
        <h3>Alerts & Notifications</h3>
        <button onClick={onToggleCollapse} className="collapse-toggle">
          →
        </button>
      </div>

      <div className="alerts-content">
        {urgentAlerts.length > 0 && (
          <div className="alert-section urgent">
            <h4>
              <span className="alert-icon">🚨</span>
              Urgent Alerts ({urgentAlerts.length})
            </h4>
            {urgentAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                className={`alert-item urgent ${alert.status || 'active'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleAlertClick(alert)}
                style={{ cursor: 'pointer' }}
              >
                <div className="alert-status-icon">
                  {getStatusIcon(alert.status)}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-meta">
                    <span className="alert-time">{getTimeAgo(alert.timestamp)}</span>
                    {alert.relatedType && (
                      <span className="alert-type">#{alert.relatedType}</span>
                    )}
                  </div>
                </div>
                <div className="alert-actions">
                  <button className="alert-action-btn">
                    {alert.recommendations ? '🎯 Action' : 'View'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {infoAlerts.length > 0 && (
          <div className="alert-section info">
            <h4>
              <span className="alert-icon">ℹ️</span>
              Information ({infoAlerts.length})
            </h4>
            {infoAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                className={`alert-item info ${alert.status || 'active'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={() => handleAlertClick(alert)}
                style={{ cursor: 'pointer' }}
              >
                <div className="alert-status-icon">
                  {getStatusIcon(alert.status)}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-meta">
                    <span className="alert-time">{getTimeAgo(alert.timestamp)}</span>
                    {alert.relatedType && (
                      <span className="alert-type">#{alert.relatedType}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {urgentAlerts.length === 0 && infoAlerts.length === 0 && (
          <div className="no-alerts">
            <div className="no-alerts-icon">✅</div>
            <div className="no-alerts-message">All clear - no alerts at this time</div>
          </div>
        )}
      </div>

      <div className="alerts-footer">
        <button className="clear-all-btn">Clear All Notifications</button>
      </div>

      {/* Human-in-the-Loop Recommendations Modal */}
      <AnimatePresence>
        {showRecommendations && selectedAlert && selectedAlert.recommendations && (
          <motion.div
            className="recommendations-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRecommendations(false)}
          >
            <motion.div
              className="recommendations-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>🤖 Human-in-the-Loop Agent</h3>
                <p className="alert-context">{selectedAlert.message}</p>
              </div>

              <div className="recommendations-content">
                {selectedAlert.recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="recommendation-card">
                    <div className="recommendation-header">
                      <h4>{recommendation.title}</h4>
                      <div className="impact-metrics">
                        {recommendation.costImpact && (
                          <span className={`impact-badge ${recommendation.costImpact.includes('+') ? 'negative' : 'positive'}`}>
                            💰 {recommendation.costImpact}
                          </span>
                        )}
                        {recommendation.timeImpact && (
                          <span className={`impact-badge ${recommendation.timeImpact.includes('+') ? 'negative' : 'positive'}`}>
                            ⏱️ {recommendation.timeImpact}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="recommendation-description">
                      {recommendation.description}
                    </p>
                    
                    <div className="recommendation-actions">
                      {recommendation.actions.map((action) => (
                        <motion.button
                          key={action.id}
                          onClick={() => handleAlertAction(action.type)}
                          className={`recommendation-btn ${action.primary ? 'primary' : 'secondary'}`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {action.type === 'approve' && '✅ Approve Recommended Action'}
                          {action.type === 'view_route' && '🗺️ View Alternative Route on Map'}
                          {action.type === 'contact' && '📞 Contact Carrier'}
                          {action.type === 'report_issue' && '⚠️ Report Issue'}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-footer">
                <button 
                  onClick={() => setShowRecommendations(false)}
                  className="close-modal-btn"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AlertsPanel;