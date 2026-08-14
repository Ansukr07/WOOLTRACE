import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Filter, ChevronDown, Check, Star } from 'lucide-react';
import { useGlobalState } from '../../context/GlobalStateContext';
import { useWoolKart } from '../../context/WoolKartContext';

export default function Marketplace() {
  const navigate = useNavigate();
  const { listings, certificates } = useGlobalState();
  const { addToCart } = useWoolKart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = [
    { id: 'ALL', name: 'ALL' },
    { id: 'RAW_WOOL', name: 'RAW WOOL' },
    { id: 'YARN', name: 'WOOL YARN' },
    { id: 'FABRIC', name: 'WOOL FABRIC' },
    { id: 'PRODUCTS', name: 'WOOL PRODUCTS' }
  ];

  // Dummy mock data for categories that aren't in GlobalState yet
  const displayListings = [
    ...listings,
    {
      id: 'LST-002',
      batchId: 'WT-RJ-2026-00842',
      sellerId: 'SELLER-02',
      sellerName: 'Desert Wool Co.',
      type: 'YARN',
      title: 'Handspun Carpet Yarn',
      description: 'Coarse yarn perfect for hand-knotted carpets. Natural beige.',
      quantity: 150,
      price: 650,
      unit: 'kg',
      status: 'Active',
      location: 'Bikaner, Rajasthan',
      rating: 4.6,
      verified: true
    },
    {
      id: 'LST-003',
      batchId: 'WT-HP-2026-00411',
      sellerId: 'SELLER-03',
      sellerName: 'Himalayan Weavers',
      type: 'RAW_WOOL',
      title: 'Fine Himalayan Wool',
      description: 'Extremely fine wool from high-altitude sheep.',
      quantity: 80,
      price: 1200,
      unit: 'kg',
      status: 'Active',
      location: 'Kullu, Himachal Pradesh',
      rating: 4.9,
      verified: true
    }
  ];

  const filteredListings = displayListings.filter(l => {
    const matchesCategory = selectedCategory === 'ALL' || l.type === selectedCategory;
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.batchId?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', color: '#0B120D' }}>
      
      {/* Hero Section */}
      <div style={{ background: '#0B120D', color: '#FFF', padding: '48px', borderRadius: '16px', marginBottom: '32px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', color: '#DDFF86' }}>
          SOURCE WOOL WITH CONFIDENCE
        </h1>
        <p style={{ fontSize: '18px', color: '#E5E5E5', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
          Discover quality-verified wool, yarn, fabric and wool products from trusted producers and sellers across India.
        </p>

        <div style={{ display: 'flex', gap: '16px', maxWidth: '700px', margin: '0 auto 24px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={24} color="#666" style={{ position: 'absolute', left: '16px', top: '16px' }} />
            <input 
              type="text" 
              placeholder="Search products, wool types, sellers, batch IDs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '16px 16px 16px 56px', borderRadius: '8px', border: 'none', fontSize: '16px' }}
            />
          </div>
          <button style={{ padding: '0 32px', background: '#DDFF86', color: '#0B120D', border: 'none', borderRadius: '8px', fontWeight: '800', fontSize: '16px', cursor: 'pointer' }}>
            SEARCH
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '14px', fontWeight: '700' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} color="#DDFF86" /> Quality Verified</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} color="#DDFF86" /> Traceable Batches</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Check size={16} color="#DDFF86" /> Verified Sellers</span>
        </div>
      </div>

      {/* Categories */}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '16px' }}>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ 
              padding: '12px 24px', 
              borderRadius: '24px', 
              fontWeight: '700', 
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedCategory === cat.id ? '#0B120D' : '#F8F8F3',
              color: selectedCategory === cat.id ? '#FFF' : '#0B120D',
              border: selectedCategory === cat.id ? 'none' : '1px solid #E5E5E5'
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{filteredListings.length} PRODUCTS FOUND</h2>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#FFF', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
          <Filter size={18} /> Filters <ChevronDown size={16} />
        </button>
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredListings.map(listing => {
          const cert = certificates.find(c => c.batchId === listing.batchId);
          
          return (
            <div key={listing.id} style={{ background: '#FFF', borderRadius: '12px', border: '1px solid #E5E5E5', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '200px', background: '#F8F8F3', position: 'relative' }}>
                <img src={`https://placehold.co/400x300/EDEDCE/0B120D?text=${listing.title.replace(/ /g, '+')}`} alt={listing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {cert && (
                  <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#16A34A', color: '#FFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> QUALITY VERIFIED
                  </div>
                )}
              </div>
              
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#666', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>{listing.type}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>{listing.title}</h3>
                
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#0B120D', marginBottom: '16px' }}>
                  ₹{listing.price} <span style={{ fontSize: '14px', color: '#666', fontWeight: '400' }}>/ {listing.unit}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px', background: '#F8F8F3', padding: '12px', borderRadius: '8px' }}>
                  <div>
                    <div style={{ color: '#666' }}>Available</div>
                    <div style={{ fontWeight: '700' }}>{listing.quantity} {listing.unit}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>MOQ</div>
                    <div style={{ fontWeight: '700' }}>10 {listing.unit}</div>
                  </div>
                  {cert && (
                    <>
                      <div>
                        <div style={{ color: '#666' }}>Grade</div>
                        <div style={{ fontWeight: '700', color: '#16A34A' }}>{cert.grade} ✓</div>
                      </div>
                      <div>
                        <div style={{ color: '#666' }}>Quality</div>
                        <div style={{ fontWeight: '700' }}>{cert.qualityScore}/100</div>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
                    <div>
                      <div style={{ fontWeight: '700' }}>{listing.sellerName}</div>
                      <div style={{ color: '#666' }}>{listing.location || 'India'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#16A34A', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}><Check size={14} /> Verified</div>
                      <div style={{ color: '#D97706', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '2px' }}><Star size={14} /> {listing.rating || '4.8'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate(`/seller/product/${listing.id}`)} style={{ flex: 1, padding: '12px', background: '#FFF', border: '1px solid #0B120D', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                      DETAILS
                    </button>
                    <button onClick={() => {
                      addToCart({
                        id: listing.id,
                        name: listing.title,
                        price: listing.price,
                        sellerName: listing.sellerName,
                        batchId: listing.batchId
                      }, 10);
                      alert(`${listing.title} added to cart!`);
                    }} style={{ flex: 1, padding: '12px', background: '#0B120D', color: '#DDFF86', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
