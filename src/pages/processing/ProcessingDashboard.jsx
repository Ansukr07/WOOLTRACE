import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { processingService } from '../../services/processing/processingService';
import ProcessingMap from './components/ProcessingMap';
import QuantityDiscrepancyModal from './components/QuantityDiscrepancyModal';
import DispatchModal from './components/DispatchModal';
import BatchTimelineModal from './components/BatchTimelineModal';
import {
  ClipboardList, Scale, CheckSquare, Factory, Truck, Package, Search, ArrowRight,
  Clock, AlertCircle, AlertTriangle, MapPin, Zap, Layers, Sparkles
} from 'lucide-react';
import './ProcessingDashboard.css';

const ProcessingDashboard = () => {
  const navigate = useNavigate();
  const state = useGlobalState() || {};

  const {
    processingFacility = {},
    updateFacilityStatus = () => {},
    processingRequests = [],
    receiveProcessingBatch = () => {},
    startProcessingOperation = () => {},
    completeProcessingOperation = () => {},
    markProcessingReadyToShip = () => {},
    dispatchProcessingBatch = () => {}
  } = state;

  const [searchQuery, setSearchQuery] = useState('');
  const [pipelineStage, setPipelineStage] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  
  // Modals state
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [activeBatchForModal, setActiveBatchForModal] = useState(null);

  // CEDA status
  const [cedaStatus, setCedaStatus] = useState('ACTIVE');

  useEffect(() => {
    // Check backend CEDA service status
    processingService.getCedaData().then(res => {
      if (res && res.serviceStatus) setCedaStatus(res.serviceStatus);
    }).catch(() => setCedaStatus('OFFLINE'));
  }, []);

  const safeRequests = Array.isArray(processingRequests) ? processingRequests : [];

  // Compute Operations Metrics
  const incomingCount = safeRequests.filter(r => r && ['REQUESTED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DISPATCHED', 'IN_TRANSIT'].includes(r.status)).length;
  const atFacilityCount = safeRequests.filter(r => r && ['RECEIVED', 'WAITING_FOR_PROCESSING', 'SORTING', 'WASHING', 'CARDING', 'SPINNING', 'DYEING', 'PROCESSING'].includes(r.status)).length;
  const processingCount = safeRequests.filter(r => r && ['PROCESSING', 'IN_PROGRESS', 'SORTING', 'WASHING', 'CARDING', 'SPINNING', 'DYEING'].includes(r.status)).length;
  const readyShipCount = safeRequests.filter(r => r && r.status === 'READY_TO_SHIP').length;
  const inTransitCount = safeRequests.filter(r => r && (r.status === 'IN_TRANSIT' || r.transportStatus === 'In Transit')).length;
  const completedCount = safeRequests.filter(r => r && ['COMPLETED', 'PROCESSING_COMPLETED'].includes(r.status)).length;
  const dispatchedCount = safeRequests.filter(r => r && r.status === 'DISPATCHED').length;
  const deliveredCount = safeRequests.filter(r => r && r.status === 'DELIVERED').length;

  const totalWorkloadKg = safeRequests
    .filter(r => r && ['RECEIVED', 'PROCESSING', 'IN_PROGRESS'].includes(r.status))
    .reduce((sum, r) => sum + (r.quantity || 0), 0) || 3420;

  const totalCapacityKg = processingFacility?.totalCapacityKg || 5000;
  const availableCapacityKg = Math.max(0, totalCapacityKg - totalWorkloadKg);
  const utilizationPct = ((totalWorkloadKg / totalCapacityKg) * 100).toFixed(1);

  // Filter requests
  const filteredRequests = safeRequests.filter(r => {
    if (!r) return false;
    const query = searchQuery.toLowerCase();
    const matchesSearch = (r.batchId || '').toLowerCase().includes(query) || 
                          (r.farmerName || '').toLowerCase().includes(query) ||
                          (r.origin || '').toLowerCase().includes(query);

    let matchesPipeline = true;
    if (pipelineStage === 'INCOMING') matchesPipeline = ['REQUESTED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DISPATCHED', 'IN_TRANSIT'].includes(r.status);
    else if (pipelineStage === 'RECEIVED') matchesPipeline = r.status === 'RECEIVED';
    else if (pipelineStage === 'PROCESSING') matchesPipeline = ['PROCESSING', 'IN_PROGRESS'].includes(r.status);
    else if (pipelineStage === 'COMPLETED') matchesPipeline = r.status === 'COMPLETED';
    else if (pipelineStage === 'READY_TO_SHIP') matchesPipeline = r.status === 'READY_TO_SHIP';
    else if (pipelineStage === 'DISPATCHED') matchesPipeline = r.status === 'DISPATCHED';
    else if (pipelineStage === 'DELIVERED') matchesPipeline = r.status === 'DELIVERED';

    let matchesPriority = true;
    if (priorityFilter !== 'ALL') matchesPriority = (r.priority || 'NORMAL') === priorityFilter;

    return matchesSearch && matchesPipeline && matchesPriority;
  });

  // Lifecycle Handlers
  const handleOpenReceiveModal = (req) => {
    setActiveBatchForModal(req);
    setShowReceiveModal(true);
  };

  const handleConfirmReceive = (batchId, receivedQty, reason) => {
    receiveProcessingBatch(batchId, receivedQty, reason);
    setShowReceiveModal(false);
  };

  const handleOpenDispatchModal = (req) => {
    setActiveBatchForModal(req);
    setShowDispatchModal(true);
  };

  const handleConfirmDispatch = (batchId, destination, transportPartner, expectedDispatch, notes) => {
    dispatchProcessingBatch(batchId, destination, transportPartner, notes);
    setShowDispatchModal(false);
  };

  const handleOpenTimeline = (req) => {
    setActiveBatchForModal(req);
    setShowTimelineModal(true);
  };

  return (
    <div className="processing-dashboard">
      {/* 1. Header & Logged-In Processing Unit */}
      <div className="processing-dashboard-header">
        <div className="header-title-area">
          <div className="header-subtitle-tag"><Factory size={16} /> WoolTrace Operations Control Center</div>
          <h1>Processing Unit Operations</h1>
          <p>Manage incoming wool, active processing, completed batches, and outbound shipments.</p>
        </div>

        {/* Facility Info Card & Status Badge */}
        <div className="facility-status-card panel">
          <div className="facility-card-top">
            <div className="facility-name-group">
              <h3>{processingFacility?.name || 'WoolCraft Processing Centre'}</h3>
              <span className="facility-location"><MapPin size={12} /> {processingFacility?.address || 'Mysuru, Karnataka'}</span>
              <span className="facility-verified">✓ Verified Facility</span>
            </div>
            <div className="facility-status-selector">
              <select 
                value={processingFacility?.status || 'ACCEPTING_BATCHES'} 
                onChange={(e) => updateFacilityStatus(e.target.value)}
                className="status-dropdown"
              >
                <option value="ACCEPTING_BATCHES">🟢 ACCEPTING BATCHES</option>
                <option value="BUSY">🟡 BUSY</option>
                <option value="LIMITED_CAPACITY">🟠 LIMITED CAPACITY</option>
                <option value="AT_CAPACITY">🔴 AT CAPACITY</option>
                <option value="OFFLINE">⚫ OFFLINE</option>
              </select>
            </div>
          </div>
          <div className="facility-card-bottom">
            <span>Operating Hours: <strong>{processingFacility?.operatingHours || '08:00 - 20:00 IST'}</strong></span>
            <span>Active Machines: <strong>{processingFacility?.activeEquipment || 12}</strong></span>
            <span>Floor Operators: <strong>{processingFacility?.activeOperators || 8}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Operations Metrics */}
      <div className="processing-metrics-grid">
        <div className="metric-card bg-orange-light">
          <div className="metric-header">
            <span className="metric-label">INCOMING</span>
            <Package className="text-orange" size={20} />
          </div>
          <div className="metric-value">{incomingCount}</div>
          <div className="metric-sub font-mono">1,840 KG Total</div>
        </div>

        <div className="metric-card bg-blue-light">
          <div className="metric-header">
            <span className="metric-label">AT FACILITY</span>
            <Factory className="text-blue" size={20} />
          </div>
          <div className="metric-value">{atFacilityCount}</div>
          <div className="metric-sub font-mono">{totalWorkloadKg.toLocaleString()} KG Received</div>
        </div>

        <div className="metric-card bg-amber-light">
          <div className="metric-header">
            <span className="metric-label">PROCESSING</span>
            <Zap className="text-amber" size={20} />
          </div>
          <div className="metric-value">{processingCount}</div>
          <div className="metric-sub font-mono">7 Active Batches</div>
        </div>

        <div className="metric-card bg-purple-light">
          <div className="metric-header">
            <span className="metric-label">READY TO SHIP</span>
            <CheckSquare className="text-purple" size={20} />
          </div>
          <div className="metric-value">{readyShipCount}</div>
          <div className="metric-sub font-mono">980 KG Staged</div>
        </div>

        <div className="metric-card bg-cyan-light">
          <div className="metric-header">
            <span className="metric-label">IN TRANSIT</span>
            <Truck className="text-cyan" size={20} />
          </div>
          <div className="metric-value">{inTransitCount}</div>
          <div className="metric-sub font-mono">En Route to Unit/Mill</div>
        </div>

        <div className="metric-card bg-green-light">
          <div className="metric-header">
            <span className="metric-label">COMPLETED</span>
            <CheckSquare className="text-green" size={20} />
          </div>
          <div className="metric-value">{completedCount}</div>
          <div className="metric-sub font-mono">24 Output Batches</div>
        </div>
      </div>

      {/* 3. Facility Capacity & AI Workload Forecast Widget */}
      <div className="capacity-forecast-section grid-2-col">
        <div className="panel capacity-widget">
          <div className="panel-header">
            <h3><Scale size={18} /> Processing Capacity Utilization</h3>
            <span className="capacity-stat">{totalWorkloadKg.toLocaleString()} KG / {totalCapacityKg.toLocaleString()} KG</span>
          </div>
          <div className="capacity-progress-container">
            <div className="capacity-bar" style={{ width: `${utilizationPct}%` }}></div>
          </div>
          <div className="capacity-footer">
            <span>Utilization: <strong>{utilizationPct}%</strong></span>
            <span>Available Capacity: <strong>{availableCapacityKg.toLocaleString()} KG</strong></span>
          </div>
        </div>

        <div className="panel ai-alert-widget">
          <div className="ai-header">
            <Sparkles className="text-purple" size={18} />
            <span>AI Capacity & Load Forecast [AI Recommendation]</span>
          </div>
          <p className="ai-body">
            <strong>⚠ Near Capacity Alert:</strong> 3 incoming batches expected within 24 hours (1,840 KG). Projected workload: <strong>4,820 KG / 5,000 KG (96.4%)</strong>.
          </p>
          <div className="ai-actions">
            <span>Recommended Priority: <strong>WT-KA-2026-00124</strong> (High Grade Merino)</span>
          </div>
        </div>
      </div>

      {/* 4. Interactive 8-Stage Operations Pipeline */}
      <div className="operations-pipeline-container panel">
        <div className="pipeline-header">
          <span>OPERATIONS LIFECYCLE PIPELINE</span>
          <span className="pipeline-hint">Click any stage to filter active queue</span>
        </div>
        <div className="pipeline-steps-bar">
          <div className={`pipeline-step ${pipelineStage === 'INCOMING' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'INCOMING' ? 'ALL' : 'INCOMING')}>
            <span className="step-count">{incomingCount}</span>
            <span className="step-label">INCOMING</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'RECEIVED' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'RECEIVED' ? 'ALL' : 'RECEIVED')}>
            <span className="step-count">5</span>
            <span className="step-label">RECEIVED</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'PROCESSING' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'PROCESSING' ? 'ALL' : 'PROCESSING')}>
            <span className="step-count">{processingCount}</span>
            <span className="step-label">PROCESSING</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'COMPLETED' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'COMPLETED' ? 'ALL' : 'COMPLETED')}>
            <span className="step-count">{completedCount}</span>
            <span className="step-label">COMPLETED</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'READY_TO_SHIP' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'READY_TO_SHIP' ? 'ALL' : 'READY_TO_SHIP')}>
            <span className="step-count">{readyShipCount}</span>
            <span className="step-label">READY TO SHIP</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'DISPATCHED' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'DISPATCHED' ? 'ALL' : 'DISPATCHED')}>
            <span className="step-count">{dispatchedCount}</span>
            <span className="step-label">DISPATCHED</span>
          </div>
          <div className="pipeline-arrow">➔</div>
          <div className={`pipeline-step ${pipelineStage === 'DELIVERED' ? 'active' : ''}`} onClick={() => setPipelineStage(pipelineStage === 'DELIVERED' ? 'ALL' : 'DELIVERED')}>
            <span className="step-count">{deliveredCount}</span>
            <span className="step-label">DELIVERED</span>
          </div>
        </div>
      </div>

      {/* 5. CEDA Live Map Integration */}
      <ProcessingMap 
        facility={processingFacility}
        requests={safeRequests}
        onSelectBatch={(batchId) => {
          const found = safeRequests.find(r => r && (r.batchId === batchId || r.id === batchId));
          if (found) handleOpenTimeline(found);
        }}
        cedaStatus={cedaStatus}
      />

      {/* 6. Operations Queues & Toolbar */}
      <div className="processing-queue-section panel">
        <div className="panel-header queue-header-controls">
          <h2>Batch Operations Queues</h2>
          
          {/* Priority filter */}
          <div className="queue-filter-group">
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="priority-select"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">High Priority</option>
              <option value="URGENT">Urgent Priority</option>
              <option value="NORMAL">Normal Priority</option>
            </select>
          </div>
        </div>

        {/* Toolbar & Search */}
        <div className="processing-toolbar">
          <div className="processing-search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search Batch ID, Farmer, or Origin..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {pipelineStage !== 'ALL' && (
            <button className="btn-secondary btn-sm" onClick={() => setPipelineStage('ALL')}>
              Clear Pipeline Filter ({pipelineStage})
            </button>
          )}
        </div>

        {/* Table View */}
        <div className="table-responsive">
          <table className="processing-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Origin / Farmer</th>
                <th>Quantity</th>
                <th>Wool Type</th>
                <th>Status / Progress</th>
                <th>Location / ETA</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                    No batches match the selected operational filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => {
                  if (!req) return null;
                  const isIncoming = ['REQUESTED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DISPATCHED', 'IN_TRANSIT'].includes(req.status);
                  const isProcessing = ['PROCESSING', 'IN_PROGRESS'].includes(req.status);
                  const isReadyShip = req.status === 'READY_TO_SHIP';

                  return (
                    <tr key={req.id || req.batchId || Math.random()}>
                      <td>
                        <strong className="batch-link" onClick={() => handleOpenTimeline(req)}>
                          {req.batchId}
                        </strong>
                        {req.parentBatchId && <div className="sub-tag">Child of {req.parentBatchId}</div>}
                      </td>
                      <td>
                        <div className="farmer-name">{req.farmerName || 'Registered Farmer'}</div>
                        <div className="origin-sub">{req.origin || 'Warehouse'}</div>
                      </td>
                      <td>
                        <strong>{req.quantity} KG</strong>
                      </td>
                      <td>
                        <span className="wool-type-pill">{req.woolType || 'Merino Fleece'}</span>
                      </td>
                      <td>
                        <span className={`status-pill status-${(req.status || '').toLowerCase()}`}>
                          {req.status}
                        </span>
                        {isProcessing && (
                          <div className="table-progress-bar">
                            <div className="bar-fill" style={{ width: `${req.progressPct || 50}%` }}></div>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="location-text">{req.currentLocation || req.destination || req.origin}</div>
                        {req.eta && <div className="eta-badge">⏱ ETA: {req.eta}</div>}
                      </td>
                      <td>
                        <span className={`priority-badge priority-${(req.priority || 'NORMAL').toLowerCase()}`}>
                          {req.priority || 'NORMAL'}
                        </span>
                      </td>
                      <td>
                        <div className="action-button-group">
                          {isIncoming && (
                            <button className="btn-action-receive" onClick={() => handleOpenReceiveModal(req)}>
                              MARK AS RECEIVED
                            </button>
                          )}
                          {isReadyShip && (
                            <button className="btn-action-dispatch" onClick={() => handleOpenDispatchModal(req)}>
                              DISPATCH
                            </button>
                          )}
                          <button className="btn-view-batch" onClick={() => handleOpenTimeline(req)}>
                            Timeline <ArrowRight size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Delay Alerts & Daily Summary Side-by-Side */}
      <div className="grid-2-col bottom-alerts-section">
        <div className="panel delay-alerts-card">
          <h3><AlertTriangle className="text-amber" size={18} /> Active Operational Delay Alerts</h3>
          <div className="alert-list">
            <div className="alert-item amber">
              <div className="alert-icon">⚠</div>
              <div className="alert-info">
                <strong>PROCESSING DELAY: WT-KA-2026-00121</strong>
                <p>Carding operation delayed by 2h 40m due to equipment calibration.</p>
              </div>
            </div>
            <div className="alert-item blue">
              <div className="alert-icon">🚚</div>
              <div className="alert-info">
                <strong>INCOMING DELIVERY DELAY: WT-KA-2026-00124</strong>
                <p>In Transit from Mysuru Warehouse. Expected arrival delayed by 54 mins.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="panel daily-summary-card">
          <h3><Clock size={18} /> Today's Operations Summary</h3>
          <div className="daily-summary-grid">
            <div className="summary-stat"><span>Incoming:</span> <strong>8 batches (1,840 KG)</strong></div>
            <div className="summary-stat"><span>Received:</span> <strong>5 batches (1,220 KG)</strong></div>
            <div className="summary-stat"><span>Processing:</span> <strong>7 batches (2,840 KG)</strong></div>
            <div className="summary-stat"><span>Completed:</span> <strong>6 batches (1,560 KG)</strong></div>
            <div className="summary-stat"><span>Ready to Ship:</span> <strong>4 batches (980 KG)</strong></div>
            <div className="summary-stat"><span>Dispatched:</span> <strong>3 batches (720 KG)</strong></div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReceiveModal && activeBatchForModal && (
        <QuantityDiscrepancyModal 
          batch={activeBatchForModal}
          onConfirm={handleConfirmReceive}
          onClose={() => setShowReceiveModal(false)}
        />
      )}

      {showDispatchModal && activeBatchForModal && (
        <DispatchModal 
          batch={activeBatchForModal}
          onConfirm={handleConfirmDispatch}
          onClose={() => setShowDispatchModal(false)}
        />
      )}

      {showTimelineModal && activeBatchForModal && (
        <BatchTimelineModal 
          batch={activeBatchForModal}
          onClose={() => setShowTimelineModal(false)}
        />
      )}
    </div>
  );
};

export default ProcessingDashboard;