import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Heart } from 'lucide-react';
import { CATEGORIES, MOCK_PRODUCTS } from './mockData';
import './WoolKartStyles.css';

const WoolKartHome = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Filter products locally based on category and search
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchCategory = activeCategory === 'ALL' || product.category === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="woolkart-container">
      {/* Landing Page Header */}
      <div className="woolkart-header">
        <h1>WOOLKART</h1>
        <p>"Everything you need for the wool ecosystem."</p>
        <div className="woolkart-search-bar">
          <Search size={20} color="#666" />
          <input 
            type="text" 
            placeholder="Search wool, equipment, supplies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Horizontal Category Selector */}
      <div className="woolkart-categories">
        {CATEGORIES.map(category => (
          <button 
            key={category}
            className={`category-chip ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Featured Products / Listings */}
      <div className="woolkart-content">
        <h2 className="section-title">
          {searchQuery ? 'SEARCH RESULTS' : (activeCategory === 'ALL' ? 'FEATURED ON WOOLKART' : activeCategory)}
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div style={{textAlign: 'center', padding: '40px 0', color: '#666'}}>
            <p style={{marginBottom: '16px'}}>No products found.</p>
            <button className="btn-secondary" onClick={() => { setSearchQuery(''); setActiveCategory('ALL'); }}>
              CLEAR FILTERS
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => navigate(`/farmer/woolkart/product/${product.id}`)}
              >
                <div className="product-image-container">
                  <img src={product.images[0]} alt={product.name} loading="lazy" />
                  <button className="wishlist-btn" onClick={(e) => { e.stopPropagation(); /* Add to wishlist logic */ }}>
                    <Heart size={18} />
                  </button>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <Star size={14} fill="#0B120D" color="#0B120D" />
                    {product.productRating.toFixed(1)}
                  </div>
                  <div className="product-seller">
                    {product.sellerName}
                    {product.sellerVerified && (
                      <span className="verified-badge">✓</span>
                    )}
                  </div>
                  <div className="product-location">{product.sellerLocation}</div>
                  
                  <div className="product-stock flex-1">
                    ✓ {product.stockStatus}
                  </div>
                  
                  <div className="product-price-row">
                    <span className="product-price">₹{product.price.toLocaleString()}</span>
                    <span className="product-unit">/ {product.unit}</span>
                  </div>
                  <button 
                    className="btn-add-cart w-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/farmer/woolkart/product/${product.id}`);
                    }}
                  >
                    VIEW PRODUCT
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WoolKartHome;
