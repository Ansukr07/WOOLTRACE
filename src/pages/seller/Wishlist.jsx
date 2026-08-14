import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  // Simulated wishlist for the demo
  const wishlistItems = [];

  if (wishlistItems.length === 0) {
    return (
      <div style={{ padding: '64px', textAlign: 'center', color: '#0B120D' }}>
        <Heart size={64} color="#E5E5E5" style={{ margin: '0 auto 24px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Your Wishlist is Empty</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>Save items you love and buy them later.</p>
        <button onClick={() => navigate('/seller/market')} style={{ padding: '12px 24px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}>
          EXPLORE MARKETPLACE
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px' }}>MY WISHLIST</h1>
      {/* Grid of wishlist items would go here if populated */}
    </div>
  );
}
