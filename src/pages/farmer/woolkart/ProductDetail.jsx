import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Truck, ShieldCheck, Heart } from 'lucide-react';
import { MOCK_PRODUCTS } from './mockData';
import { useWoolKart } from '../../../context/WoolKartContext';
import './WoolKartStyles.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useWoolKart();
  
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [quantity, setQuantity] = useState(product ? product.minimumOrderQuantity : 1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  if (!product) {
    return (
      <div className="woolkart-container" style={{padding: '40px', textAlign: 'center'}}>
        <h2>Product not found.</h2>
        <button className="btn-secondary" onClick={() => navigate('/farmer/woolkart')} style={{marginTop: '20px'}}>
          Return to WoolKart
        </button>
      </div>
    );
  }

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= product.minimumOrderQuantity && newQty <= product.availableQuantity) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/farmer/woolkart/checkout');
  };

  // Find related products
  const relatedProducts = MOCK_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="woolkart-container" style={{backgroundColor: '#F8F8F3'}}>
      <div style={{padding: '32px'}}>
        <button className="back-btn" onClick={() => navigate('/farmer/woolkart')}>
          ← Back to Marketplace
        </button>
        
        {showAddedToCart && (
          <div style={{
            backgroundColor: '#16A34A', color: 'white', padding: '16px', borderRadius: '8px', 
            marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
          }}>
            ✓ {quantity} {product.unit} of {product.name} added to your cart.
            <button 
              className="btn-secondary" 
              style={{marginLeft: 'auto', padding: '8px 16px', fontSize: '14px', border: 'none'}}
              onClick={() => navigate('/farmer/woolkart/cart')}
            >
              VIEW CART
            </button>
          </div>
        )}

        <div className="product-detail-container">
          {/* Left: Image Gallery */}
          <div className="product-gallery">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="main-image"
            />
            {product.images.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx+1}`}
                    className={`thumbnail ${idx === activeImageIndex ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase Actions */}
          <div className="product-details-right">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-rating-large">
              <Star size={18} fill="#0B120D" color="#0B120D" />
              <span style={{fontWeight: '700', color: '#0B120D'}}>{product.productRating.toFixed(1)}</span>
              <span>({product.reviews.length} reviews)</span>
            </div>
            
            <div className="price-block">
              <span className="price">₹{product.price.toLocaleString()}</span>
              <span className="unit">/ {product.unit}</span>
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <div className="product-stock" style={{fontSize: '15px', marginBottom: '8px'}}>
                ✓ {product.stockStatus}
              </div>
              <div style={{fontSize: '14px', color: '#666'}}>
                Available: {product.availableQuantity} {product.unit}
              </div>
            </div>

            <div style={{fontWeight: '700', marginBottom: '12px'}}>Quantity</div>
            <div className="quantity-selector">
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= product.minimumOrderQuantity}
                style={{opacity: quantity <= product.minimumOrderQuantity ? 0.5 : 1}}
              >-</button>
              <input 
                type="text" 
                className="qty-input" 
                value={quantity}
                readOnly
              />
              <button 
                className="qty-btn" 
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.availableQuantity}
                style={{opacity: quantity >= product.availableQuantity ? 0.5 : 1}}
              >+</button>
            </div>
            
            <div className="min-order">
              Minimum order: {product.minimumOrderQuantity} {product.unit}
              <br/>
              Subtotal: <strong>₹{(product.price * quantity).toLocaleString()}</strong>
            </div>

            <div className="action-buttons">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button className="btn-buy-now" onClick={handleBuyNow}>
                BUY NOW
              </button>
            </div>
            
            <button 
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: 'none', 
                border: 'none', color: '#666', fontWeight: '600', cursor: 'pointer', fontSize: '15px'
              }}
            >
              <Heart size={18} /> ADD TO WISHLIST
            </button>
          </div>
        </div>

        {/* Lower Info Sections */}
        <div className="info-sections">
          <div className="info-section">
            <h3>PRODUCT DESCRIPTION</h3>
            <p style={{lineHeight: '1.6', color: '#444', fontSize: '15px', maxWidth: '800px'}}>
              {product.description}
            </p>
          </div>

          <div className="info-section">
            <h3>DETAILED SPECIFICATIONS</h3>
            <div className="spec-grid" style={{maxWidth: '800px'}}>
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="info-section">
            <h3>SELLER INFORMATION</h3>
            <div className="seller-box" style={{maxWidth: '800px'}}>
              <div className="seller-info-left">
                <div style={{fontSize: '12px', color: '#666', fontWeight: '700', marginBottom: '4px'}}>LISTED BY</div>
                <div style={{fontSize: '18px', fontWeight: '800', color: '#0B120D'}}>
                  {product.sellerName}
                  {product.sellerVerified && <span className="verified-badge"><ShieldCheck size={12}/> VERIFIED SELLER</span>}
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontSize: '14px', marginTop: '4px'}}>
                  <MapPin size={14} /> {product.sellerLocation}
                </div>
              </div>
              <div style={{textAlign: 'right'}}>
                <div style={{fontWeight: '700', fontSize: '16px'}}>★ {product.sellerRating.toFixed(1)} Rating</div>
                <button className="btn-secondary" style={{marginTop: '12px', padding: '8px 16px'}}>VIEW SELLER</button>
              </div>
            </div>
          </div>

          <div className="info-section">
            <h3>DELIVERY INFORMATION</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#BED5E5', padding: '16px', borderRadius: '12px', maxWidth: '800px'}}>
              <Truck size={24} color="#0B120D" />
              <div>
                <div style={{fontWeight: '700'}}>Estimated delivery: {product.deliveryEstimate}</div>
                <div style={{fontSize: '14px'}}>Based on your location. (Demo estimated delivery)</div>
              </div>
            </div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="info-section" style={{marginTop: '48px'}}>
              <h3 style={{borderBottom: 'none'}}>YOU MAY ALSO LIKE</h3>
              <div className="products-grid">
                {relatedProducts.map(p => (
                  <div 
                    key={p.id} 
                    className="product-card"
                    onClick={() => {
                      navigate(`/farmer/woolkart/product/${p.id}`);
                      window.scrollTo(0,0);
                    }}
                  >
                    <div className="product-image-container" style={{height: '160px'}}>
                      <img src={p.images[0]} alt={p.name} loading="lazy" />
                    </div>
                    <div className="product-info" style={{padding: '12px'}}>
                      <h4 style={{fontSize: '14px', margin: '0 0 4px 0'}}>{p.name}</h4>
                      <div style={{fontWeight: '800'}}>₹{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
