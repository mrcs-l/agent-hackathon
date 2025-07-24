import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Disaster, OperationalCenter, Shipment } from '../types';

interface SidebarProps {
  disasters: Disaster[];
  operationalCenters: OperationalCenter[];
  shipments: Shipment[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  disasters,
  operationalCenters,
  shipments,
  collapsed,
  onToggleCollapse
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const totalActiveDisasters = disasters.length;
  const totalCentersOnline = operationalCenters.length;
  const totalShipmentsInTransit = shipments.filter(s => s.status === 'in_transit' || s.status === 'delayed').length;

  if (collapsed) {
    return (
      <div className="sidebar-collapsed">
        <button onClick={onToggleCollapse} className="collapse-toggle">
          →
        </button>
        <div className="collapsed-stats">
          <div className="stat-icon">🌍</div>
          <div className="stat-icon">🏪</div>
          <div className="stat-icon">🚛</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="sidebar-expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="sidebar-header">
        <h3>Global Overview</h3>
        <button onClick={onToggleCollapse} className="collapse-toggle">
          ←
        </button>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">🌍</div>
          <div className="stat-content">
            <div className="stat-number">{totalActiveDisasters}</div>
            <div className="stat-label">Active Disasters</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <div className="stat-number">{totalCentersOnline}</div>
            <div className="stat-label">Centers Online</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div className="stat-content">
            <div className="stat-number">{totalShipmentsInTransit}</div>
            <div className="stat-label">Shipments En Route</div>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <h4>Filters</h4>
        
        <div className="filter-group">
          <label>Disaster Type</label>
          <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="hurricane">Hurricane</option>
            <option value="earthquake">Earthquake</option>
            <option value="flood">Flood</option>
            <option value="wildfire">Wildfire</option>
            <option value="tornado">Tornado</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Severity</label>
          <div className="severity-filters">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="severity-indicator critical"></span>
              Critical
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="severity-indicator high"></span>
              High
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="severity-indicator medium"></span>
              Medium
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="severity-indicator low"></span>
              Low
            </label>
          </div>
        </div>

        <div className="filter-group">
          <label>Region</label>
          <select>
            <option value="all">All Regions</option>
            <option value="north-america">North America</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="oceania">Oceania</option>
            <option value="south-america">South America</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Inventory Status</label>
          <div className="status-filters">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="status-indicator ample"></span>
              Ample
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="status-indicator moderate"></span>
              Moderate
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="status-indicator low"></span>
              Low
            </label>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <button className="action-button primary">
          + Add New Corporate Donation
        </button>
        <button className="action-button secondary">
          📋 Manual Allocation Request
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;