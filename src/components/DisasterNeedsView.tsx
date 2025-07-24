import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Disaster, Need } from '../types';

interface DisasterNeedsViewProps {
  disaster: Disaster;
  onBack: () => void;
  onViewActiveShipments: () => void;
}

const DisasterNeedsView: React.FC<DisasterNeedsViewProps> = ({
  disaster,
  onBack,
  onViewActiveShipments
}) => {
  const [needs, setNeeds] = useState<Need[]>(disaster.needs);
  const [isMatching, setIsMatching] = useState(false);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [showMatchingAnimation, setShowMatchingAnimation] = useState(false);

  const calculateMatchRate = () => {
    const totalRequested = needs.reduce((sum, need) => sum + need.quantityRequested, 0);
    const totalMatched = needs.reduce((sum, need) => sum + need.quantityMatched, 0);
    return totalRequested > 0 ? (totalMatched / totalRequested) * 100 : 0;
  };

  const getTopUnmetNeeds = () => {
    return needs
      .map(need => ({
        ...need,
        gap: need.quantityRequested - need.quantityMatched
      }))
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5);
  };

  const handleMatchRemainingNeeds = () => {
    setIsMatching(true);
    setShowMatchingAnimation(true);
    setMatchingProgress(0);

    // Simulate Agentforce matching process
    const matchingInterval = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(matchingInterval);
          
          // Update needs with new matched quantities
          setTimeout(() => {
            setNeeds(prevNeeds => 
              prevNeeds.map(need => {
                const remainingGap = need.quantityRequested - need.quantityMatched;
                const additionalMatch = Math.floor(remainingGap * (0.3 + Math.random() * 0.4));
                return {
                  ...need,
                  quantityMatched: Math.min(
                    need.quantityRequested,
                    need.quantityMatched + additionalMatch
                  )
                };
              })
            );
            setIsMatching(false);
            setShowMatchingAnimation(false);
          }, 1000);
          
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  // Simulate real-time updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (!isMatching && Math.random() < 0.3) {
        setNeeds(prevNeeds => {
          const updatedNeeds = [...prevNeeds];
          const randomIndex = Math.floor(Math.random() * updatedNeeds.length);
          const need = updatedNeeds[randomIndex];
          
          if (need.quantityMatched < need.quantityRequested) {
            const increment = Math.floor(Math.random() * 1000) + 100;
            updatedNeeds[randomIndex] = {
              ...need,
              quantityMatched: Math.min(need.quantityRequested, need.quantityMatched + increment)
            };
          }
          
          return updatedNeeds;
        });
      }
    }, 3000);

    return () => clearInterval(updateInterval);
  }, [isMatching]);

  const matchRate = calculateMatchRate();
  const topUnmetNeeds = getTopUnmetNeeds();

  return (
    <motion.div
      className="disaster-needs-view"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="detail-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h2>Disaster Needs Assessment</h2>
        <button onClick={onViewActiveShipments} className="secondary-button">
           View Active Shipments
        </button>
      </div>

      <div className="disaster-detail">
        <div className="disaster-summary">
          <h3>{disaster.name} - {disaster.location.name}</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="label">Affected Population:</span>
              <span className="value">{disaster.affectedPopulation.toLocaleString()}</span>
            </div>
            <div className="stat">
              <span className="label">Urgency Level:</span>
              <span className={`value severity-${disaster.severity}`}>
                {disaster.severity.toUpperCase()}
              </span>
            </div>
            <div className="stat">
              <span className="label">Overall Match Rate:</span>
              <span className="value">{matchRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="summary-panels">
          <div className="summary-panel">
            <h4> Top 5 Unmet Needs</h4>
            <div className="unmet-needs-list">
              {topUnmetNeeds.map((need, index) => (
                <div key={need.id} className="unmet-need-item">
                  <span className="rank">#{index + 1}</span>
                  <div className="need-info">
                    <div className="need-name">{need.specificItem}</div>
                    <div className="need-gap">{need.gap.toLocaleString()} units remaining</div>
                  </div>
                  <div className={`priority-badge priority-${need.priority}`}>
                    {need.priority.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-panel">
            <h4> Match Rate vs. Gaps</h4>
            <div className="match-chart">
              {needs.map(need => {
                const needMatchRate = (need.quantityMatched / need.quantityRequested) * 100;
                return (
                  <div key={need.id} className="chart-bar">
                    <div className="bar-label">{need.category}</div>
                    <div className="bar-container">
                      <motion.div 
                        className="bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${needMatchRate}%` }}
                        transition={{ duration: 1 }}
                      />
                      <span className="bar-percentage">{needMatchRate.toFixed(0)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="matching-section">
          <div className="matching-header">
            <h4> Agentforce Auto-Matching</h4>
            <motion.button 
              onClick={handleMatchRemainingNeeds}
              disabled={isMatching}
              className={`match-button ${isMatching ? 'matching' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMatching ? (
                <>
                  <span className="loading-spinner"></span>
                  Matching... {matchingProgress.toFixed(0)}%
                </>
              ) : (
                ' Match Remaining Needs'
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {showMatchingAnimation && (
              <motion.div
                className="matching-progress"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: '0%' }}
                    animate={{ width: `${matchingProgress}%` }}
                  />
                </div>
                <div className="progress-text">
                  Agentforce is analyzing inventory across {disaster.affectedPopulation > 10000000 ? '15+' : '12+'} distribution centers...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="needs-table-container">
          <h4>Detailed Needs Assessment</h4>
          <div className="table-wrapper">
            <table className="needs-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Item</th>
                  <th>Requested</th>
                  <th>Quantity Matched (Agentforce)</th>
                  <th>Remaining</th>
                  <th>Match %</th>
                  <th>Priority</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {needs.map((need) => {
                  const matchPercentage = (need.quantityMatched / need.quantityRequested) * 100;
                  const remaining = need.quantityRequested - need.quantityMatched;
                  
                  return (
                    <tr key={need.id}>
                      <td>{need.category}</td>
                      <td>{need.specificItem}</td>
                      <td>{need.quantityRequested.toLocaleString()}</td>
                      <td>
                        <div className="matched-quantity">
                          <motion.span
                            key={need.quantityMatched}
                            initial={{ scale: 1.2, color: '#00ff00' }}
                            animate={{ scale: 1, color: '#333' }}
                            transition={{ duration: 0.5 }}
                          >
                            {need.quantityMatched.toLocaleString()}
                          </motion.span>
                          {matchPercentage >= 90 && (
                            <span className="match-badge"> Nearly Complete</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={remaining === 0 ? 'fully-matched' : 'remaining-gap'}>
                          {remaining.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <div className="match-percentage">
                          <span className={`percentage ${matchPercentage >= 80 ? 'high' : matchPercentage >= 50 ? 'medium' : 'low'}`}>
                            {matchPercentage.toFixed(1)}%
                          </span>
                          <div className="mini-bar">
                            <motion.div 
                              className="mini-fill"
                              initial={{ width: 0 }}
                              animate={{ width: `${matchPercentage}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`priority priority-${need.priority}`}>
                          {need.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="source-cell">{need.source}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="real-time-counter">
          <h4> Live Impact Metrics</h4>
          <div className="counter-grid">
            <div className="counter-item">
              <div className="counter-value">
                <motion.span
                  key={needs.reduce((sum, need) => sum + need.quantityMatched, 0)}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {needs.reduce((sum, need) => sum + need.quantityMatched, 0).toLocaleString()}
                </motion.span>
              </div>
              <div className="counter-label">Items Matched</div>
            </div>
            <div className="counter-item">
              <div className="counter-value">
                <motion.span
                  key={Math.floor(disaster.affectedPopulation * (matchRate / 100))}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {Math.floor(disaster.affectedPopulation * (matchRate / 100)).toLocaleString()}
                </motion.span>
              </div>
              <div className="counter-label">People Potentially Helped</div>
            </div>
            <div className="counter-item">
              <div className="counter-value">
                <motion.span
                  key={needs.filter(need => (need.quantityMatched / need.quantityRequested) >= 0.8).length}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {needs.filter(need => (need.quantityMatched / need.quantityRequested) >= 0.8).length}
                </motion.span>
              </div>
              <div className="counter-label">Categories 80%+ Matched</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DisasterNeedsView;