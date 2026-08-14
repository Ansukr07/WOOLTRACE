/**
 * DemoDataProvider
 *
 * ⚠ DEMO DATA — Not real market prices.
 * Generates realistic, deterministic wool market data for development and SIH demonstration.
 * Every price figure is clearly labeled in the UI as demo data.
 *
 * Based on publicly available historical AGMARKNET wool price ranges (₹/quintal ÷ 100 = ₹/kg).
 * Realistic ranges: Fine ~₹5–8/kg, Medium ~₹3.5–5.5/kg, Coarse ~₹2.5–4/kg
 * Note: Indian mandi wool prices are low because most trade is in raw unwashed fleece.
 */
import { MarketDataProvider } from './MarketDataProvider.js';

// Major Indian wool trading markets with real coordinates
const WOOL_MARKETS = [
  { market: 'Bikaner',   district: 'Bikaner',   state: 'Rajasthan',         lat: 28.0229, lng: 73.3119, basePrice: 480, arrivals: 52 },
  { market: 'Jaipur',    district: 'Jaipur',    state: 'Rajasthan',         lat: 26.9124, lng: 75.7873, basePrice: 460, arrivals: 38 },
  { market: 'Jodhpur',   district: 'Jodhpur',   state: 'Rajasthan',         lat: 26.2389, lng: 73.0243, basePrice: 450, arrivals: 29 },
  { market: 'Shimla',    district: 'Shimla',    state: 'Himachal Pradesh',  lat: 31.1048, lng: 77.1734, basePrice: 510, arrivals: 18 },
  { market: 'Srinagar',  district: 'Srinagar',  state: 'Jammu & Kashmir',   lat: 34.0837, lng: 74.7973, basePrice: 540, arrivals: 24 },
  { market: 'Mysuru',    district: 'Mysuru',    state: 'Karnataka',         lat: 12.2958, lng: 76.6394, basePrice: 350, arrivals: 12 },
  { market: 'Pune',      district: 'Pune',      state: 'Maharashtra',       lat: 18.5204, lng: 73.8567, basePrice: 370, arrivals: 15 },
];

const VARIETIES = {
  Fine:   { multiplier: 1.4, grade: 'A' },
  Medium: { multiplier: 1.0, grade: 'B' },
  Coarse: { multiplier: 0.7, grade: 'C' },
};

// Pseudo-random but deterministic — same seed = same data every run
function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function priceForDay(base, dayOffset, marketIndex) {
  const trend = 1 + dayOffset * 0.0015;          // gentle upward trend
  const noise = (seededRand(dayOffset * 31 + marketIndex * 7) - 0.5) * 0.06;
  return Math.round(base * trend * (1 + noise));
}

function buildRecord(mkt, variety, dayOffset) {
  const v = VARIETIES[variety];
  const base = mkt.basePrice * v.multiplier;
  const modal = priceForDay(base, dayOffset, WOOL_MARKETS.indexOf(mkt));
  const spread = Math.round(modal * 0.08);
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  return {
    date: date.toISOString().split('T')[0],
    state: mkt.state,
    district: mkt.district,
    market: mkt.market,
    commodity: 'Wool',
    variety,
    grade: v.grade,
    minPrice: modal - spread,
    maxPrice: modal + spread,
    modalPrice: modal,
    arrivalQty: parseFloat(
      (mkt.arrivals * (0.8 + seededRand(dayOffset * 13 + WOOL_MARKETS.indexOf(mkt)) * 0.4)).toFixed(1)
    ),
    lat: mkt.lat,
    lng: mkt.lng,
  };
}

export class DemoDataProvider extends MarketDataProvider {
  getMeta() {
    return {
      name: 'Demo Data Provider',
      isDemo: true,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getCurrentPrices({ variety = 'Medium' } = {}) {
    await new Promise(r => setTimeout(r, 600)); // simulate network
    return WOOL_MARKETS.map(mkt => buildRecord(mkt, variety, 0));
  }

  async getHistoricalPrices(market, days = 30, variety = 'Medium') {
    await new Promise(r => setTimeout(r, 400));
    const mkt = WOOL_MARKETS.find(m => m.market === market) || WOOL_MARKETS[5];
    return Array.from({ length: days }, (_, i) => buildRecord(mkt, variety, days - 1 - i));
  }

  async getArrivals(market, days = 30) {
    await new Promise(r => setTimeout(r, 300));
    const mkt = WOOL_MARKETS.find(m => m.market === market) || WOOL_MARKETS[5];
    return Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      return {
        date: d.toISOString().split('T')[0],
        market: mkt.market,
        arrivalQty: parseFloat(
          (mkt.arrivals * (0.7 + seededRand(i * 17 + WOOL_MARKETS.indexOf(mkt)) * 0.6)).toFixed(1)
        ),
      };
    });
  }

  async getNews() {
    await new Promise(r => setTimeout(r, 200));
    return [
      {
        headline: 'Rajasthan Wool Prices Rise 8% Ahead of Winter Season',
        summary: 'Markets in Bikaner and Jaipur recorded strong demand as textile mills stockpile for winter production. Medium wool prices touched ₹480/kg at some mandis.',
        source: 'AgriMarket Weekly (Demo)',
        date: '2026-08-12',
        category: 'Wool Prices',
      },
      {
        headline: 'Government Extends Wool Grading Subsidy for Small Farmers',
        summary: 'The Ministry of Agriculture has extended the wool grading certification subsidy scheme for farmers producing under 500 kg per year.',
        source: 'PIB India (Demo)',
        date: '2026-08-10',
        category: 'Government Schemes',
      },
      {
        headline: 'Indian Wool Export Value Grows 12% in Q2 FY2026–27',
        summary: 'India exported wool worth ₹1,240 crore in Q2, driven by demand from European textile importers for Pashmina and fine wool blends.',
        source: 'DGCI&S Data (Demo)',
        date: '2026-08-08',
        category: 'Export/Import',
      },
      {
        headline: 'Central Wool Development Board Launches Digital Traceability Push',
        summary: 'The CWDB has announced a partnership with state governments to digitize wool batch records, linking farm-level data with processing units.',
        source: 'CWDB Press Release (Demo)',
        date: '2026-08-05',
        category: 'Industry News',
      },
    ];
  }
}
