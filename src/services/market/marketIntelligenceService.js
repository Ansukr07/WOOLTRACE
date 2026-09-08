/**
 * WoolTrace Market Intelligence & Price Discovery Service
 * SIH 2026 PS 26132 - Strengthening market linkages and price discovery
 */

export const WOOL_TYPES = [
  { id: 'FINE_MERINO', name: 'Fine Merino Apparel Wool', micron: '< 21.5 µm', staple: '70-90 mm', basePrice: 465, grade: 'A', yield: '72-78%' },
  { id: 'GADDI_WHITE', name: 'Gaddi Natural White Fleece', micron: '21-24 µm', staple: '80-110 mm', basePrice: 490, grade: 'A+', yield: '80-84%' },
  { id: 'CHOKLA_FINE', name: 'Chokla Fine Carpet Wool', micron: '26-29 µm', staple: '60-80 mm', basePrice: 385, grade: 'A', yield: '74-78%' },
  { id: 'MAGRA_LUSTRE', name: 'Magra Lustrous Carpet Wool', micron: '30-34 µm', staple: '75-95 mm', basePrice: 415, grade: 'A', yield: '78-82%' },
  { id: 'MEDIUM_CROSSBRED', name: 'Medium Crossbred Fleece', micron: '24-28 µm', staple: '65-85 mm', basePrice: 340, grade: 'B', yield: '68-72%' },
  { id: 'DECCANI_COARSE', name: 'Deccani Coarse Black/Brown Wool', micron: '> 35 µm', staple: '45-65 mm', basePrice: 245, grade: 'B', yield: '60-66%' },
  { id: 'INDIGENOUS_MIXED', name: 'Indigenous Mixed Rough Wool', micron: '> 36 µm', staple: '40-60 mm', basePrice: 210, grade: 'C', yield: '55-62%' }
];

export const REGIONAL_MARKETS = [
  { state: 'Karnataka', district: 'Mysuru', market: 'Mysuru APMC Mandi', lat: 12.3556, lng: 76.6120, avgDistance: 12 },
  { state: 'Karnataka', district: 'Haveri', market: 'Ranebennur Wool Sub-Market', lat: 14.6234, lng: 75.6267, avgDistance: 45 },
  { state: 'Rajasthan', district: 'Bikaner', market: 'Bikaner Central Wool Mandi', lat: 28.0229, lng: 73.3119, avgDistance: 15 },
  { state: 'Rajasthan', district: 'Nagaur', market: 'Nagaur APMC Yard', lat: 27.2000, lng: 73.7400, avgDistance: 38 },
  { state: 'Himachal Pradesh', district: 'Kullu', market: 'Kullu Valley Wool Exchange', lat: 31.9579, lng: 77.1095, avgDistance: 18 },
  { state: 'Jammu & Kashmir', district: 'Srinagar', market: 'Srinagar Sheep Products Market', lat: 34.0837, lng: 74.7973, avgDistance: 25 },
  { state: 'Punjab', district: 'Ludhiana', market: 'Ludhiana Textile & Fleece Terminal', lat: 30.9010, lng: 75.8573, avgDistance: 80 }
];

export function getPriceDiscoveryChannels(params) {
  const {
    woolType = 'FINE_MERINO',
    grade = 'A',
    quantity = 500,
    state = 'Karnataka',
    cleanliness = 90,
    moisture = 12
  } = params;

  const woolSpec = WOOL_TYPES.find(w => w.id === woolType || w.name.toLowerCase().includes(woolType.toLowerCase())) || WOOL_TYPES[0];
  const base = woolSpec.basePrice;
  const gradeMultiplier = grade === 'A+' ? 1.08 : grade === 'A' ? 1.0 : grade === 'B' ? 0.88 : 0.74;
  const qualityAdj = (cleanliness > 90 ? 12 : cleanliness > 80 ? 5 : -10) - (moisture > 14 ? 15 : 0);

  const calculatedBase = Math.round(base * gradeMultiplier + qualityAdj);

  return [
    {
      channelId: 'APMC_MANDI',
      channelType: 'Nearby APMC Mandi',
      buyerName: state === 'Rajasthan' ? 'Bikaner Central Wool Mandi' : state === 'Himachal Pradesh' ? 'Kullu APMC Yard' : 'Mysuru Regional Mandi',
      badge: 'Regulated Mandi',
      badgeColor: 'blue',
      pricePerKg: Math.round(calculatedBase * 0.94),
      trend: '+3.2%',
      trendDirection: 'up',
      distanceKm: 24,
      transportRatePerKm: 18,
      paymentTerms: 'Immediate Mandi Slip (3-5 Days Bank Transfer)',
      reliabilityScore: 94,
      verificationStatus: 'GOVERNMENT_REGULATED',
      minLotSize: 50,
      description: 'Standard mandi auction benchmark. Subject to 1.5% APMC market cess and physical arrival handling fees.'
    },
    {
      channelId: 'PROCESSING_UNIT',
      channelType: 'Processing Mill Direct',
      buyerName: 'WoolCraft Processing Centre',
      badge: 'Certified Processor',
      badgeColor: 'green',
      pricePerKg: Math.round(calculatedBase * 1.05),
      trend: '+7.8%',
      trendDirection: 'up',
      distanceKm: 48,
      transportRatePerKm: 22,
      paymentTerms: 'Escrow Secured (Direct Release on Quality Check)',
      reliabilityScore: 98,
      verificationStatus: 'PLATFORM_VERIFIED_PROCESSOR',
      minLotSize: 200,
      description: 'Procures directly for scouring and worsted yarn spinning. Offers premium for certified low vegetable matter (<1.5%).'
    },
    {
      channelId: 'INSTITUTIONAL',
      channelType: 'Institutional / Co-op Buyer',
      buyerName: 'Himalayan Handloom Apex Co-op',
      badge: 'Institutional Buyer',
      badgeColor: 'ivory',
      pricePerKg: Math.round(calculatedBase * 1.12),
      trend: '+9.4%',
      trendDirection: 'up',
      distanceKm: 85,
      transportRatePerKm: 25,
      paymentTerms: 'Advance 30% + Balance upon Delivery',
      reliabilityScore: 96,
      verificationStatus: 'VERIFIED_COOPERATIVE',
      minLotSize: 300,
      description: 'Bulk purchase for GI-tagged artisan craft products. Requires Grade A inspection certificate and origin traceability.'
    },
    {
      channelId: 'DIGITAL_BUYER',
      channelType: 'Digital Export Aggregator',
      buyerName: 'Bharat Wool Global Exports',
      badge: 'Export Partner',
      badgeColor: 'coral',
      pricePerKg: Math.round(calculatedBase * 1.09),
      trend: '+5.1%',
      trendDirection: 'up',
      distanceKm: 140,
      transportRatePerKm: 28,
      paymentTerms: '100% WoolTrace Digital Escrow Vault',
      reliabilityScore: 99,
      verificationStatus: 'VERIFIED_EXPORTER',
      minLotSize: 500,
      description: 'Direct procurement for European and domestic carpet markets. Accepts consolidated FPO bulk lots.'
    }
  ];
}

export function calculateNetRealization({
  pricePerKg,
  quantityKg,
  distanceKm = 30,
  transportCostPerKm = 20,
  storageMonths = 0,
  storageRatePerKgMonth = 4.5,
  platformFeePercent = 1.0
}) {
  const grossSaleValue = pricePerKg * quantityKg;
  const transportCost = distanceKm > 0 ? Math.round(500 + distanceKm * transportCostPerKm) : 0;
  const storageCost = Math.round(storageMonths * storageRatePerKgMonth * quantityKg);
  const transactionFee = Math.round((grossSaleValue * platformFeePercent) / 100);
  const totalDeductions = transportCost + storageCost + transactionFee;
  const netRealizationValue = Math.max(0, grossSaleValue - totalDeductions);
  const netRealizationPerKg = quantityKg > 0 ? Number((netRealizationValue / quantityKg).toFixed(2)) : 0;
  const deductionRatio = grossSaleValue > 0 ? ((totalDeductions / grossSaleValue) * 100).toFixed(1) : 0;

  return {
    grossPricePerKg: pricePerKg,
    quantityKg,
    grossSaleValue,
    transportCost,
    storageCost,
    transactionFee,
    totalDeductions,
    netRealizationValue,
    netRealizationPerKg,
    deductionRatio,
    effectiveDeductionPerKg: Number((totalDeductions / (quantityKg || 1)).toFixed(2))
  };
}

