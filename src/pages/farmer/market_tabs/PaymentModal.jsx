import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { confirmUpiPayment } from '../../../services/payment/paymentService';

export default function PaymentModal({ transaction, payment, onClose, onPaid }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(payment.upiUri); } catch { setError('Copy is unavailable in this browser. Scan the QR code instead.'); }
  };
  const complete = async () => {
    setBusy(true); setError('');
    try { onPaid(await confirmUpiPayment(payment.id)); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="wt-modal-overlay" role="dialog" aria-modal="true" aria-label="UPI payment">
    <div className="wt-modal-card" style={{ maxWidth: 460 }}>
      <div className="modal-header-row"><div><h3 style={{ margin: 0 }}>Pay securely by UPI</h3><p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 13 }}>Transaction {transaction.transactionNumber}</p></div><button className="btn-close-modal" onClick={onClose} aria-label="Close payment"><X size={20}/></button></div>
      <div style={{ textAlign: 'center', padding: '14px 0 6px' }}>
        <div style={{ display: 'inline-block', padding: 12, background: '#fff', border: '1px solid #D8DED5', borderRadius: 14 }}><QRCode value={payment.upiUri} size={176} /></div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>₹{Number(payment.amount).toLocaleString('en-IN')}</div>
        <p style={{ color: '#475569', fontSize: 13, margin: '6px 0 0' }}>Scan in any UPI app or open the UPI payment request.</p>
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}><button className="btn-secondary" style={{ flex: 1 }} onClick={copyUpi}><Copy size={15}/> Copy UPI link</button><a className="btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }} href={payment.upiUri}><ExternalLink size={15}/> Open UPI app</a></div>
      <div style={{ background: '#F0F7EC', borderRadius: 10, padding: 12, display: 'flex', gap: 8, fontSize: 12, color: '#36543B' }}><ShieldCheck size={18} style={{ flexShrink: 0 }}/><span>Demo settlement is enabled for this build. A live merchant gateway must be configured before accepting real funds.</span></div>
      {error && <p style={{ color: '#B42318', fontSize: 13 }}>{error}</p>}
      <div className="modal-action-row"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy} onClick={complete}>{busy ? 'Confirming…' : 'I completed the UPI payment'}</button></div>
    </div>
  </div>;
}
