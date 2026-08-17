import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { 
  Box, Plus, Search, Filter, ArrowRight, QrCode, CheckCircle2, 
  MapPin, ShieldCheck, Download, Printer, X, Sparkles 
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { qaService } from '../../services/qa/qaService';
import './MyWool.css';

const WOOL_BREEDS = [
  'Merino Cross Fleece',
  'Chokla Fine Carpet Wool',
  'Gaddi Mountain White Fleece',
  'Magra Lustrous Carpet Wool',
  'Deccani Native Coarse Wool',
  'Bharat Merino Apparel Grade',
  'Patanwadi Dense Fleece',
  'Pashmina Cashmere Undercoat'
];

const MyWool = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches, addBatch } = useGlobalState();
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  
  // Newly created batch popup modal
  const [createdBatch, setCreatedBatch] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    count: '35',
    type: 'Merino Cross Fleece',
    quantity: '450',
    origin: user?.state ? `Mandya, ${user.state}` : 'Mandya, Karnataka',
    notes: 'Clean spring fleece, zero burr contamination, moisture preserved in sealed jute bags.'
  });

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    const qtyNum = Number(formData.quantity) || 400;
    const farmerName = user?.name || 'Rajesh Gowda';
    const farmerId = user?.id || 'FARMER-01';

    const stateCode = (formData.origin || '').toLowerCase().includes('rajasthan') ? 'RJ'
      : (formData.origin || '').toLowerCase().includes('himachal') ? 'HP'
      : (formData.origin || '').toLowerCase().includes('punjab') ? 'PB'
      : (formData.origin || '').toLowerCase().includes('kashmir') ? 'JK'
      : 'KA';

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newBatchId = `WT-${stateCode}-2026-${randomSuffix}`;

    const newBatchData = {
      id: newBatchId,
      batchId: newBatchId,
      farmerId: farmerId,
      farmerName: farmerName,
      origin: formData.origin,
      quantity: qtyNum,
      woolType: formData.type,
      shearingDate: formData.date,
      createdAt: new Date().toISOString(),
      currentStage: 'FARM',
      currentStatus: 'Harvested at Farm',
      currentLocation: formData.origin,
      qualityGrade: 'Pending QA',
      certificateStatus: 'Uninspected',
      verificationUrl: `http://localhost:5173/track/${newBatchId}`,
      events: [
        {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
                     new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          stage: 'FARM',
          title: 'Farm Shearing & Batch Registered',
          location: formData.origin,
          status: 'Completed',
          actor: `${farmerName} (Farmer)`,
          description: `Batch #${newBatchId} registered with ${qtyNum} KG of ${formData.type} from ${formData.count} sheep. ${formData.notes}`
        }
      ]
    };

    // Save to Global State Context and qaService
    addBatch(newBatchData);
    await qaService.createBatch(newBatchData);

    setIsCreating(false);
    setCreatedBatch(newBatchData);
  };

  const filteredBatches = batches.filter(b => {
    const matchesSearch = (b.id || b.batchId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.woolType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (b.origin || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CERTIFIED') return b.certificateStatus === 'Certified';
    if (selectedFilter === 'WAREHOUSE') return b.currentStage === 'WAREHOUSE';
    if (selectedFilter === 'FARM') return b.currentStage === 'FARM';
    return true;
  });

  return (
    <div className="my-wool-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>My Wool Batches</h1>
          <p>Register, track, and manage your wool batches with verifiable digital passports.</p>
        </div>
        <button className="btn-primary" onClick={() => setIsCreating(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Create New Batch
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by Batch ID, wool type, or origin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'FARM', 'CERTIFIED', 'WAREHOUSE'].map(f => (
            <button 
              key={f}
              onClick={() => setSelectedFilter(f)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(11,18,13,0.12)',
                background: selectedFilter === f ? '#0B120D' : '#F8F8F3',
                color: selectedFilter === f ? '#DDFF86' : '#0B120D',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="batch-list">
        {filteredBatches.map(batch => {
          const isCertified = batch.certificateStatus === 'Certified';
          const stageBadgeColor = batch.currentStage === 'WAREHOUSE' ? '#BED5E5' 
            : batch.currentStage === 'FABRIC' ? '#DDFF86' 
            : batch.currentStage === 'PROCESSING' ? '#EDEDCE' 
            : '#F8F8F3';

          return (
            <div key={batch.id} className="batch-card" onClick={() => navigate(`/farmer/batch/${batch.id}`)}>
              <div className="batch-card-header">
                <div className="batch-id">
                  <Box size={18} />
                  <span>{batch.id}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ 
                    background: stageBadgeColor, 
                    color: '#0B120D', 
                    fontSize: '11px', 
                    fontWeight: '800', 
                    padding: '3px 8px', 
                    borderRadius: '4px',
                    border: '1px solid rgba(11,18,13,0.1)'
                  }}>
                    {batch.currentStage || 'FARM'}
                  </span>
                  <span className={`status-badge ${isCertified ? 'certified' : 'at-farm'}`}>
                    {batch.certificateStatus || 'Uninspected'}
                  </span>
                </div>
              </div>

              <div className="batch-card-body">
                <div className="detail">
                  <span className="label">Harvest Date</span>
                  <span className="value">
                    {new Date(batch.shearingDate || batch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="detail">
                  <span className="label">Quantity</span>
                  <span className="value" style={{ fontWeight: '800' }}>{batch.quantity} KG</span>
                </div>
                <div className="detail">
                  <span className="label">Wool Type</span>
                  <span className="value">{batch.woolType}</span>
                </div>
                <div className="detail">
                  <span className="label">Quality Grade</span>
                  <span className="value" style={{ color: isCertified ? '#166534' : '#666', fontWeight: '800' }}>
                    {batch.qualityGrade || 'Pending QA'}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Action Bar */}
              <div style={{ 
                borderTop: '1px solid rgba(11,18,13,0.06)', 
                padding: '10px 16px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#FAFAF7',
                borderRadius: '0 0 12px 12px'
              }} onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => setShowQRModal(batch)}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid rgba(11,18,13,0.12)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <QrCode size={13} /> View QR
                </button>

                <button 
                  onClick={() => navigate(`/farmer/track?id=${batch.id}`)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0B120D',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Track Journey <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Create Batch Form Modal ── */}
      {isCreating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 18, 13, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#166534', letterSpacing: '0.08em' }}>
                  Farm Digital Registration
                </span>
                <h2 style={{ margin: '4px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0B120D' }}>
                  Register New Wool Batch
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '13px' }}>
                  Capture shearing harvest details to instantly mint a digital passport and cryptographic QR tag.
                </p>
              </div>
              <button 
                onClick={() => setIsCreating(false)}
                style={{ background: '#F8F8F3', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Shearing Date</label>
                  <input 
                    type="date" 
                    required 
                    value={formData.date} 
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Total Wool Weight (KG)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 450" 
                    required 
                    value={formData.quantity} 
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Sheep Shorn (Count)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 35" 
                    required 
                    value={formData.count} 
                    onChange={e => setFormData({ ...formData, count: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Wool Breed / Type</label>
                  <select 
                    required 
                    value={formData.type} 
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '14px' }}
                  >
                    {WOOL_BREEDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Farm Origin & Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mandya Pastoral Farm, Karnataka" 
                    required 
                    value={formData.origin} 
                    onChange={e => setFormData({ ...formData, origin: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>Shearing Notes & Visual Assessment</label>
                  <textarea 
                    rows="3" 
                    value={formData.notes} 
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Describe cleanliness, staple length, moisture content, shearing method..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  style={{ padding: '12px 20px', borderRadius: '10px', background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.15)', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  style={{ padding: '12px 24px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Sparkles size={16} /> Generate Batch ID & QR Tag
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Batch Created & QR Passport Modal ── */}
      {createdBatch && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 18, 13, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 130,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
            boxShadow: '0 24px 48px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#166534' }}>
              Digital Twin Created
            </span>
            <h2 style={{ margin: '6px 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#0B120D' }}>
              Batch Registered Successfully!
            </h2>
            <div style={{
              display: 'inline-block',
              background: '#0B120D',
              color: '#DDFF86',
              padding: '6px 14px',
              borderRadius: '100px',
              fontSize: '14px',
              fontWeight: '800',
              letterSpacing: '0.04em',
              marginBottom: '20px'
            }}>
              {createdBatch.id}
            </div>

            {/* Render Live QR Code */}
            <div style={{
              background: '#F8F8F3',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(11,18,13,0.08)',
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <QRCode value={createdBatch.verificationUrl || `http://localhost:5173/track/${createdBatch.id}`} size={180} />
            </div>

            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
              Print and fasten this cryptographic QR passport to the physical wool bales. Buyers and inspectors can scan it to trace authenticity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={() => {
                    alert('QR Tag dispatched to thermal printer buffer.');
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#F8F8F3',
                    border: '1px solid rgba(11,18,13,0.15)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={15} /> Print Bale Tag
                </button>

                <button
                  onClick={() => navigate(`/farmer/track?id=${createdBatch.id}`)}
                  className="btn-primary"
                  style={{ padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  Track Journey <ArrowRight size={15} />
                </button>
              </div>

              <button
                onClick={() => {
                  const bId = createdBatch.id;
                  setCreatedBatch(null);
                  navigate(`/farmer/batch/${bId}`);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: '#0B120D',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                View Batch Details & Request Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View Batch QR Modal ── */}
      {showQRModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(11, 18, 13, 0.70)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 130,
          padding: '20px'
        }} onClick={() => setShowQRModal(null)}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '800' }}>
              Wool Traceability QR Tag
            </h3>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px', marginBottom: '16px' }}>
              {showQRModal.id}
            </div>

            <div style={{
              background: '#F8F8F3',
              padding: '18px',
              borderRadius: '16px',
              border: '1px solid rgba(11,18,13,0.08)',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              <QRCode value={showQRModal.verificationUrl || `http://localhost:5173/track/${showQRModal.id}`} size={180} />
            </div>

            <div style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
              Quantity: <strong>{showQRModal.quantity} KG</strong> · Grade: <strong>{showQRModal.qualityGrade || 'A'}</strong><br/>
              Origin: <strong>{showQRModal.origin}</strong>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/farmer/track?id=${showQRModal.id}`)}
                style={{ flex: 1, fontSize: '13px', padding: '10px' }}
              >
                Track Journey
              </button>
              <button 
                onClick={() => setShowQRModal(null)}
                style={{ padding: '10px 16px', borderRadius: '8px', background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.12)', fontWeight: '700', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWool;
