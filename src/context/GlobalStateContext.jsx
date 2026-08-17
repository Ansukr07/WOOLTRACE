import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

// ── Rich Seed Batches with Complete Farm-to-Fabric Traceability ────────────
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
    verificationUrl: 'http://localhost:5173/track/WT-KA-2026-00124',
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
    verificationUrl: 'http://localhost:5173/track/WT-RJ-2026-00089',
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
    verificationUrl: 'http://localhost:5173/track/WT-HP-2026-00045',
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
    verificationUrl: 'http://localhost:5173/track/WT-KA-2026-00130',
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
  },
  {
    id: 'WT-RJ-2026-00112',
    batchId: 'WT-RJ-2026-00112',
    farmerId: 'FARMER-04',
    farmerName: 'Hanumanaram Jat',
    origin: 'Nagaur, Rajasthan',
    quantity: 820,
    woolType: 'Magra Carpet Wool (Lustrous)',
    shearingDate: '2026-08-12T07:00:00Z',
    createdAt: '2026-08-12T07:00:00Z',
    currentStage: 'MARKET',
    currentStatus: 'Live Auction on WoolKart',
    currentLocation: 'Nagaur APMC Sub-yard',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00112',
    verificationUrl: 'http://localhost:5173/track/WT-RJ-2026-00112',
    events: [
      {
        id: 'EVT-401',
        timestamp: '12 Aug 2026 · 07:00 AM',
        stage: 'FARM',
        title: 'Autumn Shearing Completed',
        location: 'Nagaur Farm, Rajasthan',
        status: 'Completed',
        actor: 'Hanumanaram Jat',
        description: '820 KG lustrous Magra fleece shorn.'
      },
      {
        id: 'EVT-402',
        timestamp: '13 Aug 2026 · 04:00 PM',
        stage: 'QUALITY',
        title: 'Certified Grade A',
        location: 'CSWRI Testing Center',
        status: 'Completed',
        actor: 'QA Officer Sharma',
        description: 'High tensile strength, 32.4 micron fiber certified.'
      },
      {
        id: 'EVT-403',
        timestamp: '16 Aug 2026 · 11:30 AM',
        stage: 'MARKET',
        title: 'Listed on WoolKart Live Exchange',
        location: 'WoolKart Exchange',
        status: 'Active',
        actor: 'WoolKart Trading Desk',
        description: 'Open for reverse bidding with starting price ₹410/KG.'
      }
    ]
  },
  {
    id: 'WT-JK-2026-00018',
    batchId: 'WT-JK-2026-00018',
    farmerId: 'FARMER-05',
    farmerName: 'Ghulam Hassan Mir',
    origin: 'Gurez Valley, Jammu & Kashmir',
    quantity: 180,
    woolType: 'Kashmir Fine Merino Apparel Wool',
    shearingDate: '2026-08-15T09:00:00Z',
    createdAt: '2026-08-15T09:00:00Z',
    currentStage: 'QUALITY',
    currentStatus: 'Testing at Srinagar Central QA Lab',
    currentLocation: 'Srinagar QA Lab #1',
    qualityGrade: 'A+',
    certificateStatus: 'Under Inspection',
    certificateId: null,
    verificationUrl: 'http://localhost:5173/track/WT-JK-2026-00018',
    events: [
      {
        id: 'EVT-501',
        timestamp: '15 Aug 2026 · 09:00 AM',
        stage: 'FARM',
        title: 'High Altitude Harvest',
        location: 'Gurez Valley Pasture',
        status: 'Completed',
        actor: 'Ghulam Hassan Mir',
        description: '180 KG ultra-fine Kashmir Merino registered.'
      },
      {
        id: 'EVT-502',
        timestamp: '16 Aug 2026 · 02:00 PM',
        stage: 'QUALITY',
        title: 'Inspection Initiated',
        location: 'Srinagar Central QA Lab',
        status: 'Active',
        actor: 'Dr. Farooq Ahmed',
        description: 'OFDA 2000 optical fiber analysis in progress (expected <19 microns).'
      }
    ]
  },
  {
    id: 'WT-TS-2026-00077',
    batchId: 'WT-TS-2026-00077',
    farmerId: 'FARMER-06',
    farmerName: 'Mallesh Kuruma',
    origin: 'Mahabubnagar, Telangana',
    quantity: 540,
    woolType: 'Deccani Coarse Black Wool',
    shearingDate: '2026-08-16T08:00:00Z',
    createdAt: '2026-08-16T08:00:00Z',
    currentStage: 'FARM',
    currentStatus: 'Ready for Collection',
    currentLocation: 'Kuruma Pastoral Cooperative',
    qualityGrade: 'B',
    certificateStatus: 'Uninspected',
    certificateId: null,
    verificationUrl: 'http://localhost:5173/track/WT-TS-2026-00077',
    events: [
      {
        id: 'EVT-601',
        timestamp: '16 Aug 2026 · 08:00 AM',
        stage: 'FARM',
        title: 'Deccani Herd Shearing',
        location: 'Mahabubnagar Pastoral Hamlet',
        status: 'Completed',
        actor: 'Mallesh Kuruma',
        description: '540 KG coarse native black fleece harvested from 120 Deccani sheep.'
      }
    ]
  }
];

// ── Quality Certificates ───────────────────────────────────────────────────
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
    tensileStrength: '38 N/ktex',
    vegetableMatter: '1.2%',
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    issuedAt: '2026-08-12T11:15:00Z',
    status: 'Approved',
    verificationUrl: 'http://localhost:5173/verify/WTC-QA-2026-00124'
  },
  {
    id: 'WTC-QA-2026-00089',
    certificateId: 'WTC-QA-2026-00089',
    batchId: 'WT-RJ-2026-00089',
    inspectorId: 'QA-02',
    inspectorName: 'Rakesh Verma',
    grade: 'A',
    overallScore: 91,
    fiberDiameter: 28.5,
    yield: '76%',
    cleanliness: 94,
    moisture: 11,
    tensileStrength: '42 N/ktex',
    vegetableMatter: '0.8%',
    farmerName: 'Baldev Singh',
    origin: 'Bikaner, Rajasthan',
    quantity: 650,
    woolType: 'Chokla Fine Carpet Wool',
    issuedAt: '2026-08-03T14:30:00Z',
    status: 'Approved',
    verificationUrl: 'http://localhost:5173/verify/WTC-QA-2026-00089'
  },
  {
    id: 'WTC-QA-2026-00045',
    certificateId: 'WTC-QA-2026-00045',
    batchId: 'WT-HP-2026-00045',
    inspectorId: 'QA-03',
    inspectorName: 'State Inspector Verma',
    grade: 'A+',
    overallScore: 96,
    fiberDiameter: 22.1,
    yield: '82%',
    cleanliness: 97,
    moisture: 10,
    tensileStrength: '45 N/ktex',
    vegetableMatter: '0.4%',
    farmerName: 'Sunil Thakur',
    origin: 'Kullu, Himachal Pradesh',
    quantity: 210,
    woolType: 'Gaddi Natural White Fleece',
    issuedAt: '2026-07-22T13:00:00Z',
    status: 'Approved',
    verificationUrl: 'http://localhost:5173/verify/WTC-QA-2026-00045'
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
    tensileStrength: '32 N/ktex',
    vegetableMatter: '2.1%',
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 320,
    woolType: 'Medium Crossbred Wool',
    issuedAt: '2026-08-14T15:00:00Z',
    status: 'Approved',
    verificationUrl: 'http://localhost:5173/verify/WTC-QA-2026-00130'
  },
  {
    id: 'WTC-QA-2026-00112',
    certificateId: 'WTC-QA-2026-00112',
    batchId: 'WT-RJ-2026-00112',
    inspectorId: 'QA-02',
    inspectorName: 'QA Officer Sharma',
    grade: 'A',
    overallScore: 89,
    fiberDiameter: 32.4,
    yield: '79%',
    cleanliness: 91,
    moisture: 11,
    tensileStrength: '40 N/ktex',
    vegetableMatter: '1.0%',
    farmerName: 'Hanumanaram Jat',
    origin: 'Nagaur, Rajasthan',
    quantity: 820,
    woolType: 'Magra Carpet Wool (Lustrous)',
    issuedAt: '2026-08-13T16:00:00Z',
    status: 'Approved',
    verificationUrl: 'http://localhost:5173/verify/WTC-QA-2026-00112'
  }
];

// ── Warehouses ─────────────────────────────────────────────────────────────
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
    storagePrice: 4.5,
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
    description: 'Premier regional storage facility equipped with state-of-the-art climate controls, ISO-certified fire suppression, and automated pallet racking.'
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
  },
  {
    id: 'WH-05',
    name: 'Himalayan Artisans Wool Depot',
    location: 'Bhuntar Logistics Park, Kullu, Himachal Pradesh',
    city: 'Kullu',
    state: 'Himachal Pradesh',
    distance: '85 km',
    lat: 31.9579,
    lng: 77.1095,
    totalCapacity: 8000,
    occupiedCapacity: 4900,
    availableCapacity: 3100,
    storagePrice: 5.0,
    priceUnit: '₹5.0 / KG / month',
    rating: 4.9,
    reviewCount: 64,
    verified: true,
    governmentAccredited: true,
    contactPerson: 'Tenzin Norbu',
    phone: '+91 1902 265432',
    email: 'kullu.depot@himalayanwool.org',
    operatingHours: '8:00 AM – 7:00 PM',
    storageServices: [
      'Cedarwood Insect Repellent Storage',
      'Artisan Batch Segregation',
      'Natural Humidity Balance',
      'Handloom Sample Testing'
    ],
    description: 'High-altitude specialized facility preserving native Gaddi and Pashmina fibers for artisan weaving clusters.'
  },
  {
    id: 'WH-06',
    name: 'Northern India Wool & Yarn Terminal',
    location: 'Industrial Area A, Ludhiana, Punjab',
    city: 'Ludhiana',
    state: 'Punjab',
    distance: '210 km',
    lat: 30.9010,
    lng: 75.8573,
    totalCapacity: 35000,
    occupiedCapacity: 24500,
    availableCapacity: 10500,
    storagePrice: 4.2,
    priceUnit: '₹4.2 / KG / month',
    rating: 4.8,
    reviewCount: 188,
    verified: true,
    governmentAccredited: true,
    contactPerson: 'Jaswinder Singh',
    phone: '+91 161 289 9000',
    email: 'ludhiana.terminal@wooltrade.in',
    operatingHours: '24 / 7 Operations',
    storageServices: [
      'Mill-grade Automated Pallets',
      'High-speed Weighbridge',
      'Moisture Testing Lab',
      'Direct Railway Freight Siding'
    ],
    description: 'Major industrial warehousing hub supplying fine apparel wool directly to Ludhiana knitwear and worsted fabric mills.'
  }
];

