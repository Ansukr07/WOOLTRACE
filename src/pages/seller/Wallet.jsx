import React, { useState } from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle,
  Building,
  Smartphone,
  Lock,
  Plus
} from 'lucide-react';

export default function Wallet() {
  const { user } = useAuth();
  const { transactions, withdrawals, paymentMethods, orders, addWithdrawal, addPaymentMethod, addTransaction } = useGlobalState();
  const [activeTab, setActiveTab] = useState('Overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentType, setNewPaymentType] = useState('Bank Account');
  const [newPaymentDetails, setNewPaymentDetails] = useState('');

  // Wallet Calculations
  // Only use transactions for the authenticated user (demo handles FARMER-01)
  const userTxns = transactions.filter(t => t.userId === user?.id || t.userId === 'FARMER-01');
  const userWithdrawals = withdrawals.filter(w => w.userId === user?.id || w.userId === 'FARMER-01');
  
  // Available: Earnings that are Released minus Completed Withdrawals minus Fees
  const releasedEarnings = userTxns
    .filter(t => t.type === 'Sale' && t.status === 'Released')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const completedWithdrawals = userWithdrawals
    .filter(w => w.status === 'Completed' || w.status === 'Processing')
    .reduce((sum, w) => sum + w.amount, 0);

  const availableBalance = releasedEarnings - completedWithdrawals;

  // Escrow: Payments for active orders held in Escrow
  const activeEscrowOrders = orders.filter(o => 
    (o.sellerId === user?.id || o.sellerId === 'FARMER-01') && 
    (o.paymentStatus === 'ESCROW_LOCKED' && o.status !== 'Delivered')
  );
  
  const escrowBalance = activeEscrowOrders.reduce((sum, o) => sum + (o.total || 0), 0) + 48200; // adding mock base

  // Pending Settlement: Orders delivered but funds not yet released
  const pendingOrders = orders.filter(o => 
    (o.sellerId === user?.id || o.sellerId === 'FARMER-01') && 
    o.paymentStatus === 'ESCROW_LOCKED' && o.status === 'Delivered'
  );
  
  const pendingBalance = pendingOrders.reduce((sum, o) => sum + (o.total || 0), 0) + 18500; // mock base

  const totalEarnings = releasedEarnings + 642000; // mock base

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (amount > availableBalance) {
      alert("Insufficient available balance.");
      return;
    }
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const wdId = `WD-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const destination = paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.maskedDetails || 'Unknown';

    // 1. Add withdrawal record
    addWithdrawal({
      id: wdId,
      userId: user?.id || 'FARMER-01',
      amount: amount,
      paymentMethodId: selectedPaymentMethod,
      destination,
      status: 'Processing',
      createdAt: new Date().toISOString()
    });

    // 2. Add transaction record
    addTransaction({
      id: `TXN-${Math.floor(Math.random() * 100000)}`,
      userId: user?.id || 'FARMER-01',
      type: 'Withdrawal',
      amount: -amount,
      status: 'Processing',
      description: `Withdrawal to ${destination}`,
      createdAt: new Date().toISOString()
    });

    alert('Withdrawal requested successfully!');
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };

  const handleAddPaymentMethod = () => {
    if (!newPaymentDetails) {
      alert('Please enter payment details');
      return;
    }
    
    addPaymentMethod({
      id: `PM-${Math.floor(Math.random() * 10000)}`,
      userId: user?.id || 'FARMER-01',
      type: newPaymentType,
      maskedDetails: newPaymentDetails,
      isPrimary: paymentMethods.length === 0
    });
    
    setShowAddPaymentModal(false);
    setNewPaymentDetails('');
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <WalletIcon size={32} /> WALLET
          </h1>
          <p style={{ color: '#666' }}>Manage your WoolTrace earnings, settlements and transactions.</p>
        </div>
        <button 
          onClick={() => setShowWithdrawModal(true)}
          style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
        >
          WITHDRAW
        </button>
      </div>

      {/* Balance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
        <div style={{ background: '#FFF', border: '1px solid #0B120D', borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>AVAILABLE BALANCE</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>₹{availableBalance.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Available to withdraw</div>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05 }}><WalletIcon size={120} /></div>
        </div>

        <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>HELD IN ESCROW</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>₹{escrowBalance.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Funds secured for active orders</div>
        </div>

        <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>PENDING SETTLEMENT</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>₹{pendingBalance.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Expected after order completion</div>
        </div>

        <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
          <div style={{ color: '#666', fontSize: '14px', fontWeight: '700', marginBottom: '8px' }}>TOTAL EARNINGS</div>
          <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>₹{totalEarnings.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Lifetime earnings</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E5E5E5', marginBottom: '32px' }}>
        {['Overview', 'Transactions', 'Escrow', 'Withdrawals', 'Payment Methods'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'none', border: 'none', padding: '0 0 16px 0', fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              color: activeTab === tab ? '#0B120D' : '#666',
              borderBottom: activeTab === tab ? '2px solid #0B120D' : '2px solid transparent'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '400px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>WALLET OVERVIEW</h2>
            
            {/* Money Flow */}
            <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#666', marginBottom: '24px' }}>MONEY FLOW (LIFECYCLE)</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F0F9FF', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <CheckCircle color="#0284C7" />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Payment<br/>Secured</div>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E5E5E5', margin: '0 16px' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F0F9FF', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <Lock color="#0284C7" />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Held in<br/>Escrow</div>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E5E5E5', margin: '0 16px' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#DCFCE7', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <CheckCircle color="#16A34A" />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Funds<br/>Released</div>
                </div>
                <div style={{ flex: 1, height: '2px', background: '#E5E5E5', margin: '0 16px' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F8F8F3', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '1px solid #0B120D' }}>
                    <WalletIcon color="#0B120D" />
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '14px' }}>Available<br/>Balance</div>
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#666', marginBottom: '24px' }}>EARNINGS BREAKDOWN</h3>
              <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Gross Sales</span>
                  <span style={{ fontWeight: '700' }}>₹6,85,000</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Platform Fees</span>
                  <span style={{ fontWeight: '700', color: '#DC2626' }}>-₹12,500</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Transport Charges</span>
                  <span style={{ fontWeight: '700', color: '#DC2626' }}>-₹8,200</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666' }}>Refunds</span>
                  <span style={{ fontWeight: '700', color: '#DC2626' }}>-₹4,300</span>
                </div>
                <div style={{ height: '1px', background: '#E5E5E5', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '800' }}>
                  <span>Net Earnings</span>
                  <span>₹6,60,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {activeTab === 'Transactions' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>TRANSACTION HISTORY</h2>
            
            <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8F8F3', borderBottom: '1px solid #E5E5E5' }}>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Date</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Transaction ID</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Description</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Type</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Status</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {userTxns.map((txn) => (
                    <tr key={txn.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(txn.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>{txn.id}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        {txn.description}
                        {txn.orderId && <div style={{ fontSize: '12px', color: '#666' }}>{txn.orderId}</div>}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{txn.type}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700',
                          background: txn.status === 'Released' || txn.status === 'Completed' ? '#DCFCE7' : '#F0F9FF',
                          color: txn.status === 'Released' || txn.status === 'Completed' ? '#16A34A' : '#0369A1'
                        }}>
                          {txn.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700', textAlign: 'right', color: txn.amount > 0 ? '#16A34A' : '#DC2626' }}>
                        {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  {userTxns.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>No transactions yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ESCROW TAB */}
        {activeTab === 'Escrow' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>ACTIVE ESCROW</h2>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              {activeEscrowOrders.map(order => (
                <div key={order.id} style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#666' }}>ORDER</div>
                      <div style={{ fontSize: '18px', fontWeight: '800' }}>{order.id}</div>
                      <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Buyer: {order.buyerId || 'Unknown'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '24px', fontWeight: '800' }}>₹{(order.total || 0).toLocaleString()}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', marginTop: '4px' }}>
                        <Lock size={12} /> HELD IN ESCROW
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                    <span style={{ color: '#16A34A' }}>● Payment Secured</span>
                    <span style={{ color: '#E5E5E5' }}>—</span>
                    <span style={{ color: order.status === 'Shipped' || order.status === 'Delivered' ? '#16A34A' : '#666' }}>{order.status === 'Shipped' || order.status === 'Delivered' ? '●' : '○'} In Transit</span>
                    <span style={{ color: '#E5E5E5' }}>—</span>
                    <span style={{ color: order.status === 'Delivered' ? '#16A34A' : '#666' }}>{order.status === 'Delivered' ? '●' : '○'} Delivered</span>
                    <span style={{ color: '#E5E5E5' }}>—</span>
                    <span style={{ color: '#666' }}>○ Funds Released</span>
                  </div>
                </div>
              ))}
              
              {/* Mock static escrow item just to show the UI from specs */}
              <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#666' }}>ORDER</div>
                    <div style={{ fontSize: '18px', fontWeight: '800' }}>ORD-2026-00452</div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Buyer: ABC Textiles</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800' }}>₹1,84,040</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F0F9FF', color: '#0369A1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', marginTop: '4px' }}>
                      <Lock size={12} /> HELD IN ESCROW
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600' }}>
                  <span style={{ color: '#16A34A' }}>● Payment Secured</span>
                  <span style={{ color: '#E5E5E5' }}>—</span>
                  <span style={{ color: '#16A34A' }}>● In Transit</span>
                  <span style={{ color: '#E5E5E5' }}>—</span>
                  <span style={{ color: '#666' }}>○ Delivered</span>
                  <span style={{ color: '#E5E5E5' }}>—</span>
                  <span style={{ color: '#666' }}>○ Funds Released</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* WITHDRAWALS TAB */}
        {activeTab === 'Withdrawals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800' }}>WITHDRAWAL HISTORY</h2>
            </div>
            
            <div style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8F8F3', borderBottom: '1px solid #E5E5E5' }}>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Date</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Withdrawal ID</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Amount</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Destination</th>
                    <th style={{ padding: '16px', fontSize: '13px', fontWeight: '700', color: '#666' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userWithdrawals.map((wd) => (
                    <tr key={wd.id} style={{ borderBottom: '1px solid #E5E5E5' }}>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{new Date(wd.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>{wd.id}</td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>₹{wd.amount.toLocaleString()}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>{wd.destination}</td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <span style={{ 
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '700',
                          background: wd.status === 'Completed' ? '#DCFCE7' : '#F0F9FF',
                          color: wd.status === 'Completed' ? '#16A34A' : '#0369A1'
                        }}>
                          {wd.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {userWithdrawals.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#666' }}>No withdrawals yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENT METHODS TAB */}
        {activeTab === 'Payment Methods' && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>PAYMENT METHODS</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
              {paymentMethods.map(pm => (
                <div key={pm.id} style={{ background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#F8F8F3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {pm.type === 'Bank Account' ? <Building size={24} /> : <Smartphone size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', marginBottom: '4px' }}>{pm.type}</div>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>{pm.maskedDetails}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {pm.isPrimary && <span style={{ fontSize: '12px', fontWeight: '800', color: '#16A34A', background: '#DCFCE7', padding: '2px 8px', borderRadius: '4px' }}>PRIMARY</span>}
                      <button style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginLeft: 'auto' }}>REMOVE</button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => setShowAddPaymentModal(true)}
                style={{ background: '#F8F8F3', border: '1px dashed #0B120D', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: '140px' }}
              >
                <Plus size={32} color="#0B120D" style={{ marginBottom: '8px' }} />
                <span style={{ fontWeight: '800' }}>ADD PAYMENT METHOD</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>WITHDRAW FUNDS</h2>
              <button onClick={() => setShowWithdrawModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Close</button>
            </div>
            
            <div style={{ background: '#F8F8F3', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', color: '#666', fontWeight: '700' }}>AVAILABLE BALANCE</div>
              <div style={{ fontSize: '24px', fontWeight: '800' }}>₹{availableBalance.toLocaleString()}</div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Amount to withdraw (₹)</label>
              <input 
                type="number" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                style={{ width: '100%', padding: '16px', fontSize: '24px', fontWeight: '800', border: '1px solid #E5E5E5', borderRadius: '8px' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                {[5000, 10000, 25000].map(amt => (
                  <button key={amt} onClick={() => setWithdrawAmount(amt)} style={{ padding: '6px 12px', background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>
                    ₹{amt.toLocaleString()}
                  </button>
                ))}
                <button onClick={() => setWithdrawAmount(availableBalance)} style={{ padding: '6px 12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>
                  MAX
                </button>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Withdraw To</label>
              <select 
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                style={{ width: '100%', padding: '16px', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600' }}
              >
                <option value="">Select payment method...</option>
                {paymentMethods.map(pm => (
                  <option key={pm.id} value={pm.id}>{pm.type} - {pm.maskedDetails}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => setShowWithdrawModal(false)} style={{ padding: '16px', background: '#F8F8F3', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button onClick={handleWithdraw} style={{ padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                CONFIRM WITHDRAWAL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD PAYMENT METHOD MODAL */}
      {showAddPaymentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#FFF', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '800' }}>ADD PAYMENT METHOD</h2>
              <button onClick={() => setShowAddPaymentModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Close</button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>Method Type</label>
              <select 
                value={newPaymentType}
                onChange={(e) => setNewPaymentType(e.target.value)}
                style={{ width: '100%', padding: '16px', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600' }}
              >
                <option value="Bank Account">Bank Account</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '8px' }}>
                {newPaymentType === 'Bank Account' ? 'Account Details (e.g. HDFC **** 1234)' : 'UPI ID'}
              </label>
              <input 
                type="text" 
                value={newPaymentDetails}
                onChange={(e) => setNewPaymentDetails(e.target.value)}
                placeholder={newPaymentType === 'Bank Account' ? 'Bank Name & Last 4 digits' : 'seller@upi'}
                style={{ width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600', border: '1px solid #E5E5E5', borderRadius: '8px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <button onClick={() => setShowAddPaymentModal(false)} style={{ padding: '16px', background: '#F8F8F3', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button onClick={handleAddPaymentMethod} style={{ padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
                ADD METHOD
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
