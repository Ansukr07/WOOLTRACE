import { useGlobalState } from '../../context/GlobalStateContext';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck, Warehouse, Truck, Scissors, Star, MapPin,
  ClipboardList, Navigation, Locate, Search, X, Sparkles, CheckCircle2, ChevronDown
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

// ── Regional Preset Locations ──────────────────────────────────────────────
const REGION_PRESETS = [
  { id: 'mandya', name: 'Mandya & Mysuru, KA', lat: 12.5218, lng: 76.8951 },
  { id: 'bikaner', name: 'Bikaner Hub, RJ', lat: 28.0229, lng: 73.3119 },
  { id: 'kullu', name: 'Kullu Valley, HP', lat: 31.9579, lng: 77.1095 },
  { id: 'ludhiana', name: 'Ludhiana Exchange, PB', lat: 30.9010, lng: 75.8573 },
  { id: 'jamnagar', name: 'Jamnagar Port, GJ', lat: 22.4707, lng: 70.0577 }
];

const DEFAULT_LOCATION = REGION_PRESETS[0];

// ── Provider templates ─────────────────────────────────────────────────────
const BASE_PROVIDERS = [
  {
    id: 1,
    name: 'WoolTrace Central Testing & QA Lab',
    category: 'GRADING',
    categoryLabel: 'Wool Grading & Lab QA',
    owner: 'Dr. Anita Desai',
    rating: 4.9, reviews: 142,
    dLat: 0.022,  dLng: 0.018,   // ~2.4 km NE
    price: '₹800 / batch',
    services: ['Quality Grading', 'Digital Certificate', 'Fiber Micron Analysis', 'Yield Testing'],
    verified: true,
    hours: '8:30 AM – 6:30 PM',
    phone: '+91 98765 43210',
    email: 'qa.lab@wooltrace.in',
    experience: '14 years',
    description: 'Accredited testing laboratory for comprehensive wool testing and micron grading. Verifiable digital certificates issued directly to the WoolTrace blockchain ledger.',
  },
  {
    id: 2,
    name: 'State Wool Warehousing Corp.',
    category: 'WAREHOUSE',
    categoryLabel: 'Warehouse Storage',
    owner: 'K. Somanna',
    rating: 4.8, reviews: 98,
    dLat: -0.025, dLng: 0.020,   // ~3.2 km SE
    price: '₹4.5 / KG / month',
    services: ['Climate-Controlled Storage', 'Moisture-Lock Sealed Bays', 'Pest Protection', 'Pallet Barcoding'],
    verified: true,
    hours: '24 / 7 Operations',
    phone: '+91 821 245 8899',
    email: 'mysuru.hub@wooltrace.in',
    experience: '22 years',
    description: 'Secure, ISO-certified warehousing with cold dehumidification and 24/7 CCTV surveillance for raw fleece.',
  },
  {
    id: 3,
    name: 'Rapid Farm Logistics Fleet',
    category: 'TRANSPORT',
    categoryLabel: 'Transportation & Haulage',
    owner: 'Ramesh Singh',
    rating: 4.9, reviews: 215,
    dLat: 0.040,  dLng: -0.030,  // ~5.1 km NW
    price: '₹14 / km',
    services: ['Farm Gate Pickup', 'Warehouse Delivery', 'Interstate Mill Freight', 'GPS Live Tracking'],
    verified: true,
    hours: '6:00 AM – 10:00 PM',
    phone: '+91 99887 77665',
    email: 'dispatch@rapidfarm.in',
    experience: '9 years',
    description: 'Specialized wool-transport fleet equipped with humidity-sealed tarpaulins and instant GPS telemetry.',
  },
  {
    id: 4,
    name: 'Expert Shearing Collective',
    category: 'SHEARING',
    categoryLabel: 'Professional Shearing',
    owner: 'Prakash Mooligere',
    rating: 4.7, reviews: 68,
    dLat: -0.050, dLng: -0.040,  // ~6.8 km SW
    price: '₹55 / sheep',
    services: ['Machine Shearing', 'Fleece Skirting', 'Belly Separation', 'Baling Assistance'],
    verified: true,
    hours: '6:30 AM – 4:00 PM',
    phone: '+91 99445 55666',
    email: 'book@expertshearing.in',
    experience: '16 years',
    description: 'Certified shearers trained in modern Australian/New Zealand continuous flow techniques with zero second-cuts.',
  },
  {
    id: 5,
    name: 'Veda Wool Sorting & Blending Hub',
    category: 'SORTING',
    categoryLabel: 'Wool Sorting & Scouring',
    owner: 'Veda Enterprises',
    rating: 4.8, reviews: 104,
    dLat: 0.055,  dLng: 0.050,   // ~7.8 km NE
    price: '₹650 / batch',
    services: ['Fleece Sorting', 'Vegetable Matter Removal', 'Fiber Grading', 'Sample Blending'],
    verified: true,
    hours: '8:00 AM – 7:00 PM',
    phone: '+91 98001 22334',
    email: 'info@vedawool.in',
    experience: '11 years',
    description: 'Industrial sorting facility with multi-stage optical inspection and skilled fleece sorters.',
  },
  {
    id: 6,
    name: 'Green Pastures Veterinary Clinic',
    category: 'VETERINARY',
    categoryLabel: 'Flock Health & Veterinary',
    owner: 'Dr. Kavitha Nair',
    rating: 4.9, reviews: 160,
    dLat: -0.070, dLng: 0.045,   // ~8.6 km SE
    price: '₹250 / flock visit',
    services: ['Flock Health Audit', 'Parasite Dip & Vaccination', 'Nutritional Advisory', 'Pre-Shearing Check'],
    verified: true,
    hours: '8:00 AM – 6:00 PM',
    phone: '+91 94488 12345',
    email: 'vet@greenpastures.in',
    experience: '19 years',
    description: 'Mobile veterinary team for sheep and goat flocks. Regular health audits prevent fiber thinning and breaks.',
  },
  {
    id: 7,
    name: 'WoolCraft Processing Centre',
    category: 'PROCESSING',
    categoryLabel: 'Wool Processing Mill',
    owner: 'Suresh Yadav',
    rating: 4.7, reviews: 88,
    dLat: 0.080,  dLng: -0.060,  // ~10.4 km NW
    price: '₹1,400 / batch',
    services: ['Scouring', 'Carding', 'Spinning to Worsted Yarn', 'Custom Dyeing'],
    verified: true,
    hours: '8:00 AM – 6:00 PM',
    phone: '+91 93333 44455',
    email: 'mill@ruralwool.in',
    experience: '8 years',
    description: 'Full-service processing unit transforming raw greasy fleece into clean carded sliver and high-count yarn.',
  },
];

