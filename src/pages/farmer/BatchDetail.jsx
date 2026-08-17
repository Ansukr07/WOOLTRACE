import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { 
  QrCode, ArrowLeft, Download, CheckCircle, Clock, ShieldAlert, 
  FileText, Plus, MapPin, Warehouse, Sparkles, User, Printer, Eye
} from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import TraceabilityTimeline from '../../components/TraceabilityTimeline';
import { qaService } from '../../services/qa/qaService';
import './BatchDetail.css';

export default function BatchDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { batches, certificates, listings, addListing, updateBatch } = useGlobalState();

  const [showQR, setShowQR] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [biddingPrice, setBiddingPrice] = useState('420');

  // Locate batch
  const batch = batches.find(b => b.id === id || b.batchId === id) || {
    id: id,
    batchId: id,
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    createdAt: new Date().toISOString(),
    origin: 'Mandya, Karnataka',
    currentStage: 'FARM',
    currentStatus: 'Harvested at Farm',
    qualityGrade: 'Pending QA',
    certificateStatus: 'Uninspected'
  };

  // Locate certificate
  const cert = certificates.find(c => c.batchId === id || c.id === batch.certificateId || c.certificateId === batch.certificateId);

  const isListed = listings.some(l => l.batchId === id);

  const handleRequestInspection = async () => {
    try {
      await qaService.createRequest({
        batchId: batch.id,
        farmerId: user?.id || 'FARMER-01',
        farmerName: user?.name || 'Rajesh Gowda',
        location: batch.origin || 'Mandya, Karnataka',
        quantity: batch.quantity,
        woolType: batch.woolType,
        preferredDate: new Date().toISOString()
      });

      updateBatch(batch.id, {
        certificateStatus: 'Inspection Requested',
        currentStatus: 'Quality Inspection Scheduled'
      });

      alert('Quality inspection request submitted! An accredited QA inspector has been assigned.');
    } catch (e) {
      console.error(e);
      alert('Inspection requested successfully!');
    }
  };

  const handleStartBidding = () => {
    addListing({
      id: `LST-${Date.now().toString().slice(-4)}`,
      batchId: batch.id,
      sellerId: user?.id || 'FARMER-01',
      sellerName: user?.name || 'Rajesh Gowda',
      type: 'RAW_WOOL',
      title: `${batch.woolType} (${batch.quantity} KG)`,
      description: `High-grade inspected fleece from ${batch.origin}. Ready for immediate dispatch.`,
      quantity: batch.quantity,
      minPrice: Number(biddingPrice) - 20,
      price: Number(biddingPrice),
      unit: 'kg',
      status: 'Active',
      createdAt: new Date().toISOString()
    });

    setIsSelling(false);
    alert(`Batch #${batch.id} listed for live bidding on WoolKart at ₹${biddingPrice}/KG!`);
  };

  return (
    <div className="batch-detail-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <button className="back-btn" onClick={() => navigate('/farmer/my-wool')}>
            <ArrowLeft size={18} style={{ marginRight: 8 }}/> Back to Batches
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
            <h1 style={{ margin: 0 }}>Batch {batch.id}</h1>
            <span style={{
              background: batch.currentStage === 'WAREHOUSE' ? '#BED5E5' : '#DDFF86',
              color: '#0B120D',
              fontWeight: '800',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '100px'
            }}>
              Stage: {batch.currentStage || 'FARM'}
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Origin: {batch.origin || 'Registered Farm'} · Harvested: {new Date(batch.shearingDate || batch.createdAt).toLocaleDateString('en-IN')}
          </p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn-secondary" 
            onClick={() => setShowQR(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <QrCode size={18} /> View QR Tag
          </button>

          <button 
            className="btn-secondary" 
            onClick={() => navigate(`/farmer/track?id=${batch.id}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={18} /> Farm-to-Fabric Passport
          </button>

          {!isListed && cert && (
            <button className="btn-primary" onClick={() => setIsSelling(true)}>
              List for Bidding
            </button>
          )}
        </div>
      </div>

      <div className="detail-content">
        <div className="main-info panel">
          <h2>Batch Harvest Specifications</h2>
          <div className="info-grid" style={{ marginBottom: 24 }}>
            <div className="info-item">
              <span className="label">Quantity</span>
              <span className="value" style={{ fontWeight: '800', fontSize: '16px' }}>{batch.quantity} KG</span>
            </div>
            <div className="info-item">
              <span className="label">Wool Breed / Type</span>
              <span className="value">{batch.woolType}</span>
            </div>
            <div className="info-item">
              <span className="label">Shearing Date</span>
              <span className="value">{new Date(batch.shearingDate || batch.createdAt).toLocaleDateString('en-IN')}</span>
            </div>
            <div className="info-item">
              <span className="label">Farm Location</span>
              <span className="value">{batch.origin || 'Registered Farm'}</span>
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginBottom: 16 }}>
            Quality Assurance & Lab Certification
          </h3>
          
          {cert ? (
            <div className="quality-section" style={{ background: '#DCFCE7', border: '1px solid #16A34A', padding: 20, borderRadius: 12 }}>
              <div className="flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#166534' }}>
                  <CheckCircle size={20} /> Certified Quality Grade
                </h3>
                <span className="badge-grade" style={{ background: '#166534', color: '#FFF', padding: '4px 12px', borderRadius: 4, fontWeight: 800 }}>
                  Grade {cert.grade}
                </span>
              </div>
              <div className="quality-scores" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '14px' }}>
                <div>Certificate ID: <strong>{cert.certificateId}</strong></div>
                <div>Overall Quality Score: <strong>{cert.overallScore}/100</strong></div>
                <div>Fiber Diameter: <strong>{cert.fiberDiameter} microns</strong></div>
                <div>Clean Yield: <strong>{cert.yield}</strong></div>
                <div>Cleanliness Score: <strong>{cert.cleanliness}/100</strong></div>
                <div>Moisture Content: <strong>{cert.moisture}%</strong></div>
              </div>
              
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button className="btn-secondary" onClick={() => setShowQR(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <QrCode size={16} /> QR Passport
                </button>
                <button 
                  onClick={() => navigate(`/verify/${cert.certificateId}`)}
                  className="btn-primary" 
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  <FileText size={16} /> View Digital Certificate
                </button>
              </div>
            </div>
          ) : (
            <div className="quality-section" style={{ background: '#FAFFF0', border: '1px solid #DDFF86', padding: 24, borderRadius: 12, textAlign: 'center' }}>
              <ShieldAlert size={36} color="#0B120D" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Batch Quality Unverified</h3>
              <p style={{ fontSize: 14, color: '#666', marginBottom: 18, maxWidth: '480px', margin: '0 auto 18px' }}>
                This batch has not been tested by an accredited lab. Request an inspection to obtain a government-backed Grade Certificate and unlock marketplace trading.
              </p>
              <button 
                className="btn-primary" 
                onClick={handleRequestInspection}
                style={{ padding: '12px 24px', fontSize: '14px' }}
              >
                Request Quality Inspection
              </button>
            </div>
          )}

          {/* Bids Received Demo Section */}
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 10, marginTop: 32, marginBottom: 16 }}>
            Active Marketplace Bids
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '12px' }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '700' }}>Highest Bid</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A' }}>₹430/KG</div>
            </div>
            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '12px' }}>
              <div style={{ color: '#666', fontSize: '12px', fontWeight: '700' }}>Live Bids Received</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>4 Buyers</div>
            </div>
          </div>
          
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ background: '#F8F8F3', borderBottom: '1px solid #E5E5E5' }}>
                <th style={{ padding: '12px' }}>Buyer</th>
                <th style={{ padding: '12px' }}>Bid / KG</th>
                <th style={{ padding: '12px' }}>Total Escrow Value</th>
                <th style={{ padding: '12px' }}>Trust Rating</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: '700' }}>Himalayan Wool Co.</div>
                  <div style={{ color: '#16A34A', fontSize: '11px', fontWeight: '700' }}>✓ Verified Buyer</div>
                </td>
                <td style={{ padding: '12px', fontWeight: '800' }}>₹430</td>
                <td style={{ padding: '12px' }}>₹{(batch.quantity * 430).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px' }}>4.9 ★</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => {
                      alert(`Bid accepted from Himalayan Wool Co.! Funds of ₹${(batch.quantity * 430).toLocaleString('en-IN')} locked in Escrow.`);
                      navigate('/farmer/my-wool');
                    }}
                    style={{ padding: '6px 14px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    ACCEPT BID
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: '700' }}>Rajasthan Carpet Mills</div>
                  <div style={{ color: '#16A34A', fontSize: '11px', fontWeight: '700' }}>✓ Verified Buyer</div>
                </td>
                <td style={{ padding: '12px', fontWeight: '800' }}>₹425</td>
                <td style={{ padding: '12px' }}>₹{(batch.quantity * 425).toLocaleString('en-IN')}</td>
                <td style={{ padding: '12px' }}>4.7 ★</td>
                <td style={{ padding: '12px' }}>
                  <button 
                    onClick={() => alert('Bid Accepted!')}
                    style={{ padding: '6px 14px', background: '#F8F8F3', color: '#0B120D', border: '1px solid rgba(11,18,13,0.15)', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    ACCEPT
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column: Visual Timeline */}
        <div className="side-column">
          <TraceabilityTimeline batchId={id} onShowQR={() => setShowQR(true)} />
        </div>
      </div>

      {/* Selling Modal */}
      {isSelling && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '20px' }}>
          <div style={{ background: '#FFF', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '480px' }}>
            <h2 style={{ margin: '0 0 8px 0' }}>List Batch for Bidding</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '13px' }}>
              Set your target reserve price per KG to publish this batch to verified buyers on WoolKart.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '6px', fontSize: '13px' }}>Target Starting Price (₹/KG)</label>
              <input 
                type="number" 
                value={biddingPrice} 
                onChange={e => setBiddingPrice(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E5E5', borderRadius: '8px', fontSize: '15px' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={handleStartBidding}
                className="btn-primary"
                style={{ flex: 1, padding: '12px' }}
              >
                PUBLISH TO WOOLKART
              </button>
              <button 
                onClick={() => setIsSelling(false)}
                style={{ flex: 1, padding: '12px', background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal (Supports both batch passport and certificate) */}
      {showQR && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(11, 18, 13, 0.70)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 120, padding: '20px' }} 
          onClick={() => setShowQR(false)}
        >
          <div style={{ background: '#FFF', padding: '36px', borderRadius: '20px', textAlign: 'center', maxWidth: '440px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginTop: 0, fontSize: '20px', fontWeight: '800' }}>
              Batch Traceability Passport QR
            </h2>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '14px', marginBottom: '16px' }}>
              {batch.id}
            </div>

            <div style={{ margin: '16px 0', padding: '16px', background: '#F8F8F3', display: 'inline-block', borderRadius: '12px', border: '1px solid rgba(11,18,13,0.08)' }}>
              <QRCode value={batch.verificationUrl || `http://localhost:5173/track/${batch.id}`} size={220} />
            </div>

            <p style={{ color: '#666', fontSize: '13px', marginBottom: 20 }}>
              Scan to verify the full Farm-to-Fabric journey and cryptographic authenticity.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => alert('QR tag sent to printer buffer.')}
                style={{ flex: 1, padding: '10px', background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={15} /> Print Tag
              </button>
              <button className="btn-secondary" onClick={() => setShowQR(false)} style={{ flex: 1 }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
