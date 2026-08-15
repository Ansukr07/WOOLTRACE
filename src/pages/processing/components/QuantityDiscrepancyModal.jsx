import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Package, X } from 'lucide-react';

const QuantityDiscrepancyModal = ({ batch, onConfirm, onClose }) => {
  const expectedQty = batch?.quantity || 400;
  const [receivedQty, setReceivedQty] = useState(expectedQty);
  const [discrepancyReason, setDiscrepancyReason] = useState('');

  const difference = expectedQty - Number(receivedQty);
  const hasDiscrepancy = Math.abs(difference) > 0.001;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(batch.batchId || batch.id, Number(receivedQty), hasDiscrepancy ? discrepancyReason : '');
  };

  return (
    <div className="processing-modal-overlay">
      <div className="processing-modal" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h3><Package size={18} /> Receive Incoming Wool Batch</h3>
          <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px' }}>
            <div className="modal-info-box" style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #E2E8F0', fontSize: '13px' }}>
              <div style={{ margin: '4px 0' }}><strong>Batch ID:</strong> {batch?.batchId}</div>
              <div style={{ margin: '4px 0' }}><strong>Origin:</strong> {batch?.origin || 'Warehouse'}</div>
              <div style={{ margin: '4px 0' }}><strong>Wool Type:</strong> {batch?.woolType || 'Merino Cross'}</div>
              <div style={{ margin: '4px 0' }}><strong>Expected Weight:</strong> <span style="color: #2563EB; font-weight: 700;">{expectedQty} KG</span></div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Actual Received Quantity (KG)</label>
              <input 
                type="number" 
                value={receivedQty} 
                onChange={(e) => setReceivedQty(e.target.value)}
                required
                step="0.1"
                style={{ width: '100%', padding: '10px', fontSize: '16px', fontWeight: 'bold', borderRadius: '6px', border: '1px solid #CBD5E1', marginTop: '4px' }}
              />
            </div>

            {hasDiscrepancy && (
              <div className="discrepancy-alert-box" style={{ marginTop: '16px', background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '14px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: 'bold', fontSize: '14px' }}>
                  <AlertTriangle size={18} />
                  <span>⚠ QUANTITY DISCREPANCY DETECTED</span>
                </div>
                <div style={{ fontSize: '13px', color: '#7F1D1D', marginTop: '6px' }}>
                  Expected: <strong>{expectedQty} KG</strong> | Received: <strong>{receivedQty} KG</strong> | Difference: <strong>{Math.abs(difference).toFixed(1)} KG {difference > 0 ? 'Loss' : 'Excess'}</strong>
                </div>
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label style={{ fontSize: '12px', color: '#991B1B', fontWeight: '600' }}>Reason for Discrepancy (Required)</label>
                  <textarea 
                    value={discrepancyReason}
                    onChange={(e) => setDiscrepancyReason(e.target.value)}
                    placeholder="e.g., Moisture weight loss during transport seal transfer or bag tear..."
                    required={hasDiscrepancy}
                    rows="3"
                    style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #F87171', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 20px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderRadius: '0 0 12px 12px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-green" style={{ background: '#16A34A', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <CheckCircle size={16} /> Confirm Receipt & Record Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuantityDiscrepancyModal;