import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

// Initial Seed Batches with Complete Farm-to-Fabric Traceability and Events
const INITIAL_BATCHES = [
  {
    id: 'WT-KA-2026-00124',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    shearingDate: '2026-08-10T08:30:00Z',
    createdAt: '2026-08-10T08:30:00Z',
    currentStage: 'WAREHOUSE',
    currentStatus: 'Stored in Zone A',
    currentLocation: 'Mysuru Wool Storage Centre',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00124',
    storageLocation: {
      zone: 'A',
      rack: 'R-12',
      section: '04',
      position: 'B'
    },
    warehouseId: 'WH-01',
    warehouseName: 'Mysuru Wool Storage Centre',
    events: [
      {
        id: 'EVT-001',
        timestamp: '10 Aug 2026 · 08:30 AM',
        stage: 'FARM',
        title: 'Farm Shearing & Batch Registered',
        location: 'Mandya Farm, Karnataka',
        status: 'Completed',
        actor: 'Rajesh Gowda (Farmer)',
        description: 'Batch shorn from 32 healthy sheep. Initial gross weight 428 KG recorded with moisture baseline 12%.'
      },
      {
        id: 'EVT-002',
        timestamp: '12 Aug 2026 · 11:15 AM',
        stage: 'QUALITY',
        title: 'Quality Inspection & Certified',
        location: 'Mandya QA Lab #2',
        status: 'Completed',
        actor: 'Dr. Anita Desai (Quality Officer)',
        description: 'Fiber diameter tested at 21.5 µm, yield 72%, clean fleece. Grade A Certificate #WTC-QA-2026-00124 generated.'
      },
      {
        id: 'EVT-003',
        timestamp: '14 Aug 2026 · 02:00 PM',
        stage: 'MARKET',
        title: 'Bidding Concluded & Order Secured',
        location: 'WoolKart National Exchange',
        status: 'Completed',
        actor: 'Himalayan Wool Co. (Buyer)',
        description: 'Matched in digital bidding at ₹425/KG. Escrow secured in WoolTrace Escrow Vault.'
      },
      {
        id: 'EVT-004',
        timestamp: '15 Aug 2026 · 09:30 AM',
        stage: 'TRANSPORT',
        title: 'Transport Dispatched & In Transit',
        location: 'Transit Route NH-275',
        status: 'Completed',
        actor: 'Rapid Farm Logistics (Transporter)',
        description: 'Loaded on humidity-sealed container vehicle KA-09-EA-4412 for secure transit.'
      },
      {
        id: 'EVT-005',
        timestamp: '15 Aug 2026 · 04:32 PM',
        stage: 'WAREHOUSE',
        title: 'Warehouse Check-In',
        location: 'Mysuru Wool Storage Centre',
        status: 'Active',
        actor: 'K. Somanna (Warehouse Partner)',
        description: '428 KG received and weight re-verified. Moisture lock integrity intact. Stored in Zone A · Rack R-12 · Section 04 · Position B.'
      }
    ]
  },
  {
    id: 'WT-RJ-2026-00089',
    batchId: 'WT-RJ-2026-00089',
    farmerId: 'FARMER-02',
    farmerName: 'Baldev Singh',
    origin: 'Bikaner, Rajasthan',
    quantity: 650,
    woolType: 'Chokla Fine Carpet Wool',
    shearingDate: '2026-08-01T09:00:00Z',
    createdAt: '2026-08-01T09:00:00Z',
    currentStage: 'PROCESSING',
    currentStatus: 'Scouring & Carding',
    currentLocation: 'Bikaner Woolen Mill No. 3',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00089',
    storageLocation: {
      zone: 'B',
      rack: 'R-04',
      section: '02',
      position: 'A'
    },
    warehouseId: 'WH-04',
    warehouseName: 'Bikaner Wool Hub & Cold Storage',
    events: [
      {
        id: 'EVT-101',
        timestamp: '01 Aug 2026 · 09:00 AM',
        stage: 'FARM',
        title: 'Farm Shearing & Registration',
        location: 'Bikaner Pastoral Farm, Rajasthan',
        status: 'Completed',
        actor: 'Baldev Singh (Farmer)',
        description: '650 KG Chokla wool registered.'
      },
      {
        id: 'EVT-102',
        timestamp: '03 Aug 2026 · 02:30 PM',
        stage: 'QUALITY',
        title: 'Quality Assured (Grade A)',
        location: 'Bikaner Wool Testing Lab',
        status: 'Completed',
        actor: 'Rakesh Verma (Inspector)',
        description: 'Certified Grade A Chokla wool with 28.5 micron diameter.'
      },
      {
        id: 'EVT-103',
        timestamp: '05 Aug 2026 · 11:00 AM',
        stage: 'MARKET',
        title: 'Batch Sold via Reverse Bidding',
        location: 'WoolKart Exchange',
        status: 'Completed',
        actor: 'Rajasthan Carpet Mills',
        description: 'Sold at ₹395/KG.'
      },
      {
        id: 'EVT-104',
        timestamp: '06 Aug 2026 · 08:00 AM',
        stage: 'TRANSPORT',
        title: 'Transport Delivered to Warehouse',
        location: 'Bikaner Highway',
        status: 'Completed',
        actor: 'Marwar Cargo Lines',
        description: 'Delivered safely.'
      },
      {
        id: 'EVT-105',
        timestamp: '06 Aug 2026 · 03:00 PM',
        stage: 'WAREHOUSE',
        title: 'Warehouse Stored',
        location: 'Bikaner Wool Hub & Cold Storage',
        status: 'Completed',
        actor: 'Warehouse Supervisor',
        description: 'Slot Zone B · Rack R-04.'
      },
      {
        id: 'EVT-106',
        timestamp: '14 Aug 2026 · 10:00 AM',
        stage: 'PROCESSING',
        title: 'Dispatched to Processing Mill',
        location: 'Bikaner Woolen Mill No. 3',
        status: 'Active',
        actor: 'Mill Operator',
        description: 'Scouring and carding into high-grade carpet yarn underway.'
      }
    ]
  },
  {
    id: 'WT-HP-2026-00045',
    batchId: 'WT-HP-2026-00045',
    farmerId: 'FARMER-03',
    farmerName: 'Sunil Thakur',
    origin: 'Kullu, Himachal Pradesh',
    quantity: 210,
    woolType: 'Gaddi Natural White Fleece',
    shearingDate: '2026-07-20T10:00:00Z',
    createdAt: '2026-07-20T10:00:00Z',
    currentStage: 'FABRIC',
    currentStatus: 'Finished Handloom Shawls',
    currentLocation: 'Kullu Artisan Cooperative Store',
    qualityGrade: 'A+',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00045',
    events: [
      {
        id: 'EVT-201',
        timestamp: '20 Jul 2026 · 10:00 AM',
        stage: 'FARM',
        title: 'High Altitude Shearing',
        location: 'Kullu Valley Pastures',
        status: 'Completed',
        actor: 'Sunil Thakur (Gaddi Pastoralist)',
        description: '210 KG premium native Gaddi fleece harvested.'
      },
      {
        id: 'EVT-202',
        timestamp: '22 Jul 2026 · 01:00 PM',
        stage: 'QUALITY',
        title: 'Artisan Grade Certification',
        location: 'Himachal Wool Development Board',
        status: 'Completed',
        actor: 'State Inspector Verma',
        description: 'Purity grade A+, zero synthetic contamination.'
      },
      {
        id: 'EVT-203',
        timestamp: '25 Jul 2026 · 04:00 PM',
        stage: 'MARKET',
        title: 'Direct Artisan Purchase',
        location: 'WoolKart Fair-Trade Portal',
        status: 'Completed',
        actor: 'Kullu Weavers Guild',
        description: 'Direct procurement at ₹550/KG.'
      },
      {
        id: 'EVT-204',
        timestamp: '26 Jul 2026 · 11:30 AM',
        stage: 'TRANSPORT',
        title: 'Local Mountain Freight',
        location: 'Kullu Route',
        status: 'Completed',
        actor: 'Himalayan Express',
        description: 'Delivered to weaving cluster.'
      },
      {
        id: 'EVT-205',
        timestamp: '28 Jul 2026 · 09:00 AM',
        stage: 'WAREHOUSE',
        title: 'Cooperative Depot Storage',
        location: 'Kullu Artisans Depot',
        status: 'Completed',
        actor: 'Depot Keeper',
        description: 'Stored in cedarwood racks for moth prevention.'
      },
      {
        id: 'EVT-206',
        timestamp: '02 Aug 2026 · 08:30 AM',
        stage: 'PROCESSING',
        title: 'Hand-Spinning & Natural Dyeing',
        location: 'Artisan Workshop 4',
        status: 'Completed',
        actor: 'Master Spinner Maya Devi',
        description: 'Spun on traditional charkhas.'
      },
      {
        id: 'EVT-207',
        timestamp: '12 Aug 2026 · 03:00 PM',
        stage: 'FABRIC',
        title: 'Finished Heritage Wool Shawls',
        location: 'Kullu Artisan Cooperative Store',
        status: 'Active',
        actor: 'Master Weaver Tashi',
        description: '140 authentic GI-tagged Kullu Shawls produced with verifiable QR codes.'
      }
    ]
  },
  {
    id: 'WT-KA-2026-00130',
    batchId: 'WT-KA-2026-00130',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 320,
    woolType: 'Medium Crossbred Wool',
    shearingDate: '2026-08-14T09:00:00Z',
    createdAt: '2026-08-14T09:00:00Z',
    currentStage: 'TRANSPORT',
    currentStatus: 'In Transit to Mysuru Warehouse',
    currentLocation: 'NH-275 Enroute Mysuru',
    qualityGrade: 'B',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00130',
    events: [
      {
        id: 'EVT-301',
        timestamp: '14 Aug 2026 · 09:00 AM',
        stage: 'FARM',
        title: 'Shearing Completed',
        location: 'Mandya Farm, Karnataka',
        status: 'Completed',
        actor: 'Rajesh Gowda (Farmer)',
        description: '320 KG harvested.'
      },
      {
        id: 'EVT-302',
        timestamp: '14 Aug 2026 · 03:00 PM',
        stage: 'QUALITY',
        title: 'Grade B Certified',
        location: 'Mandya QA Lab #2',
        status: 'Completed',
        actor: 'Dr. Anita Desai',
        description: 'Fiber diameter 24.2 µm, certified Grade B.'
      },
      {
        id: 'EVT-303',
        timestamp: '15 Aug 2026 · 10:00 AM',
        stage: 'TRANSPORT',
        title: 'Enroute to Mysuru Storage',
        location: 'Mandya to Mysuru Highway',
        status: 'Active',
        actor: 'Rapid Farm Logistics',
        description: 'In transit to Mysuru Wool Storage Centre for Check-In.'
      }
    ]
  }
];

