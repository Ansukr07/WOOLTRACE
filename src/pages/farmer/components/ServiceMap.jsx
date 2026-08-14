import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Category color map
const CATEGORY_COLORS = {
  SORTING:    '#0B120D',
  GRADING:    '#2563EB',
  SHEARING:   '#9333EA',
  VETERINARY: '#16A34A',
  WAREHOUSE:  '#D97706',
  TRANSPORT:  '#0891B2',
  PROCESSING: '#DC2626',
};

const makeIcon = (category, isSelected) => {
  const color = CATEGORY_COLORS[category] || '#0B120D';
  const size = isSelected ? 42 : 34;
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" width="${size}" height="${size}">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20S24 21 24 12C24 5.4 18.6 0 12 0z"
        fill="${isSelected ? '#DDFF86' : '#ffffff'}"
        stroke="${color}"
        stroke-width="2"/>
      <circle cx="12" cy="12" r="5" fill="${color}"/>
    </svg>
  `);
  return L.divIcon({
    html: `<img src="data:image/svg+xml,${svg}" width="${size}" height="${size}" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))"/>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const farmerIcon = L.divIcon({
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#DDFF86;border:3px solid #0B120D;
    box-shadow:0 0 0 6px rgba(221,255,134,0.3);
  "></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const RealServiceMap = forwardRef(({ providers, userLocation, onMarkerClick, selectedProviderId }, ref) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);

  // Expose flyTo from parent
  useImperativeHandle(ref, () => ({
    flyTo: (lat, lng, zoom = 14) => {
      mapRef.current?.flyTo([lat, lng], zoom, { duration: 1.2 });
    },
    panToProvider: (providerId) => {
      const provider = providers.find(p => p.id === providerId);
      if (provider && mapRef.current) {
        mapRef.current.flyTo([provider.lat, provider.lng], 14, { duration: 1.0 });
      }
    }
  }));

  // Initialize map once
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const center = userLocation
      ? [userLocation.lat, userLocation.lng]
      : [12.2958, 76.6394]; // Mysuru default

    const map = L.map(mapContainerRef.current, {
      center,
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    } else {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: farmerIcon, zIndexOffset: 1000 })
        .addTo(mapRef.current)
        .bindPopup('<strong>You are here</strong>');
    }
    mapRef.current.setView([userLocation.lat, userLocation.lng], 13, { animate: true });
  }, [userLocation]);

  // Update provider markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    providers.forEach(provider => {
      if (!provider.lat || !provider.lng) return;
      const isSelected = selectedProviderId === provider.id;
      const icon = makeIcon(provider.category, isSelected);

      const marker = L.marker([provider.lat, provider.lng], { icon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:160px;">
            <strong style="font-size:14px;">${provider.name}</strong><br/>
            <span style="color:#666;font-size:12px;">${provider.categoryLabel}</span><br/>
            <span style="color:#16A34A;font-weight:700;font-size:13px;">${provider.distance}</span>
            &nbsp; ⭐ ${provider.rating}<br/>
            <span style="font-weight:700;">${provider.price}</span>
          </div>
        `);

      marker.on('click', () => {
        onMarkerClick(provider);
      });

      markersRef.current[provider.id] = marker;
    });
  }, [providers, selectedProviderId, onMarkerClick]);

  // Animate selected marker
  useEffect(() => {
    if (!mapRef.current || !selectedProviderId) return;
    const provider = providers.find(p => p.id === selectedProviderId);
    if (provider?.lat && provider?.lng) {
      mapRef.current.flyTo([provider.lat, provider.lng], 14, { duration: 0.8 });
    }
  }, [selectedProviderId, providers]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '350px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E5E5', zIndex: 0 }}
    />
  );
});

RealServiceMap.displayName = 'RealServiceMap';
export default RealServiceMap;
