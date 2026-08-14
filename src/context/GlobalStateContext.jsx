import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

// Initial Seed Data
const INITIAL_BATCHES = [
  {
    id: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Demo Farmer',
    quantity: 428,
    type: 'Merino Cross',
    location: 'Mysuru, Karnataka',
    createdAt: '2026-08-14T10:00:00Z',
    status: 'Listed',
    history: [
      { step: 'FARM', status: 'completed', date: '2026-08-14T10:00:00Z' },
      { step: 'QUALITY', status: 'completed', date: '2026-08-14T11:00:00Z' },
      { step: 'CERTIFICATE', status: 'completed', date: '2026-08-14T11:30:00Z' },
      { step: 'LISTED', status: 'completed', date: '2026-08-14T12:00:00Z' }
    ]
  }
];

const INITIAL_CERTIFICATES = [
  {
    id: 'WTC-QA-2026-00124',
    batchId: 'WT-KA-2026-00124',
    inspectorId: 'QA-01',
    inspectorName: 'QA Officer Ramesh',
    grade: 'A',
    qualityScore: 87,
    micron: '21.5 µm',
    yield: '72%',
    issuedAt: '2026-08-14T11:30:00Z',
    status: 'Approved'
  }
];

const INITIAL_LISTINGS = [
  {
    id: 'LST-001',
    batchId: 'WT-KA-2026-00124',
    sellerId: 'FARMER-01',
    sellerName: 'Demo Farmer',
    type: 'RAW_WOOL',
    title: 'Premium Merino Cross Wool',
    description: 'High quality fleece, freshly shorn.',
    quantity: 428,
    minPrice: 380, // Reverse bidding minimum
    price: 425, // Direct buy price
    unit: 'kg',
    status: 'Active',
    createdAt: '2026-08-14T12:00:00Z',
    bids: [
      { id: 'BID-1', buyerId: 'SELLER-01', buyerName: 'Himalayan Wool Co.', amount: 415, status: 'Pending', date: '2026-08-14T14:00:00Z' }
    ]
  }
];

export const GlobalStateProvider = ({ children }) => {
  const [batches, setBatches] = useState(() => {
    const stored = localStorage.getItem('wt_batches');
    return stored ? JSON.parse(stored) : INITIAL_BATCHES;
  });

  const [certificates, setCertificates] = useState(() => {
    const stored = localStorage.getItem('wt_certificates');
    return stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;
  });

  const [listings, setListings] = useState(() => {
    const stored = localStorage.getItem('wt_listings');
    return stored ? JSON.parse(stored) : INITIAL_LISTINGS;
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('wt_orders');
    return stored ? JSON.parse(stored) : [];
  });

  const [transportJobs, setTransportJobs] = useState(() => {
    const stored = localStorage.getItem('wt_transport');
    return stored ? JSON.parse(stored) : [];
  });

  const [warehouseBookings, setWarehouseBookings] = useState(() => {
    const stored = localStorage.getItem('wt_warehouse');
    return stored ? JSON.parse(stored) : [];
  });

  // Sync to local storage
  useEffect(() => localStorage.setItem('wt_batches', JSON.stringify(batches)), [batches]);
  useEffect(() => localStorage.setItem('wt_certificates', JSON.stringify(certificates)), [certificates]);
  useEffect(() => localStorage.setItem('wt_listings', JSON.stringify(listings)), [listings]);
  useEffect(() => localStorage.setItem('wt_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('wt_transport', JSON.stringify(transportJobs)), [transportJobs]);
  useEffect(() => localStorage.setItem('wt_warehouse', JSON.stringify(warehouseBookings)), [warehouseBookings]);

  // Unified actions
  const addBatch = (batch) => setBatches(prev => [batch, ...prev]);
  const updateBatch = (id, updates) => setBatches(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  
  const addCertificate = (cert) => setCertificates(prev => [cert, ...prev]);
  
  const addListing = (listing) => setListings(prev => [listing, ...prev]);
  const updateListing = (id, updates) => setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  
  const addBid = (listingId, bid) => {
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        return { ...l, bids: [...(l.bids || []), bid] };
      }
      return l;
    }));
  };

  const addOrder = (order) => setOrders(prev => [order, ...prev]);
  const updateOrder = (id, updates) => setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));

  const requestTransport = (job) => setTransportJobs(prev => [job, ...prev]);
  const updateTransport = (id, updates) => setTransportJobs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

  const bookWarehouse = (booking) => setWarehouseBookings(prev => [booking, ...prev]);
  const updateWarehouse = (id, updates) => setWarehouseBookings(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));

  return (
    <GlobalStateContext.Provider value={{
      batches, addBatch, updateBatch,
      certificates, addCertificate,
      listings, addListing, updateListing, addBid,
      orders, addOrder, updateOrder,
      transportJobs, requestTransport, updateTransport,
      warehouseBookings, bookWarehouse, updateWarehouse
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
