// KhetSetu market intelligence handler.
// This endpoint is intentionally provider-neutral: replace the fixture adapter
// with a live AGMARKNET/processor/FPO data adapter without changing the UI.
const intelligence = {
  updatedAt: '2026-09-08T09:30:00.000Z',
  location: 'Kota, Rajasthan',
  crop: 'Wheat',
  prices: [
    { day: 'Mon', modalPrice: 2140 }, { day: 'Tue', modalPrice: 2170 },
    { day: 'Wed', modalPrice: 2155 }, { day: 'Thu', modalPrice: 2190 },
    { day: 'Fri', modalPrice: 2255 }, { day: 'Sat', modalPrice: 2285 },
    { day: 'Today', modalPrice: 2310 }
  ],
  markets: [
    { name: 'Kota mandi', price: 2190, arrivals: '-12%', demand: 'High', signal: 'Hold 3–5 days' },
    { name: 'Bundi mandi', price: 2145, arrivals: '+8%', demand: 'Medium', signal: 'List selectively' },
    { name: 'Shree Foods', price: 2340, arrivals: 'Direct buyer', demand: 'Very high', signal: 'Best net value', verified: true },
    { name: 'Bharat Harvest', price: 2310, arrivals: 'Direct buyer', demand: 'High', signal: 'Open to offers', verified: true }
  ],
  signal: { title: 'Wheat is gaining momentum.', body: 'Nearby miller demand is rising while mandi arrivals have dropped.', uplift: '₹130–₹190/qtl more', horizon: 'before Friday', outlook: 'Strong', change: 6.2 },
  stats: { bestPrice: 2340, buyerMatches: 8, activeLots: 2, settlementReady: 58600 },
  demand: [
    { buyer: 'Shree Foods Pvt. Ltd.', requirement: 'Wheat · Grade A / FAQ', quantity: '80–120 qtl', price: '₹2,340/qtl', distance: '22 km', verified: true },
    { buyer: 'Kota Mid-Day Meal Consortium', requirement: 'Chickpea · Grade A', quantity: '150–250 qtl', price: '₹6,120/qtl', distance: '12 km', verified: true },
    { buyer: 'Narmada Organics', requirement: 'Mustard · Organic certified', quantity: '40–75 qtl', price: '₹6,480/qtl', distance: '197 km', verified: true }
  ],
  offers: [
    { buyer: 'Shree Foods Pvt. Ltd.', location: 'Kota, Rajasthan', price: '₹2,340', quantity: '80–120 qtl', score: '92%', initials: 'SF', tone: 'orange', payment: 'UPI • 24 hours' },
    { buyer: 'Narmada Organics', location: 'Indore, Madhya Pradesh', price: '₹2,285', quantity: '50–75 qtl', score: '89%', initials: 'NO', tone: 'green', payment: 'Bank transfer • 2 days' },
    { buyer: 'Bharat Harvest Co.', location: 'Jaipur, Rajasthan', price: '₹2,310', quantity: '100+ qtl', score: '86%', initials: 'BH', tone: 'blue', payment: 'UPI • 48 hours' }
  ]
};

export default async function handler(req, res) {
  if (req.method === 'GET') return res.status(200).json({ success: true, data: intelligence });
  if (req.method === 'POST') {
    const body = req.body || {};
    if (!body.crop || !body.quantity || !body.grade) return res.status(400).json({ success: false, message: 'crop, quantity and grade are required' });
    return res.status(201).json({ success: true, data: { lotId: `KS-${Date.now().toString().slice(-5)}`, ...body, status: 'UNDER_REVIEW' } });
  }
  return res.status(405).json({ success: false, message: 'Method not allowed' });
}
