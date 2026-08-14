import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Package } from 'lucide-react';
import { useWoolKart } from '../../context/WoolKartContext';

export default function MarketCart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useWoolKart();

  // Group cart items by seller
  const groupedCart = cartItems.reduce((acc, item) => {
    const seller = item.sellerName || 'Unknown Seller';
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {});

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#0B120D' }}>
        <Package size={64} color="#E5E5E5" style={{ margin: '0 auto 24px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Your Cart is Empty</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Browse the marketplace to find verified wool products.</p>
        <button onClick={() => navigate('/seller/market')} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
          EXPLORE MARKETPLACE
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', color: '#0B120D' }}>
      <button onClick={() => navigate('/seller/market')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#666', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Continue Shopping
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px' }}>MY CART</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
        <div>
          {Object.entries(groupedCart).map(([sellerName, items]) => (
            <div key={sellerName} style={{ marginBottom: '32px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: '#F8F8F3', padding: '16px 24px', borderBottom: '1px solid #E5E5E5', fontWeight: '800', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} /> SELLER: {sellerName.toUpperCase()}
              </div>
              
              <div style={{ padding: '0 24px' }}>
                {items.map((item, index) => (
                  <div key={item.productId} style={{ display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '24px', padding: '24px 0', borderBottom: index < items.length - 1 ? '1px solid #E5E5E5' : 'none', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', background: '#F8F8F3', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={`https://placehold.co/100/EDEDCE/0B120D?text=${item.name.substring(0, 3)}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>{item.name}</h3>
                      <div style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>Batch: {item.batchId || 'N/A'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', border: '1px solid #E5E5E5', borderRadius: '6px', overflow: 'hidden' }}>
                          <button onClick={() => updateQuantity(item.productId, Math.max(10, item.quantity - 10))} style={{ padding: '6px 12px', background: '#F8F8F3', border: 'none', cursor: 'pointer', fontWeight: '800' }}>-</button>
                          <div style={{ padding: '6px 16px', fontWeight: '800', borderLeft: '1px solid #E5E5E5', borderRight: '1px solid #E5E5E5', background: '#FFF', fontSize: '14px' }}>{item.quantity} KG</div>
                          <button onClick={() => updateQuantity(item.productId, item.quantity + 10)} style={{ padding: '6px 12px', background: '#F8F8F3', border: 'none', cursor: 'pointer', fontWeight: '800' }}>+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.productId)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#DC2626', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                          <Trash2 size={14} /> REMOVE
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', fontSize: '18px', marginBottom: '4px' }}>₹{(item.subtotal || 0).toLocaleString()}</div>
                      <div style={{ color: '#666', fontSize: '13px' }}>₹{item.unitPrice}/kg</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ background: '#F8F8F3', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '24px', position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px' }}>ORDER SUMMARY</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666' }}>
              <span>Subtotal ({cartItems.length} items)</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#666' }}>
              <span>Shipping & Logistics</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E5E5', color: '#666' }}>
              <span>Taxes</span>
              <span style={{ fontWeight: '700', color: '#0B120D' }}>Calculated at checkout</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: '800', marginBottom: '24px' }}>
              <span>Estimated Total</span>
              <span>₹{cartTotal.toLocaleString()}</span>
            </div>

            <button onClick={() => navigate('/seller/checkout')} style={{ width: '100%', padding: '16px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '800', cursor: 'pointer' }}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