const INITIAL_CERTIFICATES = [
  {
    id: 'WTC-QA-2026-00124',
    certificateId: 'WTC-QA-2026-00124',
    batchId: 'WT-KA-2026-00124',
    inspectorId: 'QA-01',
    inspectorName: 'Dr. Anita Desai',
    grade: 'A',
    overallScore: 88,
    fiberDiameter: 21.5,
    yield: '72%',
    cleanliness: 92,
    moisture: 12,
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    issuedAt: '2026-08-12T11:15:00Z',
    status: 'Approved'
  },
  {
    id: 'WTC-QA-2026-00130',
    certificateId: 'WTC-QA-2026-00130',
    batchId: 'WT-KA-2026-00130',
    inspectorId: 'QA-01',
    inspectorName: 'Dr. Anita Desai',
    grade: 'B',
    overallScore: 76,
    fiberDiameter: 24.2,
    yield: '68%',
    cleanliness: 84,
    moisture: 13,
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 320,
    woolType: 'Medium Crossbred Wool',
    issuedAt: '2026-08-14T15:00:00Z',
    status: 'Approved'
  }
];

const INITIAL_WAREHOUSES = [
  {
    id: 'WH-01',
    name: 'Mysuru Wool Storage Centre',
    location: 'Mysuru Industrial Area, Hebbal, Karnataka',
    city: 'Mysuru',
    state: 'Karnataka',
    distance: '4.2 km',
    lat: 12.3556,
    lng: 76.6120,
    totalCapacity: 10000,
    occupiedCapacity: 6840,
    availableCapacity: 3160,
    storagePrice: 4.5, // per kg per month
    priceUnit: '₹4.5 / KG / month',
    rating: 4.8,
    reviewCount: 142,
    verified: true,
    governmentAccredited: true,
    contactPerson: 'K. Somanna (Senior Depot Incharge)',
    phone: '+91 821 245 8899',
    email: 'mysuru.hub@wooltrace.in',
    operatingHours: '6:00 AM – 9:00 PM (Daily)',
    storageServices: [
      'Climate-Controlled Zones (18–22°C)',
      'Moisture-Lock Sealed Bays',
      'Pest & Wool-Moth Protective Treatment',
      'Integrated Digital Weight Scales',
      '24/7 CCTV & Fire Protection System',
      'Automated Barcode / QR Pallet Tracking'
    ],
    description: 'Premier regional storage facility equipped with state-of-the-art climate controls, ISO-certified fire suppression, and automated pallet racking designed specifically for fine and raw fleece.'
  },
  {
    id: 'WH-02',
    name: 'State Wool Warehousing Corp.',
    location: 'APMC Yard, Ranebennur, Haveri, Karnataka',
    city: 'Ranebennur',
    state: 'Karnataka',
    distance: '18.5 km',
    lat: 14.6234,
    lng: 75.6267,
    totalCapacity: 25000,
    occupiedCapacity: 16200,
    availableCapacity: 8800,
    storagePrice: 3.8,
    priceUnit: '₹3.8 / KG / month',
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    governmentAccredited: true,
    contactPerson: 'M. Nagaraj (Superintendent)',
    phone: '+91 8373 267100',
    email: 'ranebennur@karnatakaswdc.gov.in',
    operatingHours: '24 / 7 Operations',
    storageServices: [
      'Government Subsidized Rates',
      'Fumigation & Quarantine Bays',
      'Bulk Raw Fleece Baling',
      'Direct Rail Siding Access'
    ],
    description: 'Large-scale government-backed depot serving northern and central Karnataka wool growers with certified security and insurance coverage.'
  },
  {
    id: 'WH-03',
    name: 'Deccan Agri-Logistics & Wool Terminal',
    location: 'Cantonment Logistics Park, Ballari, Karnataka',
    city: 'Ballari',
    state: 'Karnataka',
    distance: '34.0 km',
    lat: 15.1394,
    lng: 76.9214,
    totalCapacity: 18000,
    occupiedCapacity: 11400,
    availableCapacity: 6600,
    storagePrice: 4.0,
    priceUnit: '₹4.0 / KG / month',
    rating: 4.7,
    reviewCount: 75,
    verified: true,
    governmentAccredited: false,
    contactPerson: 'Prakash Rao (Logistics Head)',
    phone: '+91 8392 278900',
    email: 'ballari.hub@deccanwool.in',
    operatingHours: '7:00 AM – 10:00 PM',
    storageServices: [
      'High-Density Racks',
      'Interstate Fleet Connectivity',
      'Cold Dehumidification',
      'Pre-processing Sorting Bays'
    ],
    description: 'Modern private logistics terminal connecting South Indian wool hubs with processing mills across Gujarat and Rajasthan.'
  },
  {
    id: 'WH-04',
    name: 'Bikaner Wool Hub & Cold Storage',
    location: 'Industrial Area Phase II, Bikaner, Rajasthan',
    city: 'Bikaner',
    state: 'Rajasthan',
    distance: '120 km',
    lat: 28.0229,
    lng: 73.3119,
    totalCapacity: 50000,
    occupiedCapacity: 38500,
    availableCapacity: 11500,
    storagePrice: 3.5,
    priceUnit: '₹3.5 / KG / month',
    rating: 4.9,
    reviewCount: 310,
    verified: true,
    governmentAccredited: true,
    contactPerson: 'Suresh Choudhary',
    phone: '+91 151 223 4567',
    email: 'bikaner@rajwool.org',
    operatingHours: '24 / 7 Operations',
    storageServices: [
      'Largest North India Wool Terminal',
      'Dedicated Carpet & Fine Wool Wings',
      'Onsite Fibre Testing & Grading Lab',
      'Zero-Moisture Cold Vaults'
    ],
    description: 'National hub for Indian wool handling over 50 metric tons with automated inventory slotting and immediate mill distribution.'
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'WREQ-2026-0081',
    batchId: 'WT-KA-2026-00130',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    warehouseId: 'WH-01',
    warehouseName: 'Mysuru Wool Storage Centre',
    quantity: 320,
    woolType: 'Medium Crossbred Wool',
    grade: 'B',
    storageDuration: '3 Months',
    durationMonths: 3,
    startDate: '2026-08-16',
    storageType: 'Climate-Controlled',
    estimatedCost: 4320,
    additionalMessage: 'Freshly sheared batch, please store in dry section.',
    status: 'Pending',
    createdAt: '2026-08-15T10:30:00Z'
  }
];

