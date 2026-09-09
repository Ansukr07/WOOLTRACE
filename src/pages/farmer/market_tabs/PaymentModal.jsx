import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Copy, ExternalLink, Info, X } from 'lucide-react';
import { confirmUpiPayment } from '../../../services/payment/paymentService';

export default function PaymentModal({ transaction, payment, onClose, onPaid }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [utr, setUtr] = useState('');
  const copyUpi = async () => {
    try { await navigator.clipboard.writeText(payment.upiUri); } catch { setError('Copy is unavailable in this browser. Scan the QR code instead.'); }
  };
  const complete = async () => {
    setBusy(true); setError('');
    try { onPaid(await confirmUpiPayment(payment.id, utr)); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="wt-modal-overlay" role="dialog" aria-modal="true" aria-label="UPI payment">
    <div className="wt-modal-card" style={{ maxWidth: 460 }}>
      <div className="modal-header-row"><div><h3 style={{ margin: 0 }}>Pay securely by UPI</h3><p style={{ margin: '4px 0 0', color: '#64748B', fontSize: 13 }}>Transaction {transaction.transactionNumber}</p></div><button className="btn-close-modal" onClick={onClose} aria-label="Close payment"><X size={20}/></button></div>
      <div style={{ textAlign: 'center', padding: '14px 0 6px' }}>
        <div style={{ display: 'inline-block', padding: 12, background: '#fff', border: '1px solid #D8DED5', borderRadius: 14 }}><QRCode value={payment.upiUri} size={176} /></div>
        <div style={{ fontSize: 28, fontWeight: 800, marginTop: 12 }}>₹{Number(payment.amount).toLocaleString('en-IN')}</div>
        <p style={{ color: '#475569', fontSize: 13, margin: '6px 0 0' }}>Scan using any UPI app or open the request on mobile.</p>
        <p style={{ color: '#667085', fontSize: 11, margin: '5px 0 0' }}>Paying to {payment.merchantVpa || 'configured merchant UPI ID'} · Ref {payment.reference}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}><button className="btn-secondary" style={{ flex: 1 }} onClick={copyUpi}><Copy size={15}/> Copy UPI link</button><a className="btn-secondary" style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }} href={payment.upiUri}><ExternalLink size={15}/> Open UPI app</a></div>
      <label className="upi-utr-field"><span>UPI transaction reference (UTR)</span><input value={utr} onChange={(event) => setUtr(event.target.value.replace(/\D/g, '').slice(0, 12))} inputMode="numeric" placeholder="Enter 12-digit UTR after payment" /></label>
      <div className="upi-manual-notice"><Info size={17}/><span>This project records the UTR supplied by the user. It does not independently verify settlement with a bank.</span></div>
      {error && <p style={{ color: '#B42318', fontSize: 13 }}>{error}</p>}
      <div className="modal-action-row"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy || utr.length !== 12} onClick={complete}>{busy ? 'Recording…' : 'Record payment'}</button></div>
    </div>
  </div>;
}
