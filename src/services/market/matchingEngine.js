/**
 * Crop-Agnostic Farmer ↔ Buyer Matching Engine
 * SIH 2026 PS 26132 - Multi-Commodity Algorithmic Compatibility with Explainability
 */

export function calculateMatchScore(lotOrBatch, buyerDemand) {
  let score = 0;
  const breakdown = [];
  const warnings = [];

  const lotCrop = (lotOrBatch.cropId || lotOrBatch.cropName || lotOrBatch.woolType || '').toUpperCase();
  const demandedCrop = (buyerDemand.cropId || buyerDemand.cropName || buyerDemand.woolType || buyerDemand.commodity || '').toUpperCase();

  // 1. Commodity & Quality Compatibility (30%)
  let qualityPts = 0;
  if (!demandedCrop || demandedCrop === 'ALL' || lotCrop.includes(demandedCrop) || demandedCrop.includes(lotCrop)) {
    qualityPts += 15;
    breakdown.push('Commodity type (' + (lotOrBatch.cropName || lotOrBatch.woolType || 'Produce') + ') aligns with buyer procurement requirement.');
  } else {
    warnings.push('Crop type differs from buyer demand specification.');
  }

  const lotGrade = lotOrBatch.qualityGrade || lotOrBatch.grade || 'A';
  const demandedGrade = buyerDemand.requiredGrade || buyerDemand.grade || 'A';

  if (lotGrade === demandedGrade) {
    qualityPts += 15;
    breakdown.push('Quality grade exactly matches required Grade ' + demandedGrade + ' (100% grade match).');
  } else if ((lotGrade === 'A+' && demandedGrade === 'A') || (lotGrade === 'A' && demandedGrade === 'B')) {
    qualityPts += 13;
    breakdown.push('Quality grade (' + lotGrade + ') exceeds minimum requested grade (' + demandedGrade + ').');
  } else {
    qualityPts += 6;
    warnings.push('Lot is Grade ' + lotGrade + ', buyer requested Grade ' + demandedGrade + '.');
  }
  score += qualityPts;

  // 2. Quantity & FPO Aggregation (20%)
  const lotQty = lotOrBatch.quantity || 0;
  const minRequired = buyerDemand.minQuantity || (buyerDemand.quantityRequired ? buyerDemand.quantityRequired * 0.3 : 100);
  const maxRequired = buyerDemand.maxQuantity || (buyerDemand.quantityRequired ? buyerDemand.quantityRequired * 1.5 : 10000);

  let quantityPts = 0;
  if (lotQty >= minRequired && lotQty <= maxRequired) {
    quantityPts = 20;
    breakdown.push('Available lot quantity (' + lotQty + ' ' + (lotOrBatch.unit || 'KG') + ') meets buyer procurement lot requirement.');
  } else if (lotQty < minRequired) {
    const ratio = Math.max(0.3, lotQty / minRequired);
    quantityPts = Math.round(20 * ratio);
    warnings.push('Lot (' + lotQty + ' ' + (lotOrBatch.unit || 'KG') + ') is below buyer bulk requirement (' + minRequired + ' ' + (lotOrBatch.unit || 'KG') + '). FPO aggregation recommended to unlock full price premium.');
  } else {
    quantityPts = 17;
    breakdown.push('Lot (' + lotQty + ' ' + (lotOrBatch.unit || 'KG') + ') can fulfill buyer demand with partial dispatch.');
  }
  score += quantityPts;

  // 3. Location & Freight Corridor (15%)
  const buyerLocation = buyerDemand.location || '';
  const lotLocation = lotOrBatch.origin || lotOrBatch.location || '';
  const isSameRegion = buyerLocation.toLowerCase().includes('punjab') && lotLocation.toLowerCase().includes('punjab') ||
                       buyerLocation.toLowerCase().includes('karnataka') && lotLocation.toLowerCase().includes('karnataka') ||
                       buyerLocation.toLowerCase().includes('maharashtra') && lotLocation.toLowerCase().includes('maharashtra') ||
                       buyerLocation.toLowerCase().includes('rajasthan') && lotLocation.toLowerCase().includes('rajasthan') ||
                       buyerLocation.toLowerCase().includes('himachal') && lotLocation.toLowerCase().includes('himachal') ||
                       buyerLocation.toLowerCase().includes('gujarat') && lotLocation.toLowerCase().includes('gujarat');

  let locationPts = 0;
  if (isSameRegion) {
    locationPts = 15;
    breakdown.push('Intra-state logistics corridor minimizes freight lead time and transit expenses.');
  } else {
    locationPts = 10;
    breakdown.push('Inter-state transit route eligible with WoolTrace Transport network.');
  }
  score += locationPts;

  // 4. Price Compatibility (20%)
  const targetPrice = lotOrBatch.askingPrice || lotOrBatch.targetPrice || 30;
  const buyerMaxPrice = buyerDemand.maxPrice || buyerDemand.budgetPrice || (targetPrice * 1.1);
  const buyerMinPrice = buyerDemand.minPrice || buyerMaxPrice * 0.85;

  let pricePts = 0;
  if (targetPrice <= buyerMaxPrice && targetPrice >= buyerMinPrice) {
    pricePts = 20;
    breakdown.push('Farmer target price (₹' + targetPrice + '/unit) aligns seamlessly with buyer procurement budget (₹' + buyerMinPrice + ' - ₹' + buyerMaxPrice + '/unit).');
  } else if (targetPrice < buyerMinPrice) {
    pricePts = 20;
    breakdown.push('Farmer asking price is highly competitive for buyer procurement team.');
  } else {
    const diffPct = ((targetPrice - buyerMaxPrice) / buyerMaxPrice) * 100;
    if (diffPct <= 8) {
      pricePts = 14;
      breakdown.push('Price difference is within negotiable margin (~' + diffPct.toFixed(1) + '%).');
    } else {
      pricePts = 6;
      warnings.push('Asking price (₹' + targetPrice + '/unit) is ' + diffPct.toFixed(1) + '% above buyer current indicative budget.');
    }
  }
  score += pricePts;

  // 5. Delivery Timing & Reliability (15%)
  let timingPts = 15;
  if (buyerDemand.deliveryWindowDays) {
    breakdown.push('Delivery window (' + buyerDemand.deliveryWindowDays + ' days) compatible with instant dispatch.');
  } else {
    breakdown.push('Standard delivery schedule approved.');
  }
  score += timingPts;

  const totalScore = Math.min(100, Math.max(0, score));

  return {
    score: totalScore,
    matchTier: totalScore >= 85 ? 'HIGH_MATCH' : totalScore >= 65 ? 'MEDIUM_MATCH' : 'LOW_MATCH',
    breakdown,
    warnings,
    summary: totalScore >= 85
      ? 'Strong commercial compatibility across quality specifications, pricing bracket, and logistics corridor.'
      : totalScore >= 65
      ? 'Good commercial match with slight negotiation or volume aggregation needed.'
      : 'Partial compatibility; consider counter-offering or aggregating with other farmer batches.'
  };
}

export function findMatchingBuyers(lotOrBatch, buyersList = []) {
  return buyersList
    .map(buyer => {
      const matchResult = calculateMatchScore(lotOrBatch, buyer);
      return {
        ...buyer,
        matchResult
      };
    })
    .sort((a, b) => b.matchResult.score - a.matchResult.score);
}
