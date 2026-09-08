import React from 'react';
import { Target, Building } from 'lucide-react';
import { WOOL_TYPES, calculateNetRealization } from '../../../services/market/marketIntelligenceService';

export default function PriceDiscoveryTab({
  batches,
  selectedBatchId, setSelectedBatchId,
  customWoolType, setCustomWoolType,
  customGrade, setCustomGrade,
  customQuantity, setCustomQuantity,
  transportDistance, setTransportDistance,
  storageMonths, setStorageMonths,
  discoveryChannels,
  onOpenCreateLot
}) {
  return (
    <div>
      <div className="discovery-input-panel">
        <div className="panel-header-row">
          <h3 className="panel-title">
            <Target size={20} />
            Wool Price Discovery & Net Realization Engine
          </h3>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Deducts transport, storage, and handling fees</span>
        </div>

        <div className="input-fields-row">
          <div className="form-field-group">
            <label>Select Registered Batch</label>
            <select value={selectedBatchId} onChange={(e) => setSelectedBatchId(e.target.value)}>
              {batches.map(b => (
                <option key={b.id || b.batchId} value={b.id || b.batchId}>
                  {b.id || b.batchId} - {b.quantity} KG ({b.woolType})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label>Wool Variety</label>
            <select value={customWoolType} onChange={(e) => setCustomWoolType(e.target.value)}>
              {WOOL_TYPES.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="form-field-group">
            <label>Quality Grade</label>
            <select value={customGrade} onChange={(e) => setCustomGrade(e.target.value)}>
              <option value="A+">Grade A+ (Superior Fine)</option>
              <option value="A">Grade A (Certified Clean)</option>
              <option value="B">Grade B (Standard Crossbred)</option>
              <option value="C">Grade C (Industrial Rough)</option>
            </select>
          </div>

          <div className="form-field-group">
            <label>Batch Quantity (KG)</label>
            <input
              type="number"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(Number(e.target.value))}
            />
          </div>

          <div className="form-field-group">
            <label>Transport Distance (KM)</label>
            <input
              type="number"
              value={transportDistance}
              onChange={(e) => setTransportDistance(Number(e.target.value))}
            />
          </div>

          <div className="form-field-group">
            <label>Storage Duration (Mo.)</label>
            <select value={storageMonths} onChange={(e) => setStorageMonths(Number(e.target.value))}>
              <option value="0">0 (Immediate Dispatch)</option>
              <option value="1">1 Month Storage</option>
              <option value="2">2 Months Storage</option>
              <option value="3">3 Months Storage</option>
              <option value="6">6 Months Storage</option>
            </select>
          </div>
        </div>
      </div>

      <div className="panel-header-row" style={{ marginTop: '16px' }}>
        <h3 className="panel-title">
          <Building size={20} />
          Multi-Channel Price Realization Breakdown
        </h3>
        <span style={{ fontSize: '13px', color: '#0B120D', fontWeight: '700' }}>
          Showing Net Realizable Price after Logistics & Storage
        </span>
      </div>

      <div className="channel-cards-grid">
        {discoveryChannels.map((channel, idx) => {
          const netCalc = calculateNetRealization({
            pricePerKg: channel.pricePerKg,
            quantityKg: customQuantity,
            distanceKm: transportDistance,
            transportCostPerKm: channel.transportRatePerKm,
            storageMonths: storageMonths,
            storageRatePerKgMonth: 4.5,
            platformFeePercent: channel.channelId === 'APMC_MANDI' ? 1.5 : 1.0
          });

          const isBest = idx === 2;

          return (
            <div key={channel.channelId} className={`channel-card ${isBest ? 'recommended' : ''}`}>
              {isBest && <div className="recommended-ribbon">⭐ Highest Net Return</div>}
              
              <div>
                <div className="channel-header">
                  <div>
                    <span className={`channel-badge ${channel.badgeColor}`}>{channel.badge}</span>
                    <h4 style={{ margin: '8px 0 2px 0', fontSize: '15px', color: '#0B120D' }}>{channel.buyerName}</h4>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{channel.channelType}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#0B120D' }}>{channel.trend}</span>
                </div>

                <div className="channel-price-large">
                  ₹{channel.pricePerKg} <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748B' }}>/ KG (Gross)</span>
                </div>

                <div className="channel-net-box">
                  <div className="net-row">
                    <span>Gross Sale Value:</span>
                    <strong>₹{netCalc.grossSaleValue.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="net-row">
                    <span>Transport ({transportDistance} km):</span>
                    <span style={{ color: '#0B120D' }}>- ₹{netCalc.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="net-row">
                    <span>Storage ({storageMonths} mo):</span>
                    <span style={{ color: '#0B120D' }}>- ₹{netCalc.storageCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="net-row">
                    <span>Platform / Mandi Fee:</span>
                    <span style={{ color: '#0B120D' }}>- ₹{netCalc.transactionFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="net-row total">
                    <span>Net Farmer Realization:</span>
                    <span style={{ color: '#0B120D' }}>₹{netCalc.netRealizationValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', color: '#0B120D', fontWeight: '700', marginTop: '4px' }}>
                    ₹{netCalc.netRealizationPerKg}/KG Net Return
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                  {channel.description}
                </p>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '8px', fontSize: '13px' }}
                onClick={() => onOpenCreateLot(channel.pricePerKg)}
              >
                Create Lot at ₹{channel.pricePerKg}/KG
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}