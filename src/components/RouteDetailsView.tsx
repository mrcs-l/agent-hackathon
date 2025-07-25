import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route } from '../types';

interface RouteDetailsViewProps {
  route: Route;
  onBack: () => void;
  onConfirmRoute?: (routeId: string) => void;
  onModifyRoute?: (routeId: string) => void;
}

const RouteDetailsView: React.FC<RouteDetailsViewProps> = ({
  route,
  onBack,
  onConfirmRoute,
  onModifyRoute
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const getStatusIcon = (confirmed: boolean) => {
    return confirmed ? '✅' : '⏳';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#eab308';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    const type = resourceType.toLowerCase();
    if (type.includes('water')) return '💧';
    if (type.includes('medical') || type.includes('kit')) return '🏥';
    if (type.includes('food') || type.includes('ration')) return '🍽️';
    if (type.includes('tent') || type.includes('shelter')) return '⛺';
    if (type.includes('emergency')) return '🚨';
    return '📦';
  };

  const handleConfirmRoute = () => {
    onConfirmRoute?.(route.id);
    setShowConfirmModal(false);
  };

  const totalQuantity = route.resources.reduce((sum, resource) => sum + resource.quantity, 0);
  const totalValue = totalQuantity * 25; // Estimate $25 per unit
  const estimatedDistance = Math.round(Math.random() * 2000 + 500);

  return (
    <motion.div
      className="route-details-view"
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
        <h2>🛣️ Route Details: {route.id}</h2>
      </div>

      <div style={{ padding: '2rem' }}>
        {/* Route Status Banner */}
        <div style={{
          background: route.confirmed ? '#065f46' : '#7c2d12',
          border: `1px solid ${route.confirmed ? '#059669' : '#ea580c'}`,
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{getStatusIcon(route.confirmed)}</span>
            <div>
              <div style={{
                color: '#e2e8f0',
                fontWeight: '600',
                fontSize: '1.125rem',
                marginBottom: '0.25rem'
              }}>
                {route.confirmed ? 'Route Confirmed & Active' : 'Awaiting Approval'}
              </div>
              <div style={{ 
                color: route.confirmed ? '#a7f3d0' : '#fed7aa',
                fontSize: '0.875rem'
              }}>
                {route.confirmed ? 'Shipment is being tracked' : 'Route requires approval to proceed'}
              </div>
            </div>
          </div>
          <div style={{
            background: getPriorityColor(route.priority),
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {route.priority} Priority
          </div>
        </div>

        {/* Route Overview Section */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#e2e8f0',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📍 Route Overview
          </h3>

          {/* Route Path Visualization */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: '#1e293b',
            borderRadius: '8px',
            border: '1px solid #334155'
          }}>
            {/* Origin */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#3b82f6',
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem auto'
              }}>
                🏭
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                Origin
              </div>
              <div style={{
                color: '#e2e8f0',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                {route.origin.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                {route.origin.lat.toFixed(4)}, {route.origin.lng.toFixed(4)}
              </div>
            </div>

            {/* Route Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '120px'
            }}>
              <div style={{
                color: '#3b82f6',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}>
                →
              </div>
              <div style={{
                textAlign: 'center',
                padding: '0.5rem',
                background: '#0f172a',
                borderRadius: '6px',
                border: '1px solid #334155',
                minWidth: '100px'
              }}>
                <div style={{
                  color: '#3b82f6',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {route.estimatedDuration}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8'
                }}>
                  ~{estimatedDistance} miles
                </div>
              </div>
            </div>

            {/* Destination */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: '#dc2626',
                borderRadius: '50%',
                width: '3rem',
                height: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem auto'
              }}>
                🎯
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>
                Destination
              </div>
              <div style={{
                color: '#e2e8f0',
                fontWeight: '600',
                marginBottom: '0.25rem'
              }}>
                {route.destination.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                {route.destination.lat.toFixed(4)}, {route.destination.lng.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Route Summary Stats */}
          <div className="summary-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <div className="stat">
              <span className="label">Total Items:</span>
              <span className="value">{totalQuantity.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="label">Estimated Value:</span>
              <span className="value">${totalValue.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="label">Resource Types:</span>
              <span className="value">{route.resources.length}</span>
            </div>
          </div>
        </div>

        {/* Resource Manifest Section */}
        <div style={{
          background: '#0f172a',
          border: '1px solid #334155',
          borderRadius: '8px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#e2e8f0',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📦 Resource Manifest
          </h3>

          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {route.resources.map((resource, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto auto',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem',
                background: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #334155'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  width: '3rem',
                  textAlign: 'center'
                }}>
                  {getResourceIcon(resource.type)}
                </div>
                <div>
                  <div style={{
                    color: '#e2e8f0',
                    fontWeight: '600',
                    marginBottom: '0.25rem'
                  }}>
                    {resource.type}
                  </div>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.875rem'
                  }}>
                    {resource.quantity.toLocaleString()} {resource.unit}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '1.125rem'
                  }}>
                    ${(resource.quantity * 25).toLocaleString()}
                  </div>
                  <div style={{
                    color: '#94a3b8',
                    fontSize: '0.75rem'
                  }}>
                    Est. Value
                  </div>
                </div>
                <div style={{
                  background: '#065f46',
                  color: '#a7f3d0',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  Ready
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Section */}
        {route.aiConfidence && (
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🤖 Agentforce Analysis
            </h3>

            {/* AI Confidence Bar */}
            <div style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '6px',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>AI Confidence</span>
                <span style={{ color: '#e2e8f0', fontWeight: '600' }}>{route.aiConfidence}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#374151',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${route.aiConfidence}%`,
                  height: '100%',
                  background: route.aiConfidence >= 90 ? '#10b981' : 
                            route.aiConfidence >= 70 ? '#eab308' : '#dc2626',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem'
            }}>
              {/* Advantages */}
              {route.advantages && (
                <div>
                  <h4 style={{
                    color: '#10b981',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ✅ Advantages
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {route.advantages.map((advantage, index) => (
                      <li key={index} style={{
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#10b981', flexShrink: 0 }}>•</span>
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risk Factors */}
              {route.risks && (
                <div>
                  <h4 style={{
                    color: '#f59e0b',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ⚠️ Risk Factors
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}>
                    {route.risks.map((risk, index) => (
                      <li key={index} style={{
                        color: '#cbd5e1',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem'
                      }}>
                        <span style={{ color: '#f59e0b', flexShrink: 0 }}>•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Cost Estimate */}
            {route.costEstimate && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: '#1e293b',
                borderRadius: '6px',
                border: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Estimated Cost:</span>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '1.125rem',
                  fontWeight: '600'
                }}>
                  {route.costEstimate}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {!route.confirmed && (
            <motion.button
              className="action-button primary"
              onClick={() => setShowConfirmModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ flex: '1', minWidth: '200px' }}
            >
              ✅ Confirm Route
            </motion.button>
          )}
          
          <motion.button
            className="action-button secondary"
            onClick={() => setShowAlternatives(!showAlternatives)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 View Alternatives
          </motion.button>
          
          <motion.button
            className="action-button secondary"
            onClick={() => onModifyRoute?.(route.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✏️ Modify Route
          </motion.button>
          
          <motion.button
            className="action-button secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📞 Contact Partner
          </motion.button>
        </div>

        {/* Alternative Routes Section */}
        <AnimatePresence>
          {showAlternatives && route.alternativeRoutes && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}
            >
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🔄 Alternative Route Options
              </h3>
              <div style={{
                display: 'grid',
                gap: '1rem'
              }}>
                {route.alternativeRoutes.map(alt => (
                  <div key={alt.id} style={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '1rem',
                      alignItems: 'start'
                    }}>
                      <div>
                        <div style={{
                          color: '#e2e8f0',
                          fontWeight: '600',
                          marginBottom: '0.75rem'
                        }}>
                          {alt.description}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: alt.costImpact.includes('+') ? '#7f1d1d' : '#065f46',
                            color: alt.costImpact.includes('+') ? '#fca5a5' : '#a7f3d0',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {alt.costImpact}
                          </span>
                          <span style={{
                            background: alt.timeImpact.includes('+') ? '#7f1d1d' : '#065f46',
                            color: alt.timeImpact.includes('+') ? '#fca5a5' : '#a7f3d0',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {alt.timeImpact}
                          </span>
                          <span style={{
                            background: alt.riskLevel === 'high' ? '#7f1d1d' : 
                                       alt.riskLevel === 'medium' ? '#78350f' : '#065f46',
                            color: alt.riskLevel === 'high' ? '#fca5a5' : 
                                   alt.riskLevel === 'medium' ? '#fbbf24' : '#a7f3d0',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {alt.riskLevel.toUpperCase()} Risk
                          </span>
                        </div>
                      </div>
                      <motion.button
                        className="action-button primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        Select Route
                      </motion.button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '500px' }}
            >
              <h3>✅ Confirm Route Activation</h3>
              <p style={{
                color: '#cbd5e1',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Are you sure you want to confirm this route? This will authorize the following actions:
              </p>
              
              <div style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <li style={{
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ color: '#10b981' }}>✅</span>
                    Authorize shipment departure
                  </li>
                  <li style={{
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ color: '#f59e0b' }}>💰</span>
                    Commit estimated budget of {route.costEstimate || '$125,000'}
                  </li>
                  <li style={{
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ color: '#3b82f6' }}>🚛</span>
                    Begin resource transportation
                  </li>
                  <li style={{
                    color: '#cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <span style={{ color: '#8b5cf6' }}>📊</span>
                    Update inventory allocations
                  </li>
                </ul>
              </div>
              
              <div className="form-actions">
                <button 
                  className="submit-btn"
                  onClick={handleConfirmRoute}
                >
                  ✅ Confirm Route
                </button>
                <button 
                  className="cancel-btn"
                  onClick={() => setShowConfirmModal(false)}
                >
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

export default RouteDetailsView; 