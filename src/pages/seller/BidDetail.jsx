import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, ArrowLeft, Info } from 'lucide-react';

export default function BidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidPrice, setBidPrice] = useState(430);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Dummy batch data for SIH Demo
  const batch = {
    id: id || 'WT-KA-2026-00124',
    type: 'Medium Wool',
    quantity: 428,
    grade: 'A',
    qualityScore: 87,
    origin: 'Mysuru, Karnataka',
    shearingDate: '12 Aug 2026',
    certificate: 'WTC-QA-2026-00124',
    farmer: {
      name: 'Rajesh Kumar',
      location: 'Mysuru, Karnataka',
      verified: true
    },
    bidding: {
      startingPrice: 380,
      highestBid: 425,
      bidsCount: 12,
      minIncrement: 5,
      timeRemaining: '2h 18m',
      closingDate: '14 Aug 2026',
      closingTime: '8:30 PM'
    }
  };

  const minAcceptableBid = batch.bidding.highestBid + batch.bidding.minIncrement;

  const handlePlaceBid = () => {
    if (bidPrice < minAcceptableBid) {
      setErrorMsg(`Your bid must be at least ₹${minAcceptableBid}/kg.`);
      return;
    }
    setErrorMsg('');
    setShowConfirm(true);
  };

  const confirmBid = () => {
    setShowConfirm(false);
    setBidSuccess(true);
  };

  if (bidSuccess) {
    return (
      <div style={{ padding: '64px', maxWidth: '600px', margin: '0 auto', textAlign: 'center', color: '#0B120D' }}>
        <div style={{ width: '80px', height: '80px', background: '#DCFCE7', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <ShieldCheck size={40} color="#16A34A" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>✓ BID PLACED</h1>
        
        <div style={{ background: '#F8F8F3', padding: '24px', borderRadius: '12px', marginBottom: '32px' }}>
          <div style={{ color: '#666', marginBottom: '8px' }}>Your offer</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>₹{bidPrice}/kg</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E5E5', paddingTop: '16px' }}>
            <div style={{ color: '#666' }}>Total</div>
            <div style={{ fontWeight: '700' }}>₹{(bidPrice * batch.quantity).toLocaleString()}</div>
          </div>
        </div>

        <div style={{ display: 'inline-block', padding: '8px 16px', background: '#0B120D', color: '#DDFF86', borderRadius: '20px', fontWeight: '700', fontSize: '14px', marginBottom: '32px' }}>
          HIGHEST BID
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => navigate('/seller/bids')} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            VIEW MY BIDS
          </button>
          <button onClick={() => navigate('/seller')} style={{ flex: 1, padding: '12px', background: '#FFF', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            CONTINUE BROWSING
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', color: '#0B120D' }}>
      <button onClick={() => navigate('/seller/bids')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Back to Bids
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* Left Column */}
        <div>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>WOOL BATCH</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '24px' }}>{batch.id}</h1>
          
          <div style={{ width: '100%', height: '300px', background: '#F8F8F3', borderRadius: '12px', overflow: 'hidden', marginBottom: '32px' }}>
            <img src={`https://placehold.co/800x400/EDEDCE/0B120D?text=Wool+Batch+${batch.id.split('-').pop()}`} alt="Batch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '8px', marginBottom: '16px' }}>BATCH INFORMATION</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Wool Type</div>
              <div style={{ fontWeight: '700' }}>{batch.type}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Quantity</div>
              <div style={{ fontWeight: '700' }}>{batch.quantity} KG</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Origin</div>
              <div style={{ fontWeight: '700' }}>{batch.origin}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Shearing Date</div>
              <div style={{ fontWeight: '700' }}>{batch.shearingDate}</div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Grade</div>
              <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {batch.grade} <ShieldCheck size={16} color="#16A34A" />
              </div>
            </div>
            <div>
              <div style={{ color: '#666', fontSize: '14px' }}>Quality Score</div>
              <div style={{ fontWeight: '700' }}>{batch.qualityScore}/100</div>
            </div>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '8px', marginBottom: '16px' }}>QUALITY CERTIFICATE</h2>
          <div style={{ background: '#DCFCE7', border: '1px solid #16A34A', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '800', marginBottom: '4px' }}>
                <ShieldCheck size={18} /> VERIFIED
              </div>
              <div style={{ color: '#166534', fontSize: '14px' }}>Certificate: <strong>{batch.certificate}</strong></div>
            </div>
            <button style={{ padding: '8px 16px', background: '#FFF', border: '1px solid #16A34A', color: '#166534', borderRadius: '4px', fontWeight: '700' }}>VIEW CERTIFICATE</button>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '8px', marginBottom: '16px' }}>FARMER</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8F8F3', padding: '16px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontWeight: '800', fontSize: '16px' }}>{batch.farmer.name}</div>
              <div style={{ color: '#666', fontSize: '14px' }}>Location: {batch.farmer.location}</div>
            </div>
            {batch.farmer.verified && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16A34A', fontSize: '14px', fontWeight: '700' }}>
                Verified Farmer ✓
              </div>
            )}
          </div>
          
          <h2 style={{ fontSize: '18px', fontWeight: '800', borderBottom: '1px solid #E5E5E5', paddingBottom: '8px', marginTop: '32px', marginBottom: '16px' }}>BID HISTORY</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F8F3' }}>
                <th style={{ padding: '12px' }}>Seller</th>
                <th style={{ padding: '12px' }}>Bid</th>
                <th style={{ padding: '12px' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '12px', fontWeight: '700' }}>ABC Wool Traders</td>
                <td style={{ padding: '12px', color: '#16A34A', fontWeight: '700' }}>₹425/kg</td>
                <td style={{ padding: '12px', color: '#666' }}>8:08 PM</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                <td style={{ padding: '12px', fontWeight: '700' }}>XYZ Textiles</td>
                <td style={{ padding: '12px' }}>₹420/kg</td>
                <td style={{ padding: '12px', color: '#666' }}>8:02 PM</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right Column (Sticky) */}
        <div>
          <div style={{ background: '#FFF', border: '1px solid #0B120D', borderRadius: '12px', padding: '24px', position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>BIDDING INFORMATION</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Starting Price:</span>
              <span style={{ fontWeight: '700' }}>₹{batch.bidding.startingPrice}/kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Current Highest Bid:</span>
              <span style={{ fontWeight: '800', color: '#16A34A' }}>₹{batch.bidding.highestBid}/kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Number of Bids:</span>
              <span style={{ fontWeight: '700' }}>{batch.bidding.bidsCount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#666' }}>Minimum Increment:</span>
              <span style={{ fontWeight: '700' }}>₹{batch.bidding.minIncrement}/kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5' }}>
              <span style={{ color: '#666' }}>Time Remaining:</span>
              <span style={{ fontWeight: '800', color: '#D97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={16} /> {batch.bidding.timeRemaining}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>PLACE YOUR BID</h2>
            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>Your bid per kg</span>
                <span style={{ fontSize: '14px', color: '#16A34A', fontWeight: '700' }}>Highest: ₹{batch.bidding.highestBid}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '6px', padding: '8px' }}>
                <span style={{ fontWeight: '800', color: '#666' }}>₹</span>
                <input 
                  type="number" 
                  value={bidPrice}
                  onChange={(e) => setBidPrice(Number(e.target.value))}
                  style={{ width: '100%', border: 'none', outline: 'none', fontSize: '18px', fontWeight: '800' }}
                />
              </div>
              {errorMsg && (
                <div style={{ color: '#DC2626', fontSize: '12px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={14} /> {errorMsg}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>
              <span>Total:</span>
              <span>₹{(bidPrice * batch.quantity).toLocaleString()}</span>
            </div>

            <button 
              onClick={handlePlaceBid}
              style={{ width: '100%', padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}
            >
              PLACE BID
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFF', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>Confirm Your Bid</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontSize: '14px' }}>
              <div><span style={{ color: '#666' }}>Batch:</span><br/><strong>{batch.id}</strong></div>
              <div><span style={{ color: '#666' }}>Quantity:</span><br/><strong>{batch.quantity} KG</strong></div>
              <div><span style={{ color: '#666' }}>Your Bid:</span><br/><strong>₹{bidPrice}/kg</strong></div>
              <div><span style={{ color: '#666' }}>Total Bid:</span><br/><strong>₹{(bidPrice * batch.quantity).toLocaleString()}</strong></div>
            </div>

            <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', background: '#F8F8F3', padding: '12px', borderRadius: '8px' }}>
              By placing this bid, you are submitting a binding offer for the complete batch.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={confirmBid} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                CONFIRM BID
              </button>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '12px', background: '#FFF', color: '#0B120D', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
