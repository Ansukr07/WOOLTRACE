import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { QrCode, ArrowLeft, Download, CheckCircle, Clock, ShieldAlert, FileText } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import './BatchDetail.css';

export default function BatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  const { batches, certificates, listings, orders } = useGlobalState();
  const [cert, setCert] = useState(null);

  const batch = batches.find(b => b.id === id);

  useEffect(() => {
    const foundCert = certificates.find(c => c.batchId === id);
    if (foundCert) {
      setCert(foundCert);
    }
  }, [id, certificates]);

  if (!batch) {
    return <div style={{padding: '32px'}}>Batch not found.</div>;
  }

  return (
    <div className="batch-detail-page">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/farmer/my-wool')}>
            <ArrowLeft size={18} style={{marginRight: 8}}/> Back to Batches
          </button>
          <h1>Batch {id}</h1>
          <p>Complete traceability and management for this batch.</p>
        </div>
        <div className="header-actions">
          {cert && (
            <button className="btn-secondary" onClick={() => setShowQR(true)}>
              <QrCode size={18} /> View QR
            </button>
          )}
          {!isSelling && cert && !listings.find(l => l.batchId === id) && (
            <button className="btn-primary" onClick={() => setIsSelling(true)}>Sell Batch</button>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info panel">
          <h2>Batch Details</h2>
          <div className="info-grid" style={{ marginBottom: 24 }}>
            <div className="info-item"><span className="label">Quantity</span><span className="value">{batch.quantity} KG</span></div>
            <div className="info-item"><span className="label">Wool Type</span><span className="value">{batch.type}</span></div>
            <div className="info-item"><span className="label">Shearing Date</span><span className="value">{new Date(batch.createdAt).toLocaleDateString()}</span></div>
            <div className="info-item"><span className="label">Origin</span><span className="value">{batch.location}</span></div>
          </div>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 16 }}>Quality Assurance</h3>
          
          {cert ? (
            <div className="quality-section" style={{ background: '#DCFCE7', border: '1px solid #16A34A', padding: 20, borderRadius: 12 }}>
              <div className="flex-between" style={{ marginBottom: 16 }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                  <CheckCircle size={20} /> Certified Quality
                </h3>
                <span className="badge-grade" style={{ background: '#166534', color: '#FFF', padding: '4px 12px', borderRadius: 4, fontWeight: 800 }}>Grade {cert.grade}</span>
              </div>
              <div className="quality-scores" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>Certificate ID: <strong>{cert.id}</strong></div>
                <div>Overall Score: <strong>{cert.qualityScore}/100</strong></div>
                <div>Fiber Diameter: <strong>{cert.micron}</strong></div>
                <div>Clean Yield: <strong>{cert.yield}</strong></div>
              </div>
            </div>
          ) : (
            <div className="quality-section" style={{ background: '#FAFFF0', border: '1px solid #DDFF86', padding: 20, borderRadius: 12, textAlign: 'center' }}>
              <ShieldAlert size={32} color="#0B120D" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 8px 0' }}>Quality Unverified</h3>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>This batch has not been inspected. Request a quality inspection to receive a digital certificate.</p>
              <button className="btn-primary">Request Quality Inspection</button>
            </div>
          )}
        </div>

        <div className="side-column">
          <TraceabilityTimeline batchId={id} />
        </div>
      </div>
    </div>
  );
}
