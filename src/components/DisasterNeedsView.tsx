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
  const [matchingStage, setMatchingStage] = useState('');
  const [batchProgress, setBatchProgress] = useState<{[key: string]: number}>({});

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
    setBatchProgress({});
    
    const stages = [
      'Analyzing inventory across global distribution centers...',
      'Identifying optimal resource allocation paths...',
      'Processing corporate partnership matches...',
      'Calculating transportation logistics...',
      'Finalizing allocation recommendations...'
    ];
    
    let currentStage = 0;
    setMatchingStage(stages[0]);
    
    // Progressive batch matching with realistic delays
    const batchMatching = async () => {
      const needsCopy = [...needs];
      const batchSize = Math.ceil(needsCopy.length / 3); // Process in 3 batches
      
      for (let batch = 0; batch < 3; batch++) {
        const startIndex = batch * batchSize;
        const endIndex = Math.min(startIndex + batchSize, needsCopy.length);
        const batchNeeds = needsCopy.slice(startIndex, endIndex);
        
        // Update stage
        if (currentStage < stages.length - 1) {
          setMatchingStage(stages[++currentStage]);
        }
        
        // Process each need in the batch with individual progress
        for (let i = 0; i < batchNeeds.length; i++) {
          const need = batchNeeds[i];
          const batchKey = `batch-${batch}-${i}`;
          
          // Simulate processing time per item
          await new Promise(resolve => {
            let itemProgress = 0;
            const itemInterval = setInterval(() => {
              itemProgress += 10 + Math.random() * 15;
              setBatchProgress(prev => ({ ...prev, [batchKey]: itemProgress }));
              
              if (itemProgress >= 100) {
                clearInterval(itemInterval);
                
                // Update the actual need quantities
                setNeeds(prevNeeds => 
                  prevNeeds.map(prevNeed => {
                    if (prevNeed.id === need.id) {
                      const remainingGap = prevNeed.quantityRequested - prevNeed.quantityMatched;
                      const matchEfficiency = need.priority === 'high' ? 0.7 : need.priority === 'medium' ? 0.5 : 0.3;
                      const additionalMatch = Math.floor(remainingGap * (matchEfficiency + Math.random() * 0.2));
                      
                      return {
                        ...prevNeed,
                        quantityMatched: Math.min(
                          prevNeed.quantityRequested,
                          prevNeed.quantityMatched + additionalMatch
                        )
                      };
                    }
                    return prevNeed;
                  })
                );
                
                resolve(undefined);
              }
            }, 100 + Math.random() * 200); // Variable processing speed
          });
        }
        
        // Update overall progress
        const overallProgress = ((batch + 1) / 3) * 100;
        setMatchingProgress(overallProgress);
        
        // Pause between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Final completion
      setMatchingStage('Matching complete! New allocations have been processed.');
      setTimeout(() => {
        setIsMatching(false);
        setShowMatchingAnimation(false);
        setBatchProgress({});
      }, 2000);
    };
    
    batchMatching();
  };

  // Enhanced real-time updates with multiple sources
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (!isMatching && Math.random() < 0.4) {
        setNeeds(prevNeeds => {
          const updatedNeeds = [...prevNeeds];
          
          // Prioritize high-priority needs for updates
          const highPriorityNeeds = updatedNeeds.filter(n => n.priority === 'high' && n.quantityMatched < n.quantityRequested);
          const availableNeeds = highPriorityNeeds.length > 0 ? highPriorityNeeds : updatedNeeds.filter(n => n.quantityMatched < n.quantityRequested);
          
          if (availableNeeds.length > 0) {
            const randomNeed = availableNeeds[Math.floor(Math.random() * availableNeeds.length)];
            const needIndex = updatedNeeds.findIndex(n => n.id === randomNeed.id);
            
            if (needIndex !== -1) {
              const remainingGap = randomNeed.quantityRequested - randomNeed.quantityMatched;
              const maxIncrement = Math.min(remainingGap, Math.floor(remainingGap * 0.1) + 500);
              const increment = Math.floor(Math.random() * maxIncrement) + 100;
              
              updatedNeeds[needIndex] = {
                ...randomNeed,
                quantityMatched: Math.min(randomNeed.quantityRequested, randomNeed.quantityMatched + increment)
              };
            }
          }
          
          return updatedNeeds;
        });
      }
    }, 2500); // Slightly faster updates

    return () => clearInterval(updateInterval);
  }, [isMatching]);
  
  // Sync with parent disaster data
  useEffect(() => {
    setNeeds(disaster.needs);
  }, [disaster.needs]);

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
            <h4>Auto-Matching System</h4>
          <p className="matching-description">
            AI-powered resource allocation across {disaster.affectedPopulation > 10000000 ? '15+' : '12+'} global distribution centers. 
            Current efficiency: {matchRate >= 80 ? 'Excellent' : matchRate >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
            <motion.button 
              onClick={handleMatchRemainingNeeds}
              disabled={isMatching || matchRate >= 95}
              className={`match-button ${isMatching ? 'matching' : ''} ${matchRate >= 95 ? 'completed' : ''}`}
              whileHover={{ scale: isMatching ? 1 : 1.05 }}
              whileTap={{ scale: isMatching ? 1 : 0.95 }}
            >
              {isMatching ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing... {matchingProgress.toFixed(0)}%
                </>
              ) : matchRate >= 95 ? (
                'Matching Nearly Complete'
              ) : (
                'Run Auto-Matching Algorithm'
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
                  {matchingStage}
                </div>
                <div className="batch-details">
                  {Object.keys(batchProgress).length > 0 && (
                    <div className="current-batch">
                      Processing batch items: {Object.values(batchProgress).filter(p => p < 100).length} active
                    </div>
                  )}
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