export function getSaleWindowRecommendation({
  woolType = 'FINE_MERINO',
  currentPrice = 450,
  historicalAvg30d = 425,
  storageCostPerMonth = 4.5,
  demandLevel = 'HIGH'
}) {
  const priceDiffPct = ((currentPrice - historicalAvg30d) / historicalAvg30d) * 100;
  
  if (demandLevel === 'HIGH' && priceDiffPct >= 4) {
    return {
      action: 'SELL NOW',
      urgency: 'HIGH',
      badgeColor: '#0B120D',
      badgeBg: '#DDFF86',
      recommendedWindow: 'Next 3-7 Days',
      confidence: 'High (89%)',
      title: 'Strong Market Window - High Buyer Demand',
      reason: 'Current offers of ₹' + currentPrice + '/kg are ' + priceDiffPct.toFixed(1) + '% above the 30-day average (₹' + historicalAvg30d + '/kg). Immediate demand from spinning mills is currently outpacing arrival volumes.',
      storageAdvice: 'Holding in warehouse would cost ~₹' + storageCostPerMonth + '/kg/month without a forecasted gain sufficient to justify storage carry fees.'
    };
  } else if (demandLevel === 'HIGH' && priceDiffPct < 0) {
    return {
      action: 'WAIT 5-10 DAYS',
      urgency: 'MEDIUM',
      badgeColor: '#0B120D',
      badgeBg: '#EDEDCE',
      recommendedWindow: 'Hold 7-14 Days',
      confidence: 'Medium (76%)',
      title: 'Hold for Upcoming Mill Procurement Cycles',
      reason: 'Buyer inquiry volume has surged by 28%, but mandi spot rates remain temporarily dampened due to peak local shearing arrivals. Prices are projected to firm up as seasonal supply consolidates.',
      storageAdvice: 'Storage at ₹' + storageCostPerMonth + '/kg/month is economically advantageous if anticipated price recovery exceeds +₹15/kg.'
    };
  } else {
    return {
      action: 'CONSIDER PARTIAL SALE',
      urgency: 'MODERATE',
      badgeColor: '#0B120D',
      badgeBg: '#BED5E5',
      recommendedWindow: 'Sell 40% Now, Hold 60%',
      confidence: 'High (84%)',
      title: 'Balanced Risk Hedging Strategy',
      reason: 'Allows meeting immediate operational liquidity requirements while retaining high-grade inventory for upcoming festive winter apparel demand.',
      storageAdvice: 'Commit baseline volume to long-term certified warehouse storage.'
    };
  }
}

export function generatePriceTrends(period = '30D', woolType = 'FINE_MERINO') {
  const wool = WOOL_TYPES.find(w => w.id === woolType) || WOOL_TYPES[0];
  const base = wool.basePrice;
  const pointsCount = period === '7D' ? 7 : period === '30D' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : 365;
  const result = [];
  const now = new Date();

  let runningMandi = base * 0.93;
  let runningProcessor = base * 1.03;
  let runningInstitutional = base * 1.10;

  for (let i = pointsCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const noise = (Math.sin(i * 0.35) * 4) + ((Math.random() - 0.48) * 6);
    const trendDrift = ((pointsCount - i) / pointsCount) * 18;

    const mandiPrice = Math.round(runningMandi + noise + trendDrift * 0.7);
    const processorPrice = Math.round(runningProcessor + noise * 1.1 + trendDrift * 0.9);
    const institutionalPrice = Math.round(runningInstitutional + noise * 0.8 + trendDrift * 1.05);
    const avgTradedPrice = Math.round((mandiPrice + processorPrice * 2 + institutionalPrice) / 4);
    const volumeTonnes = Math.round(18 + Math.sin(i * 0.4) * 8 + Math.random() * 5);

    result.push({
      date: dateStr,
      fullDate: d.toISOString().split('T')[0],
      mandiPrice,
      processorPrice,
      institutionalPrice,
      avgTradedPrice,
      volumeTonnes
    });
  }

  const firstPrice = result[0]?.avgTradedPrice || base;
  const lastPrice = result[result.length - 1]?.avgTradedPrice || base;
  const diff = lastPrice - firstPrice;
  const pct = Number(((diff / firstPrice) * 100).toFixed(1));

  return {
    data: result,
    stats: {
      period,
      startPrice: firstPrice,
      currentPrice: lastPrice,
      minPrice: Math.min(...result.map(r => r.avgTradedPrice)),
      maxPrice: Math.max(...result.map(r => r.avgTradedPrice)),
      changePercent: pct,
      totalVolumeTonnes: result.reduce((acc, r) => acc + r.volumeTonnes, 0),
      summaryText: 'Prices for ' + wool.name + ' have ' + (pct >= 0 ? 'increased by' : 'declined by') + ' ' + Math.abs(pct) + '% over the selected ' + period + ' period.'
    }
  };
}