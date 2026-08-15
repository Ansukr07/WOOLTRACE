import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { 
  Factory, ClipboardList, CheckSquare, Scale, 
  ArrowRight, Search, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import './ProcessingDashboard.css';

const ProcessingDashboard = () => {
  const navigate = useNavigate();
  const { processingRequests, processingRecords } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const pendingRequests = (processingRequests || []).filter(r => r.status === 'REQUESTED').length;
  const activeBatches = (processingRequests || []).filter(r => ['ACCEPTED', 'RECEIVED', 'IN_PROGRESS'].includes(r.status)).length;
  const completedProcessesCount = (processingRequests || []).filter(r => r.status === 'COMPLETED').length;

  const completedRecords = (processingRecords || []).filter(rec => rec.status === 'COMPLETED');
  const totalOutputKg = completedRecords.reduce((sum, rec) => sum + (rec.outputQuantity || 0), 0);

  const filteredRequests = (processingRequests || []).filter(r => {
    const matchesSearch = r.batchId.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.farmerName && r.farmerName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'PENDING') {
      matchesStatus = r.status === 'REQUESTED';
    } else if (statusFilter === 'ACTIVE') {
      matchesStatus = ['ACCEPTED', 'RECEIVED', 'IN_PROGRESS'].includes(r.status);
    } else if (statusFilter === 'COMPLETED') {
      matchesStatus = r.status === 'COMPLETED';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="processing-dashboard">
      <div className="processing-dashboard-header">
        <h1>Processing Unit</h1>
        <p>Transform certified wool into traceable textile material.</p>
      </div>

      <div className="processing-metrics-grid">
        <div className="processing-metric-card">
          <div className="processing-metric-icon bg-sky"><ClipboardList size={24} /></div>
          <div className="processing-metric-info">
            <span className="processing-metric-label">Pending Requests</span>
            <span className="processing-metric-value">{pendingRequests}</span>
          </div>
        </div>
        <div className="processing-metric-card">
          <div className="processing-metric-icon bg-yellow"><Clock size={24} /></div>
          <div className="processing-metric-info">
            <span className="processing-metric-label">Active Batches</span>
            <span className="processing-metric-value">{activeBatches}</span>
          </div>
        </div>
        <div className="processing-metric-card">
          <div className="processing-metric-icon bg-green"><CheckSquare size={24} /></div>
          <div className="processing-metric-info">
            <span className="processing-metric-label">Completed Batches</span>
            <span className="processing-metric-value">{completedProcessesCount}</span>
          </div>
        </div>
        <div className="processing-metric-card">
          <div className="processing-metric-icon bg-primary"><Scale size={24} /></div>
          <div className="processing-metric-info">
            <span className="processing-metric-label">Total Output</span>
            <span className="processing-metric-value">{totalOutputKg.toLocaleString()} KG</span>
          </div>
        </div>
      </div>

      <div className="processing-dashboard-content">
        <div className="processing-queue-section panel">
          <div className="panel-header">
            <h2>Processing Queue</h2>
            <div className="queue-tabs">
              <button className={statusFilter === 'ALL' ? 'active' : ''} onClick={() => setStatusFilter('ALL')}>All</button>
              <button className={statusFilter === 'PENDING' ? 'active' : ''} onClick={() => setStatusFilter('PENDING')}>Requests</button>
              <button className={statusFilter === 'ACTIVE' ? 'active' : ''} onClick={() => setStatusFilter('ACTIVE')}>Active</button>
              <button className={statusFilter === 'COMPLETED' ? 'active' : ''} onClick={() => setStatusFilter('COMPLETED')}>Completed</button>
            </div>
          </div>

          <div className="processing-toolbar">
            <div className="processing-search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by Batch ID or Farmer name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="processing-table">
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Farmer</th>
                  <th>Origin</th>
                  <th>Quantity</th>
                  <th>Wool Type</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                      <AlertCircle size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                      No batches in this queue.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id}>
                      <td><strong>{req.batchId}</strong></td>
                      <td>{req.farmerName}</td>
                      <td>{req.origin}</td>
                      <td>{req.quantity} KG</td>
                      <td>{req.woolType}</td>
                      <td>
                        <span className="grade-badge">{req.grade || 'N/A'}</span>
                      </td>
                      <td>
                        <span className={`status-pill ${req.status.toLowerCase()}`}>
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-view-batch"
                          onClick={() => navigate(`/processing/batches/${req.batchId}`)}
                        >
                          View Batch <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="processing-recent-section panel">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {completedRecords.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>No recent processing operations.</p>
            ) : (
              completedRecords.slice(0, 5).map((rec) => (
                <div key={rec.id} className="activity-item">
                  <div className="activity-icon bg-green"><CheckCircle size={16} /></div>
                  <div className="activity-text">
                    <p>
                      <strong>{rec.operation}</strong> completed for <strong>{rec.batchId}</strong>
                    </p>
                    <span className="activity-qty">
                      Input: {rec.inputQuantity} KG → Output: {rec.outputQuantity} KG ({((rec.outputQuantity / rec.inputQuantity) * 100).toFixed(1)}% Yield)
                    </span>
                    <span className="activity-time">
                      {new Date(rec.completionTime || rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingDashboard;
