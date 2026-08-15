import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Navigation, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom Icon Generator
const createCustomIcon = (type, isSelected = false) => {
  let color = '#16A34A'; // Default Green (My Processing Unit)
  let label = 'PU';
  let size = isSelected ? 44 : 36;

  if (type === 'FACILITY') {
    color = '#16A34A'; // 🟢 My Processing Unit
    label = '🏢';
  } else if (type === 'WAREHOUSE') {
    color = '#2563EB'; // 🔵 Warehouse
    label = '📦';
  } else if (type === 'INCOMING') {
    color = '#EA580C'; // 🟠 Incoming Batch
    label = '📥';
  } else if (type === 'OUTGOING') {
    color = '#9333EA'; // 🟣 Outgoing Batch
    label = '📤';
  } else if (type === 'IN_TRANSIT') {
    color = '#0891B2'; // 🚚 In Transit
    label = '🚚';
  }

  const html = `
    <div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: ${size > 40 ? '20px' : '16px'};
      border: 3px solid #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
      cursor: pointer;
    ">
      ${label}
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const ProcessingMap = ({ facility, requests = [], onSelectBatch }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const polylinesRef = useRef([]);

  const [mapError, setMapError] = useState(false);
  const [layers, setLayers] = useState({
    myFacility: true,
    incoming: true,
    outgoing: true,
    warehouses: true,
    transport: true,
    otherFacilities: false
  });

  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString());

  // Safe request filtering
  const safeRequests = Array.isArray(requests) ? requests : [];
  const incomingBatches = safeRequests.filter(r => 
    r && ['REQUESTED', 'ACCEPTED', 'READY_FOR_PICKUP', 'DISPATCHED', 'IN_TRANSIT'].includes(r.status)
  );

  const outgoingBatches = safeRequests.filter(r => 
    r && ['READY_TO_SHIP', 'DISPATCHED', 'DELIVERED'].includes(r.status)
  );

  const warehousesList = [
    { id: 'WH-01', name: 'Mysuru Warehouse', lat: 12.3050, lng: 76.6500, distance: '48.2 KM' },
    { id: 'WH-02', name: 'Mandya Warehouse', lat: 12.5220, lng: 76.8980, distance: '64.5 KM' },
    { id: 'WH-03', name: 'Hassan Wool Depot', lat: 13.0069, lng: 76.1017, distance: '112.0 KM' }
  ];

  // Initialize Leaflet Map safely (handling React 18/19 StrictMode double-rendering)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      if (mapContainerRef.current._leaflet_id) {
        mapContainerRef.current._leaflet_id = null;
      }

      const center = [facility?.lat || 12.2958, facility?.lng || 76.6394];
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 11,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors | CEDA Spatial Intelligence',
        maxZoom: 18
      }).addTo(map);

      mapRef.current = map;
      setMapError(false);
    } catch (err) {
      console.warn('Leaflet map initialization notice:', err);
      setMapError(true);
    }

    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {}
        mapRef.current = null;
      }
      if (mapContainerRef.current) {
        mapContainerRef.current._leaflet_id = null;
      }
    };
  }, [facility]);

  // Update map markers & routes when layers/requests change
  useEffect(() => {
    if (!mapRef.current) return;

    try {
      // Clear existing markers & polylines
      markersRef.current.forEach(m => {
        try { m.remove(); } catch(e) {}
      });
      markersRef.current = [];

      polylinesRef.current.forEach(p => {
        try { p.remove(); } catch(e) {}
      });
      polylinesRef.current = [];

      const map = mapRef.current;
      const facLat = facility?.lat || 12.2958;
      const facLng = facility?.lng || 76.6394;

      // 1. My Processing Unit Marker
      if (layers.myFacility) {
        const facMarker = L.marker([facLat, facLng], { icon: createCustomIcon('FACILITY', true) })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px;">
              <div style="font-weight: 700; color: #16A34A; font-size: 15px;">🟢 ${facility?.name || 'My Processing Unit'}</div>
              <div style="color: #666; font-size: 12px; margin-top: 2px;">${facility?.address || 'Mysuru, Karnataka'}</div>
              <hr style="margin: 8px 0; border: 0; border-top: 1px solid #eee;" />
              <div style="font-size: 12px;"><strong>Capacity:</strong> ${(facility?.totalCapacityKg || 5000).toLocaleString()} KG</div>
              <div style="font-size: 12px;"><strong>Status:</strong> <span style="color: #16A34A; font-weight: 600;">ACCEPTING BATCHES</span></div>
            </div>
          `);
        markersRef.current.push(facMarker);
      }

      // 2. Warehouses
      if (layers.warehouses) {
        warehousesList.forEach(wh => {
          const whMarker = L.marker([wh.lat, wh.lng], { icon: createCustomIcon('WAREHOUSE') })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; min-width: 180px;">
                <strong style="color: #2563EB;">📦 ${wh.name}</strong><br/>
                <span style="font-size: 12px; color: #666;">Origin Warehouse</span><br/>
                <span style="font-size: 12px;">Distance to PU: <strong>${wh.distance}</strong></span>
              </div>
            `);
          markersRef.current.push(whMarker);
        });
      }

      // 3. Incoming Batches & Transit Routes
      if (layers.incoming) {
        incomingBatches.forEach(req => {
          if (!req) return;
          const bLat = req.lat || 12.305;
          const bLng = req.lng || 76.650;

          const isTransit = req.status === 'IN_TRANSIT';
          const marker = L.marker([bLat, bLng], { icon: createCustomIcon(isTransit ? 'IN_TRANSIT' : 'INCOMING') })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; min-width: 220px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="font-size: 14px;">${req.batchId}</strong>
                  <span style="background: #FFEDD5; color: #C2410C; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                    ${req.status}
                  </span>
                </div>
                <div style="font-size: 12px; color: #4B5563;"><strong>Qty:</strong> ${req.quantity} KG (${req.woolType || 'Wool'})</div>
                <div style="font-size: 12px; color: #4B5563;"><strong>Origin:</strong> ${req.origin || 'Warehouse'}</div>
                ${req.eta ? `<div style="font-size: 12px; color: #2563EB; margin-top: 4px;">⏱ <strong>ETA:</strong> ${req.eta}</div>` : ''}
                <div style="margin-top: 6px; font-size: 10px; color: #9CA3AF;">
                  ${req.liveGps ? '🟢 LIVE GPS LOCATION' : '📍 LAST KNOWN LOCATION'}
                </div>
                <button id="btn-map-view-${req.batchId}" style="margin-top: 8px; width: 100%; background: #16A34A; color: white; border: none; padding: 6px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                  View Batch Details
                </button>
              </div>
            `);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-map-view-${req.batchId}`);
            if (btn && onSelectBatch) btn.onclick = () => onSelectBatch(req.batchId);
          });

          markersRef.current.push(marker);

          // Draw transit route line to facility
          if (layers.transport) {
            const polyline = L.polyline([[bLat, bLng], [facLat, facLng]], {
              color: '#EA580C',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.8
            }).addTo(map);
            polylinesRef.current.push(polyline);
          }
        });
      }

      // 4. Outgoing Batches & Destinations
      if (layers.outgoing) {
        outgoingBatches.forEach(req => {
          if (!req) return;
          const destLat = req.destinationLat || req.lat || 12.9716;
          const destLng = req.destinationLng || req.lng || 77.5946;

          const marker = L.marker([destLat, destLng], { icon: createCustomIcon('OUTGOING') })
            .addTo(map)
            .bindPopup(`
              <div style="font-family: sans-serif; min-width: 220px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <strong style="font-size: 14px;">${req.batchId}</strong>
                  <span style="background: #F3E8FF; color: #7E22CE; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                    ${req.status}
                  </span>
                </div>
                <div style="font-size: 12px; color: #4B5563;"><strong>Qty:</strong> ${req.quantity} KG</div>
                <div style="font-size: 12px; color: #4B5563;"><strong>Destination:</strong> ${req.destination || 'Textile Mill'}</div>
                <button id="btn-map-view-out-${req.batchId}" style="margin-top: 8px; width: 100%; background: #9333EA; color: white; border: none; padding: 6px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                  View Shipment Details
                </button>
              </div>
            `);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-map-view-out-${req.batchId}`);
            if (btn && onSelectBatch) btn.onclick = () => onSelectBatch(req.batchId);
          });

          markersRef.current.push(marker);

          if (layers.transport) {
            const polyline = L.polyline([[facLat, facLng], [destLat, destLng]], {
              color: '#9333EA',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.8
            }).addTo(map);
            polylinesRef.current.push(polyline);
          }
        });
      }
    } catch (e) {
      console.warn('Error updating Leaflet markers:', e);
    }
  }, [layers, requests, facility]);

  const handleRefresh = () => {
    setLastRefreshed(new Date().toLocaleTimeString());
    if (mapRef.current) {
      try { mapRef.current.invalidateSize(); } catch(e) {}
    }
  };

  const toggleLayer = (layerKey) => {
    setLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  if (mapError) {
    return (
      <div className="processing-map-fallback panel">
        <div className="map-fallback-header">
          <div className="fallback-title">
            <AlertTriangle className="text-amber" size={20} />
            <span>Map View Unavailable (CEDA Fallback Active)</span>
          </div>
          <button className="btn-secondary btn-sm" onClick={() => setMapError(false)}>
            <RefreshCw size={14} /> Retry Map
          </button>
        </div>
        <p className="fallback-subtitle">
          Operational batch data is fully active. Below is the textual location overview for your processing unit.
        </p>
        <div className="fallback-batch-grid">
          {incomingBatches.map(b => (
            <div key={b?.batchId || Math.random()} className="fallback-card">
              <div className="fallback-card-top">
                <strong>{b?.batchId}</strong>
                <span className="badge-orange">{b?.status}</span>
              </div>
              <div className="fallback-card-body">
                <div>Origin: <strong>{b?.origin}</strong></div>
                <div>Destination: <strong>{facility?.name || 'My Processing Unit'}</strong></div>
                <div>Weight: <strong>{b?.quantity} KG</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="processing-map-wrapper panel">
      {/* Map Control Toolbar */}
      <div className="map-toolbar">
        <div className="map-toolbar-left">
          <span className="map-title-badge">
            <Navigation size={14} /> CEDA Live Operations Map
          </span>
          <span className="map-center-info">
            Centered on: <strong>{facility?.name || 'My Processing Unit'}</strong> ({facility?.address || 'Mysuru, Karnataka'})
          </span>
        </div>
        <div className="map-toolbar-right">
          <span className="map-ceda-status">
            <Shield size={12} /> CEDA API Proxy: <strong style={{ color: '#16A34A' }}>Active</strong>
          </span>
          <span className="map-last-updated">Refreshed: {lastRefreshed}</span>
          <button className="map-refresh-btn" onClick={handleRefresh} title="Refresh Map">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Main Leaflet Container */}
      <div className="map-container-inner" ref={mapContainerRef} style={{ height: '420px', width: '100%', borderRadius: '12px' }} />

      {/* Map Layer Toggles & Legend Bar */}
      <div className="map-legend-layer-bar">
        <div className="map-layer-toggles">
          <span className="layer-label"><Layers size={14} /> Layers:</span>
          <label className="toggle-item">
            <input type="checkbox" checked={layers.myFacility} onChange={() => toggleLayer('myFacility')} />
            <span className="dot dot-green"></span> My Processing Unit
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={layers.incoming} onChange={() => toggleLayer('incoming')} />
            <span className="dot dot-orange"></span> Incoming Batches
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={layers.outgoing} onChange={() => toggleLayer('outgoing')} />
            <span className="dot dot-purple"></span> Outgoing Batches
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={layers.warehouses} onChange={() => toggleLayer('warehouses')} />
            <span className="dot dot-blue"></span> Warehouses
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={layers.transport} onChange={() => toggleLayer('transport')} />
            <span className="dot dot-cyan"></span> Transit Routes
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProcessingMap;