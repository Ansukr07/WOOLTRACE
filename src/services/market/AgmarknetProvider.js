/**
 * AgmarknetProvider — STUB
 *
 * Ready to be wired to the CEDA Ashoka API (api.ceda.ashoka.edu.in/v1/agmarknet)
 * or a Vercel backend proxy that holds the API key securely.
 *
 * To activate:
 * 1. Register at https://api.ceda.ashoka.edu.in and obtain an API key.
 * 2. Add to .env: VITE_MARKET_API_KEY=your_key_here
 * 3. Create /api/market-prices.js Vercel function to proxy CEDA (avoids CORS + hides key).
 * 4. Replace the throw statements below with real fetch calls.
 * 5. In marketService.js, switch activeProvider to AgmarknetProvider.
 *
 * AGMARKNET notes:
 * - Prices are in ₹/quintal. Divide by 100 to convert to ₹/kg.
 * - Wool commodity IDs (approximate, verify via /agmarknet/commodities):
 *     Wool (general) — search for "Wool" in the commodities list.
 *     Fine Wool, Medium Wool, Coarse Wool may appear as separate varieties.
 * - Data is updated daily, usually by 10 AM IST.
 * - Historical data available from 2005 onwards.
 */
import { MarketDataProvider } from './MarketDataProvider.js';

const PROXY_BASE = '/api/market'; // Vercel serverless proxy

export class AgmarknetProvider extends MarketDataProvider {
  getMeta() {
    return {
      name: 'AGMARKNET (via CEDA API)',
      isDemo: false,
      lastUpdated: null, // populated after first successful fetch
    };
  }

  async getCurrentPrices({ variety = 'Medium', state, market } = {}) {
    // TODO: implement after API key is available
    // const res = await fetch(`${PROXY_BASE}/prices?commodity=Wool&variety=${variety}&state=${state || ''}`);
    // const data = await res.json();
    // return this._normalize(data);
    throw new Error('AgmarknetProvider: API key not configured. See AgmarknetProvider.js for setup instructions.');
  }

  async getHistoricalPrices(market, days = 30, variety = 'Medium') {
    // TODO: implement
    throw new Error('AgmarknetProvider: not yet configured.');
  }

  async getArrivals(market, days = 30) {
    // TODO: implement
    throw new Error('AgmarknetProvider: not yet configured.');
  }

  async getNews() {
    throw new Error('AgmarknetProvider: news source not configured.');
  }

  /** Convert AGMARKNET response shape → WoolTrace normalized MarketRecord */
  _normalize(records) {
    return records.map(r => ({
      date: r.date,
      state: r.state,
      district: r.district,
      market: r.market,
      commodity: 'Wool',
      variety: r.variety || 'Mixed',
      grade: r.grade || 'Unknown',
      minPrice: parseFloat(r.minPrice) / 100,     // quintal → kg
      maxPrice: parseFloat(r.maxPrice) / 100,
      modalPrice: parseFloat(r.modalPrice) / 100,
      arrivalQty: parseFloat(r.arrivalQty) || 0,
      lat: r.lat || null,
      lng: r.lng || null,
    }));
  }
}
