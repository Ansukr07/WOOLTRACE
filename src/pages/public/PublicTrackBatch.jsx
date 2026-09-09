import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Box } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import { qaService } from '../../services/qa/qaService';
import './PublicTrackBatch.css';

export default function PublicTrackBatch() {
  const { batchId } = useParams();
  const { batches, certificates } = useGlobalState();
  const [backendBatch, setBackendBatch] = useState(null);
  const [backendCert, setBackendCert] = useState(null);

  const targetId = batchId || 'WT-KA-2026-00124';
  const localBatch = batches.find(b =>
    (b.id || '').toLowerCase() === targetId.toLowerCase() ||
    (b.batchId || '').toLowerCase() === targetId.toLowerCase()
  );
  const batch = localBatch || backendBatch;

  const cert = backendCert || certificates.find(c =>
    (c.batchId || '').toLowerCase() === targetId.toLowerCase() ||
    (c.certificateId || '').toLowerCase() === (batch?.certificateId || '').toLowerCase()
  );
  const publicGrade = cert?.grade || (
    batch?.qualityGrade && batch.qualityGrade !== 'Pending QA' ? batch.qualityGrade : 'Pending QA'
  );

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      qaService.getBatchById(targetId),
      qaService.getCertificateByBatch(targetId)
    ])
      .then(([loadedBatch, loadedCert]) => {
        if (!isMounted) return;
        setBackendBatch(loadedBatch);
        setBackendCert(loadedCert);
      })
      .catch(() => {
        if (!isMounted) return;
        setBackendBatch(null);
        setBackendCert(null);
      });

    return () => {
      isMounted = false;
    };
  }, [targetId]);

  if (!batch) {
    return (
      <div className="public-track-page">
        <div className="public-track-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Box size={56} color="#888" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', marginBottom: '8px' }}>
            Batch Verification Not Found
          </h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            The requested batch ID <strong>{batchId}</strong> does not exist in KhetSetu public traceability records.
          </p>
          <Link to="/" style={{ textDecoration: 'none', background: '#0B120D', color: '#DDFF86', padding: '10px 20px', borderRadius: '8px', fontWeight: '700' }}>
            Return to WoolTrace
          </Link>
        </div>
      </div>
    );
  }

  const maskedFarmer = 'Registered KhetSetu Producer';

  return (
    <div className="public-track-page">
      <div className="public-track-container">
        <div className="public-brand-bar">
          <Link to="/" className="public-logo">
            WOOL<span>TRACE</span>
          </Link>
          <div className="public-badge">
            <ShieldCheck size={14} color="#DDFF86" /> Verified Digital Identity
          </div>
        </div>

        <div className="public-main-card">
          <div className="public-cert-header">
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666' }}>
              Official Farm-to-Market Produce Passport
            </span>
            <div className="public-batch-pill">
              Batch {batch.id || batch.batchId}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', fontSize: '14px' }}>
              <CheckCircle2 size={16} /> Verified through KhetSetu Traceability Records
            </div>
          </div>

          <div className="public-info-grid">
            <div className="public-info-item">
              <label>Produce Variety</label>
              <div className="val">{batch.woolType}</div>
            </div>
            <div className="public-info-item">
              <label>Batch Net Weight</label>
              <div className="val">{batch.quantity} KG</div>
            </div>
            <div className="public-info-item">
              <label>Region of Origin</label>
              <div className="val">{batch.origin || 'Recorded region unavailable'}</div>
            </div>
            <div className="public-info-item">
              <label>Producer Authentication</label>
              <div className="val">Verified Producer ({maskedFarmer})</div>
            </div>
            <div className="public-info-item">
              <label>Quality Grade</label>
              <div className="val" style={{ color: '#166534', fontWeight: '800' }}>
                {publicGrade}
              </div>
            </div>
            <div className="public-info-item">
              <label>Current Status</label>
              <div className="val">{batch.currentStatus}</div>
            </div>
          </div>

          <TraceabilityTimeline batchId={batch.id || batch.batchId} batchOverride={batch} publicView />

          <div style={{ textAlign: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(11, 18, 13, 0.08)', fontSize: '12px', color: '#888' }}>
            KhetSetu Traceability Passport - Public provenance is limited to safe production, quality, and movement records.
          </div>
        </div>
      </div>
    </div>
  );
}
