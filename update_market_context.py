import re

with open('/home/jayy/sih/src/context/GlobalStateContext.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Check if market items are already added
if 'INITIAL_WOOL_LOTS' in code:
    print('Already updated')
    exit(0)

market_seed_data = '''
// ── Market Linkages & Price Discovery Seed Data (SIH 2026 PS 26132) ────────
const INITIAL_WOOL_LOTS = [
  {
    id: 'LOT-2026-00124',
    lotNumber: 'LOT-KA-2026-00124',
    batchIds: ['WT-KA-2026-00124'],
    sellerId: 'FARMER-01',
    sellerName: 'Rajesh Gowda',
    sellerType: 'FARMER',
    woolType: 'Merino Cross Fleece',
    qualityGrade: 'A',
    qualityScore: 88,
    fiberDiameter: 21.5,
    origin: 'Mandya, Karnataka',
    currentLocation: 'Mysuru Wool Storage Centre (Zone A)',
    totalQuantity: 428,
    availableQuantity: 428,
    askingPrice: 450,
    minAcceptablePrice: 430,
    storageLocation: 'Mysuru Wool Storage Centre',
    certificateId: 'WTC-QA-2026-00124',
    traceabilityUrl: '/track/WT-KA-2026-00124',
    status: 'AVAILABLE', // AVAILABLE, OFFER_RECEIVED, NEGOTIATING, SOLD, PARTIALLY_SOLD
    availableFrom: '2026-08-15',
    verified: true,
    inspectionStatus: 'Certified Grade A',
    description: 'Fresh autumn clip Merino cross fleece. Moisture certified 12%, low vegetable matter (<1.2%). Fully traceable.',
    createdAt: '2026-08-15T12:00:00Z'
  },
  {
    id: 'LOT-2026-00089',
    lotNumber: 'LOT-RJ-2026-00089',
    batchIds: ['WT-RJ-2026-00089'],
    sellerId: 'FARMER-02',
    sellerName: 'Baldev Singh',
    sellerType: 'FARMER',
    woolType: 'Chokla Fine Carpet Wool',
    qualityGrade: 'A',
    qualityScore: 91,
    fiberDiameter: 28.5,
    origin: 'Bikaner, Rajasthan',
    currentLocation: 'Bikaner Wool Hub & Cold Storage',
    totalQuantity: 650,
    availableQuantity: 650,
    askingPrice: 395,
    minAcceptablePrice: 380,
    storageLocation: 'Bikaner Wool Hub',
    certificateId: 'WTC-QA-2026-00089',
    traceabilityUrl: '/track/WT-RJ-2026-00089',
    status: 'OFFER_RECEIVED',
    availableFrom: '2026-08-05',
    verified: true,
    inspectionStatus: 'Certified Grade A',
    description: 'High tensile strength Chokla carpet wool with certified clean fleece yield 76%.',
    createdAt: '2026-08-05T14:00:00Z'
  },
  {
    id: 'LOT-2026-FPO-01',
    lotNumber: 'LOT-FPO-KA-001',
    batchIds: ['WT-KA-2026-00124', 'WT-KA-2026-00130', 'WT-TS-2026-00077'],
    sellerId: 'FPO-KA-01',
    sellerName: 'Karnataka Southern Wool Growers FPO Apex',
    sellerType: 'FPO',
    isFpoAggregate: true,
    contributingFarmers: [
      { farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', quantity: 428, woolType: 'Merino Cross', grade: 'A' },
      { farmerId: 'FARMER-01', farmerName: 'Rajesh Gowda', quantity: 320, woolType: 'Medium Crossbred', grade: 'B' },
      { farmerId: 'FARMER-06', farmerName: 'Mallesh Kuruma', quantity: 392, woolType: 'Deccani Fleece', grade: 'B' }
    ],
    woolType: 'Consolidated South India Fleece (Grade A/B)',
    qualityGrade: 'A/B Mix',
    qualityScore: 82,
    fiberDiameter: 23.4,
    origin: 'Mandya & Mahabubnagar Hubs',
    currentLocation: 'Mysuru Central Logistics Depot',
    totalQuantity: 1140,
    availableQuantity: 1140,
    askingPrice: 425,
    minAcceptablePrice: 405,
    storageLocation: 'Mysuru Wool Storage Centre',
    certificateId: 'WTC-QA-FPO-2026-01',
    traceabilityUrl: '/track/WT-KA-2026-00124',
    status: 'NEGOTIATING',
    availableFrom: '2026-08-16',
    verified: true,
    inspectionStatus: 'FPO Quality Aggregated & Verified',
    description: 'Consolidated commercial bulk lot aggregated by FPO for industrial worsted yarn & spinning mills.',
    createdAt: '2026-08-16T09:00:00Z'
  },
  {
    id: 'LOT-2026-00045',
    lotNumber: 'LOT-HP-2026-00045',
    batchIds: ['WT-HP-2026-00045'],
    sellerId: 'FARMER-03',
    sellerName: 'Sunil Thakur',
    sellerType: 'FARMER',
    woolType: 'Gaddi Natural White Fleece',
    qualityGrade: 'A+',
    qualityScore: 96,
    fiberDiameter: 22.1,
    origin: 'Kullu, Himachal Pradesh',
    currentLocation: 'Kullu Artisans Depot',
    totalQuantity: 210,
    availableQuantity: 0,
    askingPrice: 550,
    minAcceptablePrice: 520,
    storageLocation: 'Kullu Artisans Depot',
    certificateId: 'WTC-QA-2026-00045',
    traceabilityUrl: '/track/WT-HP-2026-00045',
    status: 'SOLD',
    availableFrom: '2026-07-25',
    verified: true,
    inspectionStatus: 'Certified Grade A+',
    description: 'High-altitude organic Gaddi wool for GI-certified Kullu shawls.',
    createdAt: '2026-07-25T10:00:00Z'
  }
];

const INITIAL_BUYER_DEMANDS = [
  {
    id: 'BD-2026-01',
    buyerId: 'BUYER-PU-01',
    buyerName: 'WoolCraft Processing Centre',
    buyerType: 'PROCESSOR',
    organization: 'WoolCraft Textiles & Spinning Ltd.',
    location: 'Mysuru Industrial Estate, Karnataka',
    woolType: 'Fine Merino Apparel Wool',
    requiredGrade: 'A',
    quantityRequired: 2500,
    minQuantity: 300,
    maxQuantity: 3000,
    budgetPrice: 460,
    minPrice: 430,
    maxPrice: 475,
    deliveryWindowDays: 14,
    preferredDelivery: 'Processing Facility Gate or Warehouse Hub',
    paymentTerms: '100% WoolTrace Digital Escrow Vault',
    verified: true,
    verificationBadge: 'PLATFORM_VERIFIED_MILL',
    rating: 4.9,
    transactionsCompleted: 38,
    sustainabilityAccredited: true,
    notes: 'Urgent procurement for winter apparel worsted spinning. Direct pickup available within 150 km radius.',
    createdAt: '2026-08-14T08:00:00Z'
  },
  {
    id: 'BD-2026-02',
    buyerId: 'BUYER-INST-02',
    buyerName: 'Himalayan Handloom Apex Co-op',
    buyerType: 'INSTITUTIONAL',
    organization: 'State Handloom & Handicrafts Federation',
    location: 'Shimla & Kullu, Himachal Pradesh',
    woolType: 'Gaddi Natural White Fleece',
    requiredGrade: 'A+',
    quantityRequired: 800,
    minQuantity: 150,
    maxQuantity: 1000,
    budgetPrice: 530,
    minPrice: 500,
    maxPrice: 560,
    deliveryWindowDays: 20,
    preferredDelivery: 'Co-op Processing Warehouse',
    paymentTerms: '30% Advance + 70% Post-Inspection Release',
    verified: true,
    verificationBadge: 'GOVERNMENT_COOPERATIVE',
    rating: 4.8,
    transactionsCompleted: 24,
    sustainabilityAccredited: true,
    notes: 'Procuring for certified heritage artisan weaving clusters. Traceability verification required.',
    createdAt: '2026-08-12T11:00:00Z'
  },
  {
    id: 'BD-2026-03',
    buyerId: 'BUYER-CARP-03',
    buyerName: 'Rajasthan Carpet Mills & Rugs',
    buyerType: 'MANUFACTURER',
    organization: 'Marwar Woolen Fabrics Pvt. Ltd.',
    location: 'Bikaner & Jaipur, Rajasthan',
    woolType: 'Chokla Fine Carpet Wool',
    requiredGrade: 'A',
    quantityRequired: 3500,
    minQuantity: 500,
    maxQuantity: 5000,
    budgetPrice: 400,
    minPrice: 380,
    maxPrice: 415,
    deliveryWindowDays: 10,
    preferredDelivery: 'Bikaner Wool Hub Depot',
    paymentTerms: 'Escrow (T+3 Days on Mandi Check-In)',
    verified: true,
    verificationBadge: 'VERIFIED_MANUFACTURER',
    rating: 4.7,
    transactionsCompleted: 52,
    sustainabilityAccredited: false,
    notes: 'Seeking high-yield lustrous fleece for hand-knotted export rugs.',
    createdAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'BD-2026-04',
    buyerId: 'BUYER-EXP-04',
    buyerName: 'Bharat Wool Global Exports',
    buyerType: 'EXPORTER',
    organization: 'Indo-European Wool Trade Consortium',
    location: 'Ludhiana, Punjab',
    woolType: 'Consolidated South India Fleece (Grade A/B)',
    requiredGrade: 'A',
    quantityRequired: 5000,
    minQuantity: 1000,
    maxQuantity: 10000,
    budgetPrice: 440,
    minPrice: 410,
    maxPrice: 460,
    deliveryWindowDays: 25,
    preferredDelivery: 'Ludhiana Terminal or Direct ICD',
    paymentTerms: 'Verified Letter of Credit / Platform Escrow',
    verified: true,
    verificationBadge: 'VERIFIED_EXPORTER',
    rating: 4.95,
    transactionsCompleted: 88,
    sustainabilityAccredited: true,
    notes: 'Consolidated FPO bulk lots preferred. Accepts moisture content up to 13%.',
    createdAt: '2026-08-10T14:00:00Z'
  }
];

const INITIAL_MARKET_OFFERS = [
  {
    id: 'OFF-2026-0081',
    offerNumber: 'OFF-2026-0081',
    lotId: 'LOT-2026-00124',
    lotNumber: 'LOT-KA-2026-00124',
    sellerId: 'FARMER-01',
    sellerName: 'Rajesh Gowda',
    buyerId: 'BUYER-PU-01',
    buyerName: 'WoolCraft Processing Centre',
    buyerType: 'PROCESSOR',
    woolType: 'Merino Cross Fleece',
    qualityGrade: 'A',
    offeredPricePerKg: 438,
    quantityKg: 428,
    totalGrossAmount: 187464,
    paymentTerms: '100% WoolTrace Digital Escrow Vault',
    deliveryTerms: 'Buyer arranges transport from Mysuru Storage Centre',
    status: 'PENDING', // PENDING, ACCEPTED, REJECTED, COUNTERED, EXPIRED
    validUntil: '2026-08-25T18:00:00Z',
    history: [
      {
        action: 'OFFER_SUBMITTED',
        by: 'WoolCraft Processing Centre',
        pricePerKg: 438,
        quantityKg: 428,
        note: 'Initial competitive offer for full 428 KG lot with direct warehouse pickup.',
        timestamp: '2026-08-16T14:20:00Z'
      }
    ],
    createdAt: '2026-08-16T14:20:00Z'
  },
  {
    id: 'OFF-2026-0082',
    offerNumber: 'OFF-2026-0082',
    lotId: 'LOT-2026-00089',
    lotNumber: 'LOT-RJ-2026-00089',
    sellerId: 'FARMER-02',
    sellerName: 'Baldev Singh',
    buyerId: 'BUYER-CARP-03',
    buyerName: 'Rajasthan Carpet Mills & Rugs',
    buyerType: 'MANUFACTURER',
    woolType: 'Chokla Fine Carpet Wool',
    qualityGrade: 'A',
    offeredPricePerKg: 390,
    quantityKg: 650,
    totalGrossAmount: 253500,
    paymentTerms: 'Escrow (T+3 Days)',
    deliveryTerms: 'Drop-off at Bikaner Terminal',
    status: 'COUNTERED',
    validUntil: '2026-08-22T18:00:00Z',
    history: [
      {
        action: 'OFFER_SUBMITTED',
        by: 'Rajasthan Carpet Mills',
        pricePerKg: 382,
        quantityKg: 650,
        note: 'Procurement offer at ₹382/KG.',
        timestamp: '2026-08-15T10:00:00Z'
      },
      {
        action: 'COUNTER_OFFER',
        by: 'Baldev Singh (Farmer)',
        pricePerKg: 390,
        quantityKg: 650,
        note: 'Counter-offered ₹390/KG based on verified Grade A yield certification.',
        timestamp: '2026-08-15T15:30:00Z'
      }
    ],
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'OFF-2026-0083',
    offerNumber: 'OFF-2026-0083',
    lotId: 'LOT-2026-FPO-01',
    lotNumber: 'LOT-FPO-KA-001',
    sellerId: 'FPO-KA-01',
    sellerName: 'Karnataka Southern Wool Growers FPO Apex',
    buyerId: 'BUYER-EXP-04',
    buyerName: 'Bharat Wool Global Exports',
    buyerType: 'EXPORTER',
    woolType: 'Consolidated South India Fleece (Grade A/B)',
    qualityGrade: 'A/B Mix',
    offeredPricePerKg: 420,
    quantityKg: 1140,
    totalGrossAmount: 478800,
    paymentTerms: 'Platform Escrow Vault',
    deliveryTerms: 'FPO manages containerized loading to ICD Hub',
    status: 'ACCEPTED',
    validUntil: '2026-08-20T18:00:00Z',
    history: [
      {
        action: 'OFFER_SUBMITTED',
        by: 'Bharat Wool Global Exports',
        pricePerKg: 415,
        quantityKg: 1140,
        note: 'Bulk purchase offer for aggregated lot.',
        timestamp: '2026-08-16T09:30:00Z'
      },
      {
        action: 'COUNTER_OFFER',
        by: 'Karnataka Wool FPO',
        pricePerKg: 420,
        quantityKg: 1140,
        note: 'FPO confirmed rate at ₹420/KG.',
        timestamp: '2026-08-16T11:00:00Z'
      },
      {
        action: 'OFFER_ACCEPTED',
        by: 'Bharat Wool Global Exports',
        pricePerKg: 420,
        quantityKg: 1140,
        note: 'Agreement secured. Transaction TXN-2026-00145 initiated.',
        timestamp: '2026-08-16T11:45:00Z'
      }
    ],
    createdAt: '2026-08-16T09:30:00Z'
  }
];

const INITIAL_MARKET_TRANSACTIONS = [
  {
    id: 'TXN-2026-00142',
    transactionNumber: 'TXN-2026-00142',
    offerId: 'OFF-2026-0065',
    lotId: 'LOT-2026-00045',
    lotNumber: 'LOT-HP-2026-00045',
    batchId: 'WT-HP-2026-00045',
    farmerId: 'FARMER-03',
    farmerName: 'Sunil Thakur',
    buyerId: 'BUYER-INST-02',
    buyerName: 'Kullu Weavers Guild',
    woolType: 'Gaddi Natural White Fleece',
    qualityGrade: 'A+',
    quantityKg: 210,
    agreedPricePerKg: 550,
    grossValue: 115500,
    transportCost: 2500,
    storageCost: 1050,
    transactionFee: 1155,
    netRealization: 110795,
    netRealizationPerKg: 527.60,
    deliveryStatus: 'DELIVERED', // LOGISTICS_PENDING, IN_TRANSIT, DELIVERED
    paymentStatus: 'PAID', // PAYMENT_PENDING, IN_ESCROW, PARTIALLY_PAID, PAID
    paidAmount: 115500,
    outstandingAmount: 0,
    disputeStatus: 'NONE', // NONE, OPEN, UNDER_REVIEW, RESOLVED
    transactionDate: '2026-08-05T14:30:00Z',
    completionDate: '2026-08-12T10:00:00Z',
    escrowReleasedAt: '2026-08-12T10:15:00Z',
    notes: 'Heritage batch transaction completed. Contributed to regional historical benchmark rate.'
  },
  {
    id: 'TXN-2026-00145',
    transactionNumber: 'TXN-2026-00145',
    offerId: 'OFF-2026-0083',
    lotId: 'LOT-2026-FPO-01',
    lotNumber: 'LOT-FPO-KA-001',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FPO-KA-01',
    farmerName: 'Karnataka Southern Wool Growers FPO Apex',
    buyerId: 'BUYER-EXP-04',
    buyerName: 'Bharat Wool Global Exports',
    woolType: 'Consolidated South India Fleece (Grade A/B)',
    qualityGrade: 'A/B Mix',
    quantityKg: 1140,
    agreedPricePerKg: 420,
    grossValue: 478800,
    transportCost: 6500,
    storageCost: 3200,
    transactionFee: 4788,
    netRealization: 464312,
    netRealizationPerKg: 407.29,
    deliveryStatus: 'IN_TRANSIT',
    paymentStatus: 'IN_ESCROW',
    paidAmount: 478800,
    outstandingAmount: 0,
    disputeStatus: 'NONE',
    transactionDate: '2026-08-16T12:00:00Z',
    expectedDeliveryDate: '2026-08-22',
    notes: 'Escrow vault locked. Freight dispatched via Rapid Farm Logistics container fleet.'
  }
];

const INITIAL_DISPUTES = [
  {
    id: 'DISP-2026-0007',
    transactionId: 'TXN-2026-00138',
    lotNumber: 'LOT-KA-2026-00098',
    raisedBy: 'BUYER',
    raisedByName: 'Bengaluru Apparel Mill',
    reasonCategory: 'Moisture Level Discrepancy',
    description: 'Bales measured 14.8% moisture on arrival versus certified 12.0% in origin QA passport.',
    claimedAmount: 8500,
    status: 'RESOLVED', // OPEN, UNDER_REVIEW, RESOLVED, REJECTED, CLOSED
    resolutionNote: 'Joint lab re-test confirmed ambient transit humidity spike. Transporter covered differential drying allowance ₹4,200.',
    resolvedAt: '2026-08-14T16:00:00Z',
    createdAt: '2026-08-11T09:00:00Z'
  }
];
'''

# Find place to insert INITIAL collections before GlobalStateProvider
idx = code.find('export const GlobalStateProvider = ({ children }) => {')
if idx == -1:
    print('Could not find GlobalStateProvider')
    exit(1)

new_code = code[:idx] + market_seed_data + '\n' + code[idx:]

# Now add useState and methods inside GlobalStateProvider
state_declarations = '''
  // ── Market Linkage & Price Discovery State (SIH 2026 PS 26132) ──────────
  const [woolLots, setWoolLots] = useState(() => {
    const stored = localStorage.getItem('wt_wool_lots_v1');
    return stored ? JSON.parse(stored) : INITIAL_WOOL_LOTS;
  });

  const [buyerDemands, setBuyerDemands] = useState(() => {
    const stored = localStorage.getItem('wt_buyer_demands_v1');
    return stored ? JSON.parse(stored) : INITIAL_BUYER_DEMANDS;
  });

  const [marketOffers, setMarketOffers] = useState(() => {
    const stored = localStorage.getItem('wt_market_offers_v1');
    return stored ? JSON.parse(stored) : INITIAL_MARKET_OFFERS;
  });

  const [marketTransactions, setMarketTransactions] = useState(() => {
    const stored = localStorage.getItem('wt_market_transactions_v1');
    return stored ? JSON.parse(stored) : INITIAL_MARKET_TRANSACTIONS;
  });

  const [disputes, setDisputes] = useState(() => {
    const stored = localStorage.getItem('wt_disputes_v1');
    return stored ? JSON.parse(stored) : INITIAL_DISPUTES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('wt_wool_lots_v1', JSON.stringify(woolLots));
      localStorage.setItem('wt_buyer_demands_v1', JSON.stringify(buyerDemands));
      localStorage.setItem('wt_market_offers_v1', JSON.stringify(marketOffers));
      localStorage.setItem('wt_market_transactions_v1', JSON.stringify(marketTransactions));
      localStorage.setItem('wt_disputes_v1', JSON.stringify(disputes));
    } catch (e) {
      console.warn('Storage quota exceeded in GlobalStateContext:', e);
    }
  }, [woolLots, buyerDemands, marketOffers, marketTransactions, disputes]);

  // ── Market Linkage Action Methods ─────────────────────────────────────────
  const createWoolLot = (lotData) => {
    const newLot = {
      id: LOT-2026-,
      lotNumber: LOT-2026-,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      verified: true,
      ...lotData
    };

    setWoolLots(prev => [newLot, ...prev]);

    // Append digital trace event to linked batch
    if (lotData.batchIds && lotData.batchIds.length > 0) {
      lotData.batchIds.forEach(batchId => {
        addTraceEvent(batchId, {
          stage: 'MARKET',
          title: 'Wool Lot Created & Listed for Discovery',
          location: lotData.currentLocation || 'WoolTrace Market Exchange',
          status: 'Active',
          actor: ${lotData.sellerName || 'Farmer'} (Seller),
          description: Created Lot # ( KG, Asking ₹/KG). Verified quality attached.
        });
      });
    }

    return newLot;
  };

  const aggregateFpoLot = (batchIds, fpoData) => {
    const linkedBatches = batches.filter(b => batchIds.includes(b.id || b.batchId));
    const totalQty = linkedBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);

    const fpoLot = {
      id: LOT-FPO-,
      lotNumber: LOT-FPO-,
      batchIds: linkedBatches.map(b => b.id || b.batchId),
      sellerId: fpoData.fpoId || 'FPO-01',
      sellerName: fpoData.fpoName || 'Regional Wool Farmers Producer Co-op',
      sellerType: 'FPO',
      isFpoAggregate: true,
      contributingFarmers: linkedBatches.map(b => ({
        farmerId: b.farmerId,
        farmerName: b.farmerName,
        quantity: b.quantity,
        woolType: b.woolType,
        grade: b.qualityGrade || 'A'
      })),
      woolType: fpoData.woolType || 'FPO Aggregated Commercial Fleece',
      qualityGrade: fpoData.grade || 'A',
      qualityScore: 85,
      fiberDiameter: 22.8,
      origin: linkedBatches.map(b => b.origin).filter(Boolean).join(', ') || 'FPO Regional Hub',
      currentLocation: fpoData.currentLocation || 'FPO Central Aggregation Depot',
      totalQuantity: totalQty,
      availableQuantity: totalQty,
      askingPrice: fpoData.askingPrice || 430,
      minAcceptablePrice: fpoData.minAcceptablePrice || 410,
      storageLocation: fpoData.storageLocation || 'Mysuru Wool Storage Centre',
      certificateId: linkedBatches[0]?.certificateId || 'WTC-QA-FPO-AGG',
      traceabilityUrl: /track/,
      status: 'AVAILABLE',
      availableFrom: new Date().toISOString().split('T')[0],
      verified: true,
      inspectionStatus: 'Multi-Batch FPO Verified',
      description: fpoData.description || Consolidated FPO bulk lot aggregated from  verified farmer batches for institutional & mill procurement.,
      createdAt: new Date().toISOString()
    };

    setWoolLots(prev => [fpoLot, ...prev]);

    // Add trace events
    linkedBatches.forEach(b => {
      addTraceEvent(b.id || b.batchId, {
        stage: 'MARKET',
        title: 'Batch Aggregated into FPO Bulk Lot',
        location: fpoLot.currentLocation,
        status: 'Active',
        actor: fpoLot.sellerName,
        description: Consolidated into Bulk Lot # (Combined volume  KG). Ready for bulk buyer discovery.
      });
    });

    return fpoLot;
  };

  const submitOffer = (offerData) => {
    const newOffer = {
      id: OFF-2026-,
      offerNumber: OFF-2026-,
      status: 'PENDING',
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      history: [
        {
          action: 'OFFER_SUBMITTED',
          by: offerData.buyerName || 'Buyer',
          pricePerKg: offerData.offeredPricePerKg,
          quantityKg: offerData.quantityKg,
          note: offerData.note || 'Initial offer submitted via WoolTrace Market Linkages.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      ...offerData
    };

    setMarketOffers(prev => [newOffer, ...prev]);

    // Update lot status
    setWoolLots(prev => prev.map(l => l.id === offerData.lotId ? { ...l, status: 'OFFER_RECEIVED' } : l));

    return newOffer;
  };

  const respondOffer = (offerId, action, payload = {}) => {
    const targetOffer = marketOffers.find(o => o.id === offerId);
    if (!targetOffer) return;

    if (action === 'ACCEPT') {
      const updatedOffer = {
        ...targetOffer,
        status: 'ACCEPTED',
        history: [
          ...targetOffer.history,
          {
            action: 'OFFER_ACCEPTED',
            by: payload.actor || 'Seller',
            pricePerKg: targetOffer.offeredPricePerKg,
            quantityKg: targetOffer.quantityKg,
            note: payload.note || 'Offer accepted by seller. Transaction initialized.',
            timestamp: new Date().toISOString()
          }
        ]
      };

      setMarketOffers(prev => prev.map(o => o.id === offerId ? updatedOffer : o));

      // Create transaction automatically
      createTransactionFromOffer(updatedOffer);
    } else if (action === 'REJECT') {
      setMarketOffers(prev => prev.map(o => o.id === offerId ? {
        ...o,
        status: 'REJECTED',
        history: [
          ...o.history,
          {
            action: 'OFFER_REJECTED',
            by: payload.actor || 'Seller',
            note: payload.reason || 'Offer rejected by seller.',
            timestamp: new Date().toISOString()
          }
        ]
      } : o));
    } else if (action === 'COUNTER') {
      const counterPrice = payload.counterPricePerKg || targetOffer.offeredPricePerKg;
      const counterQty = payload.counterQuantityKg || targetOffer.quantityKg;

      setMarketOffers(prev => prev.map(o => o.id === offerId ? {
        ...o,
        status: 'COUNTERED',
        offeredPricePerKg: counterPrice,
        quantityKg: counterQty,
        totalGrossAmount: counterPrice * counterQty,
        history: [
          ...o.history,
          {
            action: 'COUNTER_OFFER',
            by: payload.actor || 'Seller',
            pricePerKg: counterPrice,
            quantityKg: counterQty,
            note: payload.note || Counter-offer submitted at ₹/KG.,
            timestamp: new Date().toISOString()
          }
        ]
      } : o));

      setWoolLots(prev => prev.map(l => l.id === targetOffer.lotId ? { ...l, status: 'NEGOTIATING' } : l));
    }
  };

  const createTransactionFromOffer = (acceptedOffer) => {
    const gross = (acceptedOffer.offeredPricePerKg || 420) * (acceptedOffer.quantityKg || 100);
    const transport = Math.round(500 + (acceptedOffer.distanceKm || 35) * 22);
    const storage = Math.round((acceptedOffer.storageMonths || 1) * 4.5 * acceptedOffer.quantityKg);
    const platformFee = Math.round((gross * 1.0) / 100);
    const net = Math.max(0, gross - (transport + storage + platformFee));

    const newTxn = {
      id: TXN-2026-,
      transactionNumber: TXN-2026-,
      offerId: acceptedOffer.id,
      lotId: acceptedOffer.lotId,
      lotNumber: acceptedOffer.lotNumber,
      batchId: acceptedOffer.batchIds ? acceptedOffer.batchIds[0] : 'WT-BATCH-01',
      farmerId: acceptedOffer.sellerId,
      farmerName: acceptedOffer.sellerName,
      buyerId: acceptedOffer.buyerId,
      buyerName: acceptedOffer.buyerName,
      woolType: acceptedOffer.woolType,
      qualityGrade: acceptedOffer.qualityGrade || 'A',
      quantityKg: acceptedOffer.quantityKg,
      agreedPricePerKg: acceptedOffer.offeredPricePerKg,
      grossValue: gross,
      transportCost: transport,
      storageCost: storage,
      transactionFee: platformFee,
      netRealization: net,
      netRealizationPerKg: Number((net / acceptedOffer.quantityKg).toFixed(2)),
      deliveryStatus: 'LOGISTICS_PENDING',
      paymentStatus: 'IN_ESCROW',
      paidAmount: gross,
      outstandingAmount: 0,
      disputeStatus: 'NONE',
      transactionDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Deal finalized via digital contract. Escrow deposit verified.'
    };

    setMarketTransactions(prev => [newTxn, ...prev]);

    // Update lot available quantity & status
    setWoolLots(prev => prev.map(l => {
      if (l.id === acceptedOffer.lotId) {
        const remaining = Math.max(0, l.availableQuantity - acceptedOffer.quantityKg);
        return {
          ...l,
          availableQuantity: remaining,
          status: remaining === 0 ? 'SOLD' : 'PARTIALLY_SOLD'
        };
      }
      return l;
    }));

    return newTxn;
  };

  const updateTransactionPayment = (txnId, paymentStatus, paidAmount) => {
    setMarketTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        const paid = paidAmount !== undefined ? paidAmount : t.grossValue;
        const outstanding = Math.max(0, t.grossValue - paid);
        return {
          ...t,
          paymentStatus,
          paidAmount: paid,
          outstandingAmount: outstanding,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const updateTransactionDelivery = (txnId, deliveryStatus) => {
    setMarketTransactions(prev => prev.map(t => {
      if (t.id === txnId) {
        return {
          ...t,
          deliveryStatus,
          completionDate: deliveryStatus === 'DELIVERED' ? new Date().toISOString() : t.completionDate,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const raiseTransactionDispute = (txnId, disputeData) => {
    const newDispute = {
      id: DISP-2026-,
      transactionId: txnId,
      lotNumber: disputeData.lotNumber || 'LOT-REF',
      raisedBy: disputeData.raisedBy || 'FARMER',
      raisedByName: disputeData.raisedByName || 'User',
      reasonCategory: disputeData.reasonCategory || 'Quality Discrepancy',
      description: disputeData.description || '',
      claimedAmount: disputeData.claimedAmount || 0,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);

    setMarketTransactions(prev => prev.map(t => t.id === txnId ? { ...t, disputeStatus: 'OPEN' } : t));

    return newDispute;
  };

  const resolveDispute = (disputeId, resolution) => {
    setDisputes(prev => prev.map(d => {
      if (d.id === disputeId) {
        return {
          ...d,
          status: 'RESOLVED',
          resolutionNote: resolution.note || 'Dispute resolved mutually.',
          resolvedAt: new Date().toISOString()
        };
      }
      return d;
    }));
  };

  const publishBuyerDemand = (demandData) => {
    const newDemand = {
      id: BD-2026-,
      verified: true,
      verificationBadge: 'VERIFIED_BUYER',
      rating: 4.8,
      transactionsCompleted: 12,
      createdAt: new Date().toISOString(),
      ...demandData
    };

    setBuyerDemands(prev => [newDemand, ...prev]);
    return newDemand;
  };
'''

# Find the return statement inside GlobalStateProvider
return_match = re.search(r'return\s*\(\s*<GlobalStateContext\.Provider\s+value=\{\{', new_code)
if not return_match:
    print('Could not find provider return')
    exit(1)

insert_pos = return_match.start()
final_code = new_code[:insert_pos] + state_declarations + '\n  ' + new_code[insert_pos:]

# Now add new methods and states to the Provider value object
final_code = final_code.replace('processingRecords, addProcessingRecord, updateProcessingRecord', '''processingRecords, addProcessingRecord, updateProcessingRecord,
      // Market Linkages & Price Discovery
      woolLots, createWoolLot, aggregateFpoLot,
      buyerDemands, publishBuyerDemand,
      marketOffers, submitOffer, respondOffer,
      marketTransactions, createTransactionFromOffer, updateTransactionPayment, updateTransactionDelivery,
      disputes, raiseTransactionDispute, resolveDispute''')

with open('/home/jayy/sih/src/context/GlobalStateContext.jsx', 'w', encoding='utf-8') as f:
    f.write(final_code)

print('GlobalStateContext.jsx successfully updated with Market Linkages state and actions!')
