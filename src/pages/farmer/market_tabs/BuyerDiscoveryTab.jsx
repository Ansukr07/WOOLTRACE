import React from 'react';
import { Building, MapPin, ShieldCheck, CheckCircle2, Award, ArrowRight, Target } from 'lucide-react';
import { getCommodityById } from '../../../services/market/cropCommodityRegistry';

export default function BuyerDiscoveryTab({
  selectedCommodityId = 'WHEAT',
  buyerDemands = [],
  onQuoteBuyer
}) {
  const commodity = getCommodityById(selectedCommodityId);

  const filteredDemands = buyerDemands.filter(d => 
    !d.cropId || d.cropId === 'ALL' || d.cropId === selectedCommodityId || 
    (d.cropName && d.cropName.toUpperCase().includes(selectedCommodityId.toUpperCase()))
  );

  return (
    <div>
      <div className="panel-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <h3 className="panel-title">
            <Building size={20} />
            Verified Buyers & Institutional Procurement ({commodity.name})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Direct contracts with flour mills, food processors, retail chains, and export houses
          </span>
        </div>
        <span style={{ fontSize: '12px', fontWeight: '800', background: '#DDFF86', padding: '4px 10px', borderRadius: '6px' }}>
          {filteredDemands.length} Verified Buyers Active
        </span>
      </div>

      <div className="buyer-card-grid">
        {filteredDemands.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: '14px', border: '1px solid rgba(11,18,13,0.10)', gridColumn: '1 / -1' }}>
            <p style={{ color: '#64748B', margin: 0 }}>No buyers currently active for {commodity.name}. Showing general agricultural buyers.</p>
          </div>
        ) : (
          filteredDemands.map(buyer => {
            const matchScore = buyer.matchResult?.score || 92;
            const matchSummary = buyer.matchResult?.summary || 'High commercial compatibility with active institutional procurement requirements.';

            return (
              <div key={buyer.id} className="buyer-card">
                <div>
                  <div className="buyer-card-top">
                    <div>
                      <h4 className="buyer-org-name">{buyer.buyerName}</h4>
                      <div className="buyer-location">
                        <MapPin size={12} />
                        <span>{buyer.location}</span>
                      </div>
                    </div>
                    <div className="match-score-badge">
                      <Target size={14} />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#475569', margin: '8px 0 12px 0' }}>
                    <span style={{ background: '#F8F8F3', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', border: '1px solid rgba(11,18,13,0.08)' }}>
                      {buyer.buyerType}
                    </span>
                    <span style={{ marginLeft: '8px', color: '#0B120D', fontWeight: '700' }}>
                      ✓ {buyer.verificationStatus}
                    </span>
                  </div>

                  <div style={{ background: '#F8F8F3', borderRadius: '8px', padding: '10px', margin: '10px 0', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Demand Volume:</span>
                      <strong>{buyer.quantityRequired.toLocaleString('en-IN')} KG</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Price Range:</span>
                      <strong style={{ color: '#0B120D' }}>₹{buyer.minPrice} - ₹{buyer.maxPrice}/KG</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Escrow Security:</span>
                      <strong style={{ color: '#0B120D' }}>✓ 100% Escrow Vault</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4', marginBottom: '14px' }}>
                    <strong>Quality Specs:</strong> {buyer.qualityRequirements}
                  </div>
                </div>

                <button 
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                  onClick={() => onQuoteBuyer(buyer)}
                >
                  <span>Submit Lot Quotation</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
