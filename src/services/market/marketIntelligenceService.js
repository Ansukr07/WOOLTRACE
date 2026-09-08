/**
 * Market Intelligence Service for SIH 2026 PS 26132
 * Crop-Agnostic Multi-Channel Price Aggregation, Net Realization & Sale Window Advisory
 */

import { getCommodityById } from './cropCommodityRegistry';

export { COMMODITIES, COMMODITY_CATEGORIES, getCommodityById, getCommoditiesByCategory } from './cropCommodityRegistry';

// Backward compatibility alias for legacy wool components
export const WOOL_TYPES = [
  { id: 'FINE_MERINO', name: 'Fine Merino Cross Wool', basePrice: 450, grade: 'A', micron: '19.5 - 21.5 µm' },
  { id: 'GADDI', name: 'Gaddi Mountain Fleece', basePrice: 480, grade: 'A+', micron: '21.0 - 23.0 µm' },
  { id: 'CHOKLA', name: 'Chokla Carpet Wool', basePrice: 380, grade: 'B', micron: '28.0 - 32.0 µm' },
  { id: 'MAGRA', name: 'Magra Fine Carpet Wool', basePrice: 395, grade: 'A', micron: '27.0 - 30.0 µm' },
  { id: 'DECCANI', name: 'Deccani Coarse Wool', basePrice: 220, grade: 'C', micron: '36.0+ µm' }
];

export function getMarketChannelsForCommodity(commodityId = 'WHEAT', variety = '', qualityGrade = 'A') {
  const item = getCommodityById(commodityId);
  const base = item.basePricePerKg;

  let gradeMultiplier = 1.0;
  if (qualityGrade === 'A+' || qualityGrade === 'Super') gradeMultiplier = 1.08;
  else if (qualityGrade === 'A') gradeMultiplier = 1.0;
  else if (qualityGrade === 'B') gradeMultiplier = 0.92;
  else if (qualityGrade === 'C') gradeMultiplier = 0.85;

  const calculatedBase = Math.round(base * gradeMultiplier);

  return [
    {
      channelId: 'APMC_MANDI',
      channelType: 'APMC Mandi Auction',
      buyerName: 'Regional APMC Wholesale Yard',
      badge: 'Regulated Mandi',
      badgeColor: 'blue',
      pricePerKg: item.mandiPricePerKg || Math.round(calculatedBase * 0.94),
      trend: '+3.2%',
      trendDirection: 'up',
      distanceKm: 22,
      transportRatePerKm: 16,
      paymentTerms: 'APMC Electronic Payment (3-5 Days Bank Transfer)',
      reliabilityScore: 94,
      verificationStatus: 'GOVERNMENT_REGULATED',
      minLotSize: 100,
      description: 'Standard mandi auction benchmark. Subject to 1.5% APMC market cess and physical unloading handling fees.'
    },
    {
      channelId: 'PROCESSING_UNIT',
      channelType: 'Processing Mill / Agro Industry Direct',
      buyerName: item.category === 'CEREAL' ? 'Shree Roller Flour & Grain Mills' :
                 item.category === 'VEGETABLE' ? 'Kisan Fresh Agro Food Processors' :
                 item.category === 'OILSEED' ? 'Bharat Solvent & Edible Oil Mill' :
                 item.category === 'COMMERCIAL' ? 'Gujarat Ginning & Textile Mills' :
                 item.category === 'FRUIT' ? 'Himalayan Cold Pack & Puree Ltd.' :
                 'WoolCraft Worsted & Processing Centre',
      badge: 'Certified Processor',
      badgeColor: 'green',
      pricePerKg: item.processorQuotePerKg || Math.round(calculatedBase * 1.06),
      trend: '+7.8%',
      trendDirection: 'up',
      distanceKm: 42,
      transportRatePerKm: 20,
      paymentTerms: 'Escrow Secured (Direct Release on Quality Lab Check)',
      reliabilityScore: 98,
      verificationStatus: 'PLATFORM_VERIFIED_PROCESSOR',
      minLotSize: 300,
      description: 'Direct procurement for processing lines. Offers certified quality premium for high grade specifications.'
    },
    {
      channelId: 'INSTITUTIONAL',
      channelType: 'Institutional Co-op / Government Procurement',
      buyerName: item.category === 'CEREAL' ? 'FCI / Apex State Food Co-operative' :
                 item.category === 'PULSE' || item.category === 'OILSEED' ? 'NAFED National Buffer Procurement Hub' :
                 item.category === 'COMMERCIAL' ? 'Cotton Corporation of India (CCI)' :
                 item.category === 'FRUIT' ? 'HPMC Horticultural Apex Marketing Federation' :
                 'Himalayan Handloom & Artisan Apex Co-op',
      badge: 'Institutional Buyer',
      badgeColor: 'ivory',
      pricePerKg: item.institutionalQuotePerKg || Math.round(calculatedBase * 1.10),
      trend: '+8.9%',
      trendDirection: 'up',
      distanceKm: 75,
      transportRatePerKm: 24,
      paymentTerms: 'Advance 30% + Balance upon Quality Receipt',
      reliabilityScore: 97,
      verificationStatus: 'VERIFIED_COOPERATIVE',
      minLotSize: 500,
      description: 'Bulk institutional purchase for state distribution and organized apex federations with origin traceability.'
    },
    {
      channelId: 'DIGITAL_BUYER',
      channelType: 'Digital Aggregator / Exporter',
      buyerName: 'Bharat Agri Trade & Global Exports',
      badge: 'Export Partner',
      badgeColor: 'coral',
      pricePerKg: Math.round(calculatedBase * 1.08),
      trend: '+5.4%',
      trendDirection: 'up',
      distanceKm: 120,
      transportRatePerKm: 26,
      paymentTerms: '100% Digital Escrow Vault Security',
      reliabilityScore: 99,
      verificationStatus: 'VERIFIED_EXPORTER',
      minLotSize: 500,
      description: 'Direct corporate procurement for organized retail chains and export. Accepts aggregated FPO bulk lots.'
    }
  ];
}

