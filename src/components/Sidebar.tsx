import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disaster, OperationalCenter, Shipment, InventoryItem } from '../types';

interface SidebarProps {
  disasters: Disaster[];
  operationalCenters: OperationalCenter[];
  shipments: Shipment[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFilterChange?: (filters: SidebarFilters) => void;
  onAddDonation?: (donation: Partial<InventoryItem>) => void;
  onManualAllocation?: (request: AllocationRequest) => void;
  liveMetrics?: {
    peopleHelped: number;
    wastePrevented: number;
    costSaved: number;
    disastersResponded: number;
    totalOperations?: number;
  };
}

interface SidebarFilters {
  disasterType: string;
  severities: string[];
  region: string;
  inventoryStatuses: string[];
  searchTerm: string;
}

interface AllocationRequest {
  disaster: string;
  resourceType: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  justification: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  disasters,
  operationalCenters,
  shipments,
  collapsed,
  onToggleCollapse,
  onFilterChange,
  onAddDonation,
  onManualAllocation,
  liveMetrics
}) => {
  const [filters, setFilters] = useState<SidebarFilters>({
    disasterType: 'all',
    severities: ['critical', 'high', 'medium', 'low'],
    region: 'all', 
    inventoryStatuses: ['ample', 'moderate', 'low'],
    searchTerm: ''
  });
  
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [animatedMetrics, setAnimatedMetrics] = useState({
    peopleHelped: 0,
    wastePrevented: 0,
    costSaved: 0,
    disastersResponded: 0,
    totalOperations: 0
  });
  const prevMetricsRef = useRef(animatedMetrics);

  const updateFilters = (newFilters: Partial<SidebarFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  const handleSeverityChange = (severity: string, checked: boolean) => {
    const newSeverities = checked 
      ? [...filters.severities, severity]
      : filters.severities.filter(s => s !== severity);
    updateFilters({ severities: newSeverities });
  };

  const handleInventoryStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.inventoryStatuses, status]
      : filters.inventoryStatuses.filter(s => s !== status);
    updateFilters({ inventoryStatuses: newStatuses });
  };

  // Apply filters to get counts
  const filteredDisasters = disasters.filter(disaster => {
    const typeMatch = filters.disasterType === 'all' || disaster.type === filters.disasterType;
    const severityMatch = filters.severities.includes(disaster.severity);
    const searchMatch = !filters.searchTerm || 
      disaster.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      disaster.location.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return typeMatch && severityMatch && searchMatch;
  });

  const filteredCenters = operationalCenters.filter(center => {
    const statusMatch = filters.inventoryStatuses.includes(center.inventoryStatus);
    const searchMatch = !filters.searchTerm ||
      center.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      center.location.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const totalActiveDisasters = filteredDisasters.length;
  const totalCentersOnline = filteredCenters.length;
  const totalShipmentsInTransit = shipments.filter(s => s.status === 'in_transit' || s.status === 'delayed').length;
  
  // Animated counter component
  const AnimatedCounter: React.FC<{ 
    value: number; 
    duration?: number; 
    formatter?: (num: number) => string;
    className?: string;
  }> = ({ value, duration = 1000, formatter = (n) => n.toLocaleString(), className = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const animationRef = useRef<number | null>(null);
    
    useEffect(() => {
      if (displayValue === value) return;
      
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(displayValue + (value - displayValue) * easeOutCubic);
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          startTimeRef.current = null;
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [value, displayValue, duration]);
    
    return (
      <motion.span 
        className={className}
        key={value} // Force re-render on value change
        initial={{ scale: 1.1, color: '#fff' }}
        animate={{ scale: 1, color: '#fff' }}
        transition={{ duration: 0.3 }}
      >
        {formatter(displayValue)}
      </motion.span>
    );
  };
  
  // Animate metrics when liveMetrics prop changes
  useEffect(() => {
    if (liveMetrics) {
      setAnimatedMetrics({
        peopleHelped: liveMetrics.peopleHelped,
        wastePrevented: liveMetrics.wastePrevented,
        costSaved: liveMetrics.costSaved,
        disastersResponded: liveMetrics.disastersResponded,
        totalOperations: liveMetrics.totalOperations || disasters.length + operationalCenters.length + shipments.length
      });
    }
  }, [liveMetrics, disasters.length, operationalCenters.length, shipments.length]);

  if (collapsed) {
    return (
      <div className="sidebar-collapsed">
        <button onClick={onToggleCollapse} className="collapse-toggle">
          →
        </button>
        <div className="collapsed-stats">
          <motion.div 
            className="stat-icon collapsed-metric"
            title={`${animatedMetrics.peopleHelped.toLocaleString()} people helped`}
            whileHover={{ scale: 1.1 }}
          >
            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </motion.div>
          <motion.div 
            className="stat-icon collapsed-metric"
            title={`${animatedMetrics.wastePrevented.toLocaleString()} tons waste prevented`}
            whileHover={{ scale: 1.1 }}
          >
            <div style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
          </motion.div>
          <motion.div 
            className="stat-icon collapsed-metric"
            title={`$${Math.floor(animatedMetrics.costSaved / 1000000)}M cost saved`}
            whileHover={{ scale: 1.1 }}
          >
            <div style={{ width: '8px', height: '8px', backgroundColor: '#eab308', borderRadius: '50%' }}></div>
          </motion.div>
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
          <div className="stat-icon">
            <div style={{ width: '12px', height: '12px', backgroundColor: '#dc2626', borderRadius: '50%' }}></div>
          </div>
          <div className="stat-content">
            <div className="stat-number disasters-count">
              <AnimatedCounter value={totalActiveDisasters} duration={800} />
            </div>
            <div className="stat-label">Active Disasters</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <AnimatedCounter value={totalCentersOnline} duration={800} />
            </div>
            <div className="stat-label">Centers Online</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
          </div>
          <div className="stat-content">
            <div className="stat-number">
              <AnimatedCounter value={totalShipmentsInTransit} duration={800} />
            </div>
            <div className="stat-label">Shipments En Route</div>
          </div>
        </div>
      </div>
      
      {/* Live Impact Metrics */}
      <div className="impact-metrics-section">
        <h4>🎯 Live Impact Metrics</h4>
        <div className="impact-grid">
          <motion.div 
            className="impact-card people-helped"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="impact-icon">👥</div>
            <div className="impact-content">
              <div className="impact-number">
                <AnimatedCounter 
                  value={animatedMetrics.peopleHelped} 
                  formatter={(n) => n.toLocaleString()}
                  className="impact-value"
                  duration={1200}
                />
              </div>
              <div className="impact-label">People Helped</div>
              <div className="impact-trend">↗ +{Math.floor(Math.random() * 2000) + 500}/hr</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="impact-card waste-prevented"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="impact-icon">
              <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
            </div>
            <div className="impact-content">
              <div className="impact-number">
                <AnimatedCounter 
                  value={animatedMetrics.wastePrevented} 
                  formatter={(n) => n.toLocaleString()}
                  className="impact-value"
                  duration={1200}
                />
              </div>
              <div className="impact-label">Tons Waste Prevented</div>
              <div className="impact-trend">↗ +{Math.floor(Math.random() * 100) + 50}/hr</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="impact-card cost-saved"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="impact-icon">
              <div style={{ width: '10px', height: '10px', backgroundColor: '#eab308', borderRadius: '2px' }}></div>
            </div>
            <div className="impact-content">
              <div className="impact-number">
                <AnimatedCounter 
                  value={animatedMetrics.costSaved} 
                  formatter={(n) => `$${Math.floor(n / 1000000)}M`}
                  className="impact-value"
                  duration={1200}
                />
              </div>
              <div className="impact-label">Cost Saved</div>
              <div className="impact-trend">↗ +${Math.floor(Math.random() * 50) + 25}K/hr</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="impact-card operations"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="impact-icon">
              <div style={{ width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
            </div>
            <div className="impact-content">
              <div className="impact-number">
                <AnimatedCounter 
                  value={animatedMetrics.totalOperations} 
                  formatter={(n) => n.toLocaleString()}
                  className="impact-value"
                  duration={1000}
                />
              </div>
              <div className="impact-label">Active Operations</div>
              <div className="impact-trend">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                  All Systems Operational
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="efficiency-indicator">
          <div className="efficiency-label">System Efficiency</div>
          <div className="efficiency-bar">
            <motion.div 
              className="efficiency-fill"
              initial={{ width: '0%' }}
              animate={{ width: '87%' }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
          <div className="efficiency-value">87% - Excellent Performance</div>
        </div>
      </div>

      <div className="search-section">
        <h4> Search & Filter</h4>
        <input
          type="text"
          placeholder="Search disasters, centers, locations..."
          value={filters.searchTerm}
          onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          className="search-input"
        />
        {filters.searchTerm && (
          <button 
            onClick={() => updateFilters({ searchTerm: '' })}
            className="clear-search"
          >
            ✕ Clear
          </button>
        )}
      </div>

      <div className="filter-summary">
        <div className="filter-results">
          <span className="filter-count">{totalActiveDisasters}</span> disasters,{' '}
          <span className="filter-count">{totalCentersOnline}</span> centers shown
        </div>
      </div>

      <div className="filters-section">
        <h4>Filters</h4>
        
        <div className="filter-group">
          <label>Disaster Type</label>
          <select 
            value={filters.disasterType} 
            onChange={(e) => updateFilters({ disasterType: e.target.value })}
          >
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
            {['critical', 'high', 'medium', 'low'].map(severity => (
              <label key={severity} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.severities.includes(severity)}
                  onChange={(e) => handleSeverityChange(severity, e.target.checked)}
                />
                <span className={`severity-indicator ${severity}`}></span>
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Region</label>
          <select 
            value={filters.region}
            onChange={(e) => updateFilters({ region: e.target.value })}
          >
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
            {['ample', 'moderate', 'low'].map(status => (
              <label key={status} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={filters.inventoryStatuses.includes(status)}
                  onChange={(e) => handleInventoryStatusChange(status, e.target.checked)}
                />
                <span className={`status-indicator ${status}`}></span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {(filters.disasterType !== 'all' || filters.searchTerm || 
          filters.severities.length !== 4 || filters.inventoryStatuses.length !== 3) && (
          <button 
            onClick={() => setFilters({
              disasterType: 'all',
              severities: ['critical', 'high', 'medium', 'low'],
              region: 'all',
              inventoryStatuses: ['ample', 'moderate', 'low'],
              searchTerm: ''
            })}
            className="reset-filters"
          >
             Reset All Filters
          </button>
        )}
      </div>

      <div className="quick-actions">
        <h4>Quick Actions</h4>
        <motion.button 
          className="action-button primary"
          onClick={() => setShowDonationModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
           Add New Corporate Donation
        </motion.button>
        <motion.button 
          className="action-button secondary"
          onClick={() => setShowAllocationModal(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
           Manual Allocation Request
        </motion.button>
        <motion.button 
          className="action-button tertiary"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
           Generate Impact Report
        </motion.button>
      </div>

      {/* Corporate Donation Modal */}
      <AnimatePresence>
        {showDonationModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDonationModal(false)}
          >
            <motion.div
              className="modal-content donation-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Add New Corporate Donation</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const donation: Partial<InventoryItem> = {
                  productType: formData.get('category') as string,
                  specificItem: formData.get('item') as string,
                  quantity: Number(formData.get('quantity')),
                  corporatePartner: formData.get('partner') as string,
                  condition: 'new',
                  location: 'Incoming'
                };
                onAddDonation?.(donation);
                setShowDonationModal(false);
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Corporate Partner:</label>
                    <input name="partner" type="text" required placeholder="e.g., Microsoft" />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select name="category" required>
                      <option value="">Select Category</option>
                      <option value="Water">Water & Hydration</option>
                      <option value="Food">Food & Nutrition</option>
                      <option value="Medical">Medical Supplies</option>
                      <option value="Shelter">Shelter & Housing</option>
                      <option value="Tools">Tools & Equipment</option>
                      <option value="Technology">Technology</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Specific Item:</label>
                    <input name="item" type="text" required placeholder="e.g., Emergency Laptops" />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input name="quantity" type="number" required min="1" />
                  </div>
                  <div className="form-group full-width">
                    <label>Additional Notes:</label>
                    <textarea name="notes" placeholder="Special handling instructions, expiry dates, etc."></textarea>
                  </div>
                </div>
                <div className="donation-summary">
                  <div className="estimated-impact">
                    <h4> Estimated Impact</h4>
                    <div className="impact-stats">
                      <div className="impact-stat">
                        <span className="impact-number">~5,000</span>
                        <span className="impact-label">People Helped</span>
                      </div>
                      <div className="impact-stat">
                        <span className="impact-number">$25,000</span>
                        <span className="impact-label">Value Added</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn"> Submit Donation</button>
                  <button type="button" onClick={() => setShowDonationModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Allocation Modal */}
      <AnimatePresence>
        {showAllocationModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllocationModal(false)}
          >
            <motion.div
              className="modal-content allocation-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Manual Resource Allocation Request</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const request: AllocationRequest = {
                  disaster: formData.get('disaster') as string,
                  resourceType: formData.get('resourceType') as string,
                  quantity: Number(formData.get('quantity')),
                  priority: formData.get('priority') as 'low' | 'medium' | 'high' | 'critical',
                  justification: formData.get('justification') as string
                };
                onManualAllocation?.(request);
                setShowAllocationModal(false);
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Target Disaster:</label>
                    <select name="disaster" required>
                      <option value="">Select Disaster</option>
                      {disasters.map(disaster => (
                        <option key={disaster.id} value={disaster.id}>
                          {disaster.name} - {disaster.location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Resource Type:</label>
                    <select name="resourceType" required>
                      <option value="">Select Resource</option>
                      <option value="Water">Water Supplies</option>
                      <option value="Food">Food Supplies</option>
                      <option value="Medical">Medical Supplies</option>
                      <option value="Shelter">Shelter Materials</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Personnel">Personnel</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity Requested:</label>
                    <input name="quantity" type="number" required min="1" />
                  </div>
                  <div className="form-group">
                    <label>Priority Level:</label>
                    <select name="priority" required>
                      <option value="critical"> Critical - Life Threatening</option>
                      <option value="high"> High - Urgent Need</option>
                      <option value="medium"> Medium - Important</option>
                      <option value="low"> Low - Standard</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Justification:</label>
                    <textarea 
                      name="justification" 
                      required 
                      placeholder="Explain why this manual allocation is necessary and what impact it will have..."
                    ></textarea>
                  </div>
                </div>
                <div className="allocation-warning">
                   This request will bypass automated Agentforce matching and require manual approval from operations center.
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn"> Submit Request</button>
                  <button type="button" onClick={() => setShowAllocationModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Sidebar;