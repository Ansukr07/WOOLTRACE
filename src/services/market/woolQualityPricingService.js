const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'string') {
    const cleaned = value.replace('%', '').trim();
    const number = Number(cleaned);
    return Number.isFinite(number) ? number : null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const firstPresent = (...values) => values.find(value => value !== undefined && value !== null && value !== '');

const adjustment = (label, value, percent, reason) => ({
  label,
  value,
  percent,
  reason
});

export function normalizeWoolCertificateMetrics(certificate = {}) {
  return {
    certificateId: certificate.certificateId || certificate.id,
    batchId: certificate.batchId,
    status: certificate.status,
    grade: certificate.grade,
    fiberDiameter: toNumber(certificate.fiberDiameter),
    stapleLength: toNumber(certificate.stapleLength),
    cleanYield: toNumber(firstPresent(certificate.cleanYield, certificate.yieldPct, certificate.yield)),
    vegetableMatter: toNumber(certificate.vegetableMatter),
    contamination: firstPresent(certificate.contamination, certificate.foreignMatter),
    moisture: toNumber(certificate.moisture),
    tensileStrength: firstPresent(certificate.tensileStrength, certificate.strength),
    overallScore: toNumber(certificate.overallScore)
  };
}

export function isVerifiedWoolCertificate(certificate = {}) {
  const status = String(certificate.status || '').toUpperCase();
  return Boolean(certificate.certificateId || certificate.id) && !['REJECTED', 'EXPIRED', 'INVALID'].includes(status);
}

export function calculateWoolQualityPrice({ basePrice = 0, certificate = null } = {}) {
  const safeBasePrice = Number.isFinite(Number(basePrice)) ? Number(basePrice) : 0;
  if (!certificate || !isVerifiedWoolCertificate(certificate)) {
    return {
      hasVerifiedCertificate: false,
      basePrice: safeBasePrice,
      adjustedPrice: safeBasePrice,
      totalAdjustment: 0,
      fairPriceRange: {
        low: Number((safeBasePrice * 0.97).toFixed(2)),
        high: Number((safeBasePrice * 1.03).toFixed(2))
      },
      breakdown: [],
      explanation: 'Quality verification required for quality-adjusted estimate.',
      confidence: 'Base market reference only'
    };
  }

  const metrics = normalizeWoolCertificateMetrics(certificate);
  const breakdown = [];

  if (metrics.fiberDiameter !== null) {
    if (metrics.fiberDiameter <= 19.5) breakdown.push(adjustment('Fiber diameter', `${metrics.fiberDiameter} micron`, 6, 'Superfine wool attracts a fineness premium.'));
    else if (metrics.fiberDiameter <= 22) breakdown.push(adjustment('Fiber diameter', `${metrics.fiberDiameter} micron`, 4, 'Fine wool supports worsted and apparel uses.'));
    else if (metrics.fiberDiameter <= 28) breakdown.push(adjustment('Fiber diameter', `${metrics.fiberDiameter} micron`, 0, 'Medium fineness is priced at reference quality.'));
    else if (metrics.fiberDiameter <= 32) breakdown.push(adjustment('Fiber diameter', `${metrics.fiberDiameter} micron`, -4, 'Coarser fiber narrows end-use options.'));
    else breakdown.push(adjustment('Fiber diameter', `${metrics.fiberDiameter} micron`, -8, 'Very coarse fiber receives a quality discount.'));
  }

  if (metrics.stapleLength !== null) {
    if (metrics.stapleLength >= 75) breakdown.push(adjustment('Staple length', `${metrics.stapleLength} mm`, 3, 'Long staple improves spinning performance.'));
    else if (metrics.stapleLength >= 55) breakdown.push(adjustment('Staple length', `${metrics.stapleLength} mm`, 0, 'Staple length is within normal processing range.'));
    else breakdown.push(adjustment('Staple length', `${metrics.stapleLength} mm`, -4, 'Short staple reduces processing yield and buyer utility.'));
  }

  if (metrics.cleanYield !== null) {
    if (metrics.cleanYield >= 72) breakdown.push(adjustment('Clean yield', `${metrics.cleanYield}%`, 5, 'Higher scoured yield means more usable wool per kg.'));
    else if (metrics.cleanYield >= 65) breakdown.push(adjustment('Clean yield', `${metrics.cleanYield}%`, 0, 'Clean yield is within standard range.'));
    else breakdown.push(adjustment('Clean yield', `${metrics.cleanYield}%`, -5, 'Lower clean yield reduces usable output.'));
  }

  if (metrics.vegetableMatter !== null) {
    if (metrics.vegetableMatter < 1) breakdown.push(adjustment('Vegetable matter', `${metrics.vegetableMatter}%`, 2, 'Low vegetable matter reduces cleaning loss.'));
    else if (metrics.vegetableMatter <= 2.5) breakdown.push(adjustment('Vegetable matter', `${metrics.vegetableMatter}%`, 0, 'Vegetable matter is within standard range.'));
    else breakdown.push(adjustment('Vegetable matter', `${metrics.vegetableMatter}%`, -4, 'High vegetable matter increases cleaning cost.'));
  }

  const contamination = String(metrics.contamination || '').toLowerCase();
  if (contamination) {
    if (contamination.includes('none')) breakdown.push(adjustment('Contamination', metrics.contamination, 2, 'No contamination supports clean processing.'));
    else if (contamination.includes('low')) breakdown.push(adjustment('Contamination', metrics.contamination, 0, 'Low contamination is acceptable for reference pricing.'));
    else if (contamination.includes('moderate')) breakdown.push(adjustment('Contamination', metrics.contamination, -3, 'Moderate contamination adds sorting and cleaning cost.'));
    else if (contamination.includes('high')) breakdown.push(adjustment('Contamination', metrics.contamination, -6, 'High contamination materially reduces value.'));
  }

  if (metrics.moisture !== null) {
    if (metrics.moisture >= 10 && metrics.moisture <= 12) breakdown.push(adjustment('Moisture', `${metrics.moisture}%`, 1, 'Moisture is in the preferred trading band.'));
    else if (metrics.moisture > 14) breakdown.push(adjustment('Moisture', `${metrics.moisture}%`, -4, 'High moisture raises storage and spoilage risk.'));
    else breakdown.push(adjustment('Moisture', `${metrics.moisture}%`, 0, 'Moisture does not change reference pricing.'));
  }

  const grade = String(metrics.grade || '').toUpperCase();
  if (grade) {
    if (grade === 'A+') breakdown.push(adjustment('Verified grade', metrics.grade, 5, 'Top grade receives a buyer premium.'));
    else if (grade === 'A') breakdown.push(adjustment('Verified grade', metrics.grade, 2, 'Grade A supports a modest verified-quality premium.'));
    else if (grade === 'B') breakdown.push(adjustment('Verified grade', metrics.grade, -4, 'Grade B trades below top-grade wool.'));
    else if (grade === 'C') breakdown.push(adjustment('Verified grade', metrics.grade, -10, 'Grade C receives a quality discount.'));
  }

  const totalPercent = breakdown.reduce((sum, item) => sum + item.percent, 0);
  const cappedPercent = Math.max(-18, Math.min(18, totalPercent));
  const adjustedPrice = Number((safeBasePrice * (1 + cappedPercent / 100)).toFixed(2));
  const low = Number((adjustedPrice * 0.96).toFixed(2));
  const high = Number((adjustedPrice * 1.04).toFixed(2));

  return {
    hasVerifiedCertificate: true,
    certificateId: metrics.certificateId,
    basePrice: safeBasePrice,
    metrics,
    breakdown,
    totalAdjustment: Number((adjustedPrice - safeBasePrice).toFixed(2)),
    totalAdjustmentPercent: cappedPercent,
    adjustedPrice,
    fairPriceRange: { low, high },
    explanation: 'Rule-based quality adjustment from verified certificate metrics.',
    confidence: metrics.overallScore !== null ? `Verified certificate score ${metrics.overallScore}/100` : 'Verified certificate metrics'
  };
}

export function compareOfferToQualityReference(offerPricePerKg, qualityPrice) {
  if (!qualityPrice?.hasVerifiedCertificate || !Number.isFinite(Number(offerPricePerKg))) {
    return null;
  }
  const offer = Number(offerPricePerKg);
  const reference = qualityPrice.adjustedPrice;
  const diff = Number((offer - reference).toFixed(2));
  const diffPct = reference > 0 ? Number(((diff / reference) * 100).toFixed(1)) : 0;
  let band = 'near';
  let label = 'Near quality-adjusted reference';
  if (diffPct > 3) {
    band = 'above';
    label = 'Above quality-adjusted reference';
  } else if (diffPct < -3) {
    band = 'below';
    label = 'Below quality-adjusted reference';
  }
  return { band, label, diff, diffPct };
}