// Backward compatibility alias
export function getMarketChannels(woolType = 'FINE_MERINO', qualityGrade = 'A') {
  return getMarketChannelsForCommodity('WOOL', woolType, qualityGrade);
}

export function calculateNetRealization({
  pricePerKg,
  quantityKg,
  distanceKm = 30,
  transportCostPerKm = 18,
  storageMonths = 0,
  storageRatePerKgMonth = 1.0,
  platformFeePercent = 1.0
}) {
  const grossSaleValue = pricePerKg * quantityKg;
  const transportCost = distanceKm > 0 ? Math.round(400 + distanceKm * transportCostPerKm) : 0;
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
  commodityId = 'WHEAT',
  currentPrice = 28.5,
  historicalAvg30d = 27.2,
  storageCostPerMonth = 0.8,
  demandLevel = 'HIGH'
}) {
  const item = getCommodityById(commodityId);
  const priceDiffPct = ((currentPrice - historicalAvg30d) / historicalAvg30d) * 100;
  const isPerishable = item.category === 'VEGETABLE' || item.category === 'FRUIT';

  if (isPerishable) {
    if (priceDiffPct >= 2) {
      return {
        action: 'SELL NOW (HIGH DEMAND)',
        urgency: 'HIGH',
        badgeColor: '#0B120D',
        badgeBg: '#DDFF86',
        recommendedWindow: 'Next 1 - 2 Days',
        confidence: 'High (92%)',
        title: 'Immediate Market Peak for Fresh ' + item.name,
        reason: 'Current mandi and processor offers of ₹' + currentPrice + '/kg are ' + priceDiffPct.toFixed(1) + '% above benchmark. Immediate sale minimizes post-harvest transit losses.',
        storageAdvice: 'Cold chain storage at ₹' + storageCostPerMonth + '/kg/month is only recommended if holding for pre-booked institutional contracts.'
      };
    } else {
      return {
        action: 'COLD STORE OR NEGOTIATE',
        urgency: 'MEDIUM',
        badgeColor: '#0B120D',
        badgeBg: '#EDEDCE',
        recommendedWindow: 'Hold 3 - 5 Days in Cold Storage',
        confidence: 'Medium (78%)',
        title: 'Temporary Harvest Influx at Mandis',
        reason: 'Local market arrivals have surged by 24%, temporarily softening spot rates. Pre-cool produce to avoid distress selling.',
        storageAdvice: 'Utilize nearby certified cold storage to preserve grade quality.'
      };
    }
  }

  if (demandLevel === 'HIGH' && priceDiffPct >= 3) {
    return {
      action: 'SELL NOW',
      urgency: 'HIGH',
      badgeColor: '#0B120D',
      badgeBg: '#DDFF86',
      recommendedWindow: 'Next 3 - 7 Days',
      confidence: 'High (89%)',
      title: 'Strong Market Window - High Buyer Demand',
      reason: 'Current offers of ₹' + currentPrice + '/kg are ' + priceDiffPct.toFixed(1) + '% above the 30-day average (₹' + historicalAvg30d + '/kg). Industrial and processor demand is actively outpacing local arrivals.',
      storageAdvice: 'Warehouse carrying costs would consume ~₹' + storageCostPerMonth + '/kg/month without forecasted gains exceeding holding fees.'
    };
  } else if (demandLevel === 'HIGH' && priceDiffPct < 0) {
    return {
      action: 'WAIT 7 - 15 DAYS',
      urgency: 'MEDIUM',
      badgeColor: '#0B120D',
      badgeBg: '#EDEDCE',
      recommendedWindow: 'Hold 7 - 15 Days',
      confidence: 'Medium (76%)',
      title: 'Hold for Upcoming Industrial Procurement Cycles',
      reason: 'Buyer inquiries have surged by 28%, but spot rates remain temporarily dampened during peak harvesting season. Prices typically rebound as supply consolidates.',
      storageAdvice: 'Storage at ₹' + storageCostPerMonth + '/kg/month is economically advantageous as anticipated price recovery exceeds +₹3.5/kg.'
    };
  } else {
    return {
      action: 'CONSIDER PARTIAL SALE',
      urgency: 'MODERATE',
      badgeColor: '#0B120D',
      badgeBg: '#BED5E5',
      recommendedWindow: 'Sell 40% Now, Hold 60%',
      confidence: 'High (84%)',
      title: 'Balanced Liquidity & Risk Hedging',
      reason: 'Meet immediate cash needs with 40% spot dispatch while storing high-grade certified inventory for upcoming festive demand.',
      storageAdvice: 'Deposit bulk volume in WDRA-accredited dry warehouse.'
    };
  }
}

