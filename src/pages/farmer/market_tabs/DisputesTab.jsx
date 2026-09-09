import React from 'react';
import { CheckCircle2, FileWarning } from 'lucide-react';

export default function DisputesTab({ disputes }) {
  return (
    <div className="disputes-page">
      {disputes.length === 0 ? (
        <div className="disputes-empty">
          <CheckCircle2 size={28} />
          <h4>No open disputes</h4>
          <p>Your transaction records are clear. New issues can be raised from the relevant transaction.</p>
        </div>
      ) : <div className="disputes-list">
        {disputes.map(disp => (
          <article key={disp.id} className="dispute-record">
            <div className="dispute-record-icon"><FileWarning size={17} /></div>
            <div className="dispute-record-content">
              <div className="dispute-record-header">
              <div>
                  <span className="dispute-id">{disp.id}</span>
                  <h4>{String(disp.reasonCategory || 'Transaction issue').replaceAll('_', ' ')}</h4>
              </div>
                <span className={`dispute-status ${disp.status === 'RESOLVED' ? 'resolved' : 'open'}`}>
                {String(disp.status || 'OPEN').replaceAll('_', ' ')}
              </span>
            </div>
              <div className="dispute-meta"><span>Transaction {disp.transactionId}</span><span>Lot {disp.lotNumber}</span><span>Raised by {disp.raisedByName}</span></div>
              <p className="dispute-description">{disp.description}</p>

            {disp.resolutionNote && (
                <div className="dispute-resolution">
                  <strong>Resolution</strong><span>{disp.resolutionNote}</span>
              </div>
            )}
            </div>
          </article>
        ))}
      </div>}
    </div>
  );
}
