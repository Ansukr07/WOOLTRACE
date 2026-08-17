import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, MapPin, Sparkles, Box, ArrowLeft, Building2 } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import './PublicTrackBatch.css';

export default function PublicTrackBatch() {
  const { batchId } = useParams();
  const { batches, certificates } = useGlobalState();

  const targetId = batchId || 'WT-KA-2026-00124';
  const batch = batches.find(b => 
    (b.id || '').toLowerCase() === targetId.toLowerCase() ||
    (b.batchId || '').toLowerCase() === targetId.toLowerCase()
  );

  const cert = certificates.find(c => 
    (c.batchId || '').toLowerCase() === targetId.toLowerCase()
  );

  if (!batch) {
    return (
      <div className="public-track-page">
        <div className="public-track-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Box size={56} color="#888" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', marginBottom: '8px' }}>
            Batch Verification Not Found
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            The requested batch ID <strong>{batchId}</strong> does not exist in the public WoolTrace ledger.
          </p>
          <Link to="/" style={{ textDecoration: 'none', background: '#0B120D', color: '#DDFF86', padding: '10px 20px', borderRadius: '8px', fontWeight: '700' }}>
            Return to WoolTrace
          </Link>
        </div>
      </div>
    );
  }

  // Sanitized origin without disclosing private address or phone numbers
  const maskedFarmer = 'Registered WoolTrace Grower';

  return (
    <div className="public-track-page">
      <div className="public-track-container">
        {/* Brand Bar */}
        <div className="public-brand-bar">
          <Link to="/" className="public-logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="public-badge">
            <ShieldCheck size={14} color="#DDFF86" /> Verified Digital Identity
          </div>
        </div>

        {/* Main Public Certificate Card */}
        <div className="public-main-card">
          <div className="public-cert-header">
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>
              Official Farm-to-Fabric Passport
            </span>
            <div className="public-batch-pill">
              Batch {batch.id || batch.batchId}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', fontSize: '14px' }}>
              <CheckCircle2 size={16} /> Authenticated on WoolTrace Decentralized Supply Ledger
            </div>
          </div>

          {/* Clean Public Overview (Privacy-Safe) */}
          <div className="public-info-grid">
            <div className="public-info-item">
              <label>Wool Variety</label>
              <div className="val">{batch.woolType}</div>
            </div>
            <div className="public-info-item">
              <label>Batch Net Weight</label>
              <div className="val">{batch.quantity} KG</div>
            </div>
            <div className="public-info-item">
              <label>Region of Origin</label>
              <div className="val">{batch.origin || 'Karnataka, India'}</div>
            </div>
            <div className="public-info-item">
              <label>Producer Authentication</label>
              <div className="val">Verified Producer ({maskedFarmer})</div>
            </div>
            <div className="public-info-item">
              <label>Quality Grade</label>
              <div className="val" style={{ color: '#166534', fontWeight: '800' }}>
                Grade {batch.qualityGrade || cert?.grade || 'A'}
              </div>
            </div>
            <div className="public-info-item">
              <label>Current Status</label>
              <div className="val">{batch.currentStatus}</div>
            </div>
          </div>

          {/* Complete Farm-to-Fabric Timeline & Immutable Events */}
          <TraceabilityTimeline batchId={batch.id || batch.batchId} />

          {/* Footer Note */}
          <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(11, 18, 13, 0.08)', fontSize: '12px', color: '#888' }}>
            WoolTrace Digital Identity System · Built for SIH · Every wool batch has a verified digital identity from farm to fabric.
          </div>
        </div>
      </div>
    </div>
  );
}
