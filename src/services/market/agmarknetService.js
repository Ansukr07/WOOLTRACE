/**
 * WoolTrace Frontend Service for CEDA Agmarknet API
 * Communicates ONLY with the secure Vercel backend proxy (/api/market/*).
 */

const API_BASE = '/api/market';
const CACHE_PREFIX = 'wt_ceda_cache_';
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours for static data

async function fetchApi(endpoint, options = {}, useCache = false) {
  const cacheKey = `${CACHE_PREFIX}${endpoint}_${JSON.stringify(options.body || '')}`;
  
  if (useCache) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL_MS) {
          return data;
        }
      }
    } catch (e) {
      // ignore cache errors
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Accept': 'application/json',
      ...(options.headers || {})
    }
  });

  let rawData;
  try {
    rawData = await res.json();
  } catch (err) {
    throw new Error(`API returned non-JSON response. Status: ${res.status}`);
  }
  if (!res.ok) {
    throw new Error(rawData.error || rawData.message || 'Market Data API Error');
  }

  let finalData = rawData;
  if (rawData.output && rawData.output.data) {
    finalData = rawData.output.data;
  } else if (rawData.commodities) {
    finalData = rawData.commodities;
  }

  if (useCache) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ data: finalData, timestamp: Date.now() }));
    } catch (e) {}
  }

  return finalData;
}

export const agmarknetService = {
  
  /**
   * Get all commodities
   * @returns {Promise<Array<{commodity_id: number, commodity_name: string}>>}
   */
  async getCommodities() {
    return fetchApi('/commodities', {}, true);
  },

  /**
   * Get states/districts for a specific commodity
   * @param {number} commodityId
   * @returns {Promise<Array<any>>}
   */
  async getGeographies(commodityId) {
    return fetchApi(`/geographies?commodity_id=${commodityId}`, {}, true);
  },

  /**
   * Get markets for a specific state (and optionally district)
   * @param {number} commodityId 
   * @param {number} stateId 
   * @param {number} [districtId] 
   */
  async getMarkets(commodityId, stateId, districtId = null) {
    const body = {
      commodity_id: commodityId,
      state_id: stateId,
      indicator: 'price' // Typically required by CEDA
    };
    if (districtId) {
      body.district_id = districtId;
    }

    return fetchApi('/markets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, true);
  },

  /**
   * Get prices
   * @param {number} commodityId 
   * @param {number} stateId 
   * @param {Array<number>} districtIds 
   * @param {Array<number>} marketIds 
   * @param {string} fromDate (YYYY-MM-DD)
   * @param {string} toDate (YYYY-MM-DD)
   */
  async getPrices(commodityId, stateId, districtIds, marketIds, fromDate, toDate) {
    const body = {
      commodity_id: commodityId,
      state_id: stateId,
      from_date: fromDate,
      to_date: toDate
    };
    if (districtIds && districtIds.length) body.district_id = districtIds;
    if (marketIds && marketIds.length) body.market_id = marketIds;

    return fetchApi('/prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  },

  /**
   * Get quantities (arrivals)
   */
  async getQuantities(commodityId, stateId, districtIds, marketIds, fromDate, toDate) {
    const body = {
      commodity_id: commodityId,
      state_id: stateId,
      from_date: fromDate,
      to_date: toDate
    };
    if (districtIds && districtIds.length) body.district_id = districtIds;
    if (marketIds && marketIds.length) body.market_id = marketIds;

    return fetchApi('/quantities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
};

/** Helpers */

export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function getDateOffset(days, baseDate = new Date()) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() - days);
  return d;
}

export function fmtPrice(n) {
  if (n == null || isNaN(n)) return '—';
  return `₹${Number(n).toFixed(0)}`;
}

export function fmtChange(pct) {
  if (pct == null || isNaN(pct)) return '—';
  return `${pct >= 0 ? '+' : ''}${Number(pct).toFixed(1)}%`;
}

export function pctChange(oldVal, newVal) {
  if (!oldVal || isNaN(oldVal) || isNaN(newVal)) return null;
  return ((newVal - oldVal) / oldVal) * 100;
}
