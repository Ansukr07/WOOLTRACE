import { useGlobalState } from '../../context/GlobalStateContext';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, Warehouse, Truck, Scissors, Star, MapPin,
  ClipboardList, Navigation, Locate, Search, X
} from 'lucide-react';
import './Services.css';
import RealServiceMap from './components/ServiceMap';
import ProviderDetailsModal from './components/ProviderDetailsModal';
import RequestServiceModal from './components/RequestServiceModal';
import MyRequests from './components/MyRequests';

// ── Haversine distance in km ──────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Provider templates — NO hardcoded lat/lng.
// Offsets (in degrees) are applied at runtime relative to the user's actual location.
// ~0.01° ≈ 1.1 km, so these spread providers 2–15 km around the user.
const BASE_PROVIDERS = [
  {
    id: 1,
    name: 'WoolTrace Grading Centre',
    category: 'GRADING',
    categoryLabel: 'Wool Grading',
    owner: 'Dr. Anita Desai',
    rating: 4.8, reviews: 124,
    dLat: 0.022,  dLng: 0.018,   // ~2.4 km NE
    price: '₹800 / batch',
    services: ['Quality Grading', 'Certification', 'Fiber Testing'],
    verified: true,
    hours: '9:00 AM – 6:00 PM',
    phone: '+91 98765 43210',
    email: 'labs@wooltrace.in',
    experience: '12 years',
    description: 'Certified laboratory for comprehensive wool testing and grading. Digital certificates issued to WoolTrace network.',
  },
  {
    id: 2,
    name: 'State Wool Warehousing Corp.',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse Storage',
    owner: 'State Government',
    rating: 4.5, reviews: 89,
    dLat: -0.025, dLng: 0.020,   // ~3.2 km SE
    price: '₹120 / sq.ft / month',
    services: ['Secure Storage', 'Climate Control', 'Pest Control'],
    verified: true,
    hours: '24 / 7',
    phone: '+91 80222 33333',
    email: 'warehouse@wooltrace.in',
    experience: '30+ years',
    description: 'Secure, climate-controlled warehousing for long-term wool storage before processing.',
  },
  {
    id: 3,
    name: 'Rapid Farm Logistics',
    category: 'TRANSPORT',
    categoryLabel: 'Transportation',
    owner: 'Ramesh Singh',
    rating: 4.9, reviews: 210,
    dLat: 0.040,  dLng: -0.030,  // ~5.1 km NW
    price: '₹15 / km',
    services: ['Batch Pickup', 'Warehouse Delivery', 'Interstate Haul'],
    verified: true,
    hours: '6:00 AM – 10:00 PM',
    phone: '+91 99887 77665',
    email: 'dispatch@rapidfarm.in',
    experience: '8 years',
    description: 'Specialized wool-transport fleet with moisture-free transit from farm to warehouse.',
  },
  {
    id: 4,
    name: 'Expert Shearing Services',
    category: 'SHEARING',
    categoryLabel: 'Shearing',
    owner: 'Prakash Mooligere',
    rating: 4.6, reviews: 56,
    dLat: -0.060, dLng: -0.045,  // ~7.6 km SW
    price: '₹50 / sheep',
    services: ['Professional Shearing', 'Fleece Skirting', 'Fleece Rolling'],
    verified: true,
    hours: '7:00 AM – 4:00 PM',
    phone: '+91 99445 55666',
    email: 'book@expertshearing.in',
    experience: '15 years',
    description: 'Expert shearers trained in modern techniques to maximize yield with zero second-cuts.',
  },
  {
    id: 5,
    name: 'Veda Wool Sorting Hub',
    category: 'SORTING',
    categoryLabel: 'Wool Sorting',
    owner: 'Veda Enterprises',
    rating: 4.7, reviews: 97,
    dLat: 0.055,  dLng: 0.060,   // ~8.2 km NE
    price: '₹600 / batch',
    services: ['Fleece Sorting', 'Scouring', 'Blending'],
    verified: true,
    hours: '8:00 AM – 7:00 PM',
    phone: '+91 98001 22334',
    email: 'info@vedawool.in',
    experience: '10 years',
    description: 'Full-service wool sorting facility with modern equipment and trained staff.',
  },
  {
    id: 6,
    name: 'Green Pastures Veterinary',
    category: 'VETERINARY',
    categoryLabel: 'Veterinary',
    owner: 'Dr. Kavitha Nair',
    rating: 4.9, reviews: 145,
    dLat: -0.080, dLng: 0.050,   // ~9.8 km SE
    price: '₹200 / visit',
    services: ['Flock Health Check', 'Vaccination', 'Parasite Control'],
    verified: true,
    hours: '8:00 AM – 6:00 PM',
    phone: '+91 94488 12345',
    email: 'vet@greenpastures.in',
    experience: '18 years',
    description: 'Mobile veterinary services for sheep flocks. Pre-shearing health audits improve fleece quality.',
  },
  {
    id: 7,
    name: 'Rural Wool Processing Mill',
    category: 'PROCESSING',
    categoryLabel: 'Wool Processing',
    owner: 'Suresh Yadav',
    rating: 4.6, reviews: 78,
    dLat: 0.090,  dLng: -0.070,  // ~11.6 km NW
    price: '₹1,500 / batch',
    services: ['Scouring', 'Carding', 'Spinning'],
    verified: false,
    hours: '8:00 AM – 5:00 PM',
    phone: '+91 93333 44455',
    email: 'mill@ruralwool.in',
    experience: '5 years',
    description: 'Small-scale processing mill handling all stages from raw fleece to yarn.',
  },
];

