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

  const getCategoryIcon = (category: string) => {
    // Removed emojis for clean minimalistic look
    return '';
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

  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const selectedQuantity = inventory
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.div
      className="inventory-view"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        height: '100%',
        overflow: 'auto',
        background: '#1e293b'
      }}
    >
      {/* Header Section */}
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h2>Inventory Management: {center.name}</h2>
      </div>

      {/* Summary Dashboard */}
      <div style={{ padding: '2rem' }}>
        <div className="summary-stats" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="stat">
            <span className="label">Total Items:</span>
            <span className="value">{totalQuantity.toLocaleString()}</span>
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

        {/* Controls Section */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '1rem',
            alignItems: 'end'
          }}>
            {/* Search and Filters */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: '1rem',
              alignItems: 'end'
            }}>
              <div className="form-group">
                <label>🔍 Search Items</label>
                <input
                  type="text"
                  placeholder="Search items, categories, or partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryIcon(category)} {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                >
                  <option value="">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>
                      {condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="action-button primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ whiteSpace: 'nowrap' }}
              >
                ➕ Add Item
              </motion.button>
              
              <motion.button
                onClick={() => setShowShipmentModal(true)}
                disabled={selectedItems.length === 0}
                className={`action-button ${selectedItems.length === 0 ? 'secondary' : 'primary'}`}
                whileHover={{ scale: selectedItems.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: selectedItems.length > 0 ? 0.95 : 1 }}
                style={{ 
                  whiteSpace: 'nowrap',
                  opacity: selectedItems.length === 0 ? 0.5 : 1
                }}
              >
                🚛 Ship ({selectedItems.length})
              </motion.button>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #334155',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            <span>
              {filteredAndSortedInventory.length} items found
              {selectedItems.length > 0 && (
                <span style={{ color: '#3b82f6', marginLeft: '1rem' }}>
                  {selectedQuantity.toLocaleString()} units selected
                </span>
              )}
            </span>
            {selectedItems.length > 0 && (
              <button
                onClick={() => setSelectedItems([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3b82f6',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="table-wrapper">
          <table style={{
            width: '100%',
            background: '#0f172a',
            borderCollapse: 'collapse',
            fontSize: '0.875rem'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredAndSortedInventory.length && filteredAndSortedInventory.length > 0}
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
                  style={{ 
                    padding: '1rem 0.75rem', 
                    textAlign: 'left',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontWeight: '600',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Category {sortBy === 'productType' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>Item</th>
                <th 
                  onClick={() => handleSort('quantity')}
                  style={{ 
                    padding: '1rem 0.75rem', 
                    textAlign: 'left',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontWeight: '600',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Quantity {sortBy === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>Corporate Partner</th>
                <th 
                  onClick={() => handleSort('dateReceived')}
                  style={{ 
                    padding: '1rem 0.75rem', 
                    textAlign: 'left',
                    background: '#1e293b',
                    color: '#e2e8f0',
                    fontWeight: '600',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  Date Received {sortBy === 'dateReceived' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>Location</th>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>Condition</th>
                <th style={{ 
                  padding: '1rem 0.75rem', 
                  textAlign: 'left',
                  background: '#1e293b',
                  color: '#e2e8f0',
                  fontWeight: '600'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedInventory.map((item, index) => {
                const warningLevel = getInventoryLevelWarning(item.quantity, item.productType);
                const isSelected = selectedItems.includes(item.id);
                return (
                  <tr 
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #334155',
                      background: isSelected ? '#1e293b' : 'transparent',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <td style={{ padding: '0.75rem', verticalAlign: 'middle' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#e2e8f0',
                      verticalAlign: 'middle'
                    }}>
                      {item.productType}
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#e2e8f0',
                      verticalAlign: 'middle'
                    }}>{item.specificItem}</td>
                    <td style={{ 
                      padding: '0.75rem', 
                      verticalAlign: 'middle'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ 
                          color: '#e2e8f0',
                          fontWeight: '600'
                        }}>
                          {item.quantity.toLocaleString()}
                        </span>
                        <div 
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getWarningColor(warningLevel)
                          }}
                          title={`Inventory level: ${warningLevel}`}
                        />
                      </div>
                    </td>
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#94a3b8',
                      verticalAlign: 'middle'
                    }}>{item.corporatePartner}</td>
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#94a3b8',
                      verticalAlign: 'middle'
                    }}>{new Date(item.dateReceived).toLocaleDateString()}</td>
                    <td style={{ 
                      padding: '0.75rem', 
                      color: '#94a3b8',
                      verticalAlign: 'middle'
                    }}>{item.location}</td>
                    <td style={{ 
                      padding: '0.75rem',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        background: item.condition === 'new' ? '#dcfce7' : 
                                   item.condition === 'good' ? '#fef3c7' : '#fed7d7',
                        color: item.condition === 'new' ? '#16a34a' : 
                               item.condition === 'good' ? '#d97706' : '#dc2626',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '0.75rem',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        color: getWarningColor(warningLevel),
                        fontWeight: '500',
                        fontSize: '0.75rem'
                      }}>
                        {warningLevel === 'critical' && 'Critical'}
                        {warningLevel === 'low' && 'Low'}
                        {warningLevel === 'moderate' && 'Moderate'}
                        {warningLevel === 'good' && 'Good'}
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
              <h3>📦 Add New Inventory Item</h3>
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
                    <label>Category</label>
                    <select name="productType" required>
                      <option value="">Select Category</option>
                      <option value="Water">💧 Water</option>
                      <option value="Food">🍽️ Food</option>
                      <option value="Medical">🏥 Medical</option>
                      <option value="Shelter">⛺ Shelter</option>
                      <option value="Tools">🔧 Tools</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Specific Item</label>
                    <input name="specificItem" type="text" required placeholder="e.g., Emergency Water Bottles" />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input name="quantity" type="number" required min="1" />
                  </div>
                  <div className="form-group">
                    <label>Corporate Partner</label>
                    <input name="corporatePartner" type="text" required placeholder="e.g., Coca-Cola" />
                  </div>
                  <div className="form-group">
                    <label>Storage Location</label>
                    <input name="location" type="text" required placeholder="e.g., Warehouse A" />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
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
              style={{ maxWidth: '600px' }}
            >
              <h3>🚛 Initiate Emergency Shipment</h3>
              
              <div style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{ 
                  color: '#e2e8f0', 
                  fontWeight: '600',
                  marginBottom: '1rem' 
                }}>
                  Selected {selectedItems.length} items for shipment:
                </p>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {inventory
                    .filter(item => selectedItems.includes(item.id))
                    .map(item => (
                      <div 
                        key={item.id} 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.5rem',
                          borderBottom: '1px solid #334155',
                          fontSize: '0.875rem'
                        }}
                      >
                        <div style={{ color: '#e2e8f0' }}>
                          <span style={{ marginRight: '0.5rem' }}>
                            {getCategoryIcon(item.productType)}
                          </span>
                          {item.specificItem}
                        </div>
                        <span style={{ 
                          color: '#3b82f6',
                          fontWeight: '600'
                        }}>
                          {item.quantity.toLocaleString()}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Destination</label>
                  <select required>
                    <option value="">Select Disaster Zone</option>
                    <option value="typhoon-genesis">🌪️ Typhoon Genesis - Philippines</option>
                    <option value="earthquake-turkey">🏔️ Earthquake - Turkey</option>
                    <option value="flood-pakistan">🌊 Flooding - Pakistan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select required>
                    <option value="critical">🔴 Critical - Emergency Response</option>
                    <option value="high">🟡 High - Urgent Need</option>
                    <option value="medium">🟢 Medium - Standard</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Logistics Partner</label>
                  <select required>
                    <option value="fedex">📦 FedEx Logistics</option>
                    <option value="ups">🚛 UPS Supply Chain</option>
                    <option value="dhl">✈️ DHL Express</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button onClick={handleInitiateShipment} className="submit-btn">
                  🚛 Initiate Shipment
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