const CATEGORIES = [
  { id: 'ALL',        label: 'All Services', icon: null },
  { id: 'GRADING',    label: 'Grading & QA', icon: <ShieldCheck size={14}/> },
  { id: 'WAREHOUSE',  label: 'Warehouse',    icon: <Warehouse size={14}/> },
  { id: 'TRANSPORT',  label: 'Transport',    icon: <Truck size={14}/> },
  { id: 'SHEARING',   label: 'Shearing',     icon: <Scissors size={14}/> },
  { id: 'SORTING',    label: 'Sorting',      icon: <ShieldCheck size={14}/> },
  { id: 'PROCESSING', label: 'Processing',   icon: <ShieldCheck size={14}/> },
  { id: 'VETERINARY', label: 'Veterinary',   icon: <ShieldCheck size={14}/> },
];

export default function Services() {
  const { addProcessingRequest } = useGlobalState() || {};
  const [userLocation, setUserLocation] = useState({ lat: DEFAULT_LOCATION.lat, lng: DEFAULT_LOCATION.lng });
  const [locationLabel, setLocationLabel] = useState(DEFAULT_LOCATION.name);
  const [locating, setLocating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [serviceRequests, setServiceRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('wt_service_requests_v2');
      return stored ? JSON.parse(stored) : [
        {
          id: 'SRQ-104',
          provider: BASE_PROVIDERS[0],
          formData: {
            name: 'Rajesh Gowda',
            phone: '+91 98450 12345',
            serviceType: 'Quality Grading & Lab QA',
            batch: 'WT-KA-2026-00124',
            notes: '428 KG Merino Cross inspection requested.'
          },
          status: 'Confirmed',
          dateCreated: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('wt_service_requests_v2', JSON.stringify(serviceRequests));
  }, [serviceRequests]);

  // Build provider list relative to selected location
  const enriched = BASE_PROVIDERS.map(p => {
    const lat = userLocation.lat + p.dLat;
    const lng = userLocation.lng + p.dLng;
    const dist = haversine(userLocation.lat, userLocation.lng, lat, lng);
    return { ...p, lat, lng, distKm: dist, distance: `${dist.toFixed(1)} km` };
  }).sort((a, b) => a.distKm - b.distKm);

  // Filter by category + search
  const filtered = enriched.filter(p => {
    const catMatch = activeCategory === 'ALL' || p.category === activeCategory;
    const searchMatch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.services || []).some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return catMatch && searchMatch;
  });

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser. Using selected region.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setLocationLabel('Current GPS Location');
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationLabel(DEFAULT_LOCATION.name);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleRegionChange = (e) => {
    const found = REGION_PRESETS.find(r => r.id === e.target.value);
    if (found) {
      setUserLocation({ lat: found.lat, lng: found.lng });
      setLocationLabel(found.name);
      mapRef.current?.flyTo(found.lat, found.lng, 13);
    }
  };

  const handleMarkerClick = (provider) => setSelectedProvider(provider);

  const handleProviderCardClick = (provider) => {
    setSelectedProvider(provider);
    mapRef.current?.panToProvider(provider.id);
  };

  const handleRequestSubmit = (formData, provider) => {
    const newReq = {
      id: `SRQ-${Math.floor(100 + Math.random() * 900)}`,
      formData,
      provider,
      status: 'Pending',
      dateCreated: new Date().toISOString()
    };

    setServiceRequests(prev => [newReq, ...prev]);

    if (provider && (provider.category === 'PROCESSING' || provider.category === 'SORTING')) {
      const newProcReq = {
        id: `PR-2026-${String(Date.now()).slice(-5)}`,
        batchId: formData.batch || 'WT-KA-2026-00124',
        farmerId: 'FARMER-01',
        farmerName: formData.name || 'Rajesh Gowda',
        processingUnitId: 'PU-01',
        processingUnitName: provider.name,
        requestedOperations: ['Sorting', 'Washing', 'Spinning'],
        quantity: 428,
        woolType: 'Medium Wool',
        grade: 'Grade A',
        qualityScore: 88,
        origin: locationLabel,
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

  return (
    <div className="services-page">
      {/* ── Location Header ── */}
      <div className="location-header">
        <div className="location-left">
          <span className="text-small text-gray" style={{ fontWeight: '700' }}>Verified Wool Service Network</span>
          <h2 className="location-title">
            <MapPin size={22} color="#166534" />
            <span>{locating ? 'Detecting GPS location…' : locationLabel}</span>
          </h2>
        </div>
        <div className="location-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Region Switcher */}
          <select 
            onChange={handleRegionChange}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(11,18,13,0.15)',
              background: '#FFFFFF',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {REGION_PRESETS.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button className="icon-text-btn" onClick={requestLocation} disabled={locating} title="Auto-detect via GPS">
            <Locate size={16} /> {locating ? 'Locating…' : 'GPS'}
          </button>

          <button className="btn-secondary" onClick={() => setShowMyRequests(true)}>
            <ClipboardList size={16} /> My Bookings
            {serviceRequests.length > 0 && (
              <span className="badge-count">{serviceRequests.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="search-row" style={{ marginBottom: '16px' }}>
        <div className="search-bar" style={{ width: '100%', maxWidth: '100%' }}>
          <Search size={18} color="#999" />
          <input
            type="text"
            placeholder="Search wool testing labs, shearing teams, climate warehouses, transport trucks, sorting hubs..."
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
      <div className="category-tabs" style={{ marginTop: '20px' }}>
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
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>
            Available Service Providers <span className="count-badge">{filtered.length}</span>
          </h3>
          <span style={{ fontSize: '12px', color: '#666' }}>
            Sorted by proximity to {locationLabel}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="panel empty-state">
            <p>No service providers found for this category or search term.</p>
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
                  <div className="provider-sub">{provider.categoryLabel} · {provider.experience} exp</div>
                  <div className="provider-meta">
                    <span className="dist-badge">
                      <Navigation size={12} /> {provider.distance}
                    </span>
                    <span className="rating-pill">
                      <Star size={12} fill="#EAB308" color="#EAB308" /> {provider.rating} ({provider.reviews})
                    </span>
                    <span className="price-pill">{provider.price}</span>
                  </div>
                </div>
                <button
                  className="btn-view"
                  onClick={e => { e.stopPropagation(); handleProviderCardClick(provider); }}
                >
                  View Details & Book
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
