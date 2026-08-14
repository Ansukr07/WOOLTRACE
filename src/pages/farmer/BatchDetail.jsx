import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCode, ArrowLeft, Download, CheckCircle, Clock } from 'lucide-react';
import './BatchDetail.css';

const timelineStages = [
  { id: 1, title: 'Farm Collection', status: 'completed', date: '12 Aug 2026', location: 'Mysuru Farm' },
  { id: 2, title: 'Quality Inspection', status: 'completed', date: '14 Aug 2026', location: 'Mysuru Central Labs' },
  { id: 3, title: 'Market Listing', status: 'active', date: '15 Aug 2026', location: 'WoolTrace Market' },
  { id: 4, title: 'Buyer Selection', status: 'pending', date: '-', location: '-' },
  { id: 5, title: 'Transport', status: 'pending', date: '-', location: '-' },
  { id: 6, title: 'Warehouse', status: 'pending', date: '-', location: '-' },
  { id: 7, title: 'Processing', status: 'pending', date: '-', location: '-' }
];

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  const mockBids = [
    { id: 1, buyer: 'ABC Textiles', price: 425, rating: 4.8, verified: true, delivery: '3 Days' },
    { id: 2, buyer: 'Himalayan Wool Co.', price: 415, rating: 4.5, verified: true, delivery: '5 Days' },
    { id: 3, buyer: 'XYZ Fabrics', price: 400, rating: 4.2, verified: false, delivery: '7 Days' }
  ];

  const handleAcceptBid = (buyerName) => {
    alert(`You have accepted the offer from ${buyerName}. The payment will now be held in escrow.`);
    setIsSelling(false);
  };

  return (
    <div className="batch-detail-page">
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/farmer/my-wool')}>
            <ArrowLeft size={18} style={{marginRight: 8}}/> Back to Batches
          </button>
          <h1>Batch {id || 'WT-KA-2026-00124'}</h1>
          <p>Complete traceability and management for this batch.</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => setShowQR(true)}>
            <QrCode size={18} /> View QR
          </button>
          {!isSelling && (
            <button className="btn-primary" onClick={() => setIsSelling(true)}>Sell Batch</button>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info panel">
          <h2>Batch Details</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Quantity</span>
              <span className="value">428 KG</span>
            </div>
            <div className="info-item">
              <span className="label">Wool Type</span>
              <span className="value">Medium Wool</span>
            </div>
            <div className="info-item">
              <span className="label">Shearing Date</span>
              <span className="value">12 Aug 2026</span>
            </div>
            <div className="info-item">
              <span className="label">Origin</span>
              <span className="value">Mysuru, Karnataka</span>
            </div>
          </div>

          <div className="quality-section mt-4">
            <div className="flex-between">
              <h3>Quality Certificate</h3>
              <span className="badge-grade">Grade A</span>
            </div>
            <div className="quality-scores">
              <div>Fiber Diameter: <strong>22µm</strong></div>
              <div>Clean Yield: <strong>72%</strong></div>
              <div>Quality Score: <strong>87/100</strong></div>
            </div>
            <button className="download-btn mt-4">
              <Download size={16}/> Download Digital Certificate
            </button>
          </div>
        </div>

        <div className="side-column flex flex-col gap-4">
          {isSelling && (
            <div className="bidding-panel panel">
              <h2 style={{color: '#16A34A'}}>Live Reverse Bidding</h2>
              <p style={{fontSize: 13, color: '#666', marginBottom: 16}}>Buyers are actively bidding on this batch. Starting Price: ₹380/kg</p>
              <div className="bids-list">
                {mockBids.map(bid => (
                  <div key={bid.id} className="bid-card">
                    <div className="flex-between">
                      <strong style={{fontSize: 15}}>{bid.buyer} {bid.verified && '✓'}</strong>
                      <strong style={{fontSize: 18, color: '#0B120D'}}>₹{bid.price}/kg</strong>
                    </div>
                    <div className="flex-between" style={{fontSize: 12, color: '#666', marginTop: 4, marginBottom: 12}}>
                      <span>⭐ {bid.rating}</span>
                      <span>Est. {bid.delivery}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-primary" style={{flex: 1, padding: '8px'}} onClick={() => handleAcceptBid(bid.buyer)}>Accept</button>
                      <button className="btn-secondary" style={{padding: '8px'}}>Negotiate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="timeline-panel panel">
          <h2>Farm-to-Fabric Journey</h2>
          <div className="timeline">
            {timelineStages.map((stage, index) => (
              <div key={stage.id} className={`timeline-item ${stage.status}`}>
                <div className="timeline-marker">
                  {stage.status === 'completed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                  {index < timelineStages.length - 1 && <div className="timeline-line"></div>}
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

      {showQR && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={e => e.stopPropagation()}>
            <div className="qr-header">
              <h3>Digital Identity QR</h3>
              <button onClick={() => setShowQR(false)}>×</button>
            </div>
            <div className="qr-body">
              <div className="qr-placeholder">
                <QrCode size={120} />
              </div>
              <p>Scan this code to verify the Farm-to-Fabric journey of Batch {id}</p>
              <button className="btn-primary w-100">Print QR Code</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDetail;
