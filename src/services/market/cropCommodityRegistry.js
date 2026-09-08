/**
 * Crop & Commodity Registry for SIH 2026 PS 26132
 * Multi-Commodity Registry supporting Cereals, Pulses, Oilseeds, Vegetables, Fruits, Cash Crops & Fiber.
 */

export const COMMODITY_CATEGORIES = [
  { id: 'ALL', label: 'All Commodities' },
  { id: 'CEREAL', label: 'Cereals & Grains' },
  { id: 'PULSE', label: 'Pulses & Legumes' },
  { id: 'OILSEED', label: 'Oilseeds' },
  { id: 'VEGETABLE', label: 'Vegetables' },
  { id: 'FRUIT', label: 'Fruits & Horticulture' },
  { id: 'COMMERCIAL', label: 'Cash & Commercial' },
  { id: 'FIBER', label: 'Fiber & Wool' }
];

export const COMMODITIES = [
  {
    id: 'WHEAT',
    name: 'Wheat (गेहूं)',
    category: 'CEREAL',
    hindiName: 'गेहूं',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Tonne', 'Bag (50kg)'],
    basePricePerKg: 28.5,
    mandiPricePerKg: 27.8,
    processorQuotePerKg: 30.5,
    institutionalQuotePerKg: 31.8,
    priceChange30d: 4.2,
    demandLevel: 'HIGH',
    demandVolumeKg: 24500,
    supplyVolumeKg: 14200,
    varieties: ['Sharbati', 'Durum', 'Lokwan', 'Kalyan Sona', 'Desi Local'],
    qualitySchema: [
      { key: 'moisture', label: 'Moisture Content', type: 'select', options: ['< 10% (Excellent)', '10 - 12% (Standard)', '> 12% (High)'] },
      { key: 'protein', label: 'Protein Content', type: 'select', options: ['> 13% (High Grade)', '11 - 13% (Standard)', '< 11% (Commercial)'] },
      { key: 'foreignMatter', label: 'Foreign Matter / Dust', type: 'select', options: ['< 0.5% (Cleaned)', '0.5 - 1.5% (Fair)', '> 1.5% (Raw)'] },
      { key: 'grainQuality', label: 'Grain Lustre & Boldness', type: 'select', options: ['Grade A (Bold & Lustrous)', 'Grade B (Medium)', 'Grade C (Standard)'] }
    ],
    storageCharacteristics: {
      type: 'Dry Silo / Ventilated Warehouse',
      monthlyRatePerKg: 0.8,
      shelfLifeDays: 365,
      tempGuideline: '15 - 25°C, Dry',
      lossRisk: 'Low (with fumigation)'
    },
    processingStages: ['CLEANING', 'GRADING', 'MILLING_FLOUR', 'PACKAGING'],
    description: 'High demand from roller flour mills, biscuit manufacturers, and FCI central pool procurement.'
  },
  {
    id: 'RICE',
    name: 'Paddy / Basmati Rice (धान / चावल)',
    category: 'CEREAL',
    hindiName: 'चावल / धान',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Tonne', 'Bag (50kg)'],
    basePricePerKg: 42.0,
    mandiPricePerKg: 39.5,
    processorQuotePerKg: 44.5,
    institutionalQuotePerKg: 46.0,
    priceChange30d: 5.8,
    demandLevel: 'HIGH',
    demandVolumeKg: 19800,
    supplyVolumeKg: 9500,
    varieties: ['Basmati 1121', 'Pusa Basmati', 'Sona Masoori', 'Kolam', 'Ponni'],
    qualitySchema: [
      { key: 'grainLength', label: 'Average Grain Length', type: 'select', options: ['Extra Long (8.2mm+)', 'Long (7.0 - 8.2mm)', 'Medium (6.0 - 7.0mm)'] },
      { key: 'brokenPercentage', label: 'Broken Grain %', type: 'select', options: ['< 2% (Super Export)', '2 - 5% (Grade A)', '> 5% (Domestic Standard)'] },
      { key: 'moisture', label: 'Moisture baseline', type: 'select', options: ['12 - 14% (Optimal)', '< 12% (Dry)', '> 14% (Needs drying)'] },
      { key: 'millingQuality', label: 'Milling Yield', type: 'select', options: ['Grade A (68%+ Recovery)', 'Grade B (62 - 68%)', 'Grade C (< 62%)'] }
    ],
    storageCharacteristics: {
      type: 'Modern Grain Warehouse / Silo',
      monthlyRatePerKg: 0.9,
      shelfLifeDays: 360,
      tempGuideline: '18 - 22°C',
      lossRisk: 'Low'
    },
    processingStages: ['CLEANING', 'DEHUSKING', 'POLISHING', 'GRADING', 'PACKING'],
    description: 'Strong export demand to Middle East and European retail markets with premium for GI-tagged varieties.'
  },
  {
    id: 'TOMATO',
    name: 'Tomato (टमाटर)',
    category: 'VEGETABLE',
    hindiName: 'टमाटर',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Crate (25kg)', 'Quintal'],
    basePricePerKg: 34.0,
    mandiPricePerKg: 31.0,
    processorQuotePerKg: 36.5,
    institutionalQuotePerKg: 38.0,
    priceChange30d: -1.2,
    demandLevel: 'MODERATE',
    demandVolumeKg: 8500,
    supplyVolumeKg: 8200,
    varieties: ['Hybrid Roma', 'Pusa Ruby', 'Desi Local', 'Avinash-2', 'Himsona'],
    qualitySchema: [
      { key: 'firmness', label: 'Firmness & Ripeness', type: 'select', options: ['Breaker / Turning (Firm for transport)', 'Firm Red (Immediate consumption)', 'Over-ripe (Processing only)'] },
      { key: 'damage', label: 'Defects / Blemish %', type: 'select', options: ['< 2% (Grade A Retail)', '2 - 5% (Grade B)', '> 5% (Puree Processing)'] },
      { key: 'size', label: 'Fruit Diameter', type: 'select', options: ['Large (60mm+)', 'Medium (45 - 60mm)', 'Small (< 45mm)'] }
    ],
    storageCharacteristics: {
      type: 'Climate-Controlled Cold Storage',
      monthlyRatePerKg: 2.5,
      shelfLifeDays: 21,
      tempGuideline: '10 - 12°C, 85% RH',
      lossRisk: 'High if uncooled'
    },
    processingStages: ['SORTING', 'GRADING', 'PACKING_CRATES', 'COLD_CHAIN_DISPATCH'],
    description: 'High velocity commercial vegetable with direct institutional demand from quick-commerce and ketchup processors.'
  },
  {
    id: 'ONION',
    name: 'Onion (प्याज)',
    category: 'VEGETABLE',
    hindiName: 'प्याज',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Bag (50kg)', 'Quintal'],
    basePricePerKg: 24.5,
    mandiPricePerKg: 22.8,
    processorQuotePerKg: 26.0,
    institutionalQuotePerKg: 27.5,
    priceChange30d: 3.4,
    demandLevel: 'HIGH',
    demandVolumeKg: 16500,
    supplyVolumeKg: 11000,
    varieties: ['Nashik Red', 'Garwa (Rabi)', 'Pol (Kharif)', 'White Onion', 'Bellary Red'],
    qualitySchema: [
      { key: 'bulbSize', label: 'Bulb Caliber / Size', type: 'select', options: ['Large (55mm+)', 'Medium (45 - 55mm)', 'Small Golta (35 - 45mm)'] },
      { key: 'curing', label: 'Skin Curing & Dryness', type: 'select', options: ['Well-Cured 3-layer skin', 'Standard Cured', 'Fresh Harvest (Needs curing)'] },
      { key: 'sprouting', label: 'Sprouting & Rot %', type: 'select', options: ['0% (Export Grade)', '< 2% (Mandi Grade A)', '> 2% (Immediate sale)'] }
    ],
    storageCharacteristics: {
      type: 'Ventilated Chawl / Cold Storage',
      monthlyRatePerKg: 1.4,
      shelfLifeDays: 120,
      tempGuideline: 'Well ventilated, low humidity',
      lossRisk: 'Moderate (weight shrinkage)'
    },
    processingStages: ['SORTING', 'CLEANING_ROOTS', 'GRADING', 'MESH_BAG_PACKING'],
    description: 'Steady demand across tier-1 wholesale mandis and dehydrated onion processing plants in Gujarat/Maharashtra.'
  },
  {
    id: 'MUSTARD',
    name: 'Mustard / Rapeseed (सरसों)',
    category: 'OILSEED',
    hindiName: 'सरसों',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Bag (50kg)'],
    basePricePerKg: 58.0,
    mandiPricePerKg: 55.5,
    processorQuotePerKg: 61.0,
    institutionalQuotePerKg: 63.0,
    priceChange30d: 6.5,
    demandLevel: 'HIGH',
    demandVolumeKg: 14200,
    supplyVolumeKg: 7800,
    varieties: ['Pusa Bold', 'Giriraj (DRMRIJ-31)', 'RH-749', 'Yellow Mustard', 'Kranti'],
    qualitySchema: [
      { key: 'oilContent', label: 'Oil Content %', type: 'select', options: ['High Oil (> 41%)', 'Standard Oil (38 - 41%)', 'Commercial (< 38%)'] },
      { key: 'moisture', label: 'Moisture %', type: 'select', options: ['< 8% (Optimal)', '8 - 10% (Acceptable)', '> 10% (Needs drying)'] },
      { key: 'foreignMatter', label: 'Impurities / Foreign Seeds', type: 'select', options: ['< 1% (Grade A)', '1 - 2% (Grade B)', '> 2% (Grade C)'] }
    ],
    storageCharacteristics: {
      type: 'Dry Storage Warehouse',
      monthlyRatePerKg: 1.1,
      shelfLifeDays: 240,
      tempGuideline: 'Cool and dry',
      lossRisk: 'Low'
    },
    processingStages: ['CLEANING', 'OIL_EXPELLER_CRUSHING', 'CAKE_EXTRACTION', 'PACKAGING'],
    description: 'Heavy procurement by solvent extractors and mustard oil mills in Rajasthan, Haryana, and MP.'
  },
  {
    id: 'COTTON',
    name: 'Raw Cotton (कपास)',
    category: 'COMMERCIAL',
    hindiName: 'कपास',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Bale (170kg)'],
    basePricePerKg: 68.0,
    mandiPricePerKg: 64.5,
    processorQuotePerKg: 71.0,
    institutionalQuotePerKg: 73.5,
    priceChange30d: 4.8,
    demandLevel: 'HIGH',
    demandVolumeKg: 28000,
    supplyVolumeKg: 16000,
    varieties: ['Shankar-6', 'DCH-32', 'Bunny Bt', 'MCU-5', 'Suvin ELS'],
    qualitySchema: [
      { key: 'stapleLength', label: 'Staple Fiber Length', type: 'select', options: ['Extra Long (32mm+)', 'Long Staple (28 - 32mm)', 'Medium (24 - 28mm)'] },
      { key: 'micValue', label: 'Micronaire (Fineness)', type: 'select', options: ['3.8 - 4.2 (Premium)', '3.5 - 4.5 (Standard)', '< 3.5 or > 4.5 (Coarse)'] },
      { key: 'trashPercent', label: 'Trash / Leaf Content %', type: 'select', options: ['< 2.5% (Export Grade)', '2.5 - 4.0% (Mill Standard)', '> 4.0% (High trash)'] }
    ],
    storageCharacteristics: {
      type: 'Covered Dry Cotton Warehouse',
      monthlyRatePerKg: 1.2,
      shelfLifeDays: 300,
      tempGuideline: 'Dry, Fire-safe zone',
      lossRisk: 'Low'
    },
    processingStages: ['GINNING', 'SEED_SEPARATION', 'PRESSING', 'BALING'],
    description: 'Cotton Corporation of India (CCI) MSP procurement and large spinning mill direct contracts in Gujarat and Maharashtra.'
  },
  {
    id: 'APPLE',
    name: 'Apple (सेब)',
    category: 'FRUIT',
    hindiName: 'सेब',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Box (20kg)', 'Crate (25kg)'],
    basePricePerKg: 115.0,
    mandiPricePerKg: 105.0,
    processorQuotePerKg: 122.0,
    institutionalQuotePerKg: 128.0,
    priceChange30d: 8.4,
    demandLevel: 'HIGH',
    demandVolumeKg: 11200,
    supplyVolumeKg: 5800,
    varieties: ['Royal Delicious', 'Kinnaur Gold', 'Red Chief', 'Gala', 'Granny Smith'],
    qualitySchema: [
      { key: 'colorCoverage', label: 'Color Flush Coverage', type: 'select', options: ['> 85% Deep Red (Super Grade)', '70 - 85% (Grade A)', '< 70% (Grade B)'] },
      { key: 'fruitSize', label: 'Fruit Caliber (Diameter)', type: 'select', options: ['Extra Large (80mm+)', 'Large (70 - 80mm)', 'Medium (60 - 70mm)'] },
      { key: 'blemishFree', label: 'Skin Finish & Blemish', type: 'select', options: ['Wax Coated / Flawless', 'Minimal Scab (< 1%)', 'Commercial Grade'] }
    ],
    storageCharacteristics: {
      type: 'CA (Controlled Atmosphere) Cold Store',
      monthlyRatePerKg: 3.8,
      shelfLifeDays: 180,
      tempGuideline: '0 - 2°C, 90% RH',
      lossRisk: 'Moderate'
    },
    processingStages: ['SORTING', 'GRADING_OPTICAL', 'WAXING', 'BOX_PACKING'],
    description: 'Premium mountain produce with high demand in metro supermarket chains and organized fruit exporters.'
  },
  {
    id: 'CHICKPEA',
    name: 'Chickpea / Bengal Gram (चना)',
    category: 'PULSE',
    hindiName: 'चना',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Bag (50kg)'],
    basePricePerKg: 62.0,
    mandiPricePerKg: 59.5,
    processorQuotePerKg: 65.0,
    institutionalQuotePerKg: 67.5,
    priceChange30d: 3.1,
    demandLevel: 'HIGH',
    demandVolumeKg: 12500,
    supplyVolumeKg: 8100,
    varieties: ['Desi Chana (JG-11)', 'Kabuli Dollar Chana', 'Vishal', 'Jaki 9218'],
    qualitySchema: [
      { key: 'seedSize', label: 'Grain Size & Count', type: 'select', options: ['Bold (10 - 12mm Kabuli)', 'Medium Desi', 'Small Desi'] },
      { key: 'moisture', label: 'Moisture baseline', type: 'select', options: ['< 9% (Safe storage)', '9 - 11% (Standard)', '> 11% (Needs aeration)'] },
      { key: 'weevilDamage', label: 'Insect / Weevil Damage', type: 'select', options: ['0% (Nil damage)', '< 1% (Permissible)', '> 1% (Discounted)'] }
    ],
    storageCharacteristics: {
      type: 'Fumigated Pulse Warehouse',
      monthlyRatePerKg: 0.85,
      shelfLifeDays: 300,
      tempGuideline: 'Dry, Pest-free',
      lossRisk: 'Low'
    },
    processingStages: ['CLEANING', 'DE-STONING', 'GRADING', 'DAL_SPLITTING', 'PACKING'],
    description: 'Procured by NAFED for national buffer stock, large besan millers, and wholesale grain aggregators.'
  },
  {
    id: 'WOOL',
    name: 'Raw Wool & Fleece (कच्ची ऊन)',
    category: 'FIBER',
    hindiName: 'ऊन',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Bale (100kg)', 'Quintal'],
    basePricePerKg: 448.0,
    mandiPricePerKg: 420.0,
    processorQuotePerKg: 470.0,
    institutionalQuotePerKg: 502.0,
    priceChange30d: 6.8,
    demandLevel: 'HIGH',
    demandVolumeKg: 11800,
    supplyVolumeKg: 6200,
    varieties: ['Fine Merino Cross', 'Gaddi Mountain Fleece', 'Chokla Carpet Wool', 'Magra Fine', 'Deccani Coarse'],
    qualitySchema: [
      { key: 'micron', label: 'Fiber Fineness (Micron)', type: 'select', options: ['Superfine (< 19.5 µm)', 'Fine (19.5 - 22.0 µm)', 'Medium (22.1 - 28.0 µm)', 'Coarse (> 28.0 µm)'] },
      { key: 'vegetableMatter', label: 'Vegetable Matter (VM %)', type: 'select', options: ['< 1.0% (Clean)', '1.0 - 2.5% (Standard)', '> 2.5% (Heavy VM)'] },
      { key: 'stapleLength', label: 'Staple Length', type: 'select', options: ['Long (75mm+)', 'Medium (55 - 75mm)', 'Short (< 55mm)'] },
      { key: 'yieldPct', label: 'Scoured Clean Yield %', type: 'select', options: ['High Yield (72%+)', 'Standard Yield (65 - 72%)', 'Low Yield (< 65%)'] }
    ],
    storageCharacteristics: {
      type: 'Moisture-Locked Climate Warehouse',
      monthlyRatePerKg: 4.5,
      shelfLifeDays: 365,
      tempGuideline: '18 - 22°C, 65% RH',
      lossRisk: 'Low'
    },
    processingStages: ['SORTING', 'WASHING_SCOURING', 'CARDING', 'SPINNING'],
    description: 'High artisan & worsted mill demand from Kullu, Ludhiana, and Bikaner textile clusters.'
  }
];

export function getCommodityById(id) {
  if (!id) return COMMODITIES[0];
  const upper = String(id).toUpperCase();
  return COMMODITIES.find(c => c.id === upper || c.name.toUpperCase().includes(upper)) || COMMODITIES[0];
}

export function getCommoditiesByCategory(categoryId) {
  if (!categoryId || categoryId === 'ALL') return COMMODITIES;
  return COMMODITIES.filter(c => c.category === categoryId);
}
