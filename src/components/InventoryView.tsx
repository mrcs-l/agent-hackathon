import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OperationalCenter, InventoryItem } from '../types';

interface InventoryViewProps {
  center: OperationalCenter;
  onBack: () => void;
  onAddInventory: (centerID: string, item: Partial<InventoryItem>) => void;
  onInitiateShipment: (centerID: string, items: InventoryItem[]) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({
  center,
  onBack,
  onAddInventory,
  onInitiateShipment
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(center.inventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [sortBy, setSortBy] = useState<'productType' | 'quantity' | 'dateReceived'>('productType');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Generate additional mock inventory for comprehensive view
  useEffect(() => {
    const additionalInventory: InventoryItem[] = [
      {
        id: `${center.id}-extra-1`,
        productType: 'Medical',
        specificItem: 'Surgical Masks',
        quantity: 25000,
        corporatePartner: 'Johnson & Johnson',
        dateReceived: '2024-07-20',
        location: 'Medical Bay A',
        condition: 'new'
      },
      {
        id: `${center.id}-extra-2`,
        productType: 'Food',
        specificItem: 'Protein Bars',
        quantity: 15000,
        corporatePartner: 'General Mills',
        dateReceived: '2024-07-18',
        location: 'Food Storage B',
        condition: 'new'
      },
      {
        id: `${center.id}-extra-3`,
        productType: 'Water',
        specificItem: 'Water Purification Tablets',
        quantity: 5000,
        corporatePartner: 'Coca-Cola',
        dateReceived: '2024-07-15',
        location: 'Chemical Storage',
        condition: 'good'
      },
      {
        id: `${center.id}-extra-4`,
        productType: 'Shelter',
        specificItem: 'Emergency Blankets',
        quantity: 8000,
        corporatePartner: 'Red Cross',
        dateReceived: '2024-07-12',
        location: 'Textile Storage',
        condition: 'new'
      },
      {
        id: `${center.id}-extra-5`,
        productType: 'Tools',
        specificItem: 'Emergency Flashlights',
        quantity: 2000,
        corporatePartner: 'Home Depot',
        dateReceived: '2024-07-10',
        location: 'Equipment Bay',
        condition: 'new'
      }
    ];

    setInventory([...center.inventory, ...additionalInventory]);
  }, [center]);

  const filteredAndSortedInventory = inventory
    .filter(item => {
      const matchesSearch = item.specificItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.corporatePartner.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || item.productType === filterCategory;
      const matchesCondition = !filterCondition || item.condition === filterCondition;
      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortBy === 'dateReceived') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const categories = Array.from(new Set(inventory.map(item => item.productType)));
  const conditions = Array.from(new Set(inventory.map(item => item.condition)));

  const getInventoryLevelWarning = (quantity: number, productType: string) => {
    // Define warning thresholds
    const thresholds: { [key: string]: number } = {
      'Water': 10000,
      'Food': 8000,
      'Medical': 5000,
      'Shelter': 3000,
      'Tools': 1000
    };
    
    const threshold = thresholds[productType] || 2000;
    
    if (quantity < threshold * 0.2) return 'critical';
    if (quantity < threshold * 0.4) return 'low'; 
    if (quantity < threshold * 0.7) return 'moderate';
    return 'good';
  };

  const getWarningColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'low': return '#ea580c';
      case 'moderate': return '#eab308';
      case 'good': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddInventory = (newItem: Partial<InventoryItem>) => {
    const fullItem: InventoryItem = {
      id: `${center.id}-new-${Date.now()}`,
      productType: newItem.productType || '',
      specificItem: newItem.specificItem || '',
      quantity: newItem.quantity || 0,
      corporatePartner: newItem.corporatePartner || '',
      dateReceived: new Date().toISOString().split('T')[0],
      location: newItem.location || 'Main Storage',
      condition: newItem.condition || 'new'
    };
    
    setInventory(prev => [...prev, fullItem]);
    onAddInventory(center.id, fullItem);
    setShowAddModal(false);
  };

  const handleInitiateShipment = () => {
    const selectedInventoryItems = inventory.filter(item => selectedItems.includes(item.id));
    onInitiateShipment(center.id, selectedInventoryItems);
    setSelectedItems([]);
    setShowShipmentModal(false);
  };

  return (
    <motion.div
      className="inventory-view"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h2> Inventory Management: {center.name}</h2>
      </div>

      <div className="inventory-summary">
        <div className="summary-stats">
          <div className="stat">
            <span className="label">Total Items:</span>
            <span className="value">{inventory.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Categories:</span>
            <span className="value">{categories.length}</span>
          </div>
          <div className="stat">
            <span className="label">Inventory Value:</span>
            <span className="value">${center.inventoryValue.toLocaleString()}</span>
          </div>
          <div className="stat">
            <span className="label">Status:</span>
            <span className={`value status-${center.inventoryStatus}`}>
              {center.inventoryStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="inventory-controls">
        <div className="search-filter-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder=" Search items, categories, or partners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filters">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
              className="filter-select"
            >
              <option value="">All Conditions</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <motion.button
            onClick={() => setShowAddModal(true)}
            className="action-btn add-inventory"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
             Add New Inventory
          </motion.button>
          
          <motion.button
            onClick={() => setShowShipmentModal(true)}
            disabled={selectedItems.length === 0}
            className={`action-btn initiate-shipment ${selectedItems.length === 0 ? 'disabled' : ''}`}
            whileHover={{ scale: selectedItems.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: selectedItems.length > 0 ? 0.95 : 1 }}
          >
             Initiate Shipment ({selectedItems.length})
          </motion.button>
        </div>
      </div>

      <div className="inventory-table-container">
        <div className="table-controls">
          <span className="results-count">
            {filteredAndSortedInventory.length} items found
          </span>
          {selectedItems.length > 0 && (
            <button
              onClick={() => setSelectedItems([])}
              className="clear-selection"
            >
              Clear Selection
            </button>
          )}
        </div>

        <div className="table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredAndSortedInventory.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredAndSortedInventory.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                  />
                </th>
                <th 
                  onClick={() => handleSort('productType')}
                  className="sortable"
                >
                  Category {sortBy === 'productType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Item</th>
                <th 
                  onClick={() => handleSort('quantity')}
                  className="sortable"
                >
                  Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Corporate Partner</th>
                <th 
                  onClick={() => handleSort('dateReceived')}
                  className="sortable"
                >
                  Date Received {sortBy === 'dateReceived' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th>Location</th>
                <th>Condition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInventory.map((item) => {
                const warningLevel = getInventoryLevelWarning(item.quantity, item.productType);
                return (
                  <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </td>
                    <td>{item.productType}</td>
                    <td>{item.specificItem}</td>
                    <td>
                      <div className="quantity-cell">
                        <span className="quantity-value">{item.quantity.toLocaleString()}</span>
                        <div 
                          className={`warning-indicator ${warningLevel}`}
                          style={{ backgroundColor: getWarningColor(warningLevel) }}
                          title={`Inventory level: ${warningLevel}`}
                        ></div>
                      </div>
                    </td>
                    <td>{item.corporatePartner}</td>
                    <td>{new Date(item.dateReceived).toLocaleDateString()}</td>
                    <td>{item.location}</td>
                    <td>
                      <span className={`condition-badge condition-${item.condition}`}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span 
                        className={`status-indicator ${warningLevel}`}
                        style={{ color: getWarningColor(warningLevel) }}
                      >
                        {warningLevel === 'critical' && ' Critical'}
                        {warningLevel === 'low' && ' Low'}
                        {warningLevel === 'moderate' && ' Moderate'}
                        {warningLevel === 'good' && ' Good'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Inventory Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Add New Inventory Item</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddInventory({
                  productType: formData.get('productType') as string,
                  specificItem: formData.get('specificItem') as string,
                  quantity: Number(formData.get('quantity')),
                  corporatePartner: formData.get('corporatePartner') as string,
                  location: formData.get('location') as string,
                  condition: formData.get('condition') as 'new' | 'good' | 'fair'
                });
              }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Category:</label>
                    <select name="productType" required>
                      <option value="">Select Category</option>
                      <option value="Water">Water</option>
                      <option value="Food">Food</option>
                      <option value="Medical">Medical</option>
                      <option value="Shelter">Shelter</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Specific Item:</label>
                    <input name="specificItem" type="text" required placeholder="e.g., Emergency Water Bottles" />
                  </div>
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input name="quantity" type="number" required min="1" />
                  </div>
                  <div className="form-group">
                    <label>Corporate Partner:</label>
                    <input name="corporatePartner" type="text" required placeholder="e.g., Coca-Cola" />
                  </div>
                  <div className="form-group">
                    <label>Storage Location:</label>
                    <input name="location" type="text" required placeholder="e.g., Warehouse A" />
                  </div>
                  <div className="form-group">
                    <label>Condition:</label>
                    <select name="condition" required>
                      <option value="new">New</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-btn">Add Item</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initiate Shipment Modal */}
      <AnimatePresence>
        {showShipmentModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShipmentModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <h3> Initiate Emergency Shipment</h3>
              <div className="shipment-summary">
                <p>Selected {selectedItems.length} items for shipment:</p>
                <div className="selected-items">
                  {inventory
                    .filter(item => selectedItems.includes(item.id))
                    .map(item => (
                      <div key={item.id} className="selected-item">
                        <span>{item.specificItem}</span>
                        <span className="quantity">{item.quantity.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="shipment-form">
                <div className="form-group">
                  <label>Destination:</label>
                  <select required>
                    <option value="">Select Disaster Zone</option>
                    <option value="typhoon-genesis">Typhoon Genesis - Philippines</option>
                    <option value="earthquake-turkey">Earthquake - Turkey</option>
                    <option value="flood-pakistan">Flooding - Pakistan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority:</label>
                  <select required>
                    <option value="critical">Critical - Emergency Response</option>
                    <option value="high">High - Urgent Need</option>
                    <option value="medium">Medium - Standard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Logistics Partner:</label>
                  <select required>
                    <option value="fedex">FedEx Logistics</option>
                    <option value="ups">UPS Supply Chain</option>
                    <option value="dhl">DHL Express</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button onClick={handleInitiateShipment} className="submit-btn">
                   Initiate Shipment
                </button>
                <button onClick={() => setShowShipmentModal(false)} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InventoryView;