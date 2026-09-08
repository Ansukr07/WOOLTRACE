import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisputesTab({ disputes }) {
  return (
    <div>
      <div className="panel-header-row">
        <h3 className="panel-title">
          <ShieldAlert size={20} />
          Grievance & Dispute Resolution Portal
        </h3>
        <span style={{ fontSize: '13px', color: '#64748B' }}>Independent mediation and lab verification</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {disputes.map(disp => (
          <div key={disp.id} className="market-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <strong style={{ fontSize: '16px', color: '#0B120D' }}>{disp.id} - {disp.reasonCategory}</strong>
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  Txn: {disp.transactionId} · Lot: {disp.lotNumber} · Raised by: {disp.raisedByName}
                </div>
              </div>
              <span style={{
                background: disp.status === 'RESOLVED' ? '#DDFF86' : '#FFAAA4',
                padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800'
              }}>
                {disp.status}
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#334155', margin: '8px 0' }}>
              {disp.description}
            </p>

            {disp.resolutionNote && (
              <div style={{ background: '#F8F8F3', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#0B120D', borderLeft: '3px solid #0B120D' }}>
                <strong>Resolution Note:</strong> {disp.resolutionNote}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}