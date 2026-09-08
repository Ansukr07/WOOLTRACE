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
    name: 'Wheat',
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
    processingStages: ['CLEANING', 'DE-STONING', 'GRADING', 'MILLING_FLOUR', 'PACKAGING'],
    description: 'Direct procurement links to roller flour mills, biscuit manufacturers, and state buffer depots across Punjab, Haryana, MP, and Rajasthan.'
  },
  {
    id: 'RICE',
    name: 'Paddy / Basmati Rice',
    category: 'CEREAL',
    hindiName: 'धान / बासमती',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Quintal', 'Tonne', 'Bag (50kg)'],
    basePricePerKg: 38.0,
    mandiPricePerKg: 36.5,
    processorQuotePerKg: 41.0,
    institutionalQuotePerKg: 42.5,
    priceChange30d: 5.1,
    demandLevel: 'HIGH',
    demandVolumeKg: 32000,
    supplyVolumeKg: 18500,
    varieties: ['Pusa 1121', 'Pusa 1509', 'Sugandha', 'Sharbati Rice', 'PR-126'],
    qualitySchema: [
      { key: 'grainLength', label: 'Average Grain Length (mm)', type: 'select', options: ['Extra Long (8.2mm+)', 'Long (7.5 - 8.2mm)', 'Medium (6.5 - 7.5mm)'] },
      { key: 'brokenGrain', label: 'Broken Grain %', type: 'select', options: ['< 2% (Export Grade)', '2 - 5% (Grade A)', '> 5% (Commercial)'] },
      { key: 'moisture', label: 'Paddy Moisture %', type: 'select', options: ['< 12% (Milling Ready)', '12 - 14% (Standard)', '> 14% (High)'] }
    ],
    storageCharacteristics: {
      type: 'Paddy Silo / Covered Shed',
      monthlyRatePerKg: 0.9,
      shelfLifeDays: 300,
      tempGuideline: 'Ambient, well aerated',
      lossRisk: 'Low'
    },
    processingStages: ['CLEANING', 'HUSKING', 'POLISHING', 'SORTING_COLOR', 'PACKAGING'],
    description: 'High export and domestic demand from modern rice shellers in Punjab, Haryana, and Western UP.'
  },
  {
    id: 'TOMATO',
    name: 'Tomato',
    category: 'VEGETABLE',
    hindiName: 'टमाटर',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Crate (25kg)', 'Quintal'],
    basePricePerKg: 34.0,
    mandiPricePerKg: 32.0,
    processorQuotePerKg: 37.0,
    institutionalQuotePerKg: 38.5,
    priceChange30d: -8.2,
    demandLevel: 'HIGH',
    demandVolumeKg: 18000,
    supplyVolumeKg: 22000,
    varieties: ['Himsona', 'Abhinav', 'Vaishali', 'Pusa Ruby', 'Desi Round'],
    qualitySchema: [
      { key: 'firmness', label: 'Fruit Firmness & Ripeness', type: 'select', options: ['Firm Breaker (70% Red - Best Transport)', 'Table Ripe (90% Red)', 'Soft (Processing only)'] },
      { key: 'diameter', label: 'Fruit Diameter (Grade)', type: 'select', options: ['Large (65mm+)', 'Medium (50 - 65mm)', 'Small (< 50mm)'] },
      { key: 'blemish', label: 'Skin Blemish & Cracks', type: 'select', options: ['< 2% (Grade A)', '2 - 5% (Grade B)', '> 5% (Grade C)'] }
    ],
    storageCharacteristics: {
      type: 'Cold Room (Reefer)',
      monthlyRatePerKg: 2.5,
      shelfLifeDays: 21,
      tempGuideline: '10 - 13°C, 85-90% RH',
      lossRisk: 'High (Perishable)'
    },
    processingStages: ['WASHING', 'SORTING', 'CRUSHING', 'PASTE_EXTRACTION', 'ASEPTIC_PACKING'],
    description: 'Fast-moving vegetable connected to tomato puree/ketchup processors, institutional caterers, and wholesale vegetable yards.'
  },
  {
    id: 'ONION',
    name: 'Onion',
    category: 'VEGETABLE',
    hindiName: 'प्याज',
    defaultUnit: 'KG',
    supportedUnits: ['KG', 'Bag (50kg)', 'Quintal'],
    basePricePerKg: 24.5,
    mandiPricePerKg: 23.0,
    processorQuotePerKg: 26.5,
    institutionalQuotePerKg: 28.0,
    priceChange30d: 12.4,
    demandLevel: 'HIGH',
    demandVolumeKg: 38000,
    supplyVolumeKg: 21000,
    varieties: ['Nashik Red', 'Garwa (Rabi)', 'Pusa Red', 'White Onion (Dehydration)', 'Bhavnagar White'],
    qualitySchema: [
      { key: 'bulbSize', label: 'Bulb Diameter (mm)', type: 'select', options: ['Big (55mm+)', 'Medium (45 - 55mm)', 'Small (Golta < 45mm)'] },
      { key: 'neckThickness', label: 'Neck Tightness & Dryness', type: 'select', options: ['Tight Thin Neck (Long Storage)', 'Standard Neck', 'Thick Neck (Consume early)'] },
      { key: 'sprouting', label: 'Sprouting / Rotting', type: 'select', options: ['0% (Grade A)', '< 2% (Grade B)', '> 2% (Grade C)'] }
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
    name: 'Mustard / Rapeseed',
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
    name: 'Raw Cotton',
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
    name: 'Apple',
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
    name: 'Chickpea / Bengal Gram',
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
    name: 'Raw Wool & Fleece',
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
