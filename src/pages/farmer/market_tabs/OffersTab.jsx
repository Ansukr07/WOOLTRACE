import React from 'react';
import { FileText, TrendingUp, Check, X } from 'lucide-react';

export default function OffersTab({
  marketOffers,
  onAcceptOffer,
  onRejectOffer,
  onOpenCounter
}) {
  return (
    <div>
      <div className="panel-header-row">
        <h3 className="panel-title">
          <FileText size={20} />
          Digital Offers & Transparent Negotiations
        </h3>
        <span style={{ fontSize: '13px', color: '#64748B' }}>Review buyer bids, counter-offer, or lock in sales</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {marketOffers.map(offer => (
          <div key={offer.id} className="market-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D' }}>
                    {offer.offerNumber} on {offer.lotNumber}
                  </span>
                  <span style={{
                    background: offer.status === 'ACCEPTED' ? '#DDFF86' : offer.status === 'COUNTERED' ? '#EDEDCE' : '#BED5E5',
                    padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '800'
                  }}>
                    {offer.status}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  Buyer: <strong>{offer.buyerName}</strong> · Qty: {offer.quantityKg} KG
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D' }}>
                  ₹{offer.offeredPricePerKg}/KG
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Gross Value: ₹{offer.totalGrossAmount?.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div style={{ background: '#F8F8F3', borderRadius: '10px', padding: '16px', margin: '14px 0' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
                Negotiation history & payment terms
              </div>
              <div className="trace-timeline">
                {offer.history.map((step, idx) => (
                  <div key={idx} className="timeline-step">
                    <div className={`timeline-node-dot ${idx === offer.history.length - 1 ? 'active' : ''}`} />
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <strong>{step.by} ({step.action.replace('_', ' ')})</strong>
                        <span>{new Date(step.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="timeline-text">
                        {step.pricePerKg ? `Offered: ₹${step.pricePerKg}/KG · ` : ''}{step.note}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {offer.status === 'PENDING' && (
              <div className="offer-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="btn-secondary" onClick={() => onRejectOffer(offer)}>
                  <X size={16} style={{ marginRight: '4px' }} />
                  Decline
                </button>
                <button className="btn-secondary" onClick={() => onOpenCounter(offer)}>
                  <TrendingUp size={16} style={{ marginRight: '4px' }} />
                  Counter-Offer
                </button>
                <button className="btn-primary" onClick={() => onAcceptOffer(offer)}>
                  <Check size={16} style={{ marginRight: '4px' }} />
                  Accept & Finalize Deal
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
