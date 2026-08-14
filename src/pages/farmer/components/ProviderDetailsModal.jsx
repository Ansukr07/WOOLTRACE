import React from 'react';
import {
  MapPin, Star, Clock, Phone, Mail, Navigation, FileText,
  CheckCircle, Building, User, Award
} from 'lucide-react';

const ProviderDetailsModal = ({ provider, onClose, onRequestService }) => {
  if (!provider) return null;

  const handleCall = () => window.open(`tel:${provider.phone}`);
  const handleDirections = () =>
    window.open(
      `https://www.openstreetmap.org/directions?from=&to=${provider.lat},${provider.lng}`,
      '_blank'
    );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '17px' }}>{provider.name}</h3>
            {provider.verified && (
              <span className="verified-pill" style={{ marginTop: '6px', display: 'inline-flex' }}>
                <CheckCircle size={12} style={{ marginRight: 4 }} /> Verified Provider
              </span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Rating + Distance */}
          <div className="rating-distance">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
              <Star size={16} fill="#EAB308" color="#EAB308" />
              {provider.rating}
              <span style={{ color: '#666', fontWeight: 400, fontSize: 13 }}>({provider.reviews} reviews)</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16A34A', fontWeight: 700 }}>
              <MapPin size={16} /> {provider.distance} from you
            </span>
          </div>

          <div className="price-highlight">{provider.price}</div>

          {/* Owner & Experience */}
          <div className="detail-section" style={{ marginTop: 20 }}>
            <h4>Provider Info</h4>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={14} color="#666" /> <strong>Owner:</strong> {provider.owner}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={14} color="#666" /> <strong>Service:</strong> {provider.categoryLabel}
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={14} color="#666" /> <strong>Experience:</strong> {provider.experience}
            </p>
          </div>

          {/* Contact */}
          <div className="detail-section">
            <h4>Contact & Hours</h4>
            <div className="contact-row"><Clock size={15} color="#666" /> {provider.hours}</div>
            <div className="contact-row"><Phone size={15} color="#666" /> {provider.phone}</div>
            <div className="contact-row"><Mail size={15} color="#666" /> {provider.email}</div>
            <div className="contact-row"><MapPin size={15} color="#666" /> {provider.address}</div>
          </div>

          {/* Services list */}
          <div className="detail-section">
            <h4>Available Services</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {provider.services.map((s, i) => (
                <span key={i} style={{
                  background: '#BED5E5', color: '#0B120D', fontSize: 12,
                  fontWeight: 700, padding: '4px 10px', borderRadius: 4
                }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="detail-section">
            <h4>About</h4>
            <p className="description-text">{provider.description}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="btn-primary flex-1" onClick={onRequestService}>
            <FileText size={16} /> Request Service
          </button>
          <button className="icon-btn-lg" onClick={handleCall} title={`Call ${provider.phone}`}>
            <Phone size={18} />
          </button>
          <button className="icon-btn-lg" onClick={handleDirections} title="Get Directions">
            <Navigation size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsModal;