const INITIAL_BOOKINGS = [
  {
    id: 'WB-2026-0042',
    bookingId: 'WB-2026-0042',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    warehouseId: 'WH-01',
    warehouseName: 'Mysuru Wool Storage Centre',
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    grade: 'A',
    storageDuration: '6 Months',
    startDate: '2026-08-15',
    expiryDate: '2027-02-15',
    storageType: 'Climate-Controlled',
    monthlyCost: 1926,
    status: 'Active',
    checkInStatus: 'Checked-In',
    checkInDate: '2026-08-15T16:32:00Z',
    storageLocation: {
      zone: 'A',
      rack: 'R-12',
      section: '04',
      position: 'B'
    },
    createdAt: '2026-08-14T14:00:00Z'
  }
];

const INITIAL_RELEASES = [
  {
    id: 'REL-2026-0019',
    batchId: 'WT-RJ-2026-00089',
    warehouseId: 'WH-04',
    warehouseName: 'Bikaner Wool Hub & Cold Storage',
    farmerName: 'Baldev Singh',
    buyerName: 'Rajasthan Carpet Mills',
    originalStoredQty: 650,
    releasedQty: 650,
    remainingQty: 0,
    releaseType: 'Full Release',
    destination: 'Bikaner Woolen Mill No. 3',
    status: 'Approved',
    approvedBy: 'Warehouse Supervisor',
    approvedAt: '2026-08-14T10:00:00Z',
    createdAt: '2026-08-13T16:00:00Z'
  }
];