export function generatePriceTrends(period = '30D', commodityId = 'WHEAT') {
  const item = getCommodityById(commodityId);
  const base = item.basePricePerKg;
  const pointsCount = period === '7D' ? 7 : period === '30D' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : 365;
  const result = [];
  const now = new Date();

  let runningMandi = base * 0.94;
  let runningProcessor = base * 1.04;
  let runningInstitutional = base * 1.09;

  for (let i = pointsCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const noise = (Math.sin(i * 0.35) * (base * 0.02)) + ((Math.random() - 0.48) * (base * 0.025));
    const trendDrift = ((pointsCount - i) / pointsCount) * (base * 0.05);

    const mandiPrice = Number((runningMandi + noise + trendDrift * 0.7).toFixed(1));
    const processorPrice = Number((runningProcessor + noise * 1.1 + trendDrift * 0.9).toFixed(1));
    const institutionalPrice = Number((runningInstitutional + noise * 0.8 + trendDrift * 1.05).toFixed(1));
    const avgTradedPrice = Number(((mandiPrice + processorPrice * 2 + institutionalPrice) / 4).toFixed(1));
    const volumeTonnes = Math.round(15 + Math.sin(i * 0.4) * 8 + Math.random() * 6);

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
      commodityName: item.name,
      startPrice: firstPrice,
      currentPrice: lastPrice,
      minPrice: Math.min(...result.map(r => r.avgTradedPrice)),
      maxPrice: Math.max(...result.map(r => r.avgTradedPrice)),
      changePercent: pct,
      totalVolumeTonnes: result.reduce((acc, r) => acc + r.volumeTonnes, 0),
      summaryText: 'Prices for ' + item.name + ' have ' + (pct >= 0 ? 'increased by' : 'declined by') + ' ' + Math.abs(pct) + '% over the selected ' + period + ' period.'
    }
  };
}
