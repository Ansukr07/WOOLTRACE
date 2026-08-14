import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { QrCode, ArrowLeft, Download, CheckCircle, Clock, ShieldAlert, FileText } from 'lucide-react';
import { qaService } from '../../services/qa/qaService';
import './BatchDetail.css';

const timelineStages = [
  { id: 1, title: 'Farm Collection', status: 'completed', date: '12 Aug 2026', location: 'Mysuru Farm' },
  { id: 2, title: 'Quality Inspection', status: 'pending', date: '-', location: '-' },
  { id: 3, title: 'Market Listing', status: 'pending', date: '-', location: '-' },
  { id: 4, title: 'Buyer Selection', status: 'pending', date: '-', location: '-' },
  { id: 5, title: 'Transport', status: 'pending', date: '-', location: '-' },
  { id: 6, title: 'Warehouse', status: 'pending', date: '-', location: '-' },
  { id: 7, title: 'Processing', status: 'pending', date: '-', location: '-' }
];

export default function BatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  
  const [cert, setCert] = useState(null);
  const [requestObj, setRequestObj] = useState(null);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({
    preferredDate: '',
    location: 'Mysuru Farm',
    message: 'Please inspect this batch for grading and certification.'
  });

  useEffect(() => {
    loadQAInfo();
  }, [id]);

  const loadQAInfo = async () => {
    try {
      const c = await qaService.getCertificateByBatch(id);
      if (c) {
        setCert(c);
      } else {
        // Look for pending request
        const reqs = await qaService.getRequests({ farmerId: 'FARMER-01' });
        const batchReq = reqs.find(r => r.batchId === id);
        if (batchReq) setRequestObj(batchReq);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestInspection = async (e) => {
    e.preventDefault();
    try {
      const res = await qaService.createRequest({
        batchId: id,
        farmerId: 'FARMER-01',
        farmerName: 'Rajesh Kumar',
        location: reqForm.location,
        quantity: 428,
        woolType: 'Medium Wool',
        preferredDate: reqForm.preferredDate,
        message: reqForm.message
      });
      if (res.success) {
        setRequestObj(res.data);
        setShowReqModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Derive Timeline
  const currentTimeline = [...timelineStages];
  if (requestObj) {
    currentTimeline[1] = { id: 2, title: 'Quality Inspection', status: 'active', date: new Date().toLocaleDateString(), location: 'Pending Assignment' };
  }
  if (cert) {
    currentTimeline[1] = { id: 2, title: 'Quality Inspection', status: 'completed', date: new Date(cert.issuedAt).toLocaleDateString(), location: cert.inspectorName };
    currentTimeline[2] = { id: 3, title: 'Market Listing', status: 'active', date: new Date().toLocaleDateString(), location: 'WoolTrace Market' };
  }

  const mockBids = [
    { id: 1, buyer: 'ABC Textiles', price: 425, rating: 4.8, verified: true, delivery: '3 Days' },
    { id: 2, buyer: 'Himalayan Wool Co.', price: 415, rating: 4.5, verified: true, delivery: '5 Days' }
  ];

  const handleAcceptBid = (buyerName) => {
    setIsSelling(false);
  };

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
          {!isSelling && cert && (
            <button className="btn-primary" onClick={() => setIsSelling(true)}>Sell Batch</button>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info panel">
          <h2>Batch Details</h2>
          <div className="info-grid" style={{ marginBottom: 24 }}>
            <div className="info-item"><span className="label">Quantity</span><span className="value">428 KG</span></div>
            <div className="info-item"><span className="label">Wool Type</span><span className="value">Medium Wool</span></div>
            <div className="info-item"><span className="label">Shearing Date</span><span className="value">12 Aug 2026</span></div>
            <div className="info-item"><span className="label">Origin</span><span className="value">Mysuru, Karnataka</span></div>
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
                <div>Certificate ID: <strong>{cert.certificateId}</strong></div>
                <div>Overall Score: <strong>{cert.overallScore}/100</strong></div>
                <div>Fiber Diameter: <strong>{cert.fiberDiameter}µm</strong></div>
                <div>Cleanliness: <strong>{cert.cleanliness}%</strong></div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn-secondary" style={{ background: '#FFF' }} onClick={() => window.open(cert.verificationUrl, '_blank')}>
                  <FileText size={16}/> Verify Certificate
                </button>
                <button className="btn-secondary" style={{ background: '#FFF' }} onClick={() => window.open(`/api/qa/download-certificate?id=${cert.certificateId}`, '_blank')}>
                  <Download size={16}/> Download PDF
                </button>
              </div>
            </div>
          ) : requestObj ? (
            <div className="quality-section" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: 24, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ position: 'relative' }}>
                <div className="spinner" style={{ width: 48, height: 48, border: '4px solid #E0F2FE', borderTop: '4px solid #0EA5E9', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#0EA5E9' }}>
                  <Clock size={20} />
                </div>
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px 0', color: '#0369A1', fontSize: 18 }}>Inspection Requested</h3>
                <p style={{ margin: 0, fontSize: 14, color: '#0C4A6E', lineHeight: 1.5 }}>
                  Your request <strong>({requestObj.requestId})</strong> is currently <strong style={{background: '#0EA5E9', color: '#FFF', padding: '2px 8px', borderRadius: 12, fontSize: 12}}>{requestObj.status.replace('_', ' ')}</strong>.<br/>
                  Please wait while an Authorized Quality Inspector is assigned to your batch.
                </p>
              </div>
            </div>
          ) : (
            <div className="quality-section" style={{ background: '#FAFFF0', border: '1px solid #DDFF86', padding: 20, borderRadius: 12, textAlign: 'center' }}>
              <ShieldAlert size={32} color="#0B120D" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 8px 0' }}>Quality Unverified</h3>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>This batch has not been inspected. Request a quality inspection to receive a digital certificate.</p>
              <button className="btn-primary" onClick={() => setShowReqModal(true)}>Request Quality Inspection</button>
            </div>
          )}
        </div>

        <div className="side-column flex flex-col gap-4">
          {isSelling && (
            <div className="bidding-panel panel">
              <h2 style={{color: '#16A34A'}}>Live Reverse Bidding</h2>
              <p style={{fontSize: 13, color: '#666', marginBottom: 16}}>Buyers are actively bidding on this certified batch. Starting Price: ₹380/kg</p>
              <div className="bids-list">
                {mockBids.map(bid => (
                  <div key={bid.id} className="bid-card">
                    <div className="flex-between">
                      <strong style={{fontSize: 15}}>{bid.buyer} {bid.verified && '✓'}</strong>
                      <strong style={{fontSize: 18, color: '#0B120D'}}>₹{bid.price}/kg</strong>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="btn-primary" style={{flex: 1, padding: '8px'}} onClick={() => handleAcceptBid(bid.buyer)}>Accept</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="timeline-panel panel">
            <h2>Farm-to-Fabric Journey</h2>
            <div className="timeline">
              {currentTimeline.map((stage, index) => (
                <div key={stage.id} className={`timeline-item ${stage.status}`}>
                  <div className="timeline-marker">
                    {stage.status === 'completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    {index < currentTimeline.length - 1 && <div className="timeline-line"></div>}
                  </div>
                  <div className="timeline-content">
                    <h4>{stage.title}</h4>
                    <div className="timeline-meta">
                      <span>{stage.date}</span>
                      <span>•</span>
                      <span>{stage.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showReqModal && (
        <div className="qr-modal-overlay">
          <div className="qr-modal panel" style={{ maxWidth: 500 }}>
            <h2 style={{ margin: '0 0 16px 0' }}>Request Quality Inspection</h2>
            <form onSubmit={handleRequestInspection} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>Preferred Date</label>
                <input type="date" className="filter-select" style={{ width: '100%' }} value={reqForm.preferredDate} onChange={e => setReqForm({...reqForm, preferredDate: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>Location</label>
                <input type="text" className="filter-select" style={{ width: '100%' }} value={reqForm.location} onChange={e => setReqForm({...reqForm, location: e.target.value})} required />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 4 }}>Additional Message</label>
                <textarea rows="3" className="filter-select" style={{ width: '100%' }} value={reqForm.message} onChange={e => setReqForm({...reqForm, message: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowReqModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQR && cert && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <div className="qr-header">
              <h3>Digital Identity QR</h3>
              <button onClick={() => setShowQR(false)}>×</button>
            </div>
            <div className="qr-body">
              <div style={{ background: '#FFF', padding: 20, borderRadius: 12, display: 'inline-block', border: '1px solid #E5E5E5', marginBottom: 16 }}>
                <QRCode value={cert.verificationUrl} size={200} />
              </div>
              <p>Scan this code to verify the Quality Certificate and Farm-to-Fabric journey of Batch {id}</p>
              <button className="btn-primary w-100" onClick={() => window.open(cert.verificationUrl, '_blank')}>Open Verification Page</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
