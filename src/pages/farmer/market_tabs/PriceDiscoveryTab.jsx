import React from 'react';
import { Calculator, ArrowRight, ShieldCheck, Truck, Warehouse, CheckCircle2, ChevronRight } from 'lucide-react';
import { getCommodityById } from '../../../services/market/cropCommodityRegistry';

export default function PriceDiscoveryTab({
  selectedCommodityId = 'WHEAT',
  selectedBatchId,
  setSelectedBatchId,
  batches = [],
  quantityInput,
  setQuantityInput,
  selectedVariety,
  setSelectedVariety,
  selectedGrade,
  setSelectedGrade,
  distanceKm,
  setDistanceKm,
  storageMonths,
  setStorageMonths,
  channelsComparison = [],
  onSelectChannel
}) {
  const commodity = getCommodityById(selectedCommodityId);

  const bestChannel = channelsComparison.reduce((prev, curr) => 
    (curr.netCalc.netRealizationPerKg > (prev?.netCalc?.netRealizationPerKg || 0)) ? curr : prev
  , channelsComparison[0]);

  return (
    <div>
      <div className="discovery-input-panel">
        <div className="panel-header-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <h3 className="panel-title">
            <Calculator size={20} />
            Produce Batch & Logistics Simulation ({commodity.name})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Transparent Net Farm-Gate Realization
          </span>
        </div>

        <div className="input-fields-row">
          <div className="form-field-group">
            <label>Select Registered Batch</label>
            <select 
              value={selectedBatchId} 
              onChange={(e) => {
                const bId = e.target.value;
                setSelectedBatchId(bId);
                const found = batches.find(b => (b.id === bId || b.batchId === bId));
                if (found) {
                  setQuantityInput(found.quantity);
                  setSelectedGrade(found.qualityGrade || 'A');
                }
              }}
            >
              <option value="">Custom Manual Input</option>
              {batches.map(b => (
                <option key={b.id || b.batchId} value={b.id || b.batchId}>
                  {b.id || b.batchId} - {b.quantity} {b.unit || 'KG'} ({b.cropName || b.woolType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label>Variety</label>
            <select value={selectedVariety} onChange={(e) => setSelectedVariety(e.target.value)}>
              {commodity.varieties.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label>Quality Grade</label>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
              <option value="A+">Grade A+ (Premium Export)</option>
              <option value="A">Grade A (Standard Mill Grade)</option>
              <option value="B">Grade B (Commercial Fair)</option>
              <option value="C">Grade C (Standard)</option>
            </select>
          </div>

          <div className="form-field-group">
            <label>Lot Quantity ({commodity.defaultUnit})</label>
            <input 
              type="number" 
              value={quantityInput} 
              onChange={(e) => setQuantityInput(Number(e.target.value))}
              min="50"
            />
          </div>

          <div className="form-field-group">
            <label>Transport Distance (KM)</label>
            <input 
              type="number" 
              value={distanceKm} 
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              min="0"
              max="500"
            />
          </div>

          <div className="form-field-group">
            <label>Storage Duration (Months)</label>
            <input 
              type="number" 
              value={storageMonths} 
              onChange={(e) => setStorageMonths(Number(e.target.value))}
              min="0"
              max="12"
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D', margin: 0 }}>
          Multi-Channel Price & Net Return Realization Comparison
        </h3>
        <span style={{ fontSize: '13px', color: '#475569' }}>
          *Net Return = Gross Sale Value - Transport Freight - Storage Carry - Market Cess
        </span>
      </div>

      <div className="channel-cards-grid">
        {channelsComparison.map(ch => {
          const isBest = bestChannel && bestChannel.channelId === ch.channelId;
          const net = ch.netCalc;

          return (
            <div key={ch.channelId} className={`channel-card ${isBest ? 'recommended' : ''}`}>
              {isBest && <span className="recommended-ribbon">⭐ Highest Net Return</span>}

              <div>
                <div className="channel-header">
                  <div>
                    <span className={`channel-badge ${ch.badgeColor || 'blue'}`}>{ch.badge}</span>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D', margin: '8px 0 2px 0' }}>
                      {ch.channelType}
                    </h4>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{ch.buyerName}</div>
                  </div>
                </div>

                <div style={{ margin: '14px 0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>
                    Gross Quoted Price
                  </div>
                  <div className="channel-price-large">
                    ₹{ch.pricePerKg} <span style={{ fontSize: '14px', fontWeight: '600' }}>/ KG</span>
                  </div>
                </div>

                <div className="channel-net-box">
                  <div className="net-row">
                    <span>Gross Value ({net.quantityKg} KG)</span>
                    <strong>₹{net.grossSaleValue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="net-row" style={{ color: '#0B120D' }}>
                    <span><Truck size={12} style={{ display: 'inline', marginRight: '4px' }} /> Freight ({ch.distanceKm} km)</span>
                    <span>-₹{net.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  {net.storageCost > 0 && (
                    <div className="net-row" style={{ color: '#0B120D' }}>
                      <span><Warehouse size={12} style={{ display: 'inline', marginRight: '4px' }} /> Storage ({storageMonths} mo)</span>
                      <span>-₹{net.storageCost.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="net-row" style={{ color: '#0B120D' }}>
                    <span>Market / Platform Cess</span>
                    <span>-₹{net.transactionFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="net-row total">
                    <span>Net Realization</span>
                    <span style={{ fontSize: '16px', color: '#0B120D' }}>₹{net.netRealizationValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0B120D', fontWeight: '800', marginTop: '6px', textAlign: 'right' }}>
                    Net ₹{net.netRealizationPerKg}/KG ({net.deductionRatio}% deductions)
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px', lineHeight: '1.4' }}>
                  <p style={{ margin: '0 0 6px 0' }}><strong>Payment:</strong> {ch.paymentTerms}</p>
                  <p style={{ margin: 0, color: '#64748B' }}>{ch.description}</p>
                </div>
              </div>

              <button 
                className={isBest ? 'btn-accent' : 'btn-primary'}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                onClick={() => onSelectChannel(ch)}
              >
                <span>Proceed with {ch.badge}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
