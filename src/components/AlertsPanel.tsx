import React from 'react';
import { motion } from 'framer-motion';
import { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  collapsed,
  onToggleCollapse
}) => {
  const urgentAlerts = alerts.filter(alert => alert.type === 'urgent');
  const infoAlerts = alerts.filter(alert => alert.type === 'info');

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
                className="alert-item urgent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{getTimeAgo(alert.timestamp)}</div>
                </div>
                <div className="alert-actions">
                  <button className="alert-action-btn">View</button>
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
                className="alert-item info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">{getTimeAgo(alert.timestamp)}</div>
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
    </motion.div>
  );
};

export default AlertsPanel;