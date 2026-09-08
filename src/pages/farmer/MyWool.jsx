import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { COMMODITIES, COMMODITY_CATEGORIES, getCommodityById } from '../../services/market/cropCommodityRegistry';
import { 
  Box, 
  Plus, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  Filter,
  Warehouse,
  Scale,
  Calendar,
  ShieldCheck,
  Target
} from 'lucide-react';
import QRCode from 'react-qr-code';
import './MyWool.css';

const MyWool = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches = [], addBatch } = useGlobalState();
  
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [isCreating, setIsCreating] = useState(false);
  const [createdBatch, setCreatedBatch] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);

  // Form State
  const [selectedCropId, setSelectedCropId] = useState('WHEAT');
  const [variety, setVariety] = useState('Sharbati');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('KG');
  const [origin, setOrigin] = useState(user?.location || 'Khanna Farm, Punjab');
  const [qualityGrade, setQualityGrade] = useState('A');
  const [harvestDate, setHarvestDate] = useState(new Date().toISOString().split('T')[0]);
  const [qualityAttributes, setQualityAttributes] = useState({});
  const [storageType, setStorageType] = useState('DRY_SILO');

  const selectedCommodity = getCommodityById(selectedCropId);

  const handleCropChange = (cropId) => {
    setSelectedCropId(cropId);
    const item = getCommodityById(cropId);
    if (item.varieties && item.varieties.length > 0) {
      setVariety(item.varieties[0]);
    }
    setUnit(item.defaultUnit || 'KG');
    setQualityAttributes({});
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const prefix = selectedCropId === 'WHEAT' ? 'PB' :
                   selectedCropId === 'TOMATO' ? 'KA' :
                   selectedCropId === 'ONION' ? 'MH' :
                   selectedCropId === 'COTTON' ? 'GJ' :
                   selectedCropId === 'APPLE' ? 'HP' : 'WT';
    
    const newBatchId = `WT-${prefix}-2026-00${randomSuffix}`;

    const newBatch = {
      id: newBatchId,
      batchId: newBatchId,
      farmerId: user?.id || 'FARMER-01',
      farmerName: user?.name || 'Ramesh Kumar',
      cropId: selectedCropId,
      cropName: selectedCommodity.name,
      woolType: `${selectedCommodity.name} (Grade ${qualityGrade})`,
      variety,
      quantity: Number(quantity),
      unit,
      origin,
      qualityGrade,
      harvestDate: new Date(harvestDate).toISOString(),
      createdAt: new Date().toISOString(),
      currentStage: 'FARM',
      currentStatus: 'Ready for Quality Inspection / Market Sale',
      currentLocation: origin,
      qualityAttributes,
      certificateStatus: 'Self-Declared Grade',
      verificationUrl: `http://localhost:5173/track/${newBatchId}`,
      events: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          stage: 'FARM',
          title: 'Farm Harvest Registered',
          location: origin,
          status: 'Completed',
          actor: `${user?.name || 'Ramesh Kumar'} (Farmer)`,
          description: `Batch of ${quantity} ${unit} ${variety} ${selectedCommodity.name} registered with self-declared Grade ${qualityGrade}.`
        }
      ]
    };

    if (addBatch) {
      addBatch(newBatch);
    }
    
    setIsCreating(false);
    setCreatedBatch(newBatch);
  };

  const filteredBatches = batches.filter(b => {
    if (activeCategory === 'ALL') return true;
    const item = getCommodityById(b.cropId || b.woolType);
    return item.category === activeCategory;
  });

  return (
    <div className="my-wool-container">
      {/* Top Banner */}
      <div className="my-wool-header">
        <div>
          <span style={{ background: '#DDFF86', color: '#0B120D', fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
            SIH 2026 · Farm Produce Inventory
          </span>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', margin: '6px 0 4px 0' }}>
            My Produce Batches & Digital Passports
          </h1>
          <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>
            Register harvests, generate cryptographic QR tags, and link verified lots directly to the national buyer marketplace.
          </p>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setIsCreating(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px' }}
        >
          <Plus size={18} /> Register Produce Batch
        </button>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
        {COMMODITY_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: activeCategory === cat.id ? '#0B120D' : '#FFFFFF',
              color: activeCategory === cat.id ? '#FFFFFF' : '#0B120D',
              border: '1px solid rgba(11,18,13,0.12)',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Batches Grid */}
      {filteredBatches.length === 0 ? (
        <div style={{ background: '#FFFFFF', padding: '60px 20px', textAlign: 'center', borderRadius: '16px', border: '1px solid rgba(11,18,13,0.10)' }}>
          <Box size={40} style={{ color: '#64748B', margin: '0 auto 12px', opacity: 0.6 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0' }}>No produce batches found in this category</h3>
          <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 16px 0' }}>
            Register a harvest to generate a batch ID, QR passport, and discover real-time buyer quotes.
          </p>
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            <Plus size={16} /> Register Batch
          </button>
        </div>
      ) : (
        <div className="batches-grid">
          {filteredBatches.map(b => (
            <div key={b.id || b.batchId} className="batch-card" style={{ background: '#FFFFFF', border: '1px solid rgba(11,18,13,0.10)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D', background: '#F8F8F3', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(11,18,13,0.08)' }}>
                    {b.id || b.batchId}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '800', background: '#DDFF86', color: '#0B120D', padding: '3px 8px', borderRadius: '4px' }}>
                    Grade {b.qualityGrade || 'A'}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D', margin: '0 0 4px 0' }}>
                  {b.cropName || b.woolType}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} />
                  <span>{b.origin}</span>
                </div>

                <div style={{ background: '#F8F8F3', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Quantity:</span>
                    <strong>{b.quantity} {b.unit || 'KG'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Stage:</span>
                    <strong style={{ color: '#0B120D' }}>{b.currentStage}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Status:</span>
                    <span style={{ color: '#0B120D', fontWeight: '600' }}>{b.currentStatus}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button 
                  onClick={() => setShowQRModal(b)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.12)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <QrCode size={14} /> QR Tag
                </button>
                <button 
                  onClick={() => navigate(`/farmer/track?id=${b.id || b.batchId}`)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', background: '#0B120D', color: '#FFFFFF', border: 'none', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  Passport →
                </button>
                <button 
                  onClick={() => navigate(`/farmer/market?crop=${b.cropId || 'WHEAT'}`)}
                  style={{ padding: '8px', borderRadius: '8px', background: '#DDFF86', color: '#0B120D', border: '1px solid rgba(11,18,13,0.15)', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Discover Market Price"
                >
                  <Target size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Register Produce Batch ── */}
      {isCreating && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.70)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '18px', maxWidth: '600px', width: '100%',
            maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(11,18,13,0.10)', paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#0B120D' }}>
                Register Farm Produce Batch
              </h2>
              <button onClick={() => setIsCreating(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}>✕</button>
            </div>

            <form onSubmit={handleCreateBatch}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Select Commodity</label>
                  <select 
                    value={selectedCropId} 
                    onChange={(e) => handleCropChange(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC', fontSize: '14px' }}
                  >
                    {COMMODITIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Variety</label>
                    <select 
                      value={variety} 
                      onChange={(e) => setVariety(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}
                    >
                      {selectedCommodity.varieties.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Quality Grade</label>
                    <select 
                      value={qualityGrade} 
                      onChange={(e) => setQualityGrade(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}
                    >
                      <option value="A+">Grade A+ (Premium / Export)</option>
                      <option value="A">Grade A (Standard Mill Grade)</option>
                      <option value="B">Grade B (Commercial Fair)</option>
                      <option value="C">Grade C (Standard)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Harvest Quantity</label>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 500" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} 
                      required 
                      min="1"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Unit</label>
                    <select 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }}
                    >
                      {selectedCommodity.supportedUnits.map(u => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Farm Location / Origin</label>
                    <input 
                      type="text" 
                      value={origin} 
                      onChange={(e) => setOrigin(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Harvest Date</label>
                    <input 
                      type="date" 
                      value={harvestDate} 
                      onChange={(e) => setHarvestDate(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CCC' }} 
                      required 
                    />
                  </div>
                </div>

                {/* Dynamic Quality Schemas */}
                {selectedCommodity.qualitySchema && selectedCommodity.qualitySchema.length > 0 && (
                  <div style={{ background: '#F8F8F3', padding: '12px', borderRadius: '10px', border: '1px solid rgba(11,18,13,0.08)' }}>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#0B120D', marginBottom: '8px', display: 'block' }}>
                      Crop Quality Specifications ({selectedCommodity.name}):
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {selectedCommodity.qualitySchema.map(q => (
                        <div key={q.key}>
                          <label style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>{q.label}</label>
                          <select 
                            value={qualityAttributes[q.key] || q.options[0]}
                            onChange={(e) => setQualityAttributes(prev => ({ ...prev, [q.key]: e.target.value }))}
                            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CCC', fontSize: '12px' }}
                          >
                            {q.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate Batch ID & QR Tag</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Modal: Batch Created & QR Passport ── */}
      {createdBatch && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF', borderRadius: '20px', maxWidth: '480px', width: '100%',
            padding: '32px 24px', textAlign: 'center', boxShadow: '0 20px 48px rgba(0,0,0,0.25)'
          }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#DDFF86', color: '#0B120D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <CheckCircle2 size={28} />
            </div>

            <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#0B120D' }}>
              Digital Twin Created
            </span>
            <h2 style={{ margin: '4px 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#0B120D' }}>
              Produce Batch Registered!
            </h2>
            <div style={{ display: 'inline-block', background: '#0B120D', color: '#DDFF86', padding: '4px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '800', marginBottom: '16px' }}>
              {createdBatch.id}
            </div>

            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '14px', display: 'inline-block', marginBottom: '16px' }}>
              <QRCode value={createdBatch.verificationUrl || `http://localhost:5173/track/${createdBatch.id}`} size={160} />
            </div>

            <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#64748B' }}>
              Cryptographic QR Passport generated for {createdBatch.quantity} {createdBatch.unit} {createdBatch.cropName}.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate(`/farmer/market?crop=${createdBatch.cropId || 'WHEAT'}`)}
                className="btn-accent"
                style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Target size={14} /> Price Discovery
              </button>
              <button 
                onClick={() => {
                  const bId = createdBatch.id;
                  setCreatedBatch(null);
                  navigate(`/farmer/track?id=${bId}`);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
              >
                View Passport
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── View QR Modal ── */}
      {showQRModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(11, 18, 13, 0.70)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, padding: '20px'
        }} onClick={() => setShowQRModal(null)}>
          <div style={{
            background: '#FFFFFF', borderRadius: '18px', maxWidth: '420px', width: '100%',
            padding: '28px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>
              Produce Traceability QR Tag
            </h3>
            <div style={{ fontWeight: '800', color: '#0B120D', fontSize: '13px', marginBottom: '14px' }}>
              {showQRModal.id}
            </div>

            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '14px', display: 'inline-block', marginBottom: '14px' }}>
              <QRCode value={showQRModal.verificationUrl || `http://localhost:5173/track/${showQRModal.id}`} size={160} />
            </div>

            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
              <strong>{showQRModal.cropName || showQRModal.woolType}</strong> · {showQRModal.quantity} {showQRModal.unit || 'KG'} · Grade {showQRModal.qualityGrade || 'A'}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn-primary" 
                onClick={() => navigate(`/farmer/track?id=${showQRModal.id}`)}
                style={{ flex: 1, fontSize: '12px', padding: '8px' }}
              >
                Track Passport
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowQRModal(null)}
                style={{ fontSize: '12px', padding: '8px 14px' }}
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
