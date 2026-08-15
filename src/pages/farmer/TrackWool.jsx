import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, Box, ShieldCheck, MapPin, QrCode, ExternalLink, 
  ArrowRight, Download, CheckCircle, Clock, Warehouse, Sparkles, X
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { useGlobalState } from '../../context/GlobalStateContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import './TrackWool.css';

export default function TrackWool() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { batches, certificates } = useGlobalState();

  const initialQuery = searchParams.get('id') || 'WT-KA-2026-00124';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedBatchId, setSelectedBatchId] = useState(initialQuery);
  const [showQRModal, setShowQRModal] = useState(false);

  // Match selected batch
  const currentBatch = batches.find(b => 
    (b.id || '').toLowerCase() === selectedBatchId.toLowerCase() ||
    (b.batchId || '').toLowerCase() === selectedBatchId.toLowerCase()
  ) || batches[0];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedBatchId(searchQuery.trim());
      setSearchParams({ id: searchQuery.trim() });
    }
  };

  const handleSelectQuick = (batchId) => {
    setSearchQuery(batchId);
    setSelectedBatchId(batchId);
    setSearchParams({ id: batchId });
  };

  // Public verification URL
  const publicVerifyUrl = `${window.location.origin}/track/${currentBatch?.id || 'WT-KA-2026-00124'}`;

  return (
    <div className="track-wool-page">
      {/* Header */}
      <div className="track-wool-header">
        <div>
          <h1 className="track-wool-title">
            <Sparkles size={28} color="#0B120D" /> Track Wool Batch
          </h1>
          <p className="track-wool-subtitle">
            Every wool batch has a verified digital identity from farm to fabric.
          </p>
        </div>
      </div>

      {/* Search & Quick Filter Section */}
      <div className="search-section">
        <form onSubmit={handleSearchSubmit} className="search-input-group">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              placeholder="Enter Batch ID (e.g. WT-KA-2026-00124)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-search">
            Track Journey <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Batch Selector */}
        <div className="quick-select-row">
          <span className="quick-select-label">Available Batches:</span>
          {batches.map((b) => (
            <button
              key={b.id || b.batchId}
              type="button"
              className={`quick-chip ${(b.id === selectedBatchId || b.batchId === selectedBatchId) ? 'active' : ''}`}
              onClick={() => handleSelectQuick(b.id || b.batchId)}
            >
              {b.id || b.batchId} ({b.woolType?.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Batch Not Found View */}
      {!currentBatch ? (
        <div style={{
          background: '#FFFFFF',
          padding: '48px',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid rgba(11, 18, 13, 0.10)'
        }}>
          <Box size={48} color="#999" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '18px', color: '#0B120D', margin: '0 0 8px 0' }}>Batch Not Found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            No wool batch matched "{selectedBatchId}". Please verify the Batch ID.
          </p>
          <button 
            className="quick-chip active"
            onClick={() => handleSelectQuick('WT-KA-2026-00124')}
          >
            Load Example: WT-KA-2026-00124
          </button>
        </div>
      ) : (
        /* Main Two-Column Layout */
        <div className="tracking-layout-grid">
          {/* Left Column: Batch Overview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="batch-overview-card">
              <div className="batch-card-header">
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#777', letterSpacing: '0.05em' }}>
                    Digital Identity
                  </span>
                  <div className="batch-id-tag">{currentBatch.id || currentBatch.batchId}</div>
                </div>
                {currentBatch.qualityGrade && (
                  <span className="grade-badge">Grade {currentBatch.qualityGrade}</span>
                )}
              </div>

              {/* Status Highlight Banner */}
              <div className="status-highlight-box">
                <div className="status-highlight-title">Current Status & Location</div>
                <div className="status-highlight-desc">{currentBatch.currentStatus}</div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} /> {currentBatch.currentLocation || currentBatch.origin}
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Quantity</span>
                  <span className="meta-val">{currentBatch.quantity} KG</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Wool Type</span>
                  <span className="meta-val">{currentBatch.woolType}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Farmer / Origin</span>
                  <span className="meta-val">{currentBatch.farmerName}<br/><small style={{ fontWeight: 'normal', color: '#666' }}>{currentBatch.origin}</small></span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Quality Certificate</span>
                  <span className="meta-val" style={{ color: '#166534' }}>
                    {currentBatch.certificateStatus === 'Certified' ? '✓ Verified Digital Cert' : 'Pending Verification'}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Shearing Date</span>
                  <span className="meta-val">
                    {new Date(currentBatch.shearingDate || currentBatch.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Current Stage</span>
                  <span className="meta-val" style={{ color: '#0B120D', fontWeight: '800' }}>
                    {currentBatch.currentStage || 'FARM'}
                  </span>
                </div>
              </div>

              {/* Storage Location info if assigned */}
              {currentBatch.storageLocation && (
                <div style={{
                  background: '#EDEDCE',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid rgba(11, 18, 13, 0.12)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#555', marginBottom: '4px' }}>
                    Physical Warehouse Storage Slot
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#0B120D' }}>
                    Zone {currentBatch.storageLocation.zone} · Rack {currentBatch.storageLocation.rack} · Section {currentBatch.storageLocation.section} · Position {currentBatch.storageLocation.position}
                  </div>
                </div>
              )}

              {/* QR Code Action Box */}
              <div className="qr-preview-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', border: '1px solid rgba(11, 18, 13, 0.12)' }}>
                    <QRCode value={publicVerifyUrl} size={48} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13px', color: '#0B120D', display: 'block' }}>Public Verification QR</strong>
                    <span style={{ fontSize: '11px', color: '#555' }}>Scan to view verified journey</span>
                  </div>
                </div>
                <button className="qr-btn" onClick={() => setShowQRModal(true)}>
                  <QrCode size={14} /> Enlarge QR
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Timeline & Event History */}
          <div>
            <TraceabilityTimeline 
              batchId={currentBatch.id || currentBatch.batchId} 
              onShowQR={() => setShowQRModal(true)} 
            />
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && currentBatch && (
        <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>
                Batch Verification QR
              </h3>
              <button 
                onClick={() => setShowQRModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '12px',
              border: '2px solid #0B120D',
              display: 'inline-block',
              margin: '12px 0 20px 0'
            }}>
              <QRCode value={publicVerifyUrl} size={220} />
            </div>

            <div style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D', marginBottom: '4px' }}>
              {currentBatch.id || currentBatch.batchId}
            </div>
            <p style={{ fontSize: '13px', color: '#666', margin: '0 0 20px 0' }}>
              Anyone scanning this QR code can authenticate the entire wool journey from farm to fabric without exposing private contact info.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <a
                href={`/track/${currentBatch.id || currentBatch.batchId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  background: '#0B120D',
                  color: '#DDFF86',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Open Public Page <ExternalLink size={14} />
              </a>
              <button
                className="quick-chip"
                onClick={() => setShowQRModal(false)}
                style={{ padding: '10px 18px', borderRadius: '8px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