const INITIAL_PROCESSING_REQUESTS = [
  {
    id: 'PR-2026-00124',
    requestId: 'PR-2026-00124',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Sorting', 'Spinning'],
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    grade: 'A',
    qualityScore: 87,
    origin: 'Mysuru Warehouse',
    destination: 'WoolCraft Processing Centre',
    priority: 'HIGH',
    status: 'IN_TRANSIT',
    transportStatus: 'In Transit',
    transportPartner: 'Rapid Farm Logistics',
    eta: '42 min',
    distanceKm: 48.2,
    lat: 12.3050,
    lng: 76.6500,
    dispatchedAt: '2026-08-15T18:42:00Z',
    createdAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-15T18:42:00Z'
  },
  {
    id: 'PR-2026-00131',
    requestId: 'PR-2026-00131',
    batchId: 'WT-KA-2026-00131',
    farmerId: 'FARMER-04',
    farmerName: 'Kavitha Reddy',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Washing', 'Carding'],
    quantity: 620,
    woolType: 'Deccani Fine Wool',
    grade: 'A',
    qualityScore: 89,
    origin: 'Mandya Warehouse',
    destination: 'WoolCraft Processing Centre',
    priority: 'HIGH',
    status: 'DISPATCHED',
    transportStatus: 'Dispatched from Warehouse',
    eta: '1h 20m',
    distanceKm: 64.5,
    lat: 12.5220,
    lng: 76.8980,
    dispatchedAt: '2026-08-15T17:30:00Z',
    createdAt: '2026-08-15T09:00:00Z',
    updatedAt: '2026-08-15T17:30:00Z'
  },
  {
    id: 'PR-2026-00142',
    requestId: 'PR-2026-00142',
    batchId: 'WT-KA-2026-00142',
    farmerId: 'FARMER-07',
    farmerName: 'Anil Kumar',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Spinning'],
    quantity: 550,
    woolType: 'Nali Wool Grade B',
    grade: 'B',
    qualityScore: 78,
    origin: 'Hassan Wool Depot',
    destination: 'WoolCraft Processing Centre',
    priority: 'NORMAL',
    status: 'READY_FOR_PICKUP',
    transportStatus: 'Awaiting Pickup',
    eta: '2h 10m',
    distanceKm: 112.0,
    lat: 13.0069,
    lng: 76.1017,
    createdAt: '2026-08-15T11:20:00Z',
    updatedAt: '2026-08-15T11:20:00Z'
  },
  {
    id: 'PR-2026-00118',
    requestId: 'PR-2026-00118',
    batchId: 'WT-KA-2026-00118',
    farmerId: 'FARMER-02',
    farmerName: 'Suresh Patil',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Spinning'],
    operation: 'Spinning',
    operatorName: 'Ravi Kumar',
    equipment: 'Spinning Frame #03',
    quantity: 410,
    woolType: 'Carded Wool S-02',
    grade: 'A',
    qualityScore: 91,
    origin: 'WoolCraft Processing Centre',
    priority: 'NORMAL',
    status: 'PROCESSING',
    progressPct: 74,
    startedAt: '2026-08-15T14:20:00Z',
    expectedCompletion: '2026-08-15T20:30:00Z',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2026-08-13T10:00:00Z',
    updatedAt: '2026-08-15T14:20:00Z'
  },
  {
    id: 'PR-2026-00121',
    requestId: 'PR-2026-00121',
    batchId: 'WT-KA-2026-00121',
    farmerId: 'FARMER-03',
    farmerName: 'Lakshmi Devi',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Carding'],
    operation: 'Carding',
    operatorName: 'Priya Sharma',
    equipment: 'Carder Machine C-02',
    quantity: 280,
    woolType: 'Washed Raw Fleece',
    grade: 'A',
    qualityScore: 88,
    origin: 'WoolCraft Processing Centre',
    priority: 'URGENT',
    status: 'PROCESSING',
    progressPct: 52,
    startedAt: '2026-08-15T11:00:00Z',
    expectedCompletion: '2026-08-15T14:30:00Z',
    delayed: true,
    delayReason: 'Machine calibration adjustment',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2026-08-13T14:00:00Z',
    updatedAt: '2026-08-15T11:00:00Z'
  },
  {
    id: 'PR-2026-00115',
    requestId: 'PR-2026-00115',
    batchId: 'WT-KA-2026-00115',
    farmerId: 'FARMER-05',
    farmerName: 'Mahesh Swamy',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Washing', 'Spinning'],
    quantity: 500,
    woolType: 'Greasy Raw Wool',
    grade: 'B',
    qualityScore: 81,
    origin: 'Mysuru Warehouse',
    priority: 'NORMAL',
    status: 'RECEIVED',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2026-08-12T09:00:00Z',
    updatedAt: '2026-08-15T10:15:00Z'
  },
  {
    id: 'PR-2026-00110',
    requestId: 'PR-2026-00110',
    batchId: 'WT-KA-2026-00110-P02',
    parentBatchId: 'WT-KA-2026-00110',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Spinning', 'Dyeing'],
    quantity: 365,
    woolType: 'Dyed Fine Yarn 30s',
    grade: 'A',
    qualityScore: 94,
    origin: 'WoolCraft Processing Centre',
    destination: 'Bengaluru Textile Unit',
    destinationLat: 12.9716,
    destinationLng: 77.5946,
    distanceKm: 142.5,
    status: 'READY_TO_SHIP',
    completedAt: '2026-08-15T16:40:00Z',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2026-08-11T08:00:00Z',
    updatedAt: '2026-08-15T16:40:00Z'
  },
  {
    id: 'PR-2026-00112',
    requestId: 'PR-2026-00112',
    batchId: 'WT-KA-2026-00112-P01',
    parentBatchId: 'WT-KA-2026-00112',
    farmerId: 'FARMER-06',
    farmerName: 'Ramesh Naik',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Washing', 'Carding'],
    quantity: 420,
    woolType: 'Carded Fine Silver Wool',
    grade: 'A',
    qualityScore: 90,
    origin: 'WoolCraft Processing Centre',
    destination: 'Mysuru Weaving Guild',
    destinationLat: 12.3100,
    destinationLng: 76.6600,
    distanceKm: 8.4,
    status: 'READY_TO_SHIP',
    completedAt: '2026-08-15T14:10:00Z',
    lat: 12.2958,
    lng: 76.6394,
    createdAt: '2026-08-11T11:00:00Z',
    updatedAt: '2026-08-15T14:10:00Z'
  },
  {
    id: 'PR-2026-00105',
    requestId: 'PR-2026-00105',
    batchId: 'WT-KA-2026-00105-P01',
    parentBatchId: 'WT-KA-2026-00105',
    farmerId: 'FARMER-02',
    farmerName: 'Suresh Patil',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Spinning'],
    quantity: 450,
    woolType: 'Industrial Weaving Yarn',
    grade: 'A',
    qualityScore: 89,
    origin: 'WoolCraft Processing Centre',
    destination: 'Coimbatore Textile Park',
    destinationLat: 11.0168,
    destinationLng: 76.9558,
    status: 'DISPATCHED',
    transportStatus: 'In Transit',
    transportPartner: 'Rapid Express Logistics',
    liveGps: true,
    currentLocation: 'Tumakuru Highway (KM 84)',
    lat: 13.3400,
    lng: 77.1000,
    dispatchedAt: '2026-08-15T18:30:00Z',
    expectedDelivery: '2026-08-15T22:15:00Z',
    createdAt: '2026-08-10T14:00:00Z',
    updatedAt: '2026-08-15T18:30:00Z'
  },
  {
    id: 'PR-2026-00098',
    requestId: 'PR-2026-00098',
    batchId: 'WT-KA-2026-00098-P02',
    parentBatchId: 'WT-KA-2026-00098',
    farmerId: 'FARMER-04',
    farmerName: 'Kavitha Reddy',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Dyeing'],
    quantity: 380,
    woolType: 'Dyed Organic Wool Yarn',
    grade: 'A',
    qualityScore: 95,
    origin: 'WoolCraft Processing Centre',
    destination: 'Bengaluru Apparel Ltd',
    status: 'DELIVERED',
    deliveredAt: '2026-08-15T16:14:00Z',
    lat: 12.9716,
    lng: 77.5946,
    createdAt: '2026-08-09T09:00:00Z',
    updatedAt: '2026-08-15T16:14:00Z'
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
    notes: 'Sorting complete. 18 KG waste removed.',
    createdAt: '2026-08-14T09:30:00Z'
  }
];

