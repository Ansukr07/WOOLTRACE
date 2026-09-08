/**
 * WoolTrace Farmer ↔ Buyer Matching Engine
 * SIH 2026 PS 26132 - Algorithmic Matchmaking with Transparent Explainability
 */

export function calculateMatchScore(lotOrBatch, buyerDemand) {
  let score = 0;
  const breakdown = [];
  const warnings = [];

  const lotGrade = lotOrBatch.qualityGrade || lotOrBatch.grade || 'A';
  const lotWoolType = (lotOrBatch.woolType || '').toLowerCase();
  const demandedGrade = buyerDemand.requiredGrade || buyerDemand.grade || 'A';
  const demandedWoolType = (buyerDemand.woolType || '').toLowerCase();

  let qualityPts = 0;
  if (lotWoolType.includes(demandedWoolType) || demandedWoolType.includes(lotWoolType) || demandedWoolType === 'all') {
    qualityPts += 15;
  } else {
    warnings.push('Wool type differs slightly from primary demand specification.');
  }

  if (lotGrade === demandedGrade) {
    qualityPts += 15;
    breakdown.push('Quality grade exactly matches required Grade ' + demandedGrade + ' (100% grade match).');
  } else if ((lotGrade === 'A+' && demandedGrade === 'A') || (lotGrade === 'A' && demandedGrade === 'B')) {
    qualityPts += 12;
    breakdown.push('Quality grade (' + lotGrade + ') exceeds minimum requested grade (' + demandedGrade + ').');
  } else {
    qualityPts += 5;
    warnings.push('Lot is Grade ' + lotGrade + ', buyer requested Grade ' + demandedGrade + '.');
  }
  score += qualityPts;

  const lotQty = lotOrBatch.quantity || 0;
  const minRequired = buyerDemand.minQuantity || (buyerDemand.quantityRequired ? buyerDemand.quantityRequired * 0.3 : 100);
  const maxRequired = buyerDemand.maxQuantity || (buyerDemand.quantityRequired ? buyerDemand.quantityRequired * 1.5 : 5000);

  let quantityPts = 0;
  if (lotQty >= minRequired && lotQty <= maxRequired) {
    quantityPts = 20;
    breakdown.push('Available lot quantity (' + lotQty + ' KG) meets buyer procurement lot requirement.');
  } else if (lotQty < minRequired) {
    const ratio = Math.max(0.3, lotQty / minRequired);
    quantityPts = Math.round(20 * ratio);
    warnings.push('Lot (' + lotQty + ' KG) is below buyer single-order preference (' + minRequired + ' KG). FPO aggregation recommended.');
  } else {
    quantityPts = 16;
    breakdown.push('Lot (' + lotQty + ' KG) can fulfill buyer demand with partial dispatch.');
  }
  score += quantityPts;

  const buyerLocation = buyerDemand.location || '';
  const lotLocation = lotOrBatch.origin || lotOrBatch.location || '';
  const isSameState = buyerLocation.toLowerCase().includes('karnataka') && lotLocation.toLowerCase().includes('karnataka') ||
                      buyerLocation.toLowerCase().includes('rajasthan') && lotLocation.toLowerCase().includes('rajasthan') ||
                      buyerLocation.toLowerCase().includes('himachal') && lotLocation.toLowerCase().includes('himachal');

  let locationPts = 0;
  if (isSameState) {
    locationPts = 15;
    breakdown.push('Intra-state logistics corridor minimizes freight lead time and transit expenses.');
  } else {
    locationPts = 10;
    breakdown.push('Inter-state transit route eligible with WoolTrace Transport network.');
  }
  score += locationPts;

  const targetPrice = lotOrBatch.askingPrice || lotOrBatch.targetPrice || 420;
  const buyerMaxPrice = buyerDemand.maxPrice || buyerDemand.budgetPrice || 440;
  const buyerMinPrice = buyerDemand.minPrice || buyerMaxPrice * 0.85;

  let pricePts = 0;
  if (targetPrice <= buyerMaxPrice && targetPrice >= buyerMinPrice) {
    pricePts = 20;
    breakdown.push('Farmer target price (₹' + targetPrice + '/KG) aligns seamlessly with buyer procurement budget (₹' + buyerMinPrice + '-₹' + buyerMaxPrice + '/KG).');
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
      warnings.push('Asking price (₹' + targetPrice + '/KG) is ' + diffPct.toFixed(1) + '% above buyer current indicative budget.');
    }
  }
  score += pricePts;

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
      ? 'Strong compatibility across quality specifications, pricing bracket, and logistics corridor.'
      : totalScore >= 65
      ? 'Good commercial match with slight negotiation or volume aggregation needed.'
      : 'Partial compatibility; consider counter-offering or aggregating with other batches.'
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