const CATEGORIES = [
  { id: 'ALL',        label: 'All',          icon: null },
  { id: 'SORTING',   label: 'Sorting',       icon: <ShieldCheck size={14}/> },
  { id: 'GRADING',   label: 'Grading',       icon: <ShieldCheck size={14}/> },
  { id: 'SHEARING',  label: 'Shearing',      icon: <Scissors size={14}/> },
  { id: 'VETERINARY',label: 'Veterinary',    icon: <ShieldCheck size={14}/> },
  { id: 'WAREHOUSE', label: 'Warehouse',     icon: <Warehouse size={14}/> },
  { id: 'TRANSPORT', label: 'Transport',     icon: <Truck size={14}/> },
  { id: 'PROCESSING',label: 'Processing',    icon: <ShieldCheck size={14}/> },
];



export default function Services() {
  const { addProcessingRequest } = useGlobalState() || {};
  const [userLocation, setUserLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState('');
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  // Build provider list by placing each provider relative to the user's actual location.
  // dLat/dLng offsets spread providers realistically around wherever the user is.
  const enriched = userLocation
    ? BASE_PROVIDERS.map(p => {
        const lat = userLocation.lat + p.dLat;
        const lng = userLocation.lng + p.dLng;
        const dist = haversine(userLocation.lat, userLocation.lng, lat, lng);
        return { ...p, lat, lng, distKm: dist, distance: `${dist.toFixed(1)} km` };
      }).sort((a, b) => a.distKm - b.distKm)
    : [];

  // Filter by category + search
  const filtered = enriched.filter(p => {
    const catMatch = activeCategory === 'ALL' || p.category === activeCategory;
    const searchMatch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  // Reverse-geocode via Nominatim
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || '';
      const state = data.address?.state || '';
      setLocationLabel(city ? `${city}, ${state}` : 'Your Location');
    } catch {
      setLocationLabel('Your Location');
    }
  }, []);

  // Auto-locate on mount
  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(true);
      setLocationLabel('Location unavailable');
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationError(false);
        reverseGeocode(loc.lat, loc.lng);
        setLocating(false);
      },
      () => {
        // Do NOT fall back to Mysuru — show an error and let the user retry.
        setLocationError(true);
        setLocationLabel('');
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleMarkerClick = (provider) => setSelectedProvider(provider);

  const handleProviderCardClick = (provider) => {
    setSelectedProvider(provider);
    mapRef.current?.panToProvider(provider.id);
  };

  const handleRequestSubmit = (formData, provider) => {
    setServiceRequests(prev => [
      { id: Date.now(), formData, provider, status: 'Pending', dateCreated: new Date().toISOString() },
      ...prev,
    ]);

    if (provider && (provider.category === 'PROCESSING' || provider.category === 'SORTING')) {
      const newProcReq = {
        id: `PR-2026-${String(Date.now()).slice(-5)}`,
        batchId: formData.batch || 'WT-KA-2026-00124',
        farmerId: 'FARMER-01',
        farmerName: formData.name || 'Rajesh Kumar',
        processingUnitId: 'PU-01',
        processingUnitName: provider.name || 'WoolCraft Processing Centre',
        requestedOperations: ['Sorting', 'Washing', 'Spinning'],
        quantity: 428,
        woolType: 'Medium Wool',
        grade: 'Grade A',
        qualityScore: 87,
        origin: 'Mysuru, Karnataka',
        message: formData.message || 'Processing service request from Farmer map.',
        priority: 'NORMAL',
        status: 'REQUESTED',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (addProcessingRequest) {
        addProcessingRequest(newProcReq);
      }
    }

    setIsRequestModalOpen(false);
    setSelectedProvider(null);
    setShowMyRequests(true);
  };

  if (showMyRequests) {
    return <MyRequests requests={serviceRequests} onBack={() => setShowMyRequests(false)} />;
  }

  // ── Loading / Error state ────────────────────────────────────────────
  if (locating) {
    return (
      <div className="services-page">
        <div className="location-prompt panel">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
          <h3>Getting your location…</h3>
          <p>Please allow location access when prompted by your browser.</p>
        </div>
      </div>
    );
  }

  if (!userLocation || locationError) {
    return (
      <div className="services-page">
        <div className="location-prompt panel">
          <div style={{ fontSize: 40, marginBottom: 12 }}>📍</div>
          <h3>Location Required</h3>
          <p>To find nearby wool services, WoolTrace needs your location.<br/>Please allow location access or try again.</p>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={requestLocation}>
            <Locate size={16} /> Use My Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      {/* ── Location Header ── */}
      <div className="location-header">
        <div className="location-left">
          <span className="text-small text-gray">Services near you</span>
          <h2 className="location-title">
            <MapPin size={20} color="#16A34A" />
            {locating ? 'Getting your location…' : locationLabel}
          </h2>
        </div>
        <div className="location-actions">
          <button className="icon-text-btn" onClick={requestLocation} disabled={locating}>
            <Locate size={16} /> {locating ? '…' : 'Use My Location'}
          </button>
          <button className="btn-secondary" onClick={() => setShowMyRequests(true)}>
            <ClipboardList size={16} /> My Requests
            {serviceRequests.length > 0 && (
              <span className="badge-count">{serviceRequests.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="search-row">
        <div className="search-bar">
          <Search size={16} color="#999" />
          <input
            type="text"
            placeholder="Search service providers…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Real Leaflet Map ── */}
      <RealServiceMap
        ref={mapRef}
        providers={filtered}
        userLocation={userLocation}
        onMarkerClick={handleMarkerClick}
        selectedProviderId={selectedProvider?.id}
      />

      {/* ── Category Filters ── */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Nearby Services List ── */}
      <div>
        <h3 className="section-title">
          Nearby Services <span className="count-badge">{filtered.length}</span>
        </h3>
        {filtered.length === 0 ? (
          <div className="panel empty-state">
            <p>No service providers found for this filter.</p>
          </div>
        ) : (
          <div className="providers-list">
            {filtered.map(provider => (
              <div
                key={provider.id}
                className={`provider-list-card panel ${selectedProvider?.id === provider.id ? 'highlighted' : ''}`}
                onClick={() => handleProviderCardClick(provider)}
              >
                <div className="provider-info-left">
                  <div className="provider-name-row">
                    <h4>{provider.name}</h4>
                    {provider.verified && <span className="verified-pill">✓ Verified</span>}
                  </div>
                  <div className="provider-sub">{provider.categoryLabel}</div>
                  <div className="provider-meta">
                    <span className="dist-badge">
                      <Navigation size={12} /> {provider.distance}
                    </span>
                    <span className="rating-pill">
                      <Star size={12} fill="#EAB308" color="#EAB308" /> {provider.rating}
                    </span>
                    <span className="price-pill">{provider.price}</span>
                  </div>
                </div>
                <button
                  className="btn-view"
                  onClick={e => { e.stopPropagation(); handleProviderCardClick(provider); }}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Provider Details Modal ── */}
      <ProviderDetailsModal
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        onRequestService={() => setIsRequestModalOpen(true)}
      />

      {/* ── Request Service Modal ── */}
      {isRequestModalOpen && (
        <RequestServiceModal
          provider={selectedProvider}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmit={handleRequestSubmit}
        />
      )}
    </div>
  );
}
