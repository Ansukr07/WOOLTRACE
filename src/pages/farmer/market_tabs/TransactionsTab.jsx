import React from 'react';
import { DollarSign, ShieldAlert, Smartphone, CheckCircle2 } from 'lucide-react';

export default function TransactionsTab({
  marketTransactions,
  onOpenDispute,
  onConfirmDelivery,
  onStartPayment
}) {
  const displayTransactions = marketTransactions.filter(txn => (
    txn?.transactionNumber && txn?.buyerName && txn?.farmerName && Number.isFinite(Number(txn.grossValue))
  ));
  return (
    <div>
      <div className="panel-header-row">
        <h3 className="panel-title">
          <DollarSign size={20} />
          Trade transactions
        </h3>
        <span style={{ fontSize: '13px', color: '#64748B' }}>Delivery milestones, UPI payment requests, and transparent settlement records</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {displayTransactions.map(txn => (
          <div key={txn.id} className="market-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#0B120D' }}>
                  {txn.transactionNumber}
                </h4>
                <span style={{ fontSize: '13px', color: '#64748B' }}>
                  Lot #{txn.lotNumber} · Buyer: <strong>{txn.buyerName}</strong> · Seller: {txn.farmerName}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  background: txn.deliveryStatus === 'DELIVERED' ? '#DDFF86' : '#EDEDCE',
                  padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800'
                }}>
                  🚚 {txn.deliveryStatus}
                </span>
                <span style={{
                  background: txn.paymentStatus === 'PAID' ? '#DDFF86' : '#BED5E5',
                  padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '800'
                }}>
                  🔒 {txn.paymentStatus}
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px', background: '#F8F8F3', borderRadius: '10px', padding: '16px', margin: '14px 0'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>AGREED PRICE</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>₹{txn.agreedPricePerKg}/KG</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>GROSS VALUE</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>₹{txn.grossValue?.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>LOGISTICS & STORAGE DEDUCTION</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFAAA4' }}>- ₹{(txn.transportCost + txn.storageCost + txn.transactionFee)?.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>NET REALIZATION PAYOUT</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0B120D' }}>₹{txn.netRealization?.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Transaction date: {new Date(txn.transactionDate).toLocaleDateString('en-IN')} · {txn.paymentReference || 'Payment request pending'}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '6px 12px' }}
                  onClick={() => onOpenDispute?.(txn)}
                >
                  <ShieldAlert size={14} style={{ marginRight: '4px' }} />
                  Raise Dispute
                </button>
                {txn.paymentStatus !== 'PAID' && (
                  <button className="btn-primary" style={{ fontSize: '12px', padding: '6px 12px' }} onClick={() => onStartPayment?.(txn)}>
                    <Smartphone size={14} style={{ marginRight: '4px' }} /> Pay by UPI
                  </button>
                )}
                {txn.paymentStatus === 'PAID' && txn.deliveryStatus !== 'DELIVERED' && (
                  <button
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                    onClick={() => onConfirmDelivery(txn)}
                  >
                    <CheckCircle2 size={14} style={{ marginRight: '4px' }} /> Confirm delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
