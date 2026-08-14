/**
 * marketService.js — Active provider selector + utility helpers
 *
 * To switch to the real AGMARKNET provider:
 *   change `activeProvider` to `new AgmarknetProvider()`
 */
import { DemoDataProvider } from './DemoDataProvider.js';
// import { AgmarknetProvider } from './AgmarknetProvider.js'; // uncomment when API key is ready

export const activeProvider = new DemoDataProvider();

/** Haversine distance in km */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Format a price number */
export function fmtPrice(n) {
  return `₹${n?.toFixed(0) ?? '—'}`;
}

/** Format change percentage with sign */
export function fmtChange(pct) {
  if (pct == null) return '—';
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`;
}

/** Compute % change between old and new price */
export function pctChange(oldVal, newVal) {
  if (!oldVal) return 0;
  return ((newVal - oldVal) / oldVal) * 100;
}

/** Generate rule-based insights from price records */
export function generateInsights(current, historical30d) {
  if (!current.length || !historical30d.length) return [];
  const insights = [];

  const modal = current[0]?.modalPrice;
  const avg30 = historical30d.reduce((s, r) => s + r.modalPrice, 0) / historical30d.length;
  const oldest7 = historical30d.slice(0, 7);
  const avg7 = oldest7.reduce((s, r) => s + r.modalPrice, 0) / oldest7.length;
  const change7d = pctChange(avg7, modal);
  const change30d = pctChange(avg30, modal);

  const highestMarket = current.reduce((a, b) => a.modalPrice > b.modalPrice ? a : b);

  if (change7d > 5) {
    insights.push({ icon: '📈', text: `Current market price has increased ${change7d.toFixed(1)}% over the last 7 days.`, positive: true });
  } else if (change7d < -3) {
    insights.push({ icon: '📉', text: `Current market price has declined ${Math.abs(change7d).toFixed(1)}% over the last 7 days.`, positive: false });
  } else {
    insights.push({ icon: '➡️', text: `Price has been relatively stable over the last 7 days (${fmtChange(change7d)}).`, positive: null });
  }

  if (modal > avg30) {
    insights.push({ icon: '💡', text: `Current modal price is ${change30d.toFixed(1)}% above the 30-day average (${fmtPrice(avg30)}/kg).`, positive: true });
  } else {
    insights.push({ icon: '💡', text: `Current modal price is ${Math.abs(change30d).toFixed(1)}% below the 30-day average (${fmtPrice(avg30)}/kg).`, positive: false });
  }

  if (highestMarket.market !== current[current.length - 1]?.market) {
    insights.push({ icon: '🗺️', text: `${highestMarket.market} (${highestMarket.state}) is currently reporting the highest modal price at ${fmtPrice(highestMarket.modalPrice)}/kg.`, positive: null });
  }

  insights.push({
    icon: '⚠️',
    text: 'This data is for market awareness only. Actual transaction prices depend on wool quality, buyer negotiations, and local market conditions.',
    positive: null,
  });

  return insights;
}
