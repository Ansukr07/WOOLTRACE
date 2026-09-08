const fallback = {
  updatedAt: '2026-09-08T09:30:00.000Z', location: 'Kota, Rajasthan', crop: 'Wheat',
  prices: [{day:'Mon',modalPrice:2140},{day:'Tue',modalPrice:2170},{day:'Wed',modalPrice:2155},{day:'Thu',modalPrice:2190},{day:'Fri',modalPrice:2255},{day:'Sat',modalPrice:2285},{day:'Today',modalPrice:2310}],
  signal: { title: 'Wheat is gaining momentum.', body: 'Nearby miller demand is rising while mandi arrivals have dropped.', uplift: '₹130–₹190/qtl more', horizon: 'before Friday', outlook: 'Strong', change: 6.2 },
  stats: { bestPrice: 2340, buyerMatches: 8, activeLots: 2, settlementReady: 58600 }
};

export async function getKhetSetuIntelligence() {
  try {
    const response = await fetch('/api/khetsetu');
    if (!response.ok) throw new Error(`Market API responded ${response.status}`);
    const payload = await response.json();
    return { ...fallback, ...(payload.data || payload) };
  } catch (error) {
    console.warn('KhetSetu market API unavailable; using cached intelligence', error);
    return fallback;
  }
}

export async function createKhetSetuLot(lot) {
  const response = await fetch('/api/khetsetu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lot) });
  if (!response.ok) throw new Error('Unable to create sell lot');
  return (await response.json()).data;
}
