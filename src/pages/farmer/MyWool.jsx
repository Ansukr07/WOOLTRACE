import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Plus, Search, Filter, ArrowRight } from 'lucide-react';
import './MyWool.css';

// Mock Batches
const mockBatches = [
  {
    id: 'WT-KA-2026-00124',
    date: '12 Aug 2026',
    quantity: '428 KG',
    type: 'Medium Wool',
    status: 'In Market',
    grade: 'A'
  },
  {
    id: 'WT-KA-2026-00118',
    date: '05 Aug 2026',
    quantity: '310 KG',
    type: 'Fine Wool',
    status: 'Sold',
    grade: 'A+'
  },
  {
    id: 'WT-KA-2026-00109',
    date: '22 Jul 2026',
    quantity: '505 KG',
    type: 'Coarse Wool',
    status: 'At Farm',
    grade: 'Pending'
  }
];

const MyWool = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBatch = (e) => {
    e.preventDefault();
    // Simulate creation
    alert('Batch created successfully! ID: WT-KA-2026-00125');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="my-wool-page">
        <div className="page-header">
          <div>
            <button className="back-btn" onClick={() => setIsCreating(false)}>← Back</button>
            <h1>Create Wool Batch</h1>
            <p>Register a new wool batch into the WoolTrace system.</p>
          </div>
        </div>
        
        <div className="create-batch-form panel">
          <form onSubmit={handleCreateBatch}>
            <div className="form-grid">
              <div className="form-group">
                <label>Shearing Date</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Sheep Count</label>
                <input type="number" placeholder="Number of sheep shorn" required />
              </div>
              <div className="form-group">
                <label>Wool Type</label>
                <select required>
                  <option value="">Select Type</option>
                  <option value="fine">Fine Wool</option>
                  <option value="medium">Medium Wool</option>
                  <option value="coarse">Coarse Wool</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity (KG)</label>
                <input type="number" placeholder="Total weight" required />
              </div>
              <div className="form-group full-width">
                <label>Initial Quality Assessment</label>
                <textarea rows="3" placeholder="Describe color, length, dirt content..."></textarea>
              </div>
              <div className="form-group full-width">
                <label>Upload Images (Optional)</label>
                <input type="file" multiple accept="image/*" />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Generate Batch ID & QR <ArrowRight size={18} /></button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="my-wool-page">
      <div className="page-header">
        <div>
          <h1>My Wool Batches</h1>
          <p>Manage and track your wool from farm to fabric.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsCreating(true)}>
          <Plus size={20} /> Create Batch
        </button>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search by Batch ID..." />
        </div>
        <button className="btn-filter">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="batch-list">
        {mockBatches.map(batch => (
          <div key={batch.id} className="batch-card" onClick={() => navigate(`/farmer/batch/${batch.id}`)}>
            <div className="batch-card-header">
              <div className="batch-id">
                <Box size={18} />
                <span>{batch.id}</span>
              </div>
              <span className={`status-badge ${batch.status.toLowerCase().replace(' ', '-')}`}>
                {batch.status}
              </span>
            </div>
            <div className="batch-card-body">
              <div className="detail">
                <span className="label">Date</span>
                <span className="value">{batch.date}</span>
              </div>
              <div className="detail">
                <span className="label">Quantity</span>
                <span className="value">{batch.quantity}</span>
              </div>
              <div className="detail">
                <span className="label">Type</span>
                <span className="value">{batch.type}</span>
              </div>
              <div className="detail">
                <span className="label">Grade</span>
                <span className="value">{batch.grade}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyWool;
