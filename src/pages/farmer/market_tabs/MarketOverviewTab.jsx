import React from 'react';
import {
  TrendingUp, Activity, Users, Clock, Sparkles, Warehouse, Scale, CheckCircle2, Target
} from 'lucide-react';
import { WOOL_TYPES } from '../../../services/market/marketIntelligenceService';

export default function MarketOverviewTab({ saleWindowAdvisory, marketTransactions, onLaunchDiscovery }) {
  return (
    <div>
      <div className="market-metric-grid">
        <div className="market-card lime">
          <div className="metric-top-row">
            <span className="metric-title">Indicative Modal Price</span>
            <TrendingUp size={18} color="#0B120D" />
          </div>
          <div className="metric-number">₹448 <span style={{ fontSize: '14px', fontWeight: '500' }}>/ KG</span></div>
          <div className="metric-subtitle">
            <span className="positive-change">+6.8% (30D)</span> · Grade A Merino Benchmark
          </div>
        </div>

        <div className="market-card sky">
          <div className="metric-top-row">
            <span className="metric-title">Observed Price Spread</span>
            <Activity size={18} color="#0B120D" />
          </div>
          <div className="metric-number">₹210 - ₹550</div>
          <div className="metric-subtitle">
            <span>Min: Coarse Deccani · Max: Artisan Gaddi</span>
          </div>
        </div>

        <div className="market-card ivory">
          <div className="metric-top-row">
            <span className="metric-title">Buyer Demand Status</span>
            <Users size={18} color="#0B120D" />
          </div>
          <div className="metric-number">HIGH DEMAND</div>
          <div className="metric-subtitle">
            <span>11,800 KG Needed vs 6,200 KG Available</span>
          </div>
        </div>

        <div className="market-card">
          <div className="metric-top-row">
            <span className="metric-title">Recommended Sale Window</span>
            <Clock size={18} color="#0B120D" />
          </div>
          <div className="metric-number" style={{ fontSize: '22px', color: '#0B120D' }}>
            {saleWindowAdvisory.action}
          </div>
          <div className="metric-subtitle">
            <span>{saleWindowAdvisory.recommendedWindow} · {saleWindowAdvisory.confidence}</span>
          </div>
        </div>
      </div>

      <div className="section-two-column">
        <div>
          <div className="market-card" style={{ marginBottom: '24px', borderLeft: '4px solid #0B120D' }}>
            <div className="panel-header-row">
              <h3 className="panel-title">
                <Sparkles size={20} color="#0B120D" />
                Market Advisory: {saleWindowAdvisory.title}
              </h3>
              <span style={{
                background: saleWindowAdvisory.badgeBg, color: saleWindowAdvisory.badgeColor,
                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800'
              }}>
                {saleWindowAdvisory.action}
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: '0 0 12px 0' }}>
              {saleWindowAdvisory.reason}
            </p>
            <div style={{
              background: '#F8F8F3', padding: '12px 16px', borderRadius: '8px',
              fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Warehouse size={16} />
              <span><strong>Storage Economics:</strong> {saleWindowAdvisory.storageAdvice}</span>
            </div>
          </div>

          <div className="market-card">
            <div className="panel-header-row">
              <h3 className="panel-title">
                <Scale size={20} />
                Current Indicative Prices by Wool Grade & Type
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Updated Today</span>
            </div>
            <div className="wt-table-wrapper">
              <table className="wt-data-table">
                <thead>
                  <tr>
                    <th>Wool Variety</th>
                    <th>Grade</th>
                    <th>Fineness</th>
                    <th>Mandi Price</th>
                    <th>Processor Quote</th>
                    <th>Institutional Quote</th>
                  </tr>
                </thead>
                <tbody>
                  {WOOL_TYPES.map(w => (
                    <tr key={w.id}>
                      <td><strong>{w.name}</strong></td>
                      <td>
                        <span style={{
                          background: w.grade.startsWith('A') ? '#DDFF86' : '#EDEDCE',
                          color: '#0B120D', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px'
                        }}>
                          Grade {w.grade}
                        </span>
                      </td>
                      <td style={{ color: '#64748B' }}>{w.micron}</td>
                      <td>₹{Math.round(w.basePrice * 0.94)}/kg</td>
                      <td style={{ color: '#0B120D', fontWeight: '700' }}>₹{Math.round(w.basePrice * 1.05)}/kg</td>
                      <td style={{ color: '#0B120D', fontWeight: '700' }}>₹{Math.round(w.basePrice * 1.12)}/kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="market-card ivory" style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#0B120D' }}>
              Have Harvested Wool to Sell?
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              Discover real-time net returns across Mandis, Mills & Handloom Co-ops, deducting all transport and storage carry costs.
            </p>
            <button
              className="btn-primary"
              style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onClick={onLaunchDiscovery}
            >
              <Target size={18} />
              <span>Launch Price Discovery Calculator</span>
            </button>
          </div>

          <div className="market-card">
            <div className="panel-header-row">
              <h3 className="panel-title">
                <CheckCircle2 size={18} color="#0B120D" />
                Recent Verified Trades
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {marketTransactions.map(txn => (
                <div key={txn.id} style={{
                  background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.08)',
                  borderRadius: '10px', padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#0B120D' }}>{txn.woolType}</strong>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#0B120D' }}>
                      ₹{txn.agreedPricePerKg}/KG
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Qty: {txn.quantityKg} KG · {txn.buyerName}</span>
                    <span style={{ color: '#0B120D', fontWeight: '700' }}>✓ {txn.paymentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}