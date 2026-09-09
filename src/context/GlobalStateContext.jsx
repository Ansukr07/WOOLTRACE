import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

const toNonNegativeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const normalizeBatchRecord = (batch = {}) => {
  const quantity = toNonNegativeNumber(batch.quantity);
  const originalQuantity = toNonNegativeNumber(batch.originalQuantity, quantity);
  const reservedQuantity = toNonNegativeNumber(batch.reservedQuantity);
  const soldQuantity = toNonNegativeNumber(batch.soldQuantity);
  const availableQuantity = toNonNegativeNumber(
    batch.availableQuantity,
    Math.max(0, originalQuantity - reservedQuantity - soldQuantity)
  );
  const batchId = batch.batchId || batch.id;

  return {
    ...batch,
    id: batchId || batch.id,
    batchId,
    quantity,
    originalQuantity,
    availableQuantity,
    reservedQuantity,
    soldQuantity,
    sheepCount: toNonNegativeNumber(batch.sheepCount),
    storageStatus: batch.storageStatus || (batch.currentStage === 'WAREHOUSE' ? 'Stored' : 'Not Stored'),
    storageLocation: batch.storageLocation,
    storageSince: batch.storageSince || null,
    currentStage: batch.currentStage || 'FARM',
    currentStatus: batch.currentStatus || batch.status || 'Harvested at Farm',
    currentLocation: batch.currentLocation || batch.origin || 'Registered Farm',
    qualityGrade: batch.qualityGrade || 'Pending QA',
    certificateStatus: batch.certificateStatus || 'Uninspected',
    certificateId: batch.certificateId || null,
    images: batch.images || [],
    shearingDate: batch.shearingDate || batch.harvestDate || batch.createdAt,
    createdAt: batch.createdAt || new Date().toISOString(),
    updatedAt: batch.updatedAt || batch.createdAt || new Date().toISOString()
  };
};

const getBatchRecordId = (batch = {}) => batch.batchId || batch.id;

const getBatchAvailableQuantity = (batch = {}) => {
  const fallbackQuantity = toNonNegativeNumber(batch.quantity);
  return toNonNegativeNumber(batch.availableQuantity, fallbackQuantity);
};

// ── Rich Seed Batches with Complete Farm-to-Fabric Traceability ────────────
const INITIAL_BATCHES = [
  {
    id: 'WT-PB-2026-00401',
    batchId: 'WT-PB-2026-00401',
    farmerId: 'FARMER-01',
    farmerName: 'Gurpreet Singh',
    origin: 'Khanna, Ludhiana, Punjab',
    quantity: 1200,
    unit: 'KG',
    cropId: 'WHEAT',
    cropName: 'Sharbati Wheat',
    woolType: 'Sharbati Wheat (Grade A)',
    variety: 'Sharbati Premium',
    harvestDate: '2026-08-15T08:00:00Z',
    createdAt: '2026-08-15T08:00:00Z',
    currentStage: 'WAREHOUSE',
    currentStatus: 'Stored in Dry Silo Zone A',
    currentLocation: 'Khanna Modern Agri Silo Hub',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00401',
    verificationUrl: 'http://localhost:5173/track/WT-PB-2026-00401',
    qualityAttributes: {
      moisture: '10.2%',
      protein: '13.4%',
      foreignMatter: '0.4%',
      grainLustre: 'Bold & Lustrous'
    },
    storageLocation: { zone: 'Silo-A', rack: 'B-04', section: '01', position: 'A' },
    warehouseId: 'WH-PB-01',
    warehouseName: 'Khanna Modern Agri Silo Hub',
    events: [
      {
        id: 'EVT-P01',
        timestamp: '15 Aug 2026 · 08:00 AM',
        stage: 'FARM',
        title: 'Farm Harvest & Batch Registered',
        location: 'Khanna Farm, Punjab',
        status: 'Completed',
        actor: 'Gurpreet Singh (Farmer)',
        description: 'Clean combine-harvested Sharbati wheat recorded. Initial weight 1,200 KG with 10.2% moisture.'
      },
      {
        id: 'EVT-P02',
        timestamp: '17 Aug 2026 · 10:30 AM',
        stage: 'QUALITY',
        title: 'Lab Quality Inspection & Certified',
        location: 'PAU Quality Assessment Lab #1',
        status: 'Completed',
        actor: 'Dr. Hardeep Gill (Quality Inspector)',
        description: 'Grain protein 13.4%, foreign matter <0.5%. Grade A Certificate #WTC-QA-2026-00401 issued.'
      },
      {
        id: 'EVT-P03',
        timestamp: '19 Aug 2026 · 03:00 PM',
        stage: 'WAREHOUSE',
        title: 'Warehouse Silo Check-In',
        location: 'Khanna Modern Agri Silo Hub',
        status: 'Active',
        actor: 'J. Sandhu (Warehouse Manager)',
        description: '1,200 KG received into fumigated climate-controlled silo storage.'
      }
    ]
  },
  {
    id: 'WT-KA-2026-00210',
    batchId: 'WT-KA-2026-00210',
    farmerId: 'FARMER-01',
    farmerName: 'Manjunath Reddy',
    origin: 'Kolar, Karnataka',
    quantity: 500,
    unit: 'KG',
    cropId: 'TOMATO',
    cropName: 'Hybrid Roma Tomato',
    woolType: 'Hybrid Roma Tomato (Grade A)',
    variety: 'Hybrid Roma',
    harvestDate: '2026-09-02T06:30:00Z',
    createdAt: '2026-09-02T06:30:00Z',
    currentStage: 'FARM',
    currentStatus: 'Ready for Immediate Market Dispatch',
    currentLocation: 'Kolar Farm Yard',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00210',
    verificationUrl: 'http://localhost:5173/track/WT-KA-2026-00210',
    qualityAttributes: {
      firmness: 'Firm (Breaker Stage)',
      damage: '< 1.2%',
      size: 'Large (60mm+)'
    },
    storageLocation: { zone: 'Cold-A', rack: 'C-02', section: '01', position: 'A' },
    warehouseId: 'WH-KA-02',
    warehouseName: 'Kolar Cold Chain Terminal',
    events: [
      {
        id: 'EVT-T01',
        timestamp: '02 Sep 2026 · 06:30 AM',
        stage: 'FARM',
        title: 'Morning Harvest & Crate Grading',
        location: 'Kolar Farm, Karnataka',
        status: 'Completed',
        actor: 'Manjunath Reddy (Farmer)',
        description: '500 KG handpicked at breaker stage into 20 ventilated plastic crates.'
      }
    ]
  },
  {
    id: 'WT-MH-2026-00305',
    batchId: 'WT-MH-2026-00305',
    farmerId: 'FARMER-01',
    farmerName: 'Shivaji Rao',
    origin: 'Lasalgaon, Nashik, Maharashtra',
    quantity: 850,
    unit: 'KG',
    cropId: 'ONION',
    cropName: 'Nashik Red Onion',
    woolType: 'Nashik Red Onion (Grade A)',
    variety: 'Garwa Rabi Onion',
    harvestDate: '2026-08-20T09:00:00Z',
    createdAt: '2026-08-20T09:00:00Z',
    currentStage: 'WAREHOUSE',
    currentStatus: 'Stored in Ventilated Storage',
    currentLocation: 'Lasalgaon APMC Storage Centre',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00305',
    verificationUrl: 'http://localhost:5173/track/WT-MH-2026-00305',
    qualityAttributes: {
      bulbSize: 'Large (55mm+)',
      curing: 'Well-Cured 3-Layer Skin',
      sprouting: '0%'
    },
    storageLocation: { zone: 'Chawl-B', rack: 'R-08', section: '03', position: 'A' },
    warehouseId: 'WH-MH-01',
    warehouseName: 'Lasalgaon APMC Storage Centre',
    events: [
      {
        id: 'EVT-O01',
        timestamp: '20 Aug 2026 · 09:00 AM',
        stage: 'FARM',
        title: 'Cured Onion Harvest Registered',
        location: 'Lasalgaon, Nashik',
        status: 'Completed',
        actor: 'Shivaji Rao (Farmer)',
        description: '850 KG dry cured onion harvested. Zero rot detected.'
      }
    ]
  },
  {
    id: 'WT-KA-2026-00124',
    batchId: 'WT-KA-2026-00124',
    farmerId: 'FARMER-01',
    farmerName: 'Rajesh Gowda',
    origin: 'Mandya, Karnataka',
    quantity: 428,
    unit: 'KG',
    cropId: 'WOOL',
    cropName: 'Merino Cross Wool',
    woolType: 'Merino Cross Fleece',
    variety: 'Merino Cross',
    shearingDate: '2026-08-10T08:30:00Z',
    createdAt: '2026-08-10T08:30:00Z',
    currentStage: 'WAREHOUSE',
    currentStatus: 'Stored in Zone A',
    currentLocation: 'Mysuru Wool Storage Centre',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00124',
    verificationUrl: 'http://localhost:5173/track/WT-KA-2026-00124',
    storageLocation: { zone: 'A', rack: 'R-12', section: '04', position: 'B' },
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
        description: 'Batch shorn from 32 healthy sheep. Initial gross weight 428 KG recorded.'
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
    unit: 'KG',
    cropId: 'WOOL',
    cropName: 'Chokla Carpet Wool',
    woolType: 'Chokla Fine Carpet Wool',
    variety: 'Chokla Carpet',
    shearingDate: '2026-08-01T09:00:00Z',
    createdAt: '2026-08-01T09:00:00Z',
    currentStage: 'PROCESSING',
    currentStatus: 'Scouring & Carding',
    currentLocation: 'Bikaner Woolen Mill No. 3',
    qualityGrade: 'A',
    certificateStatus: 'Certified',
    certificateId: 'WTC-QA-2026-00089',
    verificationUrl: 'http://localhost:5173/track/WT-RJ-2026-00089',
    storageLocation: { zone: 'B', rack: 'R-04', section: '02', position: 'A' },
    warehouseId: 'WH-04',
    warehouseName: 'Bikaner Wool Hub',
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
    operatingHours: '6:00 AM - 9:00 PM (Daily)',
    storageServices: [
      'Climate-Controlled Zones (18-22°C)',
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
    operatingHours: '7:00 AM - 10:00 PM',
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
    operatingHours: '8:00 AM - 7:00 PM',
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
    id: 'DEMAND-2026-001',
    buyerId: 'BUYER-01',
    buyerName: 'Shree Roller Flour & Agro Mills Ltd.',
    buyerType: 'Roller Flour Miller',
    cropId: 'WHEAT',
    cropName: 'Sharbati / Durum Wheat',
    woolType: 'Sharbati / Durum Wheat',
    requiredGrade: 'A',
    quantityRequired: 15000,
    minQuantity: 1000,
    maxQuantity: 20000,
    fulfilledQuantity: 4200,
    minPrice: 30.0,
    maxPrice: 32.5,
    budgetPrice: 32.0,
    location: 'Khanna / Ludhiana Industrial Belt, Punjab',
    deliveryWindowDays: 12,
    escrowEnabled: true,
    verificationStatus: 'CORPORATE_VERIFIED',
    qualityRequirements: 'Moisture < 11%, Protein > 12.5%, Cleaned Grain',
    paymentTerms: '100% Escrow Vault Settlement on Delivery Inspection'
  },
  {
    id: 'DEMAND-2026-002',
    buyerId: 'BUYER-02',
    buyerName: 'Kisan Fresh Puree & Agro Processing Co.',
    buyerType: 'Food & Beverage Processor',
    cropId: 'TOMATO',
    cropName: 'Hybrid Roma Tomato',
    woolType: 'Hybrid Roma Tomato',
    requiredGrade: 'A',
    quantityRequired: 6000,
    minQuantity: 400,
    maxQuantity: 8000,
    fulfilledQuantity: 1800,
    minPrice: 35.0,
    maxPrice: 38.5,
    budgetPrice: 37.5,
    location: 'Kolar Agro Processing Zone, Karnataka',
    deliveryWindowDays: 4,
    escrowEnabled: true,
    verificationStatus: 'CORPORATE_VERIFIED',
    qualityRequirements: 'Breaker stage firmness, <2% blemish, high pulp density',
    paymentTerms: 'Direct Escrow Release within 24 hours of gate arrival'
  },
  {
    id: 'DEMAND-2026-003',
    buyerId: 'BUYER-03',
    buyerName: 'Bharat Agri Export Consortium',
    buyerType: 'Global Agricultural Exporter',
    cropId: 'ONION',
    cropName: 'Nashik Red Onion',
    woolType: 'Nashik Red Onion',
    requiredGrade: 'A',
    quantityRequired: 12000,
    minQuantity: 800,
    maxQuantity: 15000,
    fulfilledQuantity: 3500,
    minPrice: 25.5,
    maxPrice: 28.0,
    budgetPrice: 27.5,
    location: 'Lasalgaon / JNPT Port Hub, Maharashtra',
    deliveryWindowDays: 14,
    escrowEnabled: true,
    verificationStatus: 'EXPORT_LICENSED',
    qualityRequirements: '55mm+ bulb size, well-cured 3-layer skin, 0% sprout',
    paymentTerms: 'Advance 30% Escrow + Balance upon Port Inspection'
  },
  {
    id: 'DEMAND-2026-004',
    buyerId: 'BUYER-04',
    buyerName: 'Gujarat Cotton & Ginning Apex Co-op',
    buyerType: 'Textile & Ginning Corporation',
    cropId: 'COTTON',
    cropName: 'Shankar-6 Raw Cotton',
    woolType: 'Shankar-6 Raw Cotton',
    requiredGrade: 'A',
    quantityRequired: 25000,
    minQuantity: 2000,
    maxQuantity: 30000,
    fulfilledQuantity: 8000,
    minPrice: 69.0,
    maxPrice: 74.0,
    budgetPrice: 72.5,
    location: 'Rajkot Cotton Exchange, Gujarat',
    deliveryWindowDays: 15,
    escrowEnabled: true,
    verificationStatus: 'APEX_COOPERATIVE',
    qualityRequirements: 'Staple length >30mm, Mic 3.8-4.2, Trash <3%',
    paymentTerms: 'Digital Escrow Vault'
  },
  {
    id: 'DEMAND-2026-005',
    buyerId: 'BUYER-05',
    buyerName: 'Himalayan Apex Apple Marketing Federation',
    buyerType: 'Horticultural Co-operative',
    cropId: 'APPLE',
    cropName: 'Royal Delicious Apple',
    woolType: 'Royal Delicious Apple',
    requiredGrade: 'A+',
    quantityRequired: 8000,
    minQuantity: 300,
    maxQuantity: 10000,
    fulfilledQuantity: 2200,
    minPrice: 118.0,
    maxPrice: 130.0,
    budgetPrice: 125.0,
    location: 'Shimla Dhalli Market Hub, Himachal Pradesh',
    deliveryWindowDays: 7,
    escrowEnabled: true,
    verificationStatus: 'STATE_FEDERATION',
    qualityRequirements: '85%+ red color, 75-80mm caliber, flawless skin',
    paymentTerms: 'Instant Escrow Settlement on CA Cold Store Delivery'
  },
  {
    id: 'DEMAND-2026-006',
    buyerId: 'BUYER-06',
    buyerName: 'WoolCraft Worsted Mills Ltd.',
    buyerType: 'Worsted Spinning Mill',
    cropId: 'WOOL',
    cropName: 'Merino Fleece Wool',
    woolType: 'Merino Fleece Wool',
    requiredGrade: 'A',
    quantityRequired: 5000,
    minQuantity: 200,
    maxQuantity: 6000,
    fulfilledQuantity: 1800,
    minPrice: 450.0,
    maxPrice: 485.0,
    budgetPrice: 475.0,
    location: 'Bikaner Industrial Area, Rajasthan',
    deliveryWindowDays: 10,
    escrowEnabled: true,
    verificationStatus: 'CORPORATE_VERIFIED',
    qualityRequirements: 'Micron <21.5 µm, VM <1.5%, Yield >70%',
    paymentTerms: 'Escrow Secured Settlement'
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

const SIH_INITIAL_LOTS = [
  {
    id: 'LOT-2026-WHT-014', lotNumber: 'LOT-KOTA-WHT-014', sellerId: 'FARMER-01', sellerName: 'Rajesh Gowda', sellerType: 'FARMER',
    cropId: 'WHEAT', cropName: 'Wheat — Sharbati', woolType: 'Wheat — Sharbati', qualityGrade: 'A', totalQuantity: 1200,
    availableQuantity: 1200, askingPrice: 29.5, minAcceptablePrice: 28.8, certificateId: 'QA-KS-WHT-014',
    traceabilityUrl: '/track/LOT-KOTA-WHT-014', status: 'OFFER_RECEIVED', isFpoAggregate: false
  },
  {
    id: 'LOT-2026-FPO-028', lotNumber: 'LOT-FPO-KOTA-028', sellerId: 'FPO-KOTA-01', sellerName: 'Kota Growers FPO', sellerType: 'FPO',
    cropId: 'MUSTARD', cropName: 'Mustard — Grade A', woolType: 'Mustard — Grade A', qualityGrade: 'A', totalQuantity: 4800,
    availableQuantity: 4800, askingPrice: 59, minAcceptablePrice: 57.5, certificateId: 'QA-KS-MUS-028',
    traceabilityUrl: '/track/LOT-FPO-KOTA-028', status: 'AVAILABLE', isFpoAggregate: true
  }
];

const SIH_INITIAL_OFFERS = [
  {
    id: 'OFF-2026-WHT-018', offerNumber: 'OFF-2026-WHT-018', lotId: 'LOT-2026-WHT-014', lotNumber: 'LOT-KOTA-WHT-014',
    sellerId: 'FARMER-01', sellerName: 'Rajesh Gowda', buyerId: 'BUYER-FOOD-01', buyerName: 'Shree Foods Pvt. Ltd.', buyerType: 'PROCESSOR',
    woolType: 'Wheat — Sharbati', qualityGrade: 'A', offeredPricePerKg: 30.2, quantityKg: 1200, totalGrossAmount: 36240,
    paymentTerms: '100% UPI / bank escrow on pickup confirmation', deliveryTerms: 'Collection from Kota storage hub', status: 'PENDING',
    validUntil: '2026-09-15T18:00:00Z', history: [], createdAt: '2026-09-09T09:00:00Z'
  }
];

const SIH_INITIAL_TRANSACTIONS = [
  {
    id: 'TXN-2026-MUS-011', transactionNumber: 'TXN-2026-MUS-011', offerId: 'OFF-2026-MUS-009', lotId: 'LOT-2026-FPO-028',
    lotNumber: 'LOT-FPO-KOTA-028', batchId: 'BATCH-MUS-028', farmerId: 'FPO-KOTA-01', farmerName: 'Kota Growers FPO',
    buyerId: 'BUYER-OIL-02', buyerName: 'Rajasthan Oil Mills', woolType: 'Mustard — Grade A', qualityGrade: 'A', quantityKg: 3000,
    agreedPricePerKg: 60.5, grossValue: 181500, transportCost: 5400, storageCost: 1200, transactionFee: 1815,
    netRealization: 173085, netRealizationPerKg: 57.7, deliveryStatus: 'IN_TRANSIT', paymentStatus: 'IN_ESCROW',
    paidAmount: 181500, outstandingAmount: 0, disputeStatus: 'NONE', transactionDate: '2026-09-08T10:00:00Z', expectedDeliveryDate: '2026-09-11',
    notes: 'FPO aggregation with transport and payment milestones recorded.'
  }
];

const SIH_INITIAL_DISPUTES = [
  {
    id: 'DISP-2026-TOM-004', transactionId: 'TXN-2026-TOM-004', lotNumber: 'LOT-NASHIK-TOM-004', raisedBy: 'BUYER',
    raisedByName: 'FreshRoute Retail', reasonCategory: 'Quality grading variance', description: 'Arrival grade needs a joint review against the digital quality record.',
    claimedAmount: 3200, status: 'UNDER_REVIEW', resolutionNote: '', createdAt: '2026-09-08T12:30:00Z'
  }
];

const isLegacyWoolRecord = (record = {}) => /wool|fleece|sheep|weaver/i.test(`${record.woolType || ''} ${record.cropName || ''} ${record.buyerName || ''} ${record.sellerName || ''}`);
const loadSihMarketRecords = (key, fallback) => {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    const clean = Array.isArray(stored) ? stored.filter(record => !isLegacyWoolRecord(record)) : [];
    return clean.length ? clean : fallback;
  } catch (_error) {
    return fallback;
  }
};

export const GlobalStateProvider = ({ children }) => {
  const [batches, setBatches] = useState(() => {
    const stored = localStorage.getItem('wt_batches_v2');
    const list = stored ? JSON.parse(stored) : INITIAL_BATCHES;
    return list.map(normalizeBatchRecord);
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
    const quantity = toNonNegativeNumber(batch.quantity);
    const formattedBatch = normalizeBatchRecord({
      ...batch,
      id: batchId,
      batchId: batchId,
      quantity,
      originalQuantity: batch.originalQuantity ?? quantity,
      availableQuantity: batch.availableQuantity ?? quantity,
      reservedQuantity: batch.reservedQuantity ?? 0,
      soldQuantity: batch.soldQuantity ?? 0,
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
    });

    setBatches(prev => [formattedBatch, ...prev.filter(b => b.id !== formattedBatch.id)]);
    return formattedBatch;
  };

  const updateBatch = (id, updates) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== id && b.batchId !== id) return b;
      const nextUpdates = { ...updates };
      if (updates.quantity !== undefined && updates.availableQuantity === undefined) {
        nextUpdates.availableQuantity = toNonNegativeNumber(updates.quantity);
      }
      return normalizeBatchRecord({ ...b, ...nextUpdates, updatedAt: new Date().toISOString() });
    }));
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
      warehouseName: warehouse.name,
      storageStatus: 'Stored',
      storageSince: new Date().toISOString()
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
      storageStatus: 'Stored',
      storageSince: new Date().toISOString(),
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

  
  // ── Market Linkage & Price Discovery State (SIH 2026 PS 26132) ──────────
  const [woolLots, setWoolLots] = useState(() => {
    return loadSihMarketRecords('wt_wool_lots_v1', SIH_INITIAL_LOTS);
  });

  const [buyerDemands, setBuyerDemands] = useState(() => {
    return loadSihMarketRecords('wt_buyer_demands_v1', INITIAL_BUYER_DEMANDS.filter(demand => demand.cropId !== 'WOOL'));
  });

  const [marketOffers, setMarketOffers] = useState(() => {
    return loadSihMarketRecords('wt_market_offers_v1', SIH_INITIAL_OFFERS);
  });

  const [marketTransactions, setMarketTransactions] = useState(() => {
    return loadSihMarketRecords('wt_market_transactions_v1', SIH_INITIAL_TRANSACTIONS);
  });

  const [disputes, setDisputes] = useState(() => {
    return loadSihMarketRecords('wt_disputes_v1', SIH_INITIAL_DISPUTES);
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
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const linkedBatches = Array.isArray(lotData.batchIds)
      ? batches.filter(batch => lotData.batchIds.includes(getBatchRecordId(batch)))
      : [];
    const primaryBatch = linkedBatches[0];
    const listedQuantity = toNonNegativeNumber(
      lotData.totalQuantity ?? lotData.quantity,
      primaryBatch ? getBatchAvailableQuantity(primaryBatch) : 0
    );
    const newLot = {
      id: 'LOT-2026-' + randomId,
      lotNumber: 'LOT-2026-' + randomId,
      status: 'AVAILABLE',
      createdAt: new Date().toISOString(),
      verified: true,
      ...(primaryBatch ? {
        batchIds: [getBatchRecordId(primaryBatch)],
        sellerId: primaryBatch.farmerId,
        sellerName: primaryBatch.farmerName,
        sellerType: 'FARMER',
        cropId: primaryBatch.cropId,
        cropName: primaryBatch.cropName,
        woolType: primaryBatch.woolType || primaryBatch.variety || primaryBatch.cropName,
        variety: primaryBatch.variety || primaryBatch.woolType || primaryBatch.cropName,
        origin: primaryBatch.origin,
        currentLocation: primaryBatch.currentLocation || primaryBatch.storageLocation || primaryBatch.origin,
        qualityGrade: primaryBatch.qualityGrade,
        certificateId: primaryBatch.certificateId,
        traceabilityUrl: '/track/' + getBatchRecordId(primaryBatch)
      } : {}),
      ...lotData,
      totalQuantity: listedQuantity,
      availableQuantity: lotData.availableQuantity !== undefined
        ? toNonNegativeNumber(lotData.availableQuantity)
        : listedQuantity
    };

    setWoolLots(prev => [newLot, ...prev]);

    // Append digital trace event to linked batch
    if (newLot.batchIds && newLot.batchIds.length > 0) {
      newLot.batchIds.forEach(batchId => {
        addTraceEvent(batchId, {
          stage: 'MARKET',
          title: 'Wool Lot Created & Listed for Discovery',
          location: newLot.currentLocation || 'WoolTrace Market Exchange',
          status: 'Active',
          actor: (newLot.sellerName || 'Farmer') + ' (Seller)',
          description: 'Created Lot #' + newLot.lotNumber + ' (' + newLot.totalQuantity + ' KG, Asking ₹' + newLot.askingPrice + '/KG). Verified quality attached.'
        });
      });
    }

    return newLot;
  };

  const aggregateFpoLot = (batchIds, fpoData) => {
    const linkedBatches = batches.filter(b => batchIds.includes(b.id || b.batchId));
    const totalQty = linkedBatches.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const fpoLot = {
      id: 'LOT-FPO-' + randomId,
      lotNumber: 'LOT-FPO-' + randomId,
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
      traceabilityUrl: '/track/' + (linkedBatches[0]?.id || 'FPO-AGG'),
      status: 'AVAILABLE',
      availableFrom: new Date().toISOString().split('T')[0],
      verified: true,
      inspectionStatus: 'Multi-Batch FPO Verified',
      description: fpoData.description || ('Consolidated FPO bulk lot aggregated from ' + linkedBatches.length + ' verified farmer batches for institutional & mill procurement.'),
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
        description: 'Consolidated into Bulk Lot #' + fpoLot.lotNumber + ' (Combined volume ' + totalQty + ' KG). Ready for bulk buyer discovery.'
      });
    });

    return fpoLot;
  };

  const submitOffer = (offerData) => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newOffer = {
      id: 'OFF-2026-' + randomId,
      offerNumber: 'OFF-2026-' + randomId,
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
            note: payload.note || ('Counter-offer submitted at ₹' + counterPrice + '/KG.'),
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
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const newTxn = {
      id: 'TXN-2026-' + randomId,
      transactionNumber: 'TXN-2026-' + randomId,
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
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const newDispute = {
      id: 'DISP-2026-' + randomId,
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
    const randomId = Math.floor(10 + Math.random() * 90);
    const newDemand = {
      id: 'BD-2026-' + randomId,
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
      processingRecords, addProcessingRecord, updateProcessingRecord,
      // Market Linkages & Price Discovery
      woolLots, createWoolLot, aggregateFpoLot,
      buyerDemands, publishBuyerDemand,
      marketOffers, submitOffer, respondOffer,
      marketTransactions, createTransactionFromOffer, updateTransactionPayment, updateTransactionDelivery,
      disputes, raiseTransactionDispute, resolveDispute
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
