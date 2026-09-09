import React from 'react';
import {
  TrendingUp, Activity, Users, Clock, Sparkles, Warehouse, Scale, CheckCircle2, Target
} from 'lucide-react';
import { getCommodityById } from '../../../services/market/cropCommodityRegistry';

export default function MarketOverviewTab({ selectedCommodityId = 'WHEAT', saleWindowAdvisory, marketTransactions = [], onLaunchDiscovery }) {
  const commodity = getCommodityById(selectedCommodityId);
  const base = commodity.basePricePerKg;

  return (
    <div>
      <div className="market-metric-grid">
        <div className="market-card lime">
          <div className="metric-top-row">
            <span className="metric-title">{commodity.name} · Modal Price</span>
            <TrendingUp size={18} color="#0B120D" />
          </div>
          <div className="metric-number">₹{commodity.basePricePerKg} <span style={{ fontSize: '14px', fontWeight: '500' }}>/ KG</span></div>
          <div className="metric-subtitle">
            <span className="positive-change">+{commodity.priceChange30d}% (30D)</span> · Grade A Benchmark
          </div>
        </div>

        <div className="market-card sky">
          <div className="metric-top-row">
            <span className="metric-title">Observed Price Spread</span>
            <Activity size={18} color="#0B120D" />
          </div>
          <div className="metric-number">₹{Math.round(base * 0.88)} - ₹{Math.round(base * 1.15)}</div>
          <div className="metric-subtitle">
            <span>Min: Mandi Spot · Max: Institutional / Export</span>
          </div>
        </div>

        <div className="market-card ivory">
          <div className="metric-top-row">
            <span className="metric-title">Buyer Demand Ratio</span>
            <Users size={18} color="#0B120D" />
          </div>
          <div className="metric-number">{commodity.demandLevel} DEMAND</div>
          <div className="metric-subtitle">
            <span>{commodity.demandVolumeKg.toLocaleString('en-IN')} KG Needed vs {commodity.supplyVolumeKg.toLocaleString('en-IN')} KG Available</span>
          </div>
        </div>

        <div className="market-card">
          <div className="metric-top-row">
            <span className="metric-title">Recommended Sale Window</span>
            <Clock size={18} color="#0B120D" />
          </div>
          <div className="metric-number" style={{ fontSize: '20px', color: '#0B120D' }}>
            {saleWindowAdvisory?.action || 'SELL NOW'}
          </div>
          <div className="metric-subtitle">
            <span>{saleWindowAdvisory?.recommendedWindow || 'Next 3 - 7 Days'} · {saleWindowAdvisory?.confidence || 'High'}</span>
          </div>
        </div>
      </div>

      <div className="section-two-column">
        <div>
          <div className="market-card" style={{ marginBottom: '24px', borderLeft: '4px solid #0B120D' }}>
            <div className="panel-header-row">
              <h3 className="panel-title">
                <Sparkles size={20} color="#0B120D" />
                <span>Market Advisory: {saleWindowAdvisory?.title || ('Market Window for ' + commodity.name)}</span>
              </h3>
              <span style={{
                background: saleWindowAdvisory?.badgeBg || '#DDFF86', color: saleWindowAdvisory?.badgeColor || '#0B120D',
                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800'
              }}>
                {saleWindowAdvisory?.action || 'SELL NOW'}
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155', margin: '0 0 12px 0' }}>
              {saleWindowAdvisory?.reason}
            </p>
            <div style={{
              background: '#F8F8F3', padding: '12px 16px', borderRadius: '8px',
              fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Warehouse size={16} />
              <span><strong>Storage Economics:</strong> {saleWindowAdvisory?.storageAdvice}</span>
            </div>
          </div>

          <div className="market-card">
            <div className="panel-header-row">
              <h3 className="panel-title">
                <Scale size={20} />
                <span>Indicative Prices by Variety &amp; Procurement Channel</span>
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Updated Live Today</span>
            </div>
            <div className="wt-table-wrapper">
              <table className="wt-data-table">
                <thead>
                  <tr>
                    <th>Variety / Type</th>
                    <th>Grade</th>
                    <th>Mandi Price</th>
                    <th>Direct buyer quote</th>
                    <th>Institutional Quote</th>
                  </tr>
                </thead>
                <tbody>
                  {commodity.varieties.map((v, i) => (
                    <tr key={i}>
                      <td><strong>{v}</strong></td>
                      <td>
                        <span style={{
                          background: i === 0 ? '#DDFF86' : '#EDEDCE',
                          color: '#0B120D', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px'
                        }}>
                          {i === 0 ? 'Grade A+' : i === 1 ? 'Grade A' : 'Grade B'}
                        </span>
                      </td>
                      <td>₹{Math.round(base * (0.92 + i * 0.02))}/kg</td>
                      <td style={{ color: '#0B120D', fontWeight: '700' }}>₹{Math.round(base * (1.04 + i * 0.02))}/kg</td>
                      <td style={{ color: '#0B120D', fontWeight: '700' }}>₹{Math.round(base * (1.10 + i * 0.03))}/kg</td>
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
              Have {commodity.name} to Sell?
            </h3>
            <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              Discover real-time net returns across Mandis, Processing Mills & Institutional Co-ops, deducting all transport distance and storage carry fees.
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
                Recent Verified Platform Trades
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {marketTransactions.map(txn => (
                <div key={txn.id} style={{
                  background: '#F8F8F3', border: '1px solid rgba(11,18,13,0.08)',
                  borderRadius: '10px', padding: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: '#0B120D' }}>{txn.cropName || txn.woolType}</strong>
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
