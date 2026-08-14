import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ShieldCheck, Clock, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Bids() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for the SIH prototype presentation to guarantee it works visually
  const activeBids = [
    {
      id: 'WT-KA-2026-00124',
      type: 'Premium Medium Wool',
      quantity: 428,
      grade: 'A',
      qualityScore: 87,
      certified: true,
      certId: 'WTC-QA-2026-00124',
      origin: 'Mysuru, Karnataka',
      farmer: 'Rajesh Kumar',
      startingPrice: 380,
      highestBid: 425,
      bidsCount: 12,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 18 * 60 * 1000), // 2h 18m
      status: 'ACTIVE'
    },
    {
      id: 'WT-KA-2026-00131',
      type: 'Fine Merino Cross',
      quantity: 150,
      grade: 'B',
      qualityScore: 76,
      certified: false,
      origin: 'Hubli, Karnataka',
      farmer: 'Anil Desai',
      startingPrice: 400,
      highestBid: 400,
      bidsCount: 0,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'ACTIVE'
    }
  ];

  const myBids = [
    {
      batchId: 'WT-KA-2026-00124',
      type: 'Premium Medium Wool',
      quantity: 428,
      myBid: 430,
      highestBid: 430,
      status: 'HIGHEST BID',
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 18 * 60 * 1000),
    },
    {
      batchId: 'WT-RJ-2026-00842',
      type: 'Coarse Carpet Wool',
      quantity: 600,
      myBid: 395,
      highestBid: 410,
      status: 'OUTBID',
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 5 * 60 * 1000),
    }
  ];

  const summary = {
    active: 12,
    outbid: 4,
    accepted: 3,
    pending: 5,
    totalValue: 482500
  };

  const getTimeRemaining = (endTime) => {
    const diff = new Date(endTime) - new Date();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m`;
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#0B120D' }}>
          MY BIDS
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Find opportunities. Bid with confidence. Discover wool batches from verified farmers and submit competitive offers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ color: '#666', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>ACTIVE BIDS</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{summary.active}</div>
        </div>
        <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ color: '#D97706', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>OUTBID</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#D97706' }}>{summary.outbid}</div>
        </div>
        <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ color: '#16A34A', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>ACCEPTED</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A' }}>{summary.accepted}</div>
        </div>
        <div style={{ background: '#FFF', padding: '16px', borderRadius: '12px', border: '1px solid #E5E5E5' }}>
          <div style={{ color: '#666', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>PENDING</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>{summary.pending}</div>
        </div>
        <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '12px', border: '1px solid #DDFF86' }}>
          <div style={{ color: '#0B120D', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>TOTAL BID VALUE</div>
          <div style={{ fontSize: '24px', fontWeight: '800' }}>₹{summary.totalValue.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} color="#666" style={{ position: 'absolute', left: '16px', top: '12px' }} />
          <input 
            type="text" 
            placeholder="Search batch ID, wool type, location..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 48px', borderRadius: '8px', border: '1px solid #E5E5E5' }}
          />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>AVAILABLE BIDS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {activeBids.map(batch => (
            <div key={batch.id} style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
              <div style={{ height: '160px', background: '#F8F8F3', position: 'relative' }}>
                <img src={`https://placehold.co/400x200/EDEDCE/0B120D?text=Wool+Batch+${batch.id.split('-').pop()}`} alt="Wool Batch" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {batch.certified && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: '#16A34A', color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> CERTIFIED
                  </div>
                )}
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{batch.id}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{batch.type}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '14px' }}>
                  <div>
                    <div style={{ color: '#666' }}>Quantity</div>
                    <div style={{ fontWeight: '700' }}>{batch.quantity} KG</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Grade</div>
                    <div style={{ fontWeight: '700' }}>{batch.grade} {batch.certified && '✓'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Quality Score</div>
                    <div style={{ fontWeight: '700' }}>{batch.qualityScore}/100</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Origin</div>
                    <div style={{ fontWeight: '700' }}>{batch.origin.split(',')[0]}</div>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '16px 0', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ color: '#666', fontSize: '12px' }}>Starting Price</div>
                    <div style={{ fontWeight: '700' }}>₹{batch.startingPrice}/kg</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#666', fontSize: '12px' }}>Current Highest</div>
                    <div style={{ fontWeight: '800', fontSize: '18px', color: '#16A34A' }}>₹{batch.highestBid}/kg</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '14px', color: '#666' }}>
                  <div>{batch.bidsCount} Bids</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#D97706', fontWeight: '700' }}>
                    <Clock size={16} /> Closes: {getTimeRemaining(batch.endTime)}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => navigate(`/seller/bids/${batch.id}`)} style={{ flex: 1, padding: '12px', background: '#FFF', border: '1px solid #0B120D', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                    VIEW BATCH
                  </button>
                  <button onClick={() => navigate(`/seller/bids/${batch.id}`)} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                    PLACE BID
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>MY ACTIVE BIDS</h2>
        <div style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#0B120D' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5', background: '#F8F8F3' }}>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Batch ID</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Wool Type</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Quantity</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Your Bid</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Highest Bid</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Status</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Time Remaining</th>
                <th style={{ padding: '16px', fontWeight: '700', fontSize: '14px', color: '#0B120D' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myBids.map(bid => (
                <tr key={bid.batchId} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#0B120D' }}>{bid.batchId}</td>
                  <td style={{ padding: '16px', color: '#0B120D' }}>{bid.type}</td>
                  <td style={{ padding: '16px', color: '#0B120D' }}>{bid.quantity} KG</td>
                  <td style={{ padding: '16px', fontWeight: '700', color: '#0B120D' }}>₹{bid.myBid}/kg</td>
                  <td style={{ padding: '16px', color: '#0B120D' }}>₹{bid.highestBid}/kg</td>
                  <td style={{ padding: '16px' }}>
                    {bid.status === 'HIGHEST BID' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#DCFCE7', color: '#16A34A', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                        <Check size={14} /> Highest Bid
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#FEF2F2', color: '#DC2626', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                        <AlertCircle size={14} /> Outbid
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: '#D97706', fontWeight: '700' }}>{getTimeRemaining(bid.endTime)}</td>
                  <td style={{ padding: '16px' }}>
                    {bid.status === 'HIGHEST BID' ? (
                      <button onClick={() => navigate(`/seller/bids/${bid.batchId}`)} style={{ padding: '8px 16px', background: '#FFF', border: '1px solid #E5E5E5', color: '#0B120D', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>VIEW</button>
                    ) : (
                      <button onClick={() => navigate(`/seller/bids/${bid.batchId}`)} style={{ padding: '8px 16px', background: '#0B120D', color: '#FFF', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>INCREASE BID</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