export const GlobalStateProvider = ({ children }) => {
  const [batches, setBatches] = useState(() => {
    const stored = localStorage.getItem('wt_batches_v2');
    return stored ? JSON.parse(stored) : INITIAL_BATCHES;
  });

  const [certificates, setCertificates] = useState(() => {
    const stored = localStorage.getItem('wt_certificates_v2');
    return stored ? JSON.parse(stored) : INITIAL_CERTIFICATES;
  });

  const [warehouses, setWarehouses] = useState(() => {
    const stored = localStorage.getItem('wt_warehouses_v2');
    return stored ? JSON.parse(stored) : INITIAL_WAREHOUSES;
  });

  const [warehouseRequests, setWarehouseRequests] = useState(() => {
    const stored = localStorage.getItem('wt_warehouse_requests_v2');
    return stored ? JSON.parse(stored) : INITIAL_REQUESTS;
  });

  const [warehouseBookings, setWarehouseBookings] = useState(() => {
    const stored = localStorage.getItem('wt_warehouse_bookings_v2');
    return stored ? JSON.parse(stored) : INITIAL_BOOKINGS;
  });

  const [releaseRequests, setReleaseRequests] = useState(() => {
    const stored = localStorage.getItem('wt_release_requests_v2');
    return stored ? JSON.parse(stored) : INITIAL_RELEASES;
  });

  const [listings, setListings] = useState(() => {
    const stored = localStorage.getItem('wt_listings_v2');
    return stored ? JSON.parse(stored) : [
      {
        id: 'LST-001',
        batchId: 'WT-KA-2026-00124',
        sellerId: 'FARMER-01',
        sellerName: 'Rajesh Gowda',
        type: 'RAW_WOOL',
        title: 'Premium Merino Cross Wool',
        description: 'Grade A inspected fleece, high yield, stored in Mysuru Warehouse.',
        quantity: 428,
        minPrice: 380,
        price: 425,
        unit: 'kg',
        status: 'Sold',
        createdAt: '2026-08-14T12:00:00Z'
      }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem('wt_orders_v2');
    return stored ? JSON.parse(stored) : [
      {
        id: 'ORD-2026-00420',
        batchId: 'WT-KA-2026-00124',
        buyerId: 'BUYER-01',
        buyerName: 'Himalayan Wool Co.',
        sellerId: 'FARMER-01',
        sellerName: 'Rajesh Gowda',
        quantity: 428,
        pricePerKg: 425,
        totalAmount: 181900,
        paymentStatus: 'IN_ESCROW',
        status: 'Confirmed',
        createdAt: '2026-08-14T14:00:00Z'
      }
    ];
  });

  const [transportJobs, setTransportJobs] = useState(() => {
    const stored = localStorage.getItem('wt_transport_v2');
    return stored ? JSON.parse(stored) : [
      {
        id: 'TRJ-9921',
        orderId: 'ORD-2026-00420',
        batchId: 'WT-KA-2026-00124',
        transporterName: 'Rapid Farm Logistics',
        vehicleNumber: 'KA-09-EA-4412',
        driverName: 'Ramesh Singh',
        pickup: 'Mandya Farm, Karnataka',
        dropoff: 'Mysuru Wool Storage Centre',
        status: 'Delivered',
        createdAt: '2026-08-15T09:30:00Z',
        deliveredAt: '2026-08-15T16:00:00Z'
      }
    ];
  });

  const [transactions, setTransactions] = useState(() => {
    const stored = localStorage.getItem('wt_transactions_v2');
    return stored ? JSON.parse(stored) : [
      { id: 'TXN-00120', userId: 'FARMER-01', orderId: 'ORD-2026-00420', batchId: 'WT-KA-2026-00124', type: 'Sale', amount: 181900, status: 'Secured in Escrow', description: 'Batch #WT-KA-2026-00124 Purchase Escrow', createdAt: '2026-08-14T14:00:00Z' }
    ];
  });

  const [withdrawals, setWithdrawals] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [processingRequests, setProcessingRequests] = useState(() => {
    const stored = localStorage.getItem('wt_processing_requests');
    return stored ? JSON.parse(stored) : INITIAL_PROCESSING_REQUESTS;
  });

  const [processingRecords, setProcessingRecords] = useState(() => {
    const stored = localStorage.getItem('wt_processing_records');
    return stored ? JSON.parse(stored) : INITIAL_PROCESSING_RECORDS;
  });

  // Sync to local storage
  useEffect(() => localStorage.setItem('wt_batches_v2', JSON.stringify(batches)), [batches]);
  useEffect(() => localStorage.setItem('wt_certificates_v2', JSON.stringify(certificates)), [certificates]);
  useEffect(() => localStorage.setItem('wt_warehouses_v2', JSON.stringify(warehouses)), [warehouses]);
  useEffect(() => localStorage.setItem('wt_warehouse_requests_v2', JSON.stringify(warehouseRequests)), [warehouseRequests]);
  useEffect(() => localStorage.setItem('wt_warehouse_bookings_v2', JSON.stringify(warehouseBookings)), [warehouseBookings]);
  useEffect(() => localStorage.setItem('wt_release_requests_v2', JSON.stringify(releaseRequests)), [releaseRequests]);
  useEffect(() => localStorage.setItem('wt_listings_v2', JSON.stringify(listings)), [listings]);
  useEffect(() => localStorage.setItem('wt_orders_v2', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('wt_transport_v2', JSON.stringify(transportJobs)), [transportJobs]);
  useEffect(() => localStorage.setItem('wt_transactions_v2', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('wt_processing_requests', JSON.stringify(processingRequests)), [processingRequests]);
  useEffect(() => localStorage.setItem('wt_processing_records', JSON.stringify(processingRecords)), [processingRecords]);

  // ── Core Traceability & Event Logger ─────────────────────────────────────
  const addTraceEvent = (batchId, eventData) => {
    const newEvent = {
      id: `EVT-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
                 new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ...eventData
    };

    setBatches(prev => prev.map(b => {
      if (b.id === batchId || b.batchId === batchId) {
        return {
          ...b,
          currentStage: eventData.stage || b.currentStage,
          currentStatus: eventData.title || b.currentStatus,
          currentLocation: eventData.location || b.currentLocation,
          events: [...(b.events || []), newEvent]
        };
      }
      return b;
    }));

    return newEvent;
  };

  // ── Batch Operations ──────────────────────────────────────────────────────
  const addBatch = (batch) => {
    const formattedBatch = {
      ...batch,
      id: batch.batchId || batch.id,
      batchId: batch.batchId || batch.id,
      currentStage: batch.currentStage || 'FARM',
      currentStatus: batch.currentStatus || 'Harvested at Farm',
      currentLocation: batch.origin || 'Registered Farm',
      events: batch.events || [
        {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
                     new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          stage: 'FARM',
          title: 'Farm Shearing & Batch Registered',
          location: batch.origin || 'Registered Farm',
          status: 'Completed',
          actor: `${batch.farmerName || 'Farmer'} (Owner)`,
          description: `Batch of ${batch.quantity} KG (${batch.woolType || 'Raw Wool'}) registered into the WoolTrace digital ledger.`
        }
      ]
    };
    setBatches(prev => [formattedBatch, ...prev]);
    return formattedBatch;
  };

  const updateBatch = (id, updates) => {
    setBatches(prev => prev.map(b => (b.id === id || b.batchId === id) ? { ...b, ...updates } : b));
  };

  // ── Warehouse Operations ──────────────────────────────────────────────────
  const requestStorage = (requestData) => {
    const newRequest = {
      id: `WREQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...requestData
    };
    setWarehouseRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const respondStorageRequest = (requestId, action, reason = '') => {
    const targetReq = warehouseRequests.find(r => r.id === requestId);
    if (!targetReq) return;

    if (action === 'ACCEPT') {
      const newBooking = {
        id: `WB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        bookingId: `WB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        batchId: targetReq.batchId,
        farmerId: targetReq.farmerId,
        farmerName: targetReq.farmerName,
        warehouseId: targetReq.warehouseId,
        warehouseName: targetReq.warehouseName,
        quantity: targetReq.quantity,
        woolType: targetReq.woolType,
        grade: targetReq.grade || 'A',
        storageDuration: targetReq.storageDuration,
        startDate: targetReq.startDate,
        storageType: targetReq.storageType,
        status: 'Approved',
        checkInStatus: 'Pending Check-In',
        createdAt: new Date().toISOString()
      };

      setWarehouseBookings(prev => [newBooking, ...prev]);
      setWarehouseRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));

      // Append trace event
      addTraceEvent(targetReq.batchId, {
        stage: 'WAREHOUSE',
        title: 'Storage Booking Approved',
        location: targetReq.warehouseName,
        status: 'Approved',
        actor: 'Warehouse Partner',
        description: `Storage approved for ${targetReq.quantity} KG for ${targetReq.storageDuration}. Booking #${newBooking.id}.`
      });
    } else if (action === 'REJECT') {
      setWarehouseRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected', rejectionReason: reason } : r));
    }
  };

  const checkInBatch = (batchId, warehouseId, operatorName = 'Warehouse Operator') => {
    const warehouse = warehouses.find(w => w.id === warehouseId) || warehouses[0];
    const targetBatch = batches.find(b => b.id === batchId || b.batchId === batchId);
    
    if (!targetBatch) return { success: false, message: 'Batch not found' };

    // Update batch stage and location
    updateBatch(batchId, {
      currentStage: 'WAREHOUSE',
      currentStatus: 'Checked-In to Warehouse',
      currentLocation: warehouse.name,
      warehouseId: warehouse.id,
      warehouseName: warehouse.name
    });

    // Update warehouse occupied capacity
    setWarehouses(prev => prev.map(w => {
      if (w.id === warehouse.id) {
        const newOccupied = Math.min(w.totalCapacity, w.occupiedCapacity + (targetBatch.quantity || 0));
        return {
          ...w,
          occupiedCapacity: newOccupied,
          availableCapacity: Math.max(0, w.totalCapacity - newOccupied)
        };
      }
      return w;
    }));

    // Update any existing booking
    setWarehouseBookings(prev => prev.map(b => {
      if (b.batchId === batchId) {
        return {
          ...b,
          status: 'Active',
          checkInStatus: 'Checked-In',
          checkInDate: new Date().toISOString()
        };
      }
      return b;
    }));

    // Append digital trace event
    addTraceEvent(batchId, {
      stage: 'WAREHOUSE',
      title: 'WAREHOUSE CHECK-IN',
      location: warehouse.name,
      status: 'Active',
      actor: `${operatorName} (Warehouse Partner)`,
      description: `${targetBatch.quantity} KG received and inspected. Security and moisture seals verified intact.`
    });

    return { success: true };
  };

  const assignStorageLocation = (batchId, locationObj) => {
    const locationString = `Zone ${locationObj.zone} · Rack ${locationObj.rack} · Section ${locationObj.section} · Position ${locationObj.position}`;

    updateBatch(batchId, {
      storageLocation: locationObj,
      currentStatus: `Stored in ${locationString}`
    });

    setWarehouseBookings(prev => prev.map(b => {
      if (b.batchId === batchId) {
        return { ...b, storageLocation: locationObj };
      }
      return b;
    }));

    addTraceEvent(batchId, {
      stage: 'WAREHOUSE',
      title: 'Storage Slot Assigned',
      location: 'Mysuru Wool Storage Centre',
      status: 'Completed',
      actor: 'Warehouse Supervisor',
      description: `Physical placement assigned: ${locationString}. Digital twin mapped to automated inventory.`
    });
  };

  const requestBatchRelease = (batchId, releaseQty, requestedBy = 'Buyer / Farmer', destination = 'Spinning Mill') => {
    const targetBatch = batches.find(b => b.id === batchId || b.batchId === batchId);
    if (!targetBatch) return;

    const remaining = Math.max(0, targetBatch.quantity - releaseQty);

    const newRelease = {
      id: `REL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      batchId,
      warehouseId: targetBatch.warehouseId || 'WH-01',
      warehouseName: targetBatch.warehouseName || 'Mysuru Wool Storage Centre',
      farmerName: targetBatch.farmerName,
      requestedBy,
      originalStoredQty: targetBatch.quantity,
      releasedQty: releaseQty,
      remainingQty: remaining,
      releaseType: remaining === 0 ? 'Full Release' : 'Partial Release',
      destination,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setReleaseRequests(prev => [newRelease, ...prev]);
    return newRelease;
  };

  const approveBatchRelease = (releaseId, approverName = 'Warehouse Partner') => {
    const targetRelease = releaseRequests.find(r => r.id === releaseId);
    if (!targetRelease) return;

    // Update release request status
    setReleaseRequests(prev => prev.map(r => r.id === releaseId ? {
      ...r,
      status: 'Approved',
      approvedBy: approverName,
      approvedAt: new Date().toISOString()
    } : r));

    // Update batch quantity or stage
    const batch = batches.find(b => b.id === targetRelease.batchId || b.batchId === targetRelease.batchId);
    if (batch) {
      if (targetRelease.remainingQty === 0) {
        updateBatch(targetRelease.batchId, {
          currentStage: 'PROCESSING',
          currentStatus: 'Released for Mill Processing',
          currentLocation: targetRelease.destination
        });
      } else {
        updateBatch(targetRelease.batchId, {
          quantity: targetRelease.remainingQty,
          currentStatus: `Partially Released (${targetRelease.releasedQty} KG released, ${targetRelease.remainingQty} KG stored)`
        });
      }

      // Append trace event
      addTraceEvent(targetRelease.batchId, {
        stage: 'WAREHOUSE',
        title: 'BATCH RELEASE APPROVED',
        location: targetRelease.warehouseName,
        status: 'Completed',
        actor: `${approverName} (Warehouse Partner)`,
        description: `Release approved: ${targetRelease.releasedQty} KG dispatched to ${targetRelease.destination}. Remaining in storage: ${targetRelease.remainingQty} KG.`
      });
    }
  };

  const addCertificate = (cert) => setCertificates(prev => [cert, ...prev]);
  const addListing = (listing) => setListings(prev => [listing, ...prev]);
  const updateListing = (id, updates) => setListings(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const addOrder = (order) => setOrders(prev => [order, ...prev]);
  const updateOrder = (id, updates) => setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  const requestTransport = (job) => setTransportJobs(prev => [job, ...prev]);
  const updateTransport = (id, updates) => setTransportJobs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  const addTransaction = (txn) => setTransactions(prev => [txn, ...prev]);

  // ── Processing Actions ──────────────────────────────────────────────────
  const addProcessingRequest = (request) => setProcessingRequests(prev => [request, ...prev]);
  const updateProcessingRequest = (id, updates) =>
    setProcessingRequests(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r));

  const addProcessingRecord = (record) => setProcessingRecords(prev => [record, ...prev]);
  const updateProcessingRecord = (id, updates) =>
    setProcessingRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));

  
  // -- Processing Unit Profile & Facility State -----------------------------
  const [processingFacility, setProcessingFacility] = useState({
    id: 'PU-01',
    name: 'WoolCraft Processing Centre',
    address: 'Mysuru Industrial Zone, Mysuru, Karnataka',
    lat: 12.2958,
    lng: 76.6394,
    verified: true,
    status: 'ACCEPTING_BATCHES',
    totalCapacityKg: 5000,
    currentWorkloadKg: 3420,
    operatingHours: '08:00 - 20:00 IST',
    activeOperators: 8,
    activeEquipment: 12,
    operations: ['Sorting', 'Washing', 'Carding', 'Spinning', 'Dyeing']
  });

  const receiveProcessingBatch = (batchId, receivedQty, discrepancyReason = '') => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        const expected = r.quantity || receivedQty;
        return {
          ...r,
          status: 'RECEIVED',
          receivedQuantity: receivedQty,
          expectedQuantity: expected,
          discrepancyReason,
          receivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'RECEIVED AT PROCESSING UNIT',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Received',
      actor: 'Factory Receiver (Processing Unit Admin)',
      description: `Received ${receivedQty} KG at facility.${discrepancyReason ? ' Quantity Discrepancy logged: ' + discrepancyReason : ''}`
    });
  };

  const startProcessingOperation = (batchId, operation, operatorName, equipment, notes = '') => {
    const recordId = 'REC-2026-' + String(Math.floor(10000 + Math.random() * 90000));
    
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'PROCESSING',
          operation,
          operatorName,
          equipment,
          progressPct: 15,
          startedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    const newRecord = {
      id: recordId,
      recordId,
      batchId,
      processingUnitId: 'PU-01',
      operatorName: operatorName || 'Factory Operator',
      operation,
      inputQuantity: 400,
      status: 'IN_PROGRESS',
      startTime: new Date().toISOString(),
      equipment: equipment || 'Machine #01',
      notes
    };

    setProcessingRecords(prev => [newRecord, ...prev]);

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: `OPERATION STARTED: ${operation.toUpperCase()}`,
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'In Progress',
      actor: `${operatorName} (Processing Unit)`,
      description: `Operation ${operation} initiated using ${equipment}. ${notes}`
    });
  };

  const completeProcessingOperation = (batchId, outputQty, wasteQty = 0, outputBatchId = '', notes = '') => {
    const childId = outputBatchId || `${batchId}-P01`;

    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          outputQuantity: outputQty,
          wasteQuantity: wasteQty,
          outputBatchId: childId,
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    setProcessingRecords(prev => prev.map(rec => {
      if (rec.batchId === batchId && rec.status === 'IN_PROGRESS') {
        return {
          ...rec,
          status: 'COMPLETED',
          outputQuantity: outputQty,
          wasteQuantity: wasteQty,
          outputBatchId: childId,
          completionTime: new Date().toISOString(),
          notes
        };
      }
      return rec;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'PROCESSING COMPLETED',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Completed',
      actor: 'Factory Supervisor',
      description: `Processing completed. Output: ${outputQty} KG, Waste: ${wasteQty} KG. Created child output batch ${childId}.`
    });
  };

  const markProcessingReadyToShip = (batchId) => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'READY_TO_SHIP',
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'PROCESSING',
      title: 'READY TO SHIP',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Ready',
      actor: 'Processing Unit Admin',
      description: `Batch verified and packed. Available in Outbound Dispatch Queue.`
    });
  };

  const dispatchProcessingBatch = (batchId, destination = 'Bengaluru Textile Unit', transportPartner = 'Rapid Farm Logistics', notes = '') => {
    setProcessingRequests(prev => prev.map(r => {
      if (r.batchId === batchId || r.id === batchId) {
        return {
          ...r,
          status: 'DISPATCHED',
          transportStatus: 'Dispatched to Next Stage',
          destination,
          transportPartner,
          dispatchedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    addTraceEvent(batchId, {
      stage: 'TRANSPORT',
      title: 'OUTBOUND DISPATCHED',
      location: 'WoolCraft Processing Centre, Mysuru',
      status: 'Dispatched',
      actor: 'Processing Unit Admin',
      description: `Dispatched to ${destination} via ${transportPartner}. ${notes}`
    });
  };

  const updateFacilityStatus = (newStatus) => {
    setProcessingFacility(prev => ({ ...prev, status: newStatus }));
  };

  return (
    <GlobalStateContext.Provider value={{
      batches, addBatch, updateBatch, addTraceEvent,
      certificates, addCertificate,
      warehouses,
      warehouseRequests, requestStorage, respondStorageRequest,
      warehouseBookings,
      releaseRequests, requestBatchRelease, approveBatchRelease,
      checkInBatch, assignStorageLocation,
      listings, addListing, updateListing,
      orders, addOrder, updateOrder,
      transportJobs, requestTransport, updateTransport,
      transactions, addTransaction,
      withdrawals, addWithdrawal: (w) => setWithdrawals(prev => [...prev, w]),
      paymentMethods, addPaymentMethod: (p) => setPaymentMethods(prev => [...prev, p]),
      removePaymentMethod: (id) => setPaymentMethods(prev => prev.filter(pm => pm.id !== id)),
      // Processing
      processingFacility, updateFacilityStatus,
      processingRequests, addProcessingRequest, updateProcessingRequest,
      processingRecords, addProcessingRecord, updateProcessingRecord,
      receiveProcessingBatch, startProcessingOperation, completeProcessingOperation,
      markProcessingReadyToShip, dispatchProcessingBatch
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
