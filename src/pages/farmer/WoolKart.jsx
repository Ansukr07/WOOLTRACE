import React, { useState } from 'react';
import { ShoppingCart, Star, Search, Filter } from 'lucide-react';
import './WoolKart.css';

const products = [
  { id: 1, name: 'Premium Sheep Shears 3000', price: 4500, rating: 4.8, category: 'Equipment', image: '✂️' },
  { id: 2, label: 'NutriFeed High Protein', price: 1200, rating: 4.5, category: 'Fodder', image: '🌾' },
  { id: 3, name: 'Wool Sorting Table', price: 8500, rating: 4.9, category: 'Equipment', image: '🪚' },
  { id: 4, name: 'Sheep Care Kit (Vitamins)', price: 850, rating: 4.6, category: 'Sheep Care', image: '💊' },
];

const WoolKart = () => {
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="woolkart-page">
      <div className="page-header">
        <div>
          <h1>WoolKart</h1>
          <p>Marketplace for farm equipment, feed, and tools.</p>
        </div>
        <button className="btn-primary" onClick={() => alert('Cart feature coming soon!')}>
          <ShoppingCart size={20} />
          Cart ({cartCount})
        </button>
      </div>

      <div className="toolbar">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search for products..." />
        </div>
        <button className="btn-filter">
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card panel">
            <div className="product-image">
              <span style={{fontSize: '64px'}}>{product.image}</span>
            </div>
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3>{product.name || product.label}</h3>
              <div className="product-rating">
                <Star size={14} fill="#EAB308" color="#EAB308" />
                <span>{product.rating}</span>
              </div>
              <div className="product-price">₹{product.price}</div>
              <button className="btn-secondary w-100 mt-4" onClick={handleAddToCart}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WoolKart;
