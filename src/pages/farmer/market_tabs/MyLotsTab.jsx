import React from 'react';
import { Layers, Users, PlusCircle } from 'lucide-react';

export default function MyLotsTab({ woolLots, onOpenFpoAggregator, onOpenCreateLot }) {
  return (
    <div>
      <div className="market-card" style={{ marginBottom: '24px' }}>
        <div className="panel-header-row">
          <h3 className="panel-title">
            <Layers size={20} />
            My Listed Lots & Collective FPO Lots
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={onOpenFpoAggregator}>
              <Users size={16} style={{ marginRight: '6px' }} />
              <span>FPO Multi-Batch Aggregator</span>
            </button>
            <button className="btn-primary" onClick={() => onOpenCreateLot(450)}>
              <PlusCircle size={16} style={{ marginRight: '6px' }} />
              <span>Create Individual Lot</span>
            </button>
          </div>
        </div>

        <div className="wt-table-wrapper">
          <table className="wt-data-table">
            <thead>
              <tr>
                <th>Lot Number</th>
                <th>Type / Seller</th>
                <th>Wool Variety</th>
                <th>Grade</th>
                <th>Total Qty</th>
                <th>Available Qty</th>
                <th>Asking Price</th>
                <th>QA Certificate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {woolLots.map(lot => (
                <tr key={lot.id}>
                  <td>
                    <strong>{lot.lotNumber}</strong>
                    {lot.isFpoAggregate && (
                      <span style={{ marginLeft: '6px', background: '#DDFF86', color: '#0B120D', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>
                        FPO BULK
                      </span>
                    )}
                  </td>
                  <td>{lot.sellerName} ({lot.sellerType})</td>
                  <td>{lot.woolType}</td>
                  <td>
                    <span style={{
                      background: '#EDEDCE', padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px'
                    }}>
                      {lot.qualityGrade}
                    </span>
                  </td>
                  <td>{lot.totalQuantity} KG</td>
                  <td><strong>{lot.availableQuantity} KG</strong></td>
                  <td style={{ color: '#0B120D', fontWeight: '700' }}>₹{lot.askingPrice}/KG</td>
                  <td>
                    <a href={lot.traceabilityUrl} target="_blank" rel="noreferrer" style={{ color: '#0B120D', fontWeight: '600' }}>
                      ✓ {lot.certificateId}
                    </a>
                  </td>
                  <td>
                    <span style={{
                      background: lot.status === 'AVAILABLE' ? '#DDFF86' : lot.status === 'OFFER_RECEIVED' ? '#EDEDCE' : '#BED5E5',
                      color: '#0B120D', padding: '3px 8px', borderRadius: '6px', fontWeight: '700', fontSize: '11px'
                    }}>
                      {lot.status}
                    </span>
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