import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

// Initial Seed Data
const INITIAL_BATCHES = [];

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
    minPrice: 380,
    price: 425,
    unit: 'kg',
    status: 'Active',
    createdAt: '2026-08-14T12:00:00Z',
    bids: [
      { id: 'BID-1', buyerId: 'SELLER-01', buyerName: 'Himalayan Wool Co.', amount: 415, status: 'Pending', date: '2026-08-14T14:00:00Z' }
    ]
  }
];

// ── Processing Seed Data ──────────────────────────────────────────────────
const INITIAL_PROCESSING_REQUESTS = [
  {
    id: 'PR-2026-00124',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Kumar',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Sorting', 'Spinning'],
    quantity: 428,
    woolType: 'Medium Wool',
    grade: 'A',
    qualityScore: 87,
    origin: 'Mysuru, Karnataka',
    message: 'Please prioritise sorting first, then spinning to 2/32 count.',
    priority: 'HIGH',
    status: 'ACCEPTED',
    createdAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-14T09:00:00Z'
  },
  {
    id: 'PR-2026-00087',
    batchId: 'WT-RJ-2026-00087',
    farmerId: 'FARMER-02',
    farmerName: 'Mohan Singh',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Washing', 'Carding', 'Dyeing'],
    quantity: 620,
    woolType: 'Fine Wool',
    grade: 'B',
    qualityScore: 76,
    origin: 'Jodhpur, Rajasthan',
    message: 'Natural dye preferred. Earthy tones.',
    priority: 'NORMAL',
    status: 'REQUESTED',
    createdAt: '2026-08-15T06:30:00Z',
    updatedAt: '2026-08-15T06:30:00Z'
  },
  {
    id: 'PR-2026-00061',
    batchId: 'WT-HP-2026-00061',
    farmerId: 'FARMER-03',
    farmerName: 'Priya Devi',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Sorting', 'Washing', 'Carding'],
    quantity: 310,
    woolType: 'Coarse Wool',
    grade: 'C',
    qualityScore: 68,
    origin: 'Kullu, Himachal Pradesh',
    message: 'Coarse batch for carpet-grade output.',
    priority: 'LOW',
    status: 'COMPLETED',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-13T15:30:00Z'
  }
];

const INITIAL_PROCESSING_RECORDS = [
  {
    id: 'REC-2026-00001',
    batchId: 'WT-KA-2026-00124',
    processingRequestId: 'PR-2026-00124',
    processingUnitId: 'PU-01',
    operatorName: 'WoolCraft Processing Centre',
    operation: 'Sorting',
    inputQuantity: 428,
    outputQuantity: 410,
    wasteQuantity: 18,
    outputBatchId: 'WT-KA-2026-00124-P01',
    status: 'COMPLETED',
    startTime: '2026-08-14T09:30:00Z',
    completionTime: '2026-08-14T11:00:00Z',
    equipment: 'Industrial Wool Sorter MT-200',
    notes: 'Standard sorting complete. 18 KG rejected (vegetable matter, felted clumps).',
    operationData: {
      sortedQuantity: 410,
      rejectedQuantity: 18,
      fineWoolQty: 120,
      mediumWoolQty: 290,
      coarseWoolQty: 0
    },
    createdAt: '2026-08-14T09:30:00Z'
  },
  {
    id: 'REC-2026-00002',
    batchId: 'WT-HP-2026-00061',
    processingRequestId: 'PR-2026-00061',
    processingUnitId: 'PU-01',
    operatorName: 'WoolCraft Processing Centre',
    operation: 'Sorting',
    inputQuantity: 310,
    outputQuantity: 298,
    wasteQuantity: 12,
    outputBatchId: 'WT-HP-2026-00061-P01',
    status: 'COMPLETED',
    startTime: '2026-08-10T10:30:00Z',
    completionTime: '2026-08-10T12:00:00Z',
    equipment: 'Industrial Wool Sorter MT-200',
    notes: 'Sorted for carpet-grade processing.',
    operationData: {},
    createdAt: '2026-08-10T10:30:00Z'
  },
  {
    id: 'REC-2026-00003',
    batchId: 'WT-HP-2026-00061',
    processingRequestId: 'PR-2026-00061',
    processingUnitId: 'PU-01',
    operatorName: 'WoolCraft Processing Centre',
    operation: 'Washing',
    inputQuantity: 298,
    outputQuantity: 276,
    wasteQuantity: 22,
    outputBatchId: 'WT-HP-2026-00061-P02',
    status: 'COMPLETED',
    startTime: '2026-08-11T09:00:00Z',
    completionTime: '2026-08-11T14:00:00Z',
    equipment: 'Industrial Scouring Bowl',
    notes: 'Water-based scouring. Grease removed.',
    operationData: { cleaningMethod: 'Aqueous Scouring', moistureAfter: '12%' },
    createdAt: '2026-08-11T09:00:00Z'
  },
  {
    id: 'REC-2026-00004',
    batchId: 'WT-HP-2026-00061',
    processingRequestId: 'PR-2026-00061',
    processingUnitId: 'PU-01',
    operatorName: 'WoolCraft Processing Centre',
    operation: 'Carding',
    inputQuantity: 276,
    outputQuantity: 268,
    wasteQuantity: 8,
    outputBatchId: 'WT-HP-2026-00061-P03',
    status: 'COMPLETED',
    startTime: '2026-08-13T10:00:00Z',
    completionTime: '2026-08-13T15:30:00Z',
    equipment: 'Flatbed Carding Machine FC-55',
    notes: 'Carding complete. Uniform fibre alignment achieved.',
    operationData: {},
    createdAt: '2026-08-13T10:00:00Z'
  }
];
// ──────────────────────────────────────────────────────────────────────────

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

  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('wt_transactions');
    return stored ? JSON.parse(stored) : [
      { id: 'TXN-00120', userId: 'FARMER-01', orderId: 'ORD-2026-00420', batchId: 'WT-KA-2026-00124', type: 'Sale', amount: 42500, status: 'Released', description: 'Order #ORD-2026-00420', createdAt: '2026-08-13T10:00:00Z' },
      { id: 'TXN-00118', userId: 'FARMER-01', type: 'Withdrawal', amount: -25000, status: 'Completed', description: 'Withdrawal to Bank ****4821', createdAt: '2026-08-12T14:30:00Z' }
    ];
  });

  const [withdrawals, setWithdrawals] = useState(() => {
    const stored = localStorage.getItem('wt_withdrawals');
    return stored ? JSON.parse(stored) : [
      { id: 'WD-2026-00110', userId: 'FARMER-01', amount: 25000, paymentMethodId: 'PM-1', status: 'Completed', createdAt: '2026-08-12T14:30:00Z', destination: 'Bank ****4821' }
    ];
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const stored = localStorage.getItem('wt_payment_methods');
    return stored ? JSON.parse(stored) : [
      { id: 'PM-1', userId: 'FARMER-01', type: 'Bank Account', maskedDetails: 'HDFC Bank **** 4821', isPrimary: true }
    ];
  });

  // ── Processing State ────────────────────────────────────────────────────
  const [processingRequests, setProcessingRequests] = useState(() => {
    const stored = localStorage.getItem('wt_processing_requests');
    return stored ? JSON.parse(stored) : INITIAL_PROCESSING_REQUESTS;
  });

  const [processingRecords, setProcessingRecords] = useState(() => {
    const stored = localStorage.getItem('wt_processing_records');
    return stored ? JSON.parse(stored) : INITIAL_PROCESSING_RECORDS;
  });
  // ────────────────────────────────────────────────────────────────────────

  // Sync to local storage
  useEffect(() => localStorage.setItem('wt_batches', JSON.stringify(batches)), [batches]);
  useEffect(() => localStorage.setItem('wt_certificates', JSON.stringify(certificates)), [certificates]);
  useEffect(() => localStorage.setItem('wt_listings', JSON.stringify(listings)), [listings]);
  useEffect(() => localStorage.setItem('wt_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('wt_transport', JSON.stringify(transportJobs)), [transportJobs]);
  useEffect(() => localStorage.setItem('wt_warehouse', JSON.stringify(warehouseBookings)), [warehouseBookings]);
  useEffect(() => localStorage.setItem('wt_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('wt_withdrawals', JSON.stringify(withdrawals)), [withdrawals]);
  useEffect(() => localStorage.setItem('wt_payment_methods', JSON.stringify(paymentMethods)), [paymentMethods]);
  useEffect(() => localStorage.setItem('wt_processing_requests', JSON.stringify(processingRequests)), [processingRequests]);
  useEffect(() => localStorage.setItem('wt_processing_records', JSON.stringify(processingRecords)), [processingRecords]);

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

  const addTransaction = (txn) => setTransactions(prev => [txn, ...prev]);
  const addWithdrawal = (wd) => setWithdrawals(prev => [wd, ...prev]);
  const addPaymentMethod = (pm) => setPaymentMethods(prev => [pm, ...prev]);
  const removePaymentMethod = (id) => setPaymentMethods(prev => prev.filter(pm => pm.id !== id));

  // ── Processing Actions ──────────────────────────────────────────────────
  const addProcessingRequest = (request) => setProcessingRequests(prev => [request, ...prev]);
  const updateProcessingRequest = (id, updates) =>
    setProcessingRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));

  const addProcessingRecord = (record) => setProcessingRecords(prev => [record, ...prev]);
  const updateProcessingRecord = (id, updates) =>
    setProcessingRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  // ────────────────────────────────────────────────────────────────────────

  return (
    <GlobalStateContext.Provider value={{
      batches, addBatch, updateBatch,
      certificates, addCertificate,
      listings, addListing, updateListing, addBid,
      orders, addOrder, updateOrder,
      transportJobs, requestTransport, updateTransport,
      warehouseBookings, bookWarehouse, updateWarehouse,
      transactions, addTransaction,
      withdrawals, addWithdrawal,
      paymentMethods, addPaymentMethod, removePaymentMethod,
      // Processing
      processingRequests, addProcessingRequest, updateProcessingRequest,
      processingRecords, addProcessingRecord, updateProcessingRecord,
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