// ── Storage Requests & Bookings ─────────────────────────────────────────────
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
  },
  {
    id: 'WREQ-2026-0085',
    batchId: 'WT-RJ-2026-00112',
    farmerId: 'FARMER-04',
    farmerName: 'Hanumanaram Jat',
    warehouseId: 'WH-04',
    warehouseName: 'Bikaner Wool Hub & Cold Storage',
    quantity: 820,
    woolType: 'Magra Carpet Wool (Lustrous)',
    grade: 'A',
    storageDuration: '6 Months',
    durationMonths: 6,
    startDate: '2026-08-18',
    storageType: 'High-Density Baled',
    estimatedCost: 17220,
    additionalMessage: 'High yield Magra wool for export carpet manufacturing.',
    status: 'Pending',
    createdAt: '2026-08-16T14:00:00Z'
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
  },
  {
    id: 'WB-2026-0038',
    bookingId: 'WB-2026-0038',
    batchId: 'WT-RJ-2026-00089',
    farmerId: 'FARMER-02',
    farmerName: 'Baldev Singh',
    warehouseId: 'WH-04',
    warehouseName: 'Bikaner Wool Hub & Cold Storage',
    quantity: 650,
    woolType: 'Chokla Fine Carpet Wool',
    grade: 'A',
    storageDuration: '4 Months',
    startDate: '2026-08-06',
    expiryDate: '2026-12-06',
    storageType: 'Climate-Controlled',
    monthlyCost: 2275,
    status: 'Active',
    checkInStatus: 'Checked-In',
    checkInDate: '2026-08-06T15:00:00Z',
    storageLocation: {
      zone: 'B',
      rack: 'R-04',
      section: '02',
      position: 'A'
    },
    createdAt: '2026-08-05T12:00:00Z'
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

// ── Processing Units Data ──────────────────────────────────────────────────
const INITIAL_PROCESSING_REQUESTS = [
  {
    id: 'PR-2026-00124',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    processingUnitId: 'PU-01',
    processingUnitName: 'WoolCraft Processing Centre',
    requestedOperations: ['Sorting', 'Spinning'],
    quantity: 428,
    woolType: 'Merino Cross Fleece',
    grade: 'A',
    qualityScore: 88,
    origin: 'Mandya, Karnataka',
    message: 'Please prioritise sorting first, then spinning to 2/32 worsted yarn.',
    priority: 'HIGH',
    status: 'ACCEPTED',
    createdAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-14T09:00:00Z'
  },
  {
    id: 'PR-2026-00089',
    batchId: 'WT-RJ-2026-00089',
    farmerId: 'FARMER-02',
    farmerName: 'Baldev Singh',
    processingUnitId: 'PU-02',
    processingUnitName: 'Bikaner Woolen Mill No. 3',
    requestedOperations: ['Washing', 'Carding', 'Spinning'],
    quantity: 650,
    woolType: 'Chokla Fine Carpet Wool',
    grade: 'A',
    qualityScore: 91,
    origin: 'Bikaner, Rajasthan',
    message: 'High-speed scouring and worsted carding required.',
    priority: 'NORMAL',
    status: 'IN_PROGRESS',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-15T11:00:00Z'
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
    notes: 'Standard sorting complete. 18 KG vegetable matter & tags removed.',
    createdAt: '2026-08-14T09:30:00Z'
  },
  {
    id: 'REC-2026-00002',
    batchId: 'WT-RJ-2026-00089',
    processingRequestId: 'PR-2026-00089',
    processingUnitId: 'PU-02',
    operatorName: 'Bikaner Woolen Mill No. 3',
    operation: 'Scouring & Washing',
    inputQuantity: 650,
    outputQuantity: 494,
    wasteQuantity: 156,
    outputBatchId: 'WT-RJ-2026-00089-P01',
    status: 'COMPLETED',
    startTime: '2026-08-15T08:00:00Z',
    completionTime: '2026-08-15T14:30:00Z',
    equipment: '5-Bowl Aqueous Scouring Train',
    notes: 'Grease content reduced from 14% to 0.4%. Clean white output.',
    createdAt: '2026-08-15T08:00:00Z'
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
        title: 'Premium Merino Cross Wool (Grade A)',
        description: 'Grade A inspected fleece, 72% clean yield, stored in Mysuru Warehouse.',
        quantity: 428,
        minPrice: 380,
        price: 425,
        unit: 'kg',
        status: 'Sold',
        createdAt: '2026-08-14T12:00:00Z'
      },
      {
        id: 'LST-002',
        batchId: 'WT-RJ-2026-00112',
        sellerId: 'FARMER-04',
        sellerName: 'Hanumanaram Jat',
        type: 'RAW_WOOL',
        title: 'Magra White Lustrous Carpet Fleece',
        description: '820 KG high tensile strength, ideal for premium tufted carpets and rugs.',
        quantity: 820,
        minPrice: 390,
        price: 415,
        unit: 'kg',
        status: 'Active',
        createdAt: '2026-08-16T11:00:00Z'
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
      },
      {
        id: 'ORD-2026-00388',
        batchId: 'WT-RJ-2026-00089',
        buyerId: 'BUYER-02',
        buyerName: 'Rajasthan Carpet Mills',
        sellerId: 'FARMER-02',
        sellerName: 'Baldev Singh',
        quantity: 650,
        pricePerKg: 395,
        totalAmount: 256750,
        paymentStatus: 'RELEASED',
        status: 'Delivered',
        createdAt: '2026-08-05T14:00:00Z'
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
      },
      {
        id: 'TRJ-9934',
        orderId: 'ORD-2026-00425',
        batchId: 'WT-KA-2026-00130',
        transporterName: 'Rapid Farm Logistics',
        vehicleNumber: 'KA-09-EA-8821',
        driverName: 'Suresh Kumar',
        pickup: 'Mandya Farm, Karnataka',
        dropoff: 'Mysuru Wool Storage Centre',
        status: 'In Transit',
        createdAt: '2026-08-15T10:00:00Z'
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

  // Sync state to local storage
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
    const batchId = batch.batchId || batch.id || `WT-KA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const formattedBatch = {
      ...batch,
      id: batchId,
      batchId: batchId,
      currentStage: batch.currentStage || 'FARM',
      currentStatus: batch.currentStatus || 'Harvested at Farm',
      currentLocation: batch.origin || 'Registered Farm, Karnataka',
      verificationUrl: `http://localhost:5173/track/${batchId}`,
      events: batch.events || [
        {
          id: `EVT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
                     new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          stage: 'FARM',
          title: 'Farm Shearing & Batch Registered',
          location: batch.origin || 'Registered Farm, Karnataka',
          status: 'Completed',
          actor: `${batch.farmerName || 'Farmer'} (Owner)`,
          description: `Batch #${batchId} created with ${batch.quantity} KG (${batch.woolType || 'Raw Wool'}). Digital Twin & QR Passport generated.`
        }
      ]
    };

    setBatches(prev => [formattedBatch, ...prev.filter(b => b.id !== formattedBatch.id)]);
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
      processingRequests, addProcessingRequest, updateProcessingRequest,
      processingRecords, addProcessingRecord, updateProcessingRecord
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
