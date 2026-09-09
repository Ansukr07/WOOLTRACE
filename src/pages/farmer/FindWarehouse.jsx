import React, { useMemo, useState } from 'react';
import { 
  Warehouse, MapPin, Star, ShieldCheck, ArrowRight, X, 
  Check, Phone, Mail, Clock, Sparkles, Navigation, Send, AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGlobalState } from '../../context/GlobalStateContext';
import './FindWarehouse.css';

// Fix Leaflet Default Marker Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Warehouse Marker
const warehouseIcon = new L.DivIcon({
  className: 'custom-wh-marker',
  html: `<div style="background-color: #0B120D; color: #DDFF86; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid #DDFF86; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">🏭</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17]
});

const distanceInKm = (from, to) => {
  const toRad = value => value * Math.PI / 180;
  const latDelta = toRad(to.lat - from.lat);
  const lngDelta = toRad(to.lng - from.lng);
  const a = Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(lngDelta / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const MapRecenter = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.flyTo([center.lat, center.lng], 9, { duration: 0.8 });
  }, [center, map]);
  return null;
};

export default function FindWarehouse() {
  const { warehouses, batches, requestStorage } = useGlobalState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState(warehouses[0]);
  const [detailModalWarehouse, setDetailModalWarehouse] = useState(null);
  const [requestModalWarehouse, setRequestModalWarehouse] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [requestSuccessMessage, setRequestSuccessMessage] = useState('');
  const [searchedLocation, setSearchedLocation] = useState(null);
  const [locationSearchStatus, setLocationSearchStatus] = useState('');
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Request Form States
  const [selectedBatchId, setSelectedBatchId] = useState(batches[0]?.id || 'BATCH-001');
  const [quantity, setQuantity] = useState(batches[0]?.quantity || 428);
  const [durationMonths, setDurationMonths] = useState(3);
  const [startDate, setStartDate] = useState('2026-08-16');
  const [storageType, setStorageType] = useState('Climate-Controlled');
  const [additionalMessage, setAdditionalMessage] = useState('');

  // Filter warehouses
  const filteredWarehouses = useMemo(() => warehouses.filter(wh => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = searchedLocation || !normalizedQuery ||
                          wh.name.toLowerCase().includes(normalizedQuery) ||
                          wh.location.toLowerCase().includes(normalizedQuery) ||
                          wh.city.toLowerCase().includes(normalizedQuery);
    if (!matchesSearch) return false;
    if (activeFilter === 'AVAILABLE') return wh.availableCapacity > 5000;
    if (activeFilter === 'CLIMATE') return wh.storageServices.some(s => s.toLowerCase().includes('climate'));
    return true;
  }).map(wh => ({
    ...wh,
    searchedDistance: searchedLocation ? distanceInKm(searchedLocation, { lat: Number(wh.lat), lng: Number(wh.lng) }) : null
  })).sort((a, b) => searchedLocation ? a.searchedDistance - b.searchedDistance : 0), [warehouses, searchQuery, searchedLocation, activeFilter]);

  const handleLocationSearch = async (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchedLocation(null);
      setLocationSearchStatus('');
      return;
    }

    setIsSearchingLocation(true);
    setLocationSearchStatus('Finding location…');
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&limit=1&q=${encodeURIComponent(query)}`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (!response.ok) throw new Error('Location service unavailable');
      const results = await response.json();
      if (!results.length) {
        setSearchedLocation(null);
        setLocationSearchStatus('Location not found. Try a city, district or PIN code.');
        return;
      }
      const match = { lat: Number(results[0].lat), lng: Number(results[0].lon), label: results[0].display_name };
      setSearchedLocation(match);
      setLocationSearchStatus(`Showing nearest storage to ${results[0].display_name.split(',').slice(0, 2).join(',')}`);
    } catch (_error) {
      setLocationSearchStatus('Could not search that location. Check your connection and try again.');
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleBatchSelectChange = (e) => {
    const bId = e.target.value;
    setSelectedBatchId(bId);
    const b = batches.find(item => item.id === bId || item.batchId === bId);
    if (b) setQuantity(b.quantity);
  };

  const handleSendStorageRequest = (e) => {
    e.preventDefault();
    if (!requestModalWarehouse) return;

    const matchedBatch = batches.find(b => b.id === selectedBatchId || b.batchId === selectedBatchId);
    const cost = Math.round(Number(quantity) * (requestModalWarehouse.storagePrice || 4.5) * Number(durationMonths));

    requestStorage({
      batchId: selectedBatchId,
      farmerId: 'FARMER-01',
      farmerName: 'Rajesh Gowda',
      warehouseId: requestModalWarehouse.id,
      warehouseName: requestModalWarehouse.name,
      quantity: Number(quantity),
      woolType: matchedBatch?.woolType || matchedBatch?.cropName || 'Harvest produce',
      grade: matchedBatch?.qualityGrade || 'A',
      storageDuration: `${durationMonths} Months`,
      durationMonths: Number(durationMonths),
      startDate,
      storageType,
      estimatedCost: cost,
      additionalMessage
    });

    setRequestSuccessMessage(`Storage request sent to ${requestModalWarehouse.name} for Batch #${selectedBatchId}!`);
    setRequestModalWarehouse(null);
    setTimeout(() => setRequestSuccessMessage(''), 6000);
  };

  const estimatedTotalCost = requestModalWarehouse
    ? Math.round(Number(quantity) * (requestModalWarehouse.storagePrice || 4.5) * Number(durationMonths))
    : 0;

  return (
    <div className="find-warehouse-page">
      {/* Header */}
      <div className="find-warehouse-header">
        <div>
          <h1 className="find-warehouse-title">
            <Warehouse size={28} color="#0B120D" /> Find produce storage
          </h1>
          <p className="find-warehouse-subtitle">
            Compare capacity, handling conditions and storage cost before you decide when to sell.
          </p>
        </div>
      </div>

      {/* Success Banner */}
      {requestSuccessMessage && (
        <div style={{
          background: '#DCFCE7',
          border: '1px solid #16A34A',
          color: '#166534',
          padding: '14px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: '700',
          fontSize: '14px'
        }}>
          <ShieldCheck size={20} />
          {requestSuccessMessage}
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="wh-toolbar">
        <form className="wh-search-bar" onSubmit={handleLocationSearch}>
          <MapPin className="wh-search-icon" size={17} />
          <input
            type="text"
            placeholder="Search by warehouse name, city or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchedLocation(null);
              setLocationSearchStatus('');
            }}
          />
          <button type="submit" className="wh-location-search-btn" disabled={isSearchingLocation}>
            <Navigation size={15} /> {isSearchingLocation ? 'Finding…' : 'Search area'}
          </button>
        </form>
        <div className="wh-filter-tabs">
          <button
            className={`wh-filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All Warehouses
          </button>
          <button
            className={`wh-filter-tab ${activeFilter === 'AVAILABLE' ? 'active' : ''}`}
            onClick={() => setActiveFilter('AVAILABLE')}
          >
            High Capacity (&gt;5000 KG)
          </button>
          <button
            className={`wh-filter-tab ${activeFilter === 'CLIMATE' ? 'active' : ''}`}
            onClick={() => setActiveFilter('CLIMATE')}
          >
            Climate Controlled
          </button>
        </div>
      </div>

      {locationSearchStatus && <div className={`wh-search-status ${searchedLocation ? 'success' : ''}`}>{locationSearchStatus}</div>}

      {/* Main Grid: Warehouse Cards + Leaflet Map */}
      <div className="wh-layout-grid">
        {/* Left: Warehouse Cards List */}
        <div className="wh-cards-list">
          {filteredWarehouses.map((wh) => (
            <div
              key={wh.id}
              className={`wh-card ${selectedWarehouse?.id === wh.id ? 'selected' : ''}`}
              onClick={() => setSelectedWarehouse(wh)}
            >
              <div className="wh-card-top">
                <div>
                  <h3 className="wh-name">{wh.name}</h3>
                  <div className="wh-location">
                    <MapPin size={14} /> {wh.location} ({wh.searchedDistance != null ? `${wh.searchedDistance.toFixed(1)} km away` : wh.distance})
                  </div>
                </div>
                {wh.verified && (
                  <span className="verified-pill">✓ Verified</span>
                )}
              </div>

              {/* Metrics */}
              <div className="wh-metrics-row">
                <div className="wh-metric-item">
                  <span className="wh-metric-label">Available Space</span>
                  <span className="wh-metric-val">{wh.availableCapacity.toLocaleString()} KG</span>
                </div>
                <div className="wh-metric-item">
                  <span className="wh-metric-label">Storage Price</span>
                  <span className="wh-metric-val">{wh.priceUnit}</span>
                </div>
                <div className="wh-metric-item">
                  <span className="wh-metric-label">Rating</span>
                  <span className="wh-metric-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} fill="#0B120D" color="#0B120D" /> {wh.rating}
                  </span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="wh-card-actions">
                <button
                  className="btn-wh-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailModalWarehouse(wh);
                  }}
                >
                  View Details
                </button>
                <button
                  className="btn-wh-request"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRequestModalWarehouse(wh);
                  }}
                >
                  Request Storage <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Leaflet Map */}
        <div className="wh-map-container">
          <MapContainer
            center={[selectedWarehouse?.lat || 12.3556, selectedWarehouse?.lng || 76.6120]}
            zoom={8}
            scrollWheelZoom={false}
            style={{ width: '100%', height: '100%' }}
          >
            <MapRecenter center={searchedLocation || (selectedWarehouse ? { lat: Number(selectedWarehouse.lat), lng: Number(selectedWarehouse.lng) } : null)} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredWarehouses.map((wh) => (
              <Marker
                key={wh.id}
                position={[wh.lat, wh.lng]}
                icon={warehouseIcon}
                eventHandlers={{
                  click: () => setSelectedWarehouse(wh)
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', padding: '4px' }}>
                    <strong style={{ fontSize: '14px', color: '#0B120D' }}>{wh.name}</strong>
                    <div style={{ fontSize: '12px', color: '#666', margin: '4px 0' }}>{wh.location}</div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#166534' }}>
                      Available: {wh.availableCapacity.toLocaleString()} KG
                    </div>
                    <button
                      onClick={() => setRequestModalWarehouse(wh)}
                      style={{
                        marginTop: '8px',
                        background: '#0B120D',
                        color: '#DDFF86',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%'
                      }}
                    >
                      Request Storage
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
            {searchedLocation && (
              <Marker position={[searchedLocation.lat, searchedLocation.lng]}>
                <Popup>Your searched location</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* ── 3. Warehouse Details Modal ── */}
      {detailModalWarehouse && (
        <div className="modal-overlay" onClick={() => setDetailModalWarehouse(null)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '16px' }}>
              <div>
                <span className="verified-pill">✓ Storage credentials checked</span>
                <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '8px 0 4px 0', color: '#0B120D' }}>
                  {detailModalWarehouse.name}
                </h2>
                <div style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} /> {detailModalWarehouse.location}
                </div>
              </div>
              <button onClick={() => setDetailModalWarehouse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <p style={{ fontSize: '14px', color: '#444', lineHeight: '1.6', marginBottom: '20px' }}>
              {detailModalWarehouse.description}
            </p>

            {/* Capacity & Pricing Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#F8F8F3', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Total Capacity</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D' }}>{detailModalWarehouse.totalCapacity.toLocaleString()} KG</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Available Space</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#166534' }}>{detailModalWarehouse.availableCapacity.toLocaleString()} KG</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', fontWeight: '700' }}>Storage Pricing</span>
                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0B120D' }}>{detailModalWarehouse.priceUnit}</div>
              </div>
            </div>

            {/* Storage Services */}
            <h4 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', color: '#0B120D', marginBottom: '10px' }}>
              Storage Facilities & Services
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {detailModalWarehouse.storageServices.map((service, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#333' }}>
                  <Check size={16} color="#166534" /> {service}
                </div>
              ))}
            </div>

            {/* Contact & Hours */}
            <div style={{ background: '#EDEDCE', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '13px' }}>
              <div style={{ fontWeight: '700', color: '#0B120D', marginBottom: '6px' }}>Depot Contact & Operations:</div>
              <div><strong>Officer:</strong> {detailModalWarehouse.contactPerson}</div>
              <div><strong>Phone:</strong> {detailModalWarehouse.phone}</div>
              <div><strong>Email:</strong> {detailModalWarehouse.email}</div>
              <div><strong>Hours:</strong> {detailModalWarehouse.operatingHours}</div>
            </div>

            {/* CTA */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-wh-request"
                style={{ padding: '12px' }}
                onClick={() => {
                  const wh = detailModalWarehouse;
                  setDetailModalWarehouse(null);
                  setRequestModalWarehouse(wh);
                }}
              >
                Request storage <ArrowRight size={16} />
              </button>
              <button
                className="btn-wh-details"
                style={{ flex: '0 0 auto', padding: '12px 24px' }}
                onClick={() => setDetailModalWarehouse(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Storage request dialog */}
      {requestModalWarehouse && (
        <div className="modal-overlay" onClick={() => setRequestModalWarehouse(null)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #EEE', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0B120D' }}>
                  Request produce storage
                </h2>
                <span style={{ fontSize: '13px', color: '#666' }}>
                  Facility: <strong>{requestModalWarehouse.name}</strong>
                </span>
              </div>
              <button onClick={() => setRequestModalWarehouse(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSendStorageRequest}>
              {/* Choose Batch */}
              <div className="form-group-custom">
                <label>Choose Batch</label>
                <select value={selectedBatchId} onChange={handleBatchSelectChange} required>
                  {batches.map(b => (
                    <option key={b.id || b.batchId} value={b.id || b.batchId}>
                      {b.id || b.batchId} - {b.quantity} KG ({b.cropName || b.woolType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity & Storage Duration */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group-custom">
                  <label>Quantity (KG)</label>
                  <input
                    type="number"
                    min="10"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-custom">
                  <label>Storage Duration</label>
                  <select value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))}>
                    <option value={1}>1 Month</option>
                    <option value={2}>2 Months</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>12 Months</option>
                  </select>
                </div>
              </div>

              {/* Start Date & Storage Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group-custom">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group-custom">
                  <label>Storage Type</label>
                  <select value={storageType} onChange={(e) => setStorageType(e.target.value)}>
                    <option value="Climate-Controlled">Climate-Controlled (Recommended)</option>
                    <option value="Standard Dry Storage">Standard Dry Storage</option>
                    <option value="High-Density Baled">High-Density Baled</option>
                  </select>
                </div>
              </div>

              {/* Additional Message */}
              <div className="form-group-custom">
                <label>Additional Message / Instructions</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Needs immediate humidity inspection, pre-packaged in jute bales..."
                  value={additionalMessage}
                  onChange={(e) => setAdditionalMessage(e.target.value)}
                />
              </div>

              {/* Estimated Storage Cost Calculation */}
              <div className="cost-estimate-card">
                <div>
                  <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '700', color: '#555' }}>
                    Estimated Storage Cost ({durationMonths} Months)
                  </span>
                  <div style={{ fontSize: '13px', color: '#555' }}>
                    {quantity} KG × ₹{requestModalWarehouse.storagePrice}/KG/mo × {durationMonths} mo
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#0B120D' }}>
                  ₹{estimatedTotalCost.toLocaleString()}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-wh-request" style={{ padding: '12px' }}>
                  <Send size={16} /> Send Request
                </button>
                <button
                  type="button"
                  className="btn-wh-details"
                  style={{ flex: '0 0 auto', padding: '12px 24px' }}
                  onClick={() => setRequestModalWarehouse(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
