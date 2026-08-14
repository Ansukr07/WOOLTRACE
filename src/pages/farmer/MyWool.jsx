import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Plus, Search, Filter, ArrowRight } from 'lucide-react';
import './MyWool.css';

// Mock Batches
const initialBatches = [
  {
    id: 'WT-KA-2026-00124',
    date: '12 Aug 2026',
    quantity: '428 KG',
    type: 'Medium Wool',
    status: 'At Farm',
    grade: '-'
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

import { qaService } from '../../services/qa/qaService';

const MyWool = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Fetch dynamic batches from API
      const apiBatches = await qaService.getBatches('FARMER-01');
      const mappedApiBatches = apiBatches.map(b => ({
        id: b.batchId,
        date: new Date(b.shearingDate || b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        quantity: `${b.quantity} KG`,
        type: b.woolType,
        status: b.qualityStatus === 'Certified' ? 'Certified' : 'At Farm',
        grade: '-'
      }));

      // Merge with initial mocks, ensuring no duplicates by ID
      const allBatches = [...mappedApiBatches, ...initialBatches];
      const uniqueBatches = Array.from(new Map(allBatches.map(item => [item.id, item])).values());
      
      setBatches(uniqueBatches);

      // Now check certificates and requests for all unique batches
      const certs = await qaService.getRequests({ farmerId: 'FARMER-01' }); // Wait, qaService doesn't have getAllCertificates for a farmer easily, let's just fetch requests
      
      uniqueBatches.forEach(async (batch) => {
        const c = await qaService.getCertificateByBatch(batch.id);
        if (c) {
          setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'Certified', grade: c.grade } : b));
        } else {
          const req = certs.find(r => r.batchId === batch.id);
          if (req) {
            setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, status: 'Inspection ' + req.status.replace('_', ' ') } : b));
          }
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({ date: '', count: '', type: '', quantity: '' });

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    try {
      const res = await qaService.createBatch({
        farmerId: 'FARMER-01',
        farmerName: 'Rajesh Kumar',
        quantity: Number(formData.quantity),
        woolType: formData.type || 'Medium Wool',
        origin: 'Mysuru, Karnataka',
        shearingDate: formData.date
      });
      if (res.success) {
        setIsCreating(false);
        navigate(`/farmer/batch/${res.data.batchId}`);
      }
    } catch (error) {
      console.error(error);
    }
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
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Sheep Count</label>
                <input type="number" placeholder="Number of sheep shorn" required value={formData.count} onChange={e => setFormData({...formData, count: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Wool Type</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="">Select Type</option>
                  <option value="Fine Wool">Fine Wool</option>
                  <option value="Medium Wool">Medium Wool</option>
                  <option value="Coarse Wool">Coarse Wool</option>
                </select>
              </div>
              <div className="form-group">
                <label>Quantity (KG)</label>
                <input type="number" placeholder="Total weight" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="form-group full-width">
                <label>Initial Quality Assessment</label>
                <textarea rows="3" placeholder="Describe color, length, dirt content..."></textarea>
              </div>
              <div className="form-group full-width">
                <label>Upload Images</label>
                <input type="file" multiple accept="image/*" required />
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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '64px 0', flexDirection: 'column', gap: 16 }}>
          <div className="spinner" style={{ width: 40, height: 40, border: '4px solid #F0F0F0', borderTop: '4px solid #0B120D', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#666', fontWeight: 600 }}>Loading your wool batches...</p>
        </div>
      ) : (
        <div className="batch-list">
        {batches.map(batch => (
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
      )}
    </div>
  );
};

export default MyWool;
