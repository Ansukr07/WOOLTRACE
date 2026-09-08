import React from 'react';
import { Users, MapPin, Sparkles, Send } from 'lucide-react';

export default function BuyerDiscoveryTab({
  batches,
  matchedBatchForBuyer, setMatchedBatchForBuyer,
  buyerTypeFilter, setBuyerTypeFilter,
  rankedBuyers,
  onOpenSubmitLot
}) {
  return (
    <div>
      <div className="market-card" style={{ marginBottom: '24px' }}>
        <div className="panel-header-row">
          <h3 className="panel-title">
            <Users size={20} />
            Verified Buyer Procurement Demands
          </h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>Match against batch:</div>
            <select
              value={matchedBatchForBuyer}
              onChange={(e) => setMatchedBatchForBuyer(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.2)', fontSize: '13px' }}
            >
              {batches.map(b => (
                <option key={b.id || b.batchId} value={b.id || b.batchId}>
                  {b.id || b.batchId} ({b.quantity} KG, {b.qualityGrade || 'A'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
          <button
            onClick={() => setBuyerTypeFilter('ALL')}
            style={{
              background: buyerTypeFilter === 'ALL' ? '#0B120D' : '#F8F8F3',
              color: buyerTypeFilter === 'ALL' ? '#FFFFFF' : '#0B120D',
              padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '12px', fontWeight: '700'
            }}
          >
            All Buyer Types
          </button>
          {['PROCESSOR', 'INSTITUTIONAL', 'MANUFACTURER', 'EXPORTER'].map(t => (
            <button
              key={t}
              onClick={() => setBuyerTypeFilter(t)}
              style={{
                background: buyerTypeFilter === t ? '#0B120D' : '#F8F8F3',
                color: buyerTypeFilter === t ? '#FFFFFF' : '#0B120D',
                padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(11,18,13,0.15)', fontSize: '12px', fontWeight: '700'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="buyer-card-grid">
        {rankedBuyers.map(buyer => (
          <div key={buyer.id} className="buyer-card">
            <div>
              <div className="buyer-card-top">
                <div>
                  <span className="channel-badge green" style={{ marginBottom: '6px', display: 'inline-block' }}>
                    {buyer.buyerType} · {buyer.verificationBadge}
                  </span>
                  <h4 className="buyer-org-name">{buyer.buyerName}</h4>
                  <div className="buyer-location">
                    <MapPin size={12} />
                    <span>{buyer.location}</span>
                  </div>
                </div>

                <div className="match-score-badge">
                  <Sparkles size={14} />
                  <span>{buyer.matchResult.score}% Match</span>
                </div>
              </div>

              <div style={{
                background: '#F8F8F3', padding: '12px', borderRadius: '8px', margin: '12px 0', fontSize: '13px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748B' }}>Demanded Wool:</span>
                  <strong>{buyer.woolType} (Grade {buyer.requiredGrade})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748B' }}>Target Quantity:</span>
                  <strong>{buyer.quantityRequired} KG</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Budget Bracket:</span>
                  <strong style={{ color: '#0B120D' }}>₹{buyer.minPrice} - ₹{buyer.maxPrice}/KG</strong>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '4px' }}>
                  Algorithm Match Reasons:
                </div>
                {buyer.matchResult.breakdown.slice(0, 2).map((reason, idx) => (
                  <div key={idx} style={{ fontSize: '12px', color: '#0B120D', display: 'flex', gap: '6px', marginBottom: '2px' }}>
                    <span>✓</span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-accent"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
              onClick={() => onOpenSubmitLot(buyer.budgetPrice)}
            >
              <Send size={14} />
              <span>Submit Wool Lot to Buyer